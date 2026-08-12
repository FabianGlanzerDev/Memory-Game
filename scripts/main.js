"use strict";
function showSettings() {
    const homeScreen = document.getElementById('home-screen');
    const settingsScreen = document.getElementById('settings-screen');
    homeScreen === null || homeScreen === void 0 ? void 0 : homeScreen.classList.add('hidden');
    settingsScreen === null || settingsScreen === void 0 ? void 0 : settingsScreen.classList.remove('hidden');
}
function init() {
    const playButton = document.getElementById('play-button');
    playButton === null || playButton === void 0 ? void 0 : playButton.addEventListener('click', showSettings);
}
init();
