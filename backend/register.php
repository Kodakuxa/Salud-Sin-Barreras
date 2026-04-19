<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'conexion.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') {
    die();
}

$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password) && isset($data->full_name) && isset($data->role)) {
    $email = $conn->real_escape_string($data->email);
    $password = md5($conn->real_escape_string($data->password)); 
    $full_name = $conn->real_escape_string($data->full_name);
    $role = $conn->real_escape_string($data->role);

    // Verificar si el email ya existe
    $check_sql = "SELECT id FROM users WHERE email = '$email'";
    $check_result = $conn->query($check_sql);
    
    if($check_result && $check_result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "El correo ya está registrado"]);
        exit;
    }

    $conn->begin_transaction();

    try {
        // Insertar en la tabla users
        $sql = "INSERT INTO users (username, email, password, role) VALUES ('$full_name', '$email', '$password', '$role')";
        
        if($conn->query($sql) === TRUE) {
            $user_id = $conn->insert_id;

            // Si es paciente, también lo agregamos a la tabla patients
            if ($role === 'paciente') {
                $sql_paciente = "INSERT INTO patients (full_name, age, phone, address) VALUES ('$full_name', 0, '', '')";
                if(!$conn->query($sql_paciente)) {
                    throw new Exception("Error al crear el perfil de paciente: " . $conn->error);
                }
            }

            $conn->commit();
            echo json_encode(["success" => true, "message" => "Cuenta creada exitosamente"]);
        } else {
            throw new Exception("Error al registrar el usuario: " . $conn->error);
        }
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
?>