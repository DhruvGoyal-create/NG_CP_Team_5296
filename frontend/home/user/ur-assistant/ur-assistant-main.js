// U.R. Assistant Main JavaScript

// Initialize assistant page
function initializeAssistantPage() {
    setupChatInterface();
    loadChatHistory();
    setupEventListeners();
    updateQuickStats();
    setupRealTimeUpdates();
}

// Setup real-time update listeners
function setupRealTimeUpdates() {
    // Listen for transaction changes to update assistant knowledge
    transactionManager.onTransactionEvent('transactionAdded', function(transaction) {
        console.log('New transaction for assistant context:', transaction);
        updateQuickStats();
        // Could trigger assistant analysis here
        analyzeTransactionForInsights(transaction);
    });
    
    transactionManager.onTransactionEvent('transactionUpdated', function(transaction) {
        console.log('Transaction updated for assistant context:', transaction);
        updateQuickStats();
    });
    
    transactionManager.onTransactionEvent('transactionDeleted', function(transactionId) {
        console.log('Transaction deleted for assistant context:', transactionId);
        updateQuickStats();
    });
}

// Analyze transaction for insights
function analyzeTransactionForInsights(transaction) {
    // Get recent transactions for context
    const recentTransactions = transactionManager.getRecentTransactions(10);
    const stats = transactionManager.getTransactionStats();
    
    // Generate insights based on the new transaction
    let insight = '';
    
    if (transaction.type === 'expense' && transaction.amount > stats.averageTransaction * 2) {
        insight = `I notice this expense of ₹${transaction.amount.toLocaleString('en-IN')} is higher than your average. Consider if this fits your budget.`;
    } else if (transaction.category === 'food' && transaction.amount > 1000) {
        insight = `This dining expense is significant. You might want to track your food budget this month.`;
    } else if (transaction.type === 'income') {
        insight = `Great! An income of ₹${transaction.amount.toLocaleString('en-IN')}. Consider allocating portions for savings, investments, and expenses.`;
    }
    
    if (insight) {
        // Optional: Show insight notification
        console.log('Assistant Insight:', insight);
        // Could add a subtle notification or update the assistant's knowledge
    }
}

// Setup chat interface
function setupChatInterface() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    // Auto-resize textarea
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            updateCharacterCount();
        });
        
        // Enter to send, Shift+Enter for new line
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
}

// Load chat history
function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const chatMessages = document.getElementById('chatMessages');
    
    if (chatHistory.length === 0) {
        // Show welcome message
        addMessage('Hello! I\'m your U.R. (Ultimate Reasoning) Assistant. I can help you with:\n\n• 💰 Budget planning and advice\n• 📊 Spending analysis and insights\n• 🎯 Financial goal setting\n• 💡 Money-saving tips\n• 📈 Investment guidance\n• 🔍 Expense categorization help\n\nHow can I assist you today?', 'assistant');
        return;
    }
    
    chatHistory.forEach(msg => {
        addMessage(msg.text, msg.sender, msg.time);
    });
}

// Send message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || isTyping) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    updateCharacterCount();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate AI response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addMessage(response, 'assistant');
        saveChatMessage(message, 'user');
        saveChatMessage(response, 'assistant');
    }, 1000 + Math.random() * 2000);
}

// Send quick message
function sendQuickMessage(message) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = message;
    sendMessage();
}

// Add message to chat
function addMessage(text, sender, time) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'assistant' ? '🤖' : '👤';
    const messageTime = time || new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text">${text}</div>
            <div class="message-time">${messageTime}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate AI response
function generateAIResponse(userMessage) {
    const responses = {
        'save money': 'Based on your spending patterns, here are some ways to save money:\n\n1. 🍔 Reduce food expenses by 20% through meal planning\n2. 🚗 Use public transport twice a week\n3. 🛍️ Review subscription services and cancel unused ones\n4. 💳 Set up automatic transfers to savings\n\nWould you like me to create a detailed savings plan?',
        'spending pattern': 'Looking at your recent transactions:\n\n📊 **Spending Analysis:**\n• Food & Dining: ₹15,000 (33% of budget)\n• Transportation: ₹8,000 (18%)\n• Shopping: ₹7,500 (17%)\n• Utilities: ₹6,000 (13%)\n• Entertainment: ₹4,500 (10%)\n• Others: ₹4,230 (9%)\n\n🔍 **Key Insights:**\n• Food spending is 25% higher than last month\n• Transportation costs are well controlled\n• Consider setting a stricter food budget',
        'budget': 'I\'ll help you create a personalized budget! Based on your income of ₹50,000:\n\n💰 **Recommended Budget Allocation:**\n• 🏠 Housing: 30% (₹15,000)\n• 🍔 Food: 20% (₹10,000)\n• 🚗 Transport: 15% (₹7,500)\n• 🛍️ Shopping: 10% (₹5,000)\n• 💳 Bills & Utilities: 10% (₹5,000)\n• 🎬 Entertainment: 5% (₹2,500)\n• 💰 Savings: 10% (₹5,000)\n\nWould you like me to help you track this budget?',
        'investment': 'Here\'s some investment advice for beginners:\n\n📈 **Start with these basics:**\n1. 🏦 Emergency Fund: 3-6 months expenses\n2. 📊 SIP in Index Funds: Start with ₹1,000/month\n3. 🏠 PPF: Tax benefits + stable returns\n4. 💰 Mutual Funds: Diversified equity funds\n\n⚠️ **Golden Rules:**\n• Never invest more than you can afford to lose\n• Diversify across different asset classes\n• Think long-term (5+ years)\n• Review portfolio quarterly\n\nWant specific fund recommendations?',
        'default': 'I understand you\'re asking about: "' + userMessage + '". Let me help you with that.\n\nBased on your financial profile, I can provide personalized advice. Could you tell me more about what specific aspect you\'d like to explore?\n\n🎯 **I can help with:**\n• Budget planning and optimization\n• Expense reduction strategies\n• Savings goal setting\n• Investment guidance\n• Debt management\n• Tax planning tips\n\nWhat would you like to focus on?'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return responses['default'];
}

// Show typing indicator
function showTypingIndicator() {
    isTyping = true;
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Update character count
function updateCharacterCount() {
    const messageInput = document.getElementById('messageInput');
    const characterCount = document.querySelector('.character-count');
    
    if (messageInput && characterCount) {
        const count = messageInput.value.length;
        characterCount.textContent = `${count} / 500`;
        
        if (count > 450) {
            characterCount.style.color = '#f5576c';
        } else if (count > 400) {
            characterCount.style.color = '#f093fb';
        } else {
            characterCount.style.color = '#666';
        }
    }
}

// Update quick stats
function updateQuickStats() {
    const stats = getQuickStats();
    
    document.querySelector('.stat-value:nth-child(1)').textContent = '₹' + stats.monthlySpending.toLocaleString('en-IN');
    document.querySelector('.stat-value:nth-child(2)').textContent = stats.budgetUsed + '%';
    document.querySelector('.stat-value:nth-child(3)').textContent = stats.savingsRate + '%';
}

// Get quick stats
function getQuickStats() {
    return {
        monthlySpending: 45230,
        budgetUsed: 90,
        savingsRate: 15
    };
}

// Save chat message
function saveChatMessage(text, sender) {
    const chatHistory = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    chatHistory.push({
        text,
        sender,
        time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    });
    
    // Keep only last 50 messages
    if (chatHistory.length > 50) {
        chatHistory.shift();
    }
    
    localStorage.setItem('chatMessages', JSON.stringify(chatHistory));
}

// Clear chat
function clearChat() {
    if (confirm('Are you sure you want to clear all messages?')) {
        localStorage.removeItem('chatMessages');
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="message assistant-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="message-text">Chat cleared! How can I help you today?</div>
                    <div class="message-time">Just now</div>
                </div>
            </div>
        `;
        showNotification('Chat cleared successfully!', 'success');
    }
}

// Toggle settings
function toggleSettings() {
    showNotification('Assistant settings coming soon!', 'info');
}

// Setup event listeners
function setupEventListeners() {
    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            sendQuickMessage(this.textContent.trim());
        });
    });
    
    // Action buttons
    const clearBtn = document.querySelector('.action-btn[onclick*="clearChat"]');
    const settingsBtn = document.querySelector('.action-btn[onclick*="toggleSettings"]');
    
    if (clearBtn) {
        clearBtn.onclick = clearChat;
    }
    
    if (settingsBtn) {
        settingsBtn.onclick = toggleSettings;
    }
    
    // Suggested actions
    document.querySelectorAll('.action-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            sendQuickMessage(this.textContent.trim());
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize page on DOM load
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuth()) {
        setLoginTime();
        initializeAssistantPage();
    }
});
