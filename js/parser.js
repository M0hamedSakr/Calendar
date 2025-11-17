/**
 * Natural Language Parser for Event Creation
 */

export function parseNaturalLanguage(input) {
    const text = input.toLowerCase().trim();
    
    // Extract title (everything before time/date keywords)
    let title = text;
    const timeKeywords = ['at', 'tomorrow', 'today', 'next', 'on', 'this'];
    for (const keyword of timeKeywords) {
        const index = text.indexOf(keyword);
        if (index !== -1) {
            title = text.substring(0, index).trim();
            break;
        }
    }
    
    // Extract date
    const date = extractDate(text);
    
    // Extract time
    const time = extractTime(text);
    
    // Extract duration
    const duration = extractDuration(text);
    
    // Determine color based on keywords
    const color = determineColor(text);
    
    return {
        title: capitalizeFirst(title) || 'New Event',
        description: '',
        date: date,
        time: time,
        duration: duration,
        color: color,
        category: determineCategory(text),
        reminders: [15]
    };
}

function extractDate(text) {
    const today = new Date();
    
    if (text.includes('today')) {
        return today;
    }
    
    if (text.includes('tomorrow')) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    }
    
    // Check for day of week
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    for (let i = 0; i < days.length; i++) {
        if (text.includes(days[i])) {
            const targetDay = i;
            const currentDay = today.getDay();
            const daysUntil = (targetDay - currentDay + 7) % 7 || 7;
            const result = new Date(today);
            result.setDate(result.getDate() + daysUntil);
            return result;
        }
    }
    
    // Check for "next week"
    if (text.includes('next week')) {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek;
    }
    
    return today;
}

function extractTime(text) {
    // Match formats: 3pm, 3:30pm, 15:00, 3:30
    const timePattern = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;
    const match = text.match(timePattern);
    
    if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const meridiem = match[3];
        
        if (meridiem) {
            if (meridiem.toLowerCase() === 'pm' && hours < 12) {
                hours += 12;
            } else if (meridiem.toLowerCase() === 'am' && hours === 12) {
                hours = 0;
            }
        }
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    return '12:00';
}

function extractDuration(text) {
    // Match patterns like "30min", "1 hour", "2 hours"
    if (text.includes('30min') || text.includes('30 min')) return 30;
    if (text.includes('45min') || text.includes('45 min')) return 45;
    if (text.includes('1 hour') || text.includes('1hr')) return 60;
    if (text.includes('2 hour') || text.includes('2hr')) return 120;
    if (text.includes('3 hour') || text.includes('3hr')) return 180;
    
    return 60; // default 1 hour
}

function determineColor(text) {
    if (text.includes('work') || text.includes('meeting') || text.includes('office')) {
        return '#0577FF'; // blue
    }
    if (text.includes('personal') || text.includes('family')) {
        return '#10B981'; // green
    }
    if (text.includes('gym') || text.includes('workout') || text.includes('exercise')) {
        return '#EF4444'; // red
    }
    if (text.includes('doctor') || text.includes('hospital') || text.includes('health')) {
        return '#F59E0B'; // orange
    }
    
    return '#8B5CF6'; // purple (default)
}

function determineCategory(text) {
    if (text.includes('work') || text.includes('meeting') || text.includes('office')) {
        return 'work';
    }
    if (text.includes('personal') || text.includes('family')) {
        return 'personal';
    }
    if (text.includes('gym') || text.includes('workout')) {
        return 'health';
    }
    
    return 'general';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log('✅ Parser loaded');
