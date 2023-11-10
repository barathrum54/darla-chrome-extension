// Time for checks and notifications in milliseconds
const checkInterval = 10000; // 10 seconds

// Options for notification creation
var notificationOptions = {
  type: "basic",
  iconUrl: "src/persona.png",
  title: "Darla Reminder",
  message: "What are you doing right now?"
};

// Flag for enabling or disabling blocking
var isBlocking = false;
var isUserInputPending = false;

// Creating and showing notification
function createNotification() {
  chrome.notifications.create('reminder', notificationOptions);
  chrome.tabs.create({ url: 'input.html' }); // Opens input.html upon notification
  isBlocking = true; // Enables blocking once the notification is triggered
  updateBlockingRules();
}

async function updateBlockingRules() {
  if (isBlocking) {
    // Add rules to block all URLs when isBlocking is true
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          "id": 1001,
          "priority": 1,
          "action": isBlocking ? { "type": "redirect", "redirect": "<input.html>" } : { "type": "block" },
          "condition": { "urlFilter": ".*", "resourceTypes": ["main_frame"] }
        }
      ]
    });
  } else {
    chrome.declarativeNetRequest.getDynamicRules(previousRules => {
      const previousRuleIds = previousRules.map(rule => rule.id);
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: previousRuleIds,
        addRules: null
      });
    });
  }
}

// Interval setup to trigger notifications and potential blocking
setInterval(createNotification, checkInterval);

// Message listener to handle messages from 'input.html' (or any content script)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "inputProvided") {
    isBlocking = false; // Disables blocking once input is provided
    updateBlockingRules();
  }
});
