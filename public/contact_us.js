// Contact Us Page JavaScript for DRAKZ

document.addEventListener('DOMContentLoaded', function() {
    // Handle FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle the clicked item
            item.classList.toggle('active');
        });
    });
    
    // Form validation and submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form fields
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();
            const terms = document.getElementById('terms').checked;
            
            // Validate form
            let isValid = true;
            let errorMessage = '';
            
            if (name === '') {
                isValid = false;
                errorMessage += 'Please enter your name.\n';
                highlightField('name');
            }
            
            if (email === '') {
                isValid = false;
                errorMessage += 'Please enter your email address.\n';
                highlightField('email');
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Please enter a valid email address.\n';
                highlightField('email');
            }
            
            if (phone !== '' && !isValidPhone(phone)) {
                isValid = false;
                errorMessage += 'Please enter a valid phone number.\n';
                highlightField('phone');
            }
            
            if (subject === '' || subject === null) {
                isValid = false;
                errorMessage += 'Please select a subject.\n';
                highlightField('subject');
            }
            
            if (message === '') {
                isValid = false;
                errorMessage += 'Please enter your message.\n';
                highlightField('message');
            }
            
            if (!terms) {
                isValid = false;
                errorMessage += 'Please agree to the terms and privacy policy.\n';
                highlightField('terms');
            }
            
            // If validation passes, submit the form (or show success message)
            if (isValid) {
                // In a real implementation, you would send the data to your server here
                // For this example, we'll just show a success message
                showSuccessMessage();
                contactForm.reset();
            } else {
                // Show error message
                alert('Please correct the following errors:\n\n' + errorMessage);
            }
        });
    }
    
    // Helper functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        // Basic validation for international phone numbers
        // Allows +, spaces, dashes, and parentheses
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
        return phoneRegex.test(phone);
    }
    
    function highlightField(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.add('error');
        
        field.addEventListener('input', function() {
            field.classList.remove('error');
        }, { once: true });
    }
    
    function showSuccessMessage() {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully. We'll get back to you soon.</p>
        `;
        
        // Replace form with success message
        const formContainer = document.querySelector('.contact-form-container');
        formContainer.innerHTML = '';
        formContainer.appendChild(successMessage);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Add CSS for form validation and success message
    const style = document.createElement('style');
    style.textContent = `
        input.error, textarea.error, select.error {
            border-color: #e74c3c !important;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2) !important;
        }
        
        .checkbox-container.error {
            color: #e74c3c;
        }
        
        .success-message {
            text-align: center;
            padding: 30px;
            animation: fadeIn 0.5s ease-in-out;
        }
        
        .success-icon {
            font-size: 4rem;
            color: #2ecc71;
            margin-bottom: 20px;
        }
        
        .success-message h3 {
            margin: 0 0 15px;
            color: #2c3e50;
            font-size: 1.8rem;
        }
        
        .success-message p {
            color: #7f8c8d;
            font-size: 1.1rem;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize Google Maps when API is loaded
    // This function would be called by the Google Maps API script
    window.initMap = function() {
        // Check if we're on a page with a map
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (mapPlaceholder) {
            // Replace placeholder with actual map
            const mapFrame = document.querySelector('.map-frame');
            mapFrame.innerHTML = '';
            
            const map = new google.maps.Map(mapFrame, {
                center: { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
                zoom: 15,
                styles: [
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#e9e9e9"
                            },
                            {
                                "lightness": 17
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#f5f5f5"
                            },
                            {
                                "lightness": 20
                            }
                        ]
                    }
                    // Add more custom styles as needed
                ]
            });
            
            // Add a marker for the office location
            const marker = new google.maps.Marker({
                position: { lat: 12.9716, lng: 77.5946 },
                map: map,
                title: "DRAKZ Office",
                animation: google.maps.Animation.DROP
            });
            
            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 10px; max-width: 200px;">
                        <h3 style="margin: 0 0 5px; color: #2c3e50; font-size: 16px;">DRAKZ Headquarters</h3>
                        <p style="margin: 0; color: #7f8c8d; font-size: 14px;">
                            Innovation Hub,<br>
                            Tech Campus, Suite 203<br>
                            Bangalore, Karnataka, India
                        </p>
                    </div>
                `
            });
            
            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });
        }
    };
    
    // To load Google Maps API, you would add the script tag with your API key when deploying
    // Commented out since this would be added when the site is deployed
    /*
    const mapsScript = document.createElement('script');
    mapsScript.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
    mapsScript.async = true;
    mapsScript.defer = true;
    document.body.appendChild(mapsScript);
    */
});