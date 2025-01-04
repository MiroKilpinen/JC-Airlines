<?php
// Database connection settings
$servername = "localhost";
$username = "root";
$password = "admin123";
$dbname = "jc-airlines";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the city parameter from the URL
$city = $_GET['city'];

// Query to get distinct flight times for the selected city
$sql = "SELECT DISTINCT Aika FROM lennot WHERE Kaupunki = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $city);
$stmt->execute();
$result = $stmt->get_result();

$times = [];

// Fetch the flight times and store them in an array
while ($row = $result->fetch_assoc()) {
    $times[] = $row['Aika'];
}

$conn->close();

// Return the result as JSON
echo json_encode($times);
?>
