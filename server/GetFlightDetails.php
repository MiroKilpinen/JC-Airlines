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
$timeAndPlane = $_GET['time'];

$parts = explode(",", $timeAndPlane);
$time = trim($parts[0]);
$plane = trim($parts[1]);

$query = "SELECT VapaatPaikat, LipunHinta FROM lennot WHERE Kaupunki = ? AND Aika = ? AND Kone LIKE ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("sss", $city, $time, $plane);
$stmt->execute();
$result = $stmt->get_result();

$response = [
    'availableSeats' => 0,
    'ticketCost' => 0
];

if ($row = $result->fetch_assoc()) {
    $response['availableSeats'] = $row['VapaatPaikat'];
    $response['ticketCost'] = $row['LipunHinta'];
}

echo json_encode($response);

$conn->close();
?>
