//search bar funtionality

function filterDashboard() {
    let input = document.getElementById("searchInput").value.trim().toLowerCase();
    let items = document.querySelectorAll(".dashboard-item");

    items.forEach(item => {
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

const expenseCtx = document.getElementById('expenseChartCanvas').getContext('2d');
new Chart(expenseCtx, {
    type: 'pie',
    data: {
        labels: ["Leisure", "Utilities", "Savings", "Miscellaneous"],
        datasets: [{
            data: [30, 15, 20, 35], // Values
            backgroundColor: [
                "#2c3e50",  // Dark Blue (Leisure)
                "#5d6981",  // Grayish Blue (Utilities)
                "#4a90e2",  // Light Blue (Savings)
                "#9bb1ff"   // Soft Blue (Miscellaneous)
            ],
            borderWidth: 2,
            borderColor: "#ffffff",
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false // Hide legend, show text inside slices
            },
            tooltip: {
                enabled: true
            }
        }
    }
});

function openNav() {
    document.getElementById("mySidebar").style.width = "170px";
    document.getElementById("main").style.marginLeft = "170px";
    document.getElementById("open-button").style.visibility = "hidden";
   
}

  
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("open-button").style.visibility = "visible";
    document.getElementsByClassName("video-preview").style.marginLeft = "170px;"
}


/*Video Library*/
  
    // Get all video thumbnails
    const thumbnails = document.querySelectorAll('.video-thumbnail');
    const videoModal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-frame');

    // Open video modal
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            const videoSrc = this.getAttribute('data-video');
            videoFrame.src = videoSrc;
            videoModal.style.display = 'block';
            // Disable scrolling
             document.body.style.overflow = 'hidden';
        });
    });

    // Close video modal and stop video
    document.querySelector('.close-preview').addEventListener('click', function() {
        videoModal.style.display = 'none';
        videoFrame.src = ''; // Reset iframe src to stop video
        document.body.style.overflow = 'auto';
    });






//cards carousel
        // Initialize Swiper
        const swiper = new Swiper('.swiper-container', {
            loop: false, 
            slidesPerView: 1, // Show only one slide at a time
            spaceBetween: 20, // Space between slides
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        // Function to delete a card
        function deleteCard(button) {
            const slide = button.closest('.swiper-slide'); // Get the parent slide
            slide.remove(); // Remove the slide
            swiper.update(); // Update Swiper to reflect the changes
            swiper.pagination.update(); // Update pagination logic
            swiper.pagination.render();
            updatePaginationVisibility();
            updateNoCardsMessage(); // Update the "No Cards" message
        }

        // Function to show the form
        function showForm() {
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('addCardForm').style.display = 'block';
        }

        // Function to format card number (add spaces after every 4 digits)
        function formatCardNumber(input) {
            let value = input.value.replace(/\s/g, ''); // Remove existing spaces
            let cursorPosition = input.selectionStart; // Save cursor position
            let oldLength = input.value.length;
        
            // Add space after every 4 digits
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        
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
            let value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
            let cursorPosition = input.selectionStart; // Save cursor position before formatting

            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i == 2) {
                    formattedValue += '/'; // Add slash after MM
                    if (cursorPosition > i) cursorPosition++; // Adjust cursor if needed
                }
                formattedValue += value[i];
            }

            // Ensure MM is valid (01-12)
            if (formattedValue.length >= 2) {
                let month = parseInt(formattedValue.slice(0, 2), 10);
                if (month < 1 || month > 12) {
                    formattedValue = '0' + formattedValue[0]; // Reset if invalid
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
            const [month, year] = date.split('/').map(Number);
            const fullYear = 2000 + year; // Convert YY to YYYY

            // Get current date in Indian Standard Time (IST)
            const now = new Date();
            now.setHours(now.getHours() + 5, now.getMinutes() + 30); // Convert to IST

            const inputDate = new Date(fullYear, month - 1); // Set to the first of the month

            return inputDate < now; // Must be strictly in the past
        }

        // Function to check if a date is in the future (for Valid Thru)
        function isFutureDate(date) {
            const [month, year] = date.split('/').map(Number);
            const fullYear = 2000 + year; // Convert YY to YYYY

            // Get current date in Indian Standard Time (IST)
            const now = new Date();
            now.setHours(now.getHours() + 5, now.getMinutes() + 30); // Convert to IST

            const inputDate = new Date(fullYear, month - 1); // Set to the first of the month

            return inputDate > now; // Must be strictly in the future
        }


        // Function to compare dates (Valid Thru should be after Valid From)
        function compareDates(validFrom, validThru) {
            const [fromMonth, fromYear] = validFrom.split('/').map(Number);
            const [thruMonth, thruYear] = validThru.split('/').map(Number);

            // Convert to full year (e.g., 22 -> 2022)
            const fromDate = new Date(2000 + fromYear, fromMonth - 1);
            const thruDate = new Date(2000 + thruYear, thruMonth - 1);

            return thruDate > fromDate;
        }

        // Function to add a new card
        function addCard() {
            const cardNumber = document.getElementById('cardNumber').value;
            const cardName = document.getElementById('cardName').value;
            const validFrom = document.getElementById('validFrom').value;
            const validThru = document.getElementById('validThru').value;
        
            // Validate card number
            if (!validateCardNumber(cardNumber)) {
                alert('Card number must be 16 digits with spaces.');
                return;
            }
            if (!validateCardHolderName(cardName)) {
                alert('Cardholder name must contain only letters and spaces.');
                return;
            }
        
            // Validate date format
            if (!validateDateFormat(validFrom) || !validateDateFormat(validThru)) {
                alert('Dates must be in MM/YY format.');
                return;
            }

                    // Ensure Valid From is in the past
            if (!isPastDate(validFrom)) {
                alert('Valid From date must be in the past.');
                return;
            }

            // Ensure Valid Thru is in the future
            if (!isFutureDate(validThru)) {
                alert('Valid Thru date must be in the future.');
                return;
            }
        
            // Validate that Valid Thru is after Valid From
            if (!compareDates(validFrom, validThru)) {
                alert('Valid Thru date must be after Valid From date.');
                return;
            }
        
            // Create a new slide
            const newSlide = document.createElement('div');
            newSlide.classList.add('swiper-slide');
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
            document.querySelector('.swiper-wrapper').appendChild(newSlide);
        
            // Update Swiper
            swiper.update(); // Update Swiper to reflect the new slide
            swiper.pagination.update(); // Update pagination indicators
        
            // Hide the form and overlay
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('addCardForm').style.display = 'none';
        
            // Clear the form fields
            document.getElementById('cardNumber').value = '';
            document.getElementById('cardName').value = '';
            document.getElementById('validFrom').value = '';
            document.getElementById('validThru').value = '';

            updatePaginationVisibility();
            updateNoCardsMessage(); // Update the "No Cards" message

             // Update Swiper
                swiper.update(); // Update Swiper to reflect the new slide
                swiper.pagination.update(); // Update pagination logic
                swiper.pagination.render(); // Re-render pagination bullets
            

        }

        function updateNoCardsMessage() {
            const noCardsMessage = document.getElementById('noCardsMessage');
            const cards = document.querySelectorAll('.swiper-slide').length;
        
            if (cards === 0) {
                noCardsMessage.style.display = 'block'; // Show the message
            } else {
                noCardsMessage.style.display = 'none'; // Hide the message
            }
        }
        
        // Call updateNoCardsMessage on page load to handle initial state
        document.addEventListener('DOMContentLoaded', () => {
            updateNoCardsMessage();
        });

        // Close the form when clicking outside
        document.getElementById('overlay').addEventListener('click', () => {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('addCardForm').style.display = 'none';
        });

        function updatePaginationVisibility() {
            const pagination = document.querySelector('.swiper-pagination');
            const hasCards = document.querySelectorAll('.swiper-slide').length > 0;
            
            pagination.style.display = hasCards ? 'block' : 'none';
        }
        
        if (!document.querySelector('.swiper-slide')) {
            swiper.destroy(true, true); // Destroy previous Swiper instance
            document.querySelector('.swiper-wrapper').innerHTML = ''; // Ensure container is ready
            new Swiper('.swiper-container', { /* Reinitialize Swiper */ });
        }
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                document.getElementById('overlay').style.display = 'none';
                document.getElementById('addCardForm').style.display = 'none';
            }
        });
        

      