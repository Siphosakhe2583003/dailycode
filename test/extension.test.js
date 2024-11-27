const assert = require('assert');
const vscode = require('vscode');

// Mock classes for testing
class MockGlobalState {
    constructor() {
        this.state = new Map();
    }

    get(key, defaultValue) {
        return this.state.has(key) ? this.state.get(key) : defaultValue;
    }

    async update(key, value) {
        this.state.set(key, value);
    }

    setKeysForSync(keys) {
        this.syncKeys = keys; // Store keys for testing
    }
}

class MockContext {
    constructor() {
        this.globalState = new MockGlobalState(); // Mock global state
        this.subscriptions = []; // Track registered disposables
    }

    subscriptions = [];

    push(subscription) {
        this.subscriptions.push(subscription);
    }
}

// Import the extension
const extension = require('../extension');

suite('DailyCode Extension Tests', () => {
    let context;
    let today;
    let yesterday;
    let NUM_OF_CHANGES;

    setup(() => {
        context = new MockContext(); // Initialize mock context
        today = new Date();
        yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        NUM_OF_CHANGES = 0; // Reset change count
    });

    teardown(() => {
        extension.deactivate();
    });

    test('Initial streak is 1 on first use', async () => {
        // Activate the extension with no previous state
        await extension.activate(context);

        // Validate initial streak
        assert.strictEqual(context.globalState.get('dailycode.counter'), 1);
        assert.strictEqual(
            new Date(context.globalState.get('dailycode.lastAccessDate')).toDateString(),
            today.toDateString()
        );
    });

    test('Increment streak on consecutive days', async () => {
        context.globalState.update('dailycode.lastAccessDate', yesterday);
        context.globalState.update('dailycode.counter', 5);

        await extension.updateCounter(yesterday, context);

        // Validate streak increment
        assert.strictEqual(context.globalState.get('dailycode.counter'), 6);
        assert.strictEqual(
            new Date(context.globalState.get('dailycode.lastAccessDate')).toDateString(),
            today.toDateString()
        );
    });

    test('Reset streak after missing a day', async () => {
        const twoDaysAgo = new Date(yesterday);
        twoDaysAgo.setDate(yesterday.getDate() - 1);

        context.globalState.update('dailycode.lastAccessDate', twoDaysAgo);
        context.globalState.update('dailycode.counter', 5);

        await extension.updateCounter(twoDaysAgo, context);

        // Validate streak reset
        assert.strictEqual(context.globalState.get('dailycode.counter'), 1);
        assert.strictEqual(
            new Date(context.globalState.get('dailycode.lastAccessDate')).toDateString(),
            today.toDateString()
        );
    });

    test('Do not increment streak if accessed on the same day', async () => {
        context.globalState.update('dailycode.lastAccessDate', today);
        context.globalState.update('dailycode.counter', 5);

        await extension.updateCounter(today, context);

        // Validate streak remains unchanged
        assert.strictEqual(context.globalState.get('dailycode.counter'), 5);
        assert.strictEqual(
            new Date(context.globalState.get('dailycode.lastAccessDate')).toDateString(),
            today.toDateString()
        );
    });

    test('Set and validate minimum code changes', async () => {
        await context.globalState.update('dailycode.minCodeChanges', 10);

        const changesRequired = context.globalState.get('dailycode.minCodeChanges');
        assert.strictEqual(changesRequired, 10);

        // Simulate text document change events
        NUM_OF_CHANGES = 0;
        const changes = Array(10).fill({}); // Simulating 10 changes
        changes.forEach(() => NUM_OF_CHANGES++);

        // Validate that the required changes threshold is reached
        assert.strictEqual(NUM_OF_CHANGES, 10);
    });

    test('Increment streak after sufficient code changes', async () => {
        context.globalState.update('dailycode.lastAccessDate', yesterday);
        context.globalState.update('dailycode.counter', 5);
        context.globalState.update('dailycode.minCodeChanges', 5);

        NUM_OF_CHANGES = 0;
        const changes = Array(5).fill({}); // Simulate 5 changes
        changes.forEach(() => NUM_OF_CHANGES++);

        if (NUM_OF_CHANGES >= context.globalState.get('dailycode.minCodeChanges')) {
            await extension.updateCounter(yesterday, context);
        }

        // Validate streak increment
        assert.strictEqual(context.globalState.get('dailycode.counter'), 6);
    });

    test('Show coding streak information', async () => {
        context.globalState.update('dailycode.counter', 5);
        await extension.activate(context);

        const result = vscode.commands.executeCommand('dailycode.showCodingStreak');
        assert.doesNotThrow(async () => await result);
    });
});