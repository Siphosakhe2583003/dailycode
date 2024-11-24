const vscode = require("vscode");

let counterStatusBar;
let listener;
let NUM_OF_CHANGES = 0;
function activate(context) {
  let lastAccessDate = context.globalState.get(
    "dailycode.lastAccessDate",
    new Date()
  );
  context.globalState.update("dailycode.lastAccessDate", lastAccessDate);

  let counter = context.globalState.get("dailycode.counter", 1);
  context.globalState.update("dailycode.counter", counter);

  let MIN_CODE_CHANGES = context.globalState.get("dailycode.minCodeChanges", 0);
  context.globalState.update("dailycode.minCodeChanges", MIN_CODE_CHANGES);

  // Create a status bar item
  if (!counterStatusBar) {
    counterStatusBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );
    counterStatusBar.command = "dailycode.showCodingStreak";
  }
  if (MIN_CODE_CHANGES === 0) {
    updateCounter(lastAccessDate, context);
  } else if (
    new Date(lastAccessDate).toDateString() !== new Date().toDateString()
  ) {
    listener = vscode.workspace.onDidChangeTextDocument((event) => {
      let changes = event.contentChanges;

      NUM_OF_CHANGES += changes.length;
      vscode.window.showInformationMessage(
        `Number of min code changes: ${MIN_CODE_CHANGES}`
      );
      if (NUM_OF_CHANGES >= MIN_CODE_CHANGES) {
        console.log(`Number of changes: ${NUM_OF_CHANGES}`);
        updateCounter(lastAccessDate, context);
        NUM_OF_CHANGES = 0;
        listener.dispose();
      }
    });
  } else {
    updateCounter(lastAccessDate, context);
  }
  if (listener) {
    context.subscriptions.push(listener);
  }

  updateStatusBar(context);
  counterStatusBar.show();

  // Ensure the counter key and lastAccessDate key is synchronized
  context.globalState.setKeysForSync([
    "dailycode.counter",
    "dailycode.lastAccessDate",
    "dailycode.minCodeChanges",
  ]);

  // Command to show coding streak
  // Check if commands are already registered
  vscode.commands.getCommands().then((commands) => {
    if (!commands.includes("dailycode.showCodingStreak")) {
      const showCodingStreak = vscode.commands.registerCommand(
        "dailycode.showCodingStreak",
        () => {
          vscode.window.showInformationMessage(
            `Your coding streak is ${counter} days! 🚀`
          );
        }
      );
      context.subscriptions.push(showCodingStreak);
    }

    if (!commands.includes("dailycode.resetStreak")) {
      const resetStreak = vscode.commands.registerCommand(
        "dailycode.resetStreak",
        () => {
          counter = 1;
          vscode.window.showInformationMessage(
            "Your coding streak has been reset."
          );
          context.globalState.update("dailycode.counter", counter);
          updateStatusBar(context);
        }
      );
      context.subscriptions.push(resetStreak);
    }
    if (!commands.includes("dailycode.setMinCodeChanges")) {
      const setMinCodeChanges = vscode.commands.registerCommand(
        "dailycode.setMinCodeChanges",
        async () => {
          const minCodeChanges = await vscode.window.showInputBox({
            prompt:
              "Set the minimum number of code changes to qualify as an active day.",
            placeHolder: "Enter a number (e.g., 10)",
            validateInput: (value) => {
              if (isNaN(value) || value.trim() === "") {
                return "Please enter a valid number.(e.g., 10)";
              }
              if (Number(value) < 0) {
                return "The number must be greater than or equal to 0.";
              }
              return null;
            },
          });

          if (minCodeChanges) {
            const changesNumber = Number(minCodeChanges);
            context.globalState.update(
              "dailycode.minCodeChanges",
              changesNumber
            );
            MIN_CODE_CHANGES = changesNumber;
            vscode.window.showInformationMessage(
              `Success! The minimum code changes required per day are now set to ${changesNumber}.`
            );
          } else {
            vscode.window.showInformationMessage(
              "No changes were made. The minimum code changes setting remains unchanged."
            );
          }
        }
      );
      context.subscriptions.push(setMinCodeChanges);
    }
    if (!commands.includes("dailycode.getMinCodeChanges")) {
      const getMinCodeChanges = vscode.commands.registerCommand(
        "dailycode.getMinCodeChanges",
        () => {
          vscode.window.showInformationMessage(
            `The minimum code changes required per day are currently set to ${context.globalState.get(
              "dailycode.minCodeChanges"
            )}.`
          );
        }
      );
      context.subscriptions.push(getMinCodeChanges);
    }
  });
}

function updateStatusBar(context) {
  let counter = context.globalState.get("dailycode.counter");

  counterStatusBar.text = `$(flame) ${counter}`;
  counterStatusBar.tooltip = `${counter} day${
    counter > 1 ? "s" : ""
  } streak! 🚀`;
}

function updateCounter(lastAccessDate, context) {
  let counter = context.globalState.get("dailycode.counter");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (lastAccessDate) {
    const lastDate = new Date(lastAccessDate);

    if (lastDate.toDateString() === yesterday.toDateString()) {
      counter++;
      vscode.window.showInformationMessage(
        `Awesome! Your coding streak is now ${counter} days strong! Keep up the great work! 🔥🚀`
      );
    } else if (lastDate.toDateString() !== today.toDateString()) {
      counter = 1;
      vscode.window.showInformationMessage(
        "Your streak is starting fresh! Let's hit day 1 again! 💪🚀"
      );
    } else if (
      lastDate.toDateString() === today.toDateString() &&
      counter === 1
    ) {
      vscode.window.showInformationMessage(
        "Welcome to DailyCode! 🎉 You've just started your coding streak with 1 day! Keep going strong! ✨🚀"
      );
    } else {
      vscode.window.showInformationMessage(
        `Welcome back! You're on a roll with ${counter} days of coding! Keep it going! 💪🚀`
      );
    }
  } else {
    vscode.window.showInformationMessage(
      "Error: lastAccessDate is null. Please report this issue."
    );
  }

  context.globalState.update("dailycode.counter", counter);
  context.globalState.update("dailycode.lastAccessDate", today);
}

function deactivate() {
  if (counterStatusBar) {
    counterStatusBar.dispose();
  }
  counterStatusBar = null; // Clear status bar for clean state
}

module.exports = {
  activate,
  deactivate,
  updateCounter,
};
