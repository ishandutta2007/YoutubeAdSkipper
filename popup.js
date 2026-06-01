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

  // Load and initialize settings (skip rules + theme)
  chrome.storage.sync.get({
    skipRules: {
      skipDelay: 0,
      skipOverlayAds: true,
      skipVideoAds: true,
      whitelistedChannels: [],
      customWaitTime: false
    },
    theme: 'system'
  }, (items) => {
    const { skipRules, theme } = items;

    // Initialize checkboxes
    document.getElementById('skipOverlayAds').checked = skipRules.skipOverlayAds;
    document.getElementById('skipVideoAds').checked = skipRules.skipVideoAds;
    document.getElementById('customWaitTime').checked = skipRules.customWaitTime;
    document.getElementById('skipDelay').value = skipRules.skipDelay;
    document.getElementById('skipDelay').disabled = !skipRules.customWaitTime;

    // Populate whitelisted channels
    const whitelistContainer = document.getElementById('whitelistedChannels');
    skipRules.whitelistedChannels.forEach(channel => {
      addWhitelistItem(channel, whitelistContainer);
    });

    // Initialize theme selector
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
      themeSelect.value = theme || 'system';
      applyTheme(themeSelect.value);
    }
  });

  // Event Listeners for Settings
  document.getElementById('skipOverlayAds').addEventListener('change', updateSettings);
  document.getElementById('skipVideoAds').addEventListener('change', updateSettings);
  document.getElementById('customWaitTime').addEventListener('change', (e) => {
    document.getElementById('skipDelay').disabled = !e.target.checked;
    updateSettings();
  });
  document.getElementById('skipDelay').addEventListener('change', updateSettings);
  // Theme selector listener
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      chrome.storage.sync.set({ theme: selected });
      applyTheme(selected);
    });
  }

  // Whitelist Channel Management
  document.getElementById('addChannel').addEventListener('click', () => {
    const input = document.getElementById('channelInput');
    const channel = input.value.trim();
    if (channel) {
      chrome.storage.sync.get({ skipRules: { whitelistedChannels: [] } }, (items) => {
        const channels = items.skipRules.whitelistedChannels;
        if (!channels.includes(channel)) {
          channels.push(channel);
          const newSkipRules = { ...items.skipRules, whitelistedChannels: channels };
          chrome.storage.sync.set({ skipRules: newSkipRules });
          addWhitelistItem(channel, document.getElementById('whitelistedChannels'));
          input.value = '';
        }
      });
    }
  });
});

function updateSettings() {
  const skipRules = {
    skipOverlayAds: document.getElementById('skipOverlayAds').checked,
    skipVideoAds: document.getElementById('skipVideoAds').checked,
    customWaitTime: document.getElementById('customWaitTime').checked,
    skipDelay: parseInt(document.getElementById('skipDelay').value) || 0,
    whitelistedChannels: [] // Will be preserved from storage
  };

  chrome.storage.sync.get({ skipRules: { whitelistedChannels: [] } }, (items) => {
    skipRules.whitelistedChannels = items.skipRules.whitelistedChannels;
    chrome.storage.sync.set({ skipRules });
  });
}

// Apply the UI theme
function applyTheme(theme) {
  const body = document.body;

  function setClassForMode(mode) {
    body.classList.remove('theme-light', 'theme-dark');
    if (mode === 'light') body.classList.add('theme-light');
    if (mode === 'dark') body.classList.add('theme-dark');
  }

  if (theme === 'system' || !theme) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setClassForMode(mq.matches ? 'dark' : 'light');
    // Listen for system changes while popup is open
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', (e) => setClassForMode(e.matches ? 'dark' : 'light'));
    } else if (typeof mq.addListener === 'function') {
      mq.addListener((e) => setClassForMode(e.matches ? 'dark' : 'light'));
    }
  } else {
    setClassForMode(theme);
  }
}

function addWhitelistItem(channel, container) {
  const item = document.createElement('div');
  item.className = 'whitelist-item';
  item.innerHTML = `
    <span>${channel}</span>
    <button data-channel="${channel}">×</button>
  `;

  item.querySelector('button').addEventListener('click', (e) => {
    const channelToRemove = e.target.dataset.channel;
    chrome.storage.sync.get({ skipRules: { whitelistedChannels: [] } }, (items) => {
      const channels = items.skipRules.whitelistedChannels.filter(ch => ch !== channelToRemove);
      const newSkipRules = { ...items.skipRules, whitelistedChannels: channels };
      chrome.storage.sync.set({ skipRules: newSkipRules });
      item.remove();
    });
  });

  container.appendChild(item);
}
