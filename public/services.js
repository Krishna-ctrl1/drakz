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
