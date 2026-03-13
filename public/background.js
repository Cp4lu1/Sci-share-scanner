
// Chrome Extension Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Sci-Share Scanner Extension Installed');
});

// Placeholder for message passing logic between popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    sendResponse({ status: "active" });
  }
  return true;
});
