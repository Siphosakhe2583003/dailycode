const assert = require('assert');
const vscode = require('vscode');



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
        this.syncKeys = keys; // Just store keys for testing purposes
    }
}

class MockContext {
    constructor() {
        this.globalState = new MockGlobalState(); // Mock global state
        this.subscriptions = []; // For registering disposables
    }

    // Mock subscription method
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

    setup(() => {
        // Create a new mock context and initialize dates
        context = new MockContext();
        today = new Date();
		yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);
		extension.counter = 1; // Reset counter for each test
		extension.lastAccessDate = undefined; // Reset lastAccessDate for each test
    });

	teardown(() => {
		extension.deactivate();
	});

    test('Initial streak is 1 on first use', async () => {
        // Activate the extension with no previous state
        await extension.activate(context);

        // Validate initial counter and lastAccessDate
        assert.strictEqual(context.globalState.get('dailycode.counter'), 1);
        assert.strictEqual(
            new Date(context.globalState.get('dailycode.lastAccessDate')).toDateString(),
            today.toDateString()
        );
    });

    test('Increment streak if accessed consecutively', async () => {
        // Set lastAccessDate to yesterday
        context.globalState.update('dailycode.lastAccessDate', yesterday);
        context.globalState.update('dailycode.counter', 5);

        // Call updateCounter with the mock context
        await extension.updateCounter(yesterday, context);

        // Validate counter increment
        assert.strictEqual(context.globalState.get('dailycode.counter'), 6);
        assert.strictEqual(
            new Date(context.globalState.get('dailycode.lastAccessDate')).toDateString(),
            today.toDateString()
        );
		
    });

    test('Reset streak if not accessed consecutively', async () => {
        // Set lastAccessDate to two days ago
        const twoDaysAgo = new Date(yesterday);
        twoDaysAgo.setDate(yesterday.getDate() - 1);

        await context.globalState.update('dailycode.lastAccessDate', twoDaysAgo);
        await context.globalState.update('dailycode.counter', 5);

        // Call updateCounter with the mock context
        extension.updateCounter(twoDaysAgo, context);

        // Validate counter reset
        assert.strictEqual(context.globalState.get('dailycode.counter'), 1);
        assert.strictEqual(
            new Date(context.globalState.get('dailycode.lastAccessDate')).toDateString(),
            today.toDateString()
        );
		teardown(() => {
			extension.deactivate();
		});
    });

    test('Do not increment streak when accessed on the same day', async () => {
        // Set lastAccessDate to today
        await context.globalState.update('dailycode.lastAccessDate', today);
        await context.globalState.update('dailycode.counter', 5);

        // Call updateCounter with the mock context
        extension.updateCounter(today, context);

        // Validate counter does not change
        assert.strictEqual(context.globalState.get('dailycode.counter'), 5);
        assert.strictEqual(
            new Date(context.globalState.get('dailycode.lastAccessDate')).toDateString(),
            today.toDateString()
        );
		teardown(() => {
			extension.deactivate();
		});
    });
	
});