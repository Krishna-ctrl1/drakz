let currentStep = 1;
const totalSteps = 3;

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

    requiredFields.forEach(field => {
        const inputForm = field.closest('.inputForm');
        let errorMessage = inputForm.querySelector('.error-message');

        if (!errorMessage) {
            errorMessage = document.createElement('span');
            errorMessage.classList.add('error-message');
            errorMessage.style.color = 'red';
            inputForm.appendChild(errorMessage);
        }

        if (!field.value.trim()) {
            inputForm.classList.add('invalid');
            isValid = false;
            errorMessage.textContent = field.name === 'email' ? "Email is required" :
                                       field.name === 'password' ? "Password is required" :
                                       field.name === 'confirm_password' ? "Confirm Password is required" :
                                       "This field is required";
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

    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            const inputForm = input.closest('.inputForm');
            const errorMessage = inputForm.querySelector('.error-message');

            if (input.checkValidity()) {
                inputForm.classList.remove('invalid');
                if (errorMessage) errorMessage.textContent = "";
            }
        });
    });



    showStep(1);
});
