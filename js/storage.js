/**
 * Local Storage Management
 */

import { STORAGE_KEYS } from './config.js';

class StorageManager {
    // User Management
    setUser(userData) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    }

    getUser() {
        const data = localStorage.getItem(STORAGE_KEYS.USER);
        return data ? JSON.parse(data) : null;
    }

    clearUser() {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    isAuthenticated() {
        return !!this.getUser();
    }

    // Events Management
    saveEvents(events) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    }

    getEvents() {
        const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
        return data ? JSON.parse(data) : [];
    }

    clearEvents() {
        localStorage.removeItem(STORAGE_KEYS.EVENTS);
    }

    // Settings Management
    saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }

    getSettings() {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : this.getDefaultSettings();
    }

    getDefaultSettings() {
        return {
            language: 'en',
            timeFormat: '12',
            dateFormat: 'mdy',
            firstDayOfWeek: 0,
            defaultView: 'month',
            defaultDuration: 60,
            defaultReminder: 15,
            notifications: true,
            sounds: true,
            animations: true
        };
    }

    // Auth Token
    setAuthToken(token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }

    getAuthToken() {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    // Clear All Data
    clearAll() {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
}

export const storage = new StorageManager();

console.log('✅ Storage manager loaded');
