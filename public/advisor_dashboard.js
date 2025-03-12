document.addEventListener("DOMContentLoaded", () => {
  // Fallback placeholder image
  const PLACEHOLDER_IMAGE =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="%23cccccc"><rect width="100%" height="100%" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="20">No Image</text></svg>';

  // Toggle investments view
  function toggleInvestments(index) {
    const c = clients[index];
    const allInvestments = c.stocks.concat(c.investments);

    if (!c.showAll) {
      displayInvestments(allInvestments);
      seeAllLink.textContent = "Show Less";
    } else {
      displayInvestments(allInvestments.slice(0, 3));
      seeAllLink.textContent = "See All";
    }

    c.showAll = !c.showAll;
  }

  // Setup event listeners
  function setupEventListeners() {
    // Delete client
    if (deleteClientBtn) {
      deleteClientBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this client?")) {
          const clientToDelete = clients[currentClientIndex];

          fetch("/delete-client", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ clientId: clientToDelete.id }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to delete client");
              }

              clients.splice(currentClientIndex, 1);
              populateClientList();

              if (clients.length > 0) {
                loadClientData(0);
              } else {
                clearClientInfo();
              }
            })
            .catch((error) => {
              console.error("Error deleting client:", error);
              alert("Failed to delete client. Please try again.");
            });
        }
      });
    }

    // Send email functionality
    if (sendButton) {
      sendButton.addEventListener("click", () => {
        const messageInput = document.getElementById("chat-input");
        const message = messageInput.value.trim();
        const clientEmail = clientEmailEl.value.trim();

        if (message === "") {
          alert("Please type a message before sending.");
          return;
        }

        if (clientEmail === "") {
          alert("Client email is missing.");
          return;
        }

        const subject = encodeURIComponent("Message from Your Advisor");
        const body = encodeURIComponent(message);

        window.location.href = `mailto:${clientEmail}?subject=${subject}&body=${body}`;
        messageInput.value = "";
      });
    }

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const filter = this.value.toLowerCase();
        const liItems = document.querySelectorAll(".client-list li");
        liItems.forEach((li) => {
          const name = li.textContent.toLowerCase();
          li.style.display = name.includes(filter) ? "flex" : "none";
        });
      });
    }

    // Form validation and submission
    if (clientForm) {
      clientForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const inputs = Array.from(clientForm.elements).filter(
          (el) => el.tagName === "INPUT" || el.tagName === "SELECT"
        );
        let isValid = true;

        inputs.forEach((input) => {
          if (!input.checkValidity()) {
            isValid = false;
            if (input.nextElementSibling) {
              input.nextElementSibling.style.display = "block";
            }
          } else {
            if (input.nextElementSibling) {
              input.nextElementSibling.style.display = "none";
            }
          }
        });

        if (isValid) addNewClient();
      });
    }
  }

  // Initial setup
  function initializeDashboard() {
    populateCountryDropdown();
    setupCountryChangeListener();
    setupEventListeners();
    populateClientList();

    // Automatically load first client if exists
    if (clients.length > 0) {
      loadClientData(0);
    }
  }

  // Call initialization
  initializeDashboard();
});

document.addEventListener("DOMContentLoaded", function () {
  // Fetch the advisor's clients when the dashboard loads
  fetchAdvisorClients();

  // Add event listeners or other initialization here
  const refreshButton = document.getElementById("refresh-clients");
  if (refreshButton) {
    refreshButton.addEventListener("click", fetchAdvisorClients);
  }
});

// Function to fetch advisor's clients from the server
function fetchAdvisorClients() {
  fetch("/api/advisor-clients")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Clients for this advisor:", data.clients);

      // Update the sidebar with client names
      updateClientSidebar(data.clients);
    })
    .catch((error) => {
      console.error("Error fetching advisor clients:", error);
      // Show error message in the sidebar
      const clientList = document.getElementById("clientList");
      if (clientList) {
        clientList.innerHTML = '<li class="error">Error loading clients</li>';
      }
    });
}

// Function to update the sidebar with client names - with modern styling
function updateClientSidebar(clients) {
  const clientList = document.getElementById("clientList");
  if (!clientList) return;

  // Add the modern styles if they don't exist
  addClientListStyles();

  if (clients.length === 0) {
    clientList.innerHTML = `
      <div class="empty-clients">
        <div class="empty-icon">👥</div>
        <p>No clients assigned</p>
      </div>
    `;
    return;
  }

  // Sort clients alphabetically by name
  const sortedClients = [...clients].sort((a, b) => {
    const nameA = (a.name || "Unnamed Client").toUpperCase();
    const nameB = (b.name || "Unnamed Client").toUpperCase();
    return nameA.localeCompare(nameB);
  });

  // Create list items for each client
  const clientListHTML = sortedClients
    .map((client) => {
      // Get initials for avatar
      const name = client.name || "Unnamed Client";
      const initials = name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return `
          <li class="client-item" data-userid="${client.user_id}">
            <div class="client-avatar">${initials}</div>
            <a href="#" class="client-link">
              <span class="client-name">${name}</span>
            </a>
          </li>
        `;
    })
    .join("");

  clientList.innerHTML = clientListHTML;

  // Add event listeners to the client items
  document.querySelectorAll(".client-item").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const userId = this.getAttribute("data-userid");

      // Highlight the selected client
      document.querySelectorAll(".client-item").forEach((item) => {
        item.classList.remove("active");
      });
      this.classList.add("active");

      // Clear existing details
      clearClientDetails();

      // Show loading state
      showLoadingState();

      // Fetch and display the client's details
      fetchClientDetails(userId);
    });
  });
}

// Function to add the client list styles
function addClientListStyles() {
  // Check if styles already exist
  if (document.getElementById("client-list-styles")) return;

  const styleSheet = document.createElement("style");
  styleSheet.id = "client-list-styles";
  styleSheet.textContent = `
    /* Client list container styles */
    #clientList {
      list-style: none;
      padding: 0;
      margin: 0;
      overflow-y: auto;
    }
    
    /* Client item styles */
    .client-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-radius: 8px;
      margin: 4px 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .client-item:hover {
      background-color: #f2f5f9;
    }
    
    .client-item.active {
      background-color: #e6f2ff;
    }
    
    /* Client avatar styles */
    .client-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #e1e8f0;
      color: #4a5568;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .client-item.active .client-avatar {
      background-color: #3182ce;
      color: white;
    }
    
    /* Client link styles */
    .client-link {
      text-decoration: none;
      color: #2d3748;
      font-size: 14px;
      font-weight: 500;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 4px 0;
    }
    
    .client-item.active .client-link {
      color: #2c5282;
      font-weight: 600;
    }
    
    /* Empty state styles */
    .empty-clients {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;
    }
    
    .empty-icon {
      font-size: 24px;
      margin-bottom: 12px;
      opacity: 0.7;
    }
    
    .empty-clients p {
      color: #718096;
      margin: 0;
      font-size: 14px;
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .client-item:hover {
        background-color: #2d3748;
      }
      
      .client-item.active {
        background-color: #2c5282;
      }
      
      .client-avatar {
        background-color: #4a5568;
        color: #e2e8f0;
      }
      
      .client-item.active .client-avatar {
        background-color: #4299e1;
        color: white;
      }
      
      .client-link {
        color: #e2e8f0;
      }
      
      .client-item.active .client-link {
        color: #ebf8ff;
      }
      
      .empty-clients p {
        color: #a0aec0;
      }
    }
  `;

  document.head.appendChild(styleSheet);
}

// Enhance the fetchClientDetails function to also fetch investments
function fetchClientDetails(userId) {
  // First fetch basic client details
  fetch(`/api/client-details/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(`Details for client ID ${userId}:`, data.client);

      // Populate the client details form
      displayClientDetails(data.client);

      // Then fetch investments data
      return fetchClientInvestments(userId);
    })
    .catch((error) => {
      console.error("Error fetching client details:", error);
      // Show error message in the client details area
      const errorMessage = document.createElement("p");
      errorMessage.className = "error-message";
      errorMessage.textContent =
        "Error loading client details. Please try again.";

      const detailsContainer = document.querySelector(".client-details");
      clearClientDetails();
      if (detailsContainer) {
        detailsContainer.appendChild(errorMessage);
      }
    });
}

/// Function to fetch client investments
function fetchClientInvestments(userId) {
  // Show loading state in investments section
  const stocksGrid = document.getElementById("stocksGrid");
  if (stocksGrid) {
    stocksGrid.innerHTML =
      '<div class="loading-indicator">Loading investments data...</div>';
  }

  fetch(`/api/client-investments/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(`Investments for client ID ${userId}:`, data);

      // Display the combined investments
      displayInvestments(data.investments);
    })
    .catch((error) => {
      console.error("Error fetching investment data:", error);

      // Show error message in the investments section
      if (stocksGrid) {
        stocksGrid.innerHTML =
          '<div class="error-message">Error loading investment data. Please try again.</div>';
      }
    });
}

// Function to display combined investments with modern styling
function displayInvestments(investments) {
  const stocksGrid = document.getElementById("stocksGrid");
  if (!stocksGrid) return;

  // Clear the grid
  stocksGrid.innerHTML = "";

  // Check if there are any investments
  if (investments.length === 0) {
    stocksGrid.innerHTML =
      "<div class='no-investments'>No investments found for this client.</div>";
    return;
  }

  // Create a container for the investments
  const container = document.createElement("div");
  container.className = "investments-container";

  investments.forEach((investment) => {
    container.appendChild(
      createInvestmentCard(
        investment.symbol,
        investment.price,
        investment.type || "stock"
      )
    );
  });

  stocksGrid.appendChild(container);

  // Add the necessary CSS
  addInvestmentStyles();
}

// Helper function to create investment card
function createInvestmentCard(symbol, price, type) {
  // Create card container
  const card = document.createElement("div");
  card.className = `investment-card ${type.toLowerCase()}-card`;

  // Create card content wrapper
  const contentWrapper = document.createElement("div");
  contentWrapper.className = "card-content";

  // Create symbol element with icon container
  const symbolContainer = document.createElement("div");
  symbolContainer.className = "symbol-container";

  const symbolIcon = document.createElement("div");
  symbolIcon.className = "symbol-icon";
  symbolIcon.textContent = symbol.charAt(0);

  const symbolElement = document.createElement("h3");
  symbolElement.className = "investment-symbol";
  symbolElement.textContent = symbol;

  symbolContainer.appendChild(symbolIcon);
  symbolContainer.appendChild(symbolElement);

  // Create price element with label
  const priceContainer = document.createElement("div");
  priceContainer.className = "price-container";

  const priceLabel = document.createElement("span");
  priceLabel.className = "price-label";
  priceLabel.textContent = "Invested";

  const priceElement = document.createElement("p");
  priceElement.className = "investment-price";
  priceElement.textContent = `$${parseFloat(price).toFixed(2)}`;

  priceContainer.appendChild(priceLabel);
  priceContainer.appendChild(priceElement);

  // Create type badge
  const typeElement = document.createElement("span");
  typeElement.className = "investment-type";
  typeElement.textContent =
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  // Assemble the card
  contentWrapper.appendChild(symbolContainer);
  contentWrapper.appendChild(priceContainer);
  contentWrapper.appendChild(typeElement);
  card.appendChild(contentWrapper);

  return card;
}

// Function to add the required CSS styles
function addInvestmentStyles() {
  // Check if styles already exist
  if (document.getElementById("investment-styles")) return;

  const styleSheet = document.createElement("style");
  styleSheet.id = "investment-styles";
  styleSheet.textContent = `
    .investments-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      width: 100%;
    }
    
    .investment-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      padding: 20px;
      transition: transform 0.2s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
    }
    
    .investment-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
    }
    
    .stock-card {
      border-left: 4px solid #3498db;
    }
    
    .bond-card {
      border-left: 4px solid #2ecc71;
    }
    
    .etf-card {
      border-left: 4px solid #9b59b6;
    }
    
    .crypto-card {
      border-left: 4px solid #f39c12;
    }
    
    .card-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 15px;
    }
    
    .symbol-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .symbol-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #f0f5ff;
      color: #3498db;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
    }
    
    .stock-card .symbol-icon {
      background: #f0f5ff;
      color: #3498db;
    }
    
    .bond-card .symbol-icon {
      background: #f0fff5;
      color: #2ecc71;
    }
    
    .etf-card .symbol-icon {
      background: #f5f0ff;
      color: #9b59b6;
    }
    
    .crypto-card .symbol-icon {
      background: #fff8f0;
      color: #f39c12;
    }
    
    .investment-symbol {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .price-container {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .price-label {
      font-size: 12px;
      color: #7f8c8d;
      font-weight: 500;
    }
    
    .investment-price {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: #2c3e50;
    }
    
    .investment-type {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 500;
      background: #f8f9fa;
      color: #7f8c8d;
    }
    
    .stock-card .investment-type {
      background: #e6f2ff;
      color: #3498db;
    }
    
    .bond-card .investment-type {
      background: #e6fff2;
      color: #2ecc71;
    }
    
    .etf-card .investment-type {
      background: #f2e6ff;
      color: #9b59b6;
    }
    
    .crypto-card .investment-type {
      background: #fff5e6;
      color: #f39c12;
    }
    
    .no-investments {
      padding: 30px;
      text-align: center;
      color: #7f8c8d;
      background: #f8f9fa;
      border-radius: 12px;
      font-weight: 500;
    }
  `;

  document.head.appendChild(styleSheet);
}

// Enhance the clearClientDetails function to also clear investments
function clearClientDetails() {
  document.getElementById("clientFirstName").value = "";
  document.getElementById("clientLastName").value = "";
  document.getElementById("clientEmail").value = "";
  document.getElementById("clientPhone").value = "";
  document.getElementById("clientCountry").value = "";
  document.getElementById("clientPostalCode").value = "";

  // Clear investments grid
  const stocksGrid = document.getElementById("stocksGrid");
  if (stocksGrid) {
    stocksGrid.innerHTML = "";
  }

  // Remove any error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((msg) => msg.remove());
}

// Function to display client details in the form
function displayClientDetails(client) {
  // Remove loading state
  hideLoadingState();
  // Set form field values
  document.getElementById("clientFirstName").value = client.firstName || "";
  document.getElementById("clientLastName").value = client.lastName || "";
  document.getElementById("clientEmail").value = client.email || "";
  document.getElementById("clientPhone").value = client.phone || "";
  document.getElementById("clientCountry").value = client.country || "";
  document.getElementById("clientPostalCode").value = client.postalCode || "";

  // Set client profile image if available
  const clientPhoto = document.getElementById("clientPhoto");
  if (client.imagePath) {
    // Convert the absolute file path to a URL through our API
    clientPhoto.src = `/api/images?path=${encodeURIComponent(
      client.imagePath
    )}`;
    clientPhoto.alt = `${client.firstName} ${client.lastName}`;
  } else {
    // Make sure this path is correct relative to your HTML file
    clientPhoto.src = "/assets/images/default-profile.png";
    clientPhoto.alt = "Default Profile";
  }

  // Make the details section visible if it was hidden
  const detailsContainer = document.querySelector(".client-details");
  if (detailsContainer) {
    detailsContainer.style.display = "block";
  }
}

// Function to clear client details form
function clearClientDetails() {
  document.getElementById("clientFirstName").value = "";
  document.getElementById("clientLastName").value = "";
  document.getElementById("clientEmail").value = "";
  document.getElementById("clientPhone").value = "";
  document.getElementById("clientCountry").value = "";
  document.getElementById("clientPostalCode").value = "";

  // Remove any error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((msg) => msg.remove());
}

// Function to show loading state
function showLoadingState() {
  const detailsContainer = document.querySelector(".client-details");
  if (detailsContainer) {
    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-indicator";
    loadingIndicator.textContent = "Loading client details...";

    detailsContainer.appendChild(loadingIndicator);
  }
}

// Function to hide loading state
function hideLoadingState() {
  const loadingIndicators = document.querySelectorAll(".loading-indicator");
  loadingIndicators.forEach((indicator) => indicator.remove());
}
