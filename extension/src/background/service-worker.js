// Valores padrão
const defaults = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  blockedSites: ['facebook.com', 'twitter.com', 'youtube.com', 'instagram.com'],
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(defaults);
  chrome.storage.local.set({
    isRunning: false,
    mode: 'focus',
    timeLeft: defaults.focusTime * 60,
    pomodoroCount: 0,
    pet: { state: 'egg', xp: 0 },
  });
});

// Listener dos alarmes
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoroTimer') {
    chrome.storage.local.get(['mode', 'pomodoroCount', 'pet', 'isRunning'], (res) => {
      if (!res.isRunning) return;

      let newMode = res.mode;
      let newCount = res.pomodoroCount;
      let newPet = res.pet;

      if (res.mode === 'focus') {
        newCount++;
        newPet.xp += 10;
        newPet.state = 'happy';
        if (newPet.xp >= 50) newPet.state = 'egg'; // Exemplo de evolução
        
        if (newCount % 4 === 0) {
          newMode = 'longBreak';
          showNotification('Foco Concluído!', `Bom trabalho! Hora de um descanso longo de ${defaults.longBreakTime} minutos.`);
        } else {
          newMode = 'shortBreak';
          showNotification('Foco Concluído!', `Você completou ${newCount} pomodoros! Descanso curto de ${defaults.shortBreakTime} minutos.`);
        }
      } else {
        newMode = 'focus';
        newPet.state = 'focus';
        showNotification('Descanso Concluído!', 'Hora de voltar ao foco!');
      }
      
      const newTime = (newMode === 'focus' ? defaults.focusTime : (newMode === 'shortBreak' ? defaults.shortBreakTime : defaults.longBreakTime)) * 60;

      chrome.storage.local.set({
        isRunning: false,
        mode: newMode,
        timeLeft: newTime,
        pomodoroCount: newCount,
        pet: newPet,
      });
    });
  }
});

// Listener de Mensagens
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.command) {
    case 'start':
      chrome.storage.local.get(['timeLeft'], (res) => {
        chrome.alarms.create('pomodoroTimer', { delayInMinutes: res.timeLeft / 60 });
        chrome.storage.local.set({ isRunning: true });
        sendResponse({ success: true });
      });
      break;
    case 'stop':
      chrome.alarms.clear('pomodoroTimer');
      chrome.storage.local.set({ isRunning: false, pet: { state: 'sad', xp: 0 } });
      sendResponse({ success: true });
      break;
    case 'reset':
        chrome.alarms.clear('pomodoroTimer');
        chrome.storage.local.set({
            isRunning: false,
            mode: 'focus',
            timeLeft: defaults.focusTime * 60,
            pomodoroCount: 0,
            pet: { state: 'egg', xp: 0 },
          });
        sendResponse({ success: true });
      break;
    case 'getState':
      chrome.storage.local.get(null, (state) => sendResponse(state));
      break;
    case 'distraction':
        chrome.storage.local.get('isRunning', (res) => {
            if (res.isRunning) {
                chrome.storage.local.set({ pet: { state: 'sad', xp: 0 } });
            }
        });
        sendResponse({ success: true });
        break;
  }
  return true;
});

function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: title,
    message: message,
  });
}


