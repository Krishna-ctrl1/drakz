document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector(".form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Get the password visibility toggle icon
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
      // Toggle password visibility
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        // Optional: Change icon appearance for visibility state
        passwordToggleIcon.classList.add("visible");
      } else {
        passwordInput.type = "password";
        // Optional: Revert icon appearance
        passwordToggleIcon.classList.remove("visible");
      }
    });
  }

  // Validate fields on input change
  emailInput.addEventListener("input", () => removeError(emailInput));
  passwordInput.addEventListener("input", () => removeError(passwordInput));

  // Handle form submission with AJAX
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Always prevent default form submission

    let isValid = true;

    if (emailInput.value.trim() === "") {
      showError(emailInput, "Email is required");
      isValid = false;
    }

    if (passwordInput.value.trim() === "") {
      showError(passwordInput, "Password is required");
      isValid = false;
    }

    if (isValid) {
      // If client-side validation passes, send AJAX request
      const formData = new FormData(loginForm);

      fetch("/advisor-login", {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => {
          if (response.redirected) {
            // If server redirects, follow the redirect
            window.location.href = response.url;
          } else {
            // Otherwise, process JSON response
            return response.json();
          }
        })
        .then((data) => {
          if (data && data.status === "error") {
            // Show server-side error message
            showError(emailInput, data.message);
          }
        })
        .catch((error) => {
          console.error("Login error:", error);
        });
    }
  });
});
