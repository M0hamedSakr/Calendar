/**
 * UI Manager
 */

export class UIManager {
    constructor(calendar) {
        this.calendar = calendar;
        this.container = null;
    }

    setContainer(element) {
        this.container = element;
    }

    render() {
        if (!this.container) return;

        if (this.calendar.view === 'month') {
            this.renderMonthView();
        } else if (this.calendar.view === 'week') {
            this.renderWeekView();
        } else if (this.calendar.view === 'agenda') {
            this.renderAgendaView();
        }
    }

    renderMonthView() {
        const days = this.calendar.getCalendarDays();
        
        let html = '<div class="calendar-grid">';
        html += '<div class="calendar-weekdays">';
        
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            html += `<div class="weekday-name">${day}</div>`;
        });
        
        html += '</div><div class="calendar-days-grid">';
        
        days.forEach(day => {
            const classes = ['calendar-day'];
            if (!day.isCurrentMonth) classes.push('other-month');
            if (day.isToday) classes.push('today');
            if (day.isWeekend) classes.push('weekend');
            
            html += `<div class="${classes.join(' ')}" data-date="${day.date.toISOString()}" 
                     onclick="window.selectDate('${day.date.toISOString()}')">`;
            html += `<div class="day-header">`;
            html += `<span class="day-number">${day.date.getDate()}</span>`;
            if (day.isToday) {
                html += `<span class="today-badge">Today</span>`;
            }
            html += `</div>`;
            
            if (day.events.length > 0) {
                html += `<div class="day-events">`;
                day.events.slice(0, 3).forEach(event => {
                    html += `<div class="event-item" style="border-left-color: ${event.color}" 
                             onclick="event.stopPropagation(); window.showEventDetails('${event.id}')">`;
                    html += `<span class="event-time">${event.time}</span>`;
                    html += `<span class="event-title">${event.title}</span>`;
                    html += `</div>`;
                });
                if (day.events.length > 3) {
                    html += `<div class="more-events" onclick="event.stopPropagation(); window.showDayEvents('${day.date.toISOString()}')">
                        +${day.events.length - 3} more
                    </div>`;
                }
                html += `</div>`;
            }
            
            html += `</div>`;
        });
        
        html += '</div></div>';
        this.container.innerHTML = html;
    }

    renderWeekView() {
        this.container.innerHTML = '<div class="empty-state"><h3>Week View</h3><p>Coming soon!</p></div>';
    }

    renderAgendaView() {
        const sortedEvents = [...this.calendar.events].sort((a, b) => a.date - b.date);
        
        if (sortedEvents.length === 0) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📅</div>
                    <h3>No Events</h3>
                    <p>You don't have any events scheduled. Create your first event!</p>
                    <button class="btn-primary" onclick="window.openEventModal()">Create Event</button>
                </div>
            `;
            return;
        }

        let html = '<div class="agenda-view"><div class="agenda-list">';
        
        const groupedEvents = this.groupEventsByDate(sortedEvents);
        
        Object.keys(groupedEvents).forEach(dateKey => {
            const events = groupedEvents[dateKey];
            const date = new Date(dateKey);
            
            html += `<div class="agenda-group">`;
            html += `<div class="agenda-date-header">`;
            html += `<div class="date-badge">`;
            html += `<div class="date-day">${date.getDate()}</div>`;
            html += `<div class="date-month">${date.toLocaleDateString('en-US', { month: 'short' })}</div>`;
            html += `</div>`;
            html += `<div class="date-info">`;
            html += `<div class="date-weekday">${date.toLocaleDateString('en-US', { weekday: 'long' })}</div>`;
            html += `<div class="event-count">${events.length} event${events.length > 1 ? 's' : ''}</div>`;
            html += `</div></div>`;
            
            html += `<div class="agenda-events">`;
            events.forEach(event => {
                html += `<div class="agenda-event" onclick="window.showEventDetails('${event.id}')">`;
                html += `<span class="event-time">${event.time}</span>`;
                html += `<div class="event-indicator" style="background: ${event.color}"></div>`;
                html += `<div class="event-details">`;
                html += `<div class="event-title">${event.title}</div>`;
                if (event.description) {
                    html += `<div class="event-description">${event.description}</div>`;
                }
                html += `<div class="event-meta">`;
                html += `<span>⏱️ ${event.duration} min</span>`;
                if (event.location) {
                    html += `<span>📍 ${event.location}</span>`;
                }
                html += `</div></div></div>`;
            });
            html += `</div></div>`;
        });
        
        html += '</div></div>';
        this.container.innerHTML = html;
    }

    groupEventsByDate(events) {
        return events.reduce((groups, event) => {
            const dateKey = event.date.toDateString();
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(event);
            return groups;
        }, {});
    }

    updateStats() {
        const stats = this.calendar.getStats();
        document.getElementById('total-events').textContent = stats.total;
        document.getElementById('upcoming-events').textContent = stats.upcoming;
        document.getElementById('this-week').textContent = stats.thisWeek;
    }

    renderUpcomingList(container, limit = 5) {
        const now = new Date();
        const upcoming = this.calendar.events
            .filter(e => e.date >= now)
            .sort((a, b) => a.date - b.date)
            .slice(0, limit);

        if (upcoming.length === 0) {
            container.innerHTML = '<p class="text-muted">No upcoming events</p>';
            return;
        }

        let html = '';
        upcoming.forEach(event => {
            html += `<div class="upcoming-item" onclick="window.showEventDetails('${event.id}')">`;
            html += `<div class="upcoming-date">`;
            html += `<div class="date-day">${event.date.getDate()}</div>`;
            html += `<div class="date-month">${event.date.toLocaleDateString('en-US', { month: 'short' })}</div>`;
            html += `</div>`;
            html += `<div class="upcoming-info">`;
            html += `<div class="upcoming-title">${event.title}</div>`;
            html += `<div class="upcoming-time">${event.time} • ${event.duration} min</div>`;
            html += `</div>`;
            html += `<div class="upcoming-indicator" style="background: ${event.color}"></div>`;
            html += `</div>`;
        });
        
        container.innerHTML = html;
    }
}

console.log('✅ UI manager loaded');
