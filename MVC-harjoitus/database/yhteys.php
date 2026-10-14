<?php
// Database connection used by the model files. Exposes the PDO handle as $pdo.
//
// The real settings live in config.php next to this file. config.php is not in
// git: copy config.sample.php to config.php and fill in your own values.

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    exit('Missing database/config.php. Copy database/config.sample.php to database/config.php and fill it in.');
}

$config = require $configFile;
if (!is_array($config)) {
    http_response_code(500);
    exit('database/config.php must return an array. See database/config.sample.php.');
}
foreach (['host', 'name', 'user', 'pass'] as $key) {
    if (!array_key_exists($key, $config)) {
        http_response_code(500);
        exit('database/config.php is missing the "' . $key . '" setting. See database/config.sample.php.');
    }
}

$dsn = 'mysql:host=' . $config['host']
     . ';dbname=' . $config['name']
     . ';charset=' . ($config['charset'] ?? 'utf8mb4');

try {
    $pdo = new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE          => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Do not print the exception: it can contain connection details.
    http_response_code(500);
    exit('Could not connect to the database. Check database/config.php.');
}

unset($config, $configFile, $dsn, $key);
