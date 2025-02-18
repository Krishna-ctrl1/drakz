document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector(".form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    // Function to show error
    function showError(input, message) {
        const inputForm = input.closest(".inputForm");
        inputForm.classList.add("invalid");

        let errorMessage = inputForm.nextElementSibling;
        if (!errorMessage || !errorMessage.classList.contains("error-message")) {
            errorMessage = document.createElement("p");
            errorMessage.classList.add("error-message");
            inputForm.after(errorMessage);
        }
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    }

    // Function to remove error
    function removeError(input) {
        const inputForm = input.closest(".inputForm");
        inputForm.classList.remove("invalid");

        const errorMessage = inputForm.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains("error-message")) {
            errorMessage.style.display = "none";
        }
    }

    // Validate fields on input change
    emailInput.addEventListener("input", () => removeError(emailInput));
    passwordInput.addEventListener("input", () => removeError(passwordInput));

    // Handle form submission
    loginForm.addEventListener("submit", function (event) {
        let isValid = true;

        if (emailInput.value.trim() === "") {
            showError(emailInput, "Email is required");
            isValid = false;
        }

        if (passwordInput.value.trim() === "") {
            showError(passwordInput, "Password is required");
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
    });
});
