chrome.runtime.onInstalled.addListener(() => {
  console.log('Bootcamp Helper instalado.');
  // Define valores padrão na instalação
  chrome.storage.sync.set({
    enabled: true,
    favoriteColor: '#ec0089'
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'PING') {
    sendResponse({ ok: true, time: new Date().toISOString() });
  }
});