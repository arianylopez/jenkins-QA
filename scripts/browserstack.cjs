const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const envFile = process.env.BROWSERSTACK_ENV_FILE || path.join(root, '.env');
if (fs.existsSync(envFile)) {
    if (typeof process.loadEnvFile !== 'function') throw new Error('Usa Node.js 22.15 o posterior.');
    process.loadEnvFile(envFile);
}

function credentials() {
    const user = process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME;
    const key = process.env.BROWSERSTACK_KEY || process.env.BROWSERSTACK_ACCESS_KEY;
    if (!user || !key || user.includes('REEMPLAZAR') || key.includes('REEMPLAZAR')) throw new Error('Faltan credenciales reales BROWSERSTACK_USER y BROWSERSTACK_KEY en el entorno o .env.');
    return { user, key };
}

function redact(value) {
    let result = String(value);
    const values = [process.env.BROWSERSTACK_KEY, process.env.BROWSERSTACK_ACCESS_KEY, process.env.BROWSERSTACK_USER, process.env.BROWSERSTACK_USERNAME];
    for (const secret of values.filter(Boolean)) result = result.split(secret).join('[omitido]');
    return result;
}

async function api(route, options = {}) {
    const { user, key } = credentials();
    const response = await fetch(`https://api-cloud.browserstack.com${route}`, {
        ...options,
        headers: { ...options.headers, Authorization: `Basic ${Buffer.from(`${user}:${key}`).toString('base64')}` },
        signal: AbortSignal.timeout(120000),
    });
    const body = await response.text();
    if (!response.ok) throw new Error(`BrowserStack HTTP ${response.status}: ${redact(body).slice(0, 2000)}`);
    try { return JSON.parse(body); } catch { throw new Error(`Respuesta inesperada de BrowserStack (HTTP ${response.status}).`); }
}

async function check() {
    const devices = await api('/app-automate/devices.json');
    if (!Array.isArray(devices) || devices.length === 0) throw new Error('BrowserStack no devolvio dispositivos disponibles.');
    console.log(`Credenciales aceptadas por App Automate. Catalogo: ${devices.length} dispositivos.`);
    const name = process.env.BROWSERSTACK_DEVICE;
    const version = process.env.BROWSERSTACK_OS_VERSION;
    if (name && version) {
        const matches = devices.filter(d => d.device === name && Number(d.os_version) === Number(version));
        if (!matches.length) throw new Error(`La combinacion ${name} / Android ${version} no aparece en el catalogo. Usa el generador de capacidades de tu cuenta.`);
        console.log(`Dispositivo encontrado: ${name}, Android ${version}.`);
    } else {
        const android = devices.filter(d => String(d.os).toLowerCase() === 'android').slice(0, 5);
        console.log('Ejemplos del catalogo Android:', android.map(d => `${d.device} / ${d.os_version}`).join('; '));
    }
    console.log('Esta comprobacion no inicia sesiones ni ejecuta escenarios.');
}

async function upload() {
    const form = new FormData();
    if (process.env.APK_URL) {
        const url = new URL(process.env.APK_URL);
        if (url.protocol !== 'https:') throw new Error('APK_URL debe ser una URL HTTPS publica de descarga directa.');
        form.set('url', url.href);
    } else {
        const apkPath = process.env.APK_PATH;
        if (!apkPath) throw new Error('Define APK_PATH con la ruta de tu APK, o APK_URL con su URL de descarga directa.');
        const resolved = path.resolve(root, apkPath);
        if (!fs.existsSync(resolved)) throw new Error('No existe el archivo indicado por APK_PATH.');
        form.set('file', new Blob([fs.readFileSync(resolved)], { type: 'application/vnd.android.package-archive' }), path.basename(resolved));
    }
    const result = await api('/app-automate/upload', { method: 'POST', body: form });
    if (typeof result.app_url !== 'string' || !result.app_url.startsWith('bs://')) throw new Error('La carga no devolvio un app_url valido.');
    const reportDir = path.join(root, 'reports', 'browserstack');
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, 'app.json'), JSON.stringify({ app_url: result.app_url }, null, 2));
    console.log(`Carga aceptada. BROWSERSTACK_APP=${result.app_url}`);
}

function appId() {
    let value = process.env.BROWSERSTACK_APP;
    const reference = path.join(root, 'reports', 'browserstack', 'app.json');
    if (!value && fs.existsSync(reference)) value = JSON.parse(fs.readFileSync(reference, 'utf8')).app_url;
    if (!value || !value.startsWith('bs://')) throw new Error('Falta un BROWSERSTACK_APP aceptado por BrowserStack. Ejecuta primero npm run upload:browserstack o proporciona un identificador bs:// valido.');
    return value;
}

module.exports = { root, credentials, appId };
if (require.main === module) {
    const action = process.argv[2];
    const operation = action === 'check' ? check : action === 'upload' ? upload : null;
    if (!operation) { console.error('Usa: node scripts/browserstack.cjs check|upload'); process.exitCode = 1; }
    else operation().catch(error => { console.error(redact(error.message)); process.exitCode = 1; });
}
