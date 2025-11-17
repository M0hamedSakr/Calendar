/**
 * Navigation Bar Component
 */

import { storage } from './storage.js';
import { initTheme } from './theme.js';

export function initNavbar() {
    const navbarRoot = document.getElementById('navbar-root');
    if (!navbarRoot) return;

    const isAuthenticated = storage.isAuthenticated();
    const user = storage.getUser();

    const navbar = `
        <nav class="main-nav">
            <div class="container nav-container">
                <a href="index.html" class="logo">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" fill="none" stroke-width="2"/>
                        <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    BrandCal
                </a>
                
                <button class="mobile-menu-toggle" id="mobile-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div class="nav-links" id="nav-links">
                    <a href="features.html">Features</a>
                    <a href="pricing.html">Pricing</a>
                    <a href="about.html">About</a>
                    <a href="contact.html">Contact</a>
                    ${isAuthenticated ? `
                        <a href="dashboard.html">Dashboard</a>
                    ` : ''}
                    
                    <button class="theme-toggle" id="theme-toggle" title="Toggle Theme">
                        <svg width="20" height="20" viewBox="0 0 20 20" class="sun-icon" style="display: none;">
                            <circle cx="10" cy="10" r="4" fill="currentColor"/>
                            <path d="M10 1v2M10 17v2M18 10h-2M4 10H2M15.66 4.34l-1.41 1.41M5.75 14.25l-1.41 1.41M15.66 15.66l-1.41-1.41M5.75 5.75L4.34 4.34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <svg width="20" height="20" viewBox="0 0 20 20" class="moon-icon">
                            <path d="M17 10.5A7 7 0 119.5 3a6 6 0 007.5 7.5z" fill="currentColor"/>
                        </svg>
                    </button>

                    ${isAuthenticated ? `
                        <div class="nav-user-menu">
                            <button class="user-menu-toggle" id="user-menu-toggle">
                                <div class="user-avatar">${getUserInitials(user)}</div>
                                <span>${user?.name || 'User'}</span>
                                <svg width="16" height="16" viewBox="0 0 16 16">
                                    <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                                </svg>
                            </button>
                            <div class="user-dropdown" id="user-dropdown">
                                <a href="profile.html">
                                    <svg width="16" height="16" viewBox="0 0 16 16">
                                        <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                                        <path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" stroke-width="2" fill="none"/>
                                    </svg>
                                    Profile
                                </a>
                                <a href="settings.html">
                                    <svg width="16" height="16" viewBox="0 0 16 16">
                                        <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" stroke-width="2" fill="none"/>
                                        <path d="M14 8c0-.5-.1-1-.3-1.5l1.6-1-1.6-2.8-1.8.6c-.7-.6-1.6-1-2.5-1.2L9 0H7l-.4 1.5c-.9.2-1.8.6-2.5 1.2l-1.8-.6L.7 4.9l1.6 1C2.1 6.4 2 6.9 2 7.4v1.2c0 .5.1 1 .3 1.5l-1.6 1 1.6 2.8 1.8-.6c.7.6 1.6 1 2.5 1.2L7 16h2l.4-1.5c.9-.2 1.8-.6 2.5-1.2l1.8.6 1.6-2.8-1.6-1c.2-.5.3-1 .3-1.5v-1.2z" stroke="currentColor" stroke-width="2" fill="none"/>
                                    </svg>
                                    Settings
                                </a>
                                <a href="help.html">
                                    <svg width="16" height="16" viewBox="0 0 16 16">
                                        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
                                        <path d="M6 6a2 2 0 014 0c0 1.5-2 2-2 3M8 11v1" stroke="currentColor" stroke-width="2"/>
                                    </svg>
                                    Help
                                </a>
                                <button onclick="window.logout()">
                                    <svg width="16" height="16" viewBox="0 0 16 16">
                                        <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" stroke-width="2" fill="none"/>
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    ` : `
                        <a href="login.html" class="btn-secondary">Login</a>
                        <a href="signup.html" class="btn-primary">Sign Up</a>
                    `}
                </div>
            </div>
        </nav>
    `;

    navbarRoot.innerHTML = navbar;

    // Setup event listeners
    setupNavbarListeners();
}

function setupNavbarListeners() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    
    mobileToggle?.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // User menu toggle
    const userMenuToggle = document.getElementById('user-menu-toggle');
    const userDropdown = document.getElementById('user-dropdown');
    
    userMenuToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        userDropdown?.classList.remove('active');
    });

    // Highlight active page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function getUserInitials(user) {
    if (!user || !user.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Global logout function
window.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        storage.clearUser();
        window.location.href = 'index.html';
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
} else {
    initNavbar();
}

console.log('✅ Navbar loaded');
