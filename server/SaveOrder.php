<?php
$servername = "localhost";
$username = "root";
$password = "admin123";
$dbname = "jc-airlines";

header("Content-Type: application/json");

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

$data = json_decode(file_get_contents("php://input"), true);

$emailHash = password_hash($data['email'], PASSWORD_BCRYPT);

$timeAndPlaneParts = explode(",", $data['timeAndPlane']);
$time = trim($timeAndPlaneParts[0]);
$plane = trim($timeAndPlaneParts[1]);

$sql = "SELECT LentoID FROM lennot WHERE Kaupunki = ? AND Aika = ? AND Kone LIKE ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $data['city'], $time, $plane);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $lentoID = $row['LentoID'];
} else {
    echo json_encode(["success" => false, "error" => "LentoID ei löytynyt."]);
    exit;
}

$insertSQL = "INSERT INTO tilaus (LentoID, Pvm, LennonAjankohta, KohdeKaupunki, Lippujenmaara, Nimi, Osoite, Email, Puhelin) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$insertStmt = $conn->prepare($insertSQL);
$insertStmt->bind_param(
    "isssissss",
    $lentoID,
    $data['date'],
    $time,
    $data['city'],
    $data['tickets'],
    $data['name'],
    $data['address'],
    $emailHash,
    $data['phone']
);

if ($insertStmt->execute()) {
    $updateSQL = "UPDATE lennot SET VapaatPaikat = VapaatPaikat - ? WHERE LentoID = ?";
    $updateStmt = $conn->prepare($updateSQL);
    $updateStmt->bind_param("ii", $data['tickets'], $lentoID);

    if ($updateStmt->execute()) {
        echo json_encode(["success" => true, "message" => "Order saved and VapaatPaikat updated successfully"]);

        // Flight Infomation Email
        $to = $data['email'];
        $subject = "Lennon tiedot";
        $msg = "Hei " . $data['name'] . ",\nTeidän lennon tiedot:\nPäivämäärä: " . $data['date'] . "\nKohde: ". $data['city'] ."\nLippujen määrä: ". $data['tickets'] ."";
        // mail($to, $subject, $msg);
    } else {
        error_log("Error updating VapaatPaikat: " . $conn->error);
        echo json_encode(["success" => false, "error" => "Error updating VapaatPaikat: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Tilausta ei voitu tallentaa: " . $conn->error]);
}

$conn->close();
