document.addEventListener('DOMContentLoaded', function() {
    // Add page load animation
    document.body.classList.add('loaded');
    
    // Initialize animations for sections
    initScrollAnimations();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Mobile menu toggle functionality
    initMobileMenu();
    
    // Form submission handler
    initContactForm();
    
    // Handle game instructions visibility
    handleGameInstructionsVisibility();
    
    // Handle game state based on scroll position
    handleGameState();
    
    // Add hover effects for project cards
    addProjectCardEffects();
});

// Initialize animations that trigger on scroll
function initScrollAnimations() {
    // Elements to animate when they come into view
    const animatedElements = document.querySelectorAll('.section-title, .project-card, .about-content > *, .contact-content > *');
    
    const animateOnScroll = function() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // If element is in viewport
            if (elementPosition < windowHeight - 100) {
                element.classList.add('slide-in');
            }
        });
    };
    
    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Initialize smooth scrolling for navigation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                
                if (navLinks && navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    menuToggle.classList.remove('active');
                }
                
                // Pause game when navigating away from hero section
                if (targetId !== '#home' && window.gameInterface) {
                    window.gameInterface.pauseGame();
                } else if (window.gameInterface) {
                    window.gameInterface.startGame();
                }
            }
        });
    });
}

// Initialize mobile menu functionality
function initMobileMenu() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (nav && navLinks && window.innerWidth <= 768) {
        // Create menu toggle button if not already present
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('div');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<span></span><span></span><span></span>';
            
            nav.insertBefore(menuToggle, navLinks);
            
            // Add click event
            menuToggle.addEventListener('click', function() {
                navLinks.classList.toggle('show');
                menuToggle.classList.toggle('active');
            });
            
            // Close menu when a link is clicked
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('show');
                    menuToggle.classList.remove('active');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!nav.contains(e.target) && navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    menuToggle.classList.remove('active');
                }
            });
        }
    }
}

// Initialize contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Here you would normally send data to a server
            // For demo purposes, we'll just show a success message
            showFormMessage(`Thank you ${name}! Your message has been sent.`, 'success');
            
            // Clear form
            contactForm.reset();
        });
    }
}

// Display form submission messages
function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    
    // Add to DOM
    const contactForm = document.querySelector('.contact-form form');
    contactForm.appendChild(messageEl);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageEl.classList.add('fade-out');
        setTimeout(() => messageEl.remove(), 500);
    }, 5000);
}

// Handle game instructions visibility
function handleGameInstructionsVisibility() {
    const gameInstructions = document.querySelector('.game-instructions');
    const heroSection = document.querySelector('.hero');
    
    if (!gameInstructions || !heroSection) {
        return;
    }
    
    function checkScroll() {
        const heroRect = heroSection.getBoundingClientRect();
        
        // If the bottom of hero section has gone above viewport
        if (heroRect.bottom <= 0) {
            gameInstructions.classList.add('hidden');
        } else {
            gameInstructions.classList.remove('hidden');
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    
    // Check immediately to set initial state
    checkScroll();
}

// Handle game state based on scroll position
function handleGameState() {
    const heroSection = document.querySelector('.hero');
    const gameInterface = window.gameInterface;
    
    if (heroSection && gameInterface) {
        window.addEventListener('scroll', function() {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            // Pause game when scrolled past hero section
            if (scrollPosition > heroBottom) {
                gameInterface.pauseGame();
            } else {
                gameInterface.startGame();
            }
        });
    }
}

// Add hover effects for project cards
function addProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add tilt effect
        card.addEventListener('mousemove', function(e) {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate percentage distance from center (-1 to 1)
            const rotateY = ((mouseX - cardCenterX) / (cardRect.width / 2)) * 5;
            const rotateX = ((cardCenterY - mouseY) / (cardRect.height / 2)) * 5;
            
            // Apply rotation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
}