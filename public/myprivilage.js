// Sidebar toggle functionality
function openNav() {
  const sidebar = document.getElementById("mySidebar");
  const closeButton = document.getElementById("close-button");
  const main = document.getElementById("main");

  if (sidebar && closeButton && main) {
    sidebar.style.width = "180px";
    main.style.marginLeft = "180px";
    main.style.width = "calc(100% - 180px)";
    closeButton.innerHTML =
      '<img width="25" src="assets/icons/sidebarclose.png">';
    closeButton.setAttribute("onclick", "closeNav()");
    sidebar.classList.remove("icons-only");
  }
}

function closeNav() {
  const sidebar = document.getElementById("mySidebar");
  const closeButton = document.getElementById("close-button");
  const main = document.getElementById("main");

  if (sidebar && closeButton && main) {
    sidebar.style.width = "60px";
    main.style.marginLeft = "60px";
    main.style.width = "calc(100% - 60px)";
    closeButton.innerHTML = '<img width="25" src="assets/icons/sidebaropen.png">';
    closeButton.setAttribute("onclick", "openNav()");
    sidebar.classList.add("icons-only");
  }
}

// Global variables for asset management
let currentEditingPropertyId = null;
let currentEditingPolicyId = null;
let currentEditingMetalId = null;

// Close the modal based on type
function closeModal(type) {
  if (type === "property") {
    const propertyModal = document.getElementById("propertyModal");
    if (propertyModal) propertyModal.style.display = "none";
    currentEditingPropertyId = null;
  } else if (type === "policy") {
    const policyModal = document.getElementById("policyModal");
    if (policyModal) policyModal.style.display = "none";
    currentEditingPolicyId = null;
  } else if (type === "metal") {
    const metalModal = document.getElementById("metalModal");
    if (metalModal) metalModal.style.display = "none";
    currentEditingMetalId = null;
  }
}

// Update the property modal X button and cancel button
document.addEventListener("DOMContentLoaded", function () {
  // Update X button for property modal
  const propertyCloseX = document.querySelector("#propertyModal .close-modal");
  if (propertyCloseX) {
    propertyCloseX.onclick = function () {
      closeModal("property");
    };
  }
  
  // Update cancel button for property modal
  const propertyCancelBtn = document.querySelector(
    "#propertyModal .btn-secondary"
  );
  if (propertyCancelBtn) {
    propertyCancelBtn.onclick = function () {
      closeModal("property");
    };
  }

  // Update X button for policy modal
  const policyCloseX = document.querySelector("#policyModal .close-modal");
  if (policyCloseX) {
    policyCloseX.onclick = function () {
      closeModal("policy");
    };
  }
  
  // Update cancel button for policy modal
  const policyCancelBtn = document.querySelector(
    "#policyModal .btn-secondary"
  );
  if (policyCancelBtn) {
    policyCancelBtn.onclick = function () {
      closeModal("policy");
    };
  }

  // Update X button for metal modal
  const metalCloseX = document.querySelector("#metalModal .close-modal");
  if (metalCloseX) {
    metalCloseX.onclick = function () {
      closeModal("metal");
    };
  }

  // Update cancel button for metal modal
  const metalCancelBtn = document.querySelector("#metalModal .btn-secondary");
  if (metalCancelBtn) {
    metalCancelBtn.onclick = function () {
      closeModal("metal");
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
  const name = property.querySelector(".property-details h4").textContent;
  const valueText = property.querySelector(
    ".property-details p:nth-of-type(1)"
  ).textContent;
  const locationText = property.querySelector(
    ".property-details p:nth-of-type(2)"
  ).textContent;

  console.log(
    `Found property: ${name}, Value: ${valueText}, Location: ${locationText}`
  );

  // Extract numeric value from the text (remove "$" and commas)
  const value = valueText.replace("Value: $", "").replace(/,/g, "");
  const location = locationText.replace("Location: ", "");

  // Populate form with property details
  const modalTitle = document.getElementById("modalTitle");
  const propertyNameInput = document.getElementById("propertyName");
  const propertyIdInput = document.getElementById("propertyId");
  const propertyValueInput = document.getElementById("propertyValue");
  const propertyLocationInput = document.getElementById("propertyLocation");
  const selectedFileName = document.getElementById("selectedFileName");
  const propertyModal = document.getElementById("propertyModal");
  
  if (modalTitle) modalTitle.textContent = "Edit Property";
  if (propertyIdInput) propertyIdInput.value = propertyId;
  if (propertyNameInput) propertyNameInput.value = name;
  if (propertyValueInput) propertyValueInput.value = value;
  if (propertyLocationInput) propertyLocationInput.value = location;
  if (selectedFileName) selectedFileName.textContent = "Current image";

  // Show modal
  if (propertyModal) propertyModal.style.display = "block";
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
  const name = policy.querySelector("h4").textContent;
  const paragraphs = policy.querySelectorAll("p");
  const policyNumber = paragraphs[0].textContent.replace("Policy Number: ", "");
  const property = paragraphs[1].textContent.replace("Property: ", "");
  const coverage = paragraphs[2].textContent
    .replace("Coverage: $", "")
    .replace(/,/g, "");
  const renewalDateText = paragraphs[3].textContent.replace(
    "Renewal Date: ",
    ""
  );

  // Parse the date for input field (needs YYYY-MM-DD format)
  const dateComponents = renewalDateText.split(" ");
  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const month = monthMap[dateComponents[0]];
  const day = dateComponents[1].replace(",", "").padStart(2, "0");
  const year = dateComponents[2];
  const formattedDate = `${year}-${month}-${day}`;

  // Populate form with policy details
  const policyModalTitle = document.getElementById("policyModalTitle");
  const policyIdInput = document.getElementById("policyId");
  const policyNameInput = document.getElementById("policyName");
  const policyNumberInput = document.getElementById("policyNumber");
  const policyPropertyInput = document.getElementById("policyProperty");
  const policyCoverageInput = document.getElementById("policyCoverage");
  const policyRenewalDateInput = document.getElementById("policyRenewalDate");
  const policyModal = document.getElementById("policyModal");
  
  if (policyModalTitle) policyModalTitle.textContent = "Edit Insurance Policy";
  if (policyIdInput) policyIdInput.value = policyId;
  if (policyNameInput) policyNameInput.value = name;
  if (policyNumberInput) policyNumberInput.value = policyNumber;
  if (policyPropertyInput) policyPropertyInput.value = property;
  if (policyCoverageInput) policyCoverageInput.value = coverage;
  if (policyRenewalDateInput) policyRenewalDateInput.value = formattedDate;

  // Show modal
  if (policyModal) policyModal.style.display = "block";
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
  const type = metal.querySelector(".metal-details h4").textContent;
  const paragraphs = metal.querySelectorAll(".metal-details p");
  const amountText = paragraphs[0].textContent.replace("Amount: ", "");
  const valueText = paragraphs[1].textContent
    .replace("Value: $", "")
    .replace(/,/g, "");
  const dateText = paragraphs[2].textContent.replace("Date of Purchase: ", "");

  // Parse amount and unit
  let amount, unit;
  if (amountText.includes("g")) {
    amount = amountText.replace("g", "");
    unit = "g";
  } else if (amountText.includes("kg")) {
    amount = amountText.replace("kg", "");
    unit = "kg";
  } else {
    amount = amountText;
    unit = "g"; // Default
  }

  // Parse the date for input field (needs YYYY-MM-DD format)
  const dateComponents = dateText.split(" ");
  const monthMap = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  const month = monthMap[dateComponents[0]];
  const day = dateComponents[1].replace(",", "").padStart(2, "0");
  const year = dateComponents[2];
  const formattedDate = `${year}-${month}-${day}`;

  // Populate form with metal details
  const metalModalTitle = document.getElementById("metalModalTitle");
  const metalIdInput = document.getElementById("metalId");
  const metalTypeInput = document.getElementById("metalType");
  const metalAmountInput = document.getElementById("metalAmount");
  const metalUnitInput = document.getElementById("metalUnit");
  const metalValueInput = document.getElementById("metalValue");
  const metalPurchaseDateInput = document.getElementById("metalPurchaseDate");
  const metalModal = document.getElementById("metalModal");
  
  if (metalModalTitle) metalModalTitle.textContent = "Edit Precious Holding";
  if (metalIdInput) metalIdInput.value = metalId;
  if (metalTypeInput) metalTypeInput.value = type;
  if (metalAmountInput) metalAmountInput.value = amount;
  if (metalUnitInput) metalUnitInput.value = unit;
  if (metalValueInput) metalValueInput.value = valueText;
  if (metalPurchaseDateInput) metalPurchaseDateInput.value = formattedDate;

  // Show modal
  if (metalModal) metalModal.style.display = "block";
}

// Delete property
function deleteProperty(propertyId) {
  if (confirm("Are you sure you want to delete this property?")) {
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
  if (confirm("Are you sure you want to delete this insurance policy?")) {
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
  if (confirm("Are you sure you want to delete this precious holding?")) {
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
  const existingProperties = document.querySelectorAll(
    ".property-card:not([id])"
  );
  existingProperties.forEach((property, index) => {
    property.id = `property${index + 1}`;
    console.log(`Assigned ID ${property.id} to existing property`);
  });

  // Initialize policy IDs
  const existingPolicies = document.querySelectorAll(".policy-card:not([id])");
  existingPolicies.forEach((policy, index) => {
    policy.id = `policy${index + 1}`;
    console.log(`Assigned ID ${policy.id} to existing policy`);

    // Add action buttons if not present
    if (!policy.querySelector(".policy-actions")) {
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "policy-actions";
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
    if (!policy.querySelector(".policy-icon")) {
      // Determine icon based on policy name
      let iconClass = "fa-shield-alt"; // Default
      const policyName = policy.querySelector("h4").textContent.toLowerCase();
      if (policyName.includes("home")) {
        iconClass = "fa-home";
      } else if (policyName.includes("property")) {
        iconClass = "fa-building";
      } else if (policyName.includes("mortgage")) {
        iconClass = "fa-landmark";
      }

      const iconDiv = document.createElement("div");
      iconDiv.className = "policy-icon";
      iconDiv.innerHTML = `<i class="fas ${iconClass}"></i>`;

      // Wrap the existing content
      const contentDiv = document.createElement("div");
      contentDiv.className = "policy-content";

      // Move all children except the actions to the content div
      while (
        policy.firstChild &&
        policy.firstChild !== policy.querySelector(".policy-actions")
      ) {
        contentDiv.appendChild(policy.firstChild);
      }

      policy.insertBefore(contentDiv, policy.firstChild);
      policy.insertBefore(iconDiv, policy.firstChild);
    }
  });

  // Initialize metal IDs
  const existingMetals = document.querySelectorAll(".metal-card:not([id])");
  existingMetals.forEach((metal, index) => {
    metal.id = `metal${index + 1}`;
    console.log(`Assigned ID ${metal.id} to existing metal`);

    // Add action buttons if not present
    if (!metal.querySelector(".metal-actions")) {
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "metal-actions";
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
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;
  
  const filter = searchInput.value.toUpperCase();

  // Filter properties
  const propertyCards = document.querySelectorAll(".property-card");
  propertyCards.forEach((card) => {
    const nameEl = card.querySelector(".property-details h4");
    const locationEl = card.querySelector(".property-details p:nth-of-type(2)");
    
    if (!nameEl || !locationEl) return;
    
    const name = nameEl.textContent;
    const location = locationEl.textContent;

    if (
      name.toUpperCase().indexOf(filter) > -1 ||
      location.toUpperCase().indexOf(filter) > -1
    ) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });

  // Filter policies
  const policyCards = document.querySelectorAll(".policy-card");
  policyCards.forEach((card) => {
    const nameEl = card.querySelector("h4");
    const policyNumberEl = card.querySelector("p:nth-of-type(1)");
    const propertyEl = card.querySelector("p:nth-of-type(2)");
    
    if (!nameEl || !policyNumberEl || !propertyEl) return;
    
    const name = nameEl.textContent;
    const policyNumber = policyNumberEl.textContent;
    const property = propertyEl.textContent;

    if (
      name.toUpperCase().indexOf(filter) > -1 ||
      policyNumber.toUpperCase().indexOf(filter) > -1 ||
      property.toUpperCase().indexOf(filter) > -1
    ) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });

  // Filter metals
  const metalCards = document.querySelectorAll(".metal-card");
  metalCards.forEach((card) => {
    const typeEl = card.querySelector(".metal-details h4");
    if (!typeEl) return;
    
    const type = typeEl.textContent;

    if (type.toUpperCase().indexOf(filter) > -1) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// Handle responsive behavior
window.addEventListener("resize", function () {
  if (window.innerWidth <= 992) {
    closeNav();
  }
});

// Initialize on page load
window.addEventListener("load", function () {
  if (window.innerWidth <= 992) {
    closeNav();
  }

  // Initialize IDs for all asset types
  initializeAssetIds();
  
  // Set up search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", filterDashboard);
  }
});

// DOM Elements
const policyList = document.querySelector(".policy-list");
const policyModal = document.getElementById("policyModal");
const policyForm = document.getElementById("policyForm");

// Event Listeners for Policy Form
if (policyForm) {
  policyForm.addEventListener("submit", handlePolicySubmit);
}

// Fetch policies and update the list
async function fetchPolicies() {
  try {
    const response = await fetch("/api/policies", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch policies");
    }

    const policies = await response.json();
    renderPolicies(policies);
  } catch (error) {
    console.error("Error fetching policies:", error);
    alert("Failed to load policies");
  }
}

// Render Policies
function renderPolicies(policies) {
  // Check if policyList exists
  if (!policyList) {
    console.error("Policy list container not found");
    return;
  }
  
  // Clear existing policy cards
  policyList.innerHTML = "";

  policies.forEach((policy) => {
    const policyCard = createPolicyCard(policy);
    policyList.appendChild(policyCard);
  });
}

// Create Policy Card
function createPolicyCard(policy) {
  const div = document.createElement("div");
  div.className = "policy-card";
  div.id = policy.id; // Ensure each card has a unique ID

  // Determine icon based on policy name
  let iconClass = "fa-shield-alt"; // Default
  const name = policy.policy_name;
  if (name.toLowerCase().includes("home")) {
    iconClass = "fa-home";
  } else if (name.toLowerCase().includes("property")) {
    iconClass = "fa-building";
  } else if (name.toLowerCase().includes("mortgage")) {
    iconClass = "fa-landmark";
  } else if (name.toLowerCase().includes("life")) {
    iconClass = "fa-heartbeat";
  } else if (
    name.toLowerCase().includes("auto") ||
    name.toLowerCase().includes("car")
  ) {
    iconClass = "fa-car";
  } else if (name.toLowerCase().includes("health")) {
    iconClass = "fa-hospital";
  }

  // Format coverage with commas
  const formattedCoverage = Number(policy.coverage_amount).toLocaleString();

  // Format date
  const dateObj = new Date(policy.renewal_date);
  const month = dateObj.toLocaleString("default", { month: "short" });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  div.innerHTML = `
        <div class="policy-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="policy-content">
            <h4>${name}</h4>
            <p>Policy Number: ${policy.policy_number}</p>
            <p>Property: ${policy.property_description}</p>
            <p>Coverage: $${formattedCoverage}</p>
            <p>Renewal Date: ${formattedDate}</p>
        </div>
        <div class="policy-actions">
            <button class="action-btn edit-btn" onclick="editPolicy('${policy.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" onclick="deletePolicy('${policy.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

  return div;
}

// Handle Policy Submission
async function handlePolicySubmit(e) {
  e.preventDefault();

  const policyIdEl = document.getElementById("policyId");
  const policyNameEl = document.getElementById("policyName");
  const policyNumberEl = document.getElementById("policyNumber");
  const policyPropertyEl = document.getElementById("policyProperty");
  const policyCoverageEl = document.getElementById("policyCoverage");
  const policyRenewalDateEl = document.getElementById("policyRenewalDate");
  
  if (!policyNameEl || !policyNumberEl || !policyPropertyEl || 
      !policyCoverageEl || !policyRenewalDateEl) {
    console.error("Missing form elements");
    return;
  }
  
  const policyId = policyIdEl ? policyIdEl.value : "";
  const policyData = {
    policy_name: policyNameEl.value,
    policy_number: policyNumberEl.value,
    property_description: policyPropertyEl.value,
    coverage_amount: policyCoverageEl.value,
    renewal_date: policyRenewalDateEl.value,
  };

  try {
    let response;
    if (policyId) {
      // Update existing policy
      response = await fetch(`/api/policies/${policyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(policyData),
      });
    } else {
      // Add new policy
      response = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(policyData),
      });
    }

    if (!response.ok) {
      throw new Error("Failed to save policy");
    }

    closeModal("policy");
    fetchPolicies();
  } catch (error) {
    console.error("Error saving policy:", error);
    alert("Failed to save policy");
  }
}

// Debugging function to verify DOM elements
function debugModalElements() {
  console.log("Debugging Modal Elements:");

  // List of elements to check
  const elementsToCheck = [
    { id: "addPolicyBtn", description: "Add Policy Button" },
    { id: "policyModal", description: "Policy Modal" },
    { id: "policyModalTitle", description: "Policy Modal Title" },
    { id: "policyName", description: "Policy Name Input" },
    { id: "policyNumber", description: "Policy Number Input" },
    { id: "policyProperty", description: "Policy Property Input" },
    { id: "policyCoverage", description: "Policy Coverage Input" },
    { id: "policyRenewalDate", description: "Policy Renewal Date Input" },
    { id: "policyId", description: "Policy ID Hidden Input" },
  ];

  elementsToCheck.forEach((element) => {
    const el = document.getElementById(element.id);
    console.log(
      `${element.description} (${element.id}):`,
      el ? "✓ Found" : "✗ NOT FOUND"
    );
  });
}

// Updated open modal function with extensive logging
function openPolicyModal() {
  // First, run debug check
  debugModalElements();

  // Get references to modal elements
  const modalTitle = document.getElementById("policyModalTitle");
  const policyModal = document.getElementById("policyModal");

  // Detailed logging if elements are not found
  if (!modalTitle) {
    console.error("Modal Title Element NOT FOUND");
    console.error("Current document body innerHTML:", document.body.innerHTML);
    return;
  }

  if (!policyModal) {
    console.error("Policy Modal Element NOT FOUND");
    console.error("Current document body innerHTML:", document.body.innerHTML);
    return;
  }

  // Reset the form and set the modal title
  modalTitle.textContent = "Add New Insurance Policy";

  // Clear existing values in the form
  const formFields = [
    "policyId",
    "policyName",
    "policyNumber",
    "policyProperty",
    "policyCoverage",
    "policyRenewalDate",
  ];

  formFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.value = "";
    } else {
      console.warn(`Field ${fieldId} not found`);
    }
  });

  // Show the modal
  policyModal.style.display = "block";
}

// Setup policy modal event listeners
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Fully Loaded. Setting up policy modal event listener.");

  const addPolicyBtn = document.getElementById("addPolicyBtn");

  if (addPolicyBtn) {
    console.log("Add Policy Button Found. Adding click event listener.");
    addPolicyBtn.addEventListener("click", openPolicyModal);
  } else {
    console.error("Add Policy Button NOT FOUND");
    console.error("Checking all buttons in the document:");
    document.querySelectorAll("button").forEach((btn) => {
      console.log(btn.id, btn.textContent);
    });
  }
});

// Setup metals functionality
document.addEventListener("DOMContentLoaded", () => {
  const addMetalBtn = document.getElementById("addMetalBtn");
  const metalModal = document.getElementById("metalModal");
  const metalForm = document.getElementById("metalForm");
  const metalsList = document.querySelector(".metals-list");

  // Load metals on page load if elements exist
  if (metalsList) {
    loadMetals();
  } else {
    console.log("Metals list container not found, creating if needed");
    // Create metals list container if it doesn't exist
    const container = document.querySelector(".container") || document.body;
    if (container) {
      const metalsSection = document.createElement("div");
      metalsSection.className = "metals-section";
      metalsSection.innerHTML = `
        <h2>Precious Metals</h2>
        <div class="metals-header">
          <button id="addMetalBtn" class="btn btn-primary">Add New Metal</button>
          <div class="metals-list"></div>
        </div>
      `;
      container.appendChild(metalsSection);
      // Re-get references after creating elements
      const metalsList = document.querySelector(".metals-list");
      if (metalsList) {
        loadMetals();
      }
    }
  }

  // Check if elements exist before adding event listeners
  if (addMetalBtn && metalModal) {
    // Open Add Metal Modal
    addMetalBtn.addEventListener("click", () => {
      console.log("Add Metal button clicked");
      // Safely set the modal title
      const metalModalTitle = document.getElementById("metalModalTitle");
      if (metalModalTitle) {
        metalModalTitle.textContent = "Add New Precious Metal";
      }

      // Reset the form
      if (metalForm) {
        metalForm.reset();
      }

      // Set metal ID to empty
      const metalId = document.getElementById("metalId");
      if (metalId) {
        metalId.value = "";
      }

      // Show the modal
      metalModal.style.display = "block";
    });
  } else {
    console.log("Add Metal button or Metal Modal not found");
    if (!addMetalBtn) {
      console.log("Creating Add Metal button if container exists");
      const metalsHeader = document.querySelector(".metals-header");
      if (metalsHeader) {
        const addBtn = document.createElement("button");
        addBtn.id = "addMetalBtn";
        addBtn.className = "btn btn-primary";
        addBtn.textContent = "Add New Metal";
        metalsHeader.prepend(addBtn);
        
        // Add event listener to newly created button
        addBtn.addEventListener("click", () => {
          const metalModal = document.getElementById("metalModal");
          if (metalModal) {
            // Reset form and show modal
            const metalForm = document.getElementById("metalForm");
            if (metalForm) metalForm.reset();
            
            const metalId = document.getElementById("metalId");
            if (metalId) metalId.value = "";
            
            const metalModalTitle = document.getElementById("metalModalTitle");
            if (metalModalTitle) metalModalTitle.textContent = "Add New Precious Metal";
            
            metalModal.style.display = "block";
          }
        });
      }
    }
  }

  // Make sure metal form exists before adding event listener
  if (metalForm) {
    // Submit Metal Form
    metalForm.addEventListener("submit", handleMetalSubmit);
  } else {
    console.log("Metal form not found");
  }

  // Handle Metal Form Submission (separated for clarity)
  async function handleMetalSubmit(e) {
    e.preventDefault();
    console.log("Metal form submitted");

    const metalIdEl = document.getElementById("metalId");
    const metalTypeEl = document.getElementById("metalType");
    const metalAmountEl = document.getElementById("metalAmount");
    const metalUnitEl = document.getElementById("metalUnit");
    const metalValueEl = document.getElementById("metalValue");
    const metalPurchaseDateEl = document.getElementById("metalPurchaseDate");
    
    if (!metalTypeEl || !metalAmountEl || !metalUnitEl || 
        !metalValueEl || !metalPurchaseDateEl) {
      console.error("Missing metal form elements");
      return;
    }
    
    const metalId = metalIdEl ? metalIdEl.value : "";
    const metalData = {
      metal_type: metalTypeEl.value,
      amount: metalAmountEl.value,
      amount_unit: metalUnitEl.value,
      value: metalValueEl.value,
      date_of_purchase: metalPurchaseDateEl.value,
    };

    console.log("Metal data to save:", metalData);

    try {
      // For local demonstration without an actual API
      // Just create/update a metal card directly
      if (metalId) {
        // Update existing metal card
        updateMetalCard(metalId, metalData);
      } else {
        // Create new metal card with generated ID
        createMetalCard(metalData);
      }
      
      closeModal("metal");
    } catch (error) {
      console.error("Error saving metal:", error);
      alert("Failed to save metal: " + error.message);
    }
  }

  // Load Metals Function
  async function loadMetals() {
    const metalsList = document.querySelector(".metals-list");
    if (!metalsList) {
      console.error("Metals list container not found");
      return;
    }
    
    // For demo purposes, create sample metals if no metals are present
    if (metalsList.children.length === 0) {
      console.log("Creating sample metals for demonstration");
      
      const sampleMetals = [
        {
          id: "metal1",
          metal_type: "gold",
          amount: "10",
          amount_unit: "g",
          value: "800",
          date_of_purchase: "2023-01-15"
        },
        {
          id: "metal2",
          metal_type: "silver",
          amount: "500",
          amount_unit: "g",
          value: "450",
          date_of_purchase: "2023-02-20"
        },
        {
          id: "metal3",
          metal_type: "platinum",
          amount: "5",
          amount_unit: "g",
          value: "300",
          date_of_purchase: "2023-03-10"
        }
      ];
      
      // Clear existing metals
      metalsList.innerHTML = "";
      
      // Create metal cards for samples
      sampleMetals.forEach(metal => {
        createMetalCardFromData(metal);
      });
    }
  }

  // Create a new metal card 
  function createMetalCard(metalData) {
    const metalsList = document.querySelector(".metals-list");
    if (!metalsList) {
      console.error("Metals list container still not found");
      return;
    }
    
    // Generate an ID for the new metal
    const newId = `metal${Date.now()}`;
    const metalWithId = {
      id: newId,
      ...metalData
    };
    
    createMetalCardFromData(metalWithId);
  }
  
  // Update an existing metal card
  function updateMetalCard(metalId, metalData) {
    const metalCard = document.getElementById(metalId);
    if (!metalCard) {
      console.error(`Metal card with ID ${metalId} not found for updating`);
      return;
    }
    
    // Update metal card with new data
    const metalWithId = {
      id: metalId,
      ...metalData
    };
    
    const newMetalCard = createMetalCardElement(metalWithId);
    metalCard.replaceWith(newMetalCard);
  }
  
  // Create metal card from data and add to DOM
  function createMetalCardFromData(metal) {
    const metalsList = document.querySelector(".metals-list");
    if (!metalsList) return;
    
    const metalCard = createMetalCardElement(metal);
    metalsList.appendChild(metalCard);
  }
  
  // Create metal card element
  function createMetalCardElement(metal) {
    const metalCard = document.createElement("div");
    metalCard.classList.add("metal-card");
    metalCard.id = metal.id;
    
    // Format date for display
    const purchaseDate = new Date(metal.date_of_purchase);
    const formattedDate = purchaseDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Format value with commas
    const formattedValue = Number(metal.value).toLocaleString();
    
    metalCard.innerHTML = `
      <div class="metal-icon ${metal.metal_type.toLowerCase()}">
        <i class="fas fa-coins"></i>
      </div>
      <div class="metal-details">
        <h4>${metal.metal_type.charAt(0).toUpperCase() + metal.metal_type.slice(1)}</h4>
        <p>Amount: ${metal.amount} ${metal.amount_unit}</p>
        <p>Value: $${formattedValue}</p>
        <p>Date of Purchase: ${formattedDate}</p>
      </div>
      <div class="metal-actions">
        <button class="action-btn edit-btn" onclick="editMetal('${metal.id}')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-btn" onclick="deleteMetal('${metal.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    return metalCard;
  }

  // Make global metal functions available
  window.createMetalCard = createMetalCard;
  window.updateMetalCard = updateMetalCard;
  window.createMetalCardFromData = createMetalCardFromData;
  window.createMetalCardElement = createMetalCardElement;

  // Delete Metal Function - make it available globally
  window.deleteMetal = (metalId) => {
    if (!confirm("Are you sure you want to delete this metal holding?")) return;

    try {
      // Remove the metal card from the DOM
      const metalCard = document.getElementById(metalId);
      if (metalCard) {
        metalCard.remove();
        console.log(`Metal ${metalId} deleted successfully`);
      } else {
        console.error(`Metal with ID ${metalId} not found for deletion`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete metal: " + error.message);
    }
  };

  // Edit Metal Function - make it available globally
  window.editMetal = (metalId) => {
    console.log(`Editing metal with ID: ${metalId}`);

    const metal = document.getElementById(metalId);
    if (!metal) {
      console.error(`Metal with ID ${metalId} not found for editing`);
      return;
    }

    currentEditingMetalId = metalId;

    // Get metal details
    const type = metal.querySelector(".metal-details h4").textContent;
    const paragraphs = metal.querySelectorAll(".metal-details p");
    const amountText = paragraphs[0].textContent.replace("Amount: ", "");
    const valueText = paragraphs[1].textContent
      .replace("Value: $", "")
      .replace(/,/g, "");
    const dateText = paragraphs[2].textContent.replace("Date of Purchase: ", "");

    // Parse amount and unit
    let amount, unit;
    if (amountText.includes("g")) {
      amount = amountText.replace("g", "").trim();
      unit = "g";
    } else if (amountText.includes("kg")) {
      amount = amountText.replace("kg", "").trim();
      unit = "kg";
    } else {
      amount = amountText;
      unit = "g"; // Default
    }

    // Parse the date for input field (needs YYYY-MM-DD format)
    const dateObj = new Date(dateText);
    const formattedDate = dateObj.toISOString().split('T')[0];

    // Populate form with metal details
    const metalModalTitle = document.getElementById("metalModalTitle");
    const metalIdInput = document.getElementById("metalId");
    const metalTypeInput = document.getElementById("metalType");
    const metalAmountInput = document.getElementById("metalAmount");
    const metalUnitInput = document.getElementById("metalUnit");
    const metalValueInput = document.getElementById("metalValue");
    const metalPurchaseDateInput = document.getElementById("metalPurchaseDate");
    const metalModal = document.getElementById("metalModal");
    
    if (metalModalTitle) metalModalTitle.textContent = "Edit Precious Holding";
    if (metalIdInput) metalIdInput.value = metalId;
    if (metalTypeInput) metalTypeInput.value = type.toLowerCase();
    if (metalAmountInput) metalAmountInput.value = amount;
    if (metalUnitInput) metalUnitInput.value = unit;
    if (metalValueInput) metalValueInput.value = valueText;
    if (metalPurchaseDateInput) metalPurchaseDateInput.value = formattedDate;

    // Show modal
    if (metalModal) metalModal.style.display = "block";
  };
});

// Setup properties functionality
document.addEventListener("DOMContentLoaded", () => {
  const propertyGrid = document.getElementById("propertyGrid");
  const addPropertyBtn = document.getElementById("addPropertyBtn");
  const propertyModal = document.getElementById("propertyModal");
  const propertyForm = document.getElementById("propertyForm");
  const propertyImage = document.getElementById("propertyImage");
  const selectedFileName = document.getElementById("selectedFileName");

  // Fetch properties on page load if elements exist
  if (propertyGrid) {
    fetchProperties();
  }

  // Check if elements exist before adding event listeners
  if (addPropertyBtn && propertyModal) {
    // Add property button handler
    addPropertyBtn.addEventListener("click", () => {
      const modalTitle = document.getElementById("modalTitle");
      const propertyId = document.getElementById("propertyId");
      
      if (modalTitle) modalTitle.textContent = "Add New Property";
      if (propertyForm) propertyForm.reset();
      if (propertyId) propertyId.value = "";
      if (selectedFileName) selectedFileName.textContent = "No file selected";
      
      propertyModal.style.display = "block";
    });
  }

  // Image file selection handler
  if (propertyImage && selectedFileName) {
    propertyImage.addEventListener("change", (e) => {
      const file = e.target.files[0];
      selectedFileName.textContent = file ? file.name : "No file selected";
    });
  }

  // Form submission handler
  if (propertyForm) {
    propertyForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(propertyForm);
      const propertyIdEl = document.getElementById("propertyId");
      const propertyId = propertyIdEl ? propertyIdEl.value : "";

      try {
        let url = "/properties";
        let method = "POST";
        
        if (propertyId) {
          url = `/properties/${propertyId}`;
          method = "PUT";
        }
        
        const response = await fetch(url, {
          method: method,
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to save property");
        }

        // Close modal and refresh properties
        if (propertyModal) propertyModal.style.display = "none";
        fetchProperties();
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to save property");
      }
    });
  }

  // Fetch and display properties
  async function fetchProperties() {
    if (!propertyGrid) {
      console.error("Property grid container not found");
      return;
    }
    
    try {
      const response = await fetch("/properties");
      
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      
      const properties = await response.json();

      // Clear existing property cards
      propertyGrid.innerHTML = "";

      // Render each property
      properties.forEach((property) => {
        const propertyCard = createPropertyCard(property);
        propertyGrid.appendChild(propertyCard);
      });
    } catch (error) {
      console.error("Error fetching properties:", error);
      alert("Failed to load properties");
    }
  }

  // Create property card
  function createPropertyCard(property) {
    const card = document.createElement("div");
    card.className = "property-card";
    card.id = `property${property.id}`;

    // Image section
    const imageDiv = document.createElement("div");
    imageDiv.className = "property-image";
    const img = document.createElement("img");

    // Convert local file path to a format that can be displayed
    const getLocalImagePath = (localPath) => {
      if (!localPath) {
        return "assets/images/default-property.jpg";
      }

      // Extract filename and create a path that can be fetched
      const filename = localPath.split("/").pop();
      return `/local-images/${filename}`;
    };

    // Set image source using the converted path
    img.src = getLocalImagePath(property.image_url);
    img.alt = property.property_name;

    // Add error handling for image loading
    img.onerror = () => {
      img.src = "assets/images/default-property.jpg";
    };

    imageDiv.appendChild(img);

    // Details section
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "property-details";
    detailsDiv.innerHTML = `
            <h4>${property.property_name}</h4>
            <p>Value: $${property.property_value.toLocaleString()}</p>
            <p>Location: ${property.location}</p>
        `;

    // Actions section
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "property-actions";
    actionsDiv.innerHTML = `
            <button class="action-btn edit-btn" onclick="editProperty('${property.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" onclick="deleteProperty('${property.id}')">
                <i class="fas fa-trash"></i>
            </button>
        `;

    card.appendChild(imageDiv);
    card.appendChild(detailsDiv);
    card.appendChild(actionsDiv);

    return card;
  }

  // Global functions for edit and delete
  window.editProperty = async (propertyId) => {
    try {
      const response = await fetch(`/properties/${propertyId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch property details");
      }
      
      const property = await response.json();
      
      if (property) {
        const modalTitle = document.getElementById("modalTitle");
        const propertyIdInput = document.getElementById("propertyId");
        const propertyNameInput = document.getElementById("propertyName");
        const propertyValueInput = document.getElementById("propertyValue");
        const propertyLocationInput = document.getElementById("propertyLocation");
        const selectedFileName = document.getElementById("selectedFileName");
        const propertyModal = document.getElementById("propertyModal");
        
        if (modalTitle) modalTitle.textContent = "Edit Property";
        if (propertyIdInput) propertyIdInput.value = property.id;
        if (propertyNameInput) propertyNameInput.value = property.property_name;
        if (propertyValueInput) propertyValueInput.value = property.property_value;
        if (propertyLocationInput) propertyLocationInput.value = property.location;
        if (selectedFileName) selectedFileName.textContent = property.image_url ? "Existing image" : "No file selected";
        
        if (propertyModal) propertyModal.style.display = "block";
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      alert("Failed to load property details");
    }
  };

  window.deleteProperty = async (propertyId) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete property");
      }

      fetchProperties();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete property");
    }
  };

  // Global close modal function
  window.closeModal = (type) => {
    if (type === "property") {
      const propertyModal = document.getElementById("propertyModal");
      if (propertyModal) propertyModal.style.display = "none";
    } else if (type === "policy") {
      const policyModal = document.getElementById("policyModal");
      if (policyModal) policyModal.style.display = "none";
    } else if (type === "metal") {
      const metalModal = document.getElementById("metalModal");
      if (metalModal) metalModal.style.display = "none";
    }
  };
});

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize policy functionality
  const policyList = document.querySelector(".policy-list");
  if (policyList) {
    fetchPolicies();
  }
});