/**
 * Notification System
 */

let notificationContainer = null;

export function initNotifications() {
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
}

export function showNotification(message, type = 'info', duration = 3000) {
    initNotifications();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = document.createElement('div');
    icon.className = 'notification-icon';
    icon.textContent = getIcon(type);
    
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    const messageEl = document.createElement('div');
    messageEl.className = 'notification-message';
    messageEl.textContent = message;
    
    content.appendChild(messageEl);
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => removeNotification(notification);
    
    notification.appendChild(icon);
    notification.appendChild(content);
    notification.appendChild(closeBtn);
    
    notificationContainer.appendChild(notification);
    
    setTimeout(() => notification.classList.add('notification-show'), 10);
    
    if (duration > 0) {
        setTimeout(() => removeNotification(notification), duration);
    }
    
    return notification;
}

function removeNotification(notification) {
    notification.classList.remove('notification-show');
    setTimeout(() => notification.remove(), 300);
}

function getIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

export async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
}

export function showBrowserNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
    }
}

console.log('✅ Notifications loaded');
