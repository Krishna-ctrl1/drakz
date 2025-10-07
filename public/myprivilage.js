// ===================================================================================
// SIDEBAR NAVIGATION
// ===================================================================================

function openNav() {
    const sidebar = document.getElementById("mySidebar");
    const main = document.getElementById("main");
    if (sidebar && main) {
        sidebar.style.width = "180px";
        main.style.marginLeft = "180px";
        const closeButton = document.getElementById("close-button");
        if(closeButton) {
            closeButton.innerHTML = '<img width="25" src="assets/icons/sidebarclose.png">';
            closeButton.setAttribute("onclick", "closeNav()");
        }
    }
}

function closeNav() {
    const sidebar = document.getElementById("mySidebar");
    const main = document.getElementById("main");
    if (sidebar && main) {
        sidebar.style.width = "60px";
        main.style.marginLeft = "60px";
        const closeButton = document.getElementById("close-button");
        if(closeButton) {
            closeButton.innerHTML = '<img width="25" src="assets/icons/sidebaropen.png">';
            closeButton.setAttribute("onclick", "openNav()");
        }
    }
}


// ===================================================================================
// MAIN SCRIPT: CRUD OPERATIONS & DATA PERSISTENCE
// ===================================================================================

document.addEventListener("DOMContentLoaded", function () {

    // --- 1. DATA STORE & PERSISTENCE ---

    // Load data from localStorage or initialize with default data if none exists.
    let properties = JSON.parse(localStorage.getItem('properties')) || [{ id: 'prop1', name: 'Sunset Villa', value: 750000, location: '123 Sunset Boulevard', image: 'assets/images/apartment jpg for assets 2.jpg' }];
    let policies = JSON.parse(localStorage.getItem('policies')) || [{ id: 'pol1', name: 'Home Insurance', number: 'HM-2024-089', property: 'Sunset Villa', coverage: 800000, renewalDate: '2024-12-31' }];
    let metals = JSON.parse(localStorage.getItem('metals')) || [{ id: 'met1', type: 'Gold', amount: '250', unit: 'g', value: 15750, purchaseDate: '2023-06-15' }];
    let newPropertyImage = null;

    // Function to save all data to localStorage
    const saveData = () => {
        localStorage.setItem('properties', JSON.stringify(properties));
        localStorage.setItem('policies', JSON.stringify(policies));
        localStorage.setItem('metals', JSON.stringify(metals));
    };

    // --- 2. RENDER FUNCTIONS (To draw data onto the page) ---

    const renderProperties = () => {
        const grid = document.getElementById('propertyGrid');
        if (!grid) return;
        grid.innerHTML = properties.map(prop => `
            <div class="property-card" id="${prop.id}">
                <div class="property-image"><img src="${prop.image || 'assets/images/default-property.jpg'}" alt="${prop.name}"></div>
                <div class="property-details">
                    <h4>${prop.name}</h4>
                    <p>Value: $${prop.value.toLocaleString()}</p>
                    <p>Location: ${prop.location}</p>
                </div>
                <div class="property-actions">
                    <button class="action-btn edit-btn" onclick="editProperty('${prop.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteProperty('${prop.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');
    };

    const renderPolicies = () => {
        const list = document.querySelector('.policy-list');
        if (!list) return;
        list.innerHTML = policies.map(pol => `
            <div class="policy-card" id="${pol.id}">
                <div class="policy-icon"><i class="fas fa-shield-alt"></i></div>
                <div class="policy-content">
                    <h4>${pol.name}</h4>
                    <p>Policy Number: ${pol.number}</p>
                    <p>Property: ${pol.property}</p>
                    <p>Coverage: $${pol.coverage.toLocaleString()}</p>
                    <p>Renewal Date: ${new Date(pol.renewalDate).toLocaleDateString()}</p>
                </div>
                <div class="policy-actions">
                    <button class="action-btn edit-btn" onclick="editPolicy('${pol.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="deletePolicy('${pol.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');
    };

    const renderMetals = () => {
        const list = document.querySelector('.metals-list');
        if (!list) return;
        list.innerHTML = metals.map(met => `
            <div class="metal-card" id="${met.id}">
                <div class="metal-icon ${met.type.toLowerCase()}"><i class="fas fa-coins"></i></div>
                <div class="metal-details">
                    <h4>${met.type}</h4>
                    <p>Amount: ${met.amount} ${met.unit}</p>
                    <p>Value: $${met.value.toLocaleString()}</p>
                    <p>Date of Purchase: ${new Date(met.purchaseDate).toLocaleDateString()}</p>
                </div>
                <div class="metal-actions">
                    <button class="action-btn edit-btn" onclick="editMetal('${met.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteMetal('${met.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');
    };

    // --- 3. MODAL AND FORM HANDLING ---

    // Function to close any modal
    window.closeModal = (type) => {
        const modal = document.getElementById(`${type}Modal`);
        if (modal) modal.style.display = 'none';
    };

    // Attach event listeners for Add buttons
    document.getElementById('addPropertyBtn').addEventListener('click', () => {
        document.getElementById('propertyForm').reset();
        document.getElementById('propertyId').value = '';
        document.getElementById('modalTitle').innerText = 'Add New Property';
        document.getElementById('selectedFileName').textContent = 'No file selected';
        document.getElementById('propertyImagePreview').src = 'assets/images/default-property.jpg';
        newPropertyImage = null;
        document.getElementById('propertyModal').style.display = 'block';
    });

    document.getElementById('addPolicyBtn').addEventListener('click', () => {
        document.getElementById('policyForm').reset();
        document.getElementById('policyId').value = '';
        document.getElementById('policyModalTitle').innerText = 'Add New Insurance Policy';
        document.getElementById('policyModal').style.display = 'block';
    });

    document.getElementById('addMetalBtn').addEventListener('click', () => {
        document.getElementById('metalForm').reset();
        document.getElementById('metalId').value = '';
        document.getElementById('metalModalTitle').innerText = 'Add New Precious Metal';
        document.getElementById('metalModal').style.display = 'block';
    });

    // Handle file input change
    document.getElementById('propertyImage').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                newPropertyImage = event.target.result;
                document.getElementById('propertyImagePreview').src = newPropertyImage;
                document.getElementById('selectedFileName').textContent = file.name;
            };
            reader.readAsDataURL(file);
        }
    });

    // Attach event listeners for form submissions
    document.getElementById('propertyForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('propertyId').value;
        const existingProperty = properties.find(p => p.id === id);

        const assetData = {
            id: id || `prop${Date.now()}`,
            name: document.getElementById('propertyName').value,
            value: parseFloat(document.getElementById('propertyValue').value) || 0,
            location: document.getElementById('propertyLocation').value,
            image: newPropertyImage || (existingProperty ? existingProperty.image : 'assets/images/default-property.jpg')
        };

        if (id) {
            properties = properties.map(p => p.id === id ? assetData : p);
        } else {
            properties.push(assetData);
        }

        saveData();
        renderProperties();
        closeModal('property');
    });

    document.getElementById('policyForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('policyId').value;
        const assetData = {
            id: id || `pol${Date.now()}`,
            name: document.getElementById('policyName').value,
            number: document.getElementById('policyNumber').value,
            property: document.getElementById('policyProperty').value,
            coverage: parseFloat(document.getElementById('policyCoverage').value) || 0,
            renewalDate: document.getElementById('policyRenewalDate').value,
        };

        if (id) { policies = policies.map(p => p.id === id ? assetData : p); }
        else { policies.push(assetData); }

        saveData();
        renderPolicies();
        closeModal('policy');
    });

    document.getElementById('metalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('metalId').value;
        const assetData = {
            id: id || `met${Date.now()}`,
            type: document.getElementById('metalType').value,
            amount: document.getElementById('metalAmount').value,
            unit: document.getElementById('metalUnit').value,
            value: parseFloat(document.getElementById('metalValue').value) || 0,
            purchaseDate: document.getElementById('metalPurchaseDate').value,
        };

        if (id) { metals = metals.map(m => m.id === id ? assetData : m); }
        else { metals.push(assetData); }

        saveData();
        renderMetals();
        closeModal('metal');
    });

    // --- 4. GLOBAL FUNCTIONS for inline onclick attributes ---

    // Property Functions
    window.editProperty = (id) => {
        const prop = properties.find(p => p.id === id);
        if (prop) {
            document.getElementById('propertyId').value = prop.id;
            document.getElementById('propertyName').value = prop.name;
            document.getElementById('propertyValue').value = prop.value;
            document.getElementById('propertyLocation').value = prop.location;
            document.getElementById('propertyImagePreview').src = prop.image || 'assets/images/default-property.jpg';
            document.getElementById('selectedFileName').textContent = 'No new file selected';
            newPropertyImage = null;
            document.getElementById('modalTitle').innerText = 'Edit Property';
            document.getElementById('propertyModal').style.display = 'block';
        }
    };
    window.deleteProperty = (id) => {
        if (confirm('Are you sure you want to delete this property?')) {
            properties = properties.filter(p => p.id !== id);
            saveData();
            renderProperties();
        }
    };

    // Policy Functions
    window.editPolicy = (id) => {
        const pol = policies.find(p => p.id === id);
        if (pol) {
            document.getElementById('policyId').value = pol.id;
            document.getElementById('policyName').value = pol.name;
            document.getElementById('policyNumber').value = pol.number;
            document.getElementById('policyProperty').value = pol.property;
            document.getElementById('policyCoverage').value = pol.coverage;
            document.getElementById('policyRenewalDate').value = pol.renewalDate;
            document.getElementById('policyModalTitle').innerText = 'Edit Insurance Policy';
            document.getElementById('policyModal').style.display = 'block';
        }
    };
    window.deletePolicy = (id) => {
        if (confirm('Are you sure you want to delete this policy?')) {
            policies = policies.filter(p => p.id !== id);
            saveData();
            renderPolicies();
        }
    };

    // Metal Functions
    window.editMetal = (id) => {
        const met = metals.find(m => m.id === id);
        if (met) {
            document.getElementById('metalId').value = met.id;
            document.getElementById('metalType').value = met.type;
            document.getElementById('metalAmount').value = met.amount;
            document.getElementById('metalUnit').value = met.unit;
            document.getElementById('metalValue').value = met.value;
            document.getElementById('metalPurchaseDate').value = met.purchaseDate;
            document.getElementById('metalModalTitle').innerText = 'Edit Precious Holding';
            document.getElementById('metalModal').style.display = 'block';
        }
    };
    window.deleteMetal = (id) => {
        if (confirm('Are you sure you want to delete this precious holding?')) {
            metals = metals.filter(m => m.id !== id);
            saveData();
            renderMetals();
        }
    };

    // --- 5. INITIAL PAGE RENDER ---
    renderProperties();
    renderPolicies();
    renderMetals();
});