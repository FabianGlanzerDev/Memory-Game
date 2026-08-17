"use strict";
let resultTimeout;
function isGameComplete() {
    const cards = Array.from(document.querySelectorAll('.memory-card'));
    return cards.length > 0 && cards.every((card) => card.dataset.matched === 'true');
}
function clearResultTimeout() {
    if (resultTimeout !== undefined)
        window.clearTimeout(resultTimeout);
    resultTimeout = undefined;
}
function hideResultScreens() {
    var _a, _b;
    (_a = document.getElementById('game-over-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('winner-screen')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
}
function syncResultTheme(theme) {
    var _a, _b;
    (_a = document.getElementById('game-over-screen')) === null || _a === void 0 ? void 0 : _a.setAttribute('data-theme', theme);
    (_b = document.getElementById('winner-screen')) === null || _b === void 0 ? void 0 : _b.setAttribute('data-theme', theme);
}
function updateGameOverTitle(theme) {
    const title = document.getElementById('game-over-title');
    if (title)
        title.textContent = theme === 'coding' ? 'Game over' : 'GAME OVER';
}
function updateFinalScore() {
    const blueScore = document.getElementById('game-over-blue-score');
    const orangeScore = document.getElementById('game-over-orange-score');
    if (blueScore)
        blueScore.textContent = String(scores.blue);
    if (orangeScore)
        orangeScore.textContent = String(scores.orange);
}
function getWinner() {
    if (scores.blue === scores.orange)
        return 'draw';
    return scores.blue > scores.orange ? 'blue' : 'orange';
}
function getResultSymbol(winner) {
    if (winner === 'draw')
        return '⚖︎';
    return getGameSettings().theme === 'gaming' ? '🏆︎' : '♙';
}
function updateWinnerContent(winner) {
    const screen = document.getElementById('winner-screen');
    const kicker = document.getElementById('winner-kicker');
    const title = document.getElementById('winner-title');
    const symbol = document.getElementById('result-symbol');
    screen === null || screen === void 0 ? void 0 : screen.classList.toggle('is-draw', winner === 'draw');
    if (kicker)
        kicker.textContent = winner === 'draw' ? "It's a" : 'The winner is';
    if (title)
        title.textContent = winner === 'draw' ? 'DRAW' : `${winner === 'blue' ? 'Blue' : 'Orange'} Player`;
    if (symbol)
        symbol.textContent = getResultSymbol(winner);
    screen === null || screen === void 0 ? void 0 : screen.setAttribute('data-winner', winner);
}
function showWinnerScreen() {
    var _a, _b;
    (_a = document.getElementById('game-over-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    updateWinnerContent(getWinner());
    (_b = document.getElementById('winner-screen')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
    resultTimeout = undefined;
}
function showGameOver() {
    var _a, _b;
    const settings = getGameSettings();
    syncResultTheme(settings.theme);
    updateGameOverTitle(settings.theme);
    updateFinalScore();
    (_a = document.getElementById('game-screen')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    (_b = document.getElementById('game-over-screen')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
    resultTimeout = window.setTimeout(showWinnerScreen, 1800);
}
function scheduleGameOver() {
    boardLocked = true;
    clearResultTimeout();
    resultTimeout = window.setTimeout(showGameOver, 550);
}
function resetResultFlow() {
    clearResultTimeout();
    hideResultScreens();
}
function startNewGame() {
    resetResultFlow();
    startGame();
}
