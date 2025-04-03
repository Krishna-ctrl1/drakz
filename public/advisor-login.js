document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".form");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordToggleIcon = passwordInput.nextElementSibling;

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

  // Password visibility toggle
  if (passwordToggleIcon) {
    passwordToggleIcon.addEventListener("click", function () {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordToggleIcon.classList.add("visible");
      } else {
        passwordInput.type = "password";
        passwordToggleIcon.classList.remove("visible");
      }
    });
  }

  // Validate fields on input change
  if (usernameInput) {
    usernameInput.addEventListener("input", () => removeError(usernameInput));
  }
  if (emailInput) {
    emailInput.addEventListener("input", () => removeError(emailInput));
  }
  passwordInput.addEventListener("input", () => removeError(passwordInput));

  // Handle form submission with AJAX
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;

    // Validate username if present
    if (usernameInput && usernameInput.value.trim() === "") {
      showError(usernameInput, "Username is required");
      isValid = false;
    }

    // Validate email
    if (emailInput && emailInput.value.trim() === "") {
      showError(emailInput, "Email is required");
      isValid = false;
    }

    // Validate password
    if (passwordInput.value.trim() === "") {
      showError(passwordInput, "Password is required");
      isValid = false;
    }

    if (isValid) {
      const formData = new FormData(loginForm);
      const endpoint = loginForm.dataset.endpoint || "/advisor-login";

      fetch(endpoint, {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        if (response.redirected) {
          window.location.href = response.url;
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data && data.status === "error") {
          // Show error message
          if (emailInput) {
            showError(emailInput, data.message);
          } else if (usernameInput) {
            showError(usernameInput, data.message);
          }
        }
      })
      .catch((error) => {
        console.error("Login/Registration error:", error);
      });
    }
  });
});