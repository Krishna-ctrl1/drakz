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

 // Service details content
const serviceDetails = {
    'bill-pay': {
        title: 'Bill Pay Service',
        description: 'Our online bill payment service allows you to pay your bills quickly and securely from anywhere, at any time. Save time and never miss a payment again.',
        features: [
            'Pay all your bills from one convenient location',
            'Schedule one-time or recurring payments',
            'Receive email confirmations and reminders',
            'View payment history for up to 24 months',
            'Set up automatic payments for regular bills'
        ],
        actionText: 'Set Up Bill Pay'
    },
    'merchant-services': {
        title: 'Merchant Services',
        description: 'Our merchant services provide businesses with comprehensive payment processing solutions. Accept payments in-store, online, or on-the-go with our secure and reliable platform.',
        features: [
            'Accept credit and debit card payments',
            'Process contactless and mobile wallet payments',
            'Get competitive transaction rates',
            'Access real-time reporting and analytics',
            'Integrate with your existing POS systems',
            '24/7 merchant support'
        ],
        actionText: 'Apply Now'
    },
    'treasury-services': {
        title: 'Treasury Management Services',
        description: 'Our treasury management solutions help businesses optimize cash flow, improve operational efficiency, and enhance financial control. We offer customizable solutions to meet your specific business needs.',
        features: [
            'Cash management and forecasting tools',
            'Automated clearing house (ACH) services',
            'Positive pay and fraud prevention',
            'Lockbox services for efficient receivables',
            'Commercial card programs',
            'International payment solutions',
            'Detailed reporting and analytics dashboard'
        ],
        actionText: 'Contact a Treasury Specialist'
    }
};

// User-specific account details
const userAccountDetails = {
    'loan': {
        title: 'Your Business Loan Details',
        accountNumber: 'BL-8572940',
        balance: '$19,245.63 remaining',
        term: '60 months (36 remaining)',
        interestRate: '4.75% fixed',
        monthlyPayment: '$458.32',
        nextPaymentDate: 'March 25, 2025',
        paymentHistory: [
            { date: 'February 25, 2025', amount: '$458.32', status: 'Paid' },
            { date: 'January 25, 2025', amount: '$458.32', status: 'Paid' },
            { date: 'December 25, 2024', amount: '$458.32', status: 'Paid' }
        ],
        documents: ['Loan Agreement', 'Payment Schedule', 'Tax Documents']
    },
    'receipts': {
        title: 'Your Account Receipts',
        accountNumber: 'CHK-2947365',
        balance: '$3,452.89',
        transactions: [
            { date: 'March 12, 2025', description: 'Grocery Store', amount: '-$87.65', category: 'Groceries' },
            { date: 'March 10, 2025', description: 'Direct Deposit - ACME Inc', amount: '+$2,450.00', category: 'Income' },
            { date: 'March 9, 2025', description: 'Utility Bill Payment', amount: '-$124.50', category: 'Utilities' },
            { date: 'March 7, 2025', description: 'Restaurant', amount: '-$62.35', category: 'Dining' },
            { date: 'March 5, 2025', description: 'Gas Station', amount: '-$45.00', category: 'Transportation' },
            { date: 'March 3, 2025', description: 'Online Purchase', amount: '-$39.99', category: 'Shopping' },
            { date: 'March 1, 2025', description: 'Rent Payment', amount: '-$1,200.00', category: 'Housing' }
        ],
        monthlySpending: [
            { category: 'Housing', amount: '$1,200.00', percentage: '38%' },
            { category: 'Groceries', amount: '$354.22', percentage: '11%' },
            { category: 'Dining', amount: '$231.78', percentage: '7%' },
            { category: 'Utilities', amount: '$286.45', percentage: '9%' },
            { category: 'Transportation', amount: '$187.32', percentage: '6%' }
        ]
    },
    'savings': {
        title: 'Your Savings Account Details',
        accountNumber: 'SAV-1856392',
        balance: '$12,540.75',
        interestRate: '3.25% APY',
        ytdInterest: '$285.92',
        transactions: [
            { date: 'March 5, 2025', description: 'Deposit from Checking', amount: '+$500.00' },
            { date: 'February 28, 2025', description: 'Interest Payment', amount: '+$33.87' },
            { date: 'February 10, 2025', description: 'Deposit from Checking', amount: '+$500.00' },
            { date: 'January 31, 2025', description: 'Interest Payment', amount: '+$31.25' }
        ],
        goalProgress: {
            name: 'Vacation Fund',
            target: '$15,000',
            current: '$12,540.75',
            percentage: '84%',
            estimatedCompletion: 'May 2025'
        }
    }
};

// Function to show service details in modal
function showServiceDetails(serviceId) {
    const modal = document.getElementById('serviceModal');
    const modalContent = document.getElementById('serviceModalContent');
    const service = serviceDetails[serviceId];
    
    if (service) {
        // Create content for modal
        let content = `
            <h2 class="service-detail-title">${service.title}</h2>
            <p class="service-detail-content">${service.description}</p>
            <div class="service-features">
                <h4>Features & Benefits</h4>
                <ul class="feature-list">
        `;
        
        // Add features
        service.features.forEach(feature => {
            content += `<li>${feature}</li>`;
        });
        
        content += `
                </ul>
            </div>
            <div class="service-action">
                <button class="action-button">${service.actionText}</button>
            </div>
        `;
        
        modalContent.innerHTML = content;
        modal.style.display = 'block';
    }
}

// Function to show user's business loan details
function showUserLoanDetails() {
    const modal = document.getElementById('serviceModal');
    const modalContent = document.getElementById('serviceModalContent');
    const loanDetails = userAccountDetails['loan'];
    
    let content = `
        <h2 class="service-detail-title">${loanDetails.title}</h2>
        
        <div class="account-summary">
            <div class="summary-item">
                <span class="label">Account Number:</span>
                <span class="value">${loanDetails.accountNumber}</span>
            </div>
            <div class="summary-item">
                <span class="label">Remaining Balance:</span>
                <span class="value">${loanDetails.balance}</span>
            </div>
            <div class="summary-item">
                <span class="label">Loan Term:</span>
                <span class="value">${loanDetails.term}</span>
            </div>
            <div class="summary-item">
                <span class="label">Interest Rate:</span>
                <span class="value">${loanDetails.interestRate}</span>
            </div>
            <div class="summary-item">
                <span class="label">Monthly Payment:</span>
                <span class="value">${loanDetails.monthlyPayment}</span>
            </div>
            <div class="summary-item">
                <span class="label">Next Payment Due:</span>
                <span class="value">${loanDetails.nextPaymentDate}</span>
            </div>
        </div>
        
        <div class="payment-history">
            <h4>Recent Payment History</h4>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    loanDetails.paymentHistory.forEach(payment => {
        content += `
            <tr>
                <td>${payment.date}</td>
                <td>${payment.amount}</td>
                <td><span class="status-badge">${payment.status}</span></td>
            </tr>
        `;
    });
    
    content += `
                </tbody>
            </table>
        </div>
        
        <div class="documents">
            <h4>Loan Documents</h4>
            <ul class="document-list">
    `;
    
    loanDetails.documents.forEach(doc => {
        content += `<li><i class="fas fa-file-pdf"></i> ${doc}</li>`;
    });
    
    content += `
            </ul>
        </div>
        
        <div class="service-action">
            <button class="action-button">Make a Payment</button>
        </div>
    `;
    
    modalContent.innerHTML = content;
    modal.style.display = 'block';
}

// Function to show user's account receipts
function showAccountReceipts() {
    const modal = document.getElementById('serviceModal');
    const modalContent = document.getElementById('serviceModalContent');
    const receiptDetails = userAccountDetails['receipts'];
    
    let content = `
        <h2 class="service-detail-title">${receiptDetails.title}</h2>
        
        <div class="account-summary">
            <div class="summary-item">
                <span class="label">Account Number:</span>
                <span class="value">${receiptDetails.accountNumber}</span>
            </div>
            <div class="summary-item">
                <span class="label">Current Balance:</span>
                <span class="value">${receiptDetails.balance}</span>
            </div>
        </div>
        
        <div class="transaction-history">
            <h4>Recent Transactions</h4>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    receiptDetails.transactions.forEach(transaction => {
        // Determine if amount is negative or positive for styling
        const amountClass = transaction.amount.startsWith('+') ? 'positive-amount' : 'negative-amount';
        
        content += `
            <tr>
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td>${transaction.category || ''}</td>
                <td class="${amountClass}">${transaction.amount}</td>
            </tr>
        `;
    });
    
    content += `
                </tbody>
            </table>
        </div>
        
        <div class="spending-summary">
            <h4>Monthly Spending Breakdown</h4>
            <div class="spending-chart">
                <div class="chart-visualization">
                    <!-- Simplified chart visualization -->
                    <div class="chart-bars">
    `;
    
    receiptDetails.monthlySpending.forEach(item => {
        content += `
            <div class="chart-bar-item">
                <div class="chart-label">${item.category}</div>
                <div class="chart-bar" style="width: ${item.percentage}"></div>
                <div class="chart-value">${item.amount} (${item.percentage})</div>
            </div>
        `;
    });
    
    content += `
                    </div>
                </div>
            </div>
        </div>
        
        <div class="service-action">
            <button class="action-button">Download Statement</button>
            <button class="action-button secondary">Export Transactions</button>
        </div>
    `;
    
    modalContent.innerHTML = content;
    modal.style.display = 'block';
}

// Function to show user's savings account details
function showSavingsDetails() {
    const modal = document.getElementById('serviceModal');
    const modalContent = document.getElementById('serviceModalContent');
    const savingsDetails = userAccountDetails['savings'];
    
    let content = `
        <h2 class="service-detail-title">${savingsDetails.title}</h2>
        
        <div class="account-summary">
            <div class="summary-item">
                <span class="label">Account Number:</span>
                <span class="value">${savingsDetails.accountNumber}</span>
            </div>
            <div class="summary-item">
                <span class="label">Current Balance:</span>
                <span class="value">${savingsDetails.balance}</span>
            </div>
            <div class="summary-item">
                <span class="label">Interest Rate:</span>
                <span class="value">${savingsDetails.interestRate}</span>
            </div>
            <div class="summary-item">
                <span class="label">Year-to-Date Interest:</span>
                <span class="value">${savingsDetails.ytdInterest}</span>
            </div>
        </div>
        
        <div class="savings-goal">
            <h4>Savings Goal Progress</h4>
            <div class="goal-details">
                <div class="goal-name">${savingsDetails.goalProgress.name}</div>
                <div class="goal-progress-bar">
                    <div class="progress-fill" style="width: ${savingsDetails.goalProgress.percentage}"></div>
                </div>
                <div class="goal-stats">
                    <div class="goal-stat">
                        <span class="label">Current:</span>
                        <span class="value">${savingsDetails.goalProgress.current}</span>
                    </div>
                    <div class="goal-stat">
                        <span class="label">Target:</span>
                        <span class="value">${savingsDetails.goalProgress.target}</span>
                    </div>
                    <div class="goal-stat">
                        <span class="label">Completion:</span>
                        <span class="value">${savingsDetails.goalProgress.percentage}</span>
                    </div>
                    <div class="goal-stat">
                        <span class="label">Est. Date:</span>
                        <span class="value">${savingsDetails.goalProgress.estimatedCompletion}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="transaction-history">
            <h4>Recent Transactions</h4>
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    savingsDetails.transactions.forEach(transaction => {
        const amountClass = transaction.amount.startsWith('+') ? 'positive-amount' : 'negative-amount';
        
        content += `
            <tr>
                <td>${transaction.date}</td>
                <td>${transaction.description}</td>
                <td class="${amountClass}">${transaction.amount}</td>
            </tr>
        `;
    });
    
    content += `
                </tbody>
            </table>
        </div>
        
        <div class="service-action">
            <button class="action-button">Transfer Money</button>
            <button class="action-button secondary">Manage Goals</button>
        </div>
    `;
    
    modalContent.innerHTML = content;
    modal.style.display = 'block';
}

// Close modal when clicking the X
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('serviceModal');
    const closeButton = document.querySelector('.close-modal');
    
    if (closeButton) {
        closeButton.onclick = function() {
            modal.style.display = 'none';
        }
    }
    
    // Close modal when clicking outside the modal content
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});

// Function to filter dashboard (placeholder for the search functionality)
function filterDashboard() {
    // Implement search functionality here
    console.log('Search functionality would be implemented here');
}     

function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('active');
}

// Sample data for all charts
const activeUsersData = {
labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
datasets: [
{
    label: 'India',
    data: [65, 45, 50, 85, 60, 75, 70],
    backgroundColor: '#4285F4',
    barPercentage: 0.6,
    categoryPercentage: 0.5
},
{
    label: 'Russia',
    data: [85, 75, 60, 55, 75, 50, 80],
    backgroundColor: '#DB4437',
    barPercentage: 0.6,
    categoryPercentage: 0.5
}
]
};

const webPopularityData = {
labels: ['Desktop', 'Mobile', 'Tablet'],
datasets: [{
data: [1245, 1743, 1000],
backgroundColor: ['#FF6B6B', '#4285F4', '#4BD4B0'],
borderWidth: 0,
cutout: '70%'
}]
};

const incomeData = {
labels: ['Banks', 'Retail Points', 'Advisor', 'Admin'],
datasets: [{
data: [35, 25, 15, 25],
backgroundColor: ['#45B7D1', '#FF6B6B', '#A3A0FB', '#FF9F40'],
borderWidth: 0
}]
};

const revenueData = {
labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
datasets: [{
label: 'Revenue',
data: [230, 250, 320, 220, 240],
backgroundColor: (context) => {
    return context.dataIndex === 2 ? '#4285F4' : '#E0E0E0';
},
borderWidth: 0,
borderRadius: 5,
barPercentage: 0.5,
categoryPercentage: 0.7
}]
};

// India states data
const indiaStatesData = [
{ id: "AN", state: "Andaman and Nicobar Islands", value: 45 },
{ id: "AP", state: "Andhra Pradesh", value: 78 },
{ id: "AR", state: "Arunachal Pradesh", value: 32 },
{ id: "AS", state: "Assam", value: 67 },
{ id: "BR", state: "Bihar", value: 56 },
{ id: "CH", state: "Chandigarh", value: 87 },
{ id: "CT", state: "Chhattisgarh", value: 43 },
{ id: "DN", state: "Dadra and Nagar Haveli", value: 29 },
{ id: "DD", state: "Daman and Diu", value: 34 },
{ id: "DL", state: "Delhi", value: 95 },
{ id: "GA", state: "Goa", value: 76 },
{ id: "GJ", state: "Gujarat", value: 82 },
{ id: "HR", state: "Haryana", value: 74 },
{ id: "HP", state: "Himachal Pradesh", value: 54 },
{ id: "JK", state: "Jammu and Kashmir", value: 48 },
{ id: "JH", state: "Jharkhand", value: 39 },
{ id: "KA", state: "Karnataka", value: 89 },
{ id: "KL", state: "Kerala", value: 91 },
{ id: "LA", state: "Ladakh", value: 27 },
{ id: "LD", state: "Lakshadweep", value: 18 },
{ id: "MP", state: "Madhya Pradesh", value: 62 },
{ id: "MH", state: "Maharashtra", value: 93 },
{ id: "MN", state: "Manipur", value: 37 },
{ id: "ML", state: "Meghalaya", value: 42 },
{ id: "MZ", state: "Mizoram", value: 31 },
{ id: "NL", state: "Nagaland", value: 29 },
{ id: "OR", state: "Odisha", value: 58 },
{ id: "PY", state: "Puducherry", value: 66 },
{ id: "PB", state: "Punjab", value: 72 },
{ id: "RJ", state: "Rajasthan", value: 69 },
{ id: "SK", state: "Sikkim", value: 38 },
{ id: "TN", state: "Tamil Nadu", value: 88 },
{ id: "TG", state: "Telangana", value: 83 },
{ id: "TR", state: "Tripura", value: 47 },
{ id: "UP", state: "Uttar Pradesh", value: 71 },
{ id: "UT", state: "Uttarakhand", value: 53 },
{ id: "WB", state: "West Bengal", value: 76 }
];

// Initialize charts when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
// Make sure all chart canvases are properly created
['activeUsersChart', 'webPopularityChart', 'incomeChart', 'revenueChart'].forEach(chartId => {
const container = document.getElementById(chartId);
// Clear the container first
container.innerHTML = '';
// Create canvas element
const canvas = document.createElement('canvas');
canvas.id = chartId + 'Canvas';
container.appendChild(canvas);
});

// Active Users Chart
const activeUsersCtx = document.getElementById('activeUsersChartCanvas').getContext('2d');
const activeUsersChart = new Chart(activeUsersCtx, {
type: 'bar',
data: activeUsersData,
options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            mode: 'index',
            intersect: false
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                borderDash: [3, 3]
            },
            ticks: {
                stepSize: 20
            }
        }
    }
}
});

// Web Popularity Chart (Doughnut Chart)
const webPopularityCtx = document.getElementById('webPopularityChartCanvas').getContext('2d');
const webPopularityChart = new Chart(webPopularityCtx, {
type: 'doughnut',
data: webPopularityData,
options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    cutout: '70%'
}
});

// Income Chart (Pie Chart)
const incomeCtx = document.getElementById('incomeChartCanvas').getContext('2d');
const incomeChart = new Chart(incomeCtx, {
type: 'pie',
data: incomeData,
options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
            labels: {
                boxWidth: 15,
                padding: 15,
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    return `${label}: ${value}%`;
                }
            }
        }
    }
}
});

// Revenue Chart
const revenueCtx = document.getElementById('revenueChartCanvas').getContext('2d');
const revenueChart = new Chart(revenueCtx, {
type: 'bar',
data: revenueData,
options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                borderDash: [3, 3]
            },
            ticks: {
                stepSize: 100
            }
        }
    }
}
});

// Create India Map visualization
setTimeout(() => {
createIndiaMap();
}, 100);
});

// Function to create India Map
function createIndiaMap() {
const width = document.getElementById('indiaMapChart').clientWidth;
const height = document.getElementById('indiaMapChart').clientHeight;

// Color scale for the map
const colorScale = d3.scaleSequential(d3.interpolateGreens)
.domain([0, 100]);

// Create SVG
const svg = d3.select('#indiaMapChart')
.append('svg')
.attr('width', width)
.attr('height', height)
.append('g')
.attr('transform', `translate(${width/8}, ${height/15})`);

// Create tooltip
const tooltip = d3.select('#indiaMapChart')
.append('div')
.attr('class', 'tooltip')
.style('position', 'absolute')
.style('background', 'white')
.style('padding', '5px')
.style('border-radius', '5px')
.style('box-shadow', '0 0 10px rgba(0,0,0,0.1)')
.style('pointer-events', 'none')
.style('opacity', 0);

// Add legend
const legend = d3.select('#indiaMapChart')
.append('div')
.attr('class', 'map-legend')
.style('padding', '10px')
.style('background', 'white')
.style('border-radius', '5px')
.style('box-shadow', '0 0 5px rgba(0,0,0,0.1)')
.style('position', 'absolute')
.style('top', '10px')
.style('right', '10px');

const legendItems = [
{ color: colorScale(20), text: 'Low (0-33%)' },
{ color: colorScale(50), text: 'Medium (34-66%)' },
{ color: colorScale(80), text: 'High (67-100%)' }
];

legendItems.forEach(item => {
const legendItem = legend.append('div')
    .style('display', 'flex')
    .style('align-items', 'center')
    .style('margin-bottom', '5px');

legendItem.append('div')
    .style('width', '12px')
    .style('height', '12px')
    .style('background', item.color)
    .style('margin-right', '5px');

legendItem.append('span')
    .text(item.text)
    .style('font-size', '12px');
});

// Define the states and their boundaries
// For demonstration, we'll create a simplified India map
// In a real implementation, you would use GeoJSON data of India

// Load actual India GeoJSON data from a string
// This is a simplified GeoJSON representation of India for demonstration
const indiaGeoJSON = {
"type": "FeatureCollection",
"features": [
    {
        "type": "Feature",
        "properties": { "name": "Maharashtra" },
        "geometry": { "type": "Polygon", "coordinates": [[[73.4, 16.8], [80.2, 17.5], [80.8, 21.2], [73.6, 21.5], [73.4, 16.8]]] }
    },
    {
        "type": "Feature",
        "properties": { "name": "Gujarat" },
        "geometry": { "type": "Polygon", "coordinates": [[[68.1, 20.1], [73.6, 21.5], [73.4, 24.7], [69.7, 24.4], [68.1, 20.1]]] }
    },
    {
        "type": "Feature",
        "properties": { "name": "Rajasthan" },
        "geometry": { "type": "Polygon", "coordinates": [[[69.7, 24.4], [73.4, 24.7], [77.2, 27.3], [77.5, 30.3], [70.2, 30.1], [69.7, 24.4]]] }
    },
    {
        "type": "Feature",
        "properties": { "name": "Madhya Pradesh" },
        "geometry": { "type": "Polygon", "coordinates": [[[73.4, 21.8], [80.8, 21.2], [83.0, 24.5], [77.2, 26.5], [73.4, 24.7], [73.4, 21.8]]] }
    },
    {
        "type": "Feature",
        "properties": { "name": "Uttar Pradesh" },
        "geometry": { "type": "Polygon", "coordinates": [[[77.2, 26.5], [83.0, 24.5], [87.8, 26.3], [84.5, 29.8], [77.5, 30.3], [77.2, 26.5]]] }
    },
    {
        "type": "Feature",
        "properties": { "name": "Bihar" },
        "geometry": { "type": "Polygon", "coordinates": [[[83.0, 24.5], [88.1, 24.7], [87.8, 26.3], [83.0, 26.5], [83.0, 24.5]]] }
    },
    {
        "type": "Feature",
        "properties": { "name": "West Bengal" },
        "geometry": { "type": "Polygon", "coordinates": [[[87.8, 26.3], [88.1, 24.7], [89.5, 21.8], [87.4, 21.7], [86.5, 24.4], [87.8, 26.3]]] }
    },
    {
        "type": "Feature",
        "properties": { "name": "Karnataka" },
        "geometry": { "type": "Polygon", "coordinates": [[[73.4, 16.8], [78.4, 16.5], [78.5, 12.3], [74.5, 12.5], [73.4, 16.8]]] }
    },
    {
        "type": "Feature",
        "properties": { "name": "Tamil Nadu" },
        "geometry": { "type": "Polygon", "coordinates": [[[77.0, 13.0], [80.3, 13.5], [80.2, 10.2], [77.0, 8.1], [77.0, 13.0]]] }
    },
    {
        "type": "Feature",
        "properties": { "name": "Kerala" },
        "geometry": { "type": "Polygon", "coordinates": [[[74.5, 12.5], [77.0, 13.0], [77.0, 8.1], [74.8, 8.3], [74.5, 12.5]]] }
    },
    {
        "type": "Feature",
        "properties": { "name": "Andhra Pradesh" },
        "geometry": { "type": "Polygon", "coordinates": [[[77.3, 17.0], [78.4, 16.5], [80.3, 13.5], [83.0, 18.3], [80.2, 21.0], [77.3, 17.0]]] }
    }
]
};

// Create the projection
const projection = d3.geoMercator()
.center([80, 22])
.scale(width * 1.3)
.translate([width / 3, height / 2]);

const path = d3.geoPath().projection(projection);



// Draw the map using GeoJSON
svg.selectAll("path")
.data(indiaGeoJSON.features)
.enter()
.append("path")
.attr("d", path)
.attr("fill", function(d) {
    const stateName = d.properties.name;
    const stateData = indiaStatesData.find(s => s.state === stateName) || 
        { value: Math.floor(Math.random() * 100) };
    return colorScale(stateData.value);
})
.attr("stroke", "#fff")
.attr("stroke-width", 1)
.on("mouseover", function(event, d) {
    const stateName = d.properties.name;
    const stateData = indiaStatesData.find(s => s.state === stateName) || 
        { value: Math.floor(Math.random() * 100) };
    
    d3.select(this)
        .attr("stroke-width", 2)
        .attr("stroke", "#333");
    
    tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
    
    tooltip.html(`${stateName}: ${stateData.value}%`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
})
.on("mouseout", function() {
    d3.select(this)
        .attr("stroke-width", 1)
        .attr("stroke", "#fff");
    
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
});

// Add text labels for states
svg.selectAll("text")
.data(indiaGeoJSON.features)
.enter()
.append("text")
.attr("transform", function(d) {
    // Find centroid of each state
    const centroid = path.centroid(d);
    return `translate(${centroid[0]}, ${centroid[1]})`;
})
.attr("text-anchor", "middle")
.attr("font-size", "8px")
.attr("fill", "#333")
.text(function(d) {
    return d.properties.name;
});
}

// Navigation functionality
document.querySelectorAll('.nav-item').forEach(item => {
item.addEventListener('click', function() {
document.querySelector('.nav-item.active').classList.remove('active');
this.classList.add('active');
});
});
