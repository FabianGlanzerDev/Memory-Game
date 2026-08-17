const THEME_PREVIEWS: Record<string, string> = {
    coding: './assets/img/settings/coding-vibes.svg',
    gaming: './assets/img/settings/gaming.svg',
    projects: './assets/img/settings/da-projects.svg',
    foods: './assets/img/settings/foods.svg'
};



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


function initSettings(): void {
    bindSummary('theme', 'selected-theme');
    bindSummary('player', 'selected-player');
    bindSummary('board-size', 'selected-board-size');
    initThemePreview();
}


function init(): void {
    document.getElementById('play-button')?.addEventListener('click', showSettings);
    initSettings();
}


init();
