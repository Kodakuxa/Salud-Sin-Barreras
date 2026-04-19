<?php
include 'conexion.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

switch($method) {
    case 'GET':
        $recordsCountResult = $conn->query("SELECT COUNT(*) AS total FROM medical_records");
        $recordsTotal = $recordsCountResult ? (int)$recordsCountResult->fetch_assoc()['total'] : 0;

        if ($recordsTotal < 20) {
            $doctorsResult = $conn->query("SELECT id FROM users WHERE role = 'doctor' ORDER BY id ASC");
            $doctorIds = [];
            if ($doctorsResult) {
                while ($doctorRow = $doctorsResult->fetch_assoc()) {
                    $doctorIds[] = (int)$doctorRow['id'];
                }
            }

            $patientsResult = $conn->query("SELECT id FROM patients ORDER BY id ASC");
            $patientIds = [];
            if ($patientsResult) {
                while ($patientRow = $patientsResult->fetch_assoc()) {
                    $patientIds[] = (int)$patientRow['id'];
                }
            }

            if (count($doctorIds) > 0 && count($patientIds) > 0) {
                foreach ($patientIds as $index => $pid) {
                    $existsRecord = $conn->query("SELECT id FROM medical_records WHERE patient_id = $pid LIMIT 1");
                    if ($existsRecord && $existsRecord->num_rows > 0) {
                        continue;
                    }

                    $doctorId = $doctorIds[$index % count($doctorIds)];
                    $weight = 55 + ($index % 35);
                    $height = 150 + ($index % 30);
                    $heartRate = 65 + ($index % 25);
                    $temperature = 36 + (($index % 8) * 0.1);
                    $appointmentDate = date('Y-m-d', strtotime('-' . ($index % 20) . ' days'));
                    $prescription = $conn->real_escape_string("Seguimiento clinico\nHidratacion adecuada\nControl en 7 dias");

                    $conn->query("INSERT INTO medical_records (patient_id, doctor_id, weight, height, heart_rate, temperature, prescription, appointment_date) VALUES ($pid, $doctorId, $weight, $height, '$heartRate lpm', '$temperature °C', '$prescription', '$appointmentDate')");
                }
            }
        }

        // Retrieve records either by patient_id or all
        $patient_id = isset($_GET['patient_id']) ? (int)$_GET['patient_id'] : 0;
        if($patient_id > 0) {
            $sql = "SELECT mr.*, p.full_name as patient_name, u.username as doctor_name 
                    FROM medical_records mr 
                    JOIN patients p ON mr.patient_id = p.id 
                    JOIN users u ON mr.doctor_id = u.id 
                    WHERE mr.patient_id = $patient_id
                    ORDER BY mr.appointment_date DESC";
        } else {
            $sql = "SELECT mr.*, p.full_name as patient_name, u.username as doctor_name 
                    FROM medical_records mr 
                    JOIN patients p ON mr.patient_id = p.id 
                    JOIN users u ON mr.doctor_id = u.id
                    ORDER BY mr.appointment_date DESC";
        }
        
        $result = $conn->query($sql);
        $records = [];
        if ($result && $result->num_rows > 0) {
           while($row = $result->fetch_assoc()) {
                $records[] = $row;
           }
        }
        echo json_encode(["success" => true, "data" => $records]);
        break;

    case 'POST':
        // Create new medical record
        if(isset($data->patient_id) && isset($data->doctor_id)) {
            $patient_id = (int)$data->patient_id;
            $doctor_id = (int)$data->doctor_id;
            $weight = isset($data->weight) ? (float)$data->weight : 0;
            $height = isset($data->height) ? (float)$data->height : 0;
            $heart_rate = isset($data->heart_rate) ? $conn->real_escape_string($data->heart_rate) : '';
            $temperature = isset($data->temperature) ? $conn->real_escape_string($data->temperature) : '';
            $prescription = isset($data->prescription) ? $conn->real_escape_string($data->prescription) : '';
            $appointment_date = isset($data->appointment_date) ? $conn->real_escape_string($data->appointment_date) : date('Y-m-d');

            $sql = "INSERT INTO medical_records (patient_id, doctor_id, weight, height, heart_rate, temperature, prescription, appointment_date) 
                    VALUES ($patient_id, $doctor_id, $weight, $height, '$heart_rate', '$temperature', '$prescription', '$appointment_date')";
            
            if($conn->query($sql) === TRUE) {
                echo json_encode(["success" => true, "message" => "Expediente guardado"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Faltan datos (Paciente o Doctor)"]);
        }
        break;

    case 'PUT':
        if(isset($data->id) && isset($data->patient_id) && isset($data->doctor_id)) {
            $id = (int)$data->id;
            $patient_id = (int)$data->patient_id;
            $doctor_id = (int)$data->doctor_id;
            $weight = isset($data->weight) ? (float)$data->weight : 0;
            $height = isset($data->height) ? (float)$data->height : 0;
            $heart_rate = isset($data->heart_rate) ? $conn->real_escape_string($data->heart_rate) : '';
            $temperature = isset($data->temperature) ? $conn->real_escape_string($data->temperature) : '';
            $prescription = isset($data->prescription) ? $conn->real_escape_string($data->prescription) : '';
            $appointment_date = isset($data->appointment_date) ? $conn->real_escape_string($data->appointment_date) : date('Y-m-d');

            $sql = "UPDATE medical_records 
                    SET patient_id = $patient_id,
                        doctor_id = $doctor_id,
                        weight = $weight,
                        height = $height,
                        heart_rate = '$heart_rate',
                        temperature = '$temperature',
                        prescription = '$prescription',
                        appointment_date = '$appointment_date'
                    WHERE id = $id";

            if($conn->query($sql) === TRUE) {
                echo json_encode(["success" => true, "message" => "Expediente actualizado"]);
            } else {
                echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Faltan datos para actualizar"]);
        }
        break;
}

$conn->close();
?>