// YouTube Ad Skipper Content Script
(function() {
  'use strict';

  let skipAttempts = 0;
  const MAX_SKIP_ATTEMPTS = 10;
  let observerActive = false;
  let skipRules = {
    skipDelay: 0,
    skipOverlayAds: true,
    skipVideoAds: true,
    whitelistedChannels: [],
    customWaitTime: false
  };

  // Function to check if current channel is whitelisted
  function isChannelWhitelisted() {
    const channelName = document.querySelector('#channel-name yt-formatted-string')?.textContent?.trim();
    return channelName && skipRules.whitelistedChannels.includes(channelName);
  }

  // Load skip rules from storage
  function loadSkipRules() {
    chrome.storage.sync.get({ skipRules: skipRules }, (items) => {
      skipRules = items.skipRules;
    });
  }

  // Function to skip ads
  function skipAd() {
<<<<<<< HEAD
    // Method 1: Click skip button if available (multiple selectors for different ad types)
    const skipButton = document.querySelector(
      '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, ' +
      'button[class*="skip"], .ytp-ad-skip-button-container button, ' +
      '.ytp-ad-skip-button-slot button, button.ytp-ad-skip-button'
    );
    if (skipButton && skipButton.offsetParent !== null) { // Check if visible
      try {
        skipButton.click();
        console.log('[Ad Skipper] Clicked skip button');
        return true;
      } catch (e) {
        // If click fails, try programmatic click
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        skipButton.dispatchEvent(clickEvent);
        console.log('[Ad Skipper] Dispatched click to skip button');
        return true;
      }
    }

    // Method 2: Check for video ad overlay skip button
    const overlaySkipButton = document.querySelector(
      '.ytp-ad-overlay-close-button, .ytp-ad-overlay-close-container, ' +
      '.ytp-ad-overlay-close-button-container'
    );
    if (overlaySkipButton && overlaySkipButton.offsetParent !== null) {
      overlaySkipButton.click();
      console.log('[Ad Skipper] Clicked overlay skip button');
=======
    // Check if we're on a whitelisted channel
    if (isChannelWhitelisted()) {
      console.log('[Ad Skipper] Channel is whitelisted, not skipping');
      return false;
    }

    // Method 1: Click skip button if available and video ads are enabled
    const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, button[class*="skip"]');
    if (skipButton && skipRules.skipVideoAds) {
      if (skipRules.customWaitTime && skipRules.skipDelay > 0) {
        setTimeout(() => {
          skipButton.click();
          console.log(`[Ad Skipper] Clicked skip button after ${skipRules.skipDelay}s delay`);
        }, skipRules.skipDelay * 1000);
      } else {
        skipButton.click();
        console.log('[Ad Skipper] Clicked skip button');
      }
      return true;
    }

    // Method 2: Check for video ad overlay skip button
    const overlaySkipButton = document.querySelector('.ytp-ad-overlay-close-button, .ytp-ad-overlay-close-container');
    if (overlaySkipButton && skipRules.skipOverlayAds) {
      if (skipRules.customWaitTime && skipRules.skipDelay > 0) {
        setTimeout(() => {
          overlaySkipButton.click();
          console.log(`[Ad Skipper] Clicked overlay skip button after ${skipRules.skipDelay}s delay`);
        }, skipRules.skipDelay * 1000);
      } else {
        overlaySkipButton.click();
        console.log('[Ad Skipper] Clicked overlay skip button');
      }
>>>>>>> 515a8ba1123b6005017dc7bbdb6758caba64c170
      return true;
    }

    // Method 3: Try clicking the skip button container directly (for mid-roll ads)
    const skipContainer = document.querySelector('.ytp-ad-skip-button-container');
    if (skipContainer) {
      const buttonInside = skipContainer.querySelector('button');
      if (buttonInside && buttonInside.offsetParent !== null) {
        buttonInside.click();
        console.log('[Ad Skipper] Clicked button inside skip container');
        return true;
      }
      // If no button found, try clicking the container itself
      if (skipContainer.offsetParent !== null) {
        skipContainer.click();
        console.log('[Ad Skipper] Clicked skip container');
        return true;
      }
    }

    // Method 4: Try to find and click any skip-related button by text
    const allButtons = Array.from(document.querySelectorAll('button'));
    for (let button of allButtons) {
      if (button.offsetParent === null) continue; // Skip hidden buttons
      const buttonText = button.textContent?.toLowerCase() || '';
      const buttonAriaLabel = button.getAttribute('aria-label')?.toLowerCase() || '';
      if ((buttonText.includes('skip') && (buttonText.includes('ad') || buttonText.includes('ads'))) ||
          buttonAriaLabel.includes('skip')) {
        button.click();
        console.log('[Ad Skipper] Clicked skip button by text/aria-label match');
        return true;
      }
    }

    // Method 5: Try using YouTube's internal skip function (if available)
    const player = document.querySelector('#movie_player');
    if (player && player.skipAd) {
      try {
        player.skipAd();
        console.log('[Ad Skipper] Called player.skipAd()');
        return true;
      } catch (e) {
        // Method not available or failed
      }
    }

    return false;
  }

  // Function to check if ad is playing
  function isAdPlaying() {
    const video = document.querySelector('video');
    if (!video) return false;

    // Method 1: Check for ad indicators in the DOM
    const adIndicator = document.querySelector(
      '.ytp-ad-module, .ytp-ad-overlay-container, .ad-showing, .ad-interrupting, ' +
      '.ytp-ad-text, .ytp-ad-overlay, .ytp-ad-text-overlay, ' +
      '.ytp-ad-skip-button-container, .ytp-ad-overlay-close-button, ' +
      '.ad-container, .ad-showing, .ytp-ad-overlay-ad-info-dialog-container'
    );
    if (adIndicator) {
      return true;
    }

    // Method 2: Check for ad countdown/badge elements
    const adCountdown = document.querySelector('.ytp-ad-text, .ytp-ad-overlay-ad-info, .ytp-ad-overlay-ad-info-text');
    if (adCountdown) {
      return true;
    }

    // Method 3: Check video player container for ad classes
    const player = document.querySelector('#movie_player, .html5-video-player');
    if (player) {
      // Check for ad-related classes
      const playerClasses = player.className || '';
      if (playerClasses.includes('ad-showing') || playerClasses.includes('ad-interrupting') || 
          playerClasses.includes('ad-created') || playerClasses.includes('ad-playing')) {
        return true;
      }

      // Check for ad text in player
      const playerText = player.textContent?.toLowerCase() || '';
      if ((playerText.includes('ad') || playerText.includes('advertisement')) && 
          (playerText.includes('skip') || playerText.includes('seconds'))) {
        return true;
      }
    }

    // Method 4: Check if video src contains ad-related URLs
    if (video.src) {
      if (video.src.includes('doubleclick') || video.src.includes('googlevideo.com/videoplayback') && 
          document.querySelector('.ytp-ad-module')) {
        return true;
      }
    }

    // Method 5: Check for ad skip button visibility (even if we can't click it yet)
    const skipButtonVisible = document.querySelector('.ytp-ad-skip-button:not([style*="display: none"])');
    if (skipButtonVisible) {
      return true;
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
            if (node.matches?.('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-overlay-close-button, .ytp-ad-skip-button-container, .ytp-ad-module')) {
              setTimeout(() => attemptSkipAd(), 100);
            }
            // Check if any child contains skip button or ad elements
            if (node.querySelector?.('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-overlay-close-button, .ytp-ad-module, .ad-showing')) {
              setTimeout(() => attemptSkipAd(), 100);
            }
          }
        }
        
        // Check for class changes on player (ads often change player classes)
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target;
          if (target && (target.id === 'movie_player' || target.classList.contains('html5-video-player'))) {
            const classes = target.className || '';
            if (classes.includes('ad-showing') || classes.includes('ad-interrupting')) {
              setTimeout(() => attemptSkipAd(), 200);
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

  // Function to monitor video events for mid-roll ads
  function setupVideoEventListeners() {
    const video = document.querySelector('video');
    if (!video) return;

    let lastVideoTime = video.currentTime;
    let lastVideoSrc = video.src;
    let adCheckTimeout = null;

    // Monitor for video source changes (indicates ad playback)
    const checkVideoChanges = () => {
      const currentSrc = video.src;
      if (currentSrc !== lastVideoSrc) {
        lastVideoSrc = currentSrc;
        console.log('[Ad Skipper] Video source changed, checking for ad...');
        setTimeout(() => attemptSkipAd(), 300);
      }
    };

    // Monitor time updates to detect ad interruptions
    video.addEventListener('timeupdate', () => {
      const currentTime = video.currentTime;
      // If time jumps backwards or resets, might be an ad
      if (currentTime < lastVideoTime - 1) {
        console.log('[Ad Skipper] Video time jumped, checking for ad...');
        setTimeout(() => attemptSkipAd(), 300);
      }
      lastVideoTime = currentTime;
    });

    // Monitor when video pauses and resumes (mid-roll ads often cause this)
    let wasPaused = video.paused;
    const pauseResumeCheck = () => {
      clearTimeout(adCheckTimeout);
      const isPaused = video.paused;
      if (wasPaused !== isPaused) {
        wasPaused = isPaused;
        if (!isPaused) {
          // Video resumed/started playing, check if it's an ad
          adCheckTimeout = setTimeout(() => {
            checkVideoChanges();
            if (isAdPlaying()) {
              attemptSkipAd();
            } else {
              // Even if not detected as ad, try to skip (might be mid-roll)
              attemptSkipAd();
            }
          }, 300);
        }
      }
    };
    video.addEventListener('pause', pauseResumeCheck);
    video.addEventListener('play', pauseResumeCheck);

    // Monitor when video becomes visible (for mid-roll ads)
    const videoObserver = new MutationObserver(() => {
      checkVideoChanges();
      attemptSkipAd();
    });

    if (video.parentElement) {
      videoObserver.observe(video.parentElement, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true
      });
    }

    console.log('[Ad Skipper] Video event listeners set up');
  }

  // Function to periodically check for ads
  function startPeriodicCheck() {
    // Check more frequently for better mid-roll ad detection
    setInterval(() => {
      attemptSkipAd();
    }, 250); // Check every 250ms for faster detection
  }

  // Initialize when page loads
  function init() {
    console.log('[Ad Skipper] Initializing...');
    
<<<<<<< HEAD
    const setupEverything = () => {
=======
    // Load skip rules and start monitoring for changes
    loadSkipRules();
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync' && changes.skipRules) {
        skipRules = changes.skipRules.newValue;
      }
    });
    
    // Wait for YouTube to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setupObserver();
        startPeriodicCheck();
      });
    } else {
>>>>>>> 515a8ba1123b6005017dc7bbdb6758caba64c170
      setupObserver();
      startPeriodicCheck();
      
      // Setup video event listeners after a delay to ensure video is loaded
      setTimeout(() => {
        setupVideoEventListeners();
        // Also retry if video wasn't ready yet
        const video = document.querySelector('video');
        if (!video) {
          const videoObserver = new MutationObserver((mutations, obs) => {
            const vid = document.querySelector('video');
            if (vid) {
              setupVideoEventListeners();
              obs.disconnect();
            }
          });
          videoObserver.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
      }, 1000);
    };
    
    // Wait for YouTube to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupEverything);
    } else {
      setupEverything();
    }

    // Also check when page becomes visible (when switching tabs back)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => {
          attemptSkipAd();
          setupVideoEventListeners(); // Re-setup in case video changed
        }, 200);
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
