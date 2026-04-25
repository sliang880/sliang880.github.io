<?php
$host = 'localhost';
$dbname = 'brightpath_academy';
$username = 'root';
$password = 'root';

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
