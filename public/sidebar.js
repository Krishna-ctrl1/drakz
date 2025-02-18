// Dashboard
const dashboard = document.querySelectorAll('.fa-home');

dashboard.forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent the default anchor action
        
        // Remove the 'active' class from all items
        navItems.forEach(nav => nav.classList.remove('active'));

        // Add the 'active' class to the clicked item
        item.classList.add('active');

        // Redirect to the corresponding page
        window.location.href = `dashboard.html`;
    });
});

// Transactions
const transactions = document.querySelectorAll('.fa-exchange-alt');

transactions.forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent the default anchor action
        
        // Remove the 'active' class from all items
        navItems.forEach(nav => nav.classList.remove('active'));

        // Add the 'active' class to the clicked item
        item.classList.add('active');

        // Redirect to the corresponding page
        window.location.href = `transactions.html`;
    });
});