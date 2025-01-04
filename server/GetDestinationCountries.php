<?php
error_reporting(E_ALL);  // Show all errors
ini_set('display_errors', 1);  // Display errors on the page

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

$query = "SELECT DISTINCT Kohdemaa FROM flights ORDER BY Kohdemaa";
$result = $conn->query($query);

$countries = [];
while ($row = $result->fetch_assoc()) {
    $countries[] = $row['Kohdemaa'];
}

// Return the result as JSON
echo json_encode($countries);

$conn->close();
?>