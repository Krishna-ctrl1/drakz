// -------------------------------------------------------------------------------------------------------------------------------------
// Financial Planning
// -------------------------------------------------------------------------------------------------------------------------------------
let exchangeRate = 83.0; // Default value if API fails

// Global variables to store user data
let userData = {
  monthlyIncome: 0,
  transportationCosts: 0,
  foodCosts: 0,
  outingExpenses: 0,
  otherCosts: 0,
  variableCosts: {},
  savings: 0,
};

// Current selected currency
let currentCurrency = "INR";

// Investment capacity calculated from the financial plan
let investmentCapacity = 0;

// DOM loaded event listener
document.addEventListener("DOMContentLoaded", function () {
  // Initialize tab navigation
  initializeTabs();

  // Initialize variable costs toggle
  initializeVariableCostsToggle();

  // Initialize calculate button
  initializeCalculateButton();
});

// Initialize tab navigation
function initializeTabs() {
  const tabItems = document.querySelectorAll(".tab-item");
  const sectionCards = document.querySelectorAll(".section-card");

  // Add click event to each tab
  tabItems.forEach((tab) => {
    tab.addEventListener("click", () => {
      const section = tab.getAttribute("data-section");
      // Remove active class from all tabs and content sections
      document
        .querySelectorAll(".tab-item")
        .forEach((item) => item.classList.remove("active"));
      document
        .querySelectorAll(".section-content")
        .forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      tab.classList.add("active");
      document.getElementById(`${section}-content`).classList.add("active");
    });
  });

  // Add click event to each section card in welcome page
  sectionCards.forEach((card) => {
    card.addEventListener("click", () => {
      const section = card.getAttribute("data-section");
      // Find and click the corresponding tab
      document.querySelector(`.tab-item[data-section="${section}"]`).click();
    });
  });
}

// Initialize variable costs toggle functionality
function initializeVariableCostsToggle() {
  const variableCostsToggle = document.getElementById("variable-costs-toggle");
  const variableCostsContainer = document.getElementById(
    "variable-costs-container"
  );

  variableCostsToggle.addEventListener("change", function () {
    if (this.checked) {
      variableCostsContainer.classList.remove("hidden");
    } else {
      variableCostsContainer.classList.add("hidden");
    }
  });
}

// Initialize calculate button functionality
function initializeCalculateButton() {
  const calculateButton = document.getElementById("calculate-summary");

  calculateButton.addEventListener("click", function () {
    // Collect data from input fields
    collectFinancialData();

    // Calculate financial summary
    calculateFinancialSummary();
  });
}

// Collect data from input fields
function collectFinancialData() {
  // Get fixed costs
  userData.monthlyIncome =
    parseFloat(document.getElementById("monthly-income").value) || 0;
  userData.transportationCosts =
    parseFloat(document.getElementById("transportation-costs").value) || 0;
  userData.foodCosts =
    parseFloat(document.getElementById("food-costs").value) || 0;
  userData.outingExpenses =
    parseFloat(document.getElementById("outing-expenses").value) || 0;
  userData.otherCosts =
    parseFloat(document.getElementById("fixed-costs").value) || 0;
  userData.savings =
    parseFloat(document.getElementById("available-savings").value) || 0;

  // Get variable costs if toggle is checked
  const variableCostsToggle = document.getElementById("variable-costs-toggle");
  userData.variableCosts = {};

  if (variableCostsToggle.checked) {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    months.forEach((month) => {
      userData.variableCosts[month] =
        parseFloat(document.getElementById(`${month}-costs`).value) || 0;
    });
  }
}

// Calculate financial summary and display results
function calculateFinancialSummary() {
  // Check if we have income data
  if (userData.monthlyIncome <= 0) {
    alert("Please enter your monthly income.");
    return;
  }

  // Calculate yearly income and expenses
  const yearlyIncome = calculateYearlyIncome();
  const yearlyExpenses = calculateYearlyExpenses();

  // Calculate monthly and yearly metrics
  const totalYearlyIncome = yearlyIncome.reduce((sum, val) => sum + val, 0);
  const totalYearlyExpenses = yearlyExpenses.reduce((sum, val) => sum + val, 0);

  const monthlyInvestment = totalYearlyIncome / 12 - totalYearlyExpenses / 12;
  const yearlyInvestment = totalYearlyIncome - totalYearlyExpenses;

  // Store the investment capacity
  investmentCapacity = yearlyInvestment;

  // Create financial summary container if it doesn't exist
  let financialSummary = document.getElementById("financial-summary");
  if (!financialSummary) {
    financialSummary = document.createElement("div");
    financialSummary.id = "financial-summary";
    financialSummary.className = "financial-summary";

    // Add it after the calculate button
    const calculateButton = document.getElementById("calculate-summary");
    calculateButton.parentNode.insertBefore(
      financialSummary,
      calculateButton.nextSibling
    );
  } else {
    // Clear previous content
    financialSummary.innerHTML = "";
  }

  // Create and display the financial summary
  const summaryHTML = `
        <h2>Financial Summary</h2>
        <div class="metrics-container">
            <div class="metrics-row">
                <div class="metric">
                    <div class="metric-label">Monthly Income</div>
                    <div class="metric-value">${formatCurrency(
                      userData.monthlyIncome
                    )}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Monthly Expenses</div>
                    <div class="metric-value">${formatCurrency(
                      totalYearlyExpenses / 12
                    )}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Monthly Investment Capacity</div>
                    <div class="metric-value">${formatCurrency(
                      monthlyInvestment
                    )}</div>
                </div>
            </div>
            <div class="metrics-row">
                <div class="metric">
                    <div class="metric-label">Yearly Income</div>
                    <div class="metric-value">${formatCurrency(
                      totalYearlyIncome
                    )}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Yearly Expenses</div>
                    <div class="metric-value">${formatCurrency(
                      totalYearlyExpenses
                    )}</div>
                </div>
                <div class="metric">
                    <div class="metric-label">Yearly Investment Capacity</div>
                    <div class="metric-value">${formatCurrency(
                      yearlyInvestment
                    )}</div>
                </div>
            </div>
        </div>
        
        <div class="charts-container">
            <div class="chart">
                <h3>Income, Costs, and Investment Capacity</h3>
                <div id="bar-line-chart"></div>
            </div>
            <div class="chart">
                <h3>Cost and Investment Capacity Distribution</h3>
                <div id="pie-chart"></div>
            </div>
        </div>
    `;

  financialSummary.innerHTML = summaryHTML;

  // Generate and render charts
  renderBarLineChart(yearlyIncome, yearlyExpenses);
  renderPieChart(totalYearlyIncome, totalYearlyExpenses);
}

// Calculate yearly income
function calculateYearlyIncome() {
  // Initialize monthly income for each month
  return Array(12).fill(userData.monthlyIncome);
}

// Calculate yearly expenses
function calculateYearlyExpenses() {
  const fixedMonthlyExpenses =
    userData.transportationCosts +
    userData.foodCosts +
    userData.outingExpenses +
    userData.otherCosts;

  // Initialize monthly expenses with fixed costs
  const yearlyExpenses = Array(12).fill(fixedMonthlyExpenses);

  // Add variable costs per month
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  months.forEach((month, index) => {
    yearlyExpenses[index] += userData.variableCosts[month] || 0;
  });

  return yearlyExpenses;
}

// Render bar and line chart for income, expenses, and investment capacity
function renderBarLineChart(yearlyIncome, yearlyExpenses) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Calculate investment capacity for each month
  const investmentCapacity = yearlyIncome.map(
    (income, index) => income - yearlyExpenses[index]
  );

  // Use a chart library here. For simplicity, I'll create a basic visualization
  const chartContainer = document.getElementById("bar-line-chart");

  // Create a basic chart representation
  let chartHTML = '<div class="custom-chart">';

  // Chart header
  chartHTML += '<div class="chart-header">';
  chartHTML +=
    '<div class="chart-legend"><span class="legend-color income"></span>Income</div>';
  chartHTML +=
    '<div class="chart-legend"><span class="legend-color expenses"></span>Expenses</div>';
  chartHTML +=
    '<div class="chart-legend"><span class="legend-color investment"></span>Investment Capacity</div>';
  chartHTML += "</div>";

  // Chart body
  chartHTML += '<div class="chart-body">';

  // Find max value for scaling
  const maxValue = Math.max(
    ...yearlyIncome,
    ...yearlyExpenses,
    ...investmentCapacity.map((val) => Math.abs(val))
  );

  // Generate bars for each month
  months.forEach((month, index) => {
    const incomeHeight = (yearlyIncome[index] / maxValue) * 100;
    const expensesHeight = (yearlyExpenses[index] / maxValue) * 100;
    const investmentHeight =
      (Math.abs(investmentCapacity[index]) / maxValue) * 100;
    const investmentClass =
      investmentCapacity[index] >= 0 ? "positive" : "negative";

    chartHTML += `
            <div class="chart-column">
                <div class="chart-bars">
                    <div class="bar income" style="height: ${incomeHeight}%" title="${month}: ${formatCurrency(
      yearlyIncome[index]
    )}"></div>
                    <div class="bar expenses" style="height: ${expensesHeight}%" title="${month}: ${formatCurrency(
      yearlyExpenses[index]
    )}"></div>
                    <div class="bar investment ${investmentClass}" style="height: ${investmentHeight}%" title="${month}: ${formatCurrency(
      investmentCapacity[index]
    )}"></div>
                </div>
                <div class="chart-label">${month}</div>
            </div>
        `;
  });

  chartHTML += "</div>"; // End chart-body
  chartHTML += "</div>"; // End custom-chart

  chartContainer.innerHTML = chartHTML;
}

// Render pie chart for cost distribution
function renderPieChart(totalIncome, totalExpenses) {
  const variableCosts = Object.values(userData.variableCosts).reduce(
    (sum, val) => sum + val,
    0
  );

  const fixedCosts =
    (userData.transportationCosts +
      userData.foodCosts +
      userData.outingExpenses +
      userData.otherCosts) *
    12;

  const investmentCapacity = totalIncome - (fixedCosts + variableCosts);

  // Calculate percentages
  const total =
    Math.abs(variableCosts) +
    Math.abs(fixedCosts) +
    Math.abs(investmentCapacity);
  const variablePercentage = (Math.abs(variableCosts) / total) * 100;
  const fixedPercentage = (Math.abs(fixedCosts) / total) * 100;
  const investmentPercentage = (Math.abs(investmentCapacity) / total) * 100;

  // Use a chart library here. For simplicity, I'll create a basic visualization
  const chartContainer = document.getElementById("pie-chart");

  // Create a basic pie chart representation using SVG for more reliable rendering
  let chartHTML = '<div class="pie-chart-container">';

  // Pie chart visual using SVG
  const svgSize = 240;
  const radius = svgSize / 2;
  const innerRadius = radius * 0.6; // For donut chart
  const centerX = radius;
  const centerY = radius;

  // Calculate segments
  let startAngle = 0;
  let endAngle = 0;

  // Function to calculate SVG arc path
  function describeArc(x, y, radius, innerRadius, startAngle, endAngle) {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = x + radius * Math.cos(startRad);
    const y1 = y + radius * Math.sin(startRad);
    const x2 = x + radius * Math.cos(endRad);
    const y2 = y + radius * Math.sin(endRad);

    const x3 = x + innerRadius * Math.cos(endRad);
    const y3 = y + innerRadius * Math.sin(endRad);
    const x4 = x + innerRadius * Math.cos(startRad);
    const y4 = y + innerRadius * Math.sin(startRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    // Outer arc
    const outerArc = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
    // Line to inner circle
    const innerLine = `L ${x3} ${y3}`;
    // Inner arc
    const innerArc = `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`;
    // Close path
    const closeLine = "Z";

    return outerArc + " " + innerLine + " " + innerArc + " " + closeLine;
  }

  // Start SVG
  chartHTML += `
    <div class="pie-chart-wrapper">
      <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">
  `;

  // Add each segment
  if (variablePercentage > 0) {
    endAngle = startAngle + variablePercentage * 3.6;
    chartHTML += `<path d="${describeArc(
      centerX,
      centerY,
      radius,
      innerRadius,
      startAngle,
      endAngle
    )}" 
                       fill="#e74c3c" class="pie-segment-svg variable-costs"></path>`;
    startAngle = endAngle;
  }

  if (fixedPercentage > 0) {
    endAngle = startAngle + fixedPercentage * 3.6;
    chartHTML += `<path d="${describeArc(
      centerX,
      centerY,
      radius,
      innerRadius,
      startAngle,
      endAngle
    )}" 
                       fill="#f39c12" class="pie-segment-svg fixed-costs"></path>`;
    startAngle = endAngle;
  }

  if (investmentPercentage > 0) {
    endAngle = startAngle + investmentPercentage * 3.6;
    chartHTML += `<path d="${describeArc(
      centerX,
      centerY,
      radius,
      innerRadius,
      startAngle,
      endAngle
    )}" 
                       fill="#2ecc71" class="pie-segment-svg investment-capacity"></path>`;
  }

  // Close SVG
  chartHTML += `</svg>
    </div>
  `;

  // Pie chart legend
  chartHTML += `
    <div class="pie-chart-legend">
      <div class="legend-item">
        <span class="legend-color variable-costs"></span>
        <span class="legend-label">Variable Costs (${variablePercentage.toFixed(
          1
        )}%)</span>
        <span class="legend-value">${formatCurrency(variableCosts)}</span>
      </div>
      <div class="legend-item">
        <span class="legend-color fixed-costs"></span>
        <span class="legend-label">Fixed Costs (${fixedPercentage.toFixed(
          1
        )}%)</span>
        <span class="legend-value">${formatCurrency(fixedCosts)}</span>
      </div>
      <div class="legend-item">
        <span class="legend-color investment-capacity"></span>
        <span class="legend-label">Investment Capacity (${investmentPercentage.toFixed(
          1
        )}%)</span>
        <span class="legend-value">${formatCurrency(investmentCapacity)}</span>
      </div>
    </div>
  `;

  chartHTML += "</div>"; // End pie-chart-container

  chartContainer.innerHTML = chartHTML;
}

// Format currency for display
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currentCurrency,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Sidebar navigation functions
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
}

// Search function for dashboard
function filterDashboard() {
  // Implement if needed for search functionality
}

// -------------------------------------------------------------------------------------------------------------------------------------
// Stock Analysis
// -------------------------------------------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  // Get references to stock analysis elements
  const stockSymbolInput = document.getElementById("stock-symbol");
  const getStockDetailsBtn = document.getElementById("get-stock-details");
  const stockResultsDiv = document.getElementById("stock-results");

  // Check if elements exist before adding event listeners
  if (getStockDetailsBtn && stockSymbolInput && stockResultsDiv) {
    console.log("Stock analysis elements found, attaching event listener");

    // Add click event listener to the button
    getStockDetailsBtn.addEventListener("click", function () {
      console.log("Get stock details button clicked");
      const symbol = stockSymbolInput.value.trim().toUpperCase();

      if (symbol) {
        console.log("Fetching data for symbol:", symbol);
        fetchStockData(symbol, stockResultsDiv);
      } else {
        console.log("No symbol entered");
        alert("Please enter a valid stock symbol");
      }
    });

    /**
     * Fetch stock data using Alpha Vantage API
     * @param {string} symbol - Stock ticker symbol
     * @param {HTMLElement} resultsDiv - DOM element to display results in
     */
    async function fetchStockData(symbol, resultsDiv) {
      try {
        // Show loading indicator
        resultsDiv.innerHTML =
          '<div class="loading">Loading stock data...</div>';

        // Fetch stock data from Alpha Vantage API
        const apiKey = "536CTHGRJTDSWQC3w";
        const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
        const priceUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        const timeseriesUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

        // Make all requests in parallel
        const [overviewResponse, priceResponse, tsResponse] = await Promise.all(
          [fetch(overviewUrl), fetch(priceUrl), fetch(timeseriesUrl)]
        );

        const overviewData = await overviewResponse.json();
        const priceData = await priceResponse.json();
        const tsData = await tsResponse.json();

        // Handle potential error responses
        if (overviewData.Note || priceData.Note) {
          throw new Error(
            "API call frequency exceeded. Please try again later."
          );
        }

        if (overviewData.Error || !overviewData.Symbol) {
          throw new Error(`Could not find data for symbol: ${symbol}`);
        }

        // Process and display the data
        displayStockData(symbol, overviewData, priceData, resultsDiv);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        resultsDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
      }
    }

    /**
     * Display stock data on the page
     * @param {string} symbol - Stock ticker symbol
     * @param {Object} companyData - Company overview data
     * @param {Object} priceData - Current price data
     * @param {HTMLElement} resultsDiv - DOM element to display results in
     */
    function displayStockData(symbol, companyData, priceData, resultsDiv) {
      // Extract price information
      const currentPrice =
        parseFloat(priceData["Global Quote"]?.["05. price"]) || 0;
      const priceChange =
        parseFloat(priceData["Global Quote"]?.["09. change"]) || 0;
      const priceChangePercent =
        parseFloat(
          priceData["Global Quote"]?.["10. change percent"]?.replace("%", "")
        ) || 0;
      const priceChangeClass =
        priceChangePercent >= 0 ? "positive" : "negative";

      // Extract company metrics
      const revenue = parseFloat(companyData.RevenueTTM) || 0;
      const netIncome = parseFloat(companyData.ProfitMargin) * revenue || 0;
      const netMargin = parseFloat(companyData.ProfitMargin) * 100 || 0;

      // Format numbers for display
      const formatCurrency = (value) => {
        if (value >= 1000000000) {
          return `$${(value / 1000000000).toFixed(2)}B`;
        } else if (value >= 1000000) {
          return `$${(value / 1000000).toFixed(2)}M`;
        } else {
          return `$${value.toFixed(2)}`;
        }
      };

      // Create stock graph element with a canvas for the chart
      const graphHtml = `
        <div class="stock-graph">
          <canvas id="stockChart" width="800" height="300"></canvas>
        </div>
      `;

      // Create metrics HTML
      const metricsHtml = `
        <h3>Key Financial Metrics</h3>
        <div class="key-metrics">
          <div class="metric-card">
            <div class="metric-label">Current Price</div>
            <div class="metric-value">$${currentPrice.toFixed(2)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Price Change (%)</div>
            <div class="metric-value ${priceChangeClass}">${
        priceChangePercent >= 0 ? "+" : ""
      }${priceChangePercent.toFixed(2)}%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Revenue</div>
            <div class="metric-value">${formatCurrency(revenue)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Net Income</div>
            <div class="metric-value">${formatCurrency(netIncome)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Net Margin (%)</div>
            <div class="metric-value">${netMargin.toFixed(2)}%</div>
          </div>
        </div>
      `;

      // Create company info HTML
      const companyInfoHtml = `
        <div class="company-info">
          <h3>Company Information</h3>
          <p><strong>Name:</strong> ${companyData.Name || symbol}</p>
          <p><strong>Industry:</strong> ${
            companyData.Industry || "Not available"
          }</p>
          <p><strong>Description:</strong> ${
            companyData.Description || "No description available."
          }</p>
        </div>
      `;

      // Update the results div with all the HTML
      resultsDiv.innerHTML = graphHtml + metricsHtml + companyInfoHtml;

      // Now that the canvas is in the DOM, create the chart
      // We need to use setTimeout to ensure the DOM has been updated
      setTimeout(() => {
        createStockChart(symbol);
      }, 0);
    }

    /**
     * Create a stock price chart for the given symbol
     * @param {string} symbol - Stock ticker symbol
     */
    async function createStockChart(symbol) {
      try {
        const canvas = document.getElementById("stockChart");
        if (!canvas) {
          console.error('Canvas element "stockChart" not found in DOM');
          return;
        }

        // Check if Chart.js is available
        if (typeof Chart === "undefined") {
          console.error("Chart.js library is not loaded.");
          // Create a fallback message if Chart.js isn't available
          const chartContainer = canvas.parentNode;
          chartContainer.innerHTML = `
            <div style="width: 100%; height: 300px; display: flex; align-items: center; justify-content: center; background-color: #f8f9fa; border-radius: 8px;">
              <p>Chart cannot be displayed. Chart.js library is not available.</p>
            </div>
          `;
          return;
        }

        // Fetch historical data from Alpha Vantage
        const apiKey = "536CTHGRJTDSWQC3w";
        const timeseriesUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

        // Show loading indicator on canvas
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#f8f9fa";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#333";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "Loading stock data...",
          canvas.width / 2,
          canvas.height / 2
        );

        const response = await fetch(timeseriesUrl);
        const data = await response.json();

        if (data.Note || data["Error Message"]) {
          console.error(
            "API limit reached or error:",
            data.Note || data["Error Message"]
          );
          ctx.fillStyle = "#f8f9fa";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "red";
          ctx.fillText(
            "API limit reached. Please try again later.",
            canvas.width / 2,
            canvas.height / 2
          );
          return;
        }

        const timeSeriesData = data["Time Series (Daily)"];

        if (!timeSeriesData) {
          console.error("No series data available");
          ctx.fillStyle = "#f8f9fa";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "red";
          ctx.fillText(
            "No data available for this symbol",
            canvas.width / 2,
            canvas.height / 2
          );
          return;
        }

        // Extract dates and closing prices
        const chartData = Object.entries(timeSeriesData)
          .map(([date, values]) => ({
            date: date,
            price: parseFloat(values["4. close"]),
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-30); // Last 30 days

        console.log("Chart data prepared:", chartData);

        // Clear any existing charts on this canvas
        if (Chart.getChart(canvas)) {
          Chart.getChart(canvas).destroy();
        }

        // Create a new chart
        new Chart(ctx, {
          type: "line",
          data: {
            labels: chartData.map((d) => d.date),
            datasets: [
              {
                label: `${symbol} Closing Price`,
                data: chartData.map((d) => d.price),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                borderWidth: 2,
                tension: 0.1,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
                ticks: {
                  maxTicksLimit: 10,
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Price (USD)",
                },
                beginAtZero: false,
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error creating stock chart:", error);
        // Display error on canvas
        const canvas = document.getElementById("stockChart");
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#f8f9fa";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "red";
          ctx.font = "16px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            `Error: ${error.message}`,
            canvas.width / 2,
            canvas.height / 2
          );
        }
      }
    }
  } else {
    console.error("Could not find stock analysis elements:", {
      buttonFound: !!getStockDetailsBtn,
      inputFound: !!stockSymbolInput,
      resultsFound: !!stockResultsDiv,
    });
  }
});

// -------------------------------------------------------------------------------------------------------------------------------------
// Investment Recommendations
// -------------------------------------------------------------------------------------------------------------------------------------

// Client-side code for investment-content section
document.addEventListener("DOMContentLoaded", () => {
  // Add this HTML to the investment-content section
  const investmentContent = document.getElementById("investment-content");
  investmentContent.innerHTML = `
    <h2>Investment Recommendations</h2>
    <p>Get personalized investment opportunities based on your financial goals.</p>
    
    <div class="investment-inputs">
      <div class="input-group">
        <label for="investment-amount">Investment Amount (INR)</label>
        <input type="number" id="investment-amount" class="number-input" min="0" step="100" value="100000" />
      </div>
      <div class="input-group wide">
        <label for="stock-tickers">Stock Tickers (comma separated, e.g., AAPL,MSFT,GOOG)</label>
        <input type="text" id="stock-tickers" placeholder="Enter stock tickers separated by commas" />
      </div>
      <button id="analyze-stocks" class="calculate-btn">Analyze Stocks and Get Recommendations</button>
    </div>

    <div id="loading-spinner" class="hidden">
      <div class="spinner"></div>
      <p>Loading stock data...</p>
    </div>

    <div id="stock-analysis-results" class="hidden">
      <h3>Stock Analysis Results</h3>
      <div class="metrics-container" id="metrics-container"></div>
      
      <h3>Recommended Investment Allocation</h3>
      <div class="allocation-table-container">
        <table id="allocation-table" class="investment-table">
          <thead>
            <tr>
              <th>Stock Ticker</th>
              <th>Allocation (INR)</th>
              <th>Share Price (INR)</th>
              <th>Shares to Buy</th>
              <th>Total Cost (INR)</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody id="allocation-body"></tbody>
        </table>
      </div>
      
      <div class="chart-container">
        <canvas id="allocation-chart" width="400" height="400"></canvas>
      </div>
    </div>
  `;

  // Add CSS to the page
  const style = document.createElement("style");
  style.textContent = `
    .investment-inputs {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .input-group.wide {
      grid-column: span 2;
    }
    
    #loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 30px 0;
    }
    
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: #4361ee;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .hidden {
      display: none;
    }
    
    .metrics-container {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .metric-card {
      background-color: #fff;
      border-radius: 6px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      flex: 1;
      min-width: 200px;
    }
    
    .investment-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    
    .investment-table th, .investment-table td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
    }
    
    .investment-table th {
      background-color: #f2f2f2;
    }
    
    .chart-container {
      width: 100%;
      max-width: 500px;
      margin: 0 auto 30px auto;
    }
  `;
  document.head.appendChild(style);

  // Initialize variables
  const analyzeButton = document.getElementById("analyze-stocks");
  const loadingSpinner = document.getElementById("loading-spinner");
  const resultsContainer = document.getElementById("stock-analysis-results");
  const ALPHA_VANTAGE_API_KEY = "536CTHGRJTDSWQC3w"; // Replace with your API key

  // Add event listener for the analyze button
  analyzeButton.addEventListener("click", async () => {
    const tickersInput = document.getElementById("stock-tickers").value.trim();
    const investmentAmount = parseFloat(
      document.getElementById("investment-amount").value
    );

    if (!tickersInput || isNaN(investmentAmount) || investmentAmount <= 0) {
      alert("Please enter valid stock tickers and investment amount.");
      return;
    }

    // Show loading spinner
    loadingSpinner.classList.remove("hidden");
    resultsContainer.classList.add("hidden");

    const tickers = tickersInput
      .split(",")
      .map((ticker) => ticker.trim().toUpperCase());

    try {
      // Fetch stock data for all tickers
      const metricsData = await Promise.all(
        tickers.map((ticker) => fetchStockData(ticker))
      );

      // Get recommendations based on metrics
      const recommendations = get_stock_recommendations(metricsData, tickers);

      // Allocate investment
      const allocation = allocate_investment(recommendations, investmentAmount);

      // Display results
      displayMetrics(recommendations);
      displayAllocation(allocation);
      createAllocationChart(allocation);

      // Hide loading spinner and show results
      loadingSpinner.classList.add("hidden");
      resultsContainer.classList.remove("hidden");
    } catch (error) {
      console.error("Error analyzing stocks:", error);
      alert("Error fetching stock data. Please try again.");
      loadingSpinner.classList.add("hidden");
    }
  });

  // Javascript conversion of the Python functions provided
  function get_stock_recommendations(metrics_list, tickers) {
    // Create a scoring system
    const scored_stocks = [];

    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];
      const metrics = metrics_list[i];

      if (!metrics) {
        continue;
      }

      let score = 0;

      // Price change score
      if ("Price Change (%)" in metrics) {
        const price_change = metrics["Price Change (%)"];
        // Higher price change is better, but cap at 20 points
        score +=
          price_change > 0
            ? Math.min(price_change / 5, 20)
            : Math.max(price_change / 10, -10);
      }

      // Net margin score
      if ("Net Margin (%)" in metrics) {
        const net_margin = metrics["Net Margin (%)"];
        // Higher margins are better
        score += Math.min(net_margin / 2, 30);
      }

      // ROE score
      if ("ROE (%)" in metrics) {
        const roe = metrics["ROE (%)"];
        // Higher ROE is better, but cap at 25 points
        score += Math.min(roe / 2, 25);
      }

      // Debt-to-Equity score (lower is better)
      if ("Debt-to-Equity (%)" in metrics) {
        const dte = metrics["Debt-to-Equity (%)"];
        // Lower D/E is better, penalize high debt
        score -= Math.min(dte / 10, 15);
      }

      scored_stocks.push([ticker, Math.round(score * 100) / 100, metrics]);
    }

    // Sort by score (highest first)
    scored_stocks.sort((a, b) => b[1] - a[1]);

    return scored_stocks;
  }

  function allocate_investment(recommendations, investment_amount) {
    if (!recommendations || recommendations.length === 0) {
      return {};
    }

    // Number of stocks to invest in (top 3 or all if less than 3)
    const num_stocks = Math.min(3, recommendations.length);
    const top_stocks = recommendations.slice(0, num_stocks);

    // Equal allocation
    const amount_per_stock = investment_amount / num_stocks;

    const allocation = {};
    for (const [ticker, score, metrics] of top_stocks) {
      if ("Current Price" in metrics) {
        const price = metrics["Current Price"];
        const shares = Math.floor(amount_per_stock / price);

        allocation[ticker] = {
          "Allocation ($)": Math.round(amount_per_stock * 100) / 100,
          "Share Price ($)": price,
          "Shares to Buy": shares,
          "Total Cost ($)": Math.round(shares * price * 100) / 100,
          Score: score,
        };
      }
    }

    return allocation;
  }

  // Function to fetch stock data from Alpha Vantage
  async function fetchStockData(ticker) {
    try {
      // First, get overview data
      const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const overviewResponse = await fetch(overviewUrl);
      const overviewData = await overviewResponse.json();

      // Then get daily price data
      const priceUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const priceResponse = await fetch(priceUrl);
      const priceData = await priceResponse.json();

      // Check if we got valid data
      if (Object.keys(overviewData).length <= 1 || !priceData["Global Quote"]) {
        console.error(`Invalid data for ${ticker}`, overviewData, priceData);
        return null;
      }

      // Extract relevant metrics
      const quote = priceData["Global Quote"];
      const currentPrice = parseFloat(quote["05. price"]);
      const priceChange = parseFloat(quote["09. change"]);
      const priceChangePercent = parseFloat(
        quote["10. change percent"].replace("%", "")
      );

      const metrics = {
        "Current Price": currentPrice,
        "Price Change (%)": priceChangePercent,
        "Net Margin (%)": parseFloat(overviewData.ProfitMargin || 0) * 100,
        "ROE (%)": parseFloat(overviewData.ReturnOnEquityTTM || 0) * 100,
        "Debt-to-Equity (%)":
          parseFloat(overviewData.DebtToEquityRatio || 0) * 100,
      };

      return metrics;
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error);
      return null;
    }
  }

  // Function to display metrics
  function displayMetrics(recommendations) {
    const metricsContainer = document.getElementById("metrics-container");
    metricsContainer.innerHTML = "";

    recommendations.forEach(([ticker, score, metrics]) => {
      const metricCard = document.createElement("div");
      metricCard.className = "metric-card";

      let metricHtml = `<h4>${ticker}</h4><p>Score: ${score}</p>`;

      for (const [key, value] of Object.entries(metrics)) {
        metricHtml += `<p><strong>${key}:</strong> ${
          typeof value === "number" ? value.toFixed(2) : value
        }</p>`;
      }

      metricCard.innerHTML = metricHtml;
      metricsContainer.appendChild(metricCard);
    });
  }

  // Function to display allocation table
  function displayAllocation(allocation) {
    const tableBody = document.getElementById("allocation-body");
    tableBody.innerHTML = "";

    for (const [ticker, data] of Object.entries(allocation)) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${ticker}</td>
        <td>${data["Allocation ($)"].toLocaleString()}</td>
        <td>${data["Share Price ($)"].toLocaleString()}</td>
        <td>${data["Shares to Buy"]}</td>
        <td>${data["Total Cost ($)"].toLocaleString()}</td>
        <td>${data["Score"]}</td>
      `;
      tableBody.appendChild(row);
    }
  }

  // Function to create allocation chart
  function createAllocationChart(allocation) {
    const ctx = document.getElementById("allocation-chart").getContext("2d");

    // Prepare data for chart
    const labels = Object.keys(allocation);
    const data = labels.map((ticker) => allocation[ticker]["Allocation ($)"]);

    // Generate colors
    const backgroundColors = [
      "#4361ee",
      "#3a0ca3",
      "#7209b7",
      "#f72585",
      "#4cc9f0",
      "#fb8500",
      "#ffb703",
      "#8ac926",
      "#1982c4",
      "#6a4c93",
    ];

    // Create chart
    if (window.allocationChart) {
      window.allocationChart.destroy();
    }

    window.allocationChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors.slice(0, labels.length),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "Investment Allocation",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw.toLocaleString();
                const total = context.chart.data.datasets[0].data.reduce(
                  (a, b) => a + b,
                  0
                );
                const percentage = Math.round((context.raw / total) * 100);
                return `${label}: ₹${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }
});

// -------------------------------------------------------------------------------------------------------------------------------------
// Financial Advisor Chat
// -------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  console.log("Global variables check:", {
    monthlyIncome: typeof monthlyIncome !== "undefined",
    savings: typeof savings !== "undefined",
    currentCurrency: typeof currentCurrency !== "undefined",
  });

  // Elements
  const messagesContainer = document.querySelector(".messages-container");
  const textarea = document.querySelector(".input-area textarea");
  const sendButton = document.querySelector(".send-btn");

  // Check if elements are found
  if (!messagesContainer) console.error("Messages container not found");
  if (!textarea) console.error("Textarea not found");
  if (!sendButton) console.error("Send button not found");

  // Use the global variables that are already defined
  const userData = {
    monthly_income: typeof monthlyIncome !== "undefined" ? monthlyIncome : 0,
    savings: typeof savings !== "undefined" ? savings : 0,
    currency: typeof currentCurrency !== "undefined" ? currentCurrency : "USD",
  };

  // Function to add a message to the chat
  function addMessage(message, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? "user" : "bot"}`;
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);

    // Scroll to the bottom of the messages
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Function to send message to server and get response
  async function sendToAdvisor(query) {
    try {
      // Show loading indicator
      const loadingDiv = document.createElement("div");
      loadingDiv.className = "message bot loading";
      loadingDiv.textContent = "Thinking...";
      messagesContainer.appendChild(loadingDiv);

      // Make API request
      const response = await fetch("/api/financial-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, userData }),
      });

      // Remove loading indicator
      messagesContainer.removeChild(loadingDiv);

      if (!response.ok) {
        throw new Error("Failed to get response from financial advisor");
      }

      const data = await response.json();
      addMessage(data.response);
    } catch (error) {
      console.error("Error:", error);
      addMessage(
        "Sorry, I encountered an error while processing your request. Please try again later."
      );
    }
  }

  // Event listener for send button
  sendButton.addEventListener("click", () => {
    console.log("Send Button Clicked");
    const message = textarea.value.trim();
    if (message) {
      addMessage(message, true);
      textarea.value = "";
      sendToAdvisor(message);
    }
  });

  // Event listener for pressing Enter in textarea
  textarea.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendButton.click();
    }
  });

  // Optional: Function to update user data
  function updateUserData(newData) {
    Object.assign(userData, newData);
  }

  // Expose updateUserData function globally if needed
  window.updateUserData = updateUserData;

  // Add an initial message
  addMessage("Welcome to your Financial Advisor! How can I help you today?");
});
