let shipments = JSON.parse(localStorage.getItem("shipments")) || [];

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "admin" && password === "1234") {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("main-container").style.display = "block";
        renderShipments();
    } else {
        alert("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
}

function logout() {
    document.getElementById("login-container").style.display = "block";
    document.getElementById("main-container").style.display = "none";
}

document.getElementById("shipping-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const shipment = {
        id: Date.now(),
        customerName: document.getElementById("customer-name").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        trackingNumber: document.getElementById("tracking-number").value,
        company: document.getElementById("shipping-company").value,
        representative: document.getElementById("representative").value,
        phone: document.getElementById("phone").value,
        price: document.getElementById("price").value,
        status: "قيد الشحن",
        note: "",
        date: new Date().toLocaleString()
    };

    shipments.push(shipment);
    localStorage.setItem("shipments", JSON.stringify(shipments));
    this.reset();
    renderShipments();
});

function renderShipments() {
    const tbody = document.querySelector("#shipment-table tbody");
    tbody.innerHTML = "";

    shipments.forEach(shipment => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${shipment.customerName}</td>
            <td>${shipment.address}</td>
            <td>${shipment.city}</td>
            <td>${shipment.trackingNumber}</td>
            <td>${shipment.company}</td>
            <td>${shipment.representative}</td>
            <td>${shipment.phone}</td>
            <td>${shipment.price}</td>
            <td>${shipment.date}</td>
            <td>
                <select onchange="updateStatus(${shipment.id}, this.value)">
                    <option ${shipment.status === "قيد الشحن" ? "selected" : ""}>قيد الشحن</option>
                    <option ${shipment.status === "استلم" ? "selected" : ""}>استلم</option>
                    <option ${shipment.status === "تم الإلغاء" ? "selected" : ""}>تم الإلغاء</option>
                    <option ${shipment.status === "قيد الإرجاع" ? "selected" : ""}>قيد الإرجاع</option>
                    <option ${shipment.status === "تم الإرجاع" ? "selected" : ""}>تم الإرجاع</option>
                </select>
                <input type="text" placeholder="ملحوظة" value="${shipment.note}" onchange="updateNote(${shipment.id}, this.value)">
                <button onclick="printBill(${shipment.id})">🖨 بوليصة</button>
                <button onclick="deleteShipment(${shipment.id})">🗑 حذف</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function updateStatus(id, newStatus) {
    shipments = shipments.map(s => s.id === id ? { ...s, status: newStatus } : s);
    localStorage.setItem("shipments", JSON.stringify(shipments));
}

function updateNote(id, newNote) {
    shipments = shipments.map(s => s.id === id ? { ...s, note: newNote } : s);
    localStorage.setItem("shipments", JSON.stringify(shipments));
}

function deleteShipment(id) {
    if (confirm("هل أنت متأكد من الحذف؟")) {
        shipments = shipments.filter(s => s.id !== id);
        localStorage.setItem("shipments", JSON.stringify(shipments));
        renderShipments();
    }
}

function printBill(id) {
    const s = shipments.find(sh => sh.id === id);
    const win = window.open("", "_blank");
    win.document.write(`
        <html dir="rtl">
        <head>
            <title>بوليصة الشحنة</title>
            <style>
                body { font-family: Arial; text-align: center; }
                h2 { margin-bottom: 10px; }
                img { max-width: 150px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                td { border: 1px solid #000; padding: 8px; }
            </style>
        </head>
        <body>
            <img src="https://i.ibb.co/ymKWj4yG/logo.png" alt="Turbo Group Express">
            <h2>بوليصة شحن</h2>
            <table>
                <tr><td>اسم العميل</td><td>${s.customerName}</td></tr>
                <tr><td>العنوان</td><td>${s.address}</td></tr>
                <tr><td>المدينة</td><td>${s.city}</td></tr>
                <tr><td>رقم التتبع</td><td>${s.trackingNumber}</td></tr>
                <tr><td>شركة الشحن</td><td>${s.company}</td></tr>
                <tr><td>المندوب</td><td>${s.representative}</td></tr>
                <tr><td>رقم العميل</td><td>${s.phone}</td></tr>
                <tr><td>سعر الشحنة</td><td>${s.price}</td></tr>
                <tr><td>الحالة</td><td>${s.status}</td></tr>
                <tr><td>الملحوظة</td><td>${s.note}</td></tr>
                <tr><td>التاريخ</td><td>${s.date}</td></tr>
            </table>
            <script>window.print();</script>
        </body>
        </html>
    `);
    win.document.close();
}
