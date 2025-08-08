let shipments = JSON.parse(localStorage.getItem('shipments')) || [];

function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user === "admin" && pass === "1234") {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
    renderTable();
  } else {
    alert("خطأ في تسجيل الدخول");
  }
}

function logout() {
  location.reload();
}

document.getElementById('shipping-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const shipment = {
    name: document.getElementById('customer-name').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    tracking: document.getElementById('tracking-number').value,
    company: document.getElementById('shipping-company').value,
    rep: document.getElementById('representative').value,
    phone: document.getElementById('phone').value,
    price: document.getElementById('price').value,
    status: document.getElementById('status').value,
    note: document.getElementById('note').value,
    date: new Date().toLocaleString()
  };
  shipments.push(shipment);
  localStorage.setItem('shipments', JSON.stringify(shipments));
  renderTable();
  this.reset();
});

function renderTable() {
  const tbody = document.querySelector('#shipment-table tbody');
  tbody.innerHTML = "";
  shipments.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.name}</td>
      <td>${s.address}</td>
      <td>${s.city}</td>
      <td>${s.tracking}</td>
      <td>${s.company}</td>
      <td>${s.rep}</td>
      <td>${s.phone}</td>
      <td>${s.price}</td>
      <td>
        <select onchange="updateStatus(${i}, this.value)">
          <option ${s.status==="قيد الشحن"?"selected":""}>قيد الشحن</option>
          <option ${s.status==="استلم"?"selected":""}>استلم</option>
          <option ${s.status==="تم الإلغاء"?"selected":""}>تم الإلغاء</option>
          <option ${s.status==="قيد الإرجاع"?"selected":""}>قيد الإرجاع</option>
          <option ${s.status==="تم الإرجاع"?"selected":""}>تم الإرجاع</option>
        </select>
      </td>
      <td><input value="${s.note}" onchange="updateNote(${i}, this.value)"></td>
      <td>${s.date}</td>
      <td><button onclick="editShipment(${i})">تعديل</button></td>
      <td><button onclick="printBill(${i})">طباعة</button></td>
      <td><button onclick="deleteShipment(${i})">حذف</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function updateStatus(index, val) {
  shipments[index].status = val;
  localStorage.setItem('shipments', JSON.stringify(shipments));
}

function updateNote(index, val) {
  shipments[index].note = val;
  localStorage.setItem('shipments', JSON.stringify(shipments));
}

function deleteShipment(index) {
  if (confirm("حذف الشحنة؟")) {
    shipments.splice(index, 1);
    localStorage.setItem('shipments', JSON.stringify(shipments));
    renderTable();
  }
}

function printBill(index) {
  const s = shipments[index];
  const w = window.open('', '', 'width=800,height=600');
  w.document.write(`
    <html dir="rtl">
    <head>
      <title>بوليصة شحن</title>
      <style>
        body { font-family: Arial; }
        .logo { height: 80px; }
        h1 { text-align:center; }
        table { width:100%; border-collapse: collapse; }
        td, th { border: 1px solid #000; padding: 8px; }
      </style>
    </head>
    <body>
      <h1>تربو جروب اكسبريس</h1>
      <img src="logo.png" class="logo">
      <table>
        <tr><th>اسم العميل</th><td>${s.name}</td></tr>
        <tr><th>العنوان</th><td>${s.address}</td></tr>
        <tr><th>المدينة</th><td>${s.city}</td></tr>
        <tr><th>رقم التتبع</th><td>${s.tracking}</td></tr>
        <tr><th>شركة الشحن</th><td>${s.company}</td></tr>
        <tr><th>المندوب</th><td>${s.rep}</td></tr>
        <tr><th>رقم العميل</th><td>${s.phone}</td></tr>
        <tr><th>سعر الشحنة</th><td>${s.price}</td></tr>
        <tr><th>الحالة</th><td>${s.status}</td></tr>
        <tr><th>ملاحظات</th><td>${s.note}</td></tr>
        <tr><th>التاريخ</th><td>${s.date}</td></tr>
      </table>
      <script>window.print();</script>
    </body>
    </html>
  `);
  w.document.close();
}
