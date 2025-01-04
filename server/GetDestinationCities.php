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

// Get the country from the GET request
$country = $_GET['country'];

// Query to fetch cities based on the selected country
$query = "SELECT DISTINCT Kaupunki FROM lennot WHERE Kohdemaa = ? ORDER BY Kaupunki";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $country);
$stmt->execute();
$result = $stmt->get_result();

$cities = [];
while ($row = $result->fetch_assoc()) {
    $cities[] = $row['Kaupunki'];
}

// Return the cities as a JSON response
echo json_encode($cities);

// Close the connection
$conn->close();
?>