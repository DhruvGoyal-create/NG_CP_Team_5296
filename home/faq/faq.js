// FAQ Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // FAQ functionality
    console.log('FAQ page loaded');
    
    // Initialize FAQ items
    initializeFAQ();
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchFAQs);
    }
});

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggleIcon = item.querySelector('.toggle-icon');
        
        if (question && answer && toggleIcon) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.toggle-icon');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                            otherAnswer.style.padding = '0';
                        }
                        if (otherIcon) {
                            otherIcon.textContent = '+';
                        }
                    }
                });
                
                // Toggle current FAQ item
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                    answer.style.padding = '0';
                    toggleIcon.textContent = '+';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = '500px';
                    answer.style.padding = '20px';
                    toggleIcon.textContent = '×';
                }
            });
        }
    });
}

function searchFAQs() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            const questionText = question.textContent.toLowerCase();
            const answerText = answer.textContent.toLowerCase();
            
            if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

function filterCategory(category) {
    const faqItems = document.querySelectorAll('.faq-item');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Update active button
    categoryButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(category) || 
            (category === 'all' && btn.textContent.toLowerCase() === 'all')) {
            btn.classList.add('active');
        }
    });
    
    // Filter FAQ items
    faqItems.forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
        } else {
            const itemCategory = item.getAttribute('data-category');
            if (itemCategory === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}
