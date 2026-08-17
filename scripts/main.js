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
function initSettings() {
    bindSummary('theme', 'selected-theme');
    bindSummary('player', 'selected-player');
    bindSummary('board-size', 'selected-board-size');
    initThemePreview();
}
function init() {
    var _a;
    (_a = document.getElementById('play-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', showSettings);
    initSettings();
}
init();
