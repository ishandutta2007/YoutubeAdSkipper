// Popup script for YouTube Ad Skipper
document.addEventListener('DOMContentLoaded', () => {
  // Get current tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    
    if (currentTab.url?.includes('youtube.com')) {
      document.getElementById('status').textContent = 'Active';
      document.getElementById('status').className = 'status-value status-active';
    } else {
      document.getElementById('status').textContent = 'Inactive';
      document.getElementById('status').className = 'status-value';
    }
  });

  // Load stats from storage
  chrome.storage.local.get(['adsSkipped'], (result) => {
    const count = result.adsSkipped || 0;
    document.getElementById('adsSkipped').textContent = count.toLocaleString();
  });
});
