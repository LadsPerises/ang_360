<?php
// db.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Responde a preflight requests imediatamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost'; // Normalmente na Hostinger é localhost
$db_name = 'u144936411_angola360_'; // Nome da base de dados que criaste
$user = 'u144936411_lauzen'; // Nome do utilizador que criaste
$password = 'Naruto_u144936411_WQh3j'; // Substitui pela senha que colocaste na Hostinger

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Apenas para debug, remover o detalhe do erro em produção
    echo json_encode(['success' => false, 'error' => 'Falha na ligação à base de dados: ' . $e->getMessage()]);
    exit();
}
?>
