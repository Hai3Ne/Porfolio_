document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
                
                // Pause game when navigating away from hero section
                if (targetId !== '#home' && window.gameInterface) {
                    window.gameInterface.pauseGame();
                } else if (window.gameInterface) {
                    window.gameInterface.startGame();
                }
            }
        });
    });
    
    // Form submission handler
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
                alert('Please fill in all fields.');
                return;
            }
            
            // Here you would normally send data to a server
            // For demo purposes, we'll just show an alert
            alert(`Thank you ${name}! Your message has been sent.`);
            
            // Clear form
            contactForm.reset();
        });
    }
    
    // Mobile menu toggle functionality (if needed for responsive design)
    const createMobileMenu = () => {
        const nav = document.querySelector('nav');
        const navLinks = document.querySelector('.nav-links');
        
        if (nav && navLinks && window.innerWidth <= 768) {
            // Create menu toggle button
            const menuToggle = document.createElement('div');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<span></span><span></span><span></span>';
            
            // Add to DOM if not already present
            if (!document.querySelector('.menu-toggle')) {
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
            }
        }
    };
    
    // Call once on load and on resize
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);
    
    // Add CSS for mobile menu
    if (window.innerWidth <= 768) {
        const style = document.createElement('style');
        style.textContent = `
            .menu-toggle {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 30px;
                height: 21px;
                cursor: pointer;
                z-index: 200;
            }
            
            .menu-toggle span {
                display: block;
                width: 100%;
                height: 3px;
                background-color: #fff;
                border-radius: 3px;
                transition: all 0.3s;
            }
            
            .menu-toggle.active span:nth-child(1) {
                transform: translateY(9px) rotate(45deg);
            }
            
            .menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .menu-toggle.active span:nth-child(3) {
                transform: translateY(-9px) rotate(-45deg);
            }
            
            .nav-links {
                position: fixed;
                top: 0;
                right: -100%;
                width: 70%;
                height: 100vh;
                background-color: rgba(10, 10, 20, 0.9);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                transition: right 0.3s;
                z-index: 100;
            }
            
            .nav-links.show {
                right: 0;
            }
            
            .nav-links li {
                margin: 15px 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Detect when user scrolls to different sections
    window.addEventListener('scroll', function() {
        const heroSection = document.querySelector('.hero');
        const gameInterface = window.gameInterface;
        
        if (heroSection && gameInterface) {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            // Pause game when scrolled past hero section
            if (scrollPosition > heroBottom) {
                gameInterface.pauseGame();
            } else {
                gameInterface.startGame();
            }
        }
    });
});