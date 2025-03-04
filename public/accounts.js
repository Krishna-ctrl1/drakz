//search bar
function filterDashboard() {
    let input = document.getElementById("searchInput").value.trim().toLowerCase();
    let items = document.querySelectorAll(".account-item");

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

//sidebar
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

//weekly expenses
let chartInstance;
function createChart() 
{
    const ctx = document.getElementById('weeklyActivityChart').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy(); // Destroy previous instance to prevent duplicates
    }
    // Sample values: Can range from hundreds to crores
    const depositValues = [500, 300, 250, 400, 100, 280, 320];
    const withdrawValues = [500, 300, 300, 500, 200, 400, 450];

    // Find the max value dynamically
    const maxValue = Math.max(...depositValues, ...withdrawValues);

    // Adjust Y-axis scale dynamically
    let scaleMax, stepSize;
    if (maxValue <= 1000) {
        scaleMax = Math.ceil(maxValue / 100) * 100; // Round to nearest 100
        stepSize = 100;
    } else if (maxValue <= 10000) {
        scaleMax = Math.ceil(maxValue / 1000) * 1000; // Round to nearest 1,000
        stepSize = 1000;
    } else if (maxValue <= 100000) {
        scaleMax = Math.ceil(maxValue / 5000) * 5000; // Round to nearest 5,000
        stepSize = 5000;
    } else {
        scaleMax = Math.ceil(maxValue / 100000) * 100000; // Round to nearest 1,00,000
        stepSize = 100000;
    }

    chartInstance = new Chart(ctx, 
    {
        type: 'bar',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [
                {
                    label: 'Deposit',
                    data: depositValues,
                    backgroundColor: 'skyblue',
                    borderRadius: 100,
                    barThickness: 20, // FIXED bar width
                    maxBarThickness: 20
                },
                {
                    label: 'Withdraw',
                    data: withdrawValues,
                    backgroundColor: 'darkblue',
                    borderRadius: 100,
                    barThickness: 20, // FIXED bar width
                    maxBarThickness: 20
                    
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
        
            
            scales: {
                x: {
                    categoryPercentage: 0.7,
                    grid: { display: false }
                    
                    
                },
                y: {
                    beginAtZero: true,
                    max: scaleMax,
                    ticks: {
                        stepSize: stepSize,
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    },
                    grid: {
                        drawBorder: false,
                        color: "rgba(0, 0, 0, 0.1)" // Soft gridlines
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.dataset.label + ': ' + tooltipItem.raw.toLocaleString();
                        }
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

createChart();

// Force re-render on window resize
window.addEventListener('resize', () => {
    createChart(); 
});

//transactions
const transactions = [
    { description: "Spotify Subscription", type: "Shopping", amount: -2500, date: "28 Jan, 12:30 AM" },
    { description: "Freepik Sales", type: "Transfer", amount: 750, date: "25 Jan, 10:40 PM" },
    { description: "Mobile Service", type: "Service", amount: -150, date: "20 Jan, 10:40 PM" },
    { description: "Wilson", type: "Transfer", amount: -1050, date: "15 Jan, 03:29 PM" },
    { description: "Emilly", type: "Transfer", amount: 840, date: "14 Jan, 10:40 PM" }
];

function filterTransactions(type) {
    const tbody = document.getElementById('transaction-body');
    tbody.innerHTML = '';
    
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.tab[onclick="filterTransactions('${type}')"]`).classList.add('active');
    
    const filtered = transactions.filter(tx => {
        if (type === 'income') return tx.amount > 0;
        if (type === 'expense') return tx.amount < 0;
        return true;
    });
    
    filtered.forEach(tx => {
        const row = `<tr>
            <td>${tx.description}</td>
            <td>${tx.type}</td>
            <td>${tx.date}</td>
            <td class="amount ${tx.amount > 0 ? 'positive' : 'negative'}">${tx.amount > 0 ? '+' + tx.amount : tx.amount}</td>
            <td><button class="button">Download</button></td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

filterTransactions('all');



function toggleDetails(id) {
    const details = document.getElementById(`details-${id}`);
    details.style.display = details.style.display === "none" ? "block" : "none";
}

//loans
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

    loanCards.forEach(card => {
        card.addEventListener("click", function () {
            const details = this.querySelector(".loan-details");

            if (details) {
                details.classList.toggle("hidden"); // Toggle visibility
            }
        });
    });
});