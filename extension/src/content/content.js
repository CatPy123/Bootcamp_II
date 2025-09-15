chrome.storage.sync.get('blockedSites', (data) => {
  const blockedSites = data.blockedSites || [];
  const currentHostname = window.location.hostname;

  if (blockedSites.some(site => currentHostname.includes(site))) {
    chrome.runtime.sendMessage({ command: 'distraction' });
    document.body.innerHTML = `
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background-color: #FFF8F0; text-align: center; font-family: sans-serif;">
        <img src="${chrome.runtime.getURL("src/images/pet-sad.png")}" style="width: 150px; height: 150px; margin-bottom: 20px;">
        <h1 style="font-size: 3em; color: #5C5470;">Seu pet ficou triste!</h1>
        <p style="font-size: 1.5em; color: #5C5470;">Volte ao foco para cuidar dele.</p>
      </div>
    `;
  }
});
