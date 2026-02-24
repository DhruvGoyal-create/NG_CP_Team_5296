// Terms of Service Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Terms of service page functionality
    console.log('Terms of service page loaded');
    
    // Initialize smooth scrolling
    initializeSmoothScroll();
    
    // Initialize section highlighting
    initializeSectionHighlighting();
    
    // Initialize print functionality
    initializePrintFunctionality();
});

function initializeSmoothScroll() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initializeSectionHighlighting() {
    const sections = document.querySelectorAll('.terms-section');
    
    // Highlight section on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active states if needed
        updateActiveSection(current);
    });
}

function updateActiveSection(currentSection) {
    // Add visual feedback for current section
    const sections = document.querySelectorAll('.terms-section');
    
    sections.forEach(section => {
        if (section.getAttribute('id') === currentSection) {
            section.style.borderLeft = '4px solid #667eea';
            section.style.background = 'linear-gradient(to right, rgba(102, 126, 234, 0.05), transparent)';
        } else {
            section.style.borderLeft = 'none';
            section.style.background = 'white';
        }
    });
}

function initializePrintFunctionality() {
    // Add print button
    const header = document.querySelector('.header-content');
    if (header) {
        const printButton = document.createElement('button');
        printButton.textContent = '🖨️ Print Terms';
        printButton.className = 'print-button';
        printButton.style.cssText = `
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            margin-left: 20px;
            transition: all 0.3s ease;
        `;
        
        printButton.addEventListener('click', function() {
            window.print();
        });
        
        printButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
        });
        
        printButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        header.appendChild(printButton);
    }
    
    // Add print styles
    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            .terms-header {
                background: white !important;
                box-shadow: none !important;
            }
            
            .back-link {
                display: none !important;
            }
            
            .print-button {
                display: none !important;
            }
            
            .terms-section {
                break-inside: avoid;
                page-break-inside: avoid;
            }
            
            .terms-footer {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
    `;
    document.head.appendChild(printStyles);
}
