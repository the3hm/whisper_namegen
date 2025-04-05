<?php
// admin/php/save.php

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

// Log the incoming data to check if it's being received correctly
error_log('Received data: ' . print_r($data, true));  // Logs the data to the PHP error log

if (!isset($data['filename']) || !isset($data['content'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing data"]);
    exit;
}

$filename = basename($data['filename']);
$filepath = __DIR__ . '/../../data/' . $filename;

// Log the file path to ensure it's correct
error_log('File path: ' . $filepath);  // Logs the file path

// Security check: only allow editing known files
$allowedFiles = ['keywords_list.json', 'tags.json', 'names.json'];
if (!in_array($filename, $allowedFiles)) {
    http_response_code(403);
    echo json_encode(["error" => "Editing this file is not allowed."]);
    exit;
}

// Read existing data from the file
if (file_exists($filepath)) {
    $existingData = json_decode(file_get_contents($filepath), true);
    if ($existingData === null) {
        $existingData = [];  // If the file is empty or corrupted, use an empty array
    }
} else {
    $existingData = [];
}

// Log the existing data
error_log('Existing data: ' . print_r($existingData, true));  // Logs existing data

// Merge the new data with the existing data
$updatedData = array_merge($existingData, $data['content']);

// Log the merged data to check if it's correct
error_log('Merged data: ' . print_r($updatedData, true));  // Logs the merged data

// Save the updated data back to the file
if (file_put_contents($filepath, json_encode($updatedData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))) {
    error_log('File saved successfully');
    echo json_encode(["success" => true]);
} else {
    error_log('Failed to save file');
    echo json_encode(["error" => "Failed to save the file."]);
}
?>
