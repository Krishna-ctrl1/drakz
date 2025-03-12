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

//settings
function showTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`[onclick="showTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab).classList.add('active');
}

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const base64Image = reader.result; // Convert image to Base64
        document.getElementById('profile-pic').src = base64Image;
        localStorage.setItem("profileImage", base64Image); // Save Base64 to localStorage
    };
    reader.readAsDataURL(event.target.files[0]);
}

// Load saved profile image on page load
document.addEventListener("DOMContentLoaded", function () {
    const profileImage = localStorage.getItem("profileImage");
    if (profileImage) {
        document.getElementById("profile-pic").src = profileImage;
    }
});

function validatePhoneNumber(phone) {
    // Regex for valid formatting
    const phoneRegex = /^\+?(\d{1,4})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{4}$/;
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if the total number of digits is exactly 10
    return phoneRegex.test(phone) && digitsOnly.length === 10;
}

function validateEmail(email) {
    // Regex for a valid email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePinCode(pin) {
    // Regex for a valid PIN code (6 digits)
    const pinRegex = /^\d{6}$/;
    return pinRegex.test(pin);
}

function saveProfile() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const dob = document.getElementById("dob").value;
    const permAddress = document.getElementById("perm-address").value;
    const presAddress = document.getElementById("pres-address").value;
    const pin = document.getElementById("pin").value;
    const city = document.getElementById("city").value;

    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });

    
    let isValid = true;

    // Validate fields
    if (!name) {
        displayError('name-error', '❌ Name is required!');
        isValid = false;
    }
    if (!email) {
        displayError('email-error', '❌ Email is required!');
        isValid = false;
    } else if (!validateEmail(email)) {
        displayError('email-error', '❌ Please enter a valid email address!');
        isValid = false;
    }
    if (!mobile) {
        displayError('mobile-error', '❌ Mobile number is required!');
        isValid = false;
    } else if (!validatePhoneNumber(mobile)) {
        displayError('mobile-error', '❌ Please enter a valid 10-digit phone number!');
        isValid = false;
    }
    if (!dob) {
        displayError('dob-error', '❌ Date of Birth is required!');
        isValid = false;
    }
    if (!pin) {
        displayError('pin-error', '❌ PIN code is required!');
        isValid = false;
    } else if (!validatePinCode(pin)) {
        displayError('pin-error', '❌ Please enter a valid 6-digit PIN code!');
        isValid = false;
    }
    if (!city) {
        displayError('city-error', '❌ City is required!');
        isValid = false;
    }

    if (!isValid) {
        return; // Stop if validation fails
    }

    // Save profile data
    const profileData = {
        name,
        email,
        mobile,
        dob,
        permAddress,
        presAddress,
        pin,
        city,
    };

    localStorage.setItem("profileData", JSON.stringify(profileData));
    
    // Display success message
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = '✅ Profile saved successfully!';
    successMessage.style.display = 'block';

    // Hide success message after 3 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

function displayError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}
    
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
}

function selectOption(dropdownId, inputId, value) {
    document.getElementById(inputId).value = value;
    document.getElementById(dropdownId).style.display = "none";
}

function savePreferences() {
    const preferencesData = {
        currency: document.getElementById("currency").value,
        timezone: document.getElementById("timezone").value,
        digitalCurrency: document.getElementById("digital-currency").checked,
        merchantOrders: document.getElementById("merchant-orders").checked,
        accountRecommendations: document.getElementById("account-recommendations").checked,
    };

    localStorage.setItem("preferencesData", JSON.stringify(preferencesData));
    alert("✅ Preferences saved successfully!");
}

function saveSecurity() {
    const securityData = {
        currentPassword: document.getElementById("current-password").value,
        newPassword: document.getElementById("new-password").value,
        twoFactorAuth: document.getElementById("two-factor-auth").checked,
    };

    localStorage.setItem("securityData", JSON.stringify(securityData));
    alert("✅ Security settings saved successfully!");
}

document.addEventListener("DOMContentLoaded", function () {
    // Load Profile Data
    const profileData = JSON.parse(localStorage.getItem("profileData"));
    if (profileData) {
        document.getElementById("name").value = profileData.name;
        document.getElementById("email").value = profileData.email;
        document.getElementById("mobile").value = profileData.mobile;
        document.getElementById("dob").value = profileData.dob;
        document.getElementById("perm-address").value = profileData.permAddress;
        document.getElementById("pres-address").value = profileData.presAddress;
        document.getElementById("pin").value = profileData.pin;
        document.getElementById("city").value = profileData.city;
    }

    // Load Preferences Data
    const preferencesData = JSON.parse(localStorage.getItem("preferencesData"));
    if (preferencesData) {
        document.getElementById("currency").value = preferencesData.currency;
        document.getElementById("timezone").value = preferencesData.timezone;
        document.getElementById("digital-currency").checked = preferencesData.digitalCurrency;
        document.getElementById("merchant-orders").checked = preferencesData.merchantOrders;
        document.getElementById("account-recommendations").checked = preferencesData.accountRecommendations;
    }

    // Load Security Data
    const securityData = JSON.parse(localStorage.getItem("securityData"));
    if (securityData) {
        document.getElementById("current-password").value = securityData.currentPassword;
        document.getElementById("new-password").value = securityData.newPassword;
        document.getElementById("two-factor-auth").checked = securityData.twoFactorAuth;
    }

    // Load Country Data
    const countrySelect = document.getElementById("country-select");
    const countryText = document.getElementById("country-text");

    fetch("https://restcountries.com/v3.1/all")
        .then(res => res.json())
        .then(data => {
            const countries = data.map(c => c.name.common).sort();
            countries.forEach(country => {
                let option = document.createElement("option");
                option.value = option.textContent = country;
                countrySelect.appendChild(option);
            });

            const savedCountry = localStorage.getItem("country");
            if (savedCountry) {
                countryText.textContent = savedCountry;
                countrySelect.value = savedCountry;
            }
        });
        
    // Initialize currency dropdown
    const currencies = [
        "USD - US Dollar", 
        "EUR - Euro", 
        "GBP - British Pound", 
        "JPY - Japanese Yen", 
        "AUD - Australian Dollar", 
        "CAD - Canadian Dollar", 
        "CHF - Swiss Franc", 
        "CNY - Chinese Yuan", 
        "INR - Indian Rupee", 
        "SGD - Singapore Dollar"
    ];
    
    let currencyDropdown = document.getElementById("currency-dropdown");
    currencies.forEach(currency => {
        let li = document.createElement("li");
        li.textContent = currency;
        li.onclick = function() {
            selectOption('currency-dropdown', 'currency', currency);
        };
        currencyDropdown.appendChild(li);
    });
    
    // Initialize timezone dropdown
    const timezones = [
        "UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00", 
        "UTC-07:00", "UTC-06:00", "UTC-05:00", "UTC-04:00", "UTC-03:00", 
        "UTC-02:00", "UTC-01:00", "UTC+00:00", "UTC+01:00", "UTC+02:00",
        "UTC+03:00", "UTC+04:00", "UTC+05:00", "UTC+05:30", "UTC+06:00",
        "UTC+07:00", "UTC+08:00", "UTC+09:00", "UTC+10:00", "UTC+11:00",
        "UTC+12:00", "UTC+13:00", "UTC+14:00"
    ];
    
    let timezoneDropdown = document.getElementById("timezone-dropdown");
    timezones.forEach(timezone => {
        let li = document.createElement("li");
        li.textContent = timezone;
        li.onclick = function() {
            selectOption('timezone-dropdown', 'timezone', timezone);
        };
        timezoneDropdown.appendChild(li);
    });
});

function editCountry() {
    document.getElementById("country-box").style.display = "none";
    document.getElementById("country-select").style.display = "block";
}

function saveCountry() {
    const countrySelect = document.getElementById("country-select");
    const countryText = document.getElementById("country-text");

    if (countrySelect.value) {
        countryText.textContent = countrySelect.value;
        localStorage.setItem("country", countrySelect.value);
    }

    document.getElementById("country-box").style.display = "flex";
    document.getElementById("country-select").style.display = "none";
}