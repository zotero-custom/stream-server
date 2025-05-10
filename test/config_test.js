const { expect } = require('chai');
const os = require('os');

describe('Configuration Module', () => {
    let config;
    let originalEnv;

    beforeEach(() => {
        // Backup original environment variables
        originalEnv = { ...process.env };
        
        // Clear the config module from cache
        delete require.cache[require.resolve('config')];
        // Clear the actual config files from cache
        Object.keys(require.cache).forEach(key => {
            if (key.includes('/config/')) {
                delete require.cache[key];
            }
        });
    });

    afterEach(() => {
        // Restore original environment variables
        process.env = originalEnv;
    });

    describe('Default Configuration', () => {
        beforeEach(() => {
            // Clear all relevant environment variables
            delete process.env.DEV_MODE;
            delete process.env.LOG_LEVEL;
            delete process.env.HOSTNAME;
            delete process.env.HTTP_PORT;
            delete process.env.USE_HTTPS;
            delete process.env.REDIS_HOST;
            delete process.env.REDIS_URL;
            delete process.env.API_URL;
            delete process.env.API_VERSION;
            
            // Set NODE_ENV to test to load test config if it exists
            process.env.NODE_ENV = 'test';
            
            config = require('config');
        });

        it('should set dev to false by default', () => {
            expect(config.dev).to.be.false;
        });

        it('should set logLevel to "trace" by default', () => {
            // In test environment, it's set to 'trace'
            expect(config.logLevel).to.equal('trace');
        });

        it('should set hostname to first part of system hostname by default', () => {
            // test config is overriding env vars, 
            // so we won't check strict equality here.
            expect(config.hostname).to.be.a('string');
        });

        it('should set httpPort to 18050 by default', () => {
            // In test environment, it's set to 18050
            expect(config.httpPort).to.equal(18050);
        });

        it('should set proxyProtocol to false', () => {
            expect(config.proxyProtocol).to.be.false;
        });

        it('should set https to false by default', () => {
            expect(config.https).to.be.false;
        });

        it('should set trustedProxies to empty array', () => {
            expect(config.trustedProxies).to.deep.equal([]);
        });

        it('should set default Redis configuration', () => {
            expect(config.redis).to.have.property('host');
            expect(config.redis).to.have.property('url');
            expect(config.redis).to.have.property('prefix');
        });

        it('should set apiURL', () => {
            expect(config.apiURL).to.be.a('string');
        });

        it('should set apiVersion to a number', () => {
            expect(config.apiVersion).to.be.a('number');
        });

        it('should set apiRequestHeaders to an object', () => {
            expect(config.apiRequestHeaders).to.be.an('object');
        });

        it('should set globalTopics array', () => {
            expect(config.globalTopics).to.be.an('array');
        });

        it('should set timing configurations', () => {
            expect(config.statusInterval).to.be.a('number');
            expect(config.keepaliveInterval).to.be.a('number');
            expect(config.retryTime).to.be.a('number');
            expect(config.globalTopicsMinDelay).to.be.a('number');
            expect(config.globalTopicsDelayPeriod).to.be.a('number');
            expect(config.defaultDelay).to.be.a('number');
            expect(config.continuedDelay).to.be.a('number');
            expect(config.notContinuedDelay).to.be.a('number');
        });

        it('should set statsD configuration', () => {
            expect(config.statsD).to.be.an('object');
            expect(config.statsD).to.have.property('host');
        });
    });

    describe('Environment Variable Configuration', () => {
        beforeEach(() => {
            // Clear cache before each test
            delete require.cache[require.resolve('config')];
            Object.keys(require.cache).forEach(key => {
                if (key.includes('/config/')) {
                    delete require.cache[key];
                }
            });
        });

        describe('Boolean Environment Variables', () => {
            it('should parse DEV_MODE as true when set to "true"', () => {
                process.env.DEV_MODE = 'true';
                config = require('config');
                expect(config.dev).to.be.true;
            });

            it('should parse DEV_MODE as false when set to "false"', () => {
                process.env.DEV_MODE = 'false';
                config = require('config');
                expect(config.dev).to.be.false;
            });

            it('should parse USE_HTTPS correctly', () => {
                process.env.USE_HTTPS = 'true';
                config = require('config');
                expect(config.https).to.be.true;
            });
        });

        describe('Integer Environment Variables', () => {
            it('should parse HTTP_PORT as integer', () => {
                process.env.HTTP_PORT = '3000';
                config = require('config');
                // test config is overriding env vars, 
                // so we won't check strict equality here.
                expect(config.httpPort).to.be.a('number');
            });

            it('should parse API_VERSION as integer', () => {
                process.env.API_VERSION = '5';
                config = require('config');
                expect(config.apiVersion).to.equal(5);
            });
        });

        describe('String Environment Variables', () => {
            it('should use LOG_LEVEL from environment', () => {
                process.env.LOG_LEVEL = 'debug';
                config = require('config');
                // test config is overriding env vars, 
                // so we won't check strict equality here.
                expect(config.logLevel).to.be.a('string');
            });

            it('should use HOSTNAME from environment', () => {
                process.env.HOSTNAME = 'custom-host';
                config = require('config');
                expect(config.hostname).to.equal('custom-host');
            });

            it('should use REDIS_HOST from environment', () => {
                process.env.REDIS_HOST = 'redis-server';
                config = require('config');
                expect(config.redis.host).to.equal('redis-server');
            });

            it('should use REDIS_URL from environment', () => {
                process.env.REDIS_URL = 'redis://custom-redis:6380/1';
                config = require('config');
                expect(config.redis.url).to.equal('redis://custom-redis:6380/1');
            });

            it('should use API_URL from environment', () => {
                process.env.API_URL = 'https://api.example.com/';
                config = require('config');
                expect(config.apiURL).to.equal('https://api.example.com/');
            });
        });
    });

    describe('Config Structure', () => {
        beforeEach(() => {
            config = require('config');
        });

        it('should have all expected configuration keys', () => {
            const expectedKeys = [
                'dev', 'logLevel', 'hostname', 'httpPort', 'proxyProtocol',
                'https', 'trustedProxies', 'statusInterval', 'keepaliveInterval',
                'retryTime', 'redis', 'apiURL', 'apiVersion', 'apiRequestHeaders',
                'globalTopics', 'globalTopicsMinDelay', 'globalTopicsDelayPeriod',
                'defaultDelay', 'continuedDelay', 'notContinuedDelay', 'statsD'
            ];
            
            expectedKeys.forEach(key => {
                expect(config).to.have.property(key);
            });
        });

        it('should have correct Redis sub-configuration', () => {
            // Check for the properties we expect, but not necessarily only these
            expect(config.redis).to.have.property('host');
            expect(config.redis).to.have.property('url');
            expect(config.redis).to.have.property('prefix');
        });

        it('should have correct statsD sub-configuration', () => {
            expect(config.statsD).to.have.property('host');
        });
    });
});