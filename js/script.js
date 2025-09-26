// Menu Data
const menuData = {
  rotis: [
    { id: 1, name: "Pulkha", price: 7, image: "images/menu/roti.jpg" },
    {
      id: 2,
      name: "Butter Roti",
      price: 15,
      image: "images/menu/butter-roti.jpg",
    },
    { id: 3, name: "Naan", price: 20, image: "images/menu/naan.jpg" },
    {
      id: 4,
      name: "Butter Naan",
      price: 25,
      image: "images/menu/butter-naan.jpg",
    },
    {
      id: 5,
      name: "Garlic Naan",
      price: 30,
      image: "images/menu/garlic-naan.jpg",
    },
  ],
  curries: [
    { id: 6, name: "Punjabi Chicken", price: 220, image: "images/menu/pc.jpg" },
    {
      id: 7,
      name: "MahaRaja Chicken",
      price: 260,
      image: "images/menu/mc.jpg",
    },
    { id: 8, name: "Rombha Chicken", price: 250, image: "images/menu/rc.jpg" },
  ],
  biryanis: [
    {
      id: 9,
      name: "Veg Biryani",
      price: 120,
      image: "images/menu/veg-biryani.jpg",
    },
    {
      id: 10,
      name: "Chicken Biryani",
      price: 180,
      image: "images/menu/chicken-biryani.jpg",
    },
    {
      id: 11,
      name: "Mutton Biryani",
      price: 220,
      image: "images/menu/mutton-biryani.jpg",
    },
  ],
  friedrice: [
    {
      id: 12,
      name: "Veg Fried Rice",
      price: 100,
      image: "images/menu/veg-fried-rice.jpg",
    },
    {
      id: 13,
      name: "Egg Fried Rice",
      price: 130,
      image: "images/menu/egg-fried-rice.jpg",
    },
    {
      id: 14,
      name: "Chicken Fried Rice",
      price: 150,
      image: "images/menu/chicken-fried-rice.jpg",
    },
  ],
  drinks: [
    { id: 15, name: "Water Bottle", price: 20, image: "images/menu/water.jpg" },
    { id: 16, name: "Sprite", price: 20, image: "images/menu/soft-drink.jpg" },
    { id: 17, name: "Lassi", price: 50, image: "images/menu/lassi.jpg" },
  ],
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service Worker registered"))
      .catch((err) =>
        console.error("Service Worker registration failed:", err)
      );
  });
}

let deferredPrompt; // Store the event so it can be triggered later
const installBtn = document.getElementById("installBtn");

// Listen for the beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the mini-infobar from appearing
  e.preventDefault();

  // Save the event so it can be triggered later
  deferredPrompt = e;

  // Show the install button
  installBtn.style.display = "inline-block";
});

// When the user clicks the install button
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === "accepted") {
    console.log("User accepted the install prompt");
  } else {
    console.log("User dismissed the install prompt");
  }

  // Clear the deferredPrompt so it can’t be reused
  deferredPrompt = null;

  // Optionally hide the button
  installBtn.style.display = "none";
});

window.addEventListener("appinstalled", () => {
  console.log("PWA was installed");
  installBtn.style.display = "none";
});

// Application State
let state = {
  currentTable: null,
  currentCategory: "rotis",
  orders: {},
  bills: {},
  language: "en",
  settings: {
    upiId: "yourhotel@upi",
  },
};

// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  // Load saved data from localStorage
  loadData();

  // Set current date in reports
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("reportDate")?.setAttribute("value", today);

  // Initialize tables view
  if (document.querySelector(".tables-view")) {
    initTablesView();
  }

  // Initialize billing view
  if (document.querySelector(".bills-view")) {
    initBillingView();
  }

  // Initialize reports view
  if (document.querySelector(".reports-view")) {
    initReportsView();
  }

  // Initialize settings view
  if (document.querySelector(".settings-view")) {
    initSettingsView();
  }
});

// Load data from localStorage
function loadData() {
  const savedState = localStorage.getItem("hotelManagementState");
  if (savedState) {
    state = JSON.parse(savedState);
  }
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("hotelManagementState", JSON.stringify(state));
}

// Tables View Functions
function initTablesView() {
  // Load table status from state
  updateTableStatus();

  // Handle table selection
  const tableCards = document.querySelectorAll(".table-card");
  tableCards.forEach((card) => {
    card.addEventListener("click", function () {
      const tableNumber = this.getAttribute("data-table");
      openTableDetails(tableNumber);
    });
  });

  // Handle category selection
  const categoryBtns = document.querySelectorAll(".category-btn");
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      categoryBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      state.currentCategory = this.getAttribute("data-category");
      loadMenuItems();
    });
  });

  // Handle close button
  document
    .querySelector(".close-btn")
    ?.addEventListener("click", closeTableDetails);

  // Handle confirm order button
  document
    .querySelector(".confirm-order")
    ?.addEventListener("click", confirmOrder);
}

function updateTableStatus() {
  const tableCards = document.querySelectorAll(".table-card");
  tableCards.forEach((card) => {
    const tableNumber = card.getAttribute("data-table");
    const statusElement = card.querySelector(".table-status");

    if (
      state.orders[tableNumber] &&
      state.orders[tableNumber].items.length > 0
    ) {
      statusElement.textContent = "Occupied";
      statusElement.classList.remove("available");
      statusElement.classList.add("occupied");
    } else {
      statusElement.textContent = "Available";
      statusElement.classList.remove("occupied");
      statusElement.classList.add("available");
    }
  });
}

function openTableDetails(tableNumber) {
  console.log(`Opening table details for table ${tableNumber}`);
  state.currentTable = tableNumber;
  document.getElementById("currentTable").textContent = `Table ${tableNumber}`;
  document.querySelector(".table-details").style.display = "block";

  // Load current order if exists
  if (!state.orders[tableNumber]) {
    state.orders[tableNumber] = { items: [], total: 0 };
  }

  console.log(`Current category: ${state.currentCategory}`);
  loadCurrentOrder();
  loadMenuItems();
}

function closeTableDetails() {
  document.querySelector(".table-details").style.display = "none";
  updateTableStatus();
  saveData();
}

function loadMenuItems() {
  console.log("loadMenuItems() called");
  const menuItemsContainer = document.getElementById("menuItems");
  if (!menuItemsContainer) {
    console.error("Menu items container not found!");
    return;
  }

  menuItemsContainer.innerHTML = "";
  console.log("Menu container cleared");

  const items = menuData[state.currentCategory];
  if (!items || !Array.isArray(items)) {
    console.error(`No menu items found for category: ${state.currentCategory}`);
    console.log("Available categories:", Object.keys(menuData));
    return;
  }

  console.log(
    `Loading ${items.length} items for category: ${state.currentCategory}`
  );

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "menu-item";
    itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
            <div class="item-controls">
                <button class="decrease">-</button>
                <span class="quantity-display">0</span>
                <button class="increase">+</button>
            </div>
        `;

    // Set current quantity if item is already in order
    const currentOrder = state.orders[state.currentTable];
    const existingItem = currentOrder.items.find((i) => i.id === item.id);
    const quantityDisplay = itemElement.querySelector(".quantity-display");

    if (existingItem) {
      quantityDisplay.textContent = existingItem.quantity;
    }

    // Add event listeners for quantity controls
    itemElement
      .querySelector(".increase")
      .addEventListener("click", function (e) {
        e.preventDefault();
        const currentValue = parseInt(quantityDisplay.textContent) || 0;
        const newValue = currentValue + 1;
        quantityDisplay.textContent = newValue;
        updateOrderItem(item.id, newValue);
      });

    itemElement
      .querySelector(".decrease")
      .addEventListener("click", function (e) {
        e.preventDefault();
        const currentValue = parseInt(quantityDisplay.textContent) || 0;
        if (currentValue > 0) {
          const newValue = currentValue - 1;
          quantityDisplay.textContent = newValue;
          updateOrderItem(item.id, newValue);
        }
      });

    menuItemsContainer.appendChild(itemElement);
    console.log(`Added item: ${item.name}`);
  });

  console.log(`Finished loading ${items.length} menu items`);
}

// Debug function - can be called from browser console
window.debugLoadMenu = function () {
  console.log("Manual menu load triggered");
  console.log("Current state:", state);
  console.log("Menu data:", menuData);
  loadMenuItems();
};

function updateOrderItem(itemId, quantity) {
  const currentOrder = state.orders[state.currentTable];

  // Find the item in menuData
  let foundItem = null;
  Object.values(menuData).forEach((category) => {
    category.forEach((item) => {
      if (item.id === itemId) {
        foundItem = item;
      }
    });
  });

  if (foundItem) {
    // Check if item already exists in order
    const existingItemIndex = currentOrder.items.findIndex(
      (i) => i.id === itemId
    );

    if (quantity > 0) {
      if (existingItemIndex !== -1) {
        currentOrder.items[existingItemIndex].quantity = quantity;
      } else {
        currentOrder.items.push({
          id: foundItem.id,
          name: foundItem.name,
          price: foundItem.price,
          quantity: quantity,
        });
      }
    } else if (existingItemIndex !== -1) {
      // Remove item if quantity is 0
      currentOrder.items.splice(existingItemIndex, 1);
    }

    // Recalculate total
    let total = 0;
    currentOrder.items.forEach((item) => {
      total += item.price * item.quantity;
    });
    currentOrder.total = total;

    loadCurrentOrder();
    saveData();
  }
}

function loadCurrentOrder() {
  const orderItemsContainer = document.getElementById("orderItems");
  orderItemsContainer.innerHTML = "";

  const currentOrder = state.orders[state.currentTable];

  currentOrder.items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "order-item";
    itemElement.innerHTML = `
            <span>${item.name} (${item.quantity})</span>
            <span>₹${item.price * item.quantity}</span>
        `;
    orderItemsContainer.appendChild(itemElement);
  });

  document.getElementById("orderTotal").textContent = currentOrder.total;
}

function confirmOrder() {
  // Just save the current state (items are already updated live)
  saveData();
  alert("Order updated successfully!");
}

// Billing View Functions
function initBillingView() {
  loadActiveBills();
}

function loadActiveBills() {
  const billsList = document.getElementById("billsList");
  billsList.innerHTML = "";

  let hasActiveBills = false;

  Object.keys(state.orders).forEach((tableNumber) => {
    const order = state.orders[tableNumber];
    if (order && order.items && order.items.length > 0) {
      hasActiveBills = true;
      const billElement = document.createElement("div");
      billElement.className = "bill-card";
      billElement.innerHTML = `
                <div class="bill-header">
                    <h3>🍽️ Table ${tableNumber}</h3>
                    <span>${new Date().toLocaleTimeString()}</span>
                </div>
                <div class="bill-items">
                    ${order.items
                      .map(
                        (item) => `
                        <div class="bill-item">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>₹${item.price * item.quantity}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <div class="bill-total">
                    💰 Total: ₹${order.total}
                </div>
                <button class="clear-bill" data-table="${tableNumber}">✅ Complete Order</button>
            `;

      billElement
        .querySelector(".clear-bill")
        .addEventListener("click", function () {
          clearBill(tableNumber);
        });

      billsList.appendChild(billElement);
    }
  });

  // Show empty state if no active bills
  if (!hasActiveBills) {
    billsList.innerHTML = `
            <div class="empty-bills">
                <div class="icon">🧾</div>
                <h3>No Active Bills</h3>
                <p>Create orders from tables to see active bills here</p>
            </div>
        `;
  }
}

function clearBill(tableNumber) {
  // Move order to bills history
  if (!state.bills[tableNumber]) {
    state.bills[tableNumber] = [];
  }

  state.bills[tableNumber].push({
    ...state.orders[tableNumber],
    date: new Date().toISOString(),
  });

  // Clear current order
  state.orders[tableNumber] = { items: [], total: 0 };

  saveData();
  loadActiveBills();

  // If we're viewing this table, update the view
  if (state.currentTable === tableNumber) {
    loadCurrentOrder();
    loadMenuItems();
  }
}

// Reports View Functions
function initReportsView() {
  loadDailyReports();

  // Handle date change
  document
    .getElementById("reportDate")
    ?.addEventListener("change", loadDailyReports);

  // Handle download button
  document
    .querySelector(".download-report")
    ?.addEventListener("click", downloadDailyReport);
}

function loadDailyReports() {
  const date = document.getElementById("reportDate").value;
  const allBillsList = document.getElementById("allBillsList");
  allBillsList.innerHTML = "";

  let totalSales = 0;
  let totalOrders = 0;

  // Filter bills by selected date
  Object.keys(state.bills).forEach((tableNumber) => {
    state.bills[tableNumber].forEach((bill) => {
      const billDate = new Date(bill.date).toISOString().split("T")[0];
      if (billDate === date) {
        const billElement = document.createElement("div");
        billElement.className = "bill-card";
        billElement.innerHTML = `
                    <div class="bill-header">
                        <h3>Table ${tableNumber}</h3>
                        <span>${new Date(bill.date).toLocaleTimeString()}</span>
                    </div>
                    <div class="bill-items">
                        ${bill.items
                          .map(
                            (item) => `
                            <div class="bill-item">
                                <span>${item.name} (${item.quantity})</span>
                                <span>₹${item.price * item.quantity}</span>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                    <div class="bill-total">
                        Total: ₹${bill.total}
                    </div>
                `;

        allBillsList.appendChild(billElement);
        totalSales += bill.total;
        totalOrders++;
      }
    });
  });

  document.getElementById("totalSales").textContent = totalSales;
  document.getElementById("totalOrders").textContent = totalOrders;
}

function downloadDailyReport() {
  const date = document.getElementById("reportDate").value;
  let reportContent = `Daily Report - ${date}\n\n`;

  let totalSales = 0;
  let totalOrders = 0;

  Object.keys(state.bills).forEach((tableNumber) => {
    state.bills[tableNumber].forEach((bill) => {
      const billDate = new Date(bill.date).toISOString().split("T")[0];
      if (billDate === date) {
        reportContent += `Table ${tableNumber} - ${new Date(
          bill.date
        ).toLocaleTimeString()}\n`;

        bill.items.forEach((item) => {
          reportContent += `${item.name} (${item.quantity}) - ₹${
            item.price * item.quantity
          }\n`;
        });

        reportContent += `Total: ₹${bill.total}\n\n`;
        totalSales += bill.total;
        totalOrders++;
      }
    });
  });

  reportContent += `\nTotal Sales: ₹${totalSales}\n`;
  reportContent += `Total Orders: ${totalOrders}\n`;

  // Create download link
  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `hotel_report_${date}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Settings View Functions
function initSettingsView() {
  // Set current language
  document.querySelectorAll(".language-btn").forEach((btn) => {
    if (btn.getAttribute("data-lang") === state.language) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".language-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      state.language = this.getAttribute("data-lang");
      saveData();
    });
  });

  // Load current menu items
  loadMenuItemsForSettings();

  // Handle add item button
  document
    .querySelector(".add-item")
    ?.addEventListener("click", addNewMenuItem);
}

function loadMenuItemsForSettings() {
  const menuItemsList = document.getElementById("menuItemsList");
  menuItemsList.innerHTML = "";

  Object.keys(menuData).forEach((category) => {
    menuData[category].forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "menu-item-row";
      itemElement.innerHTML = `
                <span>${item.name} - ₹${item.price}</span>
                <span class="delete-item" data-id="${item.id}">Delete</span>
            `;

      itemElement
        .querySelector(".delete-item")
        .addEventListener("click", function () {
          deleteMenuItem(item.id);
        });

      menuItemsList.appendChild(itemElement);
    });
  });
}

function addNewMenuItem() {
  const name = document.getElementById("itemName").value;
  const price = parseFloat(document.getElementById("itemPrice").value);
  const category = document.getElementById("itemCategory").value;

  if (name && price && category) {
    // Generate new ID
    let maxId = 0;
    Object.values(menuData).forEach((cat) => {
      cat.forEach((item) => {
        if (item.id > maxId) maxId = item.id;
      });
    });

    const newId = maxId + 1;

    // Add to menuData
    menuData[category].push({
      id: newId,
      name: name,
      price: price,
      image: "images/menu/default.jpg",
    });

    // Clear form
    document.getElementById("itemName").value = "";
    document.getElementById("itemPrice").value = "";

    // Reload menu items
    loadMenuItemsForSettings();
    saveData();
  }
}

function deleteMenuItem(itemId) {
  Object.keys(menuData).forEach((category) => {
    menuData[category] = menuData[category].filter(
      (item) => item.id !== itemId
    );
  });

  loadMenuItemsForSettings();
  saveData();
}
