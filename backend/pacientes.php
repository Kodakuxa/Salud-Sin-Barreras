<?php
include 'conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get all patients or search
        $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';

        $countResult = $conn->query("SELECT COUNT(*) AS total FROM patients");
        $totalPatients = $countResult ? (int)$countResult->fetch_assoc()['total'] : 0;

        if ($totalPatients < 20) {
            $seedPatients = [
                ["full_name" => "Fabiola", "age" => 25, "phone" => "+52 667 455 345", "address" => "Villa Bonita"],
                ["full_name" => "Katarina", "age" => 43, "phone" => "8473", "address" => "Alemania"],
                ["full_name" => "Karla Gomez", "age" => 29, "phone" => "55-555-55-55", "address" => "Mexico"],
                ["full_name" => "Lucia Ramos", "age" => 31, "phone" => "6671011101", "address" => "Culiacan"],
                ["full_name" => "Martin Perez", "age" => 52, "phone" => "6672022202", "address" => "Mazatlan"],
                ["full_name" => "Ana Solis", "age" => 19, "phone" => "6673033303", "address" => "Guasave"],
                ["full_name" => "Jorge Medina", "age" => 47, "phone" => "6674044404", "address" => "Los Mochis"],
                ["full_name" => "Paola Reyes", "age" => 36, "phone" => "6675055505", "address" => "Hermosillo"],
                ["full_name" => "Diego Roman", "age" => 28, "phone" => "6676066606", "address" => "Tijuana"],
                ["full_name" => "Sofia Acosta", "age" => 40, "phone" => "6677077707", "address" => "Monterrey"],
                ["full_name" => "Raul Mendez", "age" => 58, "phone" => "6678088808", "address" => "Guadalajara"],
                ["full_name" => "Valeria Cruz", "age" => 33, "phone" => "6679099909", "address" => "CDMX"],
                ["full_name" => "Eduardo Luna", "age" => 44, "phone" => "6671111222", "address" => "Puebla"],
                ["full_name" => "Fernanda Ibarra", "age" => 27, "phone" => "6672222333", "address" => "Merida"],
                ["full_name" => "Carlos Nuno", "age" => 61, "phone" => "6673333444", "address" => "Toluca"],
                ["full_name" => "Mariana Leon", "age" => 22, "phone" => "6674444555", "address" => "Queretaro"],
                ["full_name" => "Tomas Salazar", "age" => 49, "phone" => "6675555666", "address" => "Chihuahua"],
                ["full_name" => "Daniela Campos", "age" => 34, "phone" => "6676666777", "address" => "Aguascalientes"],
                ["full_name" => "Ruben Ortega", "age" => 55, "phone" => "6677777888", "address" => "Zacatecas"],
                ["full_name" => "Natalia Fuentes", "age" => 30, "phone" => "6678888999", "address" => "Saltillo"],
                ["full_name" => "Oscar Vidal", "age" => 46, "phone" => "6679999000", "address" => "Cancun"],
                ["full_name" => "Gabriela Moya", "age" => 38, "phone" => "6671122334", "address" => "Leon"],
                ["full_name" => "Hector Rios", "age" => 63, "phone" => "6672233445", "address" => "Tepic"],
                ["full_name" => "Adriana Parra", "age" => 26, "phone" => "6673344556", "address" => "Durango"],
                ["full_name" => "Emilio Cota", "age" => 42, "phone" => "6674455667", "address" => "La Paz"],
                ["full_name" => "Patricia Vega", "age" => 53, "phone" => "6675566778", "address" => "Veracruz"],
                ["full_name" => "Leonardo Arroyo", "age" => 37, "phone" => "6676677889", "address" => "Morelia"]
            ];

            foreach ($seedPatients as $patient) {
                $full_name = $conn->real_escape_string($patient['full_name']);
                $age = (int)$patient['age'];
                $phone = $conn->real_escape_string($patient['phone']);
                $address = $conn->real_escape_string($patient['address']);
                $existsResult = $conn->query("SELECT id FROM patients WHERE full_name = '$full_name' LIMIT 1");
                if (!$existsResult || $existsResult->num_rows === 0) {
                    $conn->query("INSERT INTO patients (full_name, age, phone, address) VALUES ('$full_name', $age, '$phone', '$address')");
                }
            }
        }

        if($search != '') {
            $sql = "SELECT * FROM patients WHERE full_name LIKE '%$search%'";
        } else {
            $sql = "SELECT * FROM patients";
        }
        $result = $conn->query($sql);
        $patients = [];
        if ($result) {
           while($row = $result->fetch_assoc()) {
                $patients[] = $row;
           }
        }
        echo json_encode(["success" => true, "data" => $patients]);
        break;
        
    case 'POST':
        // Insert new patient
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->full_name) && isset($data->age)) {
            $full_name = $conn->real_escape_string($data->full_name);
            $age = (int)$data->age;
            $phone = isset($data->phone) ? $conn->real_escape_string($data->phone) : '';
            $address = isset($data->address) ? $conn->real_escape_string($data->address) : '';

            $sql = "INSERT INTO patients (full_name, age, phone, address) VALUES ('$full_name', $age, '$phone', '$address')";
            if($conn->query($sql) === TRUE) {
                echo json_encode(["success" => true, "message" => "Paciente registrado"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al registrar: " . $conn->error]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Faltan datos requeridos"]);
        }
        break;

    case 'PUT':
        // Update patient
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->id) && isset($data->full_name) && isset($data->age)) {
            $id = (int)$data->id;
            $full_name = $conn->real_escape_string($data->full_name);
            $age = (int)$data->age;
            $phone = isset($data->phone) ? $conn->real_escape_string($data->phone) : '';
            $address = isset($data->address) ? $conn->real_escape_string($data->address) : '';

            $sql = "UPDATE patients SET full_name='$full_name', age=$age, phone='$phone', address='$address' WHERE id=$id";
            if($conn->query($sql) === TRUE) {
                echo json_encode(["success" => true, "message" => "Paciente actualizado"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al actualizar: " . $conn->error]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Faltan datos"]);
        }
        break;

    case 'DELETE':
        // Delete patient
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        if($id > 0) {
            $sql = "DELETE FROM patients WHERE id=$id";
            if($conn->query($sql) === TRUE) {
                echo json_encode(["success" => true, "message" => "Paciente eliminado"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error al eliminar"]);
            }
        }
        break;
}

$conn->close();
?>