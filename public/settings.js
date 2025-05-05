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
    document.getElementById("main").style.marginLeft = "60px"; // Adjust main content
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

// 2fa
document.addEventListener('DOMContentLoaded', function() {
    const toggle2FA = document.getElementById('2fa-toggle');
    toggle2FA.checked = localStorage.getItem('2faEnabled') === 'true';
    const setupForm = document.getElementById('t2fa-setup-form');
    const emailVerification = document.getElementById('email-verification');
    const phoneVerification = document.getElementById('phone-verification');
    const methodRadios = document.querySelectorAll('input[name="2fa-method"]');
    

    // Initialize based on current 2FA status
    if (localStorage.getItem('2faEnabled') === 'true') {
        toggle2FA.checked = true;
        setupForm.style.display = 'none'; // Form should be hidden when 2FA is already enabled
    }

    // Toggle 2FA on/off
    toggle2FA.addEventListener('change', function() {
        if (this.checked) {
            // Show setup form when enabling 2FA
            setupForm.style.display = 'block';
        } else {
            // Immediately hide form when turning off
            setupForm.style.display = 'none';
            
            // Confirm before disabling
            if (confirm('Are you sure you want to disable two-factor authentication?')) {
                disable2FA();
            } else {
                this.checked = true; // Keep toggle on if canceled
                if (localStorage.getItem('2faEnabled') === 'true') {
                    setupForm.style.display = 'none'; // Keep form hidden if 2FA was already enabled
                }
            }
        }
    });
    
    // Toggle between email/SMS verification methods
    methodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'email') {
                emailVerification.style.display = 'block';
                phoneVerification.style.display = 'none';
            } else {
                emailVerification.style.display = 'none';
                phoneVerification.style.display = 'block';
            }
        });
    });
    
    // Cancel 2FA setup
    document.getElementById('cancel-2fa-setup').addEventListener('click', function() {
        setupForm.style.display = 'none';
        toggle2FA.checked = false;
    });
    
    // Confirm 2FA setup
    document.getElementById('confirm-2fa-setup').addEventListener('click', function() {
        const method = document.querySelector('input[name="2fa-method"]:checked').value;
        let contactInfo;
        
        if (method === 'email') {
            contactInfo = document.getElementById('2fa-email').value.trim();
            if (!validateEmail(contactInfo)) {
                alert('Please enter a valid email address');
                return;
            }
        } else {
            contactInfo = document.getElementById('2fa-phone').value.trim();
            if (!validatePhone(contactInfo)) {
                alert('Please enter a valid phone number');
                return;
            }
        }
        
        enable2FA(method, contactInfo);
        setupForm.style.display = 'none';
        alert(`2FA enabled via ${method.toUpperCase()}. Verification code sent to ${contactInfo}`);
    });
    
    function enable2FA(method, contactInfo) {
        localStorage.setItem('2faEnabled', 'true');
        localStorage.setItem('2faMethod', method);
        localStorage.setItem('2faContact', contactInfo);
    }
    
    function disable2FA() {
        localStorage.removeItem('2faEnabled');
        localStorage.removeItem('2faMethod');
        localStorage.removeItem('2faContact');
        alert('Two-factor authentication has been disabled.');
    }
    
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    
    function validatePhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 7 && digits.length <= 15;
    }
});

// budgeting preferences
document.addEventListener('DOMContentLoaded', function() {
    // Monthly Budget Functionality
    const budgetInput = document.getElementById('monthly-budget');
    const saveBudgetBtn = document.getElementById('save-budget');
    const budgetError = document.getElementById('budget-error');
    
    // Load saved budget
    const savedBudget = localStorage.getItem('monthlyBudget');
    if (savedBudget) {
      budgetInput.value = parseFloat(savedBudget).toFixed(2);
    }
    
    saveBudgetBtn.addEventListener('click', function() {
      const budgetValue = parseFloat(budgetInput.value);
      
      if (isNaN(budgetValue)) {
        budgetError.textContent = 'Please enter a valid number';
        return;
      }
      
      if (budgetValue < 0) {
        budgetError.textContent = 'Budget cannot be negative';
        return;
      }
      
      localStorage.setItem('monthlyBudget', budgetValue);
      budgetError.textContent = '';
      alert('Monthly budget saved successfully!');
    });
    
    // Long-Term Goals Functionality
    const goalsDisplay = document.getElementById('goals-display');
    const editGoalsBtn = document.getElementById('edit-goals-btn');
    const goalsForm = document.getElementById('goals-form');
    const cancelGoalsBtn = document.getElementById('cancel-goals');
    const saveGoalsBtn = document.getElementById('save-goals');
    
    let financialGoals = JSON.parse(localStorage.getItem('financialGoals')) || [];
    
    // Initialize goals display
    renderGoals();
    
    // Toggle goals form visibility
    editGoalsBtn.addEventListener('click', function() {
      goalsForm.style.display = goalsForm.style.display === 'none' ? 'block' : 'none';
    });
    
    cancelGoalsBtn.addEventListener('click', function() {
      goalsForm.style.display = 'none';
    });
    
    saveGoalsBtn.addEventListener('click', function() {
      const name = document.getElementById('goal-name').value.trim();
      const amount = parseFloat(document.getElementById('goal-amount').value);
      const date = document.getElementById('goal-date').value;
      
      if (!name) {
        alert('Please enter a goal name');
        return;
      }
      
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid target amount');
        return;
      }
      
      if (!date) {
        alert('Please select a target date');
        return;
      }
      
      const newGoal = {
        id: Date.now().toString(),
        name: name,
        targetAmount: amount,
        currentAmount: 0,
        targetDate: date,
        createdAt: new Date().toISOString()
      };
      
      financialGoals.push(newGoal);
      localStorage.setItem('financialGoals', JSON.stringify(financialGoals));
      
      renderGoals();
      goalsForm.style.display = 'none';
      
      // Reset form
      document.getElementById('goal-name').value = '';
      document.getElementById('goal-amount').value = '';
      document.getElementById('goal-date').value = '';
    });
    
    function renderGoals() {
      if (financialGoals.length === 0) {
        goalsDisplay.innerHTML = '<p class="no-goals">No goals set yet</p>';
        return;
      }
      
      goalsDisplay.innerHTML = financialGoals.map(goal => `
        <div class="goal-item" data-id="${goal.id}">
          <div class="goal-info">
            <strong>${goal.name}</strong>
            <div>Target: $${goal.targetAmount.toFixed(2)} by ${new Date(goal.targetDate).toLocaleDateString()}</div>
            <div>Saved: $${goal.currentAmount.toFixed(2)} of $${goal.targetAmount.toFixed(2)}</div>
            <div class="goal-progress">
              <div class="goal-progress-bar" style="width: ${Math.min(100, (goal.currentAmount / goal.targetAmount * 100))}%"></div>
            </div>
          </div>
          <button class="delete-goal" data-id="${goal.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `).join('');
      
      // Add delete event listeners
      document.querySelectorAll('.delete-goal').forEach(button => {
        button.addEventListener('click', function() {
          const goalId = this.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this goal?')) {
            financialGoals = financialGoals.filter(goal => goal.id !== goalId);
            localStorage.setItem('financialGoals', JSON.stringify(financialGoals));
            renderGoals();
          }
        });
      });
    }
  });
  // linking accounts
  document.addEventListener('DOMContentLoaded', function() {
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
  
    // Close modal when X is clicked
    document.querySelector('.close-modal').addEventListener('click', function() {
      closeModal('link-account-modal');
    });
  
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
  
    function closeModal(id) {
      document.getElementById(id).style.display = 'none';
    }
  
    // Make unlinkAccount available globally
    window.unlinkAccount = unlinkAccount;
  });
  