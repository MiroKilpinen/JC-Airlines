<?php
$servername = "localhost";
$username = "root";
$password = "admin123";
$dbname = "jc-airlines";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$country = $_GET['country'];

$query = "SELECT DISTINCT Kaupunki FROM lennot WHERE Kohdemaa = ? ORDER BY Kaupunki";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $country);
$stmt->execute();
$result = $stmt->get_result();

$cities = [];
while ($row = $result->fetch_assoc()) {
    $cities[] = $row['Kaupunki'];
}

echo json_encode($cities);

$conn->close();
?>