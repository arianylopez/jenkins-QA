const fs = require('node:fs');
const path = require('node:path');
const { root, credentials } = require('./scripts/browserstack.cjs');
const { user, key } = credentials();
const device = process.env.BROWSERSTACK_DEVICE;
const osVersion = process.env.BROWSERSTACK_OS_VERSION;
const starterApp = process.env.BROWSERSTACK_STARTER_APP;
if (!device || !osVersion) throw new Error('Define BROWSERSTACK_DEVICE y BROWSERSTACK_OS_VERSION. Combinacion comprobada: Google Pixel 7 / 13.0.');
if (!starterApp || !/^bs:\/\/[a-f0-9]{40}$/i.test(starterApp)) throw new Error('Define BROWSERSTACK_STARTER_APP con el bs:// de la app de ejemplo aceptada.');
const clockPackage = 'com.google.android.deskclock';
const outputDir = path.join(root, 'allure-results', 'browserstack');
const evidenceDir = path.join(root, 'reports', 'browserstack');

exports.config = {
    runner: 'local',
    protocol: 'https',
    hostname: 'hub-cloud.browserstack.com',
    port: 443,
    path: '/wd/hub',
    user,
    key,
    specs: [path.join(root, 'features', 'alarma.feature')],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': device,
        'appium:platformVersion': osVersion,
        'appium:automationName': 'UiAutomator2',
        // Esta app inicia la sesion. El hook before abre y comprueba Google Clock.
        'appium:app': starterApp,
        'appium:autoGrantPermissions': true,
        'bstack:options': {
            projectName: 'UCB QA 2',
            buildName: process.env.BROWSERSTACK_BUILD_NAME || 'Clock - Jenkins',
            sessionName: 'Google Clock - crear y cancelar alarmas',
            debug: true,
        },
    }],
    services: [['browserstack', { browserstackLocal: false, testObservability: false }]],
    logLevel: 'warn',
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 0,
    framework: 'cucumber',
    reporters: ['spec', ['allure', {
        outputDir,
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: true,
    }]],
    cucumberOpts: {
        require: [path.join(root, 'features', 'step_definitions', 'alarmStep.js')],
        strict: true,
        dryRun: false,
        tags: process.env.MOBILE_TAGS || '@addAlarm or @cancelAlarm',
        timeout: 60000,
        ignoreUndefinedDefinitions: false,
    },
    onPrepare() {
        fs.rmSync(outputDir, { recursive: true, force: true });
        fs.mkdirSync(outputDir, { recursive: true });
        fs.mkdirSync(evidenceDir, { recursive: true });
    },
    async before() {
        console.log(`Sesion remota BrowserStack: ${browser.sessionId}`);
        // Clock genera eventos frecuentes. Evitar la espera interna de UiAutomator2
        // antes de cada busqueda; los page objects mantienen sus esperas explicitas.
        await browser.updateSettings({ waitForIdleTimeout: 0, waitForSelectorTimeout: 0 });
        const settings = await browser.getSettings();
        if (Number(settings.waitForIdleTimeout) !== 0 || Number(settings.waitForSelectorTimeout) !== 0) {
            throw new Error('UiAutomator2 no aplico las esperas configuradas. Revisa los ajustes de la sesion.');
        }
        console.log('UIAUTOMATOR_READY: waitForIdleTimeout=0, waitForSelectorTimeout=0; se conservan las esperas explicitas de elementos.');
        if (!await browser.isAppInstalled(clockPackage)) {
            throw new Error('Google Clock no esta instalado en este dispositivo. No se ejecutaran pruebas sobre la app de ejemplo.');
        }
        await browser.setOrientation('PORTRAIT');
        await browser.activateApp(clockPackage);
        await browser.waitUntil(async () => Number(await browser.queryAppState(clockPackage)) === 4, {
            timeout: 20000,
            interval: 1000,
            timeoutMsg: 'Google Clock no llego al primer plano.',
        });
        const source = await browser.getPageSource();
        fs.mkdirSync(evidenceDir, { recursive: true });
        fs.writeFileSync(path.join(evidenceDir, 'clock-open.xml'), source);
        if (!source.includes(`package="${clockPackage}"`)) {
            throw new Error('La interfaz visible no confirma Google Clock. Consulta clock-open.xml y la sesion remota.');
        }
        await browser.saveScreenshot(path.join(evidenceDir, 'clock-open.png'));
        fs.writeFileSync(path.join(evidenceDir, 'clock-session.json'), JSON.stringify({
            verified: true,
            expectedPackage: clockPackage,
            device,
            android: osVersion,
            sessionId: browser.sessionId,
            starterApp,
            waitForIdleTimeout: settings.waitForIdleTimeout,
            waitForSelectorTimeout: settings.waitForSelectorTimeout,
        }, null, 2));
        console.log('CLOCK_REMOTE_VERIFIED: Google Clock abierto. A continuacion se ejecutan los escenarios Cucumber.');
    },
    async afterScenario(world, result) {
        if (!result.passed) {
            // Conservar el fallo original aunque la sesion ya se haya cerrado.
            try {
                const suffix = Date.now();
                fs.mkdirSync(evidenceDir, { recursive: true });
                await browser.saveScreenshot(path.join(evidenceDir, `failed-${suffix}.png`));
                fs.writeFileSync(path.join(evidenceDir, `failed-${suffix}.xml`), await browser.getPageSource());
            } catch (error) {
                console.warn('No se pudo guardar toda la evidencia del escenario fallido.');
            }
        }
    },
    onComplete() {
        const results = fs.existsSync(outputDir) ? fs.readdirSync(outputDir).filter(name => name.endsWith('-result.json')) : [];
        if (!results.length) throw new Error('No se generaron resultados de escenarios. La ejecucion no se considera correcta.');
    },
};
