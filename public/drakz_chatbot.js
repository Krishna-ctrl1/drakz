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

// DOM Elements
document.addEventListener("DOMContentLoaded", function () {
  // Tab Navigation
  const tabItems = document.querySelectorAll(".tab-item");
  const sectionContents = document.querySelectorAll(".section-content");
  const sectionCards = document.querySelectorAll(".section-card");

  // Stock Analysis Elements
  const stockSymbolInput = document.getElementById("stock-symbol");
  const getStockDetailsBtn = document.getElementById("get-stock-details");
  const stockResults = document.getElementById("stock-results");

  // Financial Planning Elements
  const variableCostsToggle = document.getElementById("variable-costs-toggle");
  const variableCostsContainer = document.getElementById(
    "variable-costs-container"
  );
  const calculateSummaryBtn = document.getElementById("calculate-summary");

  // Financial Advisor Chat Elements
  const messagesContainer = document.querySelector(".messages-container");
  const textarea = document.querySelector(".input-area textarea");
  const sendBtn = document.querySelector(".send-btn");

  // Currency state (default to INR as in the HTML)
  let currentCurrency = "INR";

  // Exchange rate (approximate, would be fetched from API in production)
  const exchangeRate = 83.0; // USD to INR

  // Stock data cache
  let stockCache = {};

  // Tab Navigation
  tabItems.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs and sections
      tabItems.forEach((t) => t.classList.remove("active"));
      sectionContents.forEach((s) => s.classList.remove("active"));

      // Add active class to clicked tab
      tab.classList.add("active");

      // Get section name and activate corresponding content
      const sectionName = tab.getAttribute("data-section");
      document.getElementById(`${sectionName}-content`).classList.add("active");
    });
  });

  // Section Cards Navigation (from welcome page)
  sectionCards.forEach((card) => {
    card.addEventListener("click", () => {
      const sectionName = card.getAttribute("data-section");

      // Activate corresponding tab and content
      tabItems.forEach((t) => {
        t.classList.remove("active");
        if (t.getAttribute("data-section") === sectionName) {
          t.classList.add("active");
        }
      });

      sectionContents.forEach((s) => s.classList.remove("active"));
      document.getElementById(`${sectionName}-content`).classList.add("active");
    });
  });

  // Variable Costs Toggle
  if (variableCostsToggle) {
    variableCostsToggle.addEventListener("change", () => {
      if (variableCostsToggle.checked) {
        variableCostsContainer.classList.remove("hidden");
      } else {
        variableCostsContainer.classList.add("hidden");
      }
    });
  }

  // Stock Analysis
  if (getStockDetailsBtn) {
    getStockDetailsBtn.addEventListener("click", getStockDetails);
  }

  // Financial Planning Calculate
  if (calculateSummaryBtn) {
    calculateSummaryBtn.addEventListener("click", calculateFinancialSummary);
  }

  // Financial Advisor Chat
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
    textarea.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  /**
   * Function to get stock details from API and display them
   */
  async function getStockDetails() {
    const symbol = stockSymbolInput.value.trim().toUpperCase();

    if (!symbol) {
      alert("Please enter a stock symbol");
      return;
    }

    // Show loading state
    stockResults.innerHTML = '<div class="loading">Loading stock data...</div>';

    try {
      // Check cache first
      if (stockCache[symbol]) {
        displayStockData(stockCache[symbol], symbol);
        return;
      }

      // Fetch stock data
      const stockData = await fetchStockData(symbol);

      if (!stockData) {
        stockResults.innerHTML = `<div class="error">Could not retrieve data for ${symbol}. Please check the ticker symbol.</div>`;
        return;
      }

      // Cache the data
      stockCache[symbol] = stockData;

      // Display the data
      displayStockData(stockData, symbol);
    } catch (error) {
      console.error("Error:", error);
      stockResults.innerHTML = `<div class="error">Error fetching stock data: ${error.message}</div>`;
    }
  }

  /**
   * Fetch stock data from API
   * @param {string} symbol - Stock ticker symbol
   * @returns {Object} Stock data
   */
  async function fetchStockData(symbol) {
    // In a real application, you would fetch this from an API
    // For demo purposes, we'll simulate the API response with fake data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if it's a common stock symbol for demo data
    const commonStocks = [
      "AAPL",
      "MSFT",
      "GOOGL",
      "AMZN",
      "TSLA",
      "NVDA",
      "META",
      "JPM",
      "V",
    ];

    if (!commonStocks.includes(symbol)) {
      // For any other symbol, generate random data
      return generateRandomStockData(symbol);
    }

    // Return predefined data for common stocks
    return getPreDefinedStockData(symbol);
  }

  /**
   * Generate random stock data for demo
   * @param {string} symbol - Stock ticker symbol
   * @returns {Object} Generated stock data
   */
  function generateRandomStockData(symbol) {
    const currentPrice = Math.random() * 1000 + 10;
    const priceChange = Math.random() * 20 - 10; // -10% to +10%
    const revenue = Math.random() * 100 + 5; // 5B to 105B
    const netIncome = revenue * (Math.random() * 0.3); // 0% to 30% of revenue
    const netMargin = (netIncome / revenue) * 100;
    const roe = Math.random() * 30; // 0% to 30%
    const debtToEquity = Math.random() * 100; // 0% to 100%

    // Generate price history data (last 30 days)
    const priceHistory = [];
    let price = currentPrice - (priceChange / 100) * currentPrice;

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Add some randomness to price
      const dailyChange = (Math.random() * 2 - 1) * (price * 0.02);
      price += dailyChange;

      priceHistory.push({
        date: date.toISOString().split("T")[0],
        price: Math.max(price, 1), // Ensure price is at least $1
      });
    }

    // Ensure the last price matches our current price
    priceHistory[priceHistory.length - 1].price = currentPrice;

    return {
      symbol,
      companyName: `${symbol} Corporation`,
      currentPrice,
      priceChange,
      revenue: revenue * 1e9, // Convert to actual value
      netIncome: netIncome * 1e9, // Convert to actual value
      netMargin,
      roe,
      debtToEquity,
      industry: getRandomIndustry(),
      description: `${symbol} Corporation is a public company operating in the ${getRandomIndustry()} sector.`,
      priceHistory,
    };
  }

  /**
   * Get predefined stock data for common symbols
   * @param {string} symbol - Stock ticker symbol
   * @returns {Object} Stock data
   */
  function getPreDefinedStockData(symbol) {
    // Base data structure
    const baseData = {
      symbol,
      priceHistory: generatePriceHistory(),
    };

    // Symbol-specific data
    const stockSpecifics = {
      AAPL: {
        companyName: "Apple Inc.",
        currentPrice: 175.42,
        priceChange: 2.34,
        revenue: 394.3e9,
        netIncome: 96.9e9,
        netMargin: 24.6,
        roe: 35.2,
        debtToEquity: 147.3,
        industry: "Technology",
        description:
          "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and wearables, home, and accessories.",
      },
      MSFT: {
        companyName: "Microsoft Corporation",
        currentPrice: 383.89,
        priceChange: 1.78,
        revenue: 211.9e9,
        netIncome: 72.4e9,
        netMargin: 34.2,
        roe: 43.1,
        debtToEquity: 65.7,
        industry: "Technology",
        description:
          "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.",
      },
      GOOGL: {
        companyName: "Alphabet Inc.",
        currentPrice: 142.15,
        priceChange: 0.89,
        revenue: 307.4e9,
        netIncome: 73.8e9,
        netMargin: 24.0,
        roe: 25.3,
        debtToEquity: 11.8,
        industry: "Technology",
        description:
          "Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.",
      },
      AMZN: {
        companyName: "Amazon.com, Inc.",
        currentPrice: 185.67,
        priceChange: -0.43,
        revenue: 574.8e9,
        netIncome: 30.4e9,
        netMargin: 5.3,
        roe: 17.1,
        debtToEquity: 121.5,
        industry: "Retail",
        description:
          "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores in North America and internationally. It operates through three segments: North America, International, and Amazon Web Services (AWS).",
      },
      TSLA: {
        companyName: "Tesla, Inc.",
        currentPrice: 241.23,
        priceChange: -2.14,
        revenue: 96.8e9,
        netIncome: 12.6e9,
        netMargin: 13.0,
        roe: 26.8,
        debtToEquity: 14.2,
        industry: "Automotive",
        description:
          "Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.",
      },
      NVDA: {
        companyName: "NVIDIA Corporation",
        currentPrice: 950.02,
        priceChange: 4.21,
        revenue: 60.9e9,
        netIncome: 29.8e9,
        netMargin: 48.9,
        roe: 74.3,
        debtToEquity: 51.8,
        industry: "Technology",
        description:
          "NVIDIA Corporation provides graphics, computing, and networking solutions in the United States, Taiwan, China, and internationally. The company operates through two segments, Graphics and Compute & Networking.",
      },
      META: {
        companyName: "Meta Platforms, Inc.",
        currentPrice: 487.28,
        priceChange: 1.93,
        revenue: 134.9e9,
        netIncome: 39.1e9,
        netMargin: 29.0,
        roe: 31.5,
        debtToEquity: 21.7,
        industry: "Technology",
        description:
          "Meta Platforms, Inc. engages in the development of products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide.",
      },
      JPM: {
        companyName: "JPMorgan Chase & Co.",
        currentPrice: 196.42,
        priceChange: 0.53,
        revenue: 154.9e9,
        netIncome: 49.6e9,
        netMargin: 32.0,
        roe: 17.8,
        debtToEquity: 521.3,
        industry: "Financial Services",
        description:
          "JPMorgan Chase & Co. operates as a financial services company worldwide. It operates through four segments: Consumer & Community Banking, Corporate & Investment Bank, Commercial Banking, and Asset & Wealth Management.",
      },
      V: {
        companyName: "Visa Inc.",
        currentPrice: 277.38,
        priceChange: 0.87,
        revenue: 32.6e9,
        netIncome: 17.3e9,
        netMargin: 53.1,
        roe: 45.2,
        debtToEquity: 68.9,
        industry: "Financial Services",
        description:
          "Visa Inc. operates as a payments technology company worldwide. The company operates VisaNet, a transaction processing network that enables authorization, clearing, and settlement of payment transactions.",
      },
    };

    // Merge base data with symbol-specific data
    return { ...baseData, ...stockSpecifics[symbol] };
  }

  /**
   * Generate random price history data
   * @returns {Array} Price history data
   */
  function generatePriceHistory() {
    const priceHistory = [];
    const today = new Date();
    let basePrice = 100; // Starting price

    // Generate daily prices for the past year (365 days)
    for (let i = 365; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Add some randomness to price movement
      // More realistic price movement with some trend and volatility
      const dailyChange = (Math.random() * 2 - 1) * (basePrice * 0.02);
      basePrice += dailyChange;

      // Ensure price doesn't go below 10
      basePrice = Math.max(basePrice, 10);

      priceHistory.push({
        date: date.toISOString().split("T")[0],
        price: parseFloat(basePrice.toFixed(2)),
      });
    }

    return priceHistory;
  }

  /**
   * Get a random industry for demo data
   * @returns {string} Industry name
   */
  function getRandomIndustry() {
    const industries = [
      "Technology",
      "Financial Services",
      "Healthcare",
      "Consumer Goods",
      "Industrial",
      "Energy",
      "Telecommunications",
      "Real Estate",
      "Utilities",
    ];

    return industries[Math.floor(Math.random() * industries.length)];
  }

  /**
   * Display stock data in the UI
   * @param {Object} data - Stock data
   * @param {string} symbol - Stock ticker symbol
   */
  function displayStockData(data, symbol) {
    // Format currency based on current selection
    const formatCurrency = (value) => {
      if (currentCurrency === "INR") {
        // Convert to INR and format
        return `₹${(value * exchangeRate).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}`;
      } else {
        // Format as USD
        return `$${value.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })}`;
      }
    };

    // Format percentage values
    const formatPercentage = (value) => {
      const formattedValue = value.toFixed(2);
      const cssClass = value >= 0 ? "positive" : "negative";
      const sign = value >= 0 ? "+" : "";
      return `<span class="${cssClass}">${sign}${formattedValue}%</span>`;
    };

    // Format large numbers (billions)
    const formatBillions = (value) => {
      const inBillions = value / 1e9;
      if (currentCurrency === "INR") {
        // Convert to INR and format
        return `₹${(inBillions * exchangeRate).toFixed(1)}B`;
      } else {
        // Format as USD
        return `$${inBillions.toFixed(1)}B`;
      }
    };

    // Create the stock price chart
    const priceChart = createStockPriceChart(data.priceHistory, symbol);

    // Build HTML for the stock results
    let resultsHTML = `
          <div class="stock-graph">
              ${priceChart}
          </div>
          
          <h3>Key Financial Metrics</h3>
          <div class="key-metrics">
              <div class="metric-card">
                  <div class="metric-label">Current Price</div>
                  <div class="metric-value">${formatCurrency(
                    data.currentPrice
                  )}</div>
              </div>
              <div class="metric-card">
                  <div class="metric-label">Price Change (%)</div>
                  <div class="metric-value">${formatPercentage(
                    data.priceChange
                  )}</div>
              </div>
              <div class="metric-card">
                  <div class="metric-label">Revenue</div>
                  <div class="metric-value">${formatBillions(
                    data.revenue
                  )}</div>
              </div>
              <div class="metric-card">
                  <div class="metric-label">Net Income</div>
                  <div class="metric-value">${formatBillions(
                    data.netIncome
                  )}</div>
              </div>
              <div class="metric-card">
                  <div class="metric-label">Net Margin (%)</div>
                  <div class="metric-value">${data.netMargin.toFixed(1)}%</div>
              </div>
              <div class="metric-card">
                  <div class="metric-label">ROE (%)</div>
                  <div class="metric-value">${data.roe.toFixed(1)}%</div>
              </div>
              <div class="metric-card">
                  <div class="metric-label">Debt-to-Equity (%)</div>
                  <div class="metric-value">${data.debtToEquity.toFixed(
                    1
                  )}%</div>
              </div>
          </div>
          
          <div class="company-info">
              <h3>Company Information</h3>
              <p><strong>Name:</strong> ${data.companyName}</p>
              <p><strong>Industry:</strong> ${data.industry}</p>
              <p><strong>Description:</strong> ${data.description}</p>
          </div>
      `;

    // Update the stock results container
    stockResults.innerHTML = resultsHTML;
  }

  /**
   * Create a stock price chart using SVG
   * @param {Array} priceHistory - Stock price history data
   * @param {string} symbol - Stock ticker symbol
   * @returns {string} SVG chart HTML
   */
  function createStockPriceChart(priceHistory, symbol) {
    // Only use the last 180 days of data for the chart
    const chartData = priceHistory.slice(-180);

    // Chart dimensions
    const width = 800;
    const height = 300;
    const padding = 40;

    // Find min and max values for scaling
    const prices = chartData.map((d) => d.price);
    const minPrice = Math.min(...prices) * 0.95; // 5% buffer
    const maxPrice = Math.max(...prices) * 1.05; // 5% buffer

    // Create scales for x and y axes
    const xScale = (i) =>
      (i / (chartData.length - 1)) * (width - padding * 2) + padding;
    const yScale = (price) =>
      height -
      ((price - minPrice) / (maxPrice - minPrice)) * (height - padding * 2) -
      padding;

    // Generate path data for the price line
    let pathData = `M ${xScale(0)} ${yScale(chartData[0].price)}`;
    for (let i = 1; i < chartData.length; i++) {
      pathData += ` L ${xScale(i)} ${yScale(chartData[i].price)}`;
    }

    // Generate SVG for the chart
    const svgChart = `
          <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
              <!-- X and Y axes -->
              <line x1="${padding}" y1="${height - padding}" x2="${
      width - padding
    }" y2="${height - padding}" stroke="gray" stroke-width="1" />
              <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${
      height - padding
    }" stroke="gray" stroke-width="1" />
              
              <!-- Chart title -->
              <text x="${
                width / 2
              }" y="20" text-anchor="middle" font-size="16">${symbol} Stock Price History (Last 180 Days)</text>
              
              <!-- Price line -->
              <path d="${pathData}" fill="none" stroke="#4285F4" stroke-width="2" />
              
              <!-- Price area -->
              <path d="${pathData} L ${xScale(chartData.length - 1)} ${
      height - padding
    } L ${xScale(0)} ${height - padding} Z" fill="#4285F4" fill-opacity="0.1" />
              
              <!-- Y-axis labels -->
              <text x="${padding - 5}" y="${yScale(
      minPrice
    )}" text-anchor="end" font-size="12">${minPrice.toFixed(2)}</text>
              <text x="${padding - 5}" y="${yScale(
      maxPrice
    )}" text-anchor="end" font-size="12">${maxPrice.toFixed(2)}</text>
              <text x="${padding - 5}" y="${yScale(
      (minPrice + maxPrice) / 2
    )}" text-anchor="end" font-size="12">${((minPrice + maxPrice) / 2).toFixed(
      2
    )}</text>
              
              <!-- X-axis labels (show 4 evenly spaced dates) -->
              <text x="${xScale(0)}" y="${
      height - padding + 15
    }" text-anchor="middle" font-size="10">${chartData[0].date}</text>
              <text x="${xScale(Math.floor(chartData.length / 3))}" y="${
      height - padding + 15
    }" text-anchor="middle" font-size="10">${
      chartData[Math.floor(chartData.length / 3)].date
    }</text>
              <text x="${xScale(Math.floor((chartData.length * 2) / 3))}" y="${
      height - padding + 15
    }" text-anchor="middle" font-size="10">${
      chartData[Math.floor((chartData.length * 2) / 3)].date
    }</text>
              <text x="${xScale(chartData.length - 1)}" y="${
      height - padding + 15
    }" text-anchor="middle" font-size="10">${
      chartData[chartData.length - 1].date
    }</text>
          </svg>
      `;

    return svgChart;
  }

  /**
   * Calculate financial summary from inputs
   */
  function calculateFinancialSummary() {
    // This is a minimal implementation for the Financial Planning page
    // You can expand it as needed

    // Get values from inputs
    const monthlyIncome =
      parseFloat(document.getElementById("monthly-income").value) || 0;
    const transportationCosts =
      parseFloat(document.getElementById("transportation-costs").value) || 0;
    const foodCosts =
      parseFloat(document.getElementById("food-costs").value) || 0;
    const outingExpenses =
      parseFloat(document.getElementById("outing-expenses").value) || 0;
    const otherCosts =
      parseFloat(document.getElementById("fixed-costs").value) || 0;
    const savings =
      parseFloat(document.getElementById("available-savings").value) || 0;

    // Calculate variable costs if enabled
    let variableCosts = 0;
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
        const value =
          parseFloat(document.getElementById(`${month}-costs`).value) || 0;
        variableCosts += value;
      });
    }

    // Calculate monthly and yearly metrics
    const monthlyExpenses =
      transportationCosts + foodCosts + outingExpenses + otherCosts;
    const yearlyExpenses = monthlyExpenses * 12 + variableCosts;
    const yearlyIncome = monthlyIncome * 12;
    const yearlyInvestmentCapacity = yearlyIncome - yearlyExpenses;
    const monthlyInvestmentCapacity = yearlyInvestmentCapacity / 12;

    // Store the investment capacity for use in recommendations
    window.investmentCapacity = yearlyInvestmentCapacity;

    // Display an alert with the summary
    alert(`Financial Summary:
Monthly Income: ${formatMoney(monthlyIncome)}
Monthly Expenses: ${formatMoney(monthlyExpenses)}
Monthly Investment Capacity: ${formatMoney(monthlyInvestmentCapacity)}

Yearly Income: ${formatMoney(yearlyIncome)}
Yearly Expenses: ${formatMoney(yearlyExpenses)}
Yearly Investment Capacity: ${formatMoney(yearlyInvestmentCapacity)}`);
  }

  /**
   * Format money values with currency symbol
   * @param {number} amount - Amount to format
   * @returns {string} Formatted money string
   */
  function formatMoney(amount) {
    if (currentCurrency === "INR") {
      return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
    } else {
      return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
    }
  }

  /**
   * Send message in the financial advisor chat
   */
  function sendMessage() {
    const message = textarea.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, "user");
    textarea.value = "";

    // Simulate bot response
    setTimeout(() => {
      // Basic responses
      let botResponse = "I'm sorry, I don't have an answer for that right now.";

      // Very simple keyword matching
      if (message.toLowerCase().includes("invest")) {
        botResponse =
          "Based on your risk tolerance and financial goals, I would recommend a diversified portfolio of stocks and bonds. Would you like specific investment advice?";
      } else if (message.toLowerCase().includes("save")) {
        botResponse =
          "Saving regularly is important for financial stability. It's recommended to save at least 20% of your income. Have you set up an emergency fund yet?";
      } else if (message.toLowerCase().includes("debt")) {
        botResponse =
          "Managing debt is crucial. Start by paying off high-interest debt first, like credit cards, while maintaining minimum payments on other debts.";
      } else if (message.toLowerCase().includes("retirement")) {
        botResponse =
          "It's never too early to plan for retirement. Consider tax-advantaged accounts like 401(k)s or IRAs. Contributing early and consistently can make a huge difference due to compound interest.";
      } else if (message.toLowerCase().includes("budget")) {
        botResponse =
          "Creating a budget helps you track spending and save more effectively. The 50/30/20 rule is a good starting point: 50% for needs, 30% for wants, and 20% for savings.";
      }

      addMessage(botResponse, "bot");
    }, 1000);
  }

  /**
   * Add message to the chat
   * @param {string} content - Message content
   * @param {string} sender - Message sender ('user' or 'bot')
   */
  function addMessage(content, sender) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = content;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});

// Sidebar functions (for completeness)
function closeNav() {
  document.getElementById("mySidebar").style.width = "70px";
  document.querySelector(".closebtn").style.display = "none";
  document.querySelectorAll(".sidebar-list span").forEach(function (item) {
    item.style.display = "none";
  });
}

function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.querySelector(".closebtn").style.display = "block";
  setTimeout(function () {
    document.querySelectorAll(".sidebar-list span").forEach(function (item) {
      item.style.display = "inline";
    });
  }, 200);
}

function filterDashboard() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toUpperCase();
  const sidebar = document.getElementById("mySidebar");
  const links = sidebar.getElementsByTagName("a");

  for (let i = 0; i < links.length; i++) {
    const txtValue = links[i].textContent || links[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      links[i].style.display = "";
    } else {
      links[i].style.display = "none";
    }
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------
// Investment Recommendations
// -------------------------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------------------------------
// Financial Advisor Chat
// -------------------------------------------------------------------------------------------------------------------------------------
