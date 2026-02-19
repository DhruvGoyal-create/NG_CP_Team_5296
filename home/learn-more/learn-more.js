// Learn More Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Learn more page functionality
    console.log('Learn more page loaded');
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize testimonial carousel
    initializeTestimonialCarousel();
});

function initializeAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Observe testimonial items
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    testimonialItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

function initializeScrollEffects() {
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroSection.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // Sticky navigation effect
    const header = document.querySelector('.learn-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        });
    }
}

function initializeTestimonialCarousel() {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    let currentIndex = 0;
    
    if (testimonialItems.length > 0) {
        // Show first testimonial
        testimonialItems[0].style.display = 'block';
        
        // Auto-rotate testimonials
        setInterval(() => {
            testimonialItems[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % testimonialItems.length;
            testimonialItems[currentIndex].style.display = 'block';
            
            // Add fade-in effect
            testimonialItems[currentIndex].style.opacity = '0';
            setTimeout(() => {
                testimonialItems[currentIndex].style.opacity = '1';
            }, 100);
        }, 5000);
    }
}
