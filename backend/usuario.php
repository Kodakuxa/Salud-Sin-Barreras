<?php
include 'conexion.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

if ($method !== 'PUT') {
    echo json_encode(["success" => false, "message" => "Metodo no permitido"]);
    $conn->close();
    exit();
}

if (!isset($data->id) || !isset($data->username) || !isset($data->email)) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    $conn->close();
    exit();
}

$userId = (int)$data->id;
$username = $conn->real_escape_string($data->username);
$email = $conn->real_escape_string($data->email);
$currentPassword = isset($data->currentPassword) ? $conn->real_escape_string($data->currentPassword) : '';
$newPassword = isset($data->newPassword) ? $conn->real_escape_string($data->newPassword) : '';

if ($userId <= 0) {
    echo json_encode(["success" => false, "message" => "ID de usuario invalido"]);
    $conn->close();
    exit();
}

$checkEmailSql = "SELECT id FROM users WHERE email = '$email' AND id != $userId LIMIT 1";
$checkEmailResult = $conn->query($checkEmailSql);
if ($checkEmailResult && $checkEmailResult->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Ese correo ya esta en uso"]);
    $conn->close();
    exit();
}

if ($newPassword !== '') {
    if ($currentPassword === '') {
        echo json_encode(["success" => false, "message" => "Debes escribir tu contrasena actual"]);
        $conn->close();
        exit();
    }

    $verifySql = "SELECT id FROM users WHERE id = $userId AND password = '" . md5($currentPassword) . "' LIMIT 1";
    $verifyResult = $conn->query($verifySql);
    if (!$verifyResult || $verifyResult->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "La contrasena actual no es correcta"]);
        $conn->close();
        exit();
    }

    $newHash = md5($newPassword);
    $updateSql = "UPDATE users SET username='$username', email='$email', password='$newHash' WHERE id=$userId";
} else {
    $updateSql = "UPDATE users SET username='$username', email='$email' WHERE id=$userId";
}

if ($conn->query($updateSql) === TRUE) {
    $fetchSql = "SELECT id, username, email, role FROM users WHERE id = $userId LIMIT 1";
    $fetchResult = $conn->query($fetchSql);
    $user = $fetchResult ? $fetchResult->fetch_assoc() : null;

    echo json_encode([
        "success" => true,
        "message" => "Perfil actualizado correctamente",
        "user" => $user
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar el perfil"]);
}

$conn->close();
?>