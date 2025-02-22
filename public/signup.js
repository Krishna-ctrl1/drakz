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

document.addEventListener('DOMContentLoaded', function () {

  const style = document.createElement('style');
  style.textContent = `
    .radio-group .error-message, .terms .error-message {
      display: block;
      margin-top: 5px;
    }
    .error-message {
      font-size: 12px;
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
});


