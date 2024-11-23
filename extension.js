const vscode = require("vscode");

let counterStatusBar;

function activate(context) {
  let lastAccessDate = context.globalState.get(
    "dailycode.lastAccessDate",
    new Date()
  );
  let counter = context.globalState.get("dailycode.counter", 1);
  context.globalState.update("dailycode.counter", counter);

  // Create a status bar item
  if (!counterStatusBar) {
    counterStatusBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left
    );
    counterStatusBar.command = "dailycode.showCodingStreak";
  }
  updateCounter(lastAccessDate, context);
  updateStatusBar(context);
  counterStatusBar.show();

  // Ensure the counter key and lastAccessDate key is synchronized
  context.globalState.setKeysForSync([
    "dailycode.counter",
    "dailycode.lastAccessDate",
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
  });
}

function updateStatusBar(context) {
  let counter = context.globalState.get("dailycode.counter");

  counterStatusBar.text = `$(flame) ${counter}`;
  counterStatusBar.tooltip =  `${counter} day${counter > 1 ? "s" : ""} streak! 🚀`;
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
