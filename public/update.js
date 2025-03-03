/* update.js - Handles loading, updating, and dynamic addition/removal of stocks and investments */

// Load clients from localStorage or use an empty array if none exist
let clients = JSON.parse(localStorage.getItem("clients")) || [];

// Track the currently selected client index
let currentClientIndex = 0;

// DOM Elements
const clientListEl = document.getElementById("clientList");
const clientPhotoEl = document.getElementById("clientPhoto");
const clientFirstNameEl = document.getElementById("clientFirstName");
const clientLastNameEl = document.getElementById("clientLastName");
const clientEmailEl = document.getElementById("clientEmail");
const clientPhoneEl = document.getElementById("clientPhone");
const clientCountryEl = document.getElementById("clientCountry");
const clientPostalCodeEl = document.getElementById("clientPostalCode");
const updateClientBtn = document.getElementById("updateClientBtn");
const stocksGridEl = document.getElementById("stocksGrid");
const investmentsGridEl = document.getElementById("investmentsGrid");
const addStockBtn = document.getElementById("addStockBtn");
const addInvestmentBtn = document.getElementById("addInvestmentBtn");

// Photo update elements
const updatePhotoPreview = document.getElementById("updatePhotoPreview");
const updatePhotoInput = document.getElementById("updatePhotoInput");

// Save clients to localStorage
function saveClients() {
  localStorage.setItem("clients", JSON.stringify(clients));
}

// Populate the client list in the sidebar
function populateClientList() {
  clientListEl.innerHTML = "";
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

// Load a client's data into the update form
function loadClientData(index) {
  currentClientIndex = index;
  const client = clients[index];
  clientPhotoEl.src = client.photo;
  clientFirstNameEl.value = client.firstName;
  clientLastNameEl.value = client.lastName;
  clientEmailEl.value = client.email;
  clientPhoneEl.value = client.phone;
  clientCountryEl.value = client.country;
  clientPostalCodeEl.value = client.postalCode;
  
  populateStocks(client.stocks);
  populateInvestments(client.investments);
}

// Populate stocks into the stocks grid
function populateStocks(stocks) {
  stocksGridEl.innerHTML = "";
  if (stocks && stocks.length > 0) {
    stocks.forEach((stock) => {
      const row = document.createElement("div");
      row.className = "dynamic-input-row";
      row.innerHTML = `
        <input type="text" class="stock-symbol" placeholder="Stock Symbol" value="${stock.symbol}">
        <input type="text" class="stock-price" placeholder="Price" value="${stock.price}">
        <button class="delete-stock-btn"><i class="fa fa-trash"></i></button>
      `;
      stocksGridEl.appendChild(row);
    });
  }
}

// Populate investments into the investments grid
function populateInvestments(investments) {
  investmentsGridEl.innerHTML = "";
  if (investments && investments.length > 0) {
    investments.forEach((inv) => {
      const row = document.createElement("div");
      row.className = "dynamic-input-row";
      row.innerHTML = `
        <input type="text" class="invest-type" placeholder="Investment Type" value="${inv.type}">
        <input type="text" class="invest-value" placeholder="Value" value="${inv.value}">
        <button class="delete-investment-btn"><i class="fa fa-trash"></i></button>
      `;
      investmentsGridEl.appendChild(row);
    });
  }
}

// Update the current client's data based on the form inputs
function updateClient() {
  const client = clients[currentClientIndex];
  
  // Update basic info
  client.firstName = clientFirstNameEl.value.trim();
  client.lastName = clientLastNameEl.value.trim();
  client.email = clientEmailEl.value.trim();
  client.phone = clientPhoneEl.value.trim();
  client.country = clientCountryEl.value.trim();
  client.postalCode = clientPostalCodeEl.value.trim();
  client.photo = clientPhotoEl.src;
  
  // Update stocks from the stocks grid
  const stockRows = stocksGridEl.querySelectorAll(".dynamic-input-row");
  const updatedStocks = [];
  stockRows.forEach(row => {
    const symbol = row.querySelector(".stock-symbol").value.trim();
    const price = row.querySelector(".stock-price").value.trim();
    if (symbol && price) {
      updatedStocks.push({ symbol, price, logo: `https://via.placeholder.com/40?text=${symbol}` });
    }
  });
  client.stocks = updatedStocks;
  
  // Update investments from the investments grid
  const investRows = investmentsGridEl.querySelectorAll(".dynamic-input-row");
  const updatedInvestments = [];
  investRows.forEach(row => {
    const type = row.querySelector(".invest-type").value.trim();
    const value = row.querySelector(".invest-value").value.trim();
    if (type && value) {
      updatedInvestments.push({ type, value });
    }
  });
  client.investments = updatedInvestments;
  
  saveClients();
  populateClientList();
  alert("Client updated successfully!");
}

// Event listener for the update button
updateClientBtn.addEventListener("click", updateClient);

// Add new stock row
addStockBtn.addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "dynamic-input-row";
  row.innerHTML = `
    <input type="text" class="stock-symbol" placeholder="Stock Symbol">
    <input type="text" class="stock-price" placeholder="Price">
    <button class="delete-stock-btn"><i class="fa fa-trash"></i></button>
  `;
  stocksGridEl.appendChild(row);
});

// Add new investment row
addInvestmentBtn.addEventListener("click", () => {
  const row = document.createElement("div");
  row.className = "dynamic-input-row";
  row.innerHTML = `
    <input type="text" class="invest-type" placeholder="Investment Type">
    <input type="text" class="invest-value" placeholder="Value">
    <button class="delete-investment-btn"><i class="fa fa-trash"></i></button>
  `;
  investmentsGridEl.appendChild(row);
});

// Delete stock row using event delegation
stocksGridEl.addEventListener("click", function(e) {
  if (e.target.closest(".delete-stock-btn")) {
    e.target.closest(".dynamic-input-row").remove();
  }
});

// Delete investment row using event delegation
investmentsGridEl.addEventListener("click", function(e) {
  if (e.target.closest(".delete-investment-btn")) {
    e.target.closest(".dynamic-input-row").remove();
  }
});

// Photo update: clicking the photo preview opens file selector
updatePhotoPreview.addEventListener("click", () => {
  updatePhotoInput.click();
});

updatePhotoInput.addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      clientPhotoEl.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Initial population of client list and load the first client (if available)
populateClientList();
if (clients.length > 0) {
  loadClientData(0);
}
