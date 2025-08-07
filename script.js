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
          <button onclick="printWaybill(${index})">بوليصة</button>
          <button onclick="deleteShipment(${index})">حذف</button>
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
    const shipment = {
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
    shipments.push(shipment);
    localStorage.setItem("shipments", JSON.stringify(shipments));
    form.reset();
    loadShipments();
  });

  window.editShipment = function (index) {
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    const shipment = shipments[index];
    document.getElementById("customer-name").value = shipment.name;
    document.getElementById("address").value = shipment.address;
    document.getElementById("city").value = shipment.city;
    document.getElementById("tracking-number").value = shipment.tracking;
    document.getElementById("shipping-company").value = shipment.company;
    document.getElementById("representative").value = shipment.representative;
    document.getElementById("phone").value = shipment.phone;
    document.getElementById("price").value = shipment.price;
    document.getElementById("status").value = shipment.status;
    document.getElementById("note").value = shipment.note;

    shipments.splice(index, 1);
    localStorage.setItem("shipments", JSON.stringify(shipments));
    loadShipments();
  };

  window.deleteShipment = function(index) {
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    if (confirm("هل أنت متأكد من حذف الشحنة؟")) {
      shipments.splice(index, 1);
      localStorage.setItem("shipments", JSON.stringify(shipments));
      loadShipments();
    }
  };

  window.printWaybill = function(index) {
    const shipments = JSON.parse(localStorage.getItem("shipments") || "[]");
    const s = shipments[index];
    const waybillContent = `
      <h2>بوليصة شحنة</h2>
      <p><strong>الاسم:</strong> ${s.name}</p>
      <p><strong>العنوان:</strong> ${s.address}</p>
      <p><strong>المدينة:</strong> ${s.city}</p>
      <p><strong>رقم التتبع:</strong> ${s.tracking}</p>
      <p><strong>شركة الشحن:</strong> ${s.company}</p>
      <p><strong>المندوب:</strong> ${s.representative}</p>
      <p><strong>رقم العميل:</strong> ${s.phone}</p>
      <p><strong>السعر:</strong> ${s.price} جنيه</p>
      <p><strong>الحالة:</strong> ${s.status}</p>
      <p><strong>الملحوظة:</strong> ${s.note}</p>
      <p><strong>تاريخ:</strong> ${s.date}</p>
    `;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`<html><body>${waybillContent}</body></html>`);
    newWindow.document.close();
    newWindow.print();
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
    const rows = [["الاسم", "العنوان", "المدينة", "رقم التتبع", "الشركة", "المندوب", "رقم العميل", "السعر", "الحالة", "الملحوظة", "التاريخ"]];
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
      alert("بيانات تسجيل الدخول غير صحيحة");
    }
  };

  window.logout = function () {
    loginContainer.style.display = "block";
    mainContainer.style.display = "none";
  };
});
