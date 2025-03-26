// Chat functionality
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const chatTitle = document.getElementById("chat-title");
const tabItems = document.querySelectorAll(".tab-item");
const sectionCards = document.querySelectorAll(".section-card");

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

document.addEventListener("DOMContentLoaded", function () {
  const tabItems = document.querySelectorAll(".tab-item");
  const chatMessages = document.getElementById("chat-messages");

  tabItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all tabs
      tabItems.forEach((tab) => tab.classList.remove("active"));
      // Add active class to clicked tab
      this.classList.add("active");

      const section = this.getAttribute("data-section");

      // Clear chat messages
      chatMessages.innerHTML = "";

      // Load appropriate content based on section
      if (section === "financial-planning") {
        loadFinancialPlanningInputs();
      } else if (section === "welcome") {
        loadWelcomeMessage();
      }
      // Add other sections as needed
    });
  });

  // Event listener for the toggle
  document
    .getElementById("variable-costs-toggle")
    .addEventListener("change", function () {
      const variableCostsContainer = document.getElementById(
        "variable-costs-container"
      );
      if (this.checked) {
        variableCostsContainer.classList.remove("hidden");
      } else {
        variableCostsContainer.classList.add("hidden");
      }
    });

  document.addEventListener("DOMContentLoaded", function () {
    // Get the calculate button
    const calculateButton = document.getElementById("calculate-summary");

    if (calculateButton) {
      calculateButton.addEventListener("click", function () {
        // Get input values
        const monthlyIncome =
          parseFloat(document.getElementById("monthly-income").value) || 0;
        const outingExpenses =
          parseFloat(document.getElementById("outing-expenses").value) || 0;
        const transportationCosts =
          parseFloat(document.getElementById("transportation-costs").value) ||
          0;
        const fixedCosts =
          parseFloat(document.getElementById("fixed-costs").value) || 0;
        const foodCosts =
          parseFloat(document.getElementById("food-costs").value) || 0;
        const availableSavings =
          parseFloat(document.getElementById("available-savings").value) || 0;

        // Calculate totals
        const monthlyExpenses =
          outingExpenses + transportationCosts + fixedCosts + foodCosts;
        const monthlyInvestmentCapacity = monthlyIncome - monthlyExpenses;
        const yearlyIncome = monthlyIncome * 12;
        const yearlyExpenses = monthlyExpenses * 12;
        const yearlyInvestmentCapacity = monthlyInvestmentCapacity * 12;

        // Create expense breakdown for pie chart
        const expenseBreakdown = {
          Outing: outingExpenses,
          Transportation: transportationCosts,
          "Fixed Costs": fixedCosts,
          Food: foodCosts,
        };

        // Display financial summary
        const financialPlanningContent = document.getElementById(
          "financial-planning-content"
        );

        // Check if summary already exists and remove it
        const existingSummary = document.getElementById(
          "financial-summary-container"
        );
        if (existingSummary) {
          existingSummary.remove();
        }

        // Create new summary
        const summaryContainer = document.createElement("div");
        summaryContainer.id = "financial-summary-container";
        summaryContainer.className = "financial-summary-container";

        summaryContainer.innerHTML = `
              <div class="financial-summary">
                <h2>Financial Summary</h2>
                
                <div class="summary-grid">
                  <div class="summary-card">
                    <h3>Monthly Income</h3>
                    <p class="amount">₹${monthlyIncome.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</p>
                  </div>
                  
                  <div class="summary-card">
                    <h3>Monthly Expenses</h3>
                    <p class="amount">₹${monthlyExpenses.toLocaleString(
                      "en-IN",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}</p>
                  </div>
                  
                  <div class="summary-card ${
                    monthlyInvestmentCapacity >= 0 ? "positive" : "negative"
                  }">
                    <h3>Monthly Investment Capacity</h3>
                    <p class="amount">₹${monthlyInvestmentCapacity.toLocaleString(
                      "en-IN",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}</p>
                  </div>
                  
                  <div class="summary-card">
                    <h3>Yearly Income</h3>
                    <p class="amount">₹${yearlyIncome.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</p>
                  </div>
                  
                  <div class="summary-card">
                    <h3>Yearly Expenses</h3>
                    <p class="amount">₹${yearlyExpenses.toLocaleString(
                      "en-IN",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}</p>
                  </div>
                  
                  <div class="summary-card ${
                    yearlyInvestmentCapacity >= 0 ? "positive" : "negative"
                  }">
                    <h3>Yearly Investment Capacity</h3>
                    <p class="amount">₹${yearlyInvestmentCapacity.toLocaleString(
                      "en-IN",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}</p>
                  </div>
                </div>
                
                <div class="charts-container">
                  <div class="chart bar-chart-container">
                    <h3>Income, Expenses and Investment Capacity</h3>
                    <canvas id="financialBarChart"></canvas>
                  </div>
                  
                  <div class="chart pie-chart-container">
                    <h3>Expense Distribution</h3>
                    <canvas id="expensePieChart"></canvas>
                  </div>
                </div>
                
                <div class="recommendation-container">
                  <h3>Financial Recommendations</h3>
                  <div class="recommendation-content">
                    ${generateRecommendations(
                      monthlyIncome,
                      monthlyExpenses,
                      monthlyInvestmentCapacity
                    )}
                  </div>
                </div>
              </div>
            `;

        financialPlanningContent.appendChild(summaryContainer);

        // Create charts
        createBarChart(
          monthlyIncome,
          monthlyExpenses,
          monthlyInvestmentCapacity
        );
        createPieChart(expenseBreakdown);

        // Scroll to the summary
        summaryContainer.scrollIntoView({ behavior: "smooth" });
        calculateFinancialSummary();
      });
    } else {
      console.error("Calculate summary button not found in the DOM");
    }

    // Function to generate recommendations based on financial data
    function generateRecommendations(income, expenses, investmentCapacity) {
      let recommendations = "";

      if (investmentCapacity < 0) {
        recommendations += `<p class="recommendation warning">Your expenses exceed your income by ₹${Math.abs(
          investmentCapacity
        ).toFixed(
          2
        )} per month. Consider reducing expenses in non-essential categories.</p>`;
      } else if (investmentCapacity < income * 0.2) {
        recommendations += `<p class="recommendation caution">Your savings rate is ${(
          (investmentCapacity / income) *
          100
        ).toFixed(
          1
        )}%, which is below the recommended 20% threshold. Try to increase your savings if possible.</p>`;
      } else {
        recommendations += `<p class="recommendation positive">Excellent! You're saving ${(
          (investmentCapacity / income) *
          100
        ).toFixed(
          1
        )}% of your income, which is above the recommended threshold.</p>`;
      }

      // Add investment suggestion
      if (investmentCapacity > 0) {
        recommendations += `
              <p class="recommendation">Based on your monthly investment capacity of ₹${investmentCapacity.toFixed(
                2
              )}, we recommend:</p>
              <ul>
                <li>Emergency Fund: ₹${(investmentCapacity * 0.3).toFixed(
                  2
                )} (30%)</li>
                <li>Retirement: ₹${(investmentCapacity * 0.4).toFixed(
                  2
                )} (40%)</li>
                <li>Short-term Goals: ₹${(investmentCapacity * 0.2).toFixed(
                  2
                )} (20%)</li>
                <li>Discretionary: ₹${(investmentCapacity * 0.1).toFixed(
                  2
                )} (10%)</li>
              </ul>
            `;
      }

      return recommendations;
    }

    // Function to create the bar chart
    function createBarChart(income, expenses, investmentCapacity) {
      const ctx = document.getElementById("financialBarChart").getContext("2d");

      // Import Chart.js from CDN if not already loaded
      if (typeof Chart === "undefined") {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js";
        script.onload = () => initBarChart();
        document.head.appendChild(script);
      } else {
        initBarChart();
      }

      function initBarChart() {
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Monthly Finances"],
            datasets: [
              {
                label: "Income",
                data: [income],
                backgroundColor: "rgba(75, 192, 192, 0.7)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "Expenses",
                data: [expenses],
                backgroundColor: "rgba(255, 99, 132, 0.7)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
              {
                label: "Investment Capacity",
                data: [investmentCapacity],
                type: "line",
                fill: false,
                borderColor: "rgba(54, 162, 235, 1)",
                tension: 0.1,
                borderWidth: 3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Amount (₹)",
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: "Monthly Financial Overview",
              },
              legend: {
                position: "top",
              },
            },
          },
        });
      }
    }

    // Function to create the pie chart
    function createPieChart(expenseBreakdown) {
      const ctx = document.getElementById("expensePieChart").getContext("2d");

      // Import Chart.js from CDN if not already loaded
      if (typeof Chart === "undefined") {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js";
        script.onload = () => initPieChart();
        document.head.appendChild(script);
      } else {
        initPieChart();
      }

      function initPieChart() {
        const labels = Object.keys(expenseBreakdown);
        const data = Object.values(expenseBreakdown);

        new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(54, 162, 235, 0.7)",
                  "rgba(255, 206, 86, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(153, 102, 255, 0.7)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Monthly Expense Distribution",
              },
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || "";
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce(
                      (a, b) => a + b,
                      0
                    );
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ₹${value.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} (${percentage}%)`;
                  },
                },
              },
            },
          },
        });
      }
    }
  });

  function loadWelcomeMessage() {
    // Add click event to section cards
    const sectionCards = document.querySelectorAll(".section-card");
    sectionCards.forEach((card) => {
      card.addEventListener("click", function () {
        const section = this.getAttribute("data-section");
        // Find the corresponding tab and click it
        document
          .querySelector(`.tab-item[data-section="INR{section}"]`)
          .click();
      });
    });
  }

  // Initialize welcome message on page load
  loadWelcomeMessage();
});

function calculateFinancialSummary() {
  console.log("Calculating financial summary");

  // Get input values with error checking
  const monthlyIncome = parseFloat(
    document.getElementById("monthly-income")?.value || 0
  );
  const outingExpenses = parseFloat(
    document.getElementById("outing-expenses")?.value || 0
  );
  const transportationCosts = parseFloat(
    document.getElementById("transportation-costs")?.value || 0
  );
  const fixedCosts = parseFloat(
    document.getElementById("fixed-costs")?.value || 0
  );
  const foodCosts = parseFloat(
    document.getElementById("food-costs")?.value || 0
  );

  // Calculate totals
  const totalExpenses =
    outingExpenses + transportationCosts + fixedCosts + foodCosts;
  const monthlyBalance = monthlyIncome - totalExpenses;
  const annualSavings = monthlyBalance * 12;

  // Create results container if it doesn't exist
  let resultsContainer = document.getElementById("financial-results");
  if (!resultsContainer) {
    resultsContainer = document.createElement("div");
    resultsContainer.id = "financial-results";
    resultsContainer.className = "financial-summary";

    // Find the container where we should insert the results
    const targetContainer = document.getElementById(
      "financial-planning-content"
    );
    if (targetContainer) {
      targetContainer.appendChild(resultsContainer);
    } else {
      // If the main container isn't found, insert after the form
      const form =
        document.getElementById("monthly-income")?.closest("form") ||
        document.getElementById("monthly-income")?.closest("div");
      if (form && form.parentNode) {
        form.parentNode.insertBefore(resultsContainer, form.nextSibling);
      } else {
        // Last resort: append to body
        document.body.appendChild(resultsContainer);
      }
    }
  }

  // Update results with fresh content
  resultsContainer.innerHTML = `
      <h2>Your Financial Summary</h2>
      <div class="summary-card">
        <div class="summary-results">
          <div class="result-item">
            <h3>Monthly Income</h3>
            <p class="amount">₹${monthlyIncome.toLocaleString("en-IN")}</p>
          </div>
          <div class="result-item">
            <h3>Total Monthly Expenses</h3>
            <p class="amount">₹${totalExpenses.toLocaleString("en-IN")}</p>
          </div>
          <div class="result-item ${
            monthlyBalance >= 0 ? "positive" : "negative"
          }">
            <h3>Monthly Balance</h3>
            <p class="amount">₹${monthlyBalance.toLocaleString("en-IN")}</p>
          </div>
          <div class="result-item ${
            annualSavings >= 0 ? "positive" : "negative"
          }">
            <h3>Annual Savings Potential</h3>
            <p class="amount">₹${annualSavings.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div class="emergency-status">
          <h3>Emergency Fund Status</h3>
          <p class="${
            monthlyBalance < 0
              ? "critical"
              : monthlyBalance < monthlyIncome * 0.2
              ? "warning"
              : "good"
          }">
            ${
              monthlyBalance < 0
                ? "Critical - Expenses exceed income"
                : monthlyBalance < monthlyIncome * 0.2
                ? "Warning - Save more for emergencies"
                : "Good - You're saving enough"
            }
          </p>
        </div>
        <div class="recommendations">
          <h3>Recommendations</h3>
          ${
            monthlyBalance < 0
              ? `<p>You're spending more than you earn. Consider reducing expenses in these categories:</p>
             <ul>
               <li>Outings: ₹${outingExpenses.toLocaleString("en-IN")}</li>
               <li>Transportation: ₹${transportationCosts.toLocaleString(
                 "en-IN"
               )}</li>
               <li>Fixed Costs: ₹${fixedCosts.toLocaleString("en-IN")}</li>
               <li>Food: ₹${foodCosts.toLocaleString("en-IN")}</li>
             </ul>`
              : `<p>Based on your monthly balance of ₹${monthlyBalance.toLocaleString(
                  "en-IN"
                )}, we recommend:</p>
             <ul>
               <li>Emergency Fund: ₹${(monthlyBalance * 0.3).toLocaleString(
                 "en-IN"
               )} (30%)</li>
               <li>Retirement: ₹${(monthlyBalance * 0.4).toLocaleString(
                 "en-IN"
               )} (40%)</li>
               <li>Short-term Goals: ₹${(monthlyBalance * 0.2).toLocaleString(
                 "en-IN"
               )} (20%)</li>
               <li>Discretionary: ₹${(monthlyBalance * 0.1).toLocaleString(
                 "en-IN"
               )} (10%)</li>
             </ul>`
          }
        </div>
      </div>
    `;

  // Add some basic styling
  const style = document.createElement("style");
  style.textContent = `
      .financial-summary {
        margin: 20px 0;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .summary-card {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .summary-results {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
      }
      .result-item {
        padding: 10px;
        background-color: #fff;
        border-radius: 6px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      .amount {
        font-size: 1.2em;
        font-weight: bold;
      }
      .positive .amount {
        color: green;
      }
      .negative .amount {
        color: red;
      }
      .emergency-status p {
        padding: 8px;
        border-radius: 4px;
      }
      .critical {
        background-color: #ffebee;
        color: #c62828;
      }
      .warning {
        background-color: #fff8e1;
        color: #f57f17;
      }
      .good {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
    `;
  document.head.appendChild(style);

  // Scroll to the results
  resultsContainer.scrollIntoView({ behavior: "smooth" });

  console.log("DOM updated successfully");
}

document.addEventListener("DOMContentLoaded", function () {
  // Tab navigation functionality
  const tabItems = document.querySelectorAll(".tab-item");
  const sectionCards = document.querySelectorAll(".section-card");
  const sections = document.querySelectorAll(".section-content");
  const chatTitle = document.getElementById("chat-title");

  // Function to activate a section
  function activateSection(sectionId) {
    // Update active tab
    tabItems.forEach((tab) => {
      if (tab.dataset.section === sectionId) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Show active section content
    sections.forEach((section) => {
      if (section.id === sectionId + "-content") {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });

    // Update chat title
    switch (sectionId) {
      case "welcome":
        chatTitle.textContent = "DRAKZ Financial Assistant";
        break;
      case "financial-planning":
        chatTitle.textContent = "Financial Planning";
        break;
      case "stock-analysis":
        chatTitle.textContent = "Stock Analysis";
        break;
      case "investment":
        chatTitle.textContent = "Investment Recommendations";
        break;
      case "advisor":
        chatTitle.textContent = "Financial Advisor";
        break;
    }
  }

  // Set up click events for tabs
  tabItems.forEach((tab) => {
    tab.addEventListener("click", function () {
      const section = this.dataset.section;
      activateSection(section);
    });
  });

  // Set up click events for section cards
  sectionCards.forEach((card) => {
    card.addEventListener("click", function () {
      const section = this.dataset.section;
      activateSection(section);
    });
  });

  // Get stock details button functionality
  const getStockButton = document.getElementById("get-stock-details");
  const stockSymbolInput = document.getElementById("stock-symbol");

  if (getStockButton) {
    getStockButton.addEventListener("click", function () {
      const symbol = stockSymbolInput.value.trim().toUpperCase();
      if (symbol) {
        // This is where you would typically fetch real stock data
        // For now, we'll just display the sample data that's already in the HTML
        console.log(`Getting stock details for: ${symbol}`);
        // Update any elements with the stock symbol
        const companyInfoTitle = document.querySelector(".company-info h3");
        if (companyInfoTitle) {
          companyInfoTitle.textContent = `Company Information (${symbol})`;
        }
      } else {
        alert("Please enter a valid stock symbol");
      }
    });
  }
});

// Sidebar functions
function closeNav() {
  document.getElementById("mySidebar").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", function () {
  // Chat functionality
  const messagesContainer = document.querySelector(".messages-container");
  const textarea = document.querySelector(".input-area textarea");
  const sendButton = document.querySelector(".input-area .send-btn");

  // Scroll to bottom of messages on load
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Function to add a new message
    function addMessage(text, isUser = false) {
      const messageDiv = document.createElement("div");
      messageDiv.className = isUser ? "message user" : "message bot";
      messageDiv.textContent = text;
      messagesContainer.appendChild(messageDiv);

      // Scroll to the bottom after adding a message
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Send message when the send button is clicked
    if (sendButton && textarea) {
      sendButton.addEventListener("click", function () {
        const text = textarea.value.trim();
        if (text) {
          addMessage(text, true);
          textarea.value = "";

          // Simulate a bot response after a short delay
          setTimeout(() => {
            addMessage(
              "Thanks for your message! This is a simulated response."
            );
          }, 1000);
        }
      });

      // Send message when Enter is pressed (without Shift)
      textarea.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendButton.click();
        }
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");

  // Try to find the button using different possible selectors
  const calculateButton =
    document.getElementById("calculate-summary") ||
    document.querySelector("button#calculate-summary") ||
    document.querySelector("button.calculate-summary") ||
    document.querySelector("[data-action='calculate-summary']");

  console.log("Calculate button found:", calculateButton);

  if (calculateButton) {
    // Remove any existing event listeners by cloning the button
    const newButton = calculateButton.cloneNode(true);
    calculateButton.parentNode.replaceChild(newButton, calculateButton);

    // Add new event listener
    newButton.addEventListener("click", function () {
      console.log("Calculate button clicked");
      calculateFinancialSummary();
    });
  } else {
    console.error("Calculate button not found - add this HTML if missing:");
    console.error(
      '<button id="calculate-summary" class="btn primary-btn">Calculate Financial Summary</button>'
    );
  }

  // Define the function to calculate summary
  function calculateFinancialSummary() {
    console.log("Calculating financial summary");

    // Get input values with error checking
    const monthlyIncome = parseFloat(
      document.getElementById("monthly-income")?.value || 0
    );
    const outingExpenses = parseFloat(
      document.getElementById("outing-expenses")?.value || 0
    );
    const transportationCosts = parseFloat(
      document.getElementById("transportation-costs")?.value || 0
    );
    const fixedCosts = parseFloat(
      document.getElementById("fixed-costs")?.value || 0
    );
    const foodCosts = parseFloat(
      document.getElementById("food-costs")?.value || 0
    );

    console.log("Values retrieved:", {
      monthlyIncome,
      outingExpenses,
      transportationCosts,
      fixedCosts,
      foodCosts,
    });

    // Calculate totals
    const totalExpenses =
      outingExpenses + transportationCosts + fixedCosts + foodCosts;
    const monthlyBalance = monthlyIncome - totalExpenses;
    const annualSavings = monthlyBalance * 12;

    console.log("Calculations complete:", {
      totalExpenses,
      monthlyBalance,
      annualSavings,
    });

    // Update DOM elements if they exist
    const monthlyBalanceEl = document.getElementById("monthly-balance");
    if (monthlyBalanceEl)
      monthlyBalanceEl.textContent = monthlyBalance.toFixed(2);

    const annualSavingsEl = document.getElementById("annual-savings");
    if (annualSavingsEl) annualSavingsEl.textContent = annualSavings.toFixed(2);

    const emergencyStatusEl = document.getElementById("emergency-status");
    if (emergencyStatusEl) {
      if (monthlyBalance < 0) {
        emergencyStatusEl.textContent = "Critical - Expenses exceed income";
        emergencyStatusEl.style.color = "var(--danger-color, red)";
      } else if (monthlyBalance < monthlyIncome * 0.2) {
        emergencyStatusEl.textContent = "Warning - Save more for emergencies";
        emergencyStatusEl.style.color = "var(--warning-color, orange)";
      } else {
        emergencyStatusEl.textContent = "Good - You're saving enough";
        emergencyStatusEl.style.color = "var(--success-color, green)";
      }
    }

    console.log("DOM updated successfully");
  }
});

//

// Add this code at the end of your JS file

// Create a standalone function that directly manipulates the DOM
function showFinancialSummary() {
  console.log("Creating financial summary display");

  // Get input values
  const monthlyIncome = parseFloat(
    document.getElementById("monthly-income")?.value || 0
  );
  const outingExpenses = parseFloat(
    document.getElementById("outing-expenses")?.value || 0
  );
  const transportationCosts = parseFloat(
    document.getElementById("transportation-costs")?.value || 0
  );
  const fixedCosts = parseFloat(
    document.getElementById("fixed-costs")?.value || 0
  );
  const foodCosts = parseFloat(
    document.getElementById("food-costs")?.value || 0
  );

  // Calculate totals
  const totalExpenses =
    outingExpenses + transportationCosts + fixedCosts + foodCosts;
  const monthlyBalance = monthlyIncome - totalExpenses;
  const annualSavings = monthlyBalance * 12;

  // First, create a modal container
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0,0,0,0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "9999";

  // Create the results container inside the modal
  const resultsContainer = document.createElement("div");
  resultsContainer.style.backgroundColor = "white";
  resultsContainer.style.padding = "20px";
  resultsContainer.style.borderRadius = "8px";
  resultsContainer.style.maxWidth = "800px";
  resultsContainer.style.width = "90%";
  resultsContainer.style.maxHeight = "90vh";
  resultsContainer.style.overflow = "auto";
  resultsContainer.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";

  // Create the close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "✕";
  closeButton.style.float = "right";
  closeButton.style.border = "none";
  closeButton.style.background = "none";
  closeButton.style.fontSize = "20px";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = function () {
    document.body.removeChild(modal);
  };

  // Fill the results container with content
  resultsContainer.innerHTML = `
      <h2 style="margin-top: 0; color: #333;">Your Financial Summary</h2>
      ${closeButton.outerHTML}
      <div style="clear: both;"></div>
      
      <div style="margin: 20px 0;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div style="padding: 15px; background-color: #f5f5f5; border-radius: 6px;">
            <h3 style="margin-top: 0; color: #444;">Monthly Income</h3>
            <p style="font-size: 1.2em; font-weight: bold;">₹${monthlyIncome.toLocaleString(
              "en-IN"
            )}</p>
          </div>
          
          <div style="padding: 15px; background-color: #f5f5f5; border-radius: 6px;">
            <h3 style="margin-top: 0; color: #444;">Total Monthly Expenses</h3>
            <p style="font-size: 1.2em; font-weight: bold;">₹${totalExpenses.toLocaleString(
              "en-IN"
            )}</p>
          </div>
          
          <div style="padding: 15px; background-color: #f5f5f5; border-radius: 6px;">
            <h3 style="margin-top: 0; color: #444;">Monthly Balance</h3>
            <p style="font-size: 1.2em; font-weight: bold; color: ${
              monthlyBalance >= 0 ? "green" : "red"
            };">
              ₹${monthlyBalance.toLocaleString("en-IN")}
            </p>
          </div>
          
          <div style="padding: 15px; background-color: #f5f5f5; border-radius: 6px;">
            <h3 style="margin-top: 0; color: #444;">Annual Savings Potential</h3>
            <p style="font-size: 1.2em; font-weight: bold; color: ${
              annualSavings >= 0 ? "green" : "red"
            };">
              ₹${annualSavings.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 6px;">
          <h3 style="margin-top: 0; color: #444;">Emergency Fund Status</h3>
          <p style="padding: 8px; border-radius: 4px; 
            background-color: ${
              monthlyBalance < 0
                ? "#ffebee"
                : monthlyBalance < monthlyIncome * 0.2
                ? "#fff8e1"
                : "#e8f5e9"
            }; 
            color: ${
              monthlyBalance < 0
                ? "#c62828"
                : monthlyBalance < monthlyIncome * 0.2
                ? "#f57f17"
                : "#2e7d32"
            };">
            ${
              monthlyBalance < 0
                ? "Critical - Expenses exceed income"
                : monthlyBalance < monthlyIncome * 0.2
                ? "Warning - Save more for emergencies"
                : "Good - You're saving enough"
            }
          </p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 6px;">
          <h3 style="margin-top: 0; color: #444;">Recommendations</h3>
          ${
            monthlyBalance < 0
              ? `<p>You're spending more than you earn. Consider reducing expenses in these categories:</p>
               <ul>
                 <li>Outings: ₹${outingExpenses.toLocaleString("en-IN")}</li>
                 <li>Transportation: ₹${transportationCosts.toLocaleString(
                   "en-IN"
                 )}</li>
                 <li>Fixed Costs: ₹${fixedCosts.toLocaleString("en-IN")}</li>
                 <li>Food: ₹${foodCosts.toLocaleString("en-IN")}</li>
               </ul>`
              : `<p>Based on your monthly balance of ₹${monthlyBalance.toLocaleString(
                  "en-IN"
                )}, we recommend:</p>
               <ul>
                 <li>Emergency Fund: ₹${(monthlyBalance * 0.3).toLocaleString(
                   "en-IN"
                 )} (30%)</li>
                 <li>Retirement: ₹${(monthlyBalance * 0.4).toLocaleString(
                   "en-IN"
                 )} (40%)</li>
                 <li>Short-term Goals: ₹${(monthlyBalance * 0.2).toLocaleString(
                   "en-IN"
                 )} (20%)</li>
                 <li>Discretionary: ₹${(monthlyBalance * 0.1).toLocaleString(
                   "en-IN"
                 )} (10%)</li>
               </ul>`
          }
        </div>
      </div>
    `;

  // Add everything to the DOM
  modal.appendChild(resultsContainer);
  document.body.appendChild(modal);

  // Allow clicking outside the modal to close it
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      document.body.removeChild(modal);
    }
  });

  console.log("Financial summary modal created and displayed");
}

// Add a new button to the page that will show the summary
document.addEventListener("DOMContentLoaded", function () {
  // Find the calculate button
  const calculateButton = document.getElementById("calculate-summary");

  if (calculateButton) {
    // Override its click event
    calculateButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      console.log("Calculate button clicked, showing modal");
      showFinancialSummary();
    });
  } else {
    // If no button exists, create one
    console.log("Creating new calculate button");
    const inputContainer = document
      .getElementById("monthly-income")
      ?.closest("div");

    if (inputContainer) {
      const newButton = document.createElement("button");
      newButton.id = "new-calculate-button";
      newButton.textContent = "Calculate Financial Summary";
      newButton.style.backgroundColor = "#4CAF50";
      newButton.style.color = "white";
      newButton.style.padding = "10px 15px";
      newButton.style.border = "none";
      newButton.style.borderRadius = "4px";
      newButton.style.cursor = "pointer";
      newButton.style.marginTop = "15px";
      newButton.style.fontWeight = "bold";

      newButton.addEventListener("click", function () {
        console.log("New button clicked, showing modal");
        showFinancialSummary();
      });

      inputContainer.appendChild(newButton);
    } else {
      // Last resort - add a floating button
      const floatingButton = document.createElement("button");
      floatingButton.textContent = "Show Financial Summary";
      floatingButton.style.position = "fixed";
      floatingButton.style.bottom = "20px";
      floatingButton.style.right = "20px";
      floatingButton.style.zIndex = "1000";
      floatingButton.style.backgroundColor = "#4CAF50";
      floatingButton.style.color = "white";
      floatingButton.style.padding = "15px 20px";
      floatingButton.style.border = "none";
      floatingButton.style.borderRadius = "4px";
      floatingButton.style.cursor = "pointer";
      floatingButton.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";

      floatingButton.addEventListener("click", function () {
        showFinancialSummary();
      });

      document.body.appendChild(floatingButton);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const sendButton = document.querySelector(".send-btn");
  const messageInput = document.querySelector("textarea");
  const messagesContainer = document.querySelector(".messages-container");

  sendButton.addEventListener("click", async function () {
    let userMessage = messageInput.value.trim();
    if (userMessage === "") return;

    // Display user message in chat
    displayMessage(userMessage, "user");

    // Send message to FastAPI backend
    try {
      const response = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: userMessage }),
      });

      const data = await response.json();
      displayMessage(data.response, "bot");
    } catch (error) {
      displayMessage("Error connecting to the bot.", "bot");
    }

    messageInput.value = "";
  });

  function displayMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.innerText = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});
