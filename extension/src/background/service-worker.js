// src/background/service-worker.js (NOVA VERSÃO)

// Estado inicial do Pomodoro e do Jogo
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    isRunning: false,
    timerMinutes: 25,
    mode: 'focus', // 'focus' ou 'break'
    pet: {
      level: 1,
      xp: 0,
      status: 'happy' // 'happy', 'sad'
    }
  });
});

// Listener para os alarmes que controlam o tempo
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoroTimer') {
    chrome.storage.local.get(['timerMinutes', 'mode'], (res) => {
      if (res.mode === 'focus') {
        // Foco concluído!
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Foco Concluído!',
          message: 'Ótimo trabalho! Hora de um descanso de 5 minutos.'
        });
        // Lógica do jogo: dar XP ao pet
        // ...
        
        // Mudar para o modo de descanso
        chrome.storage.local.set({ isRunning: false, mode: 'break', timerMinutes: 5 });
      } else {
        // Descanso concluído!
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: 'Descanso Concluído!',
          message: 'Vamos para mais uma sessão de foco?'
        });
        // Mudar para o modo de foco
        chrome.storage.local.set({ isRunning: false, mode: 'focus', timerMinutes: 25 });
      }
    });
  }
});


// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.command) {
    case 'start':
      chrome.storage.local.get(['timerMinutes'], (res) => {
        // Cria um alarme para disparar ao final do tempo
        chrome.alarms.create('pomodoroTimer', { delayInMinutes: res.timerMinutes });
        chrome.storage.local.set({ isRunning: true });
        sendResponse({ success: true });
      });
      break;
    case 'stop':
      // Cancela o alarme e para o cronômetro
      chrome.alarms.clear('pomodoroTimer');
      chrome.storage.local.set({ isRunning: false });
      // Lógica do jogo: pet fica triste
      // ...
      sendResponse({ success: true });
      break;
  }
  return true; // Necessário para sendResponse assíncrono
});
