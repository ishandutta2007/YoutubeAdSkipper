# YouTube Ad Skipper Chrome Extension

A Chrome extension that automatically skips YouTube ads for a seamless viewing experience.

## Changelog

- 2025-11-04 — Added Dark Mode (popup theme selector: System / Light / Dark). Theme is persisted via `chrome.storage.sync` and defaults to `system`. Popup styles for light/dark were added and the background service worker initializes the `theme` setting. (Implemented by Valent-p)

## Features

- ✅ Automatically skips skippable ads
- ✅ Detects and handles overlay ads
- ✅ Mutes non-skippable ads when possible
- ✅ Works with dynamically loaded content
- ✅ Lightweight and fast

### Custom Skip Rules (@Valent-p)

- 🎯 Selective Ad Skipping
  - Toggle video ad skipping
  - Toggle overlay ad skipping
  - Customize wait time before skipping (0-10 seconds)
  
- 🎮 Channel Management
  - Whitelist your favorite content creators
  - Support creators by allowing their ads
  - Easy channel management through popup interface

- ⚙️ Flexible Configuration
  - All settings sync across devices
  - Settings persist between sessions
  - Real-time configuration updates

## Installation

### Method 1: Load Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the folder containing this extension
5. The extension is now installed!

### Method 2: Package Extension (For Distribution)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Pack extension"
4. Select the extension directory
5. A `.crx` file will be created

## How It Works

The extension uses a content script that:
- Monitors the YouTube page for ad elements
- Detects skip buttons and automatically clicks them
- Uses a MutationObserver to catch dynamically loaded ads
- Periodically checks for ads every 500ms
- Handles YouTube's single-page application navigation

## File Structure

```
YoutubeAdSkipper/
├── manifest.json       # Extension configuration
├── content.js          # Main ad-skipping logic
├── background.js       # Service worker
├── popup.html          # Extension popup UI
├── popup.js            # Popup script
├── icons/              # Extension icons (you need to add these)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

## Icons

You need to create icon files for the extension:
- `icons/icon16.png` (16x16 pixels)
- `icons/icon48.png` (48x48 pixels)
- `icons/icon128.png` (128x128 pixels)

You can create simple icons or use online icon generators.
# YouTube Ad Skipper Chrome Extension

A Chrome extension that automatically skips YouTube ads for a seamless viewing experience.

## Features

- ✅ Automatically skips skippable ads
- ✅ Detects and handles overlay ads
- ✅ Mutes non-skippable ads when possible
- ✅ Works with dynamically loaded content
- ✅ Lightweight and fast

### Custom Skip Rules (@Valent-p)

- 🎯 Selective Ad Skipping
  - Toggle video ad skipping
  - Toggle overlay ad skipping
  - Customize wait time before skipping (0-10 seconds)
  
- 🎮 Channel Management
  - Whitelist your favorite content creators
  - Support creators by allowing their ads
  - Easy channel management through popup interface

- ⚙️ Flexible Configuration
  - All settings sync across devices
  - Settings persist between sessions
  - Real-time configuration updates

### Dark Mode

- 🌙 Theme options: System / Light / Dark
- Choose a theme from the popup; selection is persisted and syncs across devices
- "System" follows the OS color-scheme while the popup is open

## Installation

### Method 1: Load Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the folder containing this extension
5. The extension is now installed!

### Method 2: Package Extension (For Distribution)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Pack extension"
4. Select the extension directory
5. A `.crx` file will be created

## How It Works

The extension uses a content script that:

- Monitors the YouTube page for ad elements
- Detects skip buttons and automatically clicks them
- Uses a MutationObserver to catch dynamically loaded ads
- Periodically checks for ads every 500ms
- Handles YouTube's single-page application navigation

## File Structure

```text
YoutubeAdSkipper/
├── manifest.json       # Extension configuration
├── content.js          # Main ad-skipping logic
├── background.js       # Service worker
├── popup.html          # Extension popup UI
├── popup.js            # Popup script
├── icons/              # Extension icons (you need to add these)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

## Icons

You need to create icon files for the extension:

- `icons/icon16.png` (16x16 pixels)
- `icons/icon48.png` (48x48 pixels)
- `icons/icon128.png` (128x128 pixels)

You can create simple icons or use online icon generators.

## Permissions

The extension requires:

- `activeTab`: To interact with YouTube tabs
- `scripting`: To inject content scripts
- `host_permissions`: Access to youtube.com

## Troubleshooting

If ads aren't being skipped:

1. Make sure you're on a YouTube page
2. Refresh the page
3. Check the browser console for any errors
4. Ensure the extension is enabled in `chrome://extensions/`

## Privacy

This extension:

- Only runs on YouTube pages
- Does not collect any personal data
- Does not send data to external servers
- All code is local and open source

## License

This project is open source and available for personal use.

## Contributing

Feel free to submit issues or pull requests to improve the extension!

## Contributors

- [Valent-p](https://github.com/Valent-p) - Owner and maintainer
  - Initial extension development
  - Custom skip rules implementation
  - Channel whitelist feature
  - Dark mode implementation
