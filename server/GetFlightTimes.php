<?php
$servername = "localhost";
$username = "root";
$password = "admin123";
$dbname = "jc-airlines";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$city = $_GET['city'];

$sql = "SELECT DISTINCT Aika FROM lennot WHERE Kaupunki = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $city);
$stmt->execute();
$result = $stmt->get_result();

$times = [];
while ($row = $result->fetch_assoc()) {
    $times[] = $row['Aika'];
}

echo json_encode($times);

$conn->close();
?>
