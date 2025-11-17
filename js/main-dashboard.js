/**
 * Main Dashboard Controller
 * Connects all modules together
 */

import { CalendarManager } from './calendar.js';
import { UIManager } from './ui.js';
import { ChatbotManager } from './chatbot.js';
import { storage } from './storage.js';
import { showNotification } from './notifications.js';
import { parseNaturalLanguage } from './parser.js';

// Global state
let calendar = null;
let ui = null;
let chatbot = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!storage.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize managers
    calendar = new CalendarManager();
    ui = new UIManager(calendar);
    chatbot = new ChatbotManager(calendar);

    // Set UI container
    const container = document.getElementById('calendar-container');
    if (container) {
        ui.setContainer(container);
    }

    // Setup event listeners
    setupEventListeners();

    // Initial render
    updateAll();

    console.log('✅ Dashboard initialized');
});

function setupEventListeners() {
    // View buttons
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calendar.changeView(this.dataset.view);
            updateAll();
        });
    });

    // Navigation buttons
    document.getElementById('prev-period')?.addEventListener('click', () => {
        calendar.previousMonth();
        updateAll();
    });

    document.getElementById('next-period')?.addEventListener('click', () => {
        calendar.nextMonth();
        updateAll();
    });

    document.getElementById('today-btn')?.addEventListener('click', () => {
        calendar.goToToday();
        updateAll();
    });

    // Create event button
    document.getElementById('create-event-btn')?.addEventListener('click', openEventModal);
    document.getElementById('fab')?.addEventListener('click', openEventModal);

    // Event form
    document.getElementById('event-form')?.addEventListener('submit', handleEventSubmit);
    document.getElementById('close-modal')?.addEventListener('click', closeEventModal);
    document.getElementById('cancel-event')?.addEventListener('click', closeEventModal);

    // Color picker
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('event-color').value = this.dataset.color;
        });
    });

    // Priority buttons
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('event-priority').value = this.dataset.priority;
        });
    });

    // Recurring toggle
    document.getElementById('recurring-toggle')?.addEventListener('change', function() {
        document.getElementById('recurring-options').style.display = 
            this.checked ? 'block' : 'none';
    });

    // Voice input
    document.getElementById('voice-btn')?.addEventListener('click', startVoiceInput);

    // Search
    document.getElementById('search-btn')?.addEventListener('click', openSearch);

    // Export/Import
    document.getElementById('export-btn')?.addEventListener('click', exportCalendar);
    document.getElementById('import-btn')?.addEventListener('click', importCalendar);

    // Print
    document.getElementById('print-btn')?.addEventListener('click', () => window.print());

    // Help
    document.getElementById('help-btn')?.addEventListener('click', showShortcuts);

    // Title counter
    document.getElementById('event-title')?.addEventListener('input', function() {
        document.getElementById('title-counter').textContent = `${this.value.length}/100`;
    });
}

function updateAll() {
    // Update calendar view
    ui.render();

    // Update period title
    document.getElementById('current-period').textContent = calendar.getMonthName();

    // Update stats
    ui.updateStats();

    // Update upcoming list
    const upcomingList = document.getElementById('upcoming-list');
    if (upcomingList) {
        ui.renderUpcomingList(upcomingList);
    }

    // Update month progress
    updateMonthProgress();
}

function updateMonthProgress() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const currentDay = now.getDate();
    
    const progress = (currentDay / totalDays) * 100;
    
    const progressBar = document.getElementById('month-progress');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

function openEventModal(dateStr = null) {
    const modal = document.getElementById('event-modal');
    const form = document.getElementById('event-form');
    
    // Reset form
    form.reset();
    document.getElementById('title-counter').textContent = '0/100';
    document.getElementById('recurring-options').style.display = 'none';
    
    // Set default date
    if (dateStr) {
        const date = new Date(dateStr);
        document.getElementById('event-date').value = date.toISOString().split('T')[0];
    } else {
        document.getElementById('event-date').value = new Date().toISOString().split('T')[0];
    }
    
    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10);
    document.getElementById('event-title').focus();
}

function closeEventModal() {
    const modal = document.getElementById('event-modal');
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
}

function handleEventSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const eventData = {
        title: formData.get('title'),
        description: formData.get('description'),
        date: new Date(formData.get('date')),
        time: formData.get('time'),
        duration: parseInt(formData.get('duration')),
        color: formData.get('color'),
        category: formData.get('category'),
        location: formData.get('location'),
        attendees: formData.get('attendees')?.split(',').map(a => a.trim()).filter(a => a),
        priority: formData.get('priority'),
        notes: formData.get('notes'),
        reminders: Array.from(formData.getAll('reminder')).map(r => parseInt(r)),
        recurring: formData.get('recurring') === 'on',
        recurringType: formData.get('recurring-type')
    };
    
    calendar.addEvent(eventData);
    closeEventModal();
    updateAll();
    
    showNotification(`Event "${eventData.title}" created successfully!`, 'success');
}

function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        showNotification('Voice input not supported in this browser', 'error');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    const btn = document.getElementById('voice-btn');
    btn.classList.add('listening');

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        
        try {
            const parsed = parseNaturalLanguage(transcript);
            const event = calendar.addEvent(parsed);
            
            showNotification(`✓ Created: ${event.title}`, 'success');
            updateAll();
        } catch (error) {
            showNotification('Could not understand. Please try again.', 'error');
        }
        
        btn.classList.remove('listening');
    };

    recognition.onerror = () => {
        btn.classList.remove('listening');
        showNotification('Voice input failed', 'error');
    };

    recognition.start();
    showNotification('Listening... Speak now', 'info', 2000);
}

function openSearch() {
    // Create search modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Search Events</h2>
                <button class="btn-icon" onclick="this.closest('.modal-overlay').remove()">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <input type="text" id="search-input" placeholder="Search events..." autofocus>
                </div>
                <div id="search-results"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    document.getElementById('search-input').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const results = calendar.events.filter(e => 
            e.title.toLowerCase().includes(query) ||
            (e.description && e.description.toLowerCase().includes(query))
        );
        
        const container = document.getElementById('search-results');
        if (results.length === 0) {
            container.innerHTML = '<p class="text-muted">No results found</p>';
        } else {
            container.innerHTML = results.map(e => `
                <div class="search-result-item" onclick="window.showEventDetails('${e.id}')">
                    <div class="result-indicator" style="background: ${e.color}"></div>
                    <div class="result-content">
                        <div class="result-title">${e.title}</div>
                        <div class="result-meta">${e.date.toLocaleDateString()} at ${e.time}</div>
                    </div>
                </div>
            `).join('');
        }
    });
}

function exportCalendar() {
    const data = JSON.stringify(calendar.events, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChronoWavel-export-${Date.now()}.json`;
    a.click();
    
    showNotification('Calendar exported successfully!', 'success');
}

function importCalendar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const events = JSON.parse(e.target.result);
                events.forEach(event => calendar.addEvent(event));
                updateAll();
                showNotification(`Imported ${events.length} events!`, 'success');
            } catch (error) {
                showNotification('Invalid file format', 'error');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function showShortcuts() {
    document.getElementById('shortcuts-overlay').style.display = 'flex';
}

window.closeShortcuts = function() {
    document.getElementById('shortcuts-overlay').style.display = 'none';
};

// Global functions
window.selectDate = function(dateStr) {
    openEventModal(dateStr);
};

window.showEventDetails = function(id) {
    const event = calendar.getEventById(id);
    if (!event) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content modal-large">
            <div class="modal-header">
                <h2>Event Details</h2>
                <button class="btn-icon" onclick="this.closest('.modal-overlay').remove()">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="event-detail-header" style="background: ${event.color}; color: white;">
                    <h3>${event.title}</h3>
                    <span class="category-badge">${event.category}</span>
                </div>
                
                <div class="detail-section">
                    <h4>📅 Date & Time</h4>
                    <div class="detail-item">
                        <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M10 6v4l3 3" stroke="currentColor" stroke-width="2"/></svg>
                        <span>${event.date.toLocaleDateString()} at ${event.time}</span>
                    </div>
                    <div class="detail-item">
                        <svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
                        <span>Duration: ${event.duration} minutes</span>
                    </div>
                </div>
                
                ${event.description ? `
                <div class="detail-section">
                    <h4>📝 Description</h4>
                    <p>${event.description}</p>
                </div>
                ` : ''}
                
                ${event.location ? `
                <div class="detail-section">
                    <h4>📍 Location</h4>
                    <p>${event.location}</p>
                </div>
                ` : ''}
                
                ${event.attendees?.length ? `
                <div class="detail-section">
                    <h4>👥 Attendees</h4>
                    <div class="attendees-list">
                        ${event.attendees.map(a => `<span class="attendee-badge">${a}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                <button class="btn-danger" onclick="window.deleteEvent('${event.id}')">Delete</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
};

window.deleteEvent = function(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        calendar.deleteEvent(id);
        document.querySelector('.modal-overlay')?.remove();
        updateAll();
        showNotification('Event deleted', 'success');
    }
};

window.showDayEvents = function(dateStr) {
    const date = new Date(dateStr);
    const events = calendar.getEventsByDate(date);
    
    // Open modal with all events for that day
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
                <button class="btn-icon" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">
                ${events.map(e => `
                    <div class="agenda-event" onclick="window.showEventDetails('${e.id}')">
                        <span class="event-time">${e.time}</span>
                        <div class="event-indicator" style="background: ${e.color}"></div>
                        <div class="event-details">
                            <div class="event-title">${e.title}</div>
                            ${e.description ? `<div class="event-description">${e.description}</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
};

window.updateAll = updateAll;
window.openEventModal = openEventModal;

console.log('✅ Dashboard controller loaded');
