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

$sql = "SELECT DISTINCT Aika, Kone FROM lennot WHERE Kaupunki = ? ORDER BY Aika, Kone";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $city);
$stmt->execute();
$result = $stmt->get_result();

$timesWithPlanes = [];
while ($row = $result->fetch_assoc()) {
    $formattedString = $row['Aika'] . ", " . $row['Kone'];
    $timesWithPlanes[] = $formattedString;
}

echo json_encode($timesWithPlanes);

$conn->close();
?>
