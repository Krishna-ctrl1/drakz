// Main Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Show the corresponding tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Initialize with real data from API
    loadUserData();
    loadSecurityAlerts();
    loadContentCards();
    loadRevenueData();
    
    // Set up modal event handlers
    setupModalHandlers();
});

// User Management Tab Functionality
let currentUsers = [];
let currentPage = 1;
const usersPerPage = 10;

async function loadUserData() {
    try {
        // Fetch all users (users, admins, advisors) from the API
        const response = await fetch('/api/all-users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        currentUsers = await response.json();
        renderUserTable();
        updateUserPagination();
        
        // Set up event listeners for user management
        document.getElementById('user-search').addEventListener('input', filterUsers);
        document.getElementById('role-filter').addEventListener('change', filterUsers);
        document.getElementById('status-filter').addEventListener('change', filterUsers);
        document.getElementById('prev-page').addEventListener('click', prevPage);
        document.getElementById('next-page').addEventListener('click', nextPage);
        document.getElementById('add-user-btn').addEventListener('click', showAddUserModal);
    } catch (error) {
        console.error('Error loading user data:', error);
        // Show error message to the user
        alert('Error loading user data. Please try again later.');
    }
}

function renderUserTable(filtered = null) {
    const usersToRender = filtered || currentUsers;
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = usersToRender.slice(startIndex, endIndex);
    
    const tableBody = document.getElementById('user-table-body');
    tableBody.innerHTML = '';
    
    paginatedUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${capitalizeFirstLetter(user.role)}</td>
            <td><span class="user-status status-${user.status.toLowerCase()}">${capitalizeFirstLetter(user.status)}</span></td>
            <td>${user.joinDate}</td>
            <td class="user-actions">
                <button class="edit-user" data-id="${user.id}" data-role="${user.role}">Edit</button>
                <button class="view-user" data-id="${user.id}" data-role="${user.role}">View</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.edit-user').forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            const userRole = this.getAttribute('data-role');
            editUser(userId, userRole);
        });
    });
    
    document.querySelectorAll('.view-user').forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            const userRole = this.getAttribute('data-role');
            viewUser(userId, userRole);
        });
    });
}

let filteredUsers = [];

function filterUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const roleFilter = document.getElementById('role-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    filteredUsers = currentUsers.filter(user => {
        const matchesSearch = 
            user.firstName.toLowerCase().includes(searchTerm) || 
            user.lastName.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm);
        
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus;
    });
    
    // Reset to first page when filtering
    currentPage = 1;
    renderUserTable(filteredUsers);
    updateUserPagination(filteredUsers.length);
}

function updateUserPagination(totalFilteredUsers = null) {
    const totalUsers = totalFilteredUsers !== null ? totalFilteredUsers : currentUsers.length;
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    
    // Disable/enable pagination buttons
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

function nextPage() {
    // Use filteredUsers.length instead of currentUsers.length if filtering is applied
    const usersToUse = (document.getElementById('user-search').value || 
                         document.getElementById('role-filter').value !== 'all' || 
                         document.getElementById('status-filter').value !== 'all') 
                       ? filteredUsers : currentUsers;
    
    const totalPages = Math.ceil(usersToUse.length / usersPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderUserTable(usersToUse);
        updateUserPagination(usersToUse.length);
    }
}

// Similarly, update prevPage function
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        const usersToUse = (document.getElementById('user-search').value || 
                            document.getElementById('role-filter').value !== 'all' || 
                            document.getElementById('status-filter').value !== 'all') 
                          ? filteredUsers : currentUsers;
        renderUserTable(usersToUse);
        updateUserPagination(usersToUse.length);
    }
}

async function editUser(userId, userRole) {
    try {
        // Fetch detailed user data based on role
        let apiEndpoint = '/api/users';
        if (userRole === 'admin') {
            apiEndpoint = '/api/admins';
        } else if (userRole === 'advisor') {
            apiEndpoint = '/api/advisors';
        }
        
        const response = await fetch(`${apiEndpoint}/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }
        
        const user = await response.json();
        
        // Fill the modal with user data
        document.getElementById('user-first-name').value = user.firstName;
        document.getElementById('user-last-name').value = user.lastName;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.role;
        document.getElementById('user-status').value = user.status;
        
        // Add additional fields for standard users if available
        if (userRole === 'standard' && user.monthlyIncome !== undefined) {
            // Create or update additional fields container
            let additionalFields = document.getElementById('additional-fields');
            if (!additionalFields) {
                additionalFields = document.createElement('div');
                additionalFields.id = 'additional-fields';
                document.getElementById('user-form').insertBefore(additionalFields, 
                    document.getElementById('user-form-actions'));
            }
            
            additionalFields.innerHTML = `
                <div class="form-group">
                    <label for="user-monthly-income">Monthly Income</label>
                    <input type="number" id="user-monthly-income" value="${user.monthlyIncome || ''}">
                </div>
                <div class="form-group">
                    <label for="user-employment-status">Employment Status</label>
                    <input type="text" id="user-employment-status" value="${user.employmentStatus || ''}">
                </div>
                <div class="form-group">
                    <label for="user-financial-goals">Financial Goals</label>
                    <textarea id="user-financial-goals">${user.financialGoals || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="user-risk-tolerance">Risk Tolerance</label>
                    <select id="user-risk-tolerance">
                        <option value="low" ${user.riskTolerance === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${user.riskTolerance === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${user.riskTolerance === 'high' ? 'selected' : ''}>High</option>
                    </select>
                </div>
            `;
        } else {
            // Remove additional fields if not a standard user
            const additionalFields = document.getElementById('additional-fields');
            if (additionalFields) {
                additionalFields.remove();
            }
        }
        
        // Store the user ID and role for saving changes
        document.getElementById('save-user-btn').setAttribute('data-id', userId);
        document.getElementById('save-user-btn').setAttribute('data-role', userRole);
        document.getElementById('delete-user-btn').setAttribute('data-id', userId);
        document.getElementById('delete-user-btn').setAttribute('data-role', userRole);
        
        // Update modal title
        document.querySelector('#user-modal h2').textContent = 'Edit User';
        
        // Show the modal
        document.getElementById('user-modal').style.display = 'flex';
    } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Error fetching user details. Please try again later.');
    }
}

function viewUser(userId, userRole) {
    // Similar to editUser but make fields readonly
    editUser(userId, userRole).then(() => {
        // Make fields readonly
        document.getElementById('user-first-name').readOnly = true;
        document.getElementById('user-last-name').readOnly = true;
        document.getElementById('user-email').readOnly = true;
        document.getElementById('user-role').disabled = true;
        document.getElementById('user-status').disabled = true;
        
        // Make additional fields readonly if they exist
        const additionalFields = document.getElementById('additional-fields');
        if (additionalFields) {
            additionalFields.querySelectorAll('input, textarea, select').forEach(el => {
                el.readOnly = true;
                if (el.tagName === 'SELECT') el.disabled = true;
            });
        }
        
        // Update modal title
        document.querySelector('#user-modal h2').textContent = 'User Details';
    });
}

function showAddUserModal() {
    // Clear the form fields
    document.getElementById('user-first-name').value = '';
    document.getElementById('user-last-name').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('user-role').value = 'standard';
    document.getElementById('user-status').value = 'pending';
    
    // Make sure fields are editable
    document.getElementById('user-first-name').readOnly = false;
    document.getElementById('user-last-name').readOnly = false;
    document.getElementById('user-email').readOnly = false;
    document.getElementById('user-role').disabled = false;
    document.getElementById('user-status').disabled = false;
    
    // Remove any additional fields
    const additionalFields = document.getElementById('additional-fields');
    if (additionalFields) {
        additionalFields.remove();
    }
    
    // Add password field for new users
    let passwordField = document.getElementById('password-field');
    if (!passwordField) {
        passwordField = document.createElement('div');
        passwordField.id = 'password-field';
        passwordField.className = 'form-group';
        passwordField.innerHTML = `
            <label for="user-password">Password</label>
            <input type="password" id="user-password" required>
        `;
        
        // Insert after email field
        const emailField = document.getElementById('user-email').parentNode;
        emailField.parentNode.insertBefore(passwordField, emailField.nextSibling);
    }
    
    // Update modal title
    document.querySelector('#user-modal h2').textContent = 'Add New User';
    
    // Set data-id to 'new' for the save button
    document.getElementById('save-user-btn').setAttribute('data-id', 'new');
    document.getElementById('save-user-btn').removeAttribute('data-role');
    
    // Show the modal
    document.getElementById('user-modal').style.display = 'flex';
}

async function saveUserChanges() {
    const userId = document.getElementById('save-user-btn').getAttribute('data-id');
    const userRole = document.getElementById('save-user-btn').getAttribute('data-role') || document.getElementById('user-role').value;
    
    // Basic user data
    const userData = {
        firstName: document.getElementById('user-first-name').value,
        lastName: document.getElementById('user-last-name').value,
        email: document.getElementById('user-email').value,
        role: document.getElementById('user-role').value,
        status: document.getElementById('user-status').value
    };
    
    // Add password for new users
    if (userId === 'new') {
        userData.password = document.getElementById('user-password').value;
        if (!userData.password) {
            alert('Password is required for new users');
            return;
        }
    }
    
    // Add additional fields for standard users
    if (userData.role === 'standard') {
        const additionalFields = document.getElementById('additional-fields');
        if (additionalFields) {
            const monthlyIncomeEl = document.getElementById('user-monthly-income');
            const employmentStatusEl = document.getElementById('user-employment-status');
            const financialGoalsEl = document.getElementById('user-financial-goals');
            const riskToleranceEl = document.getElementById('user-risk-tolerance');
            
            if (monthlyIncomeEl) userData.monthlyIncome = monthlyIncomeEl.value;
            if (employmentStatusEl) userData.employmentStatus = employmentStatusEl.value;
            if (financialGoalsEl) userData.financialGoals = financialGoalsEl.value;
            if (riskToleranceEl) userData.riskTolerance = riskToleranceEl.value;
        }
    }
    
    try {
        let url, method;
        
        if (userId === 'new') {
            // Add new user
            url = '/api/users';
            method = 'POST';
        } else {
            // Update existing user
            url = `/api/users/${userId}`;
            method = 'PUT';
            
            // If role has changed, we need to handle it differently
            if (userRole !== userData.role) {
                // This would require special handling on the server
                // as we'd need to transfer the user between tables
                alert('Changing user roles is not supported in this version');
                return;
            }
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save user');
        }
        
        // Close modal and refresh user data
        closeUserModal();
        await loadUserData();
        
    } catch (error) {
        console.error('Error saving user:', error);
        alert(`Error saving user: ${error.message}`);
    }
}

async function deleteUser() {
    const userId = parseInt(document.getElementById('delete-user-btn').getAttribute('data-id'));
    const userRole = document.getElementById('delete-user-btn').getAttribute('data-role');
    
    // Confirm deletion
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            let apiEndpoint = '/api/users';
            if (userRole === 'admin') {
                apiEndpoint = '/api/admins';
            } else if (userRole === 'advisor') {
                apiEndpoint = '/api/advisors';
            }
            
            const response = await fetch(`${apiEndpoint}/${userId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            
            // Close modal and refresh user data
            closeUserModal();
            await loadUserData();
            
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again later.');
        }
    }
}

function closeUserModal() {
    document.getElementById('user-modal').style.display = 'none';
    
    // Remove password field if it exists
    const passwordField = document.getElementById('password-field');
    if (passwordField) {
        passwordField.remove();
    }
}

// System Monitoring Tab Functionality
async function loadSecurityAlerts() {
    try {
        const response = await fetch('/api/security-alerts');
        if (!response.ok) {
            throw new Error('Failed to fetch security alerts');
        }
        
        const securityAlerts = await response.json();
        const alertsBody = document.getElementById('security-alerts-body');
        alertsBody.innerHTML = '';
        
        securityAlerts.forEach(alert => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${alert.type}</td>
                <td>${alert.user}</td>
                <td>${alert.time}</td>
                <td>${alert.location}</td>
                <td>${alert.status}</td>
                <td class="user-actions">
                    <button class="view-alert" data-id="${alert.id}">View Details</button>
                    <button class="resolve-alert" data-id="${alert.id}">Resolve</button>
                </td>
            `;
            alertsBody.appendChild(row);
        });
        
        // Add event listeners for alert buttons
        document.querySelectorAll('.view-alert').forEach(button => {
            button.addEventListener('click', function() {
                const alertId = this.getAttribute('data-id');
                viewAlertDetails(alertId);
            });
        });
        
        document.querySelectorAll('.resolve-alert').forEach(button => {
            button.addEventListener('click', function() {
                const alertId = this.getAttribute('data-id');
                resolveAlert(alertId);
            });
        });
        
        // Generate Report button event
        document.getElementById('generate-report-btn').addEventListener('click', function() {
            alert('System monitoring report is being generated. It will be available for download shortly.');
        });
    } catch (error) {
        console.error('Error loading security alerts:', error);
        alert('Error loading security alerts. Please try again later.');
    }
}

function viewAlertDetails(alertId) {
    // This would fetch detailed alert information in a real application
    alert(`Viewing details for alert ID: ${alertId}`);
}

function resolveAlert(alertId) {
    // This would update the alert status in a real application
    alert(`Alert ID ${alertId} marked as resolved`);
}

// Content Moderation Tab Functionality
function loadContentCards() {
    const contentItems = [
        { id: 1, title: 'Financial Planning in Your 30s', author: 'John Smith', date: '25 Feb 2025', type: 'Blog Post', preview: 'This comprehensive guide discusses investment strategies, retirement planning, and debt management for individuals in their thirties...' },
        { id: 2, title: 'Understanding Market Volatility', author: 'Emma Harris', date: '24 Feb 2025', type: 'Video', preview: 'In this educational video, we break down what market volatility means for your investments and how to prepare for market downturns...' },
        { id: 3, title: 'Real Estate Investment Trusts', author: 'Michael Johnson', date: '24 Feb 2025', type: 'Article', preview: 'REITs offer a way to invest in real estate without the hassle of property management. This article explores the benefits and risks...' },
        { id: 4, title: 'Sustainable Investing Options', author: 'Sarah Davis', date: '23 Feb 2025', type: 'Blog Post', preview: 'Learn about ESG investing and how to align your portfolio with your values while maintaining strong financial returns...' },
        { id: 5, title: 'Retirement Calculator Tool', author: 'David Miller', date: '22 Feb 2025', type: 'Tool', preview: 'This interactive tool helps users project their retirement savings and determine if they are on track to meet their goals...' },
        { id: 6, title: 'Tax Strategies for Small Businesses', author: 'Lisa Wilson', date: '21 Feb 2025', type: 'Guide', preview: 'A comprehensive overview of tax deductions, credits, and strategies available to small business owners and entrepreneurs...' }
    ];
    
    const contentContainer = document.getElementById('content-cards-container');
    contentContainer.innerHTML = '';
    
    contentItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <div class="content-card-header">
                <div class="content-title">${item.title}</div>
                <div class="content-author">By: ${item.author}</div>
                <div class="content-date">Submitted: ${item.date}</div>
                <div class="content-type">${item.type}</div>
            </div>
            <div class="content-preview">${item.preview}</div>
            <div class="content-actions">
                <button class="btn btn-primary review-content" data-id="${item.id}">Review</button>
            </div>
        `;
        contentContainer.appendChild(card);
    });
    
    // Set up event listeners for content review buttons
    document.querySelectorAll('.review-content').forEach(button => {
        button.addEventListener('click', function() {
            const contentId = parseInt(this.getAttribute('data-id'));
            reviewContent(contentId, contentItems);
        });
    });
    
    // Content filter buttons
    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real app, this would filter the content
            const filter = this.getAttribute('data-filter');
            console.log(`Filtering content by: ${filter}`);
            // For demo, just show an alert
            if (filter !== 'pending') {
                alert(`Showing ${filter} content. In a real implementation, this would filter the content cards.`);
            }
        });
    });
    
    // Content pagination
    document.getElementById('content-prev-page').addEventListener('click', function() {
        alert('Previous page of content would be shown here');
    });
    
    document.getElementById('content-next-page').addEventListener('click', function() {
        alert('Next page of content would be shown here');
    });
}

function reviewContent(contentId, contentItems) {
    const content = contentItems.find(item => item.id === contentId);
    if (!content) return;
    
    // Fill the modal with content data
    document.getElementById('content-title').textContent = content.title;
    document.getElementById('content-author').textContent = `By: ${content.author}`;
    document.getElementById('content-date').textContent = `Submitted: ${content.date}`;
    document.getElementById('content-type').textContent = content.type;
    document.getElementById('content-body').innerHTML = `<p>${content.preview}</p><p>Additional content would be displayed here in a real application.</p>`;
    
    // Show the modal
    document.getElementById('content-modal').style.display = 'flex';
}

// Revenue Tracking Tab Functionality
function loadRevenueData() {
    const revenueData = [
        { month: 'January', subscriptionRevenue: 284920, adRevenue: 58234, otherRevenue: 12435, growth: '+12.3%' },
        { month: 'February', subscriptionRevenue: 312045, adRevenue: 62347, otherRevenue: 15267, growth: '+9.5%' },
        { month: 'March', subscriptionRevenue: 328750, adRevenue: 68347, otherRevenue: 17620, growth: '+5.4%' }
    ];
    
    const revenueTableBody = document.getElementById('revenue-table-body');
    revenueTableBody.innerHTML = '';
    
    revenueData.forEach(data => {
        const row = document.createElement('tr');
        const totalRevenue = data.subscriptionRevenue + data.adRevenue + data.otherRevenue;
        
        row.innerHTML = `
            <td>${data.month}</td>
            <td>$${formatNumber(data.subscriptionRevenue)}</td>
            <td>$${formatNumber(data.adRevenue)}</td>
            <td>$${formatNumber(data.otherRevenue)}</td>
            <td>$${formatNumber(totalRevenue)}</td>
            <td>${data.growth}</td>
        `;
        revenueTableBody.appendChild(row);
    });
    
    // Time period select handler
    document.getElementById('date-range-select').addEventListener('change', function() {
        const period = this.value;
        alert(`Revenue data for period: ${period} would be loaded`);
    });
}

// Modal Event Handlers
function setupModalHandlers() {
    // User Modal
    document.getElementById('save-user-btn').addEventListener('click', saveUserChanges);
    document.getElementById('delete-user-btn').addEventListener('click', deleteUser);
    document.getElementById('cancel-user-btn').addEventListener('click', closeUserModal);
    
    // Content Modal
    document.getElementById('approve-content-btn').addEventListener('click', function() {
        alert('Content approved and published!');
        document.getElementById('content-modal').style.display = 'none';
    });
    
    document.getElementById('reject-content-btn').addEventListener('click', function() {
        alert('Content rejected. Notification will be sent to the author.');
        document.getElementById('content-modal').style.display = 'none';
    });
    
    document.getElementById('cancel-content-btn').addEventListener('click', function() {
        document.getElementById('content-modal').style.display = 'none';
    });
    
    // Close buttons for all modals
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Utility Functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCurrentDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Add missing functions for API scenarios that weren't fully implemented
function hashPassword(password) {
    // This is a placeholder - in a real application, you would use a proper hashing library
    // or let the server handle the hashing
    console.warn('Password hashing should be done on the server for security');
    return password;
}