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

// Function to update the sidebar with client names
function updateClientSidebar(clients) {
  const clientList = document.getElementById("clientList");
  if (!clientList) return;

  if (clients.length === 0) {
    clientList.innerHTML = "<li>No clients assigned</li>";
    return;
  }

  // Create list items for each client
  const clientListHTML = clients
    .map(
      (client) => `
    <li class="client-item" data-userid="${client.user_id}">
      <a href="#" class="client-link">${client.name || "Unnamed Client"}</a>
    </li>
  `
    )
    .join("");

  clientList.innerHTML = clientListHTML;

  // Add event listeners to the client links
  document.querySelectorAll(".client-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const userId = this.parentElement.getAttribute("data-userid");

      // Highlight the selected client
      document.querySelectorAll(".client-item").forEach((item) => {
        item.classList.remove("active");
      });
      this.parentElement.classList.add("active");

      // Clear existing details
      clearClientDetails();

      // Show loading state
      showLoadingState();

      // Fetch and display the client's details
      fetchClientDetails(userId);
    });
  });
}

// Add these functions to your advisor-dashboard.js file

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

// Function to display combined investments
function displayInvestments(investments) {
  const stocksGrid = document.getElementById("stocksGrid");
  if (!stocksGrid) return;

  // Clear the grid
  stocksGrid.innerHTML = "";

  // Check if there are any investments
  if (investments.length === 0) {
    stocksGrid.innerHTML = "<div>No investments found for this client.</div>";
    return;
  }

  // Create a container for the investments
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.gap = "10px";

  investments.forEach((investment) => {
    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.borderRadius = "4px";
    card.style.padding = "10px";
    card.style.width = "100px";
    card.style.textAlign = "center";

    const symbolElement = document.createElement("h4");
    symbolElement.textContent = investment.symbol;
    symbolElement.style.margin = "0 0 5px 0";

    const priceElement = document.createElement("p");
    priceElement.textContent = `$${parseFloat(investment.price).toFixed(2)}`;
    priceElement.style.margin = "0";

    card.appendChild(symbolElement);
    card.appendChild(priceElement);

    container.appendChild(card);
  });

  stocksGrid.appendChild(container);
}

// Helper function to create investment card
function createInvestmentCard(symbol, price, type) {
  const card = document.createElement("div");
  card.className = `investment-card ${type}-card`;

  const symbolElement = document.createElement("h4");
  symbolElement.textContent = symbol;

  const priceElement = document.createElement("p");
  priceElement.textContent = `$${parseFloat(price).toFixed(2)}`;

  const typeElement = document.createElement("span");
  typeElement.className = "investment-type";
  typeElement.textContent = type === "stock" ? "Stock" : "Investment";

  card.appendChild(symbolElement);
  card.appendChild(priceElement);
  card.appendChild(typeElement);

  return card;
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
