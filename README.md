# DailyCode Extension

DailyCode is a Visual Studio Code extension designed to help you track and maintain a coding streak, motivating you to code every day. It provides a streak counter in the status bar and offers intuitive commands for streak management, making it a fun and productive addition to your coding workflow.

---

## Features

### 🔥 Coding Streak Tracker
- **Visual Streak Counter**: Displays your current coding streak in the VS Code status bar.
- **Automatic Updates**: Tracks your streak based on daily usage.
- **Missed Days**: Resets the streak automatically if no activity is detected for a day.
- **Consecutive Days**: Increments your streak for consecutive coding days.

### 🛠️ Commands
- **Show Coding Streak (`dailycode.showCodingStreak`)**: Displays your current streak in a popup notification.
- **Reset Streak (`dailycode.resetStreak`)**: Allows you to manually reset your streak (No one would use this feature🤣).

### 💾 Persistent Streak Data
- **Global State Storage**: Your streak count and last access date are securely saved, persisting across sessions.

### ⚡ Status Bar Integration
- **Flame Icon**: Represents your streak count visually with an accompanying tooltip.
- **Tooltip Information**: Hover to see detailed information about your streak.

### 🔗 Seamless Workflow
- **Smart Streak Management**: Automatically detects consecutive or missed days.
- **Feedback Alerts**: Provides feedback notifications when your streak updates or resets.

---

## Requirements

No external dependencies are required. DailyCode works out of the box with Visual Studio Code.

---

## Installation

1. **Install from the Marketplace**:
   - Open the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/) and search for "DailyCode."
   - Click "Install" to add the extension to your VS Code.

2. **Manual Installation**:
   - Clone the repository: `git clone https://github.com/yourusername/dailycode-extension.git`.
   - Open the folder in VS Code and run `npm install` to install dependencies.
   - Run the extension using the `Run Extension` launch configuration.

---

## Usage

1. **Activating DailyCode**:
   - Start coding in Visual Studio Code, and the streak counter will automatically initialize in the status bar.

2. **Viewing Your Streak**:
   - Use the `dailycode.showCodingStreak` command to see your streak as a popup notification.

3. **Resetting Your Streak**:
   - If you want to start fresh, run the `dailycode.resetStreak` command.

4. **Tooltip Information**:
   - Hover over the status bar item to get additional details about your current streak.

---

## Extension Settings

Currently, DailyCode does not include configurable settings. Future updates may allow:
- Custom notifications for milestone streaks.
- Setting streak goals.
- Changing the reset behavior or streak counting logic.

---

## Known Issues

- NO ISSUES YET

---

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature-name'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request on GitHub.

Please ensure all tests pass before submitting your PR.

---

## Testing

DailyCode includes automated tests for reliable performance:

1. Install development dependencies: `npm install`.
2. Run tests using `npm test`.
3. Validate edge cases and ensure full coverage.

---

## Release Notes

### 1.1.0
- **Improved Testing**: Enhanced test coverage and bug fixes for streak tracking.
- **Bug Fixes**: Resolved consecutive day tracking issues.

### 1.0.0
- **Initial Release**: Fully functional streak tracking, reset functionality, and persistent storage.

---

## Feedback and Support

If you encounter any issues or have feature suggestions:
- Submit an issue on the [GitHub repository](https://github.com/Siphosakhe2583003/dailycode).
- Reach out via email at [siphosakhemkhwanazi.github@gmail.com](mailto:siphosakhemkhwanazi.github@gmail.com).

---

## Screenshots

### Status Bar
![Status Bar](images/status-bar.png)

---

## Roadmap

- **Milestone Notifications**: Celebrate streak milestones like 10, 50, or 100 days.
- **Customizable Themes**: Allow users to customize the status bar appearance (VS Code has little customization of icons so it's unlikely).
- **Enhanced Analytics**: Provide weekly or monthly coding activity reports.
- **Calendar Feature**: A heatmap-style calendar that visually represents coding activity, highlighting the intensity of coding on specific days.
---

**Thank you for using DailyCode! Keep coding and stay motivated! 🚀**