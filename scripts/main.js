"use strict";
const THEME_PREVIEWS = {
    coding: './assets/img/settings/coding-vibes.svg',
    gaming: './assets/img/settings/gaming.svg',
    projects: './assets/img/settings/da-projects.svg',
    foods: './assets/img/settings/foods.svg'
};
const CARD_FRONTS = {
    coding: createCardPaths('coding'),
    gaming: createCardPaths('gaming'),
    projects: createCardPaths('projects'),
    foods: createCardPaths('foods')
};
let openedCards = [];
let boardLocked = false;
let flipTimeout;
let currentPlayer = 'blue';
let scores = { blue: 0, orange: 0 };
function formatCardIndex(index) {
    return index < 10 ? `0${index}` : String(index);
}
function createCardPaths(theme) {
    const paths = [];
    for (let index = 1; index <= 18; index++) {
        paths.push(`./assets/img/cards/${theme}/front-${formatCardIndex(index)}.png`);
    }
    return paths;
}
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
function createDeck(settings) {
    var _a;
    const fronts = (_a = CARD_FRONTS[settings.theme]) !== null && _a !== void 0 ? _a : CARD_FRONTS.coding;
    const selected = fronts.slice(0, settings.cardCount / 2);
    const deck = [];
    selected.forEach((image, pairId) => addPair(deck, image, pairId));
    return shuffleDeck(deck);
}
function addPair(deck, image, pairId) {
    deck.push({ pairId, image });
    deck.push({ pairId, image });
}
function shuffleDeck(deck) {
    for (let index = deck.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [deck[index], deck[randomIndex]] = [deck[randomIndex], deck[index]];
    }
    return deck;
}
function createCardFace(className) {
    const face = document.createElement('span');
    face.className = `memory-card-face ${className}`;
    return face;
}
function createFrontFace(image) {
    const face = createCardFace('memory-card-front');
    const img = document.createElement('img');
    img.src = image;
    img.alt = '';
    face.append(img);
    return face;
}
function configureCard(card, data, index) {
    card.className = 'memory-card';
    card.type = 'button';
    card.dataset.pairId = String(data.pairId);
    card.dataset.cardIndex = String(index);
    card.setAttribute('aria-label', `Memory card ${index + 1}`);
    card.setAttribute('aria-pressed', 'false');
}
function createMemoryCard(data, index) {
    const card = document.createElement('button');
    const inner = document.createElement('span');
    configureCard(card, data, index);
    inner.className = 'memory-card-inner';
    inner.append(createCardFace('memory-card-back'), createFrontFace(data.image));
    card.append(inner);
    card.addEventListener('click', () => handleCardClick(card));
    return card;
}
function renderBoard(settings) {
    const board = document.getElementById('game-board');
    const columns = settings.cardCount === 16 ? 4 : 6;
    if (!board)
        return;
    board.replaceChildren();
    board.style.setProperty('--board-columns', String(columns));
    createDeck(settings).forEach((data, index) => board.append(createMemoryCard(data, index)));
}
function canFlipCard(card) {
    return !boardLocked
        && !card.classList.contains('is-flipped')
        && card.dataset.matched !== 'true';
}
function flipCard(card) {
    card.classList.add('is-flipped');
    card.setAttribute('aria-pressed', 'true');
}
function handleCardClick(card) {
    if (!canFlipCard(card))
        return;
    flipCard(card);
    openedCards.push(card);
    if (openedCards.length === 2)
        checkOpenCards();
}
function checkOpenCards() {
    const [first, second] = openedCards;
    if (first.dataset.pairId === second.dataset.pairId) {
        keepMatchedCards();
        return;
    }
    boardLocked = true;
    flipTimeout = window.setTimeout(closeOpenCards, 850);
}
function keepMatchedCards() {
    openedCards.forEach((card) => {
        card.dataset.matched = 'true';
        card.disabled = true;
    });
    addPoint();
    openedCards = [];
    if (isGameComplete())
        scheduleGameOver();
}
function closeOpenCards() {
    openedCards.forEach((card) => {
        card.classList.remove('is-flipped');
        card.setAttribute('aria-pressed', 'false');
    });
    switchPlayer();
    openedCards = [];
    boardLocked = false;
    flipTimeout = undefined;
}
function resetCardInteraction() {
    if (flipTimeout !== undefined)
        window.clearTimeout(flipTimeout);
    openedCards = [];
    boardLocked = false;
    flipTimeout = undefined;
}
function normalizePlayer(player) {
    return player === 'orange' ? 'orange' : 'blue';
}
function updateCurrentPlayer(player) {
    const label = document.getElementById('current-player');
    const indicator = document.getElementById('current-player-indicator');
    if (label)
        label.textContent = player === 'orange' ? 'Orange' : 'Blue';
    indicator === null || indicator === void 0 ? void 0 : indicator.setAttribute('data-player', player);
}
function updateScore(player) {
    const output = document.getElementById(`${player}-score`);
    if (output)
        output.textContent = String(scores[player]);
}
function addPoint() {
    scores[currentPlayer] += 1;
    updateScore(currentPlayer);
}
function switchPlayer() {
    currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
    updateCurrentPlayer(currentPlayer);
}
function resetScores() {
    scores = { blue: 0, orange: 0 };
    updateScore('blue');
    updateScore('orange');
}
function resetPlayerState(player) {
    currentPlayer = normalizePlayer(player);
    resetScores();
    updateCurrentPlayer(currentPlayer);
}
function prepareGameScreen(settings) {
    const gameScreen = document.getElementById('game-screen');
    if (!gameScreen)
        return;
    gameScreen.dataset.theme = settings.theme;
    gameScreen.dataset.size = String(settings.cardCount);
    resetCardInteraction();
    resetPlayerState(settings.player);
    renderBoard(settings);
}
function startGame() {
    var _a, _b;
    resetResultFlow();
    prepareGameScreen(getGameSettings());
    (_a = document.getElementById('settings-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('game-screen')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
}
function exitGame() {
    var _a, _b;
    resetCardInteraction();
    resetResultFlow();
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
    var _a, _b, _c, _d;
    (_a = document.getElementById('play-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showSettings);
    (_b = document.getElementById('start-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', startGame);
    (_c = document.getElementById('exit-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', exitGame);
    (_d = document.getElementById('new-game-button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', startNewGame);
    initSettings();
}
init();
