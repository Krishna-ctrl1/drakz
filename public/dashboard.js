function openNav() {
  const sidebar = document.getElementById("mySidebar");
  const closeButton = document.getElementById("close-button");

  sidebar.style.width = "180px"; // Open sidebar to full width
  document.getElementById("main").style.marginLeft = "180px"; // Adjust main content
  closeButton.innerHTML =
    '<img width="25" src="assets/icons/sidebarclose.png">'; // Set close button image
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

//search bar funtionality

function filterDashboard() {
  let input = document.getElementById("searchInput").value.trim().toLowerCase();
  let items = document.querySelectorAll(".dashboard-item");

  items.forEach((item) => {
    let text = item.textContent.trim().toLowerCase();
    // Check if search input matches the dashboard item
    if (text.includes(input)) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
}

//crredit score

// Generate tick marks around the gauge
const ticksContainer = document.querySelector(".ticks");
for (let i = 0; i < 30; i++) {
  const tick = document.createElement("div");
  tick.classList.add("tick");
  tick.style.transform = `rotate(${i * 12}deg)`;
  ticksContainer.appendChild(tick);
}

function updateCreditScore(score) {
  const minScore = 300;
  const maxScore = 850;

  // Calculate percentage position
  let position = ((score - minScore) / (maxScore - minScore)) * 100;

  document.querySelector(".credit-score-marker").style.left = `${position}%`;
  document.querySelector(".credit-score-value").style.left = `${position - 2}%`;
  document.querySelector(".credit-score-value").textContent = `${score}/850`;
}

// Example: Update to 774 dynamically
updateCreditScore(670);

// const expenseCtx = document
//   .getElementById("expenseChartCanvas")
//   .getContext("2d");
// new Chart(expenseCtx, {
//   type: "pie",
//   data: {
//     labels: ["Leisure", "Utilities", "Savings", "Miscellaneous"],
//     datasets: [
//       {
//         data: [30, 15, 20, 35], // Values
//         backgroundColor: [
//           "#2c3e50", // Dark Blue (Leisure)
//           "#5d6981", // Grayish Blue (Utilities)
//           "#4a90e2", // Light Blue (Savings)
//           "#9bb1ff", // Soft Blue (Miscellaneous)
//         ],
//         borderWidth: 2,
//         borderColor: "#ffffff",
//       },
//     ],
//   },
//   options: {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false, // Hide legend, show text inside slices
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//   },
// });

/*Video Library*/

// Get all video thumbnails
const thumbnails = document.querySelectorAll(".video-thumbnail");
const videoModal = document.getElementById("video-modal");
const videoFrame = document.getElementById("video-frame");

// Open video modal
thumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    const videoSrc = this.getAttribute("data-video");
    videoFrame.src = videoSrc;
    videoModal.style.display = "block";
    // Disable scrolling
    document.body.style.overflow = "hidden";
  });
});

// Close video modal and stop video
document.querySelector(".close-preview").addEventListener("click", function () {
  videoModal.style.display = "none";
  videoFrame.src = ""; // Reset iframe src to stop video
  document.body.style.overflow = "auto";
});

// Get the video row and arrows
const videoRow = document.querySelector(".video-row");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");

// Scroll left
leftArrow.addEventListener("click", () => {
  videoRow.scrollBy({
    left: -300, // Adjust scroll distance as needed
    behavior: "smooth",
  });
});

// Scroll right
rightArrow.addEventListener("click", () => {
  videoRow.scrollBy({
    left: 300, // Adjust scroll distance as needed
    behavior: "smooth",
  });
});

//cards carousel
// Initialize Swiper
const swiper = new Swiper(".swiper-container", {
  loop: false,
  slidesPerView: 1, // Show only one slide at a time
  spaceBetween: 20, // Space between slides
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// Function to delete a card
function deleteCard(button) {
  const slide = button.closest(".swiper-slide"); // Get the parent slide
  slide.remove(); // Remove the slide
  swiper.update(); // Update Swiper to reflect the changes
  swiper.pagination.update(); // Update pagination logic
  swiper.pagination.render();
  updatePaginationVisibility();
  updateNoCardsMessage(); // Update the "No Cards" message
}

// Function to show the form
function showForm() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("addCardForm").style.display = "block";
}

// Function to format card number (add spaces after every 4 digits)
function formatCardNumber(input) {
  let value = input.value.replace(/\s/g, ""); // Remove existing spaces
  let cursorPosition = input.selectionStart; // Save cursor position
  let oldLength = input.value.length;

  // Add space after every 4 digits
  value = value.replace(/(\d{4})(?=\d)/g, "$1 ").trim();

  // Update the input value
  input.value = value;

  // Adjust cursor position after adding spaces
  let newLength = input.value.length;
  let diff = newLength - oldLength;

  if (diff > 0 && cursorPosition % 5 === 0) {
    cursorPosition++; // Move cursor forward after adding a space
  }

  input.setSelectionRange(cursorPosition, cursorPosition);
}

// Function to format date (MM/YY)
// Function to format date (MM/YY)
function formatDate(input) {
  let value = input.value.replace(/\D/g, ""); // Remove non-numeric characters
  let cursorPosition = input.selectionStart; // Save cursor position before formatting

  let formattedValue = "";
  for (let i = 0; i < value.length; i++) {
    if (i == 2) {
      formattedValue += "/"; // Add slash after MM
      if (cursorPosition > i) cursorPosition++; // Adjust cursor if needed
    }
    formattedValue += value[i];
  }

  // Ensure MM is valid (01-12)
  if (formattedValue.length >= 2) {
    let month = parseInt(formattedValue.slice(0, 2), 10);
    if (month < 1 || month > 12) {
      formattedValue = "0" + formattedValue[0]; // Reset if invalid
    }
  }

  input.value = formattedValue;

  // Restore correct cursor position
  setTimeout(() => input.setSelectionRange(cursorPosition, cursorPosition), 0);
}

// Function to validate card number (16 digits)
function validateCardNumber(cardNumber) {
  const regex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/; // 16 digits with spaces
  return regex.test(cardNumber);
}

function validateCardHolderName(name) {
  const regex = /^[A-Za-z\s]+$/; // Only letters and spaces allowed
  return regex.test(name);
}

// Function to validate date format (MM/YY)
function validateDateFormat(date) {
  const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
  return regex.test(date);
}

// Function to check if a date is in the past (for Valid From)
function isPastDate(date) {
  const [month, year] = date.split("/").map(Number);
  const fullYear = 2000 + year; // Convert YY to YYYY

  // Get current date in Indian Standard Time (IST)
  const now = new Date();
  now.setHours(now.getHours() + 5, now.getMinutes() + 30); // Convert to IST

  const inputDate = new Date(fullYear, month - 1); // Set to the first of the month

  return inputDate < now; // Must be strictly in the past
}

// Function to check if a date is in the future (for Valid Thru)
function isFutureDate(date) {
  const [month, year] = date.split("/").map(Number);
  const fullYear = 2000 + year; // Convert YY to YYYY

  // Get current date in Indian Standard Time (IST)
  const now = new Date();
  now.setHours(now.getHours() + 5, now.getMinutes() + 30); // Convert to IST

  const inputDate = new Date(fullYear, month - 1); // Set to the first of the month

  return inputDate > now; // Must be strictly in the future
}

// Function to compare dates (Valid Thru should be after Valid From)
function compareDates(validFrom, validThru) {
  const [fromMonth, fromYear] = validFrom.split("/").map(Number);
  const [thruMonth, thruYear] = validThru.split("/").map(Number);

  // Convert to full year (e.g., 22 -> 2022)
  const fromDate = new Date(2000 + fromYear, fromMonth - 1);
  const thruDate = new Date(2000 + thruYear, thruMonth - 1);

  return thruDate > fromDate;
}

// Function to add a new card
function addCard() {
  const cardNumber = document.getElementById("cardNumber").value;
  const cardName = document.getElementById("cardName").value;
  const validFrom = document.getElementById("validFrom").value;
  const validThru = document.getElementById("validThru").value;

  // Validate card number
  if (!validateCardNumber(cardNumber)) {
    alert("Card number must be 16 digits with spaces.");
    return;
  }
  if (!validateCardHolderName(cardName)) {
    alert("Cardholder name must contain only letters and spaces.");
    return;
  }

  // Validate date format
  if (!validateDateFormat(validFrom) || !validateDateFormat(validThru)) {
    alert("Dates must be in MM/YY format.");
    return;
  }

  // Ensure Valid From is in the past
  if (!isPastDate(validFrom)) {
    alert("Valid From date must be in the past.");
    return;
  }

  // Ensure Valid Thru is in the future
  if (!isFutureDate(validThru)) {
    alert("Valid Thru date must be in the future.");
    return;
  }

  // Validate that Valid Thru is after Valid From
  if (!compareDates(validFrom, validThru)) {
    alert("Valid Thru date must be after Valid From date.");
    return;
  }

  // Create a new slide
  const newSlide = document.createElement("div");
  newSlide.classList.add("swiper-slide");
  newSlide.innerHTML = `
                <div class="atm-card">
                    <img src="assets/images//bank-iconn.png" alt="Bank Logo" class="bank-logo">
                    <img src="https://cdn-icons-png.flaticon.com/128/9334/9334627.png" alt="Chip" class="chip">
                    <div class="card-number">${cardNumber}</div>
                    <div class="validity">
                        <div><span>VALID FROM</span><br><strong>${validFrom}</strong></div>
                        <div><span>VALID THRU</span><br><strong>${validThru}</strong></div>
                    </div>
                    <div class="cardholder-name">${cardName}</div>
                    <img src="https://cdn-icons-png.flaticon.com/128/5968/5968299.png" alt="VISA Logo" class="visa-logo">
                    <button class="delete-button" onclick="deleteCard(this)">×</button>
                </div>
            `;

  // Append the new slide to the Swiper wrapper
  document.querySelector(".swiper-wrapper").appendChild(newSlide);

  // Update Swiper
  swiper.update(); // Update Swiper to reflect the new slide
  swiper.pagination.update(); // Update pagination indicators

  // Hide the form and overlay
  document.getElementById("overlay").style.display = "none";
  document.getElementById("addCardForm").style.display = "none";

  // Clear the form fields
  document.getElementById("cardNumber").value = "";
  document.getElementById("cardName").value = "";
  document.getElementById("validFrom").value = "";
  document.getElementById("validThru").value = "";

  updatePaginationVisibility();
  updateNoCardsMessage(); // Update the "No Cards" message

  // Update Swiper
  swiper.update(); // Update Swiper to reflect the new slide
  swiper.pagination.update(); // Update pagination logic
  swiper.pagination.render(); // Re-render pagination bullets
}

function updateNoCardsMessage() {
  const noCardsMessage = document.getElementById("noCardsMessage");
  const cards = document.querySelectorAll(".swiper-slide").length;

  if (cards === 0) {
    noCardsMessage.style.display = "block"; // Show the message
  } else {
    noCardsMessage.style.display = "none"; // Hide the message
  }
}

// Call updateNoCardsMessage on page load to handle initial state
document.addEventListener("DOMContentLoaded", () => {
  updateNoCardsMessage();
});

// Close the form when clicking outside
document.getElementById("overlay").addEventListener("click", () => {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("addCardForm").style.display = "none";
});

function updatePaginationVisibility() {
  const pagination = document.querySelector(".swiper-pagination");
  const hasCards = document.querySelectorAll(".swiper-slide").length > 0;

  pagination.style.display = hasCards ? "block" : "none";
}

if (!document.querySelector(".swiper-slide")) {
  swiper.destroy(true, true); // Destroy previous Swiper instance
  document.querySelector(".swiper-wrapper").innerHTML = ""; // Ensure container is ready
  new Swiper(".swiper-container", {
    /* Reinitialize Swiper */
  });
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("addCardForm").style.display = "none";
  }
});

// This function will handle fetching the dashboard data and displaying the cards
function fetchDashboardData() {
  fetch("/api/dashboard", {
    credentials: "include", // This ensures cookies are sent
  })
    .then((response) => {
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Check if it's actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // If it's not JSON, get the text to see what's being returned
        return response.text().then((text) => {
          console.error("Received non-JSON response:", text);
          throw new Error("Non-JSON response received");
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dashboard Data:", data);

      // Display credit cards
      displayCreditCards(data.creditCards);

      // Update other UI elements with the received data
      // ... other UI update functions
    })
    .catch((error) => {
      console.error("Error fetching dashboard data:", error);
    });
}

// Function to display credit cards
function displayCreditCards(cards) {
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const noCardsMessage = document.getElementById("noCardsMessage");

  // Clear existing cards
  swiperWrapper.innerHTML = "";

  // Check if there are any cards
  if (cards && cards.length > 0) {
    // Hide the "No Cards" message
    noCardsMessage.style.display = "none";

    // Add each card to the swiper
    cards.forEach((card) => {
      // Format dates for display
      const validFrom = formatDateFromISO(card.valid_from);
      const validThru = formatDateFromISO(card.valid_thru);

      // Create the card element
      const cardHTML = `
          <div class="swiper-slide" data-card-id="${card.id}">
            <div class="atm-card">
              <img src="assets/images/bank-iconn.png" alt="Bank Logo" class="bank-logo" />
              <img src="https://cdn-icons-png.flaticon.com/128/9334/9334627.png" alt="Chip" class="chip" />
              <div class="card-number">${formatCardNumberDisplay(
                card.card_number
              )}</div>
              <div class="validity">
                <div>
                  <span>VALID FROM</span><br /><strong>${validFrom}</strong>
                </div>
                <div>
                  <span>VALID THRU</span><br /><strong>${validThru}</strong>
                </div>
              </div>
              <div class="cardholder-name">${card.cardholder_name.toUpperCase()}</div>
              <img src="${getCardTypeImage(card.card_type)}" alt="${
        card.card_type
      } Logo" class="visa-logo" />
              <button class="delete-button" onclick="deleteCard(${
                card.id
              })">×</button>
            </div>
          </div>
        `;

      // Add the card to the wrapper
      swiperWrapper.innerHTML += cardHTML;
    });

    // Reinitialize or update the Swiper
    initializeSwiper();
  } else {
    // Show the "No Cards" message
    noCardsMessage.style.display = "block";
  }
}

// Helper function to format date from ISO format to MM/YY
function formatDateFromISO(isoDate) {
  if (!isoDate) return "N/A";

  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);

  return `${month}/${year}`;
}

// Helper function to format card number for display (e.g., "1234 5678 9012 3456")
function formatCardNumberDisplay(cardNumber) {
  if (!cardNumber) return "";

  // If the card number already has spaces, return it as is
  if (cardNumber.includes(" ")) return cardNumber;

  // Otherwise, add spaces every 4 characters
  return cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
}

// Helper function to get the appropriate card type image
function getCardTypeImage(cardType) {
  if (!cardType)
    return "https://cdn-icons-png.flaticon.com/128/5968/5968299.png"; // Default to VISA

  const cardTypeUpperCase = cardType.toUpperCase();

  switch (cardTypeUpperCase) {
    case "VISA":
      return "https://cdn-icons-png.flaticon.com/128/5968/5968299.png";
    case "MASTERCARD":
      return "https://cdn-icons-png.flaticon.com/128/5968/5968382.png";
    case "AMEX":
    case "AMERICAN EXPRESS":
      return "https://cdn-icons-png.flaticon.com/128/349/349228.png";
    case "DISCOVER":
      return "https://cdn-icons-png.flaticon.com/128/349/349230.png";
    default:
      return "https://cdn-icons-png.flaticon.com/128/5968/5968299.png"; // Default to VISA
  }
}

// Function to initialize or update the Swiper
function initializeSwiper() {
  // Check if Swiper is already initialized
  if (window.mySwiper) {
    // Update the existing Swiper
    window.mySwiper.update();
  } else {
    // Initialize a new Swiper
    window.mySwiper = new Swiper(".swiper-container", {
      slidesPerView: 1,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
}

// Function to delete a card
function deleteCard(cardId) {
  if (confirm("Are you sure you want to delete this card?")) {
    fetch(`/api/credit-cards/${cardId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete card");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Card deleted successfully");
        // Refresh the dashboard data
        fetchDashboardData();
      })
      .catch((error) => {
        console.error("Error deleting card:", error);
      });
  }
}

// Function to add a new card
function addCard() {
  // Get form values
  const cardNumber = document
    .getElementById("cardNumber")
    .value.replace(/\s/g, "");
  const cardName = document.getElementById("cardName").value;
  const validFrom = document.getElementById("validFrom").value;
  const validThru = document.getElementById("validThru").value;

  // Convert MM/YY to database format (YYYY-MM-DD)
  const validFromDate = convertToISODate(validFrom);
  const validThruDate = convertToISODate(validThru);

  // Create card data object
  const cardData = {
    card_number: cardNumber,
    cardholder_name: cardName,
    valid_from: validFromDate,
    valid_thru: validThruDate,
    bank_name: "Example Bank", // Default or get from form
    card_type: "VISA", // Default or detect from card number
  };

  // Send POST request to add card
  fetch("/api/credit-cards", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cardData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add card");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Card added successfully");
      // Hide the form
      document.getElementById("overlay").style.display = "none";
      document.getElementById("addCardForm").style.display = "none";
      // Clear form fields
      document.getElementById("cardNumber").value = "";
      document.getElementById("cardName").value = "";
      document.getElementById("validFrom").value = "";
      document.getElementById("validThru").value = "";
      // Refresh the dashboard data
      fetchDashboardData();
    })
    .catch((error) => {
      console.error("Error adding card:", error);
    });
}

// Helper function to convert MM/YY to YYYY-MM-DD
function convertToISODate(mmYY) {
    try {
      if (!mmYY || mmYY.length !== 5 || mmYY.charAt(2) !== '/') {
        console.error('Invalid date format', mmYY);
        return null;
      }
      
      const month = mmYY.substring(0, 2);
      const year = '20' + mmYY.substring(3, 5);
      
      // Validate month and year
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12 || isNaN(yearNum)) {
        console.error('Invalid month or year', month, year);
        return null;
      }
      
      // For valid_from, use the first day of the month
      return `${year}-${month}-01`;
    } catch (err) {
      console.error('Date conversion error:', err);
      return null;
    }
  }

// Format card number as it's entered (add spaces)
function formatCardNumber(input) {
  let value = input.value.replace(/\s+/g, "");
  value = value.replace(/[^0-9]/gi, "");

  const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
  input.value = formattedValue;
}

// Format date as it's entered (add slash)
function formatDate(input) {
  let value = input.value.replace(/\D/g, "");

  if (value.length > 2) {
    value = value.substring(0, 2) + "/" + value.substring(2);
  }

  input.value = value;
}

// Function to show the add card form
function showForm() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("addCardForm").style.display = "block";
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  // Fetch dashboard data when the page loads
  fetchDashboardData();

  // Close the form when clicking outside
  document.getElementById("overlay").addEventListener("click", function () {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("addCardForm").style.display = "none";
  });
});

// Add this function to your existing dashboard.js file

function displayTotalHoldings(holdings) {
  if (!holdings) return;

  // Get the total holding container elements
  const totalHoldingAmount = document.querySelector(
    ".total-holding-card-container .amount"
  );

  // Format the total balance with commas and 2 decimal places
  const formattedBalance = formatCurrency(holdings.total_balance);

  // Update the amount display
  totalHoldingAmount.textContent = `$ ${formattedBalance}`;

  // You could also update the return percentage if you have that data
  // For now, we'll leave the placeholder data for the return
  // If you have real return data, you could update it like this:
  // const returnElement = document.querySelector('.total-holding-card-container .return-text');
  // returnElement.textContent = `+${holdings.return_percentage}% ($${holdings.return_amount})`;
}

// Helper function to format currency values
function formatCurrency(value) {
  if (!value) return "0.00";

  // Convert string to number if needed
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Format with commas and 2 decimal places
  return numValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ============ CREDIT SCORE DISPLAY ============
function displayCreditScore(creditScores) {
  // Ensure we have credit score data
  if (!creditScores || creditScores.length === 0) return;

  // Get the most recent credit score (assuming the API returns them in chronological order)
  const latestScore = creditScores[creditScores.length - 1];
  const score = parseInt(latestScore.credit_score);

  // Get all the necessary elements
  const scoreValueElement = document.querySelector(".gauge-value");
  const scoreMarker = document.querySelector(".credit-score-marker");
  const scoreValueText = document.querySelector(".credit-score-value");
  const scoreStatusElement = document.querySelector(".credit-score-status");

  // Update the score value in the gauge
  scoreValueElement.textContent = score;

  // Calculate position for the marker (as percentage from left)
  // Assuming credit score range is 300-850
  const minScore = 300;
  const maxScore = 850;
  const scoreRange = maxScore - minScore;
  const scorePercentage = ((score - minScore) / scoreRange) * 100;

  // Update the marker position
  scoreMarker.style.left = `${scorePercentage}%`;
  scoreValueText.style.left = `${scorePercentage}%`;
  scoreValueText.textContent = `${score}/${maxScore}`;

  // Determine credit score status
  let status;
  if (score >= 800) {
    status = "EXCELLENT";
  } else if (score >= 740) {
    status = "VERY GOOD";
  } else if (score >= 670) {
    status = "GOOD";
  } else if (score >= 580) {
    status = "FAIR";
  } else {
    status = "POOR";
  }

  // Update status text
  scoreStatusElement.textContent = status;

  // Optional: Update color based on status
  scoreStatusElement.className = "credit-score-status " + status.toLowerCase();

  // If you have previous credit score data to show change
  if (creditScores.length > 1) {
    const previousScore = creditScores[creditScores.length - 2].credit_score;
    const change = score - previousScore;
    const changeElement = document.querySelector(
      ".gauge-change span:nth-child(2)"
    );
    const arrowElement = document.querySelector(".gauge-change .arrow");

    changeElement.textContent = Math.abs(change);

    if (change > 0) {
      arrowElement.innerHTML = "&#9650;"; // Up arrow
      arrowElement.style.color = "green";
    } else if (change < 0) {
      arrowElement.innerHTML = "&#9660;"; // Down arrow
      arrowElement.style.color = "red";
    } else {
      arrowElement.innerHTML = "&#8212;"; // Dash for no change
      arrowElement.style.color = "gray";
    }
  }
}

// ============ EXPENSE DISTRIBUTION CHART ============
let expenseChart;
function displayExpenseDistribution(expenses) {
  // Ensure we have expense data
  if (!expenses || expenses.length === 0) return;

  // Group expenses by category and sum amounts
  const expensesByCategory = {};

  expenses.forEach((expense) => {
    const category = expense.category;
    const amount = parseFloat(expense.amount);

    if (expensesByCategory[category]) {
      expensesByCategory[category] += amount;
    } else {
      expensesByCategory[category] = amount;
    }
  });

  // Prepare data for chart
  const categories = Object.keys(expensesByCategory);
  const amounts = categories.map((category) => expensesByCategory[category]);

  // Define colors for each category
  const colors = [
    "#4a6b97", // Red
    "rgb(101, 79, 113)", // Blue
    "rgb(222, 132, 132)", // Yellow
    "#4BC0C0", // Teal
    "#9966FF", // Purple
    "rgb(177, 169, 123)", // Orange
    "#C9CBCF", // Gray
  ];

  // Get the canvas element
  const canvas = document.getElementById("expenseChartCanvas");
  const ctx = canvas.getContext("2d");

  // Create the chart
  const expenseChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: colors.slice(0, categories.length),
          borderWidth: 1,
          borderColor: "#fff", // White border for clean look
          borderWidth: 2,
          hoverOffset: 5, // Add hover effect
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false, // Hide default legend
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            const total = dataset.data.reduce((acc, val) => acc + val, 0);
            const currentValue = dataset.data[tooltipItem.index];
            const percentage = Math.round((currentValue / total) * 100);
            return `${
              data.labels[tooltipItem.index]
            }: $${currentValue} (${percentage}%)`;
          },
        },
      },
      
    },
  });

  // Create custom legend
  //createCustomLegend(categories, colors.slice(0, categories.length), amounts);
}

// Helper function to create a custom legend
function createCustomLegend(categories, colors, amounts) {
  const legendContainer = document.getElementById("chartLegend");
  legendContainer.innerHTML = ""; // Clear existing content

  // Calculate total for percentages
  const total = amounts.reduce((sum, amount) => sum + amount, 0);

  // Create legend items
  categories.forEach((category, index) => {
    const percentage = ((amounts[index] / total) * 100).toFixed(1);
    const legendItem = document.createElement("div");
    legendItem.className = "legend-item";

    legendItem.innerHTML = `
        <span class="legend-color" style="background-color: ${
          colors[index]
        }"></span>
        <span class="legend-label">${category}</span>
        <span class="legend-value">$${amounts[index].toFixed(
          2
        )} (${percentage}%)</span>
      `;

    legendContainer.appendChild(legendItem);
  });
}

// Update your fetchDashboardData function to include these new displays
function fetchDashboardData() {
  fetch("/api/dashboard", {
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dashboard Data:", data);

      // Display credit cards
      displayCreditCards(data.creditCards);

      // Display total holdings
      displayTotalHoldings(data.holdings);

      // Display credit score
      displayCreditScore(data.creditScores);

      // Display expense distribution
      displayExpenseDistribution(data.expenses);
    })
    .catch((error) => {
      console.error("Error fetching dashboard data:", error);
    });
}

// Add some CSS for the credit score status colors
document.head.insertAdjacentHTML(
  "beforeend",
  `
    <style>
      .credit-score-status.excellent { color: #00A86B; }
      .credit-score-status.very.good { color: #7FD1AE; }
      .credit-score-status.good { color: #FFD700; }
      .credit-score-status.fair { color: #FFA500; }
      .credit-score-status.poor { color: #FF4500; }
      
      .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
      }
      
      .legend-color {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 2px;
        margin-right: 5px;
      }
      
      .legend-label {
        flex: 1;
        margin-right: 10px;
      }
      
      .legend-value {
        font-weight: bold;
      }
    </style>
  `
);
