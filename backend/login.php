<?php
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    $email = $conn->real_escape_string($data->email);
    // In production, use password_verify with hashed passwords. Using MD5 for simplicity as per SQL input
    $password = md5($conn->real_escape_string($data->password)); 

    $sql = "SELECT id, username, email, role FROM users WHERE email = '$email' AND password = '$password'";
    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Si es paciente, obtener su patient_id para pasarlo al frontend
        if ($user['role'] === 'paciente') {
            $patient_sql = "SELECT id FROM patients WHERE full_name = '".$user['username']."' LIMIT 1";
            $patient_result = $conn->query($patient_sql);
            if ($patient_result && $patient_result->num_rows > 0) {
                $user['patient_id'] = $patient_result->fetch_assoc()['id'];
            } else {
                $user['patient_id'] = 0;
            }
        }
        
        // Generate a simple token (In production, use JWT)
        $token = base64_encode(random_bytes(32)); 
        echo json_encode([
            "success" => true,
            "message" => "Login exitoso",
            "user" => $user,
            "token" => $token
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Credenciales incorrectas"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
$conn->close();
?>