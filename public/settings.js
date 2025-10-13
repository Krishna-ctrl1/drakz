function openNav() {
  const sidebar = document.getElementById("mySidebar");
  const closeButton = document.getElementById("close-button");

  sidebar.style.width = "180px"; // Open sidebar to full width
  document.getElementById("main").style.marginLeft = "180px"; // Adjust main content
  closeButton.innerHTML =
    '<img width="25" src="assets/icons/sidebarclose.png">'; // Set close button image
  closeButton.setAttribute("onclick", "closeNav()"); // Set close behavior
  sidebar.classList.remove("icons-only"); // Ensure text is visible
}

function closeNav() {
  const sidebar = document.getElementById("mySidebar");
  const closeButton = document.getElementById("close-button");

  sidebar.style.width = "60px"; // Set sidebar to icons-only mode
  document.getElementsByClassName("content")[0].style.marginLeft = "60px";

  closeButton.innerHTML = '<img width="25" src="assets/icons/sidebaropen.png">'; // Set open button image
  closeButton.setAttribute("onclick", "openNav()"); // Set open behavior
  sidebar.classList.add("icons-only"); // Hide text
}

// Toggle Switches
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all toggles
  document.querySelectorAll(".switch input").forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const slider = this.nextElementSibling;
      slider.style.backgroundColor = this.checked ? "#4CAF50" : "#ccc";
      // Add API call here to save preference
    });
  });

  // Export Data Button
  document.getElementById("export-data").addEventListener("click", function () {
    alert("Preparing your data export...");
    // Simulate API call
    setTimeout(() => {
      alert("Data exported successfully!");
    }, 1500);
  });
});

// Account Deletion Confirmation
function confirmDelete() {
  if (
    confirm(
      "WARNING: This will permanently delete your account and all data. Continue?",
    )
  ) {
    alert("Account deletion initiated. Check your email for confirmation.");
    // Add API call here
  }
}

// Profile Management with Validation
document.addEventListener("DOMContentLoaded", function () {
  // Load saved profile data
  loadProfile();

  // Edit Button
  document
    .getElementById("profile-edit-btn")
    .addEventListener("click", function () {
      document.getElementById("profile-display").style.display = "none";
      document.getElementById("profile-edit-form").style.display = "block";
    });

  // Cancel Button
  document
    .getElementById("profile-cancel-btn")
    .addEventListener("click", function () {
      document.getElementById("profile-display").style.display = "flex";
      document.getElementById("profile-edit-form").style.display = "none";
      // Reset any validation errors
      clearValidationErrors();
    });

  // Save Button
  document
    .getElementById("profile-save-btn")
    .addEventListener("click", saveProfile);

  // Image Upload Preview
  document
    .getElementById("profile-image-upload")
    .addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        // Validate image file type and size
        if (!file.type.match("image.*")) {
          alert("Please select an image file (JPEG, PNG, etc.)");
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          // 2MB limit
          alert("Image size should be less than 2MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
          document.getElementById("profile-image").src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

  // Add real-time validation
  document
    .getElementById("edit-email")
    .addEventListener("input", validateEmail);
  document
    .getElementById("edit-phone")
    .addEventListener("input", validatePhone);
});

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem("userProfile")) || {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1 (555) 123-4567",
    dob: "1990-05-15",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  };

  document.getElementById("profile-name").textContent = profile.name;
  document.getElementById("profile-email").textContent = profile.email;
  document.getElementById("profile-phone").textContent = profile.phone;
  document.getElementById("profile-dob").textContent = profile.dob;
  document.getElementById("profile-image").src = profile.image;

  // Pre-fill edit form
  document.getElementById("edit-name").value = profile.name;
  document.getElementById("edit-email").value = profile.email;
  document.getElementById("edit-phone").value = profile.phone;
  document.getElementById("edit-dob").value = profile.dob;
}

function saveProfile() {
  // Clear previous errors
  clearValidationErrors();

  // Validate all fields
  const nameValid = validateName();
  const emailValid = validateEmail();
  const phoneValid = validatePhone();
  const dobValid = validateDOB();

  if (!nameValid || !emailValid || !phoneValid || !dobValid) {
    return; // Don't save if validation fails
  }

  const updatedProfile = {
    name: document.getElementById("edit-name").value.trim(),
    email: document.getElementById("edit-email").value.trim(),
    phone: document.getElementById("edit-phone").value.trim(),
    dob: document.getElementById("edit-dob").value,
    image: document.getElementById("profile-image").src,
  };

  // Save to localStorage
  localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

  // Update display
  loadProfile();

  // Switch back to view mode
  document.getElementById("profile-display").style.display = "flex";
  document.getElementById("profile-edit-form").style.display = "none";

  alert("Profile updated successfully!");
}

// Validation Functions
function validateName() {
  const nameInput = document.getElementById("edit-name");
  const name = nameInput.value.trim();
  const nameError =
    document.getElementById("name-error") ||
    createErrorElement(nameInput, "name-error");

  if (!name) {
    nameError.textContent = "Name is required";
    return false;
  }
  if (name.length < 2) {
    nameError.textContent = "Name must be at least 2 characters";
    return false;
  }
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    nameError.textContent = "Name contains invalid characters";
    return false;
  }

  nameError.textContent = "";
  return true;
}

function validateEmail() {
  const emailInput = document.getElementById("edit-email");
  const email = emailInput.value.trim();
  const emailError =
    document.getElementById("email-error") ||
    createErrorElement(emailInput, "email-error");

  if (!email) {
    emailError.textContent = "Email is required";
    return false;
  }

  // Robust email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    emailError.textContent = "Please enter a valid email address";
    return false;
  }

  emailError.textContent = "";
  return true;
}

function validatePhone() {
  const phoneInput = document.getElementById("edit-phone");
  const phone = phoneInput.value.trim();
  const phoneError =
    document.getElementById("phone-error") ||
    createErrorElement(phoneInput, "phone-error");

  if (!phone) {
    phoneError.textContent = "Phone number is required";
    return false;
  }

  // International phone number validation (simplified)
  const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
  if (!phoneRegex.test(phone)) {
    phoneError.textContent = "Please enter a valid phone number";
    return false;
  }

  // Additional check for minimum digits (7-15 digits)
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    phoneError.textContent = "Phone number should be 7-15 digits";
    return false;
  }

  phoneError.textContent = "";
  return true;
}

function validateDOB() {
  const dobInput = document.getElementById("edit-dob");
  const dob = dobInput.value;
  const dobError =
    document.getElementById("dob-error") ||
    createErrorElement(dobInput, "dob-error");

  if (!dob) {
    dobError.textContent = "Date of birth is required";
    return false;
  }

  // Check if user is at least 13 years old
  const dobDate = new Date(dob);
  const today = new Date();
  const minAgeDate = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate(),
  );

  if (dobDate > minAgeDate) {
    dobError.textContent = "You must be at least 13 years old";
    return false;
  }

  dobError.textContent = "";
  return true;
}

// Helper Functions
function createErrorElement(inputElement, errorId) {
  const errorElement = document.createElement("small");
  errorElement.id = errorId;
  errorElement.className = "validation-error";
  inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
  return errorElement;
}

function clearValidationErrors() {
  document.querySelectorAll(".validation-error").forEach((el) => {
    el.textContent = "";
  });
}

// Add to settings.js
const encryptData = async (data, secretKey) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const keyBuffer = encoder.encode(secretKey.slice(0, 32));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    dataBuffer,
  );
  return {
    iv: Array.from(iv),
    encrypted: Array.from(new Uint8Array(encrypted)),
  };
};

const decryptData = async (encryptedObj, secretKey) => {
  const encoder = new TextEncoder();
  const keyBuffer = encoder.encode(secretKey.slice(0, 32));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(encryptedObj.iv) },
    cryptoKey,
    new Uint8Array(encryptedObj.encrypted),
  );
  return new TextDecoder().decode(decrypted);
};

//change password
document.addEventListener("DOMContentLoaded", function () {
  const changePasswordBtn = document.getElementById("change-password-btn");
  const passwordForm = document.getElementById("password-change-form");
  const cancelBtn = document.getElementById("cancel-password-change");

  // Toggle password form visibility
  changePasswordBtn.addEventListener("click", function () {
    passwordForm.style.display =
      passwordForm.style.display === "none" ? "block" : "none";
  });

  // Cancel password change
  cancelBtn.addEventListener("click", function () {
    passwordForm.style.display = "none";
    document.getElementById("password-error").textContent = "";
    document.getElementById("current-password").value = "";
    document.getElementById("new-password").value = "";
    document.getElementById("confirm-password").value = "";
  });

  // Save new password
  document
    .getElementById("save-password-change")
    .addEventListener("click", function () {
      const currentPass = document.getElementById("current-password").value;
      const newPass = document.getElementById("new-password").value;
      const confirmPass = document.getElementById("confirm-password").value;
      const errorElement = document.getElementById("password-error");

      // Validate password strength
      if (!/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/.test(newPass)) {
        errorElement.textContent =
          "Password must be at least 8 characters with 1 number and 1 special character";
        return;
      }

      if (newPass !== confirmPass) {
        errorElement.textContent = "Passwords do not match";
        return;
      }

      // In a real app, you would verify current password with server
      localStorage.setItem("userPassword", newPass);
      alert("Password changed successfully!");

      // Reset form
      passwordForm.style.display = "none";
      document.getElementById("current-password").value = "";
      document.getElementById("new-password").value = "";
      document.getElementById("confirm-password").value = "";
      errorElement.textContent = "";
    });
});
document.getElementById("2fa-phone").textContent =
  localStorage.getItem("userPhone") || "";
document.getElementById("2fa-email").textContent =
  localStorage.getItem("userEmail") || "";

let successMessageTimeout;
document.addEventListener("DOMContentLoaded", function () {
  const toggle2FA = document.getElementById("2fa-toggle");
  const setupForm = document.getElementById("t2fa-setup-form");
  const confirmDisableDiv = document.getElementById("confirm-disable-2fa");
  const successMessageDiv = document.getElementById("2fa-success-message");
  const changeSettingsBtn = document.getElementById("change-2fa-settings");

  // Validate email format
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Validate phone number format (basic validation)
  function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(String(phone));
  }

  // Initialize 2FA state
  function init2FAState() {
    const isEnabled = localStorage.getItem("2faEnabled") === "true";
    toggle2FA.checked = isEnabled;

    if (isEnabled) {
      successMessageDiv.style.display = "block";
      setupForm.style.display = "none";
    } else {
      successMessageDiv.style.display = "none";
      setupForm.style.display = "none";
    }
    confirmDisableDiv.style.display = "none";
    document.getElementById("2fa-change-settings").style.display = isEnabled
      ? "block"
      : "none";
  }

  // Load saved 2FA settings into form
  function loadSaved2FASettings() {
    const method = localStorage.getItem("2faMethod") || "email";
    const contact = localStorage.getItem("2faContact") || "";

    document.querySelector(
      `input[name="2fa-method"][value="${method}"]`,
    ).checked = true;
    if (method === "email") {
      document.getElementById("email-verification").style.display = "block";
      document.getElementById("phone-verification").style.display = "none";
      document.getElementById("2fa-email").value = contact;
    } else {
      document.getElementById("email-verification").style.display = "none";
      document.getElementById("phone-verification").style.display = "block";
      document.getElementById("2fa-phone").value = contact;
    }
  }

  // Toggle change handler
  toggle2FA.addEventListener("change", function () {
    if (this.checked) {
      // Turning ON
      if (localStorage.getItem("2faEnabled") === "true") {
        // Already enabled - show success message
        successMessageDiv.style.display = "block";
        setupForm.style.display = "none";
        document.getElementById("2fa-change-settings").style.display = "block"; // ✅ show button
      } else {
        // New setup - show form
        setupForm.style.display = "block";
        successMessageDiv.style.display = "none";
        document.getElementById("2fa-change-settings").style.display = "block"; // ✅ show button
      }
      confirmDisableDiv.style.display = "none";
    } else {
      // Turning OFF
      if (localStorage.getItem("2faEnabled") === "true") {
        // Show confirmation for existing 2FA
        confirmDisableDiv.style.display = "block";
        setupForm.style.display = "none";
        successMessageDiv.style.display = "none";
      } else {
        // Cancel new setup
        setupForm.style.display = "none";
        successMessageDiv.style.display = "none";
        document.getElementById("2fa-change-settings").style.display = "none"; // ✅ hide button
      }
    }
  });

  // Confirm setup with validation
  document
    .getElementById("confirm-2fa-setup")
    .addEventListener("click", function (e) {
      const method = document.querySelector(
        'input[name="2fa-method"]:checked',
      ).value;
      let contact, isValid;

      if (method === "email") {
        contact = document.getElementById("2fa-email").value.trim();
        isValid = validateEmail(contact);
        if (!isValid) {
          alert("Please enter a valid email address (e.g., user@example.com)");
          e.preventDefault();
          return;
        }
      } else {
        contact = document.getElementById("2fa-phone").value.trim();
        isValid = validatePhone(contact);
        if (!isValid) {
          alert("Please enter a valid phone number (e.g., 123-456-7890)");
          e.preventDefault();
          return;
        }
      }

      // Only proceed if validation passed
      localStorage.setItem("2faEnabled", "true");
      localStorage.setItem("2faMethod", method);
      localStorage.setItem("2faContact", contact);

      setupForm.style.display = "none";
      successMessageDiv.style.display = "block";

      // Clear any existing timeout
      if (successMessageTimeout) {
        clearTimeout(successMessageTimeout);
      }

      // Set new timeout to hide after 5 seconds
      successMessageTimeout = setTimeout(() => {
        successMessageDiv.style.display = "none";
      }, 3000);
    });

  // Change settings button
  changeSettingsBtn.addEventListener("click", function () {
    // Clear any existing timeout when manually changing settings
    if (successMessageTimeout) {
      clearTimeout(successMessageTimeout);
      successMessageTimeout = null;
    }
    successMessageDiv.style.display = "none";
    setupForm.style.display = "block";
    loadSaved2FASettings();
  });
  // function init2FAState() {
  //   const isEnabled = localStorage.getItem('2faEnabled') === 'true';
  //   toggle2FA.checked = isEnabled;

  //   if (isEnabled) {
  //       // Don't show success message on initial load
  //       successMessageDiv.style.display = 'none';
  //       setupForm.style.display = 'none';
  //   } else {
  //       successMessageDiv.style.display = 'none';
  //       setupForm.style.display = 'none';
  //   }
  //   confirmDisableDiv.style.display = 'none';
  // }

  // Confirm disable
  document
    .getElementById("confirm-disable-yes")
    .addEventListener("click", function () {
      localStorage.removeItem("2faEnabled");
      localStorage.removeItem("2faMethod");
      localStorage.removeItem("2faContact");
      toggle2FA.checked = false;
      confirmDisableDiv.style.display = "none";
      successMessageDiv.style.display = "none";
    });

  // Cancel disable
  document
    .getElementById("confirm-disable-no")
    .addEventListener("click", function () {
      toggle2FA.checked = true;
      confirmDisableDiv.style.display = "none";
      successMessageDiv.style.display = "block";

      // Set timeout to hide after 5 seconds
      if (successMessageTimeout) {
        clearTimeout(successMessageTimeout);
      }
      successMessageTimeout = setTimeout(() => {
        successMessageDiv.style.display = "none";
      }, 5000);
    });

  // Cancel setup
  document
    .getElementById("cancel-2fa-setup")
    .addEventListener("click", function () {
      if (localStorage.getItem("2faEnabled") === "true") {
        // Case 1: 2FA was already enabled - keep it enabled
        toggle2FA.checked = true;
        successMessageDiv.style.display = "block";
        setupForm.style.display = "none";
      } else {
        // Case 2: New setup being canceled - fully disable
        toggle2FA.checked = false;
        setupForm.style.display = "none";
        successMessageDiv.style.display = "none";
        const slider = document.querySelector(".slider");
        slider.style.backgroundColor = "#ccc";
      }
    });

  // Method radio button change handler
  document.querySelectorAll('input[name="2fa-method"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "email") {
        document.getElementById("email-verification").style.display = "block";
        document.getElementById("phone-verification").style.display = "none";
      } else {
        document.getElementById("email-verification").style.display = "none";
        document.getElementById("phone-verification").style.display = "block";
      }
    });
  });

  // Initialize on page load
  init2FAState();
});

// settings.js
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements for goals
  const addGoalBtn = document.getElementById("add-goal");
  const goalModal = document.getElementById("goal-modal");
  const goalForm = goalModal?.querySelector("form");
  const cancelGoalBtn = document.getElementById("cancel-goal");
  const saveGoalBtn = document.getElementById("save-goal");
  const closeModalBtn = goalModal?.querySelector(".close-modal");
  const goalsList = document.getElementById("goals-list");
  const modalTitle = goalModal?.querySelector("h3");
  const activeGoalsCount = document.getElementById("active-goals-count");
  const completedGoalsCount = document.getElementById("completed-goals-count");
  const totalSaved = document.getElementById("total-saved");
  const contributionModal = document.getElementById("contribution-modal");
  const contributionForm = contributionModal?.querySelector("form");
  const cancelContribution = document.getElementById("cancel-contribution");
  const saveContribution = document.getElementById("save-contribution");
  const closeContributionBtn = contributionModal?.querySelector(".close-modal");
  const filterCategory = document.getElementById("filter-category");
  const sortBy = document.getElementById("sort-by");

  let editingGoalId = null;
  let contributingGoalId = null;

  // Check if critical elements exist
  if (!goalsList || !addGoalBtn || !goalModal || !goalForm) {
    console.error("Critical goal elements missing:", {
      goalsList: !goalsList,
      addGoalBtn: !addGoalBtn,
      goalModal: !goalModal,
      goalForm: !goalForm,
    });
    showNotification("Error: Goal management UI elements not found", "error");
    return;
  }

  // Notification function
  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.padding = "10px 20px";
    notification.style.backgroundColor = type === "error" ? "#e74c3c" : "#2ecc71";
    notification.style.color = "#fff";
    notification.style.borderRadius = "4px";
    notification.style.zIndex = "10000";
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  async function fetchGoals() {
    try {
      const response = await fetch("/api/goals");
      if (!response.ok) {
        throw new Error((await response.json()).message || "Failed to fetch goals");
      }
      const { data } = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid goals data format");
      }
      renderGoals(data);
      updateSummaries(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
      showNotification("Failed to load goals: " + error.message, "error");
    }
  }

  function renderGoals(goals) {
    if (!goalsList) {
      console.error("goalsList element is missing");
      return;
    }
    goalsList.innerHTML = goals.length === 0
      ? '<p class="no-goals">No financial goals set</p>'
      : goals.map(goal => `
          <div class="goal-item" data-id="${goal.id}" data-category="${goal.category}" data-priority="${goal.priority}">
            <div class="goal-header">
              <div class="goal-title">
                <i class="fas fa-${getCategoryIcon(goal.category)}"></i>
                <h4>${goal.goal_name}</h4>
              </div>
              <span class="priority ${goal.priority}">${goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}</span>
            </div>
            <div class="goal-progress">
              <div class="progress-bar">
                <div class="progress" style="width: ${(goal.current_savings / goal.target_amount * 100)}%"></div>
              </div>
              <div class="progress-info">
                <span>₹${goal.current_savings.toFixed(2)}</span>
                <span>of ₹${goal.target_amount.toFixed(2)}</span>
              </div>
            </div>
            <div class="goal-footer">
              <span>Due: ${new Date(goal.target_date).toLocaleDateString()}</span>
              <div class="goal-actions">
                <button class="edit-btn" onclick="editGoal('${goal.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteGoal('${goal.id}')"><i class="fas fa-trash"></i></button>
                <button class="contribute-btn" onclick="openContribution('${goal.id}')"><i class="fas fa-plus"></i> Contribute</button>
              </div>
            </div>
            ${goal.description ? `<p class="goal-notes">${goal.description}</p>` : ''}
          </div>
        `).join("");
  }

  function updateSummaries(goals) {
    if (!activeGoalsCount || !completedGoalsCount || !totalSaved) return;
    const active = goals.filter(g => g.current_savings < g.target_amount).length;
    const completed = goals.length - active;
    const saved = goals.reduce((sum, g) => sum + g.current_savings, 0);

    activeGoalsCount.textContent = active;
    completedGoalsCount.textContent = completed;
    totalSaved.textContent = `₹${saved.toFixed(2)}`;
  }

  function getCategoryIcon(category) {
    const icons = {
      house: 'home',
      car: 'car',
      travel: 'plane',
      education: 'graduation-cap',
      other: 'star'
    };
    return icons[category] || 'star';
  }

  if (addGoalBtn) {
    addGoalBtn.addEventListener("click", () => {
      editingGoalId = null;
      modalTitle.textContent = "Add New Goal";
      goalForm.reset();
      goalModal.querySelector('input[name="category"][value="other"]').checked = true;
      clearValidationErrors();
      goalModal.style.display = "block";
    });
  }

  function closeGoalModal() {
    goalModal.style.display = "none";
    editingGoalId = null;
    goalForm.reset();
    clearValidationErrors();
  }

  if (cancelGoalBtn) {
    cancelGoalBtn.addEventListener("click", closeGoalModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeGoalModal);
  }
  window.addEventListener("click", (event) => {
    if (event.target === goalModal) {
      closeGoalModal();
    }
  });

  if (saveGoalBtn) {
    saveGoalBtn.addEventListener("click", async (event) => {
      event.preventDefault();
      if (!validateGoalForm()) return;

      const selectedCategory = goalModal.querySelector('input[name="category"]:checked')?.value || 'other';
      const goalData = {
        goal_name: document.getElementById("goal-name").value.trim(),
        target_amount: parseFloat(document.getElementById("target-amount").value),
        current_savings: parseFloat(document.getElementById("current-amount").value) || 0,
        target_date: document.getElementById("goal-date").value,
        description: document.getElementById("goal-notes").value.trim(),
        priority: document.getElementById("goal-priority").value,
        category: selectedCategory
      };

      try {
        const url = editingGoalId ? `/api/goals/${editingGoalId}` : "/api/goals";
        const method = editingGoalId ? "PUT" : "POST";
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(goalData)
        });

        if (!response.ok) {
          throw new Error((await response.json()).message || "Failed to save goal");
        }

        await fetchGoals();
        closeGoalModal();
        showNotification(editingGoalId ? "Goal updated successfully" : "Goal added successfully", "success");
      } catch (error) {
        console.error("Error saving goal:", error);
        showNotification("Failed to save goal: " + error.message, "error");
      }
    });
  }

  window.editGoal = async function (goalId) {
    try {
      const response = await fetch(`/api/goals`);
      if (!response.ok) {
        throw new Error((await response.json()).message || "Failed to fetch goals");
      }
      const { data } = await response.json();
      const goal = data.find(g => g.id === goalId);
      if (!goal) {
        showNotification("Goal not found", "error");
        return;
      }

      editingGoalId = goalId;
      modalTitle.textContent = "Edit Goal";
      document.getElementById("goal-name").value = goal.goal_name;
      document.getElementById("target-amount").value = goal.target_amount;
      document.getElementById("current-amount").value = goal.current_savings;
      document.getElementById("goal-date").value = new Date(goal.target_date).toISOString().split('T')[0];
      document.getElementById("goal-notes").value = goal.description || "";
      document.getElementById("goal-priority").value = goal.priority;
      goalModal.querySelector(`input[name="category"][value="${goal.category}"]`).checked = true;
      goalModal.style.display = "block";
    } catch (error) {
      console.error("Error loading goal for edit:", error);
      showNotification("Failed to load goal: " + error.message, "error");
    }
  };

  window.deleteGoal = async function (goalId) {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      const response = await fetch(`/api/goals/${goalId}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error((await response.json()).message || "Failed to delete goal");
      }
      await fetchGoals();
      showNotification("Goal deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting goal:", error);
      showNotification("Failed to delete goal: " + error.message, "error");
    }
  };

  window.openContribution = function (goalId) {
    contributingGoalId = goalId;
    document.getElementById("contribution-amount").value = "";
    document.getElementById("contribution-date").value = new Date().toISOString().split('T')[0];
    contributionModal.style.display = "block";
  };

  function closeContributionModal() {
    contributionModal.style.display = "none";
    contributingGoalId = null;
  }

  if (cancelContribution) {
    cancelContribution.addEventListener("click", closeContributionModal);
  }
  if (closeContributionBtn) {
    closeContributionBtn.addEventListener("click", closeContributionModal);
  }
  window.addEventListener("click", (event) => {
    if (event.target === contributionModal) {
      closeContributionModal();
    }
  });

  if (saveContribution) {
    saveContribution.addEventListener("click", async (event) => {
      event.preventDefault();
      const amount = parseFloat(document.getElementById("contribution-amount").value);
      if (!amount || amount <= 0) {
        showNotification("Valid amount required", "error");
        return;
      }

      try {
        // Fetch the specific goal to get current savings
        const response = await fetch(`/api/goals`);
        if (!response.ok) {
          throw new Error((await response.json()).message || "Failed to fetch goals");
        }
        const { data } = await response.json();
        const goal = data.find(g => g.id === contributingGoalId);
        if (!goal) {
          throw new Error("Goal not found");
        }

        // Add new contribution to existing savings
        const newSavings = (goal.current_savings || 0) + amount;

        // Update the goal with the new savings
        const updateResponse = await fetch(`/api/goals/${contributingGoalId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ current_savings: newSavings })
        });

        if (!updateResponse.ok) {
          throw new Error((await updateResponse.json()).message || "Failed to add contribution");
        }

        await fetchGoals();
        closeContributionModal();
        showNotification("Contribution added successfully", "success");
      } catch (error) {
        console.error("Error adding contribution:", error);
        showNotification("Failed to add contribution: " + error.message, "error");
      }
    });
  }

  if (filterCategory) {
    filterCategory.addEventListener("change", applyFilters);
  }
  if (sortBy) {
    sortBy.addEventListener("change", applyFilters);
  }

  async function applyFilters() {
    try {
      const response = await fetch("/api/goals");
      const { data } = await response.json();
      
      let filtered = data;
      const category = filterCategory.value;
      if (category) {
        filtered = filtered.filter(g => g.category === category);
      }

      const sort = sortBy.value;
      if (sort === 'date') {
        filtered.sort((a, b) => new Date(a.target_date) - new Date(b.target_date));
      } else if (sort === 'amount') {
        filtered.sort((a, b) => a.target_amount - b.target_amount);
      } else if (sort === 'priority') {
        const prioMap = { high: 1, medium: 2, low: 3 };
        filtered.sort((a, b) => prioMap[a.priority] - prioMap[b.priority]);
      }

      renderGoals(filtered);
      updateSummaries(filtered);
    } catch (error) {
      console.error("Error applying filters:", error);
      showNotification("Failed to apply filters: " + error.message, "error");
    }
  }

  function validateGoalForm() {
    clearValidationErrors();
    let isValid = true;

    const name = document.getElementById("goal-name").value.trim();
    const targetAmount = parseFloat(document.getElementById("target-amount").value);
    const targetDate = document.getElementById("goal-date").value;

    if (!name) {
      showNotification("Goal name is required", "error");
      isValid = false;
    }
    if (!targetAmount || targetAmount <= 0) {
      showNotification("Valid target amount is required", "error");
      isValid = false;
    }
    if (!targetDate) {
      showNotification("Target date is required", "error");
      isValid = false;
    } else {
      const date = new Date(targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        showNotification("Target date must be in the future", "error");
        isValid = false;
      }
    }

    return isValid;
  }

  function clearValidationErrors() {
    // If you add validation error elements in HTML, clear them here
    // For now, relying on showNotification for errors
  }

  // Fetch goals on page load
  fetchGoals();
});

// linking accounts
document.addEventListener("DOMContentLoaded", function () {
  function closeModal(id) {
    document.getElementById(id).style.display = "none";
  }
  // DOM Elements
  const linkNewAccountBtn = document.getElementById("link-new-account");
  const linkAccountModal = document.getElementById("link-account-modal");
  const linkAccountForm = document.getElementById("link-account-form");
  const bankAccountsList = document.getElementById("bank-accounts-list");
  const accountNumberInput = document.getElementById("account-number");
  const accountNumberError = document.createElement("small");
  accountNumberError.className = "validation-error";
  accountNumberInput.parentNode.appendChild(accountNumberError);

  // Load existing accounts
  renderBankAccounts();

  // Open modal when "Link New Account" is clicked
  linkNewAccountBtn.addEventListener("click", function () {
    linkAccountModal.style.display = "block";
  });

  // Close modal when X is clicked
  // document.querySelectorAll(".close-modal").addEventListener("click", function () {
  //   closeModal("link-account-modal");
  // });
  // Close modals when their respective X is clicked
  document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", function () {
      // Find the closest parent modal and close it
      const modal = this.closest(".modal");
      if (modal) {
        modal.style.display = "none";
      }
    });
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === linkAccountModal) {
      closeModal("link-account-modal");
    }
  });

  // Form submission
  linkAccountForm.addEventListener("submit", function (e) {
    e.preventDefault();
    linkNewAccount();
  });

  // Account number validation
  accountNumberInput.addEventListener("input", function () {
    validateAccountNumber();
  });

  function validateAccountNumber() {
    const accountNumber = accountNumberInput.value.trim();
    // Remove any non-digit characters
    const digitsOnly = accountNumber.replace(/\D/g, "");

    // Validate length (9-18 digits)
    if (digitsOnly.length < 9 || digitsOnly.length > 18) {
      accountNumberError.textContent = "Account number must be 9-18 digits";
      return false;
    }

    // Validate it's all numbers
    if (!/^\d+$/.test(digitsOnly)) {
      accountNumberError.textContent =
        "Account number must contain only numbers";
      return false;
    }

    accountNumberError.textContent = "";
    return true;
  }

  function linkNewAccount() {
    if (!validateAccountNumber()) return;

    const bankName = document.getElementById("bank-name").value;
    const accountType = document.getElementById("account-type").value;
    const accountNumber = accountNumberInput.value.replace(/\D/g, ""); // Remove non-digits
    const lastFour = accountNumber.slice(-4);

    const newAccount = {
      bankName,
      accountType,
      accountNumber, // Store full number (in production, this should be encrypted)
      lastFour,
      linkedDate: new Date().toISOString(),
    };

    // Get existing accounts or initialize empty array
    const accounts = JSON.parse(localStorage.getItem("bankAccounts")) || [];
    accounts.push(newAccount);

    // Save to localStorage
    localStorage.setItem("bankAccounts", JSON.stringify(accounts));

    // Refresh display
    renderBankAccounts();

    // Close modal and reset form
    closeModal("link-account-modal");
    linkAccountForm.reset();

    alert(`${bankName} account linked successfully!`);
  }

  function renderBankAccounts() {
    const accounts = JSON.parse(localStorage.getItem("bankAccounts")) || [];

    bankAccountsList.innerHTML =
      accounts.length === 0
        ? '<p class="no-accounts">No linked accounts</p>'
        : accounts
            .map(
              (account, index) => `
            <div class="bank-account-item">
              <div class="account-meta">
                <div class="bank-name">${account.bankName} • ${account.accountType}</div>
                <div class="account-number">••••${account.lastFour}</div>
              </div>
              <button class="unlink-btn" onclick="unlinkAccount(${index})">
                <i class="fas fa-unlink"></i> Unlink
              </button>
            </div>
          `,
            )
            .join("");
  }

  function unlinkAccount(index) {
    if (!confirm("Are you sure you want to unlink this account?")) return;

    const accounts = JSON.parse(localStorage.getItem("bankAccounts"));
    const removedAccount = accounts.splice(index, 1);

    localStorage.setItem("bankAccounts", JSON.stringify(accounts));
    renderBankAccounts();

    alert(`${removedAccount[0].bankName} account unlinked.`);
  }

  // Make unlinkAccount available globally
  window.unlinkAccount = unlinkAccount;
});

document.addEventListener("DOMContentLoaded", function () {
  const sessions = [
    { id: 1, device: "Chrome on Windows", location: "New York, USA" },
    { id: 2, device: "Firefox on Linux", location: "Berlin, Germany" },
  ];

  const devices = [
    { id: 101, name: "iPhone 14 Pro", lastUsed: "2025-05-06" },
    { id: 102, name: "MacBook Pro", lastUsed: "2025-05-05" },
  ];

  function renderList(containerId, items, removeCallback) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear existing
    items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "item-entry";

      const infoSpan = document.createElement("span");
      infoSpan.textContent = Object.values(item).slice(1).join(" - ");

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => removeCallback(item.id));

      div.appendChild(infoSpan);
      div.appendChild(removeBtn);
      container.appendChild(div);
    });
  }

  function openModal(type) {
    if (type === "sessions-modal") {
      const section = document.getElementById("session-list");
      if (!section.style.display || section.style.display === "none") {
        renderList("session-list", sessions, removeSession);
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    } else if (type === "devices-modal") {
      const section = document.getElementById("device-list");
      if (!section.style.display || section.style.display === "none") {
        renderList("device-list", devices, removeDevice);
        section.style.display = "block";
      } else {
        section.style.display = "none";
      }
    }
  }

  function removeSession(id) {
    const index = sessions.findIndex((s) => s.id === id);
    if (index !== -1) {
      sessions.splice(index, 1);
      renderList("session-list", sessions, removeSession);
    }
  }

  function removeDevice(id) {
    const index = devices.findIndex((d) => d.id === id);
    if (index !== -1) {
      devices.splice(index, 1);
      renderList("device-list", devices, removeDevice);
    }
  }

  function confirmDelete() {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      alert("Account deleted (simulated).");
    }
  }

  // Attach functions to window for global access
  window.openModal = openModal;
  window.confirmDelete = confirmDelete;
});

// DOM elements
const profileNameElement = document.getElementById("profile-name");
const profileEmailElement = document.getElementById("profile-email");
const profileEditBtn = document.getElementById("profile-edit-btn");

// Function to fetch user profile data
async function fetchUserProfile() {
  try {
    const response = await fetch("/api/user/profile");

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch profile data");
    }

    const responseData = await response.json();
    console.log("Received user data:", responseData); // Debug log

    // Check if the response has a nested data structure
    const userData = responseData.data || responseData;

    // Update the DOM elements with the fetched data
    if (userData.name) {
      profileNameElement.textContent = userData.name;
      console.log("Updated name to:", userData.name); // Debug log
    } else {
      console.warn("Name not found in user data");
    }

    if (userData.email) {
      profileEmailElement.textContent = userData.email;
      console.log("Updated email to:", userData.email); // Debug log
    } else {
      console.warn("Email not found in user data");
    }

    console.log("Profile data loaded successfully");
  } catch (error) {
    console.error("Error loading profile data:", error);
  }
}

// Function to handle edit button click
function handleEditButtonClick() {
  // const currentName = profileNameElement.textContent;
  // const currentEmail = profileEmailElement.textContent;
  // // Create a modal or inline form for editing
  // const modalHTML = `
  //   <div id="edit-profile-modal" class="modal">
  //     <div class="modal-content">
  //       <span class="close-modal">&times;</span>
  //       <h3>Edit Profile</h3>
  //       <form id="edit-profile-form">
  //         <div class="form-group">
  //           <label for="edit-name">Name:</label>
  //           <input type="text" id="edit-name" value="${currentName}" required>
  //         </div>
  //         <div class="form-group">
  //           <label for="edit-email">Email:</label>
  //           <input type="email" id="edit-email" value="${currentEmail}" required>
  //         </div>
  //         <div class="form-actions">
  //           <button type="button" id="cancel-edit">Cancel</button>
  //           <button type="submit">Save Changes</button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // `;
  // // Add modal to the page
  // document.body.insertAdjacentHTML('beforeend', modalHTML);
  // const modal = document.getElementById('edit-profile-modal');
  // const closeButton = document.querySelector('.close-modal');
  // const cancelButton = document.getElementById('cancel-edit');
  // const form = document.getElementById('edit-profile-form');
  // // Show the modal
  // modal.style.display = 'block';
  // // Close modal function
  // function closeModal() {
  //   modal.style.display = 'none';
  //   modal.remove();
  // }
  // // Event listeners for closing the modal
  // closeButton.addEventListener('click', closeModal);
  // cancelButton.addEventListener('click', closeModal);
  // window.addEventListener('click', (event) => {
  //   if (event.target === modal) {
  //     closeModal();
  //   }
  // });
  // // Form submission
  // form.addEventListener('submit', async (event) => {
  //   event.preventDefault();
  //   const nameInput = document.getElementById('edit-name');
  //   const emailInput = document.getElementById('edit-email');
  //   // Check if input values actually changed
  //   const nameChanged = nameInput.value !== currentName;
  //   const emailChanged = emailInput.value !== currentEmail;
  //   if (!nameChanged && !emailChanged) {
  //     closeModal();
  //     return;
  //   }
  //   try {
  //     const response = await fetch('/api/user/profile', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         name: nameInput.value,
  //         email: emailInput.value
  //       })
  //     });
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Failed to update profile');
  //     }
  //     const updatedData = await response.json();
  //     // Update the DOM with new values
  //     profileNameElement.textContent = updatedData.user.name;
  //     profileEmailElement.textContent = updatedData.user.email;
  //     // Close the modal
  //     closeModal();
  //     // Show success message
  //     showNotification('Profile updated successfully', 'success');
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     showNotification('Failed to update profile: ' + error.message, 'error');
  //   }
  // });
}

// Simple notification function
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// Add CSS for the modal and notifications
function addStyles() {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .modal-content {
      background-color: #fff;
      margin: 10% auto;
      padding: 20px;
      border-radius: 5px;
      width: 80%;
      max-width: 500px;
      position: relative;
    }
    
    .close-modal {
      position: absolute;
      right: 15px;
      top: 10px;
      font-size: 24px;
      cursor: pointer;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .form-group input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    
    .form-actions button {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      border-radius: 4px;
      color: white;
      z-index: 1001;
      animation: slide-in 0.3s ease-out;
    }
    
    .notification.success {
      background-color: #4CAF50;
    }
    
    .notification.error {
      background-color: #f44336;
    }
    
    .notification.info {
      background-color: #2196F3;
    }
    
    .fade-out {
      opacity: 0;
      transition: opacity 0.5s;
    }
    
    @keyframes slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `;

  document.head.appendChild(styleElement);
}

// Initialize everything when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing profile...");

  // Verify DOM elements
  console.log("Profile elements found:", {
    name: profileNameElement ? true : false,
    email: profileEmailElement ? true : false,
    editBtn: profileEditBtn ? true : false,
  });

  // Add CSS styles
  addStyles();

  // Fetch initial profile data
  fetchUserProfile();

  // Add click event for edit button
  if (profileEditBtn) {
    profileEditBtn.addEventListener("click", handleEditButtonClick);
  } else {
    console.error("Edit button not found in the DOM");
  }
});
