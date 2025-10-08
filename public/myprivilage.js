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

    // --- 1. DATA STORE (No localStorage; data fetched from server) ---

    let properties = [];
    let policies = [];
    let metals = [];

    // --- 2. FETCH FUNCTIONS (To load data from server) ---

    async function fetchProperties() {
        try {
            const res = await fetch('/properties');
            if (!res.ok) throw new Error('Failed to fetch properties');
            properties = await res.json();
            renderProperties();
        } catch (error) {
            console.error('Error fetching properties:', error);
            alert('Failed to load properties. Please try again.');
        }
    }

    async function fetchPolicies() {
        try {
            const res = await fetch('/api/policies');
            if (!res.ok) throw new Error('Failed to fetch policies');
            policies = await res.json();
            renderPolicies();
        } catch (error) {
            console.error('Error fetching policies:', error);
            alert('Failed to load policies. Please try again.');
        }
    }

    async function fetchMetals() {
        try {
            const res = await fetch('/precious-holdings');
            if (!res.ok) throw new Error('Failed to fetch precious holdings');
            metals = await res.json();
            renderMetals();
        } catch (error) {
            console.error('Error fetching precious holdings:', error);
            alert('Failed to load precious holdings. Please try again.');
        }
    }

    // --- 3. RENDER FUNCTIONS (To draw data onto the page) ---

    const renderProperties = () => {
        const grid = document.getElementById('propertyGrid');
        if (!grid) return;
        grid.innerHTML = properties.map(prop => `
            <div class="property-card" id="${prop._id}">
                <div class="property-image"><img src="${prop.image_url || 'assets/images/default-property.jpg'}" alt="${prop.property_name}"></div>
                <div class="property-details">
                    <h4>${prop.property_name}</h4>
                    <p>Value: $${prop.property_value.toLocaleString()}</p>
                    <p>Location: ${prop.location}</p>
                </div>
                <div class="property-actions">
                    <button class="action-btn edit-btn" onclick="editProperty('${prop._id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteProperty('${prop._id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');
    };

    const renderPolicies = () => {
        const list = document.querySelector('.policy-list');
        if (!list) return;
        list.innerHTML = policies.map(pol => `
            <div class="policy-card" id="${pol._id}">
                <div class="policy-icon"><i class="fas fa-shield-alt"></i></div>
                <div class="policy-content">
                    <h4>${pol.policy_name}</h4>
                    <p>Policy Number: ${pol.policy_number}</p>
                    <p>Property: ${pol.property_description}</p>
                    <p>Coverage: $${pol.coverage_amount.toLocaleString()}</p>
                    <p>Renewal Date: ${new Date(pol.renewal_date).toLocaleDateString()}</p>
                </div>
                <div class="policy-actions">
                    <button class="action-btn edit-btn" onclick="editPolicy('${pol._id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="deletePolicy('${pol._id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');
    };

    const renderMetals = () => {
        const list = document.querySelector('.metals-list');
        if (!list) return;
        list.innerHTML = metals.map(met => `
            <div class="metal-card" id="${met._id}">
                <div class="metal-icon ${met.metal_type.toLowerCase()}"><i class="fas fa-coins"></i></div>
                <div class="metal-details">
                    <h4>${met.metal_type.charAt(0).toUpperCase() + met.metal_type.slice(1)}</h4>
                    <p>Amount: ${met.amount} ${met.amount_unit}</p>
                    <p>Value: $${met.value.toLocaleString()}</p>
                    <p>Date of Purchase: ${new Date(met.date_of_purchase).toLocaleDateString()}</p>
                </div>
                <div class="metal-actions">
                    <button class="action-btn edit-btn" onclick="editMetal('${met._id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" onclick="deleteMetal('${met._id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');
    };

    // --- 4. MODAL AND FORM HANDLING ---

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
        document.getElementById('propertyImage').value = '';
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

    // Handle file input change for preview
    document.getElementById('propertyImage').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('propertyImagePreview').src = event.target.result;
                document.getElementById('selectedFileName').textContent = file.name;
            };
            reader.readAsDataURL(file);
        }
    });

    // Attach event listeners for form submissions
    document.getElementById('propertyForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('propertyId').value;
        const formData = new FormData();
        formData.append('propertyName', document.getElementById('propertyName').value);
        formData.append('propertyValue', document.getElementById('propertyValue').value);
        formData.append('propertyLocation', document.getElementById('propertyLocation').value);
        const fileInput = document.getElementById('propertyImage');
        if (fileInput.files[0]) {
            formData.append('propertyImage', fileInput.files[0]);
        }
        const url = id ? `/properties/${id}` : '/properties';
        const method = id ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, { method, body: formData });
            if (!res.ok) throw new Error('Failed to save property');
            closeModal('property');
            await fetchProperties();
        } catch (error) {
            console.error('Error saving property:', error);
            alert('Failed to save property. Please try again.');
        }
    });

    document.getElementById('policyForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('policyId').value;
        const data = {
            policy_name: document.getElementById('policyName').value,
            policy_number: document.getElementById('policyNumber').value,
            property_description: document.getElementById('policyProperty').value,
            coverage_amount: parseFloat(document.getElementById('policyCoverage').value) || 0,
            renewal_date: document.getElementById('policyRenewalDate').value,
        };
        const url = id ? `/api/policies/${id}` : '/api/policies';
        const method = id ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to save policy');
            closeModal('policy');
            await fetchPolicies();
        } catch (error) {
            console.error('Error saving policy:', error);
            alert('Failed to save policy. Please try again.');
        }
    });

    document.getElementById('metalForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('metalId').value;
        const data = {
            metalType: document.getElementById('metalType').value,
            metalAmount: document.getElementById('metalAmount').value,
            metalUnit: document.getElementById('metalUnit').value,
            metalValue: parseFloat(document.getElementById('metalValue').value) || 0,
            metalPurchaseDate: document.getElementById('metalPurchaseDate').value,
        };
        const url = id ? `/precious-holdings/${id}` : '/precious-holdings';
        const method = id ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to save precious holding');
            closeModal('metal');
            await fetchMetals();
        } catch (error) {
            console.error('Error saving precious holding:', error);
            alert('Failed to save precious holding. Please try again.');
        }
    });

    // --- 5. GLOBAL FUNCTIONS for inline onclick attributes ---

    // Property Functions
    window.editProperty = (id) => {
        const prop = properties.find(p => p._id === id);
        if (prop) {
            document.getElementById('propertyId').value = prop._id;
            document.getElementById('propertyName').value = prop.property_name;
            document.getElementById('propertyValue').value = prop.property_value;
            document.getElementById('propertyLocation').value = prop.location;
            document.getElementById('propertyImagePreview').src = prop.image_url || 'assets/images/default-property.jpg';
            document.getElementById('selectedFileName').textContent = 'No new file selected';
            document.getElementById('propertyImage').value = '';
            document.getElementById('modalTitle').innerText = 'Edit Property';
            document.getElementById('propertyModal').style.display = 'block';
        }
    };
    window.deleteProperty = async (id) => {
        if (confirm('Are you sure you want to delete this property?')) {
            try {
                const res = await fetch(`/properties/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete property');
                await fetchProperties();
            } catch (error) {
                console.error('Error deleting property:', error);
                alert('Failed to delete property. Please try again.');
            }
        }
    };

    // Policy Functions
    window.editPolicy = (id) => {
        const pol = policies.find(p => p._id === id);
        if (pol) {
            document.getElementById('policyId').value = pol._id;
            document.getElementById('policyName').value = pol.policy_name;
            document.getElementById('policyNumber').value = pol.policy_number;
            document.getElementById('policyProperty').value = pol.property_description;
            document.getElementById('policyCoverage').value = pol.coverage_amount;
            document.getElementById('policyRenewalDate').value = pol.renewal_date.split('T')[0]; // Format for input
            document.getElementById('policyModalTitle').innerText = 'Edit Insurance Policy';
            document.getElementById('policyModal').style.display = 'block';
        }
    };
    window.deletePolicy = async (id) => {
        if (confirm('Are you sure you want to delete this policy?')) {
            try {
                const res = await fetch(`/api/policies/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete policy');
                await fetchPolicies();
            } catch (error) {
                console.error('Error deleting policy:', error);
                alert('Failed to delete policy. Please try again.');
            }
        }
    };

    // Metal Functions
    window.editMetal = (id) => {
        const met = metals.find(m => m._id === id);
        if (met) {
            document.getElementById('metalId').value = met._id;
            document.getElementById('metalType').value = met.metal_type.charAt(0).toUpperCase() + met.metal_type.slice(1);
            document.getElementById('metalAmount').value = met.amount;
            document.getElementById('metalUnit').value = met.amount_unit;
            document.getElementById('metalValue').value = met.value;
            document.getElementById('metalPurchaseDate').value = met.date_of_purchase.split('T')[0]; // Format for input
            document.getElementById('metalModalTitle').innerText = 'Edit Precious Holding';
            document.getElementById('metalModal').style.display = 'block';
        }
    };
    window.deleteMetal = async (id) => {
        if (confirm('Are you sure you want to delete this precious holding?')) {
            try {
                const res = await fetch(`/precious-holdings/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error('Failed to delete precious holding');
                await fetchMetals();
            } catch (error) {
                console.error('Error deleting precious holding:', error);
                alert('Failed to delete precious holding. Please try again.');
            }
        }
    };

    // --- 6. INITIAL PAGE LOAD ---
    Promise.all([fetchProperties(), fetchPolicies(), fetchMetals()]);
});