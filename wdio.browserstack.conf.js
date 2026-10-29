const fs = require('node:fs');
const path = require('node:path');
const { root, credentials, appId } = require('./scripts/browserstack.cjs');
const { user, key } = credentials();
const device = process.env.BROWSERSTACK_DEVICE;
const osVersion = process.env.BROWSERSTACK_OS_VERSION;
if (!device || !osVersion) throw new Error('Define BROWSERSTACK_DEVICE y BROWSERSTACK_OS_VERSION usando una combinacion del catalogo de BrowserStack.');
const outputDir = path.join(root, 'allure-results', 'browserstack');

exports.config = {
    runner: 'local',
    protocol: 'https',
    hostname: 'hub.browserstack.com',
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
        'appium:app': appId(),
        'appium:appPackage': 'com.google.android.deskclock',
        'appium:appActivity': 'com.android.deskclock.DeskClock',
        'appium:autoGrantPermissions': true,
        'bstack:options': {
            projectName: 'UCB QA 2',
            buildName: process.env.BROWSERSTACK_BUILD_NAME || 'Clock - Jenkins',
            sessionName: 'Clock - alarmas',
            debug: true,
        },
    }],
    services: [['browserstack', { browserstackLocal: false, testObservability: false }]],
    logLevel: 'warn',
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 1,
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
        tagExpression: process.env.MOBILE_TAGS || '@addAlarm or @cancelAlarm',
        timeout: 60000,
        ignoreUndefinedDefinitions: false,
    },
    onPrepare() {
        fs.rmSync(outputDir, { recursive: true, force: true });
        fs.mkdirSync(outputDir, { recursive: true });
    },
    before() {
        console.log(`Sesion remota BrowserStack: ${browser.sessionId}`);
    },
    async afterScenario(world, result) {
        if (!result.passed) await browser.takeScreenshot();
    },
    onComplete() {
        const results = fs.existsSync(outputDir) ? fs.readdirSync(outputDir).filter(name => name.endsWith('-result.json')) : [];
        if (!results.length) throw new Error('No se generaron resultados de escenarios. La ejecucion no se considera correcta.');
    },
};
