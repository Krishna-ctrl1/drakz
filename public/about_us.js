// about_us.js - Enhanced interactivity for DRAKZ About Us page

document.addEventListener('DOMContentLoaded', function() {
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section-subtitle, .team-member, .about-text');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };

    // Initial check for elements in view
    animateOnScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    
    // Team member image placeholder generation
    const memberImgs = document.querySelectorAll('.member-img');
    const colors = ['#3498db', '#2980b9', '#1abc9c', '#16a085', '#9b59b6'];
    const icons = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🏫'];
    
    memberImgs.forEach((img, index) => {
        // Create gradient background with team colors
        img.style.background = `linear-gradient(135deg, ${colors[index % colors.length]}, #ecf0f1)`;
        
        // Add emoji as placeholder (until real images are added)
        const icon = document.createElement('span');
        icon.textContent = icons[index % icons.length];
        icon.style.fontSize = '3.5rem';
        img.appendChild(icon);
        
        // Add hover effect
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.08) rotate(5deg)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Make navigation active based on current section
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        if (button.getAttribute('onclick').includes('about.html')) {
            button.classList.add('active');
        }
    });
    
    // Add subtle parallax effect to background
    window.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.body.style.backgroundPosition = `${x * 10}px ${y * 10}px`;
    });
    
    // Smooth scroll for navigation anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button appears after scrolling
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const backToTopBtn = document.getElementById('back-to-top');
        
        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        }
    });
    
    // Add expanding effect to team member cards on click
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            // Toggle expanded class
            this.classList.toggle('expanded');
            
            // Reset any other expanded cards
            teamMembers.forEach(otherMember => {
                if (otherMember !== this) {
                    otherMember.classList.remove('expanded');
                }
            });
        });
    });
});

// Add a "Back to Top" button dynamically
window.onload = function() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('title', 'Back to Top');
    document.body.appendChild(backToTopBtn);
    
    // Style the button
    backToTopBtn.style.position = 'fixed';
    backToTopBtn.style.bottom = '30px';
    backToTopBtn.style.right = '30px';
    backToTopBtn.style.width = '50px';
    backToTopBtn.style.height = '50px';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.backgroundColor = '#3498db';
    backToTopBtn.style.color = 'white';
    backToTopBtn.style.border = 'none';
    backToTopBtn.style.fontSize = '1.5rem';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.visibility = 'hidden';
    backToTopBtn.style.transition = 'all 0.3s ease';
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#2980b9';
        this.style.transform = 'translateY(-3px)';
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#3498db';
        this.style.transform = 'translateY(0)';
    });
};