/**
 * Chatbot Manager
 */

import { parseNaturalLanguage } from './parser.js';

export class ChatbotManager {
    constructor(calendar) {
        this.calendar = calendar;
        this.messages = [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createWidget();
        this.addWelcomeMessage();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'chatbot-widget';
        widget.innerHTML = `
            <button class="chatbot-toggle" onclick="window.toggleChatbot()">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M8 12H8.01M12 12H12.01M16 12H16.01" stroke="currentColor" stroke-width="2"/>
                </svg>
            </button>
            <div class="chatbot-window" style="display: none;">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <div>AI Assistant</div>
                        <div class="chatbot-status">● Online</div>
                    </div>
                    <button class="btn-icon" onclick="window.toggleChatbot()">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages"></div>
                <div class="chatbot-input-container">
                    <input type="text" id="chatbot-input" placeholder="Type a message..." 
                           onkeypress="if(event.key==='Enter') window.sendChatMessage()">
                    <button class="btn-primary" onclick="window.sendChatMessage()">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <path d="M2 10L18 2L10 18L8 11L2 10Z" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(widget);

        // Make functions global
        window.toggleChatbot = () => this.toggle();
        window.sendChatMessage = () => this.sendMessage();
    }

    addWelcomeMessage() {
        this.addBotMessage("Hi! 👋 I'm your AI assistant. I can help you create events using natural language. Try saying something like 'Team meeting tomorrow at 3pm'");
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const window = document.querySelector('.chatbot-window');
        window.style.display = this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen) {
            document.getElementById('chatbot-input').focus();
        }
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addUserMessage(message);
        input.value = '';
        
        // Process message
        setTimeout(() => this.processMessage(message), 500);
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for greetings
        if (lowerMessage.match(/^(hi|hello|hey)/)) {
            this.addBotMessage("Hello! How can I help you today? You can ask me to create events, check your schedule, or answer questions.");
            return;
        }
        
        // Check for help
        if (lowerMessage.includes('help')) {
            this.addBotMessage("I can help you:\n\n✓ Create events using natural language\n✓ Check your schedule\n✓ Set reminders\n✓ Answer questions\n\nTry: 'Schedule lunch with John tomorrow at noon'");
            return;
        }
        
        // Check for schedule queries
        if (lowerMessage.includes('schedule') || lowerMessage.includes('what') && lowerMessage.includes('today')) {
            const today = new Date();
            const events = this.calendar.getEventsByDate(today);
            
            if (events.length === 0) {
                this.addBotMessage("You have no events scheduled for today. Your calendar is clear! 📅");
            } else {
                let response = `You have ${events.length} event${events.length > 1 ? 's' : ''} today:\n\n`;
                events.forEach(e => {
                    response += `• ${e.time} - ${e.title}\n`;
                });
                this.addBotMessage(response);
            }
            return;
        }
        
        // Try to parse as event creation
        try {
            const parsed = parseNaturalLanguage(message);
            const event = this.calendar.addEvent(parsed);
            
            this.addBotMessage(`✓ Event created!\n\n📅 ${event.title}\n🕐 ${new Date(event.date).toLocaleDateString()} at ${event.time}\n⏱️ Duration: ${event.duration} minutes\n\nAnything else I can help you with?`);
            
            // Trigger UI update
            if (window.updateAll) {
                window.updateAll();
            }
        } catch (error) {
            this.addBotMessage("I'm not sure I understood that. Could you try rephrasing? For example:\n\n'Meeting with Sarah tomorrow at 2pm'\n'Gym session Friday 6am'");
        }
    }

    addUserMessage(text) {
        this.messages.push({ type: 'user', text, timestamp: new Date() });
        this.renderMessages();
    }

    addBotMessage(text) {
        this.messages.push({ type: 'bot', text, timestamp: new Date() });
        this.renderMessages();
    }

    renderMessages() {
        const container = document.getElementById('chatbot-messages');
        if (!container) return;
        
        container.innerHTML = this.messages.map(msg => `
            <div class="chatbot-message chatbot-message-${msg.type}">
                <div class="message-bubble">${msg.text}</div>
            </div>
        `).join('');
        
        container.scrollTop = container.scrollHeight;
    }
}

console.log('✅ Chatbot loaded');
