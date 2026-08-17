const THEME_PREVIEWS: Record<string, string> = {
    coding: './assets/img/settings/coding-vibes.svg',
    gaming: './assets/img/settings/gaming.svg',
    projects: './assets/img/settings/da-projects.svg',
    foods: './assets/img/settings/foods.svg'
};


const CARD_FRONTS: Record<string, string[]> = {
    coding: createCardPaths('coding'),
    gaming: createCardPaths('gaming'),
    projects: createCardPaths('projects'),
    foods: createCardPaths('foods')
};


type Player = 'blue' | 'orange';


interface GameSettings {
    theme: string;
    player: string;
    cardCount: number;
}


interface MemoryCardData {
    pairId: number;
    image: string;
}


let openedCards: HTMLButtonElement[] = [];
let boardLocked = false;
let flipTimeout: number | undefined;
let currentPlayer: Player = 'blue';
let scores: Record<Player, number> = { blue: 0, orange: 0 };


function formatCardIndex(index: number): string {
    return index < 10 ? `0${index}` : String(index);
}


function createCardPaths(theme: string): string[] {
    const paths: string[] = [];

    for (let index = 1; index <= 18; index++) {
        paths.push(`./assets/img/cards/${theme}/front-${formatCardIndex(index)}.png`);
    }

    return paths;
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


function createDeck(settings: GameSettings): MemoryCardData[] {
    const fronts = CARD_FRONTS[settings.theme] ?? CARD_FRONTS.coding;
    const selected = fronts.slice(0, settings.cardCount / 2);
    const deck: MemoryCardData[] = [];

    selected.forEach((image, pairId) => addPair(deck, image, pairId));
    return shuffleDeck(deck);
}


function addPair(deck: MemoryCardData[], image: string, pairId: number): void {
    deck.push({ pairId, image });
    deck.push({ pairId, image });
}


function shuffleDeck(deck: MemoryCardData[]): MemoryCardData[] {
    for (let index = deck.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [deck[index], deck[randomIndex]] = [deck[randomIndex], deck[index]];
    }

    return deck;
}


function createCardFace(className: string): HTMLSpanElement {
    const face = document.createElement('span');

    face.className = `memory-card-face ${className}`;
    return face;
}


function createFrontFace(image: string): HTMLSpanElement {
    const face = createCardFace('memory-card-front');
    const img = document.createElement('img');

    img.src = image;
    img.alt = '';
    face.append(img);
    return face;
}


function configureCard(card: HTMLButtonElement, data: MemoryCardData, index: number): void {
    card.className = 'memory-card';
    card.type = 'button';
    card.dataset.pairId = String(data.pairId);
    card.dataset.cardIndex = String(index);
    card.setAttribute('aria-label', `Memory card ${index + 1}`);
    card.setAttribute('aria-pressed', 'false');
}


function createMemoryCard(data: MemoryCardData, index: number): HTMLButtonElement {
    const card = document.createElement('button');
    const inner = document.createElement('span');

    configureCard(card, data, index);
    inner.className = 'memory-card-inner';
    inner.append(createCardFace('memory-card-back'), createFrontFace(data.image));
    card.append(inner);
    card.addEventListener('click', () => handleCardClick(card));
    return card;
}


function renderBoard(settings: GameSettings): void {
    const board = document.getElementById('game-board');
    const columns = settings.cardCount === 16 ? 4 : 6;

    if (!board) return;
    board.replaceChildren();
    board.style.setProperty('--board-columns', String(columns));
    createDeck(settings).forEach((data, index) => board.append(createMemoryCard(data, index)));
}


function canFlipCard(card: HTMLButtonElement): boolean {
    return !boardLocked
        && !card.classList.contains('is-flipped')
        && card.dataset.matched !== 'true';
}


function flipCard(card: HTMLButtonElement): void {
    card.classList.add('is-flipped');
    card.setAttribute('aria-pressed', 'true');
}


function handleCardClick(card: HTMLButtonElement): void {
    if (!canFlipCard(card)) return;

    flipCard(card);
    openedCards.push(card);
    if (openedCards.length === 2) checkOpenCards();
}


function checkOpenCards(): void {
    const [first, second] = openedCards;

    if (first.dataset.pairId === second.dataset.pairId) {
        keepMatchedCards();
        return;
    }

    boardLocked = true;
    flipTimeout = window.setTimeout(closeOpenCards, 850);
}


function keepMatchedCards(): void {
    openedCards.forEach((card) => {
        card.dataset.matched = 'true';
        card.disabled = true;
    });

    addPoint();
    openedCards = [];

    if (isGameComplete()) scheduleGameOver();
}


function closeOpenCards(): void {
    openedCards.forEach((card) => {
        card.classList.remove('is-flipped');
        card.setAttribute('aria-pressed', 'false');
    });

    switchPlayer();
    openedCards = [];
    boardLocked = false;
    flipTimeout = undefined;
}


function resetCardInteraction(): void {
    if (flipTimeout !== undefined) window.clearTimeout(flipTimeout);

    openedCards = [];
    boardLocked = false;
    flipTimeout = undefined;
}


function normalizePlayer(player: string): Player {
    return player === 'orange' ? 'orange' : 'blue';
}


function updateCurrentPlayer(player: Player): void {
    const label = document.getElementById('current-player');
    const indicator = document.getElementById('current-player-indicator');

    if (label) label.textContent = player === 'orange' ? 'Orange' : 'Blue';
    indicator?.setAttribute('data-player', player);
}


function updateScore(player: Player): void {
    const output = document.getElementById(`${player}-score`);

    if (output) output.textContent = String(scores[player]);
}


function addPoint(): void {
    scores[currentPlayer] += 1;
    updateScore(currentPlayer);
}


function switchPlayer(): void {
    currentPlayer = currentPlayer === 'blue' ? 'orange' : 'blue';
    updateCurrentPlayer(currentPlayer);
}


function resetScores(): void {
    scores = { blue: 0, orange: 0 };
    updateScore('blue');
    updateScore('orange');
}


function resetPlayerState(player: string): void {
    currentPlayer = normalizePlayer(player);
    resetScores();
    updateCurrentPlayer(currentPlayer);
}


function prepareGameScreen(settings: GameSettings): void {
    const gameScreen = document.getElementById('game-screen');

    if (!gameScreen) return;
    gameScreen.dataset.theme = settings.theme;
    gameScreen.dataset.size = String(settings.cardCount);
    resetCardInteraction();
    resetPlayerState(settings.player);
    renderBoard(settings);
}


function startGame(): void {
    resetResultFlow();
    prepareGameScreen(getGameSettings());
    document.getElementById('settings-screen')?.classList.add('hidden');
    document.getElementById('game-screen')?.classList.remove('hidden');
}


function exitGame(): void {
    resetCardInteraction();
    resetResultFlow();
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
    document.getElementById('new-game-button')?.addEventListener('click', startNewGame);
    initSettings();
}


init();
