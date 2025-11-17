/**
 * Calendar Manager
 */

import { storage } from './storage.js';
import { EVENT_COLORS } from './config.js';

export class CalendarManager {
    constructor() {
        this.events = this.loadEvents();
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.view = 'month';
    }

    loadEvents() {
        const events = storage.getEvents();
        return events.map(e => ({
            ...e,
            date: new Date(e.date),
            createdAt: new Date(e.createdAt),
            updatedAt: e.updatedAt ? new Date(e.updatedAt) : null
        }));
    }

    saveEvents() {
        storage.saveEvents(this.events);
    }

    addEvent(eventData) {
        const event = {
            id: this.generateId(),
            title: eventData.title,
            description: eventData.description || '',
            date: eventData.date instanceof Date ? eventData.date : new Date(eventData.date),
            time: eventData.time || '12:00',
            duration: eventData.duration || 60,
            color: eventData.color || EVENT_COLORS.blue,
            category: eventData.category || 'general',
            reminders: eventData.reminders || [],
            recurring: eventData.recurring || false,
            recurringType: eventData.recurringType || null,
            location: eventData.location || '',
            attendees: eventData.attendees || [],
            priority: eventData.priority || 'medium',
            notes: eventData.notes || '',
            createdAt: new Date(),
            updatedAt: null
        };

        this.events.push(event);
        this.saveEvents();
        return event;
    }

    updateEvent(id, updates) {
        const index = this.events.findIndex(e => e.id === id);
        if (index !== -1) {
            this.events[index] = {
                ...this.events[index],
                ...updates,
                updatedAt: new Date()
            };
            this.saveEvents();
            return this.events[index];
        }
        return null;
    }

    deleteEvent(id) {
        this.events = this.events.filter(e => e.id !== id);
        this.saveEvents();
    }

    getEventsByDate(date) {
        return this.events.filter(e => 
            e.date.toDateString() === date.toDateString()
        );
    }

    getEventById(id) {
        return this.events.find(e => e.id === id);
    }

    changeView(view) {
        this.view = view;
    }

    goToToday() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.currentDate = new Date(this.currentDate);
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.currentDate = new Date(this.currentDate);
    }

    getMonthName() {
        return this.currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
    }

    getCalendarDays() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const days = [];
        const current = new Date(startDate);
        
        for (let i = 0; i < 42; i++) {
            days.push({
                date: new Date(current),
                isCurrentMonth: current.getMonth() === month,
                isToday: current.toDateString() === new Date().toDateString(),
                isWeekend: current.getDay() === 0 || current.getDay() === 6,
                events: this.getEventsByDate(current)
            });
            current.setDate(current.getDate() + 1);
        }
        
        return days;
    }

    getStats() {
        const now = new Date();
        const upcoming = this.events.filter(e => e.date >= now);
        const thisWeek = this.events.filter(e => {
            const diff = e.date - now;
            return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
        });

        return {
            total: this.events.length,
            upcoming: upcoming.length,
            thisWeek: thisWeek.length
        };
    }

    generateId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

console.log('✅ Calendar manager loaded');
