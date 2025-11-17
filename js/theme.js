/**
 * Theme Management System
 */

const THEME_KEY = 'ChronoWavel_theme';
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
};

// Initialize theme on page load
export function initTheme() {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
    setupThemeListeners();
}

// Get saved theme from localStorage
function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    
    if (saved === THEMES.AUTO) {
        return getSystemTheme();
    }
    
    return saved || THEMES.LIGHT;
}

// Get system theme preference
function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return THEMES.DARK;
    }
    return THEMES.LIGHT;
}

// Apply theme to document
export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcons(theme);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

// Toggle between light and dark
export function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    
    return newTheme;
}

// Set specific theme
export function setTheme(theme) {
    if (!Object.values(THEMES).includes(theme)) {
        console.error('Invalid theme:', theme);
        return;
    }
    
    const actualTheme = theme === THEMES.AUTO ? getSystemTheme() : theme;
    applyTheme(actualTheme);
    localStorage.setItem(THEME_KEY, theme);
}

// Update all theme toggle icons
function updateThemeIcons(theme) {
    const sunIcons = document.querySelectorAll('.sun-icon');
    const moonIcons = document.querySelectorAll('.moon-icon');
    
    sunIcons.forEach(icon => {
        icon.style.display = theme === THEMES.DARK ? 'block' : 'none';
    });
    
    moonIcons.forEach(icon => {
        icon.style.display = theme === THEMES.LIGHT ? 'block' : 'none';
    });
}

// Setup event listeners
function setupThemeListeners() {
    // Listen for theme toggle button clicks
    document.addEventListener('click', (e) => {
        const themeToggle = e.target.closest('#theme-toggle, #dashboard-theme-toggle, .theme-toggle');
        if (themeToggle) {
            toggleTheme();
        }
    });
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const currentPreference = localStorage.getItem(THEME_KEY);
            if (currentPreference === THEMES.AUTO) {
                applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
            }
        });
    }
}

// Get current theme
export function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme');
}

// Check if dark mode is active
export function isDarkMode() {
    return getCurrentTheme() === THEMES.DARK;
}

// Export for use in other modules
export { THEMES };

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

console.log('✅ Theme system initialized');
