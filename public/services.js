// Sidebar navigation logic
function openNav() {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar) {
        sidebar.style.width = "180px";
        const mainContent = document.getElementById("main");
        if (mainContent) {
            mainContent.style.marginLeft = "180px";
        }
    }
}

function closeNav() {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar) {
        sidebar.style.width = "60px";
        const mainContent = document.getElementById("main");
        if (mainContent) {
            mainContent.style.marginLeft = "60px";
        }
    }
}

// Data for "Need any Service" cards
const serviceDetails = {
    'bill-pay': { 
        title: 'Bill Pay Service', 
        description: 'Our online bill payment service allows you to pay your bills quickly and securely from anywhere, at any time. Save time and never miss a payment again.', 
        features: [
            'Pay all your bills from one convenient location', 
            'Schedule one-time or recurring payments', 
            'Receive email confirmations and reminders', 
            'View payment history for up to 24 months'
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
            'Access real-time reporting and analytics'
        ], 
        actionText: 'Apply Now' 
    },
    'treasury-services': { 
        title: 'Treasury Management', 
        description: 'Our treasury management solutions help businesses optimize cash flow, improve operational efficiency, and enhance financial control.', 
        features: [
            'Cash management and forecasting tools', 
            'Automated clearing house (ACH) services', 
            'Positive pay and fraud prevention', 
            'Lockbox services for efficient receivables'
        ], 
        actionText: 'Contact Specialist' 
    }
};

// Data for "Your Services" section
const userAccountDetails = {
    'loan': {
        title: 'Your Loan Details',
        loans: [
            { type: 'Home Loan', accountNumber: 'HL-736492', balance: '₹2,250,000', nextPayment: '15/10/2025', interestRate: '8.5%', term: '20 years' },
            { type: 'Auto Loan', accountNumber: 'AL-857294', balance: '₹125,000', nextPayment: '28/10/2025', interestRate: '9.2%', term: '5 years' }
        ],
        paymentHistory: [
            { date: '15/09/2025', loan: 'Home Loan', amount: '₹22,500', status: 'Paid' },
            { date: '28/08/2025', loan: 'Auto Loan', amount: '₹5,500', status: 'Paid' },
            { date: '15/08/2025', loan: 'Home Loan', amount: '₹22,500', status: 'Paid' }
        ],
        documents: ['Home Loan Agreement', 'Auto Loan Payment Schedule']
    },
    'receipts': {
        title: 'Account Receipts & Statements',
        accountNumber: 'SAV-9274635',
        balance: '₹345,289',
        transactions: [
            { date: '07/10/2025', description: 'Swiggy', category: 'Dining', amount: '-₹450' },
            { date: '06/10/2025', description: 'Salary Credit - ABC Corp', category: 'Income', amount: '+₹85,000' },
            { date: '05/10/2025', description: 'Electricity Bill', category: 'Utilities', amount: '-₹1,240' },
            { date: '04/10/2025', description: 'Amazon.in', category: 'Shopping', amount: '-₹2,350' },
            { date: '02/10/2025', description: 'Ola Cabs', category: 'Transport', amount: '-₹320' },
            { date: '01/10/2025', description: 'Rent Payment', category: 'Housing', amount: '-₹18,000' }
        ],
        statements: [
            { month: 'September 2025', link: '#' },
            { month: 'August 2025', link: '#' },
            { month: 'July 2025', link: '#' }
        ]
    },
    'savings': {
        title: 'Your Savings & Goals',
        accountNumber: 'SAV-1856392',
        balance: '₹1,254,075',
        interestRate: '3.25% APY',
        ytdInterest: '₹28,592',
        goal: { name: 'Europe Trip 2026', target: '₹2,000,000', current: '₹1,254,075', progress: 62 }
    },
    'insurance': {
        title: 'Your Insurance Policies',
        policies: [
            { type: 'Life Insurance', policyNumber: 'LIFE-12345', coverage: '₹10,000,000', premium: '₹25,000/year', status: 'Active' },
            { type: 'Auto Insurance', policyNumber: 'AUTO-67890', coverage: 'Comprehensive', premium: '₹15,000/year', status: 'Active' },
            { type: 'Home Insurance', policyNumber: 'HOME-54321', coverage: '₹5,000,000', premium: '₹5,000/year', status: 'Active' }
        ]
    },
    'investments': {
        title: 'Your Investment Portfolio',
        totalValue: '₹7,582,000',
        holdings: [
            { name: 'Nifty 50 ETF', symbol: 'NIFTYBEES', value: '₹2,500,000', change: '+1.2%' },
            { name: 'Reliance Industries', symbol: 'RELIANCE', value: '₹1,800,000', change: '-0.5%' },
            { name: 'HDFC Bank', symbol: 'HDFCBANK', value: '₹1,500,000', change: '+2.1%' },
            { name: 'International Equity Fund', symbol: 'INTEQUITY', value: '₹1,782,000', change: '+0.8%' }
        ]
    },
    'creditScore': {
        title: 'Your Credit Score',
        score: 780,
        provider: 'CIBIL',
        factors: [
            { name: 'Payment History', impact: 'High', status: 'Excellent', description: '100% on-time payments.' },
            { name: 'Credit Utilization', impact: 'High', status: 'Good', description: 'You are using 25% of your available credit.' },
            { name: 'Length of Credit History', impact: 'Medium', status: 'Excellent', description: 'Your oldest account is 12 years old.' },
            { name: 'Credit Mix', impact: 'Low', status: 'Good', description: 'Healthy mix of credit cards and loans.' }
        ]
    },
    'financialAdvisory': {
        title: 'Your Financial Advisor',
        advisor: { name: 'Jane Doe', email: 'jane.doe@drakz.com', phone: '555-123-4567', specialty: 'Retirement Planning' },
        recentActivity: [
            { date: '25/09/2025', note: 'Discussed portfolio rebalancing and risk tolerance.' },
            { date: '10/08/2025', note: 'Reviewed Q2 performance and market trends.' }
        ]
    }
};


// --- Action Handlers ---

function handleServiceAction(serviceId) {
    switch(serviceId) {
        case 'bill-pay':
            alert('Navigating to the Bill Pay setup page...');
            // window.location.href = '/bill-pay-setup'; // Example of actual navigation
            break;
        case 'merchant-services':
            alert('Opening the Merchant Services application form...');
            break;
        case 'treasury-services':
            alert('A contact form for our Treasury Specialists will appear here.');
            break;
        default:
            alert('This service is not yet available.');
    }
}


// --- Modal Display Functions ---

// **NEWLY FUNCTIONAL** - For "Need any Service" cards
function showServiceDetails(serviceId) {
    const service = serviceDetails[serviceId];
    if (service) {
        const body = `
            <p class="service-detail-content">${service.description}</p>
            <div class="service-features">
                <h4>Features & Benefits</h4>
                <ul class="feature-list">
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `;
        const actions = `<button class="action-button" onclick="handleServiceAction('${serviceId}')">${service.actionText}</button>`;
        showModal(service.title, body, actions);
    }
}


function showUserLoanDetails() {
    const data = userAccountDetails.loan;
    const body = `
        <h4>Active Loans</h4>
        ${data.loans.map(loan => `
            <div class="account-summary">
                <div class="summary-item"><span class="label">${loan.type} (${loan.accountNumber})</span><span class="value">${loan.balance}</span></div>
                <div class="summary-item"><span class="label">Next Payment</span><span class="value">${loan.nextPayment}</span></div>
            </div>
        `).join('')}
        
        <h4>Recent Payment History</h4>
        <table class="history-table">
            <thead><tr><th>Date</th><th>Loan</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>${data.paymentHistory.map(p => `<tr><td>${p.date}</td><td>${p.loan}</td><td>${p.amount}</td><td><span class="status-badge">${p.status}</span></td></tr>`).join('')}</tbody>
        </table>`;
    const actions = `<button class="action-button" onclick="alert('Payment module would open.')">Make a Payment</button>`;
    showModal(data.title, body, actions);
}

function showAccountReceipts() {
    const data = userAccountDetails.receipts;
    const body = `
        <div id="receipt-content">
            <div class="account-summary">
                <div class="summary-item"><span class="label">Account Number</span><span class="value">${data.accountNumber}</span></div>
                <div class="summary-item"><span class="label">Current Balance</span><span class="value">${data.balance}</span></div>
            </div>
            <h4>Recent Transactions</h4>
            <table class="history-table">
                <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th></tr></thead>
                <tbody>${data.transactions.map(t => `<tr><td>${t.date}</td><td>${t.description}</td><td>${t.category}</td><td class="${t.amount.startsWith('+') ? 'positive-amount' : 'negative-amount'}">${t.amount}</td></tr>`).join('')}</tbody>
            </table>
            <h4>Available Statements</h4>
            <ul class="document-list">${data.statements.map(s => `<li><a href="${s.link}" download><i class="fas fa-file-pdf"></i> ${s.month}</a></li>`).join('')}</ul>
        </div>`;
    const actions = `
        <button class="action-button" onclick="printReceipt()">Print Transactions</button>
        <button class="action-button" onclick="alert('Exporting transactions...')">Export Transactions</button>
    `;
    showModal(data.title, body, actions);
}

function showSavingsDetails() {
    const data = userAccountDetails.savings;
    const body = `
        <div class="account-summary">
            <div class="summary-item"><span class="label">Account Number</span><span class="value">${data.accountNumber}</span></div>
            <div class="summary-item"><span class="label">Current Balance</span><span class="value">${data.balance}</span></div>
            <div class="summary-item"><span class="label">Interest Rate (APY)</span><span class="value">${data.interestRate}</span></div>
        </div>
        <h4>Savings Goal: ${data.goal.name}</h4>
        <div class="goal-progress-bar"><div class="progress-fill" style="width: ${data.goal.progress}%"></div></div>
        <p>Progress: ${data.goal.progress}% (${data.goal.current} of ${data.goal.target})</p>`;
    const actions = `<button class="action-button" onclick="alert('Transfer module would open.')">Transfer Money</button>`;
    showModal(data.title, body, actions);
}

function showInsuranceDetails() {
    const data = userAccountDetails.insurance;
    let body = `
        <table class="history-table">
            <thead><tr><th>Policy</th><th>Number</th><th>Coverage</th><th>Premium</th><th>Status</th></tr></thead>
            <tbody>${data.policies.map(p => `<tr><td>${p.type}</td><td>${p.policyNumber}</td><td>${p.coverage}</td><td>${p.premium}</td><td><span class="status-badge">${p.status}</span></td></tr>`).join('')}</tbody>
        </table>`;
    const actions = `<button class="action-button" onclick="alert('Viewing policy documents...')">View Documents</button>`;
    showModal(data.title, body, actions);
}

function showInvestmentDetails() {
    const data = userAccountDetails.investments;
    let body = `
        <div class="account-summary"><div class="summary-item"><span class="label">Total Portfolio Value:</span><span class="value">${data.totalValue}</span></div></div>
        <table class="history-table">
            <thead><tr><th>Holding</th><th>Symbol</th><th>Market Value</th><th>24h Change</th></tr></thead>
            <tbody>${data.holdings.map(h => `<tr><td>${h.name}</td><td>${h.symbol}</td><td>${h.value}</td><td style="color: ${h.change.startsWith('+') ? 'green' : 'red'};">${h.change}</td></tr>`).join('')}</tbody>
        </table>`;
    const actions = `<button class="action-button" onclick="alert('Redirecting to trading platform...')">Trade Now</button>`;
    showModal(data.title, body, actions);
}

function showCreditScoreDetails() {
    const data = userAccountDetails.creditScore;
    let body = `
        <div class="account-summary">
            <div class="summary-item"><span class="label">Current Score:</span><span class="value">${data.score} (${data.provider})</span></div>
        </div>
        <h4>Key Factors</h4>
        ${data.factors.map(f => `
            <div class="summary-item" style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span class="label">${f.name} (Impact: ${f.impact})</span>
                <span class="value">${f.status} - ${f.description}</span>
            </div>
        `).join('')}`;
    const actions = `<button class="action-button" onclick="alert('Generating full credit report...')">Get Full Report</button>`;
    showModal(data.title, body, actions);
}

function showAdvisoryDetails() {
    const data = userAccountDetails.financialAdvisory;
    let body = `
        <div class="account-summary">
            <div class="summary-item"><span class="label">Advisor Name:</span><span class="value">${data.advisor.name} (${data.advisor.specialty})</span></div>
            <div class="summary-item"><span class="label">Email:</span><span class="value">${data.advisor.email}</span></div>
        </div>
        <h4>Recent Activity</h4>
        <ul class="feature-list">${data.recentActivity.map(a => `<li><b>${a.date}:</b> ${a.note}</li>`).join('')}</ul>`;
    const actions = `<button class="action-button" onclick="alert('Opening secure messaging...')">Send Message</button>`;
    showModal(data.title, body, actions);
}

// --- Helper Functions ---

function printReceipt() {
    const receiptContent = document.getElementById('receipt-content');
    if (receiptContent) {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Transactions</title>');
        // Optional: Add styles for printing
        printWindow.document.write('<style> body { font-family: Arial, sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { padding: 8px; border: 1px solid #ddd; text-align: left; } .positive-amount { color: green; } .negative-amount { color: red; } </style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(receiptContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }
}

// Generic modal display function
function showModal(title, body, actions) {
    const modal = document.getElementById('serviceModal');
    const modalContent = document.getElementById('serviceModalContent');
    if (modal && modalContent) {
        modalContent.innerHTML = `
            <h2 class="service-detail-title">${title}</h2>
            <div>${body}</div>
            <div class="service-action">${actions}</div>
        `;
        modal.style.display = 'block';
    }
}

// Close modal logic
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('serviceModal');
    if(modal) {
        // Find the close button inside the modal and add listener
        modal.addEventListener('click', function(event) {
            // Check if the clicked element has the class 'close-modal'
            // The close button is now part of the parent 'modal-content' so we need to check if it exists before adding a listener to it.
            const closeButton = document.querySelector('.close-modal');
            if (closeButton && event.target === closeButton) {
                modal.style.display = 'none';
            }
        });
    
        // Close modal when clicking outside the modal content
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }
});