<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "shipping_system";

// الاتصال بقاعدة البيانات
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("فشل الاتصال: " . $conn->connect_error);
}

// استقبال البيانات من الفورم
$receiver_name = $_POST['receiver_name'];
$province = $_POST['province'];
$address = $_POST['address'];
$receiver_phone = $_POST['receiver_phone'];
$shipment_price = $_POST['shipment_price'];
$sender_name = $_POST['sender_name'];
$sender_address = $_POST['sender_address'];
$sender_phone = $_POST['sender_phone'];

// إنشاء رقم أوردر تلقائي
$order_number = "ORD" . time();

// إدخال البيانات في الجدول
$sql = "INSERT INTO shipments (order_number, receiver_name, province, address, receiver_phone, shipment_price, sender_name, sender_address, sender_phone, status) 
        VALUES ('$order_number', '$receiver_name', '$province', '$address', '$receiver_phone', '$shipment_price', '$sender_name', '$sender_address', '$sender_phone', 'طلب شحن')";

if ($conn->query($sql) === TRUE) {
    echo "تمت إضافة الشحنة بنجاح ورقم الأوردر هو: " . $order_number;
} else {
    echo "خطأ: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
