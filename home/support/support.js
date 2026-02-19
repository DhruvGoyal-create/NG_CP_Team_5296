// Support Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Support page functionality
    console.log('Support page loaded');
    
    // Add interactive functionality for support options
    const supportCards = document.querySelectorAll('.support-card');
    supportCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            supportCards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
        });
    });
    
    // Add hover effects for support buttons
    const supportButtons = document.querySelectorAll('.support-btn');
    supportButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Support functions
function startChat() {
    window.location.href = 'support-assistant.html';
}

function openEmailForm() {
    alert('Email support form would open here. You can also email us directly at support@smartspend.com');
}

