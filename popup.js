document.getElementById('settingsBtn').addEventListener('click', function () {
  chrome.tabs.create({ url: 'settings.html' });
});

document.getElementById('historyBtn').addEventListener('click', function () {
  chrome.tabs.create({ url: 'history.html' });
});
