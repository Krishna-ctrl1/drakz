// Sample initial clients with separate first/last names, country, postal code, stocks, and investments
let clients = [
  {
    firstName: "Clara",
    lastName: "Mentos",
    email: "clara@example.com",
    phone: "5551234567",
    country: "United States",
    postalCode: "12345",
    photo: "assets/images/client2.jpg",
    stocks: [
      { symbol: "AAPL", price: "$125.50", logo: "https://via.placeholder.com/40?text=AAPL" },
      { symbol: "GOOGL", price: "$2100.00", logo: "https://via.placeholder.com/40?text=GOOG" },
      { symbol: "AMZN", price: "$3100.00", logo: "https://via.placeholder.com/40?text=AMZN" }
    ],
    investments: [
      { type: "Real Estate", value: "$500,000" },
      { type: "Bonds", value: "$200,000" }
    ]
  },
  {
    firstName: "James",
    lastName: "Jorham",
    email: "james@example.com",
    phone: "5559876543",
    country: "United States",
    postalCode: "54321",
    photo: "assets/images/client1.jpeg",
    stocks: [
      { symbol: "TSLA", price: "$800.00", logo: "https://via.placeholder.com/40?text=TSLA" },
      { symbol: "NFLX", price: "$500.00", logo: "https://via.placeholder.com/40?text=NFLX" }
    ],
    investments: [
      { type: "Cryptocurrency", value: "$150,000" }
    ]
  },
  {
    firstName: "Oliver",
    lastName: "Smith",
    email: "oliver@example.com",
    phone: "5551112222",
    country: "United States",
    postalCode: "67890",
    photo: "assets/images/client1.jpeg",
    stocks: [
      { symbol: "MSFT", price: "$280.00", logo: "https://via.placeholder.com/40?text=MSFT" },
      { symbol: "INTC", price: "$60.00", logo: "https://via.placeholder.com/40?text=INTC" },
      { symbol: "AMD", price: "$95.00", logo: "https://via.placeholder.com/40?text=AMD" }
    ],
    investments: [
      { type: "Mutual Funds", value: "$300,000" }
    ]
  },
  {
    firstName: "Jason",
    lastName: "Kim",
    email: "jason@example.com",
    phone: "5553334444",
    country: "United States",
    postalCode: "11223",
    photo: "assets/images/client1.jpeg",
    stocks: [
      { symbol: "FB", price: "$350.00", logo: "https://via.placeholder.com/40?text=FB" },
      { symbol: "TWTR", price: "$60.00", logo: "https://via.placeholder.com/40?text=TWTR" }
    ],
    investments: [
      { type: "Commodities", value: "$100,000" }
    ]
  }
];
// Function to save clients to localStorage
function saveClients() {
  localStorage.setItem("clients", JSON.stringify(clients));
}

// Check if clients data exists in localStorage and load it
if (localStorage.getItem("clients")) {
  clients = JSON.parse(localStorage.getItem("clients"));
} else {
  saveClients(); // Save the default data if nothing is stored yet
}

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
const clientStocksTitleEl = document.getElementById("clientStocksTitle");
const stocksGridEl = document.getElementById("stocksGrid");
const seeAllLink = document.getElementById("seeAllLink");
const deleteClientBtn = document.getElementById("deleteClientBtn");


// Populate sidebar client list
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

populateClientList();

// Search functionality – filter client list as user types
const searchInput = document.querySelector('.search-container input');
searchInput.addEventListener('input', function() {
  const filter = this.value.toLowerCase();
  const liItems = document.querySelectorAll('.client-list li');
  liItems.forEach(li => {
    const name = li.textContent.toLowerCase();
    li.style.display = name.includes(filter) ? 'flex' : 'none';
  });
});

// Display combined stocks and investments
function displayInvestments(investments) {
  stocksGridEl.innerHTML = "";
  investments.forEach(inv => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "stock-item";
    if (inv.symbol) {
      itemDiv.innerHTML = `
        <div class="stock-logo">
          <img src="https://logo.clearbit.com/${inv.symbol.toLowerCase()}.com" 
               onerror="this.onerror=null;this.src='https://via.placeholder.com/40?text=${inv.symbol}'" alt="${inv.symbol}">
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

// Toggle between showing first 3 items and all investments
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

// Load client data into the info panel
function loadClientData(index) {
  currentClientIndex = index;
  const c = clients[index];
  clientPhotoEl.src = c.photo;
  clientFirstNameEl.value = c.firstName;
  clientLastNameEl.value = c.lastName;
  clientEmailEl.value = c.email;
  clientPhoneEl.value = c.phone;
  clientCountryEl.value = c.country;
  clientPostalCodeEl.value = c.postalCode;
  clientStocksTitleEl.textContent = `${c.firstName}'s Stocks & Investments`;
  
  // Reset showAll state and display first 3 investments by default
  c.showAll = false;
  const allInvestments = c.stocks.concat(c.investments);
  displayInvestments(allInvestments.slice(0, 3));
  seeAllLink.onclick = () => toggleInvestments(index);
}

loadClientData(0);
// ==============================
// Email Sending Feature
// When the "Send" button in the chat box is clicked,
// this code retrieves the message and the current client's email,
// and then opens the user's default mail client via a mailto: link.
// ==============================
const sendButton = document.querySelector('.send-button');
sendButton.addEventListener("click", () => {
  const messageInput = document.getElementById('chat-input');
  const message = messageInput.value.trim();
  const clientEmail = clientEmailEl.value.trim(); // Client's email from the profile panel

  if (message === "") {
    alert("Please type a message before sending.");
    return;
  }

  if (clientEmail === "") {
    alert("Client email is missing.");
    return;
  }

  // Encode the subject and body for the mailto URL
  const subject = encodeURIComponent("Message from Your Advisor");
  const body = encodeURIComponent(message);

  // Open the default email client with a new email draft
  window.location.href = `mailto:${clientEmail}?subject=${subject}&body=${body}`;

  // Optionally clear the chat input after sending
  messageInput.value = "";
});


// Delete client functionality
deleteClientBtn.addEventListener("click", function() {
  if (confirm("Are you sure you want to delete this client?")) {
    clients.splice(currentClientIndex, 1);
    saveClients(); // Update localStorage after deletion
    populateClientList();
    if (clients.length > 0) {
      loadClientData(0);
    } else {
      // Clear client info if no clients remain
      clientPhotoEl.src = "https://via.placeholder.com/120";
      clientFirstNameEl.value = "";
      clientLastNameEl.value = "";
      clientEmailEl.value = "";
      clientPhoneEl.value = "";
      clientCountryEl.value = "";
      clientPostalCodeEl.value = "";
      stocksGridEl.innerHTML = "";
    }
  }
});


// Modal functionality for adding a new client
const openAddClientDialog = document.getElementById("openAddClientDialog");
const addClientModal = document.getElementById("addClientModal");
const closeModalBtn = document.querySelector(".close-modal");

openAddClientDialog.addEventListener("click", () => {
  addClientModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
  closeModal();
});

window.addEventListener("click", (e) => {
  if (e.target == addClientModal) {
    closeModal();
  }
});

// Photo upload for new client
const photoPreview = document.getElementById('photoPreview');
const clientPhotoInput = document.getElementById('clientPhotoInput');

photoPreview.addEventListener("click", () => {
  clientPhotoInput.click();
});

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

// Dynamic addition of stock input rows
const stocksContainer = document.getElementById("stocksContainer");
const addStockBtn = document.getElementById("addStockBtn");
addStockBtn.addEventListener("click", () => {
  const stockRow = document.createElement("div");
  stockRow.className = "dynamic-input-row";
  stockRow.innerHTML = `
    <input type="text" placeholder="Stock Symbol" class="stock-symbol" style="width:45%;" />
    <input type="text" placeholder="Price" class="stock-price" style="width:45%;" />
  `;
  stocksContainer.appendChild(stockRow);
});

// Dynamic addition of investment input rows
const investmentsContainer = document.getElementById("investmentsContainer");
const addInvestmentBtn = document.getElementById("addInvestmentBtn");
addInvestmentBtn.addEventListener("click", () => {
  const investRow = document.createElement("div");
  investRow.className = "dynamic-input-row";
  investRow.innerHTML = `
    <input type="text" placeholder="Investment Type" class="invest-type" style="width:45%;" />
    <input type="text" placeholder="Value" class="invest-value" style="width:45%;" />
  `;
  investmentsContainer.appendChild(investRow);
});

// ----- New Functionality: Populate full list of countries -----
// A simple array of country names (this list can be extended as needed)
const countries = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina",
  "Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados",
  "Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana",
  "Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon",
  "Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)",
  "Costa Rica","Croatia","Cuba","Cyprus","Czechia (Czech Republic)","Democratic Republic of the Congo",
  "Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea",
  "Eritrea","Estonia","Eswatini (formerly Swaziland)","Ethiopia","Fiji","Finland","France","Gabon",
  "Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau",
  "Guyana","Haiti","Holy See","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait",
  "Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania",
  "Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania",
  "Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique",
  "Myanmar (formerly Burma)","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger",
  "Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine State","Panama",
  "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia",
  "Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino",
  "Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore",
  "Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain",
  "Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand",
  "Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

// Populate the country select dropdown
const countrySelect = document.getElementById("newClientCountry");
countries.forEach(country => {
  const option = document.createElement("option");
  option.value = country;
  option.textContent = country;
  countrySelect.appendChild(option);
});

// Default postal codes mapping (can be expanded)
const defaultPostalCodes = {
  "United States": "12345",
  "Canada": "K1A 0B1",
  "United Kingdom": "SW1A 1AA",
  "Australia": "2000"
};

// When country changes, auto-fill postal code if mapping exists
countrySelect.addEventListener("change", function() {
  const selected = this.value;
  const postalInput = document.getElementById("newClientPostalCode");
  postalInput.value = defaultPostalCodes[selected] || "00000";
});

function addNewClient() {
  // Gather basic info from the form
  const newClient = {
    firstName: document.getElementById('newClientFirstName').value.trim(),
    lastName: document.getElementById('newClientLastName').value.trim(),
    email: document.getElementById('newClientEmail').value.trim(),
    phone: document.getElementById('newClientPhone').value.trim(),
    country: document.getElementById('newClientCountry').value,
    postalCode: document.getElementById('newClientPostalCode').value.trim(),
    photo: photoPreview.querySelector('img') ? photoPreview.querySelector('img').src : 'https://via.placeholder.com/120',
    stocks: [],
    investments: []
  };

  // Get dynamic stocks
  document.querySelectorAll("#stocksContainer .dynamic-input-row").forEach(row => {
    const symbol = row.querySelector(".stock-symbol").value.trim();
    const price = row.querySelector(".stock-price").value.trim();
    if (symbol && price) {
      newClient.stocks.push({ symbol, price, logo: `https://via.placeholder.com/40?text=${symbol}` });
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

  // Add new client to the array and update sidebar
  clients.push(newClient);
  saveClients(); // Save updated clients list to localStorage
  populateClientList();
  resetForm();
  closeModal();
  loadClientData(clients.length - 1);
}


// Reset the add client form
function resetForm() {
  document.getElementById('clientForm').reset();
  photoPreview.innerHTML = `<i class="fas fa-camera"></i><span>Add Photo</span>`;
  stocksContainer.innerHTML = "";
  investmentsContainer.innerHTML = "";
}

// Close modal and reset form
function closeModal() {
  addClientModal.style.display = 'none';
  resetForm();
}

// Form validation feedback
const clientForm = document.getElementById('clientForm');
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
