const focusTimeInput = document.getElementById('focusTime');
const shortBreakTimeInput = document.getElementById('shortBreakTime');
const longBreakTimeInput = document.getElementById('longBreakTime');
const blockedSitesTextarea = document.getElementById('blockedSites');
const saveButton = document.getElementById('save');
const statusDiv = document.getElementById('status');

function saveOptions() {
  const blockedSites = blockedSitesTextarea.value.split('\n').filter(site => site.trim() !== '');
  chrome.storage.sync.set({
    focusTime: focusTimeInput.value,
    shortBreakTime: shortBreakTimeInput.value,
    longBreakTime: longBreakTimeInput.value,
    blockedSites: blockedSites,
  }, () => {
    statusDiv.textContent = 'Opções salvas!';
    setTimeout(() => { statusDiv.textContent = ''; }, 1500);
  });
}

function restoreOptions() {
  chrome.storage.sync.get(null, (items) => {
    focusTimeInput.value = items.focusTime;
    shortBreakTimeInput.value = items.shortBreakTime;
    longBreakTimeInput.value = items.longBreakTime;
    blockedSitesTextarea.value = items.blockedSites.join('\n');
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);
