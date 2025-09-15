chrome.runtime.onInstalled.addListener(() => {
  console.log('Bootcamp Helper instalado.');
  // Define valores padrão na instalação
  chrome.storage.sync.set({
    enabled: true,
    favoriteColor: '#E5A4CB' // Nova cor padrão (rosé)
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'PING') {
    sendResponse({ ok: true, time: new Date().toISOString() });
  }
});
