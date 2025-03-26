// Sidebar toggle functionality
function openNav() {
  const sidebar = document.getElementById("mySidebar");
  const closeButton = document.getElementById("close-button");
  const main = document.getElementById("main");

  sidebar.style.width = "180px";
  main.style.marginLeft = "180px";
  main.style.width = "calc(100% - 180px)";
  closeButton.innerHTML =
    '<img width="25" src="assets/icons/sidebarclose.png">';
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

// Close the modal based on type
function closeModal(type) {
  if (type === "property") {
    document.getElementById("propertyModal").style.display = "none";
    currentEditingPropertyId = null;
  } else if (type === "policy") {
    document.getElementById("policyModal").style.display = "none";
    currentEditingPolicyId = null;
  } else if (type === "metal") {
    document.getElementById("metalModal").style.display = "none";
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
  ``;
  // Update cancel button for property modal
  const propertyCancelBtn = document.querySelector(
    "#propertyModal .btn-secondary"
  );
  if (propertyCancelBtn) {
    propertyCancelBtn.onclick = function () {
      closeModal("property");
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
  document.getElementById("modalTitle").textContent = "Edit Property";
  document.getElementById("propertyId").value = propertyId;
  document.getElementById("propertyName").value = name;
  document.getElementById("propertyValue").value = value;
  document.getElementById("propertyLocation").value = location;
  document.getElementById("selectedFileName").textContent = "Current image";

  // Show modal
  document.getElementById("propertyModal").style.display = "block";
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
  document.getElementById("policyModalTitle").textContent =
    "Edit Insurance Policy";
  document.getElementById("policyId").value = policyId;
  document.getElementById("policyName").value = name;
  document.getElementById("policyNumber").value = policyNumber;
  document.getElementById("policyProperty").value = property;
  document.getElementById("policyCoverage").value = coverage;
  document.getElementById("policyRenewalDate").value = formattedDate;

  // Show modal
  document.getElementById("policyModal").style.display = "block";
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
  document.getElementById("metalModalTitle").textContent =
    "Edit Precious Holding";
  document.getElementById("metalId").value = metalId;
  document.getElementById("metalType").value = type;
  document.getElementById("metalAmount").value = amount;
  document.getElementById("metalUnit").value = unit;
  document.getElementById("metalValue").value = valueText;
  document.getElementById("metalPurchaseDate").value = formattedDate;

  // Show modal
  document.getElementById("metalModal").style.display = "block";
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
  const filter = searchInput.value.toUpperCase();

  // Filter properties
  const propertyCards = document.querySelectorAll(".property-card");
  propertyCards.forEach((card) => {
    const name = card.querySelector(".property-details h4").textContent;
    const location = card.querySelector(
      ".property-details p:nth-of-type(2)"
    ).textContent;

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
    const name = card.querySelector("h4").textContent;
    const policyNumber = card.querySelector("p:nth-of-type(1)").textContent;
    const property = card.querySelector("p:nth-of-type(2)").textContent;

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
    const type = card.querySelector(".metal-details h4").textContent;

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
});

// DOM Elements
const policyList = document.querySelector(".policy-list");
const policyModal = document.getElementById("policyModal");
const policyForm = document.getElementById("policyForm");

// Event Listeners
policyForm.addEventListener("submit", handlePolicySubmit);

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

  const policyId = document.getElementById("policyId").value;
  const policyData = {
    policy_name: document.getElementById("policyName").value,
    policy_number: document.getElementById("policyNumber").value,
    property_description: document.getElementById("policyProperty").value,
    coverage_amount: document.getElementById("policyCoverage").value,
    renewal_date: document.getElementById("policyRenewalDate").value,
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

// Delete Policy
async function deletePolicy(policyId) {
  if (!confirm("Are you sure you want to delete this policy?")) return;

  try {
    const response = await fetch(`/api/policies/${policyId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete policy");
    }

    fetchPolicies();
  } catch (error) {
    console.error("Error deleting policy:", error);
    alert("Failed to delete policy");
  }
}

// Close Modal
function closeModal(type) {
  if (type === "policy") {
    policyModal.style.display = "none";
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
  }

  if (!policyModal) {
    console.error("Policy Modal Element NOT FOUND");
    console.error("Current document body innerHTML:", document.body.innerHTML);
  }

  // Ensure elements exist before manipulation
  if (!modalTitle || !policyModal) {
    console.error("Critical modal elements are missing. Cannot open modal.");
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

// Comprehensive event listener setup
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

document.addEventListener("DOMContentLoaded", () => {
  const addMetalBtn = document.getElementById("addMetalBtn");
  const metalModal = document.getElementById("metalModal");
  const metalForm = document.getElementById("metalForm");
  const metalsList = document.querySelector(".metals-list");

  loadMetals();

  // Check if elements exist before adding event listeners
  if (addMetalBtn && metalModal) {
    // Open Add Metal Modal
    addMetalBtn.addEventListener("click", () => {
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
  }

  // Close Modal Function
  window.closeModal = (type) => {
    if (metalModal) {
      metalModal.style.display = "none";
    }
  };

  // Close Modal Function
  window.closeModal = (type) => {
    metalModal.style.display = "none";
  };

  // Submit Metal Form
  metalForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const metalId = document.getElementById("metalId").value;
    const metalType = document.getElementById("metalType").value;
    const metalAmount = document.getElementById("metalAmount").value;
    const metalUnit = document.getElementById("metalUnit").value;
    const metalValue = document.getElementById("metalValue").value;
    const metalPurchaseDate =
      document.getElementById("metalPurchaseDate").value;

    try {
      const response = await fetch("/precious-holdings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metalType,
          metalAmount,
          metalUnit,
          metalValue,
          metalPurchaseDate,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        closeModal("metal");
        loadMetals(); // Refresh the list
      } else {
        throw new Error(result.error || "Failed to add metal");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  });

  // Load Metals Function
  async function loadMetals() {
    try {
      const response = await fetch("/precious-holdings");
      const metals = await response.json();

      // Clear existing metals
      metalsList.innerHTML = "";

      // Populate metals list
      metals.forEach((metal) => {
        const metalCard = document.createElement("div");
        metalCard.classList.add("metal-card");
        metalCard.id = `metal-${metal.id}`;

        metalCard.innerHTML = `
                    <div class="metal-icon ${metal.metal_type.toLowerCase()}">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="metal-details">
                        <h4>${
                          metal.metal_type.charAt(0).toUpperCase() +
                          metal.metal_type.slice(1)
                        }</h4>
                        <p>Amount: ${metal.amount} ${metal.amount_unit}</p>
                        <p>Value: $${metal.value.toLocaleString()}</p>
                        <p>Date of Purchase: ${new Date(
                          metal.date_of_purchase
                        ).toLocaleDateString()}</p>
                    </div>
                    <div class="metal-actions">
                        <button class="action-btn edit-btn" onclick="editMetal(${
                          metal.id
                        })">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteMetal(${
                          metal.id
                        })">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

        metalsList.appendChild(metalCard);
      });
    } catch (error) {
      console.error("Error loading metals:", error);
      alert("Failed to load metals");
    }
  }

  // Delete Metal Function
  window.deleteMetal = async (metalId) => {
    if (!confirm("Are you sure you want to delete this metal holding?")) return;

    try {
      const response = await fetch(`/precious-holdings/${metalId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        // Remove the metal card from the DOM
        const metalCard = document.getElementById(`metal-${metalId}`);
        if (metalCard) {
          metalCard.remove();
        }
      } else {
        throw new Error(result.error || "Failed to delete metal");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  // Edit Metal Function (placeholder)
  window.editMetal = (metalId) => {
    // Fetch the specific metal details and populate the form
    // This is a placeholder and would require additional backend endpoint
    alert("Edit functionality to be implemented");
  };
});

document.addEventListener("DOMContentLoaded", () => {
  const propertyGrid = document.getElementById("propertyGrid");
  const addPropertyBtn = document.getElementById("addPropertyBtn");
  const propertyModal = document.getElementById("propertyModal");
  const propertyForm = document.getElementById("propertyForm");
  const propertyImage = document.getElementById("propertyImage");
  const selectedFileName = document.getElementById("selectedFileName");

  // Fetch and display properties
  async function fetchProperties() {
    try {
      const response = await fetch("/properties");
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
    img.src = property.image_url || "assets/images/default-property.jpg";
    img.alt = property.property_name;
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
            <button class="action-btn edit-btn" onclick="editProperty(${property.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" onclick="deleteProperty(${property.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;

    card.appendChild(imageDiv);
    card.appendChild(detailsDiv);
    card.appendChild(actionsDiv);

    return card;
  }

  // Add property button handler
  addPropertyBtn.addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = "Add New Property";
    propertyForm.reset();
    document.getElementById("propertyId").value = "";
    selectedFileName.textContent = "No file selected";
    propertyModal.style.display = "block";
  });

  // Image file selection handler
  propertyImage.addEventListener("change", (e) => {
    const file = e.target.files[0];
    selectedFileName.textContent = file ? file.name : "No file selected";
  });

  // Form submission handler
  propertyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(propertyForm);
    const propertyId = document.getElementById("propertyId").value;

    try {
      let response;
      if (propertyId) {
        // Update existing property
        response = await fetch(`/properties/${propertyId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Add new property
        response = await fetch("/properties", {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save property");
      }

      // Close modal and refresh properties
      propertyModal.style.display = "none";
      fetchProperties();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save property");
    }
  });

  // Global functions for edit and delete
  window.editProperty = async (propertyId) => {
    try {
      const response = await fetch(`/properties`);
      const properties = await response.json();
      const property = properties.find((p) => p.id === propertyId);

      if (property) {
        document.getElementById("modalTitle").textContent = "Edit Property";
        document.getElementById("propertyId").value = property.id;
        document.getElementById("propertyName").value = property.property_name;
        document.getElementById("propertyValue").value =
          property.property_value;
        document.getElementById("propertyLocation").value = property.location;
        selectedFileName.textContent = property.image_url
          ? "Existing image"
          : "No file selected";
        propertyModal.style.display = "block";
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

  window.closeModal = (type) => {
    if (type === "property") {
      propertyModal.style.display = "none";
    }
  };

  // Initial fetch of properties
  fetchProperties();
});



// Initialize on DOM load
document.addEventListener("DOMContentLoaded", fetchPolicies);
