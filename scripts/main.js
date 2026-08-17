"use strict";
const THEME_PREVIEWS = {
    coding: './assets/img/settings/coding-vibes.svg',
    gaming: './assets/img/settings/gaming.svg',
    projects: './assets/img/settings/da-projects.svg',
    foods: './assets/img/settings/foods.svg'
};
function showSettings() {
    var _a, _b;
    (_a = document.getElementById('home-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('settings-screen')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
}
function getSettingLabel(input) {
    var _a, _b, _c;
    return (_c = (_b = (_a = input.closest('label')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : input.value;
}
function updateSummary(input, output) {
    if (!input.checked)
        return;
    output.textContent = getSettingLabel(input);
    output.classList.remove('is-updating');
    void output.offsetWidth;
    output.classList.add('is-updating');
}
function bindSummary(inputName, outputId) {
    const inputs = document.querySelectorAll(`input[name="${inputName}"]`);
    const output = document.getElementById(outputId);
    if (!output)
        return;
    inputs.forEach((input) => input.addEventListener('change', () => updateSummary(input, output)));
    inputs.forEach((input) => updateSummary(input, output));
}
function syncThemePreview(input, preview) {
    if (input.checked)
        preview.src = THEME_PREVIEWS[input.value];
}
function initThemePreview() {
    const inputs = document.querySelectorAll('input[name="theme"]');
    const preview = document.querySelector('#theme-preview');
    if (!preview)
        return;
    inputs.forEach((input) => input.addEventListener('change', () => syncThemePreview(input, preview)));
    inputs.forEach((input) => syncThemePreview(input, preview));
}
function getCheckedValue(name) {
    var _a, _b;
    return (_b = (_a = document.querySelector(`input[name="${name}"]:checked`)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '';
}
function getGameSettings() {
    return {
        theme: getCheckedValue('theme'),
        player: getCheckedValue('player'),
        cardCount: Number(getCheckedValue('board-size'))
    };
}
function createMemoryCard(index) {
    const card = document.createElement('button');
    card.className = 'memory-card';
    card.type = 'button';
    card.dataset.cardIndex = String(index);
    card.setAttribute('aria-label', `Memory card ${index + 1}`);
    return card;
}
function renderBoard(cardCount) {
    const board = document.getElementById('game-board');
    const columns = cardCount === 16 ? 4 : 6;
    if (!board)
        return;
    board.replaceChildren();
    board.style.setProperty('--board-columns', String(columns));
    for (let index = 0; index < cardCount; index++)
        board.append(createMemoryCard(index));
}
function updateCurrentPlayer(player) {
    const label = document.getElementById('current-player');
    const indicator = document.getElementById('current-player-indicator');
    if (label)
        label.textContent = player === 'orange' ? 'Orange' : 'Blue';
    indicator === null || indicator === void 0 ? void 0 : indicator.setAttribute('data-player', player);
}
function prepareGameScreen(settings) {
    const gameScreen = document.getElementById('game-screen');
    if (!gameScreen)
        return;
    gameScreen.dataset.theme = settings.theme;
    gameScreen.dataset.size = String(settings.cardCount);
    updateCurrentPlayer(settings.player);
    renderBoard(settings.cardCount);
}
function startGame() {
    var _a, _b;
    prepareGameScreen(getGameSettings());
    (_a = document.getElementById('settings-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('game-screen')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
}
function exitGame() {
    var _a, _b;
    (_a = document.getElementById('game-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('settings-screen')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
}
function initSettings() {
    bindSummary('theme', 'selected-theme');
    bindSummary('player', 'selected-player');
    bindSummary('board-size', 'selected-board-size');
    initThemePreview();
}
function init() {
    var _a, _b, _c;
    (_a = document.getElementById('play-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showSettings);
    (_b = document.getElementById('start-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', startGame);
    (_c = document.getElementById('exit-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', exitGame);
    initSettings();
}
init();
