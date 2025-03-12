//search bar
function filterDashboard() {
  let input = document.getElementById("searchInput").value.trim().toLowerCase();
  let items = document.querySelectorAll(".account-item");

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

//sidebar
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

// Define chartInstance at the top level scope
let chartInstance;

function createChart() {
  const chartElement = document.getElementById("weeklyActivityChart");
  if (!chartElement) {
    console.error("Chart element not found!");
    return;
  }

  console.log("Creating chart...");
  const ctx = chartElement.getContext("2d");

  // Check if chartInstance exists before trying to destroy it
  if (typeof chartInstance !== "undefined" && chartInstance !== null) {
    console.log("Destroying old chart instance");
    chartInstance.destroy();
  }

  // Set default data (in case API fails)
  let depositValues = [0, 0, 0, 0, 0, 0, 0];
  let withdrawValues = [0, 0, 0, 0, 0, 0, 0];

  console.log("Initializing chart with default values");
  // Create the chart with default data first
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      datasets: [
        {
          label: "Deposit",
          data: depositValues,
          backgroundColor: "skyblue",
          borderRadius: 100,
          barThickness: 20,
          maxBarThickness: 20,
        },
        {
          label: "Withdraw",
          data: withdrawValues,
          backgroundColor: "darkblue",
          borderRadius: 100,
          barThickness: 20,
          maxBarThickness: 20,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          categoryPercentage: 0.7,
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          max: 5000, // Increased default max for visibility
          ticks: {
            stepSize: 1000,
            callback: function (value) {
              return value.toLocaleString();
            },
          },
          grid: {
            drawBorder: false,
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return (
                tooltipItem.dataset.label +
                ": " +
                tooltipItem.raw.toLocaleString()
              );
            },
          },
        },
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
          },
        },
      },
    },
  });

  console.log("Chart created, now fetching data...");

  fetch("/api/user/weekly-activity")
    .then((response) => response.json())
    .then((result) => {
      if (result.status === "success" && result.data) {
        console.log("Received weekly activity data:", result.data);

        // Update chart with the received data
        chartInstance.data.datasets[0].data = result.data.depositValues;
        chartInstance.data.datasets[1].data = result.data.withdrawValues;

        // Find the max value for scaling
        const allValues = [
          ...result.data.depositValues,
          ...result.data.withdrawValues,
        ];
        const maxValue = Math.max(...allValues);
        console.log("Max value for scaling:", maxValue);

        // Set appropriate scale
        if (maxValue > 0) {
          let yMax = 300; // Default
          if (maxValue <= 500) {
            yMax = 500;
          } else if (maxValue <= 1000) {
            yMax = 1000;
          } else if (maxValue <= 5000) {
            yMax = 5000;
          } else {
            yMax = Math.ceil(maxValue / 1000) * 1000;
          }

          console.log("Setting Y-axis max to:", yMax);
          chartInstance.options.scales.y.max = yMax;
          chartInstance.options.scales.y.ticks.stepSize = yMax / 5;
        }

        // Force update the chart
        chartInstance.update();
        console.log("Chart updated with new data");
      } else {
        console.error("Invalid response format:", result);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Make sure to call createChart when the DOM is loaded
document.addEventListener("DOMContentLoaded", createChart);

// Force re-render on window resize
window.addEventListener("resize", () => {
  createChart();
});

//transactions
const transactions = [
  {
    description: "Spotify Subscription",
    type: "Shopping",
    amount: -2500,
    date: "28 Jan, 12:30 AM",
  },
];

function filterTransactions(type) {
  const tbody = document.getElementById("transaction-body");
  tbody.innerHTML = "";

  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelector(`.tab[onclick="filterTransactions('${type}')"]`)
    .classList.add("active");

  const filtered = transactions.filter((tx) => {
    if (type === "income") return tx.amount > 0;
    if (type === "expense") return tx.amount < 0;
    return true;
  });

  filtered.forEach((tx) => {
    const row = `<tr>
            <td>${tx.description}</td>
            <td>${tx.type}</td>
            <td>${tx.date}</td>
            <td class="amount ${tx.amount > 0 ? "positive" : "negative"}">${
      tx.amount > 0 ? "+" + tx.amount : tx.amount
    }</td>
            <td><button class="button">Download</button></td>
        </tr>`;
    tbody.innerHTML += row;
  });
}

filterTransactions("all");

function toggleDetails(id) {
  const details = document.getElementById(`details-${id}`);
  details.style.display = details.style.display === "none" ? "block" : "none";
}

// Function to toggle loan details
function toggleDetails(id) {
  const details = document.getElementById(`details-${id}`);
  if (details) {
    details.style.display = details.style.display === "none" ? "block" : "none";
  }
}

// Attach click event listeners to loan cards
document.addEventListener("DOMContentLoaded", function () {
  const loanCards = document.querySelectorAll(".loan-card");

  loanCards.forEach((card) => {
    card.addEventListener("click", function () {
      const details = this.querySelector(".loan-details");

      if (details) {
        details.classList.toggle("hidden"); // Toggle visibility
      }
    });
  });
});

// Function to fetch user profile data
function getUserProfile() {
  fetch("/api/user/profile")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return response.json();
    })
    .then((data) => {
      console.log("User Profile:", data);
      // Here you can update the UI with user data
      // displayUserProfile(data);
    })
    .catch((error) => {
      console.error("Error fetching user profile:", error);
    });
}

// Function to fetch user holdings
function getUserHoldings() {
  fetch("/api/user/holdings")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user holdings");
      }
      return response.json();
    })
    .then((data) => {
      console.log("User Holdings:", data);
      // Here you can update the UI with holdings data
      displayUserHoldings(data);
    })
    .catch((error) => {
      console.error("Error fetching user holdings:", error);
    });
}

// Function to fetch user loans
function getUserLoans() {
  fetch("/api/user/loans")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user loans");
      }
      return response.json();
    })
    .then((data) => {
      console.log("User Loans:", data);
      // Here you can update the UI with loans data
      displayUserLoans(data);
    })
    .catch((error) => {
      console.error("Error fetching user loans:", error);
    });
}

// Function to fetch user transactions
function getUserTransactions(limit = 10) {
  fetch(`/api/user/transactions?limit=${limit}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user transactions");
      }
      return response.json();
    })
    .then((data) => {
      console.log("User Transactions:", data);
      // Here you can update the UI with transaction data
      displayUserTransactions(data);
    })
    .catch((error) => {
      console.error("Error fetching user transactions:", error);
    });
}

// Update the displayUserHoldings function to target specific HTML elements
function displayUserHoldings(response) {
  // Check if the response has the expected structure
  if (response && response.status === "success" && response.data) {
    const data = response.data;

    // Format currency values
    const formatCurrency = (value) => {
      // Convert string to number and format as currency
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(parseFloat(value));
    };

    // Update Income card
    const incomeElement = document.querySelector(".card.income .amount");
    if (incomeElement) {
      incomeElement.textContent = formatCurrency(data.income);
    }

    // Update Expense card
    const expenseElement = document.querySelector(".card.expense .amount");
    if (expenseElement) {
      expenseElement.textContent = formatCurrency(data.expense);
    }

    // Update Total Saving card
    const savingElement = document.querySelector(".card.saving .amount");
    if (savingElement) {
      savingElement.textContent = formatCurrency(data.savings_account_balance);
    }

    // Optional: You can also update the total balance elsewhere if needed
    const totalBalanceElement = document.getElementById("total-balance");
    if (totalBalanceElement) {
      totalBalanceElement.textContent = formatCurrency(data.total_balance);
    }

    // Optional: Update last updated timestamp
    const lastUpdatedElement = document.getElementById("last-updated");
    if (lastUpdatedElement) {
      const date = new Date(data.last_updated);
      lastUpdatedElement.textContent = `Last updated: ${date.toLocaleString()}`;
    }
  } else {
    console.error("Invalid response format for user holdings:", response);
  }
}

// Function to display user loans
function displayUserLoans(response) {
  // Check if the response has the expected structure
  if (
    response &&
    response.status === "success" &&
    Array.isArray(response.data)
  ) {
    const loans = response.data;
    const loanContainer = document.getElementById("loan-list");

    // Keep the heading and clear the rest of the content
    const heading = loanContainer.querySelector("h2");
    loanContainer.innerHTML = "";

    // Add the heading back
    loanContainer.appendChild(heading);

    // Format currency values
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(parseFloat(value));
    };

    // Format date to a readable format
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    };

    // If no loans, display a message
    if (loans.length === 0) {
      const noLoansMessage = document.createElement("p");
      noLoansMessage.className = "no-loans-message";
      noLoansMessage.textContent = "You have no active loans.";
      loanContainer.appendChild(noLoansMessage);
      return;
    }

    // Create loan cards for each loan
    loans.forEach((loan, index) => {
      // Create loan card
      const loanCard = document.createElement("div");
      loanCard.className = "loan-card account-item";
      loanCard.setAttribute("onclick", `toggleDetails(${loan.id})`);

      // Create loan title
      const loanTitle = document.createElement("h3");
      loanTitle.textContent = loan.loan_type;

      // Create loan summary
      const loanSummary = document.createElement("p");
      loanSummary.textContent = `Principal: ${formatCurrency(
        loan.principal_amount
      )} | Balance: ${formatCurrency(loan.remaining_balance)}`;

      // Create loan date
      const loanDate = document.createElement("p");
      loanDate.textContent = `Loan Taken On: ${formatDate(loan.loan_taken_on)}`;

      // Create loan status
      const loanStatus = document.createElement("p");
      loanStatus.className = `status ${loan.status.toLowerCase()}`;
      loanStatus.textContent = loan.status;

      // Create loan details container
      const detailsContainer = document.createElement("div");
      detailsContainer.className = "details";
      detailsContainer.id = `details-${loan.id}`;

      // Add loan details
      const interestRate = document.createElement("p");
      interestRate.textContent = `Interest Rate: ${loan.interest_rate}%`;
      detailsContainer.appendChild(interestRate);

      const loanTerm = document.createElement("p");
      loanTerm.textContent = `Loan Term: ${loan.loan_term} Years`;
      detailsContainer.appendChild(loanTerm);

      const emi = document.createElement("p");
      emi.textContent = `EMI: ${formatCurrency(loan.emi_amount)}/month`;
      detailsContainer.appendChild(emi);

      // Add next payment due date if the loan is not paid
      if (loan.status !== "Paid") {
        const nextPayment = document.createElement("p");
        nextPayment.textContent = `Next Payment Due: ${formatDate(
          loan.next_payment_due
        )}`;
        detailsContainer.appendChild(nextPayment);
      } else {
        const paidInFull = document.createElement("p");
        paidInFull.textContent = "Paid in Full";
        detailsContainer.appendChild(paidInFull);
      }

      const totalPaid = document.createElement("p");
      totalPaid.textContent = `Total Paid: ${formatCurrency(loan.total_paid)}`;
      detailsContainer.appendChild(totalPaid);

      // If loan is overdue, add late payment fee message
      if (loan.status === "Overdue") {
        const lateFee = document.createElement("p");
        lateFee.textContent = "Late Payment Fee Applied";
        detailsContainer.appendChild(lateFee);
      }

      // Assemble the loan card
      loanCard.appendChild(loanTitle);
      loanCard.appendChild(loanSummary);
      loanCard.appendChild(loanDate);
      loanCard.appendChild(loanStatus);
      loanCard.appendChild(detailsContainer);

      // Add the loan card to the container
      loanContainer.appendChild(loanCard);
    });
  } else {
    console.error("Invalid response format for user loans:", response);
  }
}

// Function to display user transactions
function displayUserTransactions(response) {
  // Check if the response has the expected structure
  if (
    response &&
    response.status === "success" &&
    Array.isArray(response.data)
  ) {
    const transactions = response.data;
    const transactionBody = document.getElementById("transaction-body");

    // Clear existing transactions
    transactionBody.innerHTML = "";

    // Format currency values
    const formatCurrency = (value) => {
      const amount = parseFloat(value);
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Math.abs(amount)); // Use absolute value for display
    };

    // Format date to a readable format
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "short", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    };

    // Add data-type attribute to each row for filtering
    transactions.forEach((transaction) => {
      const row = document.createElement("tr");
      // Add data-type attribute for filtering
      const amount = parseFloat(transaction.amount);
      const transactionType = amount >= 0 ? "income" : "expense";
      row.setAttribute("data-type", transactionType);

      // Description column
      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = transaction.description;
      row.appendChild(descriptionCell);

      // Type column
      const typeCell = document.createElement("td");
      typeCell.textContent = transaction.type;
      row.appendChild(typeCell);

      // Date column
      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(transaction.transaction_datetime);
      row.appendChild(dateCell);

      // Amount column with bold and colored text
      const amountCell = document.createElement("td");

      if (amount >= 0) {
        // Green and bold for positive amounts
        amountCell.style.color = "#00A86B"; // Green color
        amountCell.style.fontWeight = "bold";
        amountCell.textContent = `+ ${formatCurrency(transaction.amount)}`;
      } else {
        // Red and bold for negative amounts
        amountCell.style.color = "#FF3B30"; // Red color
        amountCell.style.fontWeight = "bold";
        amountCell.textContent = `- ${formatCurrency(transaction.amount)}`;
      }

      row.appendChild(amountCell);

      //   // Receipt column (with view receipt button if needed)
      //   const receiptCell = document.createElement("td");
      //   const viewButton = document.createElement("button");
      //   viewButton.className = "view-receipt";
      //   viewButton.textContent = "View";
      //   viewButton.onclick = function () {
      //     viewReceipt(transaction.id);
      //     return false; // Prevent event bubbling
      //   };
      //   receiptCell.appendChild(viewButton);
      //   row.appendChild(receiptCell);

      // Add the row to the table
      transactionBody.appendChild(row);
    });

    // If no transactions, display a message
    if (transactions.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.textContent = "No transactions found.";
      cell.style.textAlign = "center";
      row.appendChild(cell);
      transactionBody.appendChild(row);
    }
  } else {
    console.error("Invalid response format for user transactions:", response);
  }
}

// Add filter function for transaction tabs
function filterTransactions(type) {
  // Update active tab
  const tabs = document.querySelectorAll(".tabs .tab");
  tabs.forEach((tab) => {
    tab.classList.remove("active");
    if (tab.textContent.toLowerCase().includes(type)) {
      tab.classList.add("active");
    }
  });

  // Filter transactions
  const rows = document.querySelectorAll("#transaction-body tr");
  rows.forEach((row) => {
    if (type === "all" || row.getAttribute("data-type") === type) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Initialize account page
function initAccountPage() {
  getUserProfile();
  getUserHoldings();
  getUserLoans();
  getUserTransactions();
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", initAccountPage);

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the accounts page (containing invoices)
  if (document.querySelector(".invoice-container")) {
    fetchInvoices();
  }
});

// Function to fetch invoices from the server
async function fetchInvoices() {
  try {
    const response = await fetch("/api/invoices");

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch invoices");
    }

    const data = await response.json();

    if (data.status === "success") {
      renderInvoices(data.data);
    } else {
      showError("Error loading invoices");
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
    showError(error.message);
  }
}

// Function to render invoices in the DOM
function renderInvoices(invoices) {
  const container = document.querySelector(".invoice-container");

  // Clear existing content
  container.innerHTML = "";

  if (invoices.length === 0) {
    container.innerHTML = '<p class="no-invoices">No invoices found</p>';
    return;
  }

  // Create and append invoice elements
  invoices.forEach((invoice) => {
    const invoiceElement = document.createElement("div");
    invoiceElement.className = "invoice";
    invoiceElement.innerHTML = `
      <p class="name">${escapeHTML(invoice.storeName)}</p>
      <p class="time">${escapeHTML(invoice.timeAgo)}</p>
      <p class="amount">$${formatAmount(invoice.amount)}</p>
    `;

    // Add click event if you want to show invoice details
    invoiceElement.addEventListener("click", () => {
      showInvoiceDetails(invoice.id);
    });

    container.appendChild(invoiceElement);
  });
}

// Helper function to format the amount
function formatAmount(amount) {
  return parseFloat(amount).toFixed(2);
}

// Helper function to escape HTML to prevent XSS
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Function to show invoice details (if needed)
function showInvoiceDetails(invoiceId) {
  // You could fetch and display detailed invoice information here
  console.log(`Showing details for invoice ${invoiceId}`);
  // Implement as needed
}

// Function to show error messages
function showError(message) {
  const container = document.querySelector(".invoice-container");
  container.innerHTML = `<p class="error-message">${escapeHTML(message)}</p>`;
}
