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
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

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

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const iconPath = themeToggle.querySelector('svg path');
    if (theme === 'dark') {
        iconPath.setAttribute('d', 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z');
    } else {
        iconPath.setAttribute('d', 'M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z');
    }
}

const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', toggleTheme);

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