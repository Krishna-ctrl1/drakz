function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  // Send the token to your backend for verification
  fetch('/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential })
  })
  .then(res => res.json())
  .then(data => {
      console.log('Login Success:', data);
      window.location.href = 'signup.html'; // Redirect on success
  })
  .catch(error => {
      console.error('Error during login:', error);
  });
}

// Initialize Google Sign-In
function initGoogleSignIn() {
  if (!window.google || !google.accounts) {
      console.error("Google API not loaded.");
      return;
  }

  google.accounts.id.initialize({
      client_id: "1037396813768-4643uec933fpoqbce7lf7i73g4najnso.apps.googleusercontent.com",
      callback: handleCredentialResponse
  });

  // Attach Google login to button click
  document.querySelector(".google-login").addEventListener("click", () => {
      google.accounts.id.prompt(); // Opens the Google Sign-In popup
  });
}

// Ensure DOM is ready before running initGoogleSignIn
document.addEventListener("DOMContentLoaded", () => {
  if (window.google) {
      initGoogleSignIn();
  } else {
      setTimeout(initGoogleSignIn, 1000); // Retry after a short delay if API isn't loaded
  }
});
