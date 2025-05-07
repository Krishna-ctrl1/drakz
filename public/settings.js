function openNav() {
    const sidebar = document.getElementById("mySidebar");
    const closeButton = document.getElementById("close-button");

    sidebar.style.width = "180px"; // Open sidebar to full width
    document.getElementById("main").style.marginLeft = "180px"; // Adjust main content
    closeButton.innerHTML = '<img width="25" src="assets/icons/sidebarclose.png">'; // Set close button image
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
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all toggles
    document.querySelectorAll('.switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const slider = this.nextElementSibling;
            slider.style.backgroundColor = this.checked ? '#4CAF50' : '#ccc';
            // Add API call here to save preference
        });
    });

    // Export Data Button
    document.getElementById('export-data').addEventListener('click', function() {
        alert('Preparing your data export...');
        // Simulate API call
        setTimeout(() => {
            alert('Data exported successfully!');
        }, 1500);
    });
});


// Account Deletion Confirmation
function confirmDelete() {
    if (confirm('WARNING: This will permanently delete your account and all data. Continue?')) {
        alert('Account deletion initiated. Check your email for confirmation.');
        // Add API call here
    }
}

// profile
// Profile Management
// Profile Management with Validation
document.addEventListener('DOMContentLoaded', function() {
    // Load saved profile data
    loadProfile();

    // Edit Button
    document.getElementById('profile-edit-btn').addEventListener('click', function() {
        document.getElementById('profile-display').style.display = 'none';
        document.getElementById('profile-edit-form').style.display = 'block';
    });

    // Cancel Button
    document.getElementById('profile-cancel-btn').addEventListener('click', function() {
        document.getElementById('profile-display').style.display = 'flex';
        document.getElementById('profile-edit-form').style.display = 'none';
        // Reset any validation errors
        clearValidationErrors();
    });

    // Save Button
    document.getElementById('profile-save-btn').addEventListener('click', saveProfile);

    // Image Upload Preview
    document.getElementById('profile-image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate image file type and size
            if (!file.type.match('image.*')) {
                alert('Please select an image file (JPEG, PNG, etc.)');
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert('Image size should be less than 2MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('profile-image').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Add real-time validation
    document.getElementById('edit-email').addEventListener('input', validateEmail);
    document.getElementById('edit-phone').addEventListener('input', validatePhone);
});

function loadProfile() {
    const profile = JSON.parse(localStorage.getItem('userProfile')) || {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "+1 (555) 123-4567",
        dob: "1990-05-15",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    };

    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-email').textContent = profile.email;
    document.getElementById('profile-phone').textContent = profile.phone;
    document.getElementById('profile-dob').textContent = profile.dob;
    document.getElementById('profile-image').src = profile.image;

    // Pre-fill edit form
    document.getElementById('edit-name').value = profile.name;
    document.getElementById('edit-email').value = profile.email;
    document.getElementById('edit-phone').value = profile.phone;
    document.getElementById('edit-dob').value = profile.dob;
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
        name: document.getElementById('edit-name').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        phone: document.getElementById('edit-phone').value.trim(),
        dob: document.getElementById('edit-dob').value,
        image: document.getElementById('profile-image').src
    };

    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

    // Update display
    loadProfile();

    // Switch back to view mode
    document.getElementById('profile-display').style.display = 'flex';
    document.getElementById('profile-edit-form').style.display = 'none';

    alert('Profile updated successfully!');
}

// Validation Functions
function validateName() {
    const nameInput = document.getElementById('edit-name');
    const name = nameInput.value.trim();
    const nameError = document.getElementById('name-error') || createErrorElement(nameInput, 'name-error');
    
    if (!name) {
        nameError.textContent = 'Name is required';
        return false;
    }
    if (name.length < 2) {
        nameError.textContent = 'Name must be at least 2 characters';
        return false;
    }
    if (!/^[a-zA-Z\s\-']+$/.test(name)) {
        nameError.textContent = 'Name contains invalid characters';
        return false;
    }
    
    nameError.textContent = '';
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById('edit-email');
    const email = emailInput.value.trim();
    const emailError = document.getElementById('email-error') || createErrorElement(emailInput, 'email-error');
    
    if (!email) {
        emailError.textContent = 'Email is required';
        return false;
    }
    
    // Robust email regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = 'Please enter a valid email address';
        return false;
    }
    
    emailError.textContent = '';
    return true;
}

function validatePhone() {
    const phoneInput = document.getElementById('edit-phone');
    const phone = phoneInput.value.trim();
    const phoneError = document.getElementById('phone-error') || createErrorElement(phoneInput, 'phone-error');
    
    if (!phone) {
        phoneError.textContent = 'Phone number is required';
        return false;
    }
    
    // International phone number validation (simplified)
    const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
    if (!phoneRegex.test(phone)) {
        phoneError.textContent = 'Please enter a valid phone number';
        return false;
    }
    
    // Additional check for minimum digits (7-15 digits)
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
        phoneError.textContent = 'Phone number should be 7-15 digits';
        return false;
    }
    
    phoneError.textContent = '';
    return true;
}

function validateDOB() {
    const dobInput = document.getElementById('edit-dob');
    const dob = dobInput.value;
    const dobError = document.getElementById('dob-error') || createErrorElement(dobInput, 'dob-error');
    
    if (!dob) {
        dobError.textContent = 'Date of birth is required';
        return false;
    }
    
    // Check if user is at least 13 years old
    const dobDate = new Date(dob);
    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    
    if (dobDate > minAgeDate) {
        dobError.textContent = 'You must be at least 13 years old';
        return false;
    }
    
    dobError.textContent = '';
    return true;
}

// Helper Functions
function createErrorElement(inputElement, errorId) {
    const errorElement = document.createElement('small');
    errorElement.id = errorId;
    errorElement.className = 'validation-error';
    inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    return errorElement;
}

function clearValidationErrors() {
    document.querySelectorAll('.validation-error').forEach(el => {
        el.textContent = '';
    });
}



// Add to settings.js
const encryptData = async (data, secretKey) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const keyBuffer = encoder.encode(secretKey.slice(0, 32)); // Ensure 256-bit key
    const cryptoKey = await crypto.subtle.importKey(
        'raw', keyBuffer, { name: 'AES-GCM' }, false, ['encrypt']
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv }, cryptoKey, dataBuffer
    );
    return { iv: Array.from(iv), encrypted: Array.from(new Uint8Array(encrypted)) };
};

const decryptData = async (encryptedObj, secretKey) => {
    const encoder = new TextEncoder();
    const keyBuffer = encoder.encode(secretKey.slice(0, 32));
    const cryptoKey = await crypto.subtle.importKey(
        'raw', keyBuffer, { name: 'AES-GCM' }, false, ['decrypt']
    );
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(encryptedObj.iv) },
        cryptoKey,
        new Uint8Array(encryptedObj.encrypted)
    );
    return new TextDecoder().decode(decrypted);
};

//change password
document.addEventListener('DOMContentLoaded', function() {
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordForm = document.getElementById('password-change-form');
    const cancelBtn = document.getElementById('cancel-password-change');
    
    // Toggle password form visibility
    changePasswordBtn.addEventListener('click', function() {
        passwordForm.style.display = passwordForm.style.display === 'none' ? 'block' : 'none';
    });
    
    // Cancel password change
    cancelBtn.addEventListener('click', function() {
        passwordForm.style.display = 'none';
        document.getElementById('password-error').textContent = '';
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    });
    
    // Save new password
    document.getElementById('save-password-change').addEventListener('click', function() {
        const currentPass = document.getElementById('current-password').value;
        const newPass = document.getElementById('new-password').value;
        const confirmPass = document.getElementById('confirm-password').value;
        const errorElement = document.getElementById('password-error');
        
        // Validate password strength
        if (!/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}/.test(newPass)) {
            errorElement.textContent = 'Password must be at least 8 characters with 1 number and 1 special character';
            return;
        }
        
        if (newPass !== confirmPass) {
            errorElement.textContent = 'Passwords do not match';
            return;
        }
        
        // In a real app, you would verify current password with server
        localStorage.setItem('userPassword', newPass);
        alert('Password changed successfully!');
        
        // Reset form
        passwordForm.style.display = 'none';
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        errorElement.textContent = '';
    });
});
let successMessageTimeout;
document.addEventListener('DOMContentLoaded', function() {
  const toggle2FA = document.getElementById('2fa-toggle');
  const setupForm = document.getElementById('t2fa-setup-form');
  const confirmDisableDiv = document.getElementById('confirm-disable-2fa');
  const successMessageDiv = document.getElementById('2fa-success-message');
  const changeSettingsBtn = document.getElementById('change-2fa-settings');
  
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
    const isEnabled = localStorage.getItem('2faEnabled') === 'true';
    toggle2FA.checked = isEnabled;
    
    if (isEnabled) {
      successMessageDiv.style.display = 'block';
      setupForm.style.display = 'none';
    } else {
      successMessageDiv.style.display = 'none';
      setupForm.style.display = 'none';
    }
    confirmDisableDiv.style.display = 'none';
    document.getElementById('2fa-change-settings').style.display = isEnabled ? 'block' : 'none';
  }

  // Load saved 2FA settings into form
  function loadSaved2FASettings() {
    const method = localStorage.getItem('2faMethod') || 'email';
    const contact = localStorage.getItem('2faContact') || '';
    
    document.querySelector(`input[name="2fa-method"][value="${method}"]`).checked = true;
    if (method === 'email') {
      document.getElementById('email-verification').style.display = 'block';
      document.getElementById('phone-verification').style.display = 'none';
      document.getElementById('2fa-email').value = contact;

    } else {
      document.getElementById('email-verification').style.display = 'none';
      document.getElementById('phone-verification').style.display = 'block';
      document.getElementById('2fa-phone').value = contact;
    }
  }

  // Toggle change handler
  toggle2FA.addEventListener('change', function() {
    if (this.checked) {
      // Turning ON
      if (localStorage.getItem('2faEnabled') === 'true') {
        // Already enabled - show success message
        successMessageDiv.style.display = 'block';
        setupForm.style.display = 'none';
        document.getElementById('2fa-change-settings').style.display = 'block'; // ✅ show button
      } else {
        // New setup - show form
        setupForm.style.display = 'block';
        successMessageDiv.style.display = 'none';
        document.getElementById('2fa-change-settings').style.display = 'block'; // ✅ show button
      }
      confirmDisableDiv.style.display = 'none';
    } else {
      // Turning OFF
      if (localStorage.getItem('2faEnabled') === 'true') {
        // Show confirmation for existing 2FA
        confirmDisableDiv.style.display = 'block';
        setupForm.style.display = 'none';
        successMessageDiv.style.display = 'none';
      } else {
        // Cancel new setup
        setupForm.style.display = 'none';
        successMessageDiv.style.display = 'none';
        document.getElementById('2fa-change-settings').style.display = 'none'; // ✅ hide button
      }
    }
  });

  // Confirm setup with validation
  document.getElementById('confirm-2fa-setup').addEventListener('click', function(e) {
    const method = document.querySelector('input[name="2fa-method"]:checked').value;
    let contact, isValid;
    
    if (method === 'email') {
      contact = document.getElementById('2fa-email').value.trim();
      isValid = validateEmail(contact);
      if (!isValid) {
        alert('Please enter a valid email address (e.g., user@example.com)');
        e.preventDefault();
        return;
      }
    } else {
      contact = document.getElementById('2fa-phone').value.trim();
      isValid = validatePhone(contact);
      if (!isValid) {
        alert('Please enter a valid phone number (e.g., 123-456-7890)');
        e.preventDefault();
        return;
      }
    }
    
    // Only proceed if validation passed
    localStorage.setItem('2faEnabled', 'true');
    localStorage.setItem('2faMethod', method);
    localStorage.setItem('2faContact', contact);
    
    setupForm.style.display = 'none';
    successMessageDiv.style.display = 'block';
    
    // Clear any existing timeout
    if (successMessageTimeout) {
      clearTimeout(successMessageTimeout);
    }
    
    // Set new timeout to hide after 5 seconds
    successMessageTimeout = setTimeout(() => {
      successMessageDiv.style.display = 'none';
    }, 3000);
  });

// Change settings button
changeSettingsBtn.addEventListener('click', function() {
  // Clear any existing timeout when manually changing settings
  if (successMessageTimeout) {
      clearTimeout(successMessageTimeout);
      successMessageTimeout = null;
  }
  successMessageDiv.style.display = 'none';
  setupForm.style.display = 'block';
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
document.getElementById('confirm-disable-yes').addEventListener('click', function() {
    localStorage.removeItem('2faEnabled');
    localStorage.removeItem('2faMethod');
    localStorage.removeItem('2faContact');
    toggle2FA.checked = false;
    confirmDisableDiv.style.display = 'none';
    successMessageDiv.style.display = 'none';
});

// Cancel disable
document.getElementById('confirm-disable-no').addEventListener('click', function() {
  toggle2FA.checked = true;
  confirmDisableDiv.style.display = 'none';
  successMessageDiv.style.display = 'block';
  
  // Set timeout to hide after 5 seconds
  if (successMessageTimeout) {
      clearTimeout(successMessageTimeout);
  }
  successMessageTimeout = setTimeout(() => {
      successMessageDiv.style.display = 'none';
  }, 5000);
});

// Cancel setup
document.getElementById('cancel-2fa-setup').addEventListener('click', function() {
    if (localStorage.getItem('2faEnabled') === 'true') {
        // Case 1: 2FA was already enabled - keep it enabled
        toggle2FA.checked = true;
        successMessageDiv.style.display = 'block';
        setupForm.style.display = 'none';
    } else {
        // Case 2: New setup being canceled - fully disable
        toggle2FA.checked = false;
        setupForm.style.display = 'none';
        successMessageDiv.style.display = 'none';
        const slider = document.querySelector('.slider');
        slider.style.backgroundColor = '#ccc';
    }
});

// Method radio button change handler
document.querySelectorAll('input[name="2fa-method"]').forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'email') {
            document.getElementById('email-verification').style.display = 'block';
            document.getElementById('phone-verification').style.display = 'none';
        } else {
            document.getElementById('email-verification').style.display = 'none';
            document.getElementById('phone-verification').style.display = 'block';
        }
    });
});

// Initialize on page load
init2FAState();
});

// budgeting preferences
 document.addEventListener("DOMContentLoaded", () => {
  const goals = [];
  let editingIndex = null;

  const addGoalBtn = document.getElementById("add-goal-btn");
  const emptyAddGoalBtn = document.getElementById("empty-add-goal");
  const goalModal = document.getElementById("goal-modal");
  const contributionModal = document.getElementById("contribution-modal");
  const closeModalBtns = document.querySelectorAll(".close-modal");
  const cancelGoalBtn = document.getElementById("cancel-goal");
  const saveGoalBtn = document.getElementById("save-goal");
  const saveContributionBtn = document.getElementById("save-contribution");
  const cancelContributionBtn = document.getElementById("cancel-contribution");

  const goalsDisplay = document.getElementById("goals-display");
  const noGoals = document.getElementById("no-goals");

  const goalFilter = document.getElementById("goal-filter");
  const goalSort = document.getElementById("goal-sort");

  const activeGoalsCount = document.getElementById("active-goals-count");
  const completedGoalsCount = document.getElementById("completed-goals-count");
  const totalSaved = document.getElementById("total-saved");

  // Modal open/close
  function toggleModal(modal, show) {
    modal.style.display = show ? "block" : "none";
  }

  [addGoalBtn, emptyAddGoalBtn].forEach(btn =>
    btn.addEventListener("click", () => {
      editingIndex = null;
      document.getElementById("modal-title").innerText = "Add New Goal";
      document.getElementById("goal-name").value = "";
      document.getElementById("goal-amount").value = "";
      document.getElementById("current-amount").value = "";
      document.getElementById("goal-date").value = "";
      document.getElementById("goal-priority").value = "medium";
      document.querySelector("input[name='category'][value='house']").checked = true;
      document.getElementById("goal-notes").value = "";
      toggleModal(goalModal, true);
    })
  );

  closeModalBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      toggleModal(goalModal, false);
      toggleModal(contributionModal, false);
    });
  });

  cancelGoalBtn.addEventListener("click", () => toggleModal(goalModal, false));
  cancelContributionBtn.addEventListener("click", () => toggleModal(contributionModal, false));

  // Save new goal
  saveGoalBtn.addEventListener("click", () => {
    const name = document.getElementById("goal-name").value.trim();
    const amount = parseFloat(document.getElementById("goal-amount").value);
    const current = parseFloat(document.getElementById("current-amount").value);
    const date = document.getElementById("goal-date").value;
    const priority = document.getElementById("goal-priority").value;
    const notes = document.getElementById("goal-notes").value;
    const category = document.querySelector("input[name='category']:checked").value;

    if (!name || isNaN(amount)) return alert("Please fill out required fields.");

    const goal = {
      name,
      amount,
      current: isNaN(current) ? 0 : current,
      date,
      priority,
      notes,
      category
    };

    if (editingIndex !== null) {
      goals[editingIndex] = goal;
    } else {
      goals.push(goal);
    }

    toggleModal(goalModal, false);
    renderGoals();
  });

  function renderGoals() {
    goalsDisplay.innerHTML = "";

    const filter = goalFilter.value;
    const sort = goalSort.value;

    let filteredGoals = [...goals];

    if (filter === "active") {
      filteredGoals = filteredGoals.filter(g => g.current < g.amount);
    } else if (filter === "completed") {
      filteredGoals = filteredGoals.filter(g => g.current >= g.amount);
    } else if (filter === "high") {
      filteredGoals = filteredGoals.filter(g => g.priority === "high");
    }

    if (sort === "priority-desc") {
      const priorityRank = { high: 3, medium: 2, low: 1 };
      filteredGoals.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
    } else if (sort === "date-asc") {
      filteredGoals.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === "progress-desc") {
      filteredGoals.sort((a, b) => (b.current / b.amount) - (a.current / a.amount));
    }

    filteredGoals.forEach((goal, index) => {
      const card = document.createElement("div");
      card.className = "goal-card";
      const progress = Math.min(100, Math.round((goal.current / goal.amount) * 100));
      const completed = goal.current >= goal.amount;

      card.innerHTML = `
      <h4>${goal.name} (${goal.priority})</h4>
      <p>Target: $${goal.amount.toFixed(2)} | Saved: $${goal.current.toFixed(2)}</p>
      <progress value="${progress}" max="100"></progress>
      <p>${progress}% ${completed ? "- Completed" : ""}</p>
      <button onclick="editGoal(${index})" style="background-color: #4CAF50; color: white; padding: 5px 10px; border: none; border-radius: 5px;">Edit</button>
      <button onclick="openContribution(${index})" style="background-color: #4CAF50; color: white; padding: 5px 10px; border: none; border-radius: 5px;">Add Contribution</button>
    `;


      goalsDisplay.appendChild(card);
    });

    noGoals.style.display = goals.length === 0 ? "block" : "none";
    updateSummary();
  }

  function updateSummary() {
    const active = goals.filter(g => g.current < g.amount).length;
    const completed = goals.filter(g => g.current >= g.amount).length;
    const saved = goals.reduce((sum, g) => sum + g.current, 0);

    activeGoalsCount.innerText = active;
    completedGoalsCount.innerText = completed;
    totalSaved.innerText = `₹${saved.toFixed(2)}`;
  }

  // Filter and sort listeners
  goalFilter.addEventListener("change", renderGoals);
  goalSort.addEventListener("change", renderGoals);

  // Global for inline onclick
  window.editGoal = function(index) {
    editingIndex = index;
    const goal = goals[index];
    document.getElementById("modal-title").innerText = "Edit Goal";
    document.getElementById("goal-name").value = goal.name;
    document.getElementById("goal-amount").value = goal.amount;
    document.getElementById("current-amount").value = goal.current;
    document.getElementById("goal-date").value = goal.date;
    document.getElementById("goal-priority").value = goal.priority;
    document.querySelector(`input[name='category'][value='${goal.category}']`).checked = true;
    document.getElementById("goal-notes").value = goal.notes;

    toggleModal(goalModal, true);
  };

  window.openContribution = function(index) {
    contributionModal.dataset.index = index;
    document.getElementById("contribution-amount").value = "";
    document.getElementById("contribution-date").value = "";
    toggleModal(contributionModal, true);
  };

  saveContributionBtn.addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("contribution-amount").value);
    const index = parseInt(contributionModal.dataset.index, 10);
    if (isNaN(amount) || amount <= 0) return alert("Enter a valid amount.");

    goals[index].current += amount;
    toggleModal(contributionModal, false);
    renderGoals();
  });

  // Initial render
  renderGoals();
});
 
  
  // linking accounts
  document.addEventListener('DOMContentLoaded', function() {
    function closeModal(id) {
      document.getElementById(id).style.display = 'none';
    }
    // DOM Elements
    const linkNewAccountBtn = document.getElementById('link-new-account');
    const linkAccountModal = document.getElementById('link-account-modal');
    const linkAccountForm = document.getElementById('link-account-form');
    const bankAccountsList = document.getElementById('bank-accounts-list');
    const accountNumberInput = document.getElementById('account-number');
    const accountNumberError = document.createElement('small');
    accountNumberError.className = 'validation-error';
    accountNumberInput.parentNode.appendChild(accountNumberError);

    // Load existing accounts
    renderBankAccounts();
  
    // Open modal when "Link New Account" is clicked
    linkNewAccountBtn.addEventListener('click', function() {
      linkAccountModal.style.display = 'block';
    });
  
    // // Close modal when X is clicked
    // document.querySelector('.close-modal').addEventListener('click', function() {
    //   closeModal('link-account-modal');
    // });
  
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target === linkAccountModal) {
        closeModal('link-account-modal');
      }
    });
  
    // Form submission
    linkAccountForm.addEventListener('submit', function(e) {
      e.preventDefault();
      linkNewAccount();
    });
  
    // Account number validation
    accountNumberInput.addEventListener('input', function() {
      validateAccountNumber();
    });
  
    function validateAccountNumber() {
      const accountNumber = accountNumberInput.value.trim();
      // Remove any non-digit characters
      const digitsOnly = accountNumber.replace(/\D/g, '');
      
      // Validate length (9-18 digits)
      if (digitsOnly.length < 9 || digitsOnly.length > 18) {
        accountNumberError.textContent = 'Account number must be 9-18 digits';
        return false;
      }
      
      // Validate it's all numbers
      if (!/^\d+$/.test(digitsOnly)) {
        accountNumberError.textContent = 'Account number must contain only numbers';
        return false;
      }
      
      accountNumberError.textContent = '';
      return true;
    }
  
    function linkNewAccount() {
      if (!validateAccountNumber()) return;
  
      const bankName = document.getElementById('bank-name').value;
      const accountType = document.getElementById('account-type').value;
      const accountNumber = accountNumberInput.value.replace(/\D/g, ''); // Remove non-digits
      const lastFour = accountNumber.slice(-4);
  
      const newAccount = {
        bankName,
        accountType,
        accountNumber, // Store full number (in production, this should be encrypted)
        lastFour,
        linkedDate: new Date().toISOString()
      };
  
      // Get existing accounts or initialize empty array
      const accounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
      accounts.push(newAccount);
      
      // Save to localStorage
      localStorage.setItem('bankAccounts', JSON.stringify(accounts));
      
      // Refresh display
      renderBankAccounts();
      
      // Close modal and reset form
      closeModal('link-account-modal');
      linkAccountForm.reset();
      
      alert(`${bankName} account linked successfully!`);
    }
  
    function renderBankAccounts() {
      const accounts = JSON.parse(localStorage.getItem('bankAccounts')) || [];
      
      bankAccountsList.innerHTML = accounts.length === 0
        ? '<p class="no-accounts">No linked accounts</p>'
        : accounts.map((account, index) => `
            <div class="bank-account-item">
              <div class="account-meta">
                <div class="bank-name">${account.bankName} • ${account.accountType}</div>
                <div class="account-number">••••${account.lastFour}</div>
              </div>
              <button class="unlink-btn" onclick="unlinkAccount(${index})">
                <i class="fas fa-unlink"></i> Unlink
              </button>
            </div>
          `).join('');
    }
  
    function unlinkAccount(index) {
      if (!confirm('Are you sure you want to unlink this account?')) return;
      
      const accounts = JSON.parse(localStorage.getItem('bankAccounts'));
      const removedAccount = accounts.splice(index, 1);
      
      localStorage.setItem('bankAccounts', JSON.stringify(accounts));
      renderBankAccounts();
      
      alert(`${removedAccount[0].bankName} account unlinked.`);
    }
  
   
  
    // Make unlinkAccount available globally
    window.unlinkAccount = unlinkAccount;
  });

  document.addEventListener('DOMContentLoaded', function () {
    const sessions = [
        { id: 1, device: 'Chrome on Windows', location: 'New York, USA' },
        { id: 2, device: 'Firefox on Linux', location: 'Berlin, Germany' }
    ];

    const devices = [
        { id: 101, name: 'iPhone 14 Pro', lastUsed: '2025-05-06' },
        { id: 102, name: 'MacBook Pro', lastUsed: '2025-05-05' }
    ];

    function renderList(containerId, items, removeCallback) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear existing
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item-entry';

            const infoSpan = document.createElement('span');
            infoSpan.textContent = Object.values(item).slice(1).join(' - ');

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => removeCallback(item.id));

            div.appendChild(infoSpan);
            div.appendChild(removeBtn);
            container.appendChild(div);
        });
    }

    function openModal(type) {
        if (type === 'sessions-modal') {
            const section = document.getElementById('session-list');
            if (!section.style.display || section.style.display === 'none') {
                renderList('session-list', sessions, removeSession);
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        } else if (type === 'devices-modal') {
            const section = document.getElementById('device-list');
            if (!section.style.display || section.style.display === 'none') {
                renderList('device-list', devices, removeDevice);
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    }

    function removeSession(id) {
        const index = sessions.findIndex(s => s.id === id);
        if (index !== -1) {
            sessions.splice(index, 1);
            renderList('session-list', sessions, removeSession);
        }
    }

    function removeDevice(id) {
        const index = devices.findIndex(d => d.id === id);
        if (index !== -1) {
            devices.splice(index, 1);
            renderList('device-list', devices, removeDevice);
        }
    }

    function confirmDelete() {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            alert("Account deleted (simulated).");
        }
    }

    // Attach functions to window for global access
    window.openModal = openModal;
    window.confirmDelete = confirmDelete;
});

  