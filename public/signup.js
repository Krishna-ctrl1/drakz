let currentStep = 1;
const totalSteps = 5;

function showStep(stepNumber) {
  document.querySelectorAll('.form-step').forEach(step => {
    step.classList.remove('active');
    step.classList.add('hidden');
  });
  const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
  currentStepElement.classList.add('active');
  currentStepElement.classList.remove('hidden');
  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.classList.toggle('active', index + 1 === stepNumber);
  });
}

function validateStep(stepNumber) {
  const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
  const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
  let isValid = true;
  
  if (stepNumber === 3) {
    const riskRadios = currentStepElement.querySelectorAll('input[name="risk"]');
    const isRiskSelected = Array.from(riskRadios).some(radio => radio.checked);
    
    if (!isRiskSelected) {
      isValid = false;

      const radioGroup = currentStepElement.querySelector('.radio-group');
      let errorMessage = radioGroup.querySelector('.error-message');
      
      if (!errorMessage) {
        errorMessage = document.createElement('span');
        errorMessage.classList.add('error-message');
        errorMessage.style.color = 'red';
        radioGroup.appendChild(errorMessage);
      }
      
      errorMessage.textContent = "Please select a risk tolerance level";
    } else {
      const radioGroup = currentStepElement.querySelector('.radio-group');
      let errorMessage = radioGroup.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.textContent = "";
      }
    }
    
    // Check terms checkbox
    const termsCheckbox = currentStepElement.querySelector('.terms input[type="checkbox"]');
    if (!termsCheckbox.checked) {
      isValid = false;
      const termsDiv = currentStepElement.querySelector('.terms');
      let errorMessage = termsDiv.querySelector('.error-message');
      
      if (!errorMessage) {
        errorMessage = document.createElement('span');
        errorMessage.classList.add('error-message');
        errorMessage.style.color = 'red';
        termsDiv.appendChild(errorMessage);
      }
      
      errorMessage.textContent = "You must agree to the terms";
    } else {
      const termsDiv = currentStepElement.querySelector('.terms');
      let errorMessage = termsDiv.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.textContent = "";
      }
    }
  }
  
  // Check other required fields
  requiredFields.forEach(field => {

    if (stepNumber === 3 && field.type === 'radio') return;
    
    const inputForm = field.closest('.inputForm') || field.parentNode;
    let errorMessage = inputForm.querySelector('.error-message');
    
    if (!errorMessage) {
      errorMessage = document.createElement('span');
      errorMessage.classList.add('error-message');
      errorMessage.style.color = 'red';
      inputForm.appendChild(errorMessage);
    }
    
    if (field.type === 'checkbox' && field.required && !field.checked) {
      inputForm.classList.add('invalid');
      errorMessage.textContent = "This field is required";
      isValid = false;
    } else if (!field.value.trim() && field.type !== 'checkbox') {
      inputForm.classList.add('invalid');
      errorMessage.textContent = field.name === 'email' ? "Email is required" :
                                 field.name === 'password' ? "Password is required" :
                                 field.name === 'confirm_password' ? "Confirm Password is required" :
                                 "This field is required";
      isValid = false;
    } else {
      inputForm.classList.remove('invalid');
      errorMessage.textContent = "";
    }
    
    if (field.type === 'email' && field.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value)) {
        inputForm.classList.add('invalid');
        errorMessage.textContent = "Invalid email format";
        isValid = false;
      }
    }
    
    if (field.name === 'confirm_password') {
      const password = document.querySelector('input[name="password"]').value;
      if (field.value !== password) {
        inputForm.classList.add('invalid');
        errorMessage.textContent = "Passwords do not match";
        isValid = false;
      }
    }
  });
  
  return isValid;
}

function handleNext() {
  if (validateStep(currentStep) && currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
  }
}

function handlePrevious() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

// Function to check if email already exists
async function checkEmailExists(email) {
  try {
    const response = await fetch('/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}

// Store user verification data
let userVerificationData = {
  email: null,
  aadhaarVerified: false,
  panVerified: false
};

document.addEventListener('DOMContentLoaded', function () {
  // Add status elements for Aadhaar and PAN verification
  const aadhaarOtpInput = document.querySelector("input[name='aadhaar_otp']").parentNode;
  const aadhaarStatus = document.createElement('p');
  aadhaarStatus.id = 'aadhaar-status';
  aadhaarOtpInput.parentNode.appendChild(aadhaarStatus);
  
  const panOtpInput = document.querySelector("input[name='pan_otp']").parentNode;
  const panStatus = document.createElement('p');
  panStatus.id = 'pan-status';
  panOtpInput.parentNode.appendChild(panStatus);

  const aadhaarStepNumber = 4;
  const aadhaarNextButton = document.querySelector(`.form-step[data-step="${aadhaarStepNumber}"] .button-next`);
  if (aadhaarNextButton) {
    aadhaarNextButton.disabled = true;
  }

  const panStepNumber = 5;
  const panNextButton = document.querySelector(`.form-step[data-step="${panStepNumber}"] .button-next`);
  if (panNextButton) {
    panNextButton.disabled = true;
  }

  const style = document.createElement('style');
  style.textContent = `
    .radio-group .error-message, .terms .error-message {
      display: block;
      margin-top: 5px;
    }
    .error-message {
      font-size: 12px;
    }
    #aadhaar-status, #pan-status {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 500;
    }
    .text-green-500 {
      color: #10b981;
    }
    .text-red-500 {
      color: #ef4444;
    }
    .text-blue-500 {
      color: #3b82f6;
    }
    .font-bold {
      font-weight: 700;
    }
    .verified {
      border: 2px solid #10b981;
      padding: 5px;
      border-radius: 5px;
      background-color: rgba(16, 185, 129, 0.1);
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.button-next').forEach(button => {
    button.addEventListener('click', handleNext);
  });
  
  document.querySelectorAll('.button-prev').forEach(button => {
    button.addEventListener('click', handlePrevious);
  });
  
  const backToSignInBtn = document.querySelector(".button-signin");
  if (backToSignInBtn) {
    backToSignInBtn.addEventListener("click", function () {
      window.location.href = "login.html";
    });
  }
  
  // Email validation for first step
  const emailInput = document.querySelector("input[name='email']");
  if (emailInput) {
    emailInput.addEventListener('blur', async function() {
      if (this.value && this.checkValidity()) {
        const emailExists = await checkEmailExists(this.value);
        const inputForm = this.closest('.inputForm');
        let errorMessage = inputForm.querySelector('.error-message');
        
        if (!errorMessage) {
          errorMessage = document.createElement('span');
          errorMessage.classList.add('error-message');
          errorMessage.style.color = 'red';
          inputForm.appendChild(errorMessage);
        }
        
        if (emailExists) {
          inputForm.classList.add('invalid');
          errorMessage.textContent = "This email is already registered";
        }
      }
    });
  }
  
  // Event listeners for input validation
  document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
      if (input.type === 'radio' && input.name === 'risk') {
        // Clear error for radio group when any option is selected
        const radioGroup = input.closest('.radio-group');
        const errorMessage = radioGroup.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.textContent = "";
        }
      } else if (input.type === 'checkbox' && input.closest('.terms')) {
        // Clear error for terms checkbox
        const termsDiv = input.closest('.terms');
        const errorMessage = termsDiv.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.textContent = "";
        }
      } else {
        // Handle regular inputs
        const inputForm = input.closest('.inputForm');
        if (inputForm) {
          const errorMessage = inputForm.querySelector('.error-message');
          if (input.checkValidity() && errorMessage) {
            inputForm.classList.remove('invalid');
            errorMessage.textContent = "";
          }
        }
      }
    });
  });
  
  // Start at step 1
  showStep(1);
  
  // Disable OTP input fields initially
  document.querySelector("input[name='aadhaar_otp']").disabled = true;
  document.querySelector("input[name='pan_otp']").disabled = true;
  
  // Disable the submit button initially
  const submitButton = document.querySelector(".button-submit");
  if (submitButton) {
    submitButton.disabled = true;
  }
  
  // Update the PAN OTP request event listener
  const panOtpBtn = document.querySelector(".pan-otp-send-btn");
  if (panOtpBtn) {
    panOtpBtn.addEventListener("click", handlePANVerification);
  }
  
  // Update the PAN OTP verification event listener
  const panVerifyBtn = document.querySelector(".pan-otp-verify-btn");
  if (panVerifyBtn) {
    panVerifyBtn.addEventListener("click", verifyPANOTP);
  }

  // Link the Aadhaar OTP send functionality to the button with class "aadhaar-otp-send-button"
  const aadhaarOtpSendButton = document.querySelector(".aadhaar-otp-send-btn");
  if (aadhaarOtpSendButton) {
    aadhaarOtpSendButton.addEventListener("click", handleAadhaarVerification);
  }

  // Link the Aadhaar OTP verification functionality to the button with class "aadhaar-otp-verify-btn"
  const aadhaarOtpVerifyButton = document.querySelector(".aadhaar-otp-verify-btn");
  if (aadhaarOtpVerifyButton) {
    aadhaarOtpVerifyButton.addEventListener("click", verifyAadhaarOTP);
  }
});

function handleAadhaarVerification() {
  const aadhaarNumber = document.querySelector("input[name='aadhaar']").value;
  const aadhaarStatus = document.querySelector("#aadhaar-status");
  
  // Validate Aadhaar Number
  if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) {
    aadhaarStatus.textContent = "Please enter a valid 12-digit Aadhaar number.";
    aadhaarStatus.className = "text-red-500";
    return;
  }

  // Show loading state
  aadhaarStatus.textContent = "Verifying Aadhaar and sending OTP...";
  aadhaarStatus.className = "text-blue-500";
  
  // Request OTP from server - it will look up the email from the database
  fetch('/aadhaar-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ aadhaarNumber }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Store the masked email to display to the user
      const maskedEmail = data.maskedEmail || "your registered email";
      aadhaarStatus.textContent = `OTP sent to ${maskedEmail}`;
      aadhaarStatus.className = "text-green-500";
      
      // Enable OTP input
      document.querySelector("input[name='aadhaar_otp']").disabled = false;
      document.querySelector("input[name='aadhaar_otp']").focus();
    } else {
      aadhaarStatus.textContent = data.message || "Error sending verification code. Aadhaar may not be registered.";
      aadhaarStatus.className = "text-red-500";
    }
  })
  .catch(error => {
    console.error('Error:', error);
    aadhaarStatus.textContent = "Server error. Please try again later.";
    aadhaarStatus.className = "text-red-500";
  });
}

function verifyAadhaarOTP(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const aadhaarNumber = document.querySelector("input[name='aadhaar']").value;
  const otp = document.querySelector("input[name='aadhaar_otp']").value;
  const aadhaarStatus = document.querySelector("#aadhaar-status");

  if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    aadhaarStatus.textContent = "Please enter a valid 6-digit verification code.";
    aadhaarStatus.className = "text-red-500";
    return;
  }

  // Show loading state
  aadhaarStatus.textContent = "Verifying...";
  aadhaarStatus.className = "text-blue-500";
  
  // Verify OTP with server
  fetch('/aadhaar-verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ aadhaarNumber, otp }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      aadhaarStatus.textContent = "✓ Verification successful! You can now proceed to the next step.";
      aadhaarStatus.className = "text-green-500 font-bold";
      
      // Mark as verified visually - check if element exists first
      const aadhaarVerificationElement = document.querySelector(".aadhaar-verification");
      if (aadhaarVerificationElement) {
        aadhaarVerificationElement.classList.add("verified");
      }
      
      // Store verification data
      userVerificationData.aadhaarVerified = true;
      
      // If email was returned and different from current
      if (data.email && data.email !== userVerificationData.email) {
        userVerificationData.email = data.email;
      }
      
      // Enable the Next button in this step
      const nextButton = document.querySelector(`.form-step[data-step="${currentStep}"] .button-next`);
      if (nextButton) {
        nextButton.disabled = false;
      }
    
    } else {
      aadhaarStatus.textContent = data.message || "Invalid verification code. Please try again.";
      aadhaarStatus.className = "text-red-500";
    }
  })
  .catch(error => {
    console.error('Error:', error);
    aadhaarStatus.textContent = "Server error. Please try again later.";
    aadhaarStatus.className = "text-red-500";
  });
}

function handlePANVerification() {
  const panNumber = document.querySelector("input[name='pan']").value;
  const panStatus = document.querySelector("#pan-status");

  // PAN format validation - 5 letters, 4 digits, 1 letter
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(panNumber)) {
    panStatus.textContent = "Please enter a valid PAN number (format: ABCDE1234F).";
    panStatus.className = "text-red-500";
    return;
  }

  // Show loading state
  panStatus.textContent = "Verifying PAN and sending OTP...";
  panStatus.className = "text-blue-500";
  
  // Request OTP from server using email
  fetch('/pan-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ panNumber }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Store the masked email to display to the user
      const maskedEmail = data.maskedEmail || "your registered email";
      panStatus.textContent = `OTP sent to ${maskedEmail}`;
      panStatus.className = "text-green-500";
      
      // Enable OTP input
      document.querySelector("input[name='pan_otp']").disabled = false;
      document.querySelector("input[name='pan_otp']").focus();
    } else {
      panStatus.textContent = data.message || "Error sending verification code. PAN may not be registered.";
      panStatus.className = "text-red-500";
    }
  })
  .catch(error => {
    console.error('Error:', error);
    panStatus.textContent = "Server error. Please try again later.";
    panStatus.className = "text-red-500";
  });
}

function verifyPANOTP(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const panNumber = document.querySelector("input[name='pan']").value;
  const otp = document.querySelector("input[name='pan_otp']").value;
  const panStatus = document.querySelector("#pan-status");

  if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    panStatus.textContent = "Please enter a valid 6-digit verification code.";
    panStatus.className = "text-red-500";
    return;
  }

  // Show loading state
  panStatus.textContent = "Verifying...";
  panStatus.className = "text-blue-500";
  
  // Verify OTP with server
  fetch('/pan-verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ panNumber, otp }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      panStatus.textContent = "✓ Verification successful!";
      panStatus.className = "text-green-500 font-bold";
      
      // Mark as verified visually
      const panVerificationElement = document.querySelector(".pan-verification");
      if (panVerificationElement) {
        panVerificationElement.classList.add("verified");
      }
      
      // Store verification data
      userVerificationData.panVerified = true;
      
      // If email was returned and different from current
      if (data.email && data.email !== userVerificationData.email) {
        userVerificationData.email = data.email;
      }
      
      // Enable submit button
      document.querySelector(".button-submit").disabled = false;
    } else {
      panStatus.textContent = data.message || "Invalid verification code. Please try again.";
      panStatus.className = "text-red-500";
    }
  })
  .catch(error => {
    console.error('Error:', error);
    panStatus.textContent = "Server error. Please try again later.";
    panStatus.className = "text-red-500";
  });
}

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission
      
      // Create a data object with all form fields
      const formData = {
        name: document.querySelector('input[name="fullname"]').value,
        email: document.querySelector('input[name="email"]').value,
        password: document.querySelector('input[name="password"]').value,
        monthly_income: document.querySelector('input[name="income"]').value,
        employment_status: document.querySelector('select[name="employment"]').value,
        risk: document.querySelector('input[name="risk"]:checked')?.value || 'moderate',
        aadhaar_number: document.querySelector('input[name="aadhaar"]').value,
        pan_number: document.querySelector('input[name="pan"]').value,
        email_verified: (userVerificationData.aadhaarVerified && userVerificationData.panVerified) ? 'true' : 'false'
      };
      
      // Handle goals checkbox group
      const goals = Array.from(document.querySelectorAll('input[name="goals"]:checked')).map(el => el.value);
      if (goals.length > 0) {
        formData.financial_goals = goals;
      }
      
      console.log('Submitting form data:', formData);
      
      // Send data as JSON
      fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.error || `Signup failed with status ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        if (data.success && data.redirect) {
          window.location.href = data.redirect;
        } else {
          throw new Error('Signup response missing redirect information');
        }
      })
      .catch(error => {
        console.error('Error during signup:', error);
        
        // Create or update error message element
        let errorElement = document.getElementById('signup-error');
        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.id = 'signup-error';
          errorElement.style.color = 'red';
          errorElement.style.marginTop = '10px';
          errorElement.style.padding = '10px';
          errorElement.style.backgroundColor = '#ffeeee';
          errorElement.style.borderRadius = '5px';
          document.querySelector('form').appendChild(errorElement);
        }
        
        errorElement.textContent = error.message || 'An error occurred during signup';
      });
    });
  }
});