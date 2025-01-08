let timeLeft;
let workTime = 25 * 60; // 25 minutes in seconds
let shortRestTime = 5 * 60; // 5 minutes in seconds
let longRestTime = 10 * 60; // 10 minutes in seconds
let timerId = null;
const TIMES = {
    'Work': 25 * 60,
    'Short Rest': 5 * 60,
    'Long Rest': 10 * 60
};

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');
const modeSelector = document.getElementById('mode-selector');

function updateDisplay(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the display elements
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the browser tab title
    document.title = `(${timeString}) Pomodoro Timer`;
}

function startTimer() {
    if (timerId === null) {
        if (!timeLeft) {
            timeLeft = getSelectedTime();
        }
        startPauseButton.textContent = 'Pause';
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay(timeLeft);
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                timeLeft = getSelectedTime();
                statusText.textContent = `${modeSelector.value}`;
                new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
                startTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    startPauseButton.textContent = 'Start';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = getCurrentTime();
    updateDisplay(timeLeft);
    statusText.textContent = `${modeSelector.value}`;
    startPauseButton.textContent = 'Start';
}

function getSelectedTime() {
    switch (modeSelector.value) {
        case 'Work':
            return workTime;
        case 'Short Rest':
            return shortRestTime;
        case 'Long Rest':
            return longRestTime;
        default:
            return workTime;
    }
}

function getCurrentTime() {
    return TIMES[modeSelector.value];
}

function handleModeChange() {
    timeLeft = getCurrentTime();
    updateDisplay(timeLeft);
    statusText.textContent = `${modeSelector.value}`;
}

startPauseButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        pauseTimer();
    }
});
resetButton.addEventListener('click', resetTimer);

modeSelector.addEventListener('change', handleModeChange);

// Initialize the display
resetTimer(); 