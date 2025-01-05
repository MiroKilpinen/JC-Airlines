<?php
$servername = "localhost";
$username = "root";
$password = "admin123";
$dbname = "jc-airlines";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$query = "SELECT DISTINCT Kohdemaa FROM lennot ORDER BY Kohdemaa";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

$countries = [];
while ($row = $result->fetch_assoc()) {
    $countries[] = $row['Kohdemaa'];
}

echo json_encode($countries);

$conn->close();
?>