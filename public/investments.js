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

document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", function () {
    document
      .querySelectorAll(".filter-btn")
      .forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("investmentChart").getContext("2d");

  let investmentChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: generateLabels("1Y"),
      datasets: [
        {
          label: "Portfolio Value",
          data: generateData("1Y"),
          borderColor: "blue",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: false },
      },
    },
  });

  function generateLabels(timeframe) {
    const now = new Date();
    let labels = [];

    if (timeframe === "1D") {
      for (let i = 0; i < 24; i++) labels.push(`${i}:00`);
    } else if (timeframe === "1M") {
      for (let i = 30; i >= 0; i--) {
        let d = new Date();
        d.setDate(now.getDate() - i);
        labels.push(d.toLocaleDateString());
      }
    } else if (timeframe === "6M") {
      for (let i = 5; i >= 0; i--) {
        let d = new Date();
        d.setMonth(now.getMonth() - i);
        labels.push(d.toLocaleString("default", { month: "short" }));
      }
    } else if (timeframe === "1Y") {
      for (let i = 11; i >= 0; i--) {
        let d = new Date();
        d.setMonth(now.getMonth() - i);
        labels.push(d.toLocaleString("default", { month: "short" }));
      }
    }

    return labels;
  }

  function generateData(timeframe) {
    if (timeframe === "1D")
      return Array(24)
        .fill()
        .map(() => Math.floor(Math.random() * 200) + 100);
    if (timeframe === "1M")
      return Array(31)
        .fill()
        .map(() => Math.floor(Math.random() * 200) + 100);
    if (timeframe === "6M")
      return Array(6)
        .fill()
        .map(() => Math.floor(Math.random() * 200) + 100);
    if (timeframe === "1Y")
      return Array(12)
        .fill()
        .map(() => Math.floor(Math.random() * 200) + 100);
  }

  function updateChart(timeframe) {
    investmentChart.data.labels = generateLabels(timeframe);
    investmentChart.data.datasets[0].data = generateData(timeframe);
    investmentChart.update();
  }

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      updateChart(this.getAttribute("data-timeframe"));
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("revenueChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["2016", "2017", "2018", "2019", "2020", "2021"],
      datasets: [
        {
          label: "Revenue",
          data: [8008, 12000, 18000, 25000, 21000, 34000],
          borderColor: "#00c2ff",
          backgroundColor: "transparent",
          borderWidth: 3,
          pointRadius: 0 /* Hide Data Points */,
          tension: 0.4 /* Smooth Curve */,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "$" + value.toLocaleString();
            },
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
    },
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("totalinvestmentChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["2016", "2017", "2018", "2019", "2020", "2021"],
      datasets: [
        {
          label: "Total Investment",
          data: [5000, 20000, 15000, 35000, 18000, 25000],
          borderColor: "#FFA500", // Orange Line
          backgroundColor: "transparent",
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: "#FFA500",
          pointBorderColor: "#ffffff",
          pointHoverRadius: 7,
          tension: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "$" + value.toLocaleString();
            },
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
    },
  });
});

// Configuration
const API_KEY = "AEM70DPOO3L91TMY"; // actual Alpha Vantage API key
// Alpha Vantage Free Tier API has limit. 25 requests per day and 5 requests per miniute.
const TRENDING_SYMBOLS = ["MSFT", "AAPL", "AMZN", "GOOGL", "META"]; // Example stock symbols to track

// Function to fetch stock data for a specific symbol
async function fetchStockData(symbol) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();

    // Check if we have valid data
    if (data["Global Quote"]) {
      const quote = data["Global Quote"];
      return {
        symbol: symbol,
        name: symbol, // Alpha Vantage doesn't provide company names in this endpoint
        price: parseFloat(quote["05. price"]).toFixed(2),
        change: parseFloat(quote["09. change"]).toFixed(2),
        changePercent: quote["10. change percent"].replace("%", ""),
      };
    } else {
      console.error("Invalid data received for", symbol, data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data for", symbol, error);
    return null;
  }
}

// Function to get company names (optional, as Alpha Vantage Global Quote doesn't provide names)
// You would need a separate API call or a local mapping
const companyNames = {
  MSFT: "Microsoft",
  AAPL: "Apple",
  AMZN: "Amazon",
  GOOGL: "Google",
  META: "Meta",
};

// Function to populate the table with stock data
async function populateTrendingStocks() {
  const tableBody = document.querySelector(".stock-container tbody");
  tableBody.innerHTML = ""; // Clear existing data

  // Show loading state
  for (let i = 0; i < TRENDING_SYMBOLS.length; i++) {
    tableBody.innerHTML += `
      <tr>
        <td>${(i + 1).toString().padStart(2, "0")}.</td>
        <td>Loading...</td>
        <td>...</td>
        <td>...</td>
      </tr>
    `;
  }

  // Fetch all stock data in parallel
  const stockDataPromises = TRENDING_SYMBOLS.map((symbol) =>
    fetchStockData(symbol)
  );
  const stockDataResults = await Promise.all(stockDataPromises);

  // Filter out any failed requests
  const stockData = stockDataResults.filter((data) => data !== null);

  // Sort by change percent (optional)
  stockData.sort(
    (a, b) => parseFloat(b.changePercent) - parseFloat(a.changePercent)
  );

  // Clear the table again
  tableBody.innerHTML = "";

  // Populate with actual data
  stockData.forEach((stock, index) => {
    const isPositive = parseFloat(stock.changePercent) >= 0;
    const changeClass = isPositive ? "positive" : "negative";
    const changeSymbol = isPositive ? "+" : "";

    tableBody.innerHTML += `
      <tr>
        <td>${(index + 1).toString().padStart(2, "0")}.</td>
        <td>${companyNames[stock.symbol] || stock.symbol}</td>
        <td>$${stock.price}</td>
        <td class="${changeClass}">${changeSymbol}${stock.changePercent}%</td>
      </tr>
    `;
  });
}

// Function to refresh the data periodically
function initTrendingStocks() {
  populateTrendingStocks();

  // Refresh data every 5 minutes (300000 ms)
  // Alpha Vantage has rate limits, so don't set this too low
  setInterval(populateTrendingStocks, 300000);
}

// Initialize when the DOM is loaded
document.addEventListener("DOMContentLoaded", initTrendingStocks);

document.addEventListener("DOMContentLoaded", function () {
  // Fetch the user investment data from the server
  fetch("/api/user-investments")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Not authenticated or server error");
      }
      return response.json();
    })
    .then((investments) => {
      console.log("User Investments:", investments);

      // Create an array of the user's stock symbols
      const userSymbols = investments.map((investment) => investment.symbol);

      // Fetch current price data for all user investments
      Promise.all(userSymbols.map((symbol) => fetchStockData(symbol))).then(
        (stockDataResults) => {
          // Filter out any failed requests
          const stockData = stockDataResults.filter((data) => data !== null);

          // Create a map for easy lookup
          const stockDataMap = {};
          stockData.forEach((stock) => {
            stockDataMap[stock.symbol] = stock;
          });

          // Now combine the user investment data with the current stock data
          const investmentContainer =
            document.querySelector(".myinvestment-container") ||
            document.getElementById("myinvestment-container");
          if (investmentContainer) {
            investmentContainer.innerHTML = ""; // Clear existing content

            // Create an investment card for each investment
            investments.forEach((investment) => {
              const currentData = stockDataMap[investment.symbol];
              if (!currentData) return; // Skip if we couldn't get current data

              // Calculate return percentage
              const purchasePrice = parseFloat(investment.price);
              const currentPrice = parseFloat(currentData.price);
              const returnPercent = (
                ((currentPrice - purchasePrice) / purchasePrice) *
                100
              ).toFixed(1);
              const isPositive = returnPercent >= 0;

              // Calculate total value
              const totalValue = (
                currentPrice * (investment.shares || 1)
              ).toFixed(2);

              // Get company name or use symbol as fallback
              const companyName =
                companyNames[investment.symbol] || investment.symbol;

              // Create the investment card
              const card = document.createElement("div");
              card.className = "investment-card";

              // Base64 encoded placeholder image - simple grayscale icon
              const placeholderImage =
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wIFBCkQ7L3jfAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACWUlEQVR42u3dO47CQBCF4TbXYE9stiQba5dEztmC5zZIXIBwAQgXgHAB5ApkQnL2NrykaT5/9JMsZTRPpdfdVTMAAAAAAAAAELfCOYdxHHMYhoVz7uacy845i+M4b4aInHNWluXtmh8hPiHLstJCvB/CMCyaprk1TXPb7/e23W7tfr83fmL+Pp/PbTab2WQyseVyaev12na7nR0Oh8ckSSzP86soityEiIcsy9JOpxM/L1f7dDo+x1E5jh+EJU3TxCRJPs5fr9c23VLbtmlxHN+yLLOiKCyKopsPiLQQwzD0GZzOt6iqyoqiuBVFcYui6JYkyS2O41sYhl9JiN1ud4PjOKvr2qqqsqqqbLPZ2GKxsNlsZtPp1KbTqY3H46s5Ghoh0zS1xWJh+/3eDodDL6AxMtI0tfP5bJfLpa9rXK9X4yM03/NttVq5AyWF+GszDMPBE+LzpHXJCNm/RIhTQgg6QwjJaEIw/bMnhAjZEYJpiQhh+RNCcvEI+cv9LCL/GBFCnRNCk5oQ+rpXihC614TQXVRECP1tQhjQEMKIjRgJYUgtiQjhdQshvJAihDekCKGQOoXwylsEEVJICCGVFiH8YymFCOGvbEIopoRQcL0ihDcZhPDOTwQRQhkmhIJOSK8QXrsL6xXCp0LE9Arh4zJieoXwAVfxXiH8iHIIvUL4IfYQeoXws1QcvUK49DIEEUJJJoTCLYoI4WKEEPZHRRARQn0mhColh6UolyP+9guhlB8ihPsiQgi3R0QQIfw6JmRQCL+wCeHTwLBXCL8eEjMoBFfyAAAAAAAAAJT5BVTvF9v9xnXbAAAAAElFTkSuQmCC";
              card.innerHTML = `
                <img src="https://logo.clearbit.com/${companyName
                  .toLowerCase()
                  .replace(/\s+/g, "")}.com" 
                     alt="${companyName} Logo" 
                     onerror="this.src='${placeholderImage}'">
                <div class="investment-info">
                    <h3>${companyName}</h3>
                    <p>${getIndustryForSymbol(investment.symbol)}</p>
                </div>
                <div class="investment-value">
                    <p>$${totalValue}</p>
                    <p class="return ${isPositive ? "positive" : "negative"}">
                      ${isPositive ? "+" : ""}${returnPercent}%
                    </p>
                </div>
              `;

              investmentContainer.appendChild(card);
            });
          }
        }
      );
    })
    .catch((error) => {
      console.error("Error fetching investments:", error);
    });
});

// Function to get industry for a given symbol (you can expand this)
function getIndustryForSymbol(symbol) {
  const industries = {
    AAPL: "Consumer Electronics",
    MSFT: "Software",
    AMZN: "E-Commerce",
    GOOGL: "Internet Services",
    META: "Social Media",
    TSLA: "Electric Vehicles",
    // Add more as needed
  };

  return industries[symbol] || "Technology";
}
