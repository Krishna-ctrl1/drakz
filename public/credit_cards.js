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

    // Initialize Swiper
    const swiper = new Swiper('.swiper-container', {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Card Form Handling
    const addCardForm = document.getElementById("addCardForm");
    const cardListContainer = document.getElementById("cardListContainer");

    // Format Card Number
    document.getElementById("cardNumber").addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/(.{4})/g, "$1 ").trim();
        if (value.length > 19) {
            value = value.slice(0, 19);
        }
        e.target.value = value;
    });

    // Format "Valid From" and "Expiration Date" inputs
    document.getElementById('validFrom').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    document.getElementById('cardExpiry').addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });

    // Handle form submission
    addCardForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        // Get form values
        const cardType = document.getElementById('cardType').value;
        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const validFrom = document.getElementById('validFrom').value;
        const cardExpiry = document.getElementById('cardExpiry').value;

        // Validate card number (16 digits)
        if (!/^\d{16}$/.test(cardNumber)) {
            showError('cardNumber', 'Card number must be 16 digits.');
            return;
        }

        // Validate "Valid From" date
        if (!validateDateFormat(validFrom)) {
            showError('validFrom', 'Valid From date must be in MM/YY format.');
            return;
        }
        if (!isPastDate(validFrom)) {
            showError('validFrom', 'Valid From date must be in the past.');
            return;
        }

        // Validate expiration date (MM/YY)
        if (!validateDateFormat(cardExpiry)) {
            showError('cardExpiry', 'Expiration date must be in MM/YY format.');
            return;
        }
        if (!isFutureDate(cardExpiry)) {
            showError('cardExpiry', 'Expiration date must be in the future.');
            return;
        }

        // Ensure Valid Thru is after Valid From
        if (!compareDates(validFrom, cardExpiry)) {
            showError('cardExpiry', 'Expiration date must be after Valid From date.');
            return;
        }

        // Create a new card slide for Swiper
        const newSlide = document.createElement('div');
        newSlide.classList.add('swiper-slide');
        newSlide.innerHTML = `
            <div class="card">
                <img src="cards/bank-iconn.png" alt="Bank Logo" class="bank-logo">
                <img src="https://cdn-icons-png.flaticon.com/128/9334/9334627.png" alt="Chip" class="chip">
                <div class="card-number">${cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}</div>
                <div class="validity">
                    <div><span>VALID FROM</span><br><strong>${validFrom}</strong></div>
                    <div><span>VALID THRU</span><br><strong>${cardExpiry}</strong></div>
                </div>
                <div class="cardholder-name">${cardName}</div>
                <img src="https://cdn-icons-png.flaticon.com/128/5968/5968299.png" alt="VISA Logo" class="visa-logo">
            </div>
        `;

        // Append the new slide to the Swiper wrapper
        document.querySelector('.swiper-wrapper').appendChild(newSlide);
        swiper.update();
        swiper.pagination.update();
        swiper.pagination.render();
        updatePaginationVisibility();
        updateNoCardsMessage();



        // Create a new card entry for the card list section
        const newCardEntry = document.createElement('div');
        newCardEntry.classList.add('listdetails');
        newCardEntry.innerHTML = `
            <div><h4>Card Type</h4><p>${cardType}</p></div>
            <div><h4>Name on Card</h4><p>${cardName}</p></div>
            <div><h4>Card Number</h4><p>**** **** **** ${cardNumber.slice(-4)}</p></div>

            <div><h4>Expiration</h4><p>${cardExpiry}</p></div>
             <div><a href="#" class="viewDetails"
            data-card-type="${cardType}"
            data-name-on-card="${cardName}"
            data-card-number="${cardNumber}"
            data-valid-from="${validFrom}"
            data-expiration-date="${cardExpiry}"
        >View details</a>
        `;
        // Append the new card entry to the card list container
        cardListContainer.appendChild(newCardEntry);
        newCardEntry.querySelector('.viewDetails').addEventListener('click', function (e) {
            e.preventDefault(); // Prevent jumping to top
            showCardDetails(this);
        });

        // Hide the form and overlay
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('addCardForm').style.display = 'none';


        // Reset the form fields
        addCardForm.reset();
        
        

        // Function to update pagination visibility
        function updatePaginationVisibility() {
            const pagination = document.querySelector('.swiper-pagination');
            const hasCards = document.querySelectorAll('.swiper-slide').length > 0;
            pagination.style.display = hasCards ? 'block' : 'none';
        } 

        // Function to update "No Cards" message
        function updateNoCardsMessage() {
            const noCardsMessage = document.getElementById('noCardsMessage');
            const cards = document.querySelectorAll('.swiper-slide').length;
            noCardsMessage.style.display = cards === 0 ? 'block' : 'none';
        }

        // Function to validate date format (MM/YY)
        function validateDateFormat(date) {
            return /^(0[1-9]|1[0-2])\/\d{2}$/.test(date);
        }

        // Function to check if a date is in the past
        function isPastDate(date) {
            const [month, year] = date.split('/').map(Number);
            const fullYear = 2000 + year;
            const now = new Date();
            const inputDate = new Date(fullYear, month - 1);
            return inputDate < now;
        }

        // Function to check if a date is in the future
        function isFutureDate(date) {
            const [month, year] = date.split('/').map(Number);
            const fullYear = 2000 + year;
            const now = new Date();
            const inputDate = new Date(fullYear, month - 1);
            return inputDate > now;
        }

        // Function to compare dates (Valid Thru should be after Valid From)
        function compareDates(validFrom, validThru) {
            const [fromMonth, fromYear] = validFrom.split('/').map(Number);
            const [thruMonth, thruYear] = validThru.split('/').map(Number);
            const fromDate = new Date(2000 + fromYear, fromMonth - 1);
            const thruDate = new Date(2000 + thruYear, thruMonth - 1);
            return thruDate > fromDate;
        }

        // Function to show error messages
        function showError(inputId, message) {
            const errorElement = document.getElementById(`${inputId}Error`);
            errorElement.textContent = message;
        }

        // Function to clear all error messages
        function clearErrors() {
            const errorElements = document.querySelectorAll('.error');
            errorElements.forEach(errorElement => {
                errorElement.textContent = '';
            });
        }

        // Close the form when clicking outside
        document.getElementById('overlay').addEventListener('click', () => {
            document.getElementById('overlay').style.display = 'none';
    /* document.getElementById('addCardForm').style.display = 'none' */;
        });

        // Close the form when pressing the Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                document.getElementById('overlay').style.display = 'none';
                document.getElementById('addCardForm').style.display = 'none';
            }
        });
        function showCardDetails(link) {
            const cardDetailsDialog = document.getElementById('cardDetailsDialog');

            // Get details from `data-attributes`
            document.getElementById('detailCardType').textContent = link.getAttribute('data-card-type');
            document.getElementById('detailNameOnCard').textContent = link.getAttribute('data-name-on-card');
            document.getElementById('detailCardNumber').textContent = link.getAttribute('data-card-number');
            document.getElementById('detailValidFrom').textContent = link.getAttribute('data-valid-from');
            document.getElementById('detailExpirationDate').textContent = link.getAttribute('data-expiration-date');

            // Reattach event listener for delete button
            const deleteCardButton = document.getElementById('deleteCardButton');
            deleteCardButton.onclick = function () {
                if (confirm("Are you sure you want to delete this card?")) {
                    console.log("Delete confirmed");
                    deleteCard(link);
                    cardDetailsDialog.close();
                } else {
                    console.log("Delete cancelled");
                }
            };

            // Show the dialog
            cardDetailsDialog.showModal();
        }



    });
    function deleteCard(link) {
        console.log("Delete card function called");
    
        // Get the full card number from the link's data attribute
        const cardNumber = link.getAttribute('data-card-number').replace(/\s/g, '');
        console.log("Card number to delete:", cardNumber);
    
        let cardDeleted = false; // Flag to ensure only one deletion per category
    
        // 🔹 Remove from Swiper slides
        const slides = document.querySelectorAll('.swiper-slide');
        slides.forEach(slide => {
            // Get the card number from the slide
            const cardNumberInSlide = slide.querySelector('.card-number').textContent.replace(/\s/g, '');
            console.log("Card number in slide:", cardNumberInSlide);
    
            // Check if the card number matches
            if (!cardDeleted && cardNumberInSlide.endsWith(cardNumber.slice(-4))) {
                console.log("Removing slide:", slide);
                slide.remove(); // Remove the slide from Swiper
                cardDeleted = true;
            }
        });
    
        // 🔹 Remove from Card List
        const cardEntries = document.querySelectorAll('.listdetails');
        let listCardDeleted = false;
    
        cardEntries.forEach(entry => {
            // Find the card number in the list item
            const cardNumberElement = entry.querySelector('div:nth-child(3) p'); // Adjust selector if needed
            if (cardNumberElement) {
                const cardNumberInEntry = cardNumberElement.textContent.trim().slice(-4); // Extract last 4 digits
                console.log("Checking list entry:", cardNumberInEntry);
    
                // Compare last 4 digits
                if (!listCardDeleted && cardNumberInEntry === cardNumber.slice(-4)) {
                    console.log("Removing entry from list:", entry);
                    entry.remove(); // Remove the card from the Card List
                    listCardDeleted = true;
                }
            }
        });
    
        if (!listCardDeleted) {
            console.log("⚠️ No matching card found in the list!");
        }
    
        // 🔹 Update Swiper
        swiper.update(); // Update Swiper after removing the slide
        swiper.pagination.update(); // Update pagination
        swiper.pagination.render(); // Render the updated pagination
        updatePaginationVisibility(); // Update pagination visibility
        updateNoCardsMessage(); // Update "No Cards" message
    
        // 🔹 Close the dialog only if both deletions were successful
        if (cardDeleted || listCardDeleted) {
            document.getElementById('cardDetailsDialog').close();
        }
    }
});