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

// -------------------------------------------------------------------------------------------------------------------------------------
// Stock Analysis - Fixed Version
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
