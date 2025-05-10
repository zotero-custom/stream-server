var os = require("os");

// Helper functions to parse environment variables
const parseBoolean = (value, defaultValue) => {
    if (value === undefined || value === null) return defaultValue;
    return value.toLowerCase() === 'true';
};

const parseInteger = (value, defaultValue) => {
    if (value === undefined || value === null) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
};

// Default config
var config = {
    dev: parseBoolean(process.env.DEV_MODE, false),
    logLevel: process.env.LOG_LEVEL || 'info',
    hostname: process.env.HOSTNAME || os.hostname().split('.')[0],
    httpPort: parseInteger(process.env.HTTP_PORT, 8080),
    proxyProtocol: false,
    https: parseBoolean(process.env.USE_HTTPS, false),
    trustedProxies: [],
    statusInterval: 10,
    keepaliveInterval: 25,
    retryTime: 10,
    redis: {
        host: process.env.REDIS_HOST || 'redis',
        url: process.env.REDIS_URL || 'redis://redis:6379/0',
        prefix: ''
    },
    apiURL: process.env.API_URL || 'http://dataserver/',
    apiVersion: parseInteger(process.env.API_VERSION, 3),
    apiRequestHeaders: {},
    globalTopics: [
        'styles',
        'translators'
    ],
    // Minimum delay before clients should act on global topic notifications -- since these are triggered
    // by webhooks or other queued notifications, they need time to be processed elsewhere
    globalTopicsMinDelay: 60 * 1000,
    // Notification action period -- clients are given a randomly chosen delay within this time
    // period before they should act upon the notification, so that we don't DDoS ourselves
    globalTopicsDelayPeriod: 1800 * 1000,
    defaultDelay: 3 * 1000,
    continuedDelay: 30 * 1000,
    notContinuedDelay: 250,
    statsD: {
        host: ''
    }
};

module.exports = config;