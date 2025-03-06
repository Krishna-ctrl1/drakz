document.addEventListener('DOMContentLoaded', () => {
  // Fallback placeholder image
  const PLACEHOLDER_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="%23cccccc"><rect width="100%" height="100%" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="20">No Image</text></svg>';

  // DOM Elements
  const clientListEl = document.getElementById("clientList");
  const clientPhotoEl = document.getElementById("clientPhoto");
  const clientFirstNameEl = document.getElementById("clientFirstName");
  const clientLastNameEl = document.getElementById("clientLastName");
  const clientEmailEl = document.getElementById("clientEmail");
  const clientPhoneEl = document.getElementById("clientPhone");
  const clientCountryEl = document.getElementById("clientCountry");
  const clientPostalCodeEl = document.getElementById("clientPostalCode");
  const clientStocksTitleEl = document.getElementById("clientStocksTitle");
  const stocksGridEl = document.getElementById("stocksGrid");
  const seeAllLink = document.getElementById("seeAllLink");
  const deleteClientBtn = document.getElementById("deleteClientBtn");
  const sendButton = document.querySelector('.send-button');
  const photoPreview = document.getElementById('photoPreview');
  const clientPhotoInput = document.getElementById('clientPhotoInput');
  const openAddClientDialog = document.getElementById("openAddClientDialog");
  const addClientModal = document.getElementById("addClientModal");
  const closeModalBtn = document.querySelector(".close-modal");
  const searchInput = document.querySelector('.search-container input');
  const stocksContainer = document.getElementById("stocksContainer");
  const addStockBtn = document.getElementById("addStockBtn");
  const investmentsContainer = document.getElementById("investmentsContainer");
  const addInvestmentBtn = document.getElementById("addInvestmentBtn");
  const countrySelect = document.getElementById("newClientCountry");
  const clientForm = document.getElementById('clientForm');

  // Simple array of country names
  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Japan", 
    "China", "India", "Brazil", "Mexico", "South Africa", "Russia", "New Zealand", 
    // ... (rest of the country list from previous code)
  ];

  // Default postal codes mapping
  const defaultPostalCodes = {
    "United States": "12345",
    "Canada": "K1A 0B1",
    "United Kingdom": "SW1A 1AA",
    "Australia": "2000"
  };

  // Improved client data parsing
  let clients = window.initialClients || [];

  clients = clients.map(client => ({
    ...client,
    photo: client.photo || PLACEHOLDER_IMAGE
  }));

  console.log('Loaded clients:', clients);

  function populateCountryDropdown() {
    const countrySelect = document.getElementById("newClientCountry");
    if (countrySelect) {
        const countries = [
            "United States", "Canada", "United Kingdom", "Australia", 
            "Germany", "France", "Japan", "China", "India"
        ];

        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
    }
}

  // Populate client list
  function populateClientList() {
    if (!clientListEl) {
      console.error('Client list element not found');
      return;
    }

    clientListEl.innerHTML = "";
    
    if (clients.length === 0) {
      console.warn('No clients to display');
      return;
    }

    clients.forEach((client, index) => {
      const li = document.createElement("li");
      li.setAttribute("data-index", index);
      li.innerHTML = `
        <img src="${client.photo}" alt="${client.firstName} ${client.lastName}">
        <span>${client.firstName} ${client.lastName}</span>
      `;
      li.addEventListener("click", () => loadClientData(index));
      clientListEl.appendChild(li);
    });
  }

  // Load client data
  function loadClientData(index) {
    if (index < 0 || index >= clients.length) return;

    const c = clients[index];
    
    if (clientPhotoEl) clientPhotoEl.src = c.photo || PLACEHOLDER_IMAGE;
    if (clientFirstNameEl) clientFirstNameEl.value = c.firstName;
    if (clientLastNameEl) clientLastNameEl.value = c.lastName;
    if (clientEmailEl) clientEmailEl.value = c.email;
    if (clientPhoneEl) clientPhoneEl.value = c.phone;
    if (clientCountryEl) clientCountryEl.value = c.country;
    if (clientPostalCodeEl) clientPostalCodeEl.value = c.postalCode;
    
    if (clientStocksTitleEl) {
      clientStocksTitleEl.textContent = `${c.firstName}'s Stocks & Investments`;
    }
    
    // Display investments
    if (stocksGridEl) {
      stocksGridEl.innerHTML = "";
      const allInvestments = (c.stocks || []).concat(c.investments || []);
      
      allInvestments.slice(0, 3).forEach(inv => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "stock-item";
        
        if (inv.symbol) {
          itemDiv.innerHTML = `
            <div class="stock-logo">
              <img src="https://via.placeholder.com/40?text=${inv.symbol}" alt="${inv.symbol}">
            </div>
            <div>
              <div><strong>${inv.symbol}</strong></div>
              <div class="investment-type">Stock</div>
              <div>${inv.price}</div>
            </div>
          `;
        } else {
          itemDiv.innerHTML = `
            <div class="stock-logo">
              <i class="fas fa-briefcase"></i>
            </div>
            <div>
              <div><strong>${inv.type}</strong></div>
              <div class="investment-type">Investment</div>
              <div>${inv.value}</div>
            </div>
          `;
        }
        
        stocksGridEl.appendChild(itemDiv);
      });
    }
  }

  // Initialize dashboard
  function initializeDashboard() {
    populateCountryDropdown();
    populateClientList();
    
    // Automatically load first client if exists
    if (clients.length > 0) {
      loadClientData(0);
    }
  }

  // Call initialization
  initializeDashboard();

  // Ensure clients is an array
  clients = Array.isArray(clients) ? clients : [];

  console.log('Final loaded clients:', clients);

  // Country change event listener
  function setupCountryChangeListener() {
    if (countrySelect) {
      countrySelect.addEventListener("change", function() {
        const selected = this.value;
        const postalInput = document.getElementById("newClientPostalCode");
        if (postalInput) {
          postalInput.value = defaultPostalCodes[selected] || "00000";
        }
      });
    }
  }

  // Reset form function
  function resetForm() {
    if (clientForm) {
      clientForm.reset();
      
      // Reset photo preview
      if (photoPreview) {
        photoPreview.innerHTML = `<i class="fas fa-camera"></i><span>Add Photo</span>`;
      }
      
      // Clear dynamic stock and investment rows
      if (stocksContainer) stocksContainer.innerHTML = "";
      if (investmentsContainer) investmentsContainer.innerHTML = "";
    }
  }

  // Clear client info when no clients exist
  function clearClientInfo() {
    if (clientPhotoEl) clientPhotoEl.src = PLACEHOLDER_IMAGE;
    if (clientFirstNameEl) clientFirstNameEl.value = "";
    if (clientLastNameEl) clientLastNameEl.value = "";
    if (clientEmailEl) clientEmailEl.value = "";
    if (clientPhoneEl) clientPhoneEl.value = "";
    if (clientCountryEl) clientCountryEl.value = "";
    if (clientPostalCodeEl) clientPostalCodeEl.value = "";
    if (stocksGridEl) stocksGridEl.innerHTML = "";
  }

  // Save clients to server
  function saveClients() {
    try {
      fetch('/update-clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clients)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save clients');
        }
        console.log('Clients saved successfully');
      })
      .catch(error => {
        console.error('Error saving clients:', error);
      });
    } catch (e) {
      console.error("Error preparing client data:", e);
    }
  }

  // Add new client
  function addNewClient() {
    const newClient = {
      firstName: document.getElementById('newClientFirstName').value.trim(),
      lastName: document.getElementById('newClientLastName').value.trim(),
      email: document.getElementById('newClientEmail').value.trim(),
      phone: document.getElementById('newClientPhone').value.trim(),
      country: document.getElementById('newClientCountry').value,
      postalCode: document.getElementById('newClientPostalCode').value.trim(),
      photo: photoPreview.querySelector('img') ? photoPreview.querySelector('img').src : PLACEHOLDER_IMAGE,
      stocks: [],
      investments: []
    };

    // Get dynamic stocks
    document.querySelectorAll("#stocksContainer .dynamic-input-row").forEach(row => {
      const symbol = row.querySelector(".stock-symbol").value.trim();
      const price = row.querySelector(".stock-price").value.trim();
      if (symbol && price) {
        newClient.stocks.push({ 
          symbol, 
          price, 
          logo: `https://via.placeholder.com/40?text=${symbol}` 
        });
      }
    });

    // Get dynamic investments
    document.querySelectorAll("#investmentsContainer .dynamic-input-row").forEach(row => {
      const type = row.querySelector(".invest-type").value.trim();
      const value = row.querySelector(".invest-value").value.trim();
      if (type && value) {
        newClient.investments.push({ type, value });
      }
    });

    // Send new client to the server
    fetch('/add-client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newClient)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add client');
      }
      return response.json();
    })
    .then(addedClient => {
      clients.push(addedClient);
      populateClientList();
      resetForm();
      closeModal();
      loadClientData(clients.length - 1);
    })
    .catch(error => {
      console.error('Error adding client:', error);
      alert('Failed to add client. Please try again.');
    });
  }

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
      deleteClientBtn.addEventListener("click", function() {
        if (confirm("Are you sure you want to delete this client?")) {
          const clientToDelete = clients[currentClientIndex];
          
          fetch('/delete-client', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientId: clientToDelete.id })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to delete client');
            }
            
            clients.splice(currentClientIndex, 1);
            populateClientList();
            
            if (clients.length > 0) {
              loadClientData(0);
            } else {
              clearClientInfo();
            }
          })
          .catch(error => {
            console.error('Error deleting client:', error);
            alert('Failed to delete client. Please try again.');
          });
        }
      });
    }

    // Send email functionality
    if (sendButton) {
      sendButton.addEventListener("click", () => {
        const messageInput = document.getElementById('chat-input');
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

    // Modal controls
    if (openAddClientDialog) {
      openAddClientDialog.addEventListener("click", openModal);
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal);
    }

    // Close modal if clicked outside
    window.addEventListener("click", (e) => {
      if (e.target == addClientModal) {
        closeModal();
      }
    });

    // Photo upload
    if (photoPreview && clientPhotoInput) {
      photoPreview.addEventListener("click", () => clientPhotoInput.click());
      
      clientPhotoInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
          }
          reader.readAsDataURL(file);
        }
      });
    }

    // Dynamic stock input rows
    if (addStockBtn && stocksContainer) {
      addStockBtn.addEventListener("click", () => {
        const stockRow = document.createElement("div");
        stockRow.className = "dynamic-input-row";
        stockRow.innerHTML = `
          <input type="text" placeholder="Stock Symbol" class="stock-symbol" style="width:45%;" />
          <input type="text" placeholder="Price" class="stock-price" style="width:45%;" />
        `;
        stocksContainer.appendChild(stockRow);
      });
    }

    // Dynamic investment input rows
    if (addInvestmentBtn && investmentsContainer) {
      addInvestmentBtn.addEventListener("click", () => {
        const investRow = document.createElement("div");
        investRow.className = "dynamic-input-row";
        investRow.innerHTML = `
          <input type="text" placeholder="Investment Type" class="invest-type" style="width:45%;" />
          <input type="text" placeholder="Value" class="invest-value" style="width:45%;" />
        `;
        investmentsContainer.appendChild(investRow);
      });
    }

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        const liItems = document.querySelectorAll('.client-list li');
        liItems.forEach(li => {
          const name = li.textContent.toLowerCase();
          li.style.display = name.includes(filter) ? 'flex' : 'none';
        });
      });
    }

    // Form validation and submission
    if (clientForm) {
      clientForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const inputs = Array.from(clientForm.elements).filter(el => el.tagName === 'INPUT' || el.tagName === 'SELECT');
        let isValid = true;
        
        inputs.forEach(input => {
          if (!input.checkValidity()) {
            isValid = false;
            if (input.nextElementSibling) {
              input.nextElementSibling.style.display = 'block';
            }
          } else {
            if (input.nextElementSibling) {
              input.nextElementSibling.style.display = 'none';
            }
          }
        });
        
        if (isValid) addNewClient();
      });
    }
  }

  // Modal control functions
  function openModal() {
    if (addClientModal) {
      addClientModal.style.display = "flex";
    }
  }

  function closeModal() {
    if (addClientModal) {
      addClientModal.style.display = "none";
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