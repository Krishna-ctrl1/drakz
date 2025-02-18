// Facebook Login
function handleFacebookLogin() {
    alert("Facebook Login clicked. Add Facebook SDK to enable login.");
  }
  
  // Google Login
  function handleGoogleLogin() {
    alert("Google Login clicked. Add Google API to enable login.");
  }
  
  // Apple Login
  function handleAppleLogin() {
    alert("Apple Login clicked. Add Apple API to enable login.");
  }
  
  // Attaching event listeners
  document.addEventListener("DOMContentLoaded", function () {
    const facebookBtn = document.getElementById("facebook-login");
    const googleBtn = document.getElementById("google-login");
    const appleBtn = document.getElementById("apple-login");
  
    if (facebookBtn) facebookBtn.addEventListener("click", handleFacebookLogin);
    if (googleBtn) googleBtn.addEventListener("click", handleGoogleLogin);
    if (appleBtn) appleBtn.addEventListener("click", handleAppleLogin);
  });