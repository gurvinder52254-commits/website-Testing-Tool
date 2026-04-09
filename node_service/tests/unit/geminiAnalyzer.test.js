const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// Mock dependencies
const mockFs = {
    readFileSync: (path) => Buffer.from('fake-image-data'),
};

const mockGoogleGenerativeAI = class {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    getGenerativeModel() {
        return {
            generateContent: async (args) => {
                if (process.env.TEST_TRIGGER_ERROR === 'true') {
                    throw new Error('AI Analysis Error');
                }
                if (process.env.TEST_TRIGGER_INVALID_JSON === 'true') {
                    return {
                        response: {
                            text: () => 'Invalid JSON'
                        }
                    };
                }
                return {
                    response: {
                        text: () => JSON.stringify({
                            overallScore: 85,
                            summary: 'Good page'
                        })
                    }
                };
            }
        };
    }
};

// Setup require cache mocks
const aiPath = path.resolve(__dirname, '../../node_modules/@google/generative-ai/index.js');
require.cache[aiPath] = {
    id: aiPath,
    filename: aiPath,
    loaded: true,
    exports: { GoogleGenerativeAI: mockGoogleGenerativeAI }
};

require.cache[require.resolve('fs')] = {
    exports: { ...fs, readFileSync: mockFs.readFileSync }
};

const { analyzeScreenshot, initializeGemini } = require('../../geminiAnalyzer');

test('analyzeScreenshot error handling', async (t) => {
    await t.test('returns default analysis on AI error', async () => {
        process.env.GEMINI_API_KEY = 'fake-key';
        process.env.TEST_TRIGGER_ERROR = 'true';
        process.env.TEST_TRIGGER_INVALID_JSON = 'false';
        initializeGemini();

        const result = await analyzeScreenshot('fake.png', 'http://example.com', 'Title');

        assert.strictEqual(result.overallScore, 0);
        assert.ok(result.error.includes('AI Analysis Error'));
        assert.ok(result.summary.includes('AI Analysis Error'));
    });

    await t.test('returns default analysis on invalid JSON response', async () => {
        process.env.GEMINI_API_KEY = 'fake-key';
        process.env.TEST_TRIGGER_ERROR = 'false';
        process.env.TEST_TRIGGER_INVALID_JSON = 'true';
        initializeGemini();

        const result = await analyzeScreenshot('fake.png', 'http://example.com', 'Title');

        assert.strictEqual(result.overallScore, 0);
        assert.ok(result.error);
        assert.ok(result.summary.includes('Analysis could not be completed'));
    });

    await t.test('returns correct analysis on success', async () => {
        process.env.GEMINI_API_KEY = 'fake-key';
        process.env.TEST_TRIGGER_ERROR = 'false';
        process.env.TEST_TRIGGER_INVALID_JSON = 'false';
        initializeGemini();

        const result = await analyzeScreenshot('fake.png', 'http://example.com', 'Title');

        assert.strictEqual(result.overallScore, 85);
        assert.strictEqual(result.summary, 'Good page');
    });
});
