const THEME_PREVIEWS: Record<string, string> = {
    coding: './assets/img/settings/coding-vibes.svg',
    gaming: './assets/img/settings/gaming.svg',
    projects: './assets/img/settings/da-projects.svg',
    foods: './assets/img/settings/foods.svg'
};


interface GameSettings {
    theme: string;
    player: string;
    cardCount: number;
}


function showSettings(): void {
    document.getElementById('home-screen')?.classList.add('hidden');
    document.getElementById('settings-screen')?.classList.remove('hidden');
}


function getSettingLabel(input: HTMLInputElement): string {
    return input.closest('label')?.textContent?.trim() ?? input.value;
}


function updateSummary(input: HTMLInputElement, output: HTMLElement): void {
    if (!input.checked) return;

    output.textContent = getSettingLabel(input);
    output.classList.remove('is-updating');
    void output.offsetWidth;
    output.classList.add('is-updating');
}


function bindSummary(inputName: string, outputId: string): void {
    const inputs = document.querySelectorAll<HTMLInputElement>(`input[name="${inputName}"]`);
    const output = document.getElementById(outputId);

    if (!output) return;
    inputs.forEach((input) => input.addEventListener('change', () => updateSummary(input, output)));
    inputs.forEach((input) => updateSummary(input, output));
}


function syncThemePreview(input: HTMLInputElement, preview: HTMLImageElement): void {
    if (input.checked) preview.src = THEME_PREVIEWS[input.value];
}


function initThemePreview(): void {
    const inputs = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
    const preview = document.querySelector<HTMLImageElement>('#theme-preview');

    if (!preview) return;
    inputs.forEach((input) => input.addEventListener('change', () => syncThemePreview(input, preview)));
    inputs.forEach((input) => syncThemePreview(input, preview));
}


function getCheckedValue(name: string): string {
    return document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? '';
}


function getGameSettings(): GameSettings {
    return {
        theme: getCheckedValue('theme'),
        player: getCheckedValue('player'),
        cardCount: Number(getCheckedValue('board-size'))
    };
}


function createMemoryCard(index: number): HTMLButtonElement {
    const card = document.createElement('button');

    card.className = 'memory-card';
    card.type = 'button';
    card.dataset.cardIndex = String(index);
    card.setAttribute('aria-label', `Memory card ${index + 1}`);
    return card;
}


function renderBoard(cardCount: number): void {
    const board = document.getElementById('game-board');
    const columns = cardCount === 16 ? 4 : 6;

    if (!board) return;
    board.replaceChildren();
    board.style.setProperty('--board-columns', String(columns));
    for (let index = 0; index < cardCount; index++) board.append(createMemoryCard(index));
}


function updateCurrentPlayer(player: string): void {
    const label = document.getElementById('current-player');
    const indicator = document.getElementById('current-player-indicator');

    if (label) label.textContent = player === 'orange' ? 'Orange' : 'Blue';
    indicator?.setAttribute('data-player', player);
}


function prepareGameScreen(settings: GameSettings): void {
    const gameScreen = document.getElementById('game-screen');

    if (!gameScreen) return;
    gameScreen.dataset.theme = settings.theme;
    gameScreen.dataset.size = String(settings.cardCount);
    updateCurrentPlayer(settings.player);
    renderBoard(settings.cardCount);
}


function startGame(): void {
    prepareGameScreen(getGameSettings());
    document.getElementById('settings-screen')?.classList.add('hidden');
    document.getElementById('game-screen')?.classList.remove('hidden');
}


function exitGame(): void {
    document.getElementById('game-screen')?.classList.add('hidden');
    document.getElementById('settings-screen')?.classList.remove('hidden');
}


function initSettings(): void {
    bindSummary('theme', 'selected-theme');
    bindSummary('player', 'selected-player');
    bindSummary('board-size', 'selected-board-size');
    initThemePreview();
}


function init(): void {
    document.getElementById('play-button')?.addEventListener('click', showSettings);
    document.getElementById('start-button')?.addEventListener('click', startGame);
    document.getElementById('exit-button')?.addEventListener('click', exitGame);
    initSettings();
}


init();
