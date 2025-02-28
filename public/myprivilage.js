document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

   
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
  
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});


const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    console.log('Searching for:', searchTerm);
});

// JavaScript to enhance toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get toggle checkbox and relevant elements
    const toggleCheckbox = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.toggle');
    
    // Function to handle resize events
    function handleResize() {
        const width = window.innerWidth;
        
        // Automatically collapse sidebar on small screens
        if (width <= 768) {
            toggleCheckbox.checked = true;
        }
    }
    
    // Initial check on page load
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});