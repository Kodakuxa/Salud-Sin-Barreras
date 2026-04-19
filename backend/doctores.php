<?php
include 'conexion.php';

$seedDoctors = [
    ["username" => "Dra. Elena Torres", "email" => "elena.torres@saludsinbarreras.com"],
    ["username" => "Dr. Javier Morales", "email" => "javier.morales@saludsinbarreras.com"],
    ["username" => "Dra. Camila Rojas", "email" => "camila.rojas@saludsinbarreras.com"],
    ["username" => "Dr. Andres Pineda", "email" => "andres.pineda@saludsinbarreras.com"],
    ["username" => "Dra. Sofia Herrera", "email" => "sofia.herrera@saludsinbarreras.com"]
];

$result = $conn->query("SELECT COUNT(*) AS total FROM users WHERE role = 'doctor'");
$totalDoctors = $result ? (int)$result->fetch_assoc()['total'] : 0;

    if ($totalDoctors < 8) {
    foreach ($seedDoctors as $doctor) {
        $username = $conn->real_escape_string($doctor['username']);
        $email = $conn->real_escape_string($doctor['email']);
        $conn->query("INSERT IGNORE INTO users (username, email, password, role) VALUES ('$username', '$email', MD5('12345'), 'doctor')");
    }
}

$sql = "SELECT id, username, email, role FROM users WHERE role = 'doctor' ORDER BY username ASC";
$result = $conn->query($sql);

$doctors = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $doctors[] = $row;
    }
}

echo json_encode(["success" => true, "data" => $doctors]);

$conn->close();
?>