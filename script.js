const loginContainer = document.getElementById("login-container");
const mainContainer = document.getElementById("main-container");
const shippingForm = document.getElementById("shipping-form");
const tableBody = document.querySelector("#shipment-table tbody");
const searchBox = document.getElementById("search-box");
const filterCompany = document.getElementById("filter-company");

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (username === "admin" && password === "1234") {
    loginContainer.style.display = "none";
    mainContainer.style.display = "block";
    loadShipments();
  } else {
    alert("بيانات الدخول غير صحيحة");
  }
}

function logout() {
  mainContainer.style.display = "none";
  loginContainer.style.display = "block";
}

shippingForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const shipment = {
    name: document.getElementById("customer-name").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    tracking: document.getElementById("tracking-number").value,
    company: document.getElementById("shipping-company").value,
    representative: document.getElementById("representative").value,
    phone: document.getElementById("phone").value,
    price: document.getElementById("price").value,
    status: "قيد الشحن",
    payment: "لم يدفع",
    date: new Date().toLocaleString()
  };

  const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
  shipments.push(shipment);
  localStorage.setItem("shipments", JSON.stringify(shipments));

  shippingForm.reset();
  loadShipments();
});

function loadShipments() {
  const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
  tableBody.innerHTML = "";
  const companies = new Set();

  shipments.forEach((shipment, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${shipment.name}</td>
      <td>${shipment.address}</td>
      <td>${shipment.city}</td>
      <td>${shipment.tracking}</td>
      <td>${shipment.company}</td>
      <td>${shipment.representative}</td>
      <td>${shipment.phone}</td>
      <td>${shipment.price}</td>
      <td>
        <select class="status-select" data-index="${index}">
          <option value="قيد الشحن" ${shipment.status === "قيد الشحن" ? "selected" : ""}>قيد الشحن</option>
          <option value="قيد الإرجاع" ${shipment.status === "قيد الإرجاع" ? "selected" : ""}>قيد الإرجاع</option>
          <option value="تم الإرجاع" ${shipment.status === "تم الإرجاع" ? "selected" : ""}>تم الإرجاع</option>
          <option value="استلمت" ${shipment.status === "استلمت" ? "selected" : ""}>استلمت</option>
          <option value="اتأجلت" ${shipment.status === "اتأجلت" ? "selected" : ""}>اتأجلت</option>
          <option value="اتلغت" ${shipment.status === "اتلغت" ? "selected" : ""}>اتلغت</option>
        </select>
      </td>
      <td>
        <select class="payment-select" data-index="${index}">
          <option value="لم يدفع" ${shipment.payment === "لم يدفع" ? "selected" : ""}>لم يدفع</option>
          <option value="دفع" ${shipment.payment === "دفع" ? "selected" : ""}>دفع</option>
        </select>
      </td>
      <td>${shipment.date}</td>
      <td><button onclick="deleteShipment(${index})">حذف</button></td>
    `;
    tableBody.appendChild(tr);
    companies.add(shipment.company);
  });

  document.querySelectorAll(".status-select").forEach(select => {
    select.addEventListener("change", function() {
      const index = this.getAttribute("data-index");
      shipments[index].status = this.value;
      localStorage.setItem("shipments", JSON.stringify(shipments));
    });
  });

  document.querySelectorAll(".payment-select").forEach(select => {
    select.addEventListener("change", function() {
      const index = this.getAttribute("data-index");
      shipments[index].payment = this.value;
      localStorage.setItem("shipments", JSON.stringify(shipments));
    });
  });

  filterCompany.innerHTML = '<option value="">كل الشركات</option>';
  companies.forEach(company => {
    filterCompany.innerHTML += `<option value="${company}">${company}</option>`;
  });
}

function deleteShipment(index) {
  const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
  shipments.splice(index, 1);
  localStorage.setItem("shipments", JSON.stringify(shipments));
  loadShipments();
}

searchBox.addEventListener("input", function() {
  const term = this.value.toLowerCase();
  document.querySelectorAll("#shipment-table tbody tr").forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(term) ? "" : "none";
  });
});

filterCompany.addEventListener("change", function() {
  const company = this.value;
  document.querySelectorAll("#shipment-table tbody tr").forEach(row => {
    row.style.display = company === "" || row.cells[4].innerText === company ? "" : "none";
  });
});
