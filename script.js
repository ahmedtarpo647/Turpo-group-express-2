document.addEventListener("DOMContentLoaded", function () {
  const loginContainer = document.getElementById("login-container");
  const mainContainer = document.getElementById("main-container");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const form = document.getElementById("shipping-form");
  const tableBody = document.querySelector("#shipment-table tbody");
  const searchBox = document.getElementById("search-box");
  const filterCompany = document.getElementById("filter-company");

  const exportBtn = document.getElementById("export-btn");
  const printBtn = document.getElementById("print-btn");

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
        <td>${shipment.status}</td>
        <td>${shipment.note}</td>
        <td>${shipment.date}</td>
        <td>
          <button onclick="editShipment(${index})">تعديل</button>
          <button onclick="deleteShipment(${index})">حذف</button>
          <button onclick="printInvoice(${index})">بوليصة</button>
        </td>
      `;
      tableBody.appendChild(tr);
      companies.add(shipment.company);
    });

    filterCompany.innerHTML = '<option value="">كل الشركات</option>';
    companies.forEach(company => {
      filterCompany.innerHTML += `<option value="${company}">${company}</option>`;
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    const newShipment = {
      name: document.getElementById("customer-name").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      tracking: document.getElementById("tracking-number").value,
      company: document.getElementById("shipping-company").value,
      representative: document.getElementById("representative").value,
      phone: document.getElementById("phone").value,
      price: document.getElementById("price").value,
      status: document.getElementById("status").value,
      note: document.getElementById("note").value,
      date: new Date().toLocaleDateString()
    };
    shipments.push(newShipment);
    localStorage.setItem("shipments", JSON.stringify(shipments));
    form.reset();
    loadShipments();
  });

  window.deleteShipment = function(index) {
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    if (confirm("هل أنت متأكد من حذف هذه الشحنة؟")) {
      shipments.splice(index, 1);
      localStorage.setItem("shipments", JSON.stringify(shipments));
      loadShipments();
    }
  };

  window.editShipment = function(index) {
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    const s = shipments[index];
    document.getElementById("customer-name").value = s.name;
    document.getElementById("address").value = s.address;
    document.getElementById("city").value = s.city;
    document.getElementById("tracking-number").value = s.tracking;
    document.getElementById("shipping-company").value = s.company;
    document.getElementById("representative").value = s.representative;
    document.getElementById("phone").value = s.phone;
    document.getElementById("price").value = s.price;
    document.getElementById("status").value = s.status;
    document.getElementById("note").value = s.note;

    shipments.splice(index, 1);
    localStorage.setItem("shipments", JSON.stringify(shipments));
    loadShipments();
  };

  window.printInvoice = function(index) {
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    const s = shipments[index];
    const invoice = `
      <html>
      <head>
        <title>بوليصة الشحن</title>
        <style>
          body { font-family: Arial; direction: rtl; padding: 20px; }
          h2 { text-align: center; }
          table { width: 100%; margin-top: 20px; border-collapse: collapse; }
          td, th { padding: 10px; border: 1px solid #000; }
        </style>
      </head>
      <body>
        <h2>بوليصة الشحن</h2>
        <table>
          <tr><th>العميل</th><td>${s.name}</td></tr>
          <tr><th>العنوان</th><td>${s.address}</td></tr>
          <tr><th>المدينة</th><td>${s.city}</td></tr>
          <tr><th>رقم التتبع</th><td>${s.tracking}</td></tr>
          <tr><th>الشركة</th><td>${s.company}</td></tr>
          <tr><th>المندوب</th><td>${s.representative}</td></tr>
          <tr><th>رقم العميل</th><td>${s.phone}</td></tr>
          <tr><th>السعر</th><td>${s.price}</td></tr>
          <tr><th>الحالة</th><td>${s.status}</td></tr>
          <tr><th>الملحوظة</th><td>${s.note}</td></tr>
          <tr><th>التاريخ</th><td>${s.date}</td></tr>
        </table>
      </body>
      </html>
    `;
    const w = window.open();
    w.document.write(invoice);
    w.print();
    w.close();
  };

  searchBox.addEventListener("input", function () {
    const term = searchBox.value.toLowerCase();
    Array.from(tableBody.children).forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(term) ? "" : "none";
    });
  });

  filterCompany.addEventListener("change", function () {
    const value = filterCompany.value;
    Array.from(tableBody.children).forEach(row => {
      row.style.display = value === "" || row.children[4].innerText === value ? "" : "none";
    });
  });

  exportBtn.addEventListener("click", function () {
    const rows = [["Name", "Address", "City", "Tracking", "Company", "Rep", "Phone", "Price", "Status", "Note", "Date"]];
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    shipments.forEach(s => {
      rows.push([s.name, s.address, s.city, s.tracking, s.company, s.representative, s.phone, s.price, s.status, s.note, s.date]);
    });
    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shipments.csv";
    a.click();
    URL.revokeObjectURL(url);
  });

  printBtn.addEventListener("click", function () {
    const original = document.body.innerHTML;
    const content = document.querySelector("#main-container").innerHTML;
    document.body.innerHTML = content;
    window.print();
    document.body.innerHTML = original;
    location.reload();
  });

  window.login = function () {
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (username === "admin" && password === "1234") {
      loginContainer.style.display = "none";
      mainContainer.style.display = "block";
      loadShipments();
    } else {
      alert("بيانات الدخول غير صحيحة.");
    }
  };

  window.logout = function () {
    loginContainer.style.display = "block";
    mainContainer.style.display = "none";
  };
});
