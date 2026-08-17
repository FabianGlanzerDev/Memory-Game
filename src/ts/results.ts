let resultTimeout: number | undefined;


function isGameComplete(): boolean {
    const cards = Array.from(document.querySelectorAll<HTMLButtonElement>('.memory-card'));

    return cards.length > 0 && cards.every((card) => card.dataset.matched === 'true');
}


function clearResultTimeout(): void {
    if (resultTimeout !== undefined) window.clearTimeout(resultTimeout);

    resultTimeout = undefined;
}


function hideResultScreens(): void {
    document.getElementById('game-over-screen')?.classList.add('hidden');
    document.getElementById('winner-screen')?.classList.add('hidden');
}


function syncResultTheme(theme: string): void {
    document.getElementById('game-over-screen')?.setAttribute('data-theme', theme);
    document.getElementById('winner-screen')?.setAttribute('data-theme', theme);
}


function updateGameOverTitle(theme: string): void {
    const title = document.getElementById('game-over-title');

    if (title) title.textContent = theme === 'coding' ? 'Game over' : 'GAME OVER';
}


function updateFinalScore(): void {
    const blueScore = document.getElementById('game-over-blue-score');
    const orangeScore = document.getElementById('game-over-orange-score');

    if (blueScore) blueScore.textContent = String(scores.blue);
    if (orangeScore) orangeScore.textContent = String(scores.orange);
}


function getWinner(): Player | 'draw' {
    if (scores.blue === scores.orange) return 'draw';

    return scores.blue > scores.orange ? 'blue' : 'orange';
}


function getResultSymbol(winner: Player | 'draw'): string {
    if (winner === 'draw') return '⚖︎';

    return getGameSettings().theme === 'gaming' ? '🏆︎' : '♙';
}


function updateWinnerContent(winner: Player | 'draw'): void {
    const screen = document.getElementById('winner-screen');
    const kicker = document.getElementById('winner-kicker');
    const title = document.getElementById('winner-title');
    const symbol = document.getElementById('result-symbol');

    screen?.classList.toggle('is-draw', winner === 'draw');
    if (kicker) kicker.textContent = winner === 'draw' ? "It's a" : 'The winner is';
    if (title) title.textContent = winner === 'draw' ? 'DRAW' : `${winner === 'blue' ? 'Blue' : 'Orange'} Player`;
    if (symbol) symbol.textContent = getResultSymbol(winner);
    screen?.setAttribute('data-winner', winner);
}


function showWinnerScreen(): void {
    document.getElementById('game-over-screen')?.classList.add('hidden');
    updateWinnerContent(getWinner());
    document.getElementById('winner-screen')?.classList.remove('hidden');
    resultTimeout = undefined;
}


function showGameOver(): void {
    const settings = getGameSettings();

    syncResultTheme(settings.theme);
    updateGameOverTitle(settings.theme);
    updateFinalScore();
    document.getElementById('game-screen')?.classList.add('hidden');
    document.getElementById('game-over-screen')?.classList.remove('hidden');
    resultTimeout = window.setTimeout(showWinnerScreen, 1800);
}


function scheduleGameOver(): void {
    boardLocked = true;
    clearResultTimeout();
    resultTimeout = window.setTimeout(showGameOver, 550);
}


function resetResultFlow(): void {
    clearResultTimeout();
    hideResultScreens();
}


function startNewGame(): void {
    resetResultFlow();
    startGame();
}

