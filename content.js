// YouTube Ad Skipper Content Script
(function() {
  'use strict';

  let skipAttempts = 0;
  const MAX_SKIP_ATTEMPTS = 10;
  let observerActive = false;

  // Function to skip ads
  function skipAd() {
    // Method 1: Click skip button if available
    const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, button[class*="skip"]');
    if (skipButton) {
      skipButton.click();
      console.log('[Ad Skipper] Clicked skip button');
      return true;
    }

    // Method 2: Check for video ad overlay skip button
    const overlaySkipButton = document.querySelector('.ytp-ad-overlay-close-button, .ytp-ad-overlay-close-container');
    if (overlaySkipButton) {
      overlaySkipButton.click();
      console.log('[Ad Skipper] Clicked overlay skip button');
      return true;
    }

    // Method 3: Try to find and click any skip-related button
    const allButtons = document.querySelectorAll('button');
    for (let button of allButtons) {
      const buttonText = button.textContent?.toLowerCase() || '';
      if (buttonText.includes('skip') || buttonText.includes('skip ad')) {
        button.click();
        console.log('[Ad Skipper] Clicked skip button by text match');
        return true;
      }
    }

    // Method 4: Try to click the video player's skip button (alternative selector)
    const playerSkipButton = document.querySelector('.ytp-ad-skip-button-container');
    if (playerSkipButton) {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      playerSkipButton.dispatchEvent(clickEvent);
      console.log('[Ad Skipper] Dispatched click event to skip container');
      return true;
    }

    return false;
  }

  // Function to check if ad is playing
  function isAdPlaying() {
    // Check for ad indicators in the DOM
    const adIndicator = document.querySelector('.ytp-ad-module, .ytp-ad-overlay-container, .ad-showing, .ad-interrupting');
    if (adIndicator) {
      return true;
    }

    // Check video player for ad state
    const video = document.querySelector('video');
    if (video) {
      // Check if ad is shown by looking at player controls
      const player = document.querySelector('.ytp-player-content');
      if (player) {
        const adText = player.textContent?.toLowerCase() || '';
        if (adText.includes('ad') && !adText.includes('disable')) {
          return true;
        }
      }
    }

    return false;
  }

  // Function to mute ad if it can't be skipped
  function muteAd() {
    const video = document.querySelector('video');
    if (video && !video.muted) {
      video.muted = true;
      console.log('[Ad Skipper] Muted ad');
    }
  }

  // Function to track skipped ads
  function trackSkippedAd() {
    chrome.storage.local.get(['adsSkipped'], (result) => {
      const count = (result.adsSkipped || 0) + 1;
      chrome.storage.local.set({ adsSkipped: count });
    });
  }

  // Function to try skipping ad with multiple methods
  function attemptSkipAd() {
    if (skipAttempts >= MAX_SKIP_ATTEMPTS) {
      console.log('[Ad Skipper] Max skip attempts reached');
      return;
    }

    skipAttempts++;
    
    if (isAdPlaying()) {
      console.log('[Ad Skipper] Ad detected, attempting to skip...');
      
      if (!skipAd()) {
        // If can't skip, try muting
        muteAd();
        
        // Try again after a short delay
        setTimeout(() => {
          if (skipAd()) {
            skipAttempts = 0;
            trackSkippedAd();
          }
        }, 500);
      } else {
        skipAttempts = 0;
        trackSkippedAd();
      }
    } else {
      skipAttempts = 0;
    }
  }

  // Observer to watch for dynamically loaded ad elements
  function setupObserver() {
    if (observerActive) return;
    observerActive = true;

    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        // Check for added nodes
        for (let node of mutation.addedNodes) {
          if (node.nodeType === 1) { // Element node
            // Check if skip button was added
            if (node.matches?.('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-overlay-close-button')) {
              setTimeout(() => attemptSkipAd(), 100);
            }
            // Check if any child contains skip button
            if (node.querySelector?.('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-overlay-close-button')) {
              setTimeout(() => attemptSkipAd(), 100);
            }
          }
        }
      }
    });

    // Observe the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also observe the video player container
    const playerContainer = document.querySelector('#movie_player, .html5-video-player');
    if (playerContainer) {
      observer.observe(playerContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }

    console.log('[Ad Skipper] Mutation observer set up');
  }

  // Function to periodically check for ads
  function startPeriodicCheck() {
    setInterval(() => {
      attemptSkipAd();
    }, 500); // Check every 500ms
  }

  // Initialize when page loads
  function init() {
    console.log('[Ad Skipper] Initializing...');
    
    // Wait for YouTube to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setupObserver();
        startPeriodicCheck();
      });
    } else {
      setupObserver();
      startPeriodicCheck();
    }

    // Also check when page becomes visible (when switching tabs back)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => attemptSkipAd(), 200);
      }
    });
  }

  // Start initialization
  init();

  // Re-initialize on navigation (YouTube is SPA)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      skipAttempts = 0;
      observerActive = false;
      setTimeout(() => {
        setupObserver();
      }, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
})();
