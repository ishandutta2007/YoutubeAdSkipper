// YouTube Ad Skipper Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Ad Skipper installed');
});

// Listen for messages from content script if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'adSkipped') {
    console.log('Ad skipped successfully');
  }
  return true;
});
