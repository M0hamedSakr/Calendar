/**
 * Application Configuration
 */

export const APP_CONFIG = {
    name: 'ChronoWavel',
    version: '1.0.0',
    apiUrl: 'https://api.ChronoWavel.com',
    environment: 'development'
};

export const STORAGE_KEYS = {
    USER: 'ChronoWavel_user',
    EVENTS: 'ChronoWavel_events',
    THEME: 'ChronoWavel_theme',
    SETTINGS: 'ChronoWavel_settings',
    AUTH_TOKEN: 'ChronoWavel_token'
};

export const EVENT_COLORS = {
    blue: '#0577FF',
    purple: '#8B5CF6',
    green: '#10B981',
    orange: '#F59E0B',
    red: '#EF4444',
    pink: '#EC4899',
    teal: '#14B8A6',
    yellow: '#F59E0B'
};

export const CATEGORIES = [
    { id: 'general', name: 'General', color: '#0577FF' },
    { id: 'work', name: 'Work', color: '#0577FF' },
    { id: 'personal', name: 'Personal', color: '#10B981' },
    { id: 'meeting', name: 'Meeting', color: '#8B5CF6' },
    { id: 'event', name: 'Event', color: '#F59E0B' },
    { id: 'health', name: 'Health', color: '#EF4444' }
];

export const REMINDER_OPTIONS = [
    { value: 0, label: 'At time of event' },
    { value: 5, label: '5 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 1440, label: '1 day before' },
    { value: 10080, label: '1 week before' }
];

console.log('✅ Config loaded');
