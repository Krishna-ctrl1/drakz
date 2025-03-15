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
    const propertyGrid = document.getElementById('propertyGrid');
  
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
  
    // Generate a unique ID for new properties
    function generateUniqueId() {
      return 'property-' + Date.now();
    }
  
    // Form submission
    propertyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const propertyId = document.getElementById('propertyId').value || generateUniqueId();
      const name = document.getElementById('propertyName').value;
      const value = document.getElementById('propertyValue').value;
      const location = document.getElementById('propertyLocation').value;
      const fileInput = document.getElementById('propertyImage');
      
      // Check if we're editing an existing property
      const existingProperty = document.getElementById(propertyId);
      
      if (existingProperty) {
        // Update existing property
        const detailsSection = existingProperty.querySelector('.property-details');
        detailsSection.querySelector('h4').textContent = name;
        detailsSection.querySelectorAll('p')[0].textContent = `Value: $${Number(value).toLocaleString()}`;
        detailsSection.querySelectorAll('p')[1].textContent = `Location: ${location}`;
        
        // Update image if a new one was selected
        if (fileInput.files.length > 0) {
          const reader = new FileReader();
          reader.onload = function(e) {
            existingProperty.querySelector('.property-image img').src = e.target.result;
          };
          reader.readAsDataURL(fileInput.files[0]);
        }
      } else {
        // Create new property card
        const newProperty = document.createElement('div');
        newProperty.className = 'property-card';
        newProperty.id = propertyId;
        
        // Set default image or use the selected one
        let imageSrc = 'assets/images/default-property.jpg'; // Default image
        
        if (fileInput.files.length > 0) {
          const reader = new FileReader();
          reader.onload = function(e) {
            newProperty.querySelector('.property-image img').src = e.target.result;
          };
          reader.readAsDataURL(fileInput.files[0]);
        }
        
        newProperty.innerHTML = `
          <div class="property-image">
            <img src="${imageSrc}" alt="${name}">
          </div>
          <div class="property-details">
            <h4>${name}</h4>
            <p>Value: $${Number(value).toLocaleString()}</p>
            <p>Location: ${location}</p>
          </div>
          <div class="property-actions">
            <button class="action-btn edit-btn" onclick="editProperty('${propertyId}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" onclick="deleteProperty('${propertyId}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
        
        // Add the new property to the grid
        propertyGrid.appendChild(newProperty);
        
        // If there's a file, update the image after the property is added to DOM
        if (fileInput.files.length > 0) {
          const reader = new FileReader();
          reader.onload = function(e) {
            newProperty.querySelector('.property-image img').src = e.target.result;
          };
          reader.readAsDataURL(fileInput.files[0]);
        }
      }
      
      // Close the modal
      closeModal();
    });
  });
  
  // Close the modal
  function closeModal() {
    document.getElementById('propertyModal').style.display = 'none';
  }
  
  // Edit property
  function editProperty(propertyId) {
    const property = document.getElementById(propertyId);
    
    if (property) {
      const name = property.querySelector('.property-details h4').textContent;
      const valueText = property.querySelector('.property-details p:nth-child(2)').textContent;
      const locationText = property.querySelector('.property-details p:nth-child(3)').textContent;
      
      // Extract numeric value from the text (remove "$" and commas)
      const value = valueText.replace('Value: $', '').replace(/,/g, '');
      const location = locationText.replace('Location: ', '');
      
      // Populate form with property details
      document.getElementById('modalTitle').textContent = 'Edit Property';
      document.getElementById('propertyId').value = propertyId;
      document.getElementById('propertyName').value = name;
      document.getElementById('propertyValue').value = value;
      document.getElementById('propertyLocation').value = location;
      document.getElementById('selectedFileName').textContent = 'Current image';
      
      // Show modal
      document.getElementById('propertyModal').style.display = 'block';
    } else {
      console.error('Property element not found:', propertyId);
    }
  }
  
  // Delete property
  function deleteProperty(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
      const property = document.getElementById(propertyId);
      if (property) {
        property.remove();
      } else {
        console.error('Property element not found:', propertyId);
      }
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