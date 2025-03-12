  // Sidebar toggle functionality
  function openNav() {
    const sidebar = document.getElementById("mySidebar");
    const closeButton = document.getElementById("close-button");
    const main = document.getElementById("main");

    sidebar.style.width = "180px";
    main.style.marginLeft = "180px";
    main.style.width = "calc(100% - 180px)";
    closeButton.innerHTML = '<img width="25" src="assets/icons/sidebarclose.png">';
    closeButton.setAttribute("onclick", "closeNav()");
    sidebar.classList.remove("icons-only");
}

function closeNav() {
    const sidebar = document.getElementById("mySidebar");
    const closeButton = document.getElementById("close-button");
    const main = document.getElementById("main");

    sidebar.style.width = "60px";
    main.style.marginLeft = "60px";
    main.style.width = "calc(100% - 60px)";
    closeButton.innerHTML = '<img width="25" src="assets/icons/sidebaropen.png">';
    closeButton.setAttribute("onclick", "openNav()");
    sidebar.classList.add("icons-only");
}

// Property Management
document.addEventListener('DOMContentLoaded', function() {
    // Property modal functions
    const modal = document.getElementById('propertyModal');
    const addPropertyBtn = document.getElementById('addPropertyBtn');
    const propertyForm = document.getElementById('propertyForm');
    const propertyImageInput = document.getElementById('propertyImage');
    const selectedFileName = document.getElementById('selectedFileName');

    // Open modal to add new property
    addPropertyBtn.addEventListener('click', function() {
        document.getElementById('modalTitle').textContent = 'Add New Property';
        document.getElementById('propertyId').value = '';
        propertyForm.reset();
        selectedFileName.textContent = 'No file selected';
        modal.style.display = 'block';
    });

    // Handle file selection display
    propertyImageInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            selectedFileName.textContent = this.files[0].name;
        } else {
            selectedFileName.textContent = 'No file selected';
        }
    });

    // Form submission
    propertyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const propertyId = document.getElementById('propertyId').value;
        const name = document.getElementById('propertyName').value;
        const value = document.getElementById('propertyValue').value;
        const location = document.getElementById('propertyLocation').value;
        
        // Logic would go here to either add a new property or update an existing one
        console.log('Saving property:', { propertyId, name, value, location });
        
        // For demonstration, let's just close the modal
        closeModal();
    });
});

// Close the modal
function closeModal() {
    document.getElementById('propertyModal').style.display = 'none';
}

// Edit property
function editProperty(propertyId) {
    // In a real implementation, you would fetch property details based on ID
    // For demonstration, let's set some dummy values
    const propertyDetails = {
        id: propertyId,
        name: propertyId === 'property1' ? 'Sunset Villa' : 'Downtown Apartment',
        value: propertyId === 'property1' ? 750000 : 450000,
        location: propertyId === 'property1' ? '123 Sunset Boulevard' : '456 Main Street'
    };
    
    // Populate form with property details
    document.getElementById('modalTitle').textContent = 'Edit Property';
    document.getElementById('propertyId').value = propertyDetails.id;
    document.getElementById('propertyName').value = propertyDetails.name;
    document.getElementById('propertyValue').value = propertyDetails.value;
    document.getElementById('propertyLocation').value = propertyDetails.location;
    document.getElementById('selectedFileName').textContent = 'Current image';
    
    // Show modal
    document.getElementById('propertyModal').style.display = 'block';
}

// Delete property
function deleteProperty(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        // In a real implementation, you would send a delete request to the server
        console.log('Deleting property:', propertyId);
        
        // For demonstration, let's just log the action
        // In a real implementation, you would remove the property from the DOM
    }
}

// Handle responsive behavior
window.addEventListener('resize', function() {
    if (window.innerWidth <= 992) {
        closeNav();
    }
});

// Initialize on page load
if (window.innerWidth <= 992) {
    closeNav();
}