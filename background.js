// YouTube Ad Skipper Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Ad Skipper installed');
  
  // Initialize default settings
  chrome.storage.sync.get({
    skipRules: {
      skipDelay: 0, // Wait time before skipping (in seconds)
      skipOverlayAds: true,
      skipVideoAds: true,
      whitelistedChannels: [], // Channels where ads shouldn't be skipped
      customWaitTime: false // If true, use skipDelay
    },
    theme: 'system' // 'system' | 'light' | 'dark'
  }, (items) => {
    chrome.storage.sync.set(items);
  });
});

// Listen for messages from content script if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'adSkipped') {
    console.log('Ad skipped successfully');
  }
  return true;
});
