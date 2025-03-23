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
  
  // Global variables for asset management
  let currentEditingPropertyId = null;
  let currentEditingPolicyId = null;
  let currentEditingMetalId = null;
  
  // Property Management
  document.addEventListener('DOMContentLoaded', function() {
    // Property modal functions
    const propertyModal = document.getElementById('propertyModal');
    const addPropertyBtn = document.getElementById('addPropertyBtn');
    const propertyForm = document.getElementById('propertyForm');
    const propertyImageInput = document.getElementById('propertyImage');
    const selectedFileName = document.getElementById('selectedFileName');
    const propertyGrid = document.getElementById('propertyGrid');
  
    // Policy modal functions
    const policyModal = document.getElementById('policyModal');
    const addPolicyBtn = document.getElementById('addPolicyBtn');
    const policyForm = document.getElementById('policyForm');
    const policyList = document.querySelector('.policy-list');
  
    // Metal modal functions
    const metalModal = document.getElementById('metalModal');
    const addMetalBtn = document.getElementById('addMetalBtn');
    const metalForm = document.getElementById('metalForm');
    const metalsList = document.querySelector('.metals-list');
  
    // Add click event for modal backgrounds to close when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === propertyModal) {
            closeModal('property');
        } else if (event.target === policyModal) {
            closeModal('policy');
        } else if (event.target === metalModal) {
            closeModal('metal');
        }
    });
  
    // Open modal to add new property
    if (addPropertyBtn) {
        addPropertyBtn.addEventListener('click', function() {
            document.getElementById('modalTitle').textContent = 'Add New Property';
            document.getElementById('propertyId').value = '';
            currentEditingPropertyId = null;
            propertyForm.reset();
            selectedFileName.textContent = 'No file selected';
            propertyModal.style.display = 'block';
        });
    }
  
    // Open modal to add new policy
    if (addPolicyBtn) {
        addPolicyBtn.addEventListener('click', function() {
            document.getElementById('policyModalTitle').textContent = 'Add New Insurance Policy';
            document.getElementById('policyId').value = '';
            currentEditingPolicyId = null;
            policyForm.reset();
            policyModal.style.display = 'block';
        });
    }
  
    // Open modal to add new metal
    if (addMetalBtn) {
        addMetalBtn.addEventListener('click', function() {
            document.getElementById('metalModalTitle').textContent = 'Add New Precious Holding';
            document.getElementById('metalId').value = '';
            currentEditingMetalId = null;
            metalForm.reset();
            metalModal.style.display = 'block';
        });
    }
  
    // Handle file selection display
    if (propertyImageInput) {
        propertyImageInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                selectedFileName.textContent = this.files[0].name;
            } else {
                selectedFileName.textContent = 'No file selected';
            }
        });
    }
  
    // Generate a unique ID for new assets
    function generateUniqueId(prefix) {
        return prefix + '-' + Date.now();
    }
  
    // Property form submission
    if (propertyForm) {
        propertyForm.addEventListener('submit', function(e) {
            e.preventDefault();
          
            // Get form values
            const propertyId = document.getElementById('propertyId').value || generateUniqueId('property');
            const name = document.getElementById('propertyName').value;
            const value = document.getElementById('propertyValue').value;
            const location = document.getElementById('propertyLocation').value;
            const fileInput = document.getElementById('propertyImage');
          
            // Format the value with commas for display
            const formattedValue = Number(value).toLocaleString();
          
            // Check if we're editing an existing property
            const existingProperty = document.getElementById(propertyId);
          
            if (existingProperty) {
                // Update existing property
                const detailsSection = existingProperty.querySelector('.property-details');
                detailsSection.querySelector('h4').textContent = name;
                detailsSection.querySelectorAll('p')[0].textContent = `Value: $${formattedValue}`;
                detailsSection.querySelectorAll('p')[1].textContent = `Location: ${location}`;
              
                // Update image if a new one was selected
                if (fileInput.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        existingProperty.querySelector('.property-image img').src = e.target.result;
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }
                
                console.log(`Property ${propertyId} updated successfully`);
            } else {
                // Create new property card
                const newProperty = document.createElement('div');
                newProperty.className = 'property-card';
                newProperty.id = propertyId;
              
                // Set default image or use the selected one
                let imageSrc = 'assets/images/default-property.jpg'; // Default image
              
                newProperty.innerHTML = `
                    <div class="property-image">
                        <img src="${imageSrc}" alt="${name}">
                    </div>
                    <div class="property-details">
                        <h4>${name}</h4>
                        <p>Value: $${formattedValue}</p>
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
                
                console.log(`New property ${propertyId} added successfully`);
            }
          
            // Close the modal
            closeModal('property');
        });
    }
  
    // Policy form submission
    if (policyForm) {
        policyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const policyId = document.getElementById('policyId').value || generateUniqueId('policy');
            const name = document.getElementById('policyName').value;
            const policyNumber = document.getElementById('policyNumber').value;
            const property = document.getElementById('policyProperty').value;
            const coverage = document.getElementById('policyCoverage').value;
            const renewalDate = document.getElementById('policyRenewalDate').value;
            
            // Format the coverage with commas for display
            const formattedCoverage = Number(coverage).toLocaleString();
            
            // Format date for display
            const dateObj = new Date(renewalDate);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            const formattedDate = `${month} ${day}, ${year}`;
            
            // Determine icon based on policy name
            let iconClass = 'fa-shield-alt'; // Default
            if (name.toLowerCase().includes('home')) {
                iconClass = 'fa-home';
            } else if (name.toLowerCase().includes('property')) {
                iconClass = 'fa-building';
            } else if (name.toLowerCase().includes('mortgage')) {
                iconClass = 'fa-landmark';
            } else if (name.toLowerCase().includes('life')) {
                iconClass = 'fa-heartbeat';
            } else if (name.toLowerCase().includes('auto') || name.toLowerCase().includes('car')) {
                iconClass = 'fa-car';
            } else if (name.toLowerCase().includes('health')) {
                iconClass = 'fa-hospital';
            }
            
            // Check if we're editing an existing policy
            const existingPolicy = document.getElementById(policyId);
            
            if (existingPolicy) {
                // Update existing policy
                existingPolicy.querySelector('h4').textContent = name;
                existingPolicy.querySelector('.policy-icon i').className = `fas ${iconClass}`;
                const paragraphs = existingPolicy.querySelectorAll('p');
                paragraphs[0].textContent = `Policy Number: ${policyNumber}`;
                paragraphs[1].textContent = `Property: ${property}`;
                paragraphs[2].textContent = `Coverage: $${formattedCoverage}`;
                paragraphs[3].textContent = `Renewal Date: ${formattedDate}`;
                
                console.log(`Policy ${policyId} updated successfully`);
            } else {
                // Create new policy card
                const newPolicy = document.createElement('div');
                newPolicy.className = 'policy-card';
                newPolicy.id = policyId;
                
                newPolicy.innerHTML = `
                    <div class="policy-icon">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="policy-content">
                        <h4>${name}</h4>
                        <p>Policy Number: ${policyNumber}</p>
                        <p>Property: ${property}</p>
                        <p>Coverage: $${formattedCoverage}</p>
                        <p>Renewal Date: ${formattedDate}</p>
                    </div>
                    <div class="policy-actions">
                        <button class="action-btn edit-btn" onclick="editPolicy('${policyId}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deletePolicy('${policyId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                // Add the new policy to the list
                policyList.appendChild(newPolicy);
                
                console.log(`New policy ${policyId} added successfully`);
            }
            
            // Close the modal
            closeModal('policy');
        });
    }
  
    // Metal form submission
    if (metalForm) {
        metalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const metalId = document.getElementById('metalId').value || generateUniqueId('metal');
            const type = document.getElementById('metalType').value;
            const amount = document.getElementById('metalAmount').value;
            const unit = document.getElementById('metalUnit').value;
            const value = document.getElementById('metalValue').value;
            const purchaseDate = document.getElementById('metalPurchaseDate').value;
            
            // Format the value with commas for display
            const formattedValue = Number(value).toLocaleString();
            
            // Format date for display
            const dateObj = new Date(purchaseDate);
            const month = dateObj.toLocaleString('default', { month: 'long' });
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            const formattedDate = `${month} ${day}, ${year}`;
            
            // Determine metal class for icon color
            let metalClass = 'gold'; // Default
            if (type.toLowerCase().includes('silver')) {
                metalClass = 'silver';
            } else if (type.toLowerCase().includes('platinum')) {
                metalClass = 'platinum';
            } else if (type.toLowerCase().includes('palladium')) {
                metalClass = 'palladium';
            }
            
            // Check if we're editing an existing metal
            const existingMetal = document.getElementById(metalId);
            
            if (existingMetal) {
                // Update existing metal
                existingMetal.querySelector('.metal-icon').className = `metal-icon ${metalClass}`;
                existingMetal.querySelector('.metal-details h4').textContent = type;
                const paragraphs = existingMetal.querySelectorAll('.metal-details p');
                paragraphs[0].textContent = `Amount: ${amount}${unit}`;
                paragraphs[1].textContent = `Value: $${formattedValue}`;
                paragraphs[2].textContent = `Date of Purchase: ${formattedDate}`;
                
                console.log(`Metal ${metalId} updated successfully`);
            } else {
                // Create new metal card
                const newMetal = document.createElement('div');
                newMetal.className = 'metal-card';
                newMetal.id = metalId;
                
                newMetal.innerHTML = `
                    <div class="metal-icon ${metalClass}">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="metal-details">
                        <h4>${type}</h4>
                        <p>Amount: ${amount}${unit}</p>
                        <p>Value: $${formattedValue}</p>
                        <p>Date of Purchase: ${formattedDate}</p>
                    </div>
                    <div class="metal-actions">
                        <button class="action-btn edit-btn" onclick="editMetal('${metalId}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteMetal('${metalId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                // Add the new metal to the list
                metalsList.appendChild(newMetal);
                
                console.log(`New metal ${metalId} added successfully`);
            }
            
            // Close the modal
            closeModal('metal');
        });
    }
  
    // Initialize IDs for existing assets
    initializeAssetIds();
  });
  
  // Close the modal based on type
  function closeModal(type) {
    if (type === 'property') {
      document.getElementById('propertyModal').style.display = 'none';
      currentEditingPropertyId = null;
    } else if (type === 'policy') {
      document.getElementById('policyModal').style.display = 'none';
      currentEditingPolicyId = null;
    } else if (type === 'metal') {
      document.getElementById('metalModal').style.display = 'none';
      currentEditingMetalId = null;
    }
  }

  // Update the property modal X button and cancel button
document.addEventListener('DOMContentLoaded', function() {
    // Update X button for property modal
    const propertyCloseX = document.querySelector('#propertyModal .close-modal');
    if (propertyCloseX) {
      propertyCloseX.onclick = function() {
        closeModal('property');
      };
    }
    ``
    // Update cancel button for property modal
    const propertyCancelBtn = document.querySelector('#propertyModal .btn-secondary');
    if (propertyCancelBtn) {
      propertyCancelBtn.onclick = function() {
        closeModal('property');
      };
    }
    
    // Update X button for metal modal
    const metalCloseX = document.querySelector('#metalModal .close-modal');
    if (metalCloseX) {
      metalCloseX.onclick = function() {
        closeModal('metal');
      };
    }
    
    // Update cancel button for metal modal
    const metalCancelBtn = document.querySelector('#metalModal .btn-secondary');
    if (metalCancelBtn) {
      metalCancelBtn.onclick = function() {
        closeModal('metal');
      };
    }  
  });
  // Edit property - this function needs to be globally accessible
  function editProperty(propertyId) {
    console.log(`Editing property: ${propertyId}`);
    
    const property = document.getElementById(propertyId);
    if (!property) {
        console.error(`Property with ID ${propertyId} not found`);
        return;
    }
  
    currentEditingPropertyId = propertyId;
    
    // Get property details
    const name = property.querySelector('.property-details h4').textContent;
    const valueText = property.querySelector('.property-details p:nth-of-type(1)').textContent;
    const locationText = property.querySelector('.property-details p:nth-of-type(2)').textContent;
  
    console.log(`Found property: ${name}, Value: ${valueText}, Location: ${locationText}`);
    
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
  }
  
  // Edit policy
  function editPolicy(policyId) {
    console.log(`Editing policy: ${policyId}`);
    
    const policy = document.getElementById(policyId);
    if (!policy) {
        console.error(`Policy with ID ${policyId} not found`);
        return;
    }
  
    currentEditingPolicyId = policyId;
    
    // Get policy details
    const name = policy.querySelector('h4').textContent;
    const paragraphs = policy.querySelectorAll('p');
    const policyNumber = paragraphs[0].textContent.replace('Policy Number: ', '');
    const property = paragraphs[1].textContent.replace('Property: ', '');
    const coverage = paragraphs[2].textContent.replace('Coverage: $', '').replace(/,/g, '');
    const renewalDateText = paragraphs[3].textContent.replace('Renewal Date: ', '');
    
    // Parse the date for input field (needs YYYY-MM-DD format)
    const dateComponents = renewalDateText.split(' ');
    const monthMap = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
        'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    const month = monthMap[dateComponents[0]];
    const day = dateComponents[1].replace(',', '').padStart(2, '0');
    const year = dateComponents[2];
    const formattedDate = `${year}-${month}-${day}`;
  
    // Populate form with policy details
    document.getElementById('policyModalTitle').textContent = 'Edit Insurance Policy';
    document.getElementById('policyId').value = policyId;
    document.getElementById('policyName').value = name;
    document.getElementById('policyNumber').value = policyNumber;
    document.getElementById('policyProperty').value = property;
    document.getElementById('policyCoverage').value = coverage;
    document.getElementById('policyRenewalDate').value = formattedDate;
  
    // Show modal
    document.getElementById('policyModal').style.display = 'block';
  }
  
  // Edit metal
  function editMetal(metalId) {
    console.log(`Editing metal: ${metalId}`);
    
    const metal = document.getElementById(metalId);
    if (!metal) {
        console.error(`Metal with ID ${metalId} not found`);
        return;
    }
  
    currentEditingMetalId = metalId;
    
    // Get metal details
    const type = metal.querySelector('.metal-details h4').textContent;
    const paragraphs = metal.querySelectorAll('.metal-details p');
    const amountText = paragraphs[0].textContent.replace('Amount: ', '');
    const valueText = paragraphs[1].textContent.replace('Value: $', '').replace(/,/g, '');
    const dateText = paragraphs[2].textContent.replace('Date of Purchase: ', '');
    
    // Parse amount and unit
    let amount, unit;
    if (amountText.includes('g')) {
        amount = amountText.replace('g', '');
        unit = 'g';
    } else if (amountText.includes('kg')) {
        amount = amountText.replace('kg', '');
        unit = 'kg';
    } else {
        amount = amountText;
        unit = 'g'; // Default
    }
    
    // Parse the date for input field (needs YYYY-MM-DD format)
    const dateComponents = dateText.split(' ');
    const monthMap = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04', 'May': '05', 'June': '06',
        'July': '07', 'August': '08', 'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    
    const month = monthMap[dateComponents[0]];
    const day = dateComponents[1].replace(',', '').padStart(2, '0');
    const year = dateComponents[2];
    const formattedDate = `${year}-${month}-${day}`;
  
    // Populate form with metal details
    document.getElementById('metalModalTitle').textContent = 'Edit Precious Holding';
    document.getElementById('metalId').value = metalId;
    document.getElementById('metalType').value = type;
    document.getElementById('metalAmount').value = amount;
    document.getElementById('metalUnit').value = unit;
    document.getElementById('metalValue').value = valueText;
    document.getElementById('metalPurchaseDate').value = formattedDate;
  
    // Show modal
    document.getElementById('metalModal').style.display = 'block';
  }
  
  // Delete property
  function deleteProperty(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        const property = document.getElementById(propertyId);
        if (property) {
            property.remove();
            console.log(`Property ${propertyId} deleted successfully`);
        } else {
            console.error(`Property with ID ${propertyId} not found for deletion`);
        }
    }
  }
  
  // Delete policy
  function deletePolicy(policyId) {
    if (confirm('Are you sure you want to delete this insurance policy?')) {
        const policy = document.getElementById(policyId);
        if (policy) {
            policy.remove();
            console.log(`Policy ${policyId} deleted successfully`);
        } else {
            console.error(`Policy with ID ${policyId} not found for deletion`);
        }
    }
  }
  
  // Delete metal
  function deleteMetal(metalId) {
    if (confirm('Are you sure you want to delete this precious holding?')) {
        const metal = document.getElementById(metalId);
        if (metal) {
            metal.remove();
            console.log(`Metal ${metalId} deleted successfully`);
        } else {
            console.error(`Metal with ID ${metalId} not found for deletion`);
        }
    }
  }
  
  // Initialize IDs for existing assets
  function initializeAssetIds() {
    // Initialize property IDs
    const existingProperties = document.querySelectorAll('.property-card:not([id])');
    existingProperties.forEach((property, index) => {
        property.id = `property${index + 1}`;
        console.log(`Assigned ID ${property.id} to existing property`);
    });
    
    // Initialize policy IDs
    const existingPolicies = document.querySelectorAll('.policy-card:not([id])');
    existingPolicies.forEach((policy, index) => {
        policy.id = `policy${index + 1}`;
        console.log(`Assigned ID ${policy.id} to existing policy`);
        
        // Add action buttons if not present
        if (!policy.querySelector('.policy-actions')) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'policy-actions';
            actionsDiv.innerHTML = `
                <button class="action-btn edit-btn" onclick="editPolicy('${policy.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deletePolicy('${policy.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            policy.appendChild(actionsDiv);
        }
        
        // Add icon container if not present
        if (!policy.querySelector('.policy-icon')) {
            // Determine icon based on policy name
            let iconClass = 'fa-shield-alt'; // Default
            const policyName = policy.querySelector('h4').textContent.toLowerCase();
            if (policyName.includes('home')) {
                iconClass = 'fa-home';
            } else if (policyName.includes('property')) {
                iconClass = 'fa-building';
            } else if (policyName.includes('mortgage')) {
                iconClass = 'fa-landmark';
            }
            
            const iconDiv = document.createElement('div');
            iconDiv.className = 'policy-icon';
            iconDiv.innerHTML = `<i class="fas ${iconClass}"></i>`;
            
            // Wrap the existing content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'policy-content';
            
            // Move all children except the actions to the content div
            while (policy.firstChild && policy.firstChild !== policy.querySelector('.policy-actions')) {
                contentDiv.appendChild(policy.firstChild);
            }
            
            policy.insertBefore(contentDiv, policy.firstChild);
            policy.insertBefore(iconDiv, policy.firstChild);
        }
    });
    
    // Initialize metal IDs
    const existingMetals = document.querySelectorAll('.metal-card:not([id])');
    existingMetals.forEach((metal, index) => {
        metal.id = `metal${index + 1}`;
        console.log(`Assigned ID ${metal.id} to existing metal`);
        
        // Add action buttons if not present
        if (!metal.querySelector('.metal-actions')) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'metal-actions';
            actionsDiv.innerHTML = `
                <button class="action-btn edit-btn" onclick="editMetal('${metal.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteMetal('${metal.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            metal.appendChild(actionsDiv);
        }
    });
  }
  
  // Search function for filtering dashboard elements
  function filterDashboard() {
    const searchInput = document.getElementById('searchInput');
    const filter = searchInput.value.toUpperCase();
    
    // Filter properties
    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach(card => {
        const name = card.querySelector('.property-details h4').textContent;
        const location = card.querySelector('.property-details p:nth-of-type(2)').textContent;
        
        if (name.toUpperCase().indexOf(filter) > -1 || location.toUpperCase().indexOf(filter) > -1) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
    
    // Filter policies
    const policyCards = document.querySelectorAll('.policy-card');
    policyCards.forEach(card => {
        const name = card.querySelector('h4').textContent;
        const policyNumber = card.querySelector('p:nth-of-type(1)').textContent;
        const property = card.querySelector('p:nth-of-type(2)').textContent;
        
        if (name.toUpperCase().indexOf(filter) > -1 || 
            policyNumber.toUpperCase().indexOf(filter) > -1 ||
            property.toUpperCase().indexOf(filter) > -1) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
    
    // Filter metals
    const metalCards = document.querySelectorAll('.metal-card');
    metalCards.forEach(card => {
        const type = card.querySelector('.metal-details h4').textContent;
        
        if (type.toUpperCase().indexOf(filter) > -1) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
  }
  
  // Handle responsive behavior
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 992) {
        closeNav();
    }
  });
  
  // Initialize on page load
  window.addEventListener('load', function() {
    if (window.innerWidth <= 992) {
        closeNav();
    }
    
    // Initialize IDs for all asset types
    initializeAssetIds();
  });