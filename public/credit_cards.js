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
  window.closeDetails = function () {
    let detailsSection = document.querySelector(".sec");
    let cardDetailsSection = document.getElementById("cardDetailsSection");

    if (detailsSection) {
      detailsSection.classList.remove("details-visible");
    }

    if (cardDetailsSection) {
      cardDetailsSection.style.display = "none";
    }

    // Reset layout for smaller screens
    if (window.innerWidth <= 1109) {
      let cardList = document.getElementById("cardlist");
      let cardStatistics = document.getElementById("Cardstatistics");
      let tableSection = document.getElementById("table");

      if (cardList && cardStatistics && tableSection) {
        cardList.style.width = "100%";
        cardStatistics.style.width = "100%";
        tableSection.style.width = "100%";
      }
    }
  };

  // Function to create or update the expense chart
  function createExpenseChart(chartData) {
    const ctx = document.getElementById("expenseChart").getContext("2d");

    // Destroy existing chart if it exists
    if (window.expenseChartInstance) {
      window.expenseChartInstance.destroy();
    }

    // Create new chart instance
    window.expenseChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              boxWidth: 10,
              font: { size: 14 },
              generateLabels: function (chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, index) => {
                    const value = data.datasets[0].data[index];
                    return {
                      text: `${
                        label || "Unknown"
                      } (₹${value.toLocaleString()})`,
                      fillStyle: data.datasets[0].backgroundColor[index],
                      hidden: false,
                      index: index,
                    };
                  });
                }
                return [];
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed || 0;
                return `${label}: ₹${value.toLocaleString()}`;
              },
            },
          },
        },
      },
    });
  }

  // Fetch and render expense chart
  function fetchExpenseChartData() {
    fetch("/api/bank-expenses")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch bank expenses: " + response.statusText
          );
        }
        return response.json();
      })
      .then((chartData) => {
        console.log("Fetched expense data:", chartData); // Add logging for debugging
        // Check if there's data to display
        if (chartData.labels.length === 0) {
          document.getElementById("expenseChart").parentElement.innerHTML =
            '<div class="text-center text-gray-500">No expense data available for the last 30 days</div>'; // More specific message
          return;
        }
        // Create chart with fetched data
        createExpenseChart(chartData);
      })
      .catch((error) => {
        console.error("Error fetching expense chart data:", error);
        document.getElementById("expenseChart").parentElement.innerHTML =
          '<div class="text-center text-red-500">Unable to load expense chart: ' +
          error.message +
          "</div>";
      });
  }

  // Initial fetch of expense chart data
  fetchExpenseChartData();
});

document.addEventListener("DOMContentLoaded", function () {
  const cardListContainer = document.getElementById("cardListContainer");

  // Function to mask card number
  function maskCardNumber(cardNumber) {
    if (!cardNumber) return "**** **** **** ****";
    // Keep last 4 digits visible, replace others with *
    return "**** **** **** " + cardNumber.slice(-4);
  }

  // Function to format date
  function formatDate(dateString) {
    if (!dateString) return "--/--";
    const date = new Date(dateString);
    return `${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
  }

  // Fetch credit cards
  fetch("/api/user-credit-cards", {
    method: "GET",
    credentials: "include", // Important for session-based authentication
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch credit cards");
      }
      return response.json();
    })
    .then((cards) => {
      // Clear any existing content
      cardListContainer.innerHTML = "";

      // If no cards, show a message
      if (cards.length === 0) {
        cardListContainer.innerHTML = `
                <div class="no-cards-message">
                    <p>No credit cards found. Add a new card to get started.</p>
                </div>
            `;
        return;
      }

      // Render each card
      cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("listdetails");
        cardElement.innerHTML = `
                <div>
                    <h4>Card Type</h4>
                    <p>${
                      card.card_type.charAt(0).toUpperCase() +
                      card.card_type.slice(1)
                    }</p>
                </div>
                <div>
                    <h4>Name on Card</h4>
                    <p>${card.cardholder_name}</p>
                </div>
                <div>
                    <h4>Card Number</h4>
                    <p>${maskCardNumber(card.card_number)}</p>
                </div>
                <div>
                    <h4>Expiration</h4>
                    <p>${formatDate(card.valid_thru)}</p>
                </div>
               <div>
            <button class="viewDetails">View Details</button>
        </div>
    `;

        // Get the button and set dataset attributes
        const viewButton = cardElement.querySelector(".viewDetails");
        viewButton.dataset.cardType = card.card_type;
        viewButton.dataset.name = card.cardholder_name;
        viewButton.dataset.bank = card.bank_name || "Unknown Bank";
        viewButton.dataset.number = card.card_number;
        viewButton.dataset.validfrom = formatDate(card.valid_from);
        viewButton.dataset.expiry = formatDate(card.valid_thru);
        cardListContainer.appendChild(cardElement);
      });

      // View Details Button Click
      document.querySelectorAll(".viewDetails").forEach((button) => {
        button.addEventListener("click", function (event) {
          event.preventDefault();

          // Update card details
          let detailBankName = document.getElementById("detailBankName");
          let detailCardType = document.getElementById("detailCardType");
          let detailNameOnCard = document.getElementById("detailNameOnCard");
          let detailCardNumber = document.getElementById("detailCardNumber");
          let detailValidFrom = document.getElementById("detailValidFrom");
          let detailExpirationDate = document.getElementById(
            "detailExpirationDate"
          );
          let detailBillAmount = document.getElementById("detailBillAmount");
          let detailDueDate = document.getElementById("detailDueDate");
          let detailMinDue = document.getElementById("detailMinDue");
          let benefitsList = document.getElementById("benefitsList");

          if (
            !detailBankName ||
            !detailCardType ||
            !detailNameOnCard ||
            !detailCardNumber ||
            !detailValidFrom ||
            !detailExpirationDate ||
            !detailBillAmount ||
            !detailDueDate ||
            !detailMinDue ||
            !benefitsList
          ) {
            console.error("One or more elements are missing in the document.");
            return;
          }

          let bankName = this.dataset.bank;
          let cardNumber = this.dataset.number || "XXXX";

          // Update card details
          detailBankName.innerText = bankName || "N/A";
          detailCardType.innerText = this.dataset.cardType || "N/A";
          detailNameOnCard.innerText = this.dataset.name || "N/A";
          detailCardNumber.innerText = cardNumber || "N/A";
          detailValidFrom.innerText = this.dataset.validfrom || "N/A";
          detailExpirationDate.innerText = this.dataset.expiry || "N/A";

          // Fetch bill details from the API
          fetch(`/api/credit-card-bill?cardNumber=${cardNumber}`)
            .then((response) => {
              if (!response.ok) {
                if (response.status === 404) {
                  // Handle no bill found
                  throw new Error("No bill found for this card");
                }
                throw new Error("Failed to fetch bill details");
              }
              return response.json();
            })
            .then((billDetails) => {
              let detailBillAmount =
                document.getElementById("detailBillAmount");
              let detailDueDate = document.getElementById("detailDueDate");
              let detailMinDue = document.getElementById("detailMinDue");

              if (detailBillAmount && detailDueDate && detailMinDue) {
                const currentBill = Number(billDetails.current_bill);
                const minimumAmountDue = Number(billDetails.minimum_amount_due);

                detailBillAmount.innerText = `₹${
                  !isNaN(currentBill)
                    ? currentBill.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })
                    : "0.00"
                }`;
                detailDueDate.innerText = billDetails.due_date || "N/A";
                detailMinDue.innerText = `₹${
                  !isNaN(minimumAmountDue)
                    ? minimumAmountDue.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })
                    : "0.00"
                }`;

                console.log("Bill Details:", billDetails);
              }
            })
            .catch((error) => {
              console.error("Error fetching bill details:", error);
              let detailBillAmount =
                document.getElementById("detailBillAmount");
              let detailDueDate = document.getElementById("detailDueDate");
              let detailMinDue = document.getElementById("detailMinDue");

              if (detailBillAmount && detailDueDate && detailMinDue) {
                detailBillAmount.innerText =
                  error.message === "No bill found for this card"
                    ? "No bill available"
                    : "N/A";
                detailDueDate.innerText = "N/A";
                detailMinDue.innerText = "N/A";
              }
            });

          // Update benefits and offers
          let bankOffers = {
            "State Bank of India": [
              "5% cashback on groceries",
              "Fuel surcharge waiver",
              "Dining discounts",
              "1% cashback on utility bill payments",
              "Complimentary airport lounge access",
              "Travel insurance coverage",
              "Exclusive discounts on flight bookings",
            ],
            "HDFC Bank": [
              "10x reward points on shopping",
              "Airport lounge access",
              "EMI conversion",
              "5% cashback on online shopping",
              "Complimentary golf games",
              "Exclusive discounts on luxury hotels",
              "Fuel surcharge waiver",
            ],
            "ICICI Bank": [
              "Movie ticket discounts",
              "Complimentary travel insurance",
              "Online shopping offers",
              "5% cashback on Amazon purchases",
              "Fuel surcharge waiver",
              "Exclusive discounts on dining",
              "1.5% forex markup",
            ],
            "Axis Bank": [
              "1.5% forex markup",
              "Travel rewards",
              "Fuel surcharge waiver",
              "5% cashback on Flipkart",
              "Complimentary airport transfers",
              "Exclusive discounts on spa services",
              "Priority pass for airport lounges",
            ],
            "Kotak Mahindra Bank": [
              "Zero annual fee",
              "5% cashback on UPI transactions",
              "Premium lounge access",
              "10% discount on movie tickets",
              "Fuel surcharge waiver",
              "Exclusive discounts on dining",
              "Complimentary travel insurance",
            ],
            "Punjab National Bank": [
              "2x reward points on fuel",
              "1% cashback on bill payments",
              "Zero processing fee on loans",
              "5% cashback on online shopping",
              "Complimentary airport lounge access",
              "Exclusive discounts on travel bookings",
              "Fuel surcharge waiver",
            ],
            "Bank of Baroda": [
              "1.25% cashback on online spending",
              "Free accidental insurance",
              "Exclusive hotel discounts",
              "5% cashback on dining",
              "Complimentary airport lounge access",
              "Fuel surcharge waiver",
              "Travel insurance coverage",
            ],
            "Canara Bank": [
              "Low interest rates",
              "No annual fee for first year",
              "Cashback on select merchants",
              "5% cashback on fuel",
              "Complimentary travel insurance",
              "Exclusive discounts on dining",
              "Fuel surcharge waiver",
            ],
            "Union Bank of India": [
              "5% discount on travel bookings",
              "Accelerated reward points",
              "Zero liability fraud protection",
              "5% cashback on online shopping",
              "Complimentary airport lounge access",
              "Fuel surcharge waiver",
              "Exclusive discounts on dining",
            ],
            "IndusInd Bank": [
              "Luxury hotel & dining offers",
              "Free movie tickets",
              "Travel insurance benefits",
              "5% cashback on online shopping",
              "Complimentary airport lounge access",
              "Fuel surcharge waiver",
              "Exclusive discounts on spa services",
            ],
          };

          benefitsList.innerHTML = "";
          let selectedBenefits = bankOffers[bankName] || [
            "No special offers available",
          ];
          selectedBenefits.forEach((benefit) => {
            let li = document.createElement("li");
            li.innerText = benefit;
            benefitsList.appendChild(li);
          });

          let detailsSection = document.querySelector(".sec");
          let cardDetailsSection =
            document.getElementById("cardDetailsSection");

          if (detailsSection) {
            detailsSection.classList.add("details-visible");
          }

          if (cardDetailsSection) {
            cardDetailsSection.style.display = "block";
          }

          // Adjust layout for smaller screens
          if (window.innerWidth <= 1109) {
            let cardList = document.getElementById("cardlist");
            let cardStatistics = document.getElementById("Cardstatistics");
            let tableSection = document.getElementById("table");

            if (cardList && cardStatistics && tableSection) {
              cardList.style.width = "100%";
              cardStatistics.style.width = "100%";
              tableSection.style.width = "100%";
            }
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching credit cards:", error);
      cardListContainer.innerHTML = `
            <div class="error-message">
                <p>Unable to load credit cards. Please try again later.</p>
            </div>
        `;
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const dueDatesTableBody = document.querySelector(".due-dates-table tbody");

  // Fetch credit card dues
  fetch("/api/credit-card-dues")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch credit card dues");
      }
      return response.json();
    })
    .then((dues) => {
      // Clear existing rows
      dueDatesTableBody.innerHTML = "";

      // Populate table with fetched dues
      dues.forEach((due, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${(index + 1).toString().padStart(2, "0")}.</td>
                    <td>${due.cardholder_name}</td>
                    <td>${due.masked_card_number}</td>
                    <td>₹${parseFloat(due.current_bill).toLocaleString(
                      "en-IN",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}</td>
                    <td>${due.formatted_due_date}</td>
                    <td data-status="${
                      due.status.charAt(0).toUpperCase() + due.status.slice(1)
                    }">${
          due.status.charAt(0).toUpperCase() + due.status.slice(1)
        }</td>
                `;
        dueDatesTableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      dueDatesTableBody.innerHTML = `
                <tr>
                    <td colspan="6">Unable to load credit card dues. Please try again later.</td>
                </tr>
            `;
    });
});
