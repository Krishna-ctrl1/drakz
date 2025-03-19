document.addEventListener("DOMContentLoaded", function () {
    // Expense Chart
    const ctx = document.getElementById("expenseChart").getContext("2d");
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["DBL Bank", "BRC Bank", "ABM Bank", "MCP Bank"],
            datasets: [
                {
                    data: [30, 25, 20, 25],
                    backgroundColor: ["#3b82f6", "#38bdf8", "#06b6d4", "#4f46e5"],
                    borderWidth: 2,
                },
            ],
        },
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
                    },
                },
            },
        },
    });

    // View Details Button Click
    document.querySelectorAll(".viewDetails").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            // Update card details
            let detailBankName = document.getElementById("detailBankName");
            let detailCardType = document.getElementById("detailCardType");
            let detailNameOnCard = document.getElementById("detailNameOnCard");
            let detailCardNumber = document.getElementById("detailCardNumber");
            let detailValidFrom = document.getElementById("detailValidFrom");
            let detailExpirationDate = document.getElementById("detailExpirationDate");
            let detailBillAmount = document.getElementById("detailBillAmount");
            let detailDueDate = document.getElementById("detailDueDate");
            let detailMinDue = document.getElementById("detailMinDue");
            let benefitsList = document.getElementById("benefitsList");

            if (!detailBankName || !detailCardType || !detailNameOnCard || !detailCardNumber ||
                !detailValidFrom || !detailExpirationDate || !detailBillAmount ||
                !detailDueDate || !detailMinDue || !benefitsList) {
                console.error("One or more elements are missing in the document.");
                return;
            }

            let bankName = this.dataset.bank;
            let cardNumber = this.dataset.number || "XXXX";

            // Update card details
            detailBankName.innerText = bankName || "N/A";
            detailCardType.innerText = this.dataset.cardType || "N/A";
            detailNameOnCard.innerText = this.dataset.name || "N/A";
            detailCardNumber.innerText = "**** **** **** " + cardNumber.slice(-4); 
            detailValidFrom.innerText = this.dataset.validfrom || "N/A";
            detailExpirationDate.innerText = this.dataset.expiry || "N/A";

            // Random bill and due date
            let randomBill = Math.floor(Math.random() * 10000) + 1000;
            let randomMinDue = Math.floor(randomBill * 0.2);
            let dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 15) + 5);
            let formattedDueDate = dueDate.toISOString().split("T")[0];

            detailBillAmount.innerText = `₹${randomBill}`;
            detailDueDate.innerText = formattedDueDate;
            detailMinDue.innerText = `₹${randomMinDue}`;

            // Update benefits and offers
            let bankOffers = {
                "State Bank of India": [
                    "5% cashback on groceries",
                    "Fuel surcharge waiver",
                    "Dining discounts",
                    "1% cashback on utility bill payments",
                    "Complimentary airport lounge access",
                    "Travel insurance coverage",
                    "Exclusive discounts on flight bookings"
                ],
                "HDFC Bank": [
                    "10x reward points on shopping",
                    "Airport lounge access",
                    "EMI conversion",
                    "5% cashback on online shopping",
                    "Complimentary golf games",
                    "Exclusive discounts on luxury hotels",
                    "Fuel surcharge waiver"
                ],
                "ICICI Bank": [
                    "Movie ticket discounts",
                    "Complimentary travel insurance",
                    "Online shopping offers",
                    "5% cashback on Amazon purchases",
                    "Fuel surcharge waiver",
                    "Exclusive discounts on dining",
                    "1.5% forex markup"
                ],
                "Axis Bank": [
                    "1.5% forex markup",
                    "Travel rewards",
                    "Fuel surcharge waiver",
                    "5% cashback on Flipkart",
                    "Complimentary airport transfers",
                    "Exclusive discounts on spa services",
                    "Priority pass for airport lounges"
                ],
                "Kotak Mahindra Bank": [
                    "Zero annual fee",
                    "5% cashback on UPI transactions",
                    "Premium lounge access",
                    "10% discount on movie tickets",
                    "Fuel surcharge waiver",
                    "Exclusive discounts on dining",
                    "Complimentary travel insurance"
                ],
                "Punjab National Bank": [
                    "2x reward points on fuel",
                    "1% cashback on bill payments",
                    "Zero processing fee on loans",
                    "5% cashback on online shopping",
                    "Complimentary airport lounge access",
                    "Exclusive discounts on travel bookings",
                    "Fuel surcharge waiver"
                ],
                "Bank of Baroda": [
                    "1.25% cashback on online spending",
                    "Free accidental insurance",
                    "Exclusive hotel discounts",
                    "5% cashback on dining",
                    "Complimentary airport lounge access",
                    "Fuel surcharge waiver",
                    "Travel insurance coverage"
                ],
                "Canara Bank": [
                    "Low interest rates",
                    "No annual fee for first year",
                    "Cashback on select merchants",
                    "5% cashback on fuel",
                    "Complimentary travel insurance",
                    "Exclusive discounts on dining",
                    "Fuel surcharge waiver"
                ],
                "Union Bank of India": [
                    "5% discount on travel bookings",
                    "Accelerated reward points",
                    "Zero liability fraud protection",
                    "5% cashback on online shopping",
                    "Complimentary airport lounge access",
                    "Fuel surcharge waiver",
                    "Exclusive discounts on dining"
                ],
                "IndusInd Bank": [
                    "Luxury hotel & dining offers",
                    "Free movie tickets",
                    "Travel insurance benefits",
                    "5% cashback on online shopping",
                    "Complimentary airport lounge access",
                    "Fuel surcharge waiver",
                    "Exclusive discounts on spa services"
                ]
            };

            benefitsList.innerHTML = "";
            let selectedBenefits = bankOffers[bankName] || ["No special offers available"];
            selectedBenefits.forEach(benefit => {
                let li = document.createElement("li");
                li.innerText = benefit;
                benefitsList.appendChild(li);
            });

            // Show the details section and adjust layout
            let detailsSection = document.querySelector(".sec");
            let cardDetailsSection = document.getElementById("cardDetailsSection");
            let cardList = document.getElementById("cardlist");
            let cardStatistics = document.getElementById("Cardstatistics");
            let tableSection = document.getElementById("table");

            if (detailsSection) {
                detailsSection.classList.add("details-visible");
            }

            if (cardDetailsSection) {
                cardDetailsSection.style.display = "block";
            }

            if (cardList && cardStatistics && tableSection) {
                cardList.style.width = "100%";
                cardStatistics.style.width = "100%";
                tableSection.style.width = "100%";
            }
        });
    });

    // Function to close details
    window.closeDetails = function () {
        let detailsSection = document.querySelector(".sec");
        let cardDetailsSection = document.getElementById("cardDetailsSection");
        let cardList = document.getElementById("cardlist");
        let cardStatistics = document.getElementById("Cardstatistics");
        let tableSection = document.getElementById("table");

        if (detailsSection) {
            detailsSection.classList.remove("details-visible");
        }

        if (cardDetailsSection) {
            cardDetailsSection.style.display = "none";
        }

        if (cardList && cardStatistics && tableSection) {
            cardList.style.width = "100%";
            cardStatistics.style.width = "50%";
            tableSection.style.width = "50%";
        }
    };
});