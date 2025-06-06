const crypto = require('crypto');

if (!process.env.CRYPTO_KEY || !process.env.CRYPTO_IV) {
    throw new Error('CRYPTO_KEY o CRYPTO_IV no están definidas en las variables de entorno');
}

const keyValue = process.env.CRYPTO_KEY;
const ivValue = process.env.CRYPTO_IV;

const algorithm = 'aes-256-cbc';
const key = Buffer.from(keyValue, "hex"); // 32 bytes
const iv = Buffer.from(ivValue, "hex"); // 16 bytes para IV

function encriptar(numero) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(numero.toString(), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function desencriptar(encrypted) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function valueNumber() {
    const value = crypto.randomBytes(16).toString('hex');
    return value;
}

function seedGenerator() {
    const fecha = Date.now(); // milisegundos desde 1970
    const aleatorio = crypto.randomBytes(8).toString('hex');
    return `${fecha}-${aleatorio}`;
}

function createSessionUid() {
    const fecha = Date.now(); // milisegundos desde 1970
    const aleatorio = crypto.randomBytes(8).toString('hex');
    return `${fecha}-${aleatorio}`;
}

function sessionUidIsValid(sessionUid) {
    if (!sessionUid) return false;
    const [timestamp] = sessionUid.split('-');
    const now = Date.now();
    const cincoMin = 5 * 60 * 1000; // 5 minutos en ms
    return now - Number(timestamp) < cincoMin;
}

module.exports = {
    encriptar,
    desencriptar,
    valueNumber,
    seedGenerator,
    createSessionUid,
    sessionUidIsValid
};