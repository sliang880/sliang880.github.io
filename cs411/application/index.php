<?php require_once 'config.php'; ?>

<!DOCTYPE html>
<html>
<head>
    <title>BrightPath Academy</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="header">
    <h1>BrightPath Academy - Student Management System</h1>
    <div class="nav">
        <a href="index.php">Home</a>
        <a href="students.php">Students</a>
        <a href="tutors.php">Tutors & Staff</a>
        <a href="analytics.php">Analytics</a>
    </div>
</div>

<div class="main">

<?php
$numStudents = $pdo->query("SELECT COUNT(*) FROM STUDENT")->fetchColumn();
$numTutors = $pdo->query("SELECT COUNT(*) FROM TUTOR")->fetchColumn();
$numStaff = $pdo->query("SELECT COUNT(*) FROM STAFF")->fetchColumn();
$numSessions = $pdo->query("SELECT COUNT(*) FROM TUTORING_SESSION")->fetchColumn();
$numEvents = $pdo->query("SELECT COUNT(*) FROM WORKSHOP_EVENT")->fetchColumn();
$totalPay = $pdo->query("SELECT COALESCE(SUM(Amount),0) FROM PAYMENT WHERE Payment_status='Paid'")->fetchColumn();
?>

<div class="stats">
    <div class="stat-box">
        <h3><?php echo $numStudents; ?></h3>
        <p>Students</p>
    </div>
    <div class="stat-box">
        <h3><?php echo $numTutors; ?></h3>
        <p>Tutors</p>
    </div>
    <div class="stat-box">
        <h3><?php echo $numStaff; ?></h3>
        <p>Staff</p>
    </div>
    <div class="stat-box">
        <h3><?php echo $numSessions; ?></h3>
        <p>Sessions</p>
    </div>
    <div class="stat-box">
        <h3><?php echo $numEvents; ?></h3>
        <p>Events</p>
    </div>
    <div class="stat-box">
        <h3>$<?php echo number_format($totalPay,2); ?></h3>
        <p>Revenue</p>
    </div>
</div>

<div class="box">
    <h2>About This System</h2>
    <p>This is the BrightPath Academy database management system. It tracks student information, tutoring sessions, career guidance, counseling, workshops, and financial records. The system was built using PHP and MySQL for CS411 Final Project.</p>
</div>

</div>

<div class="footer">
    <p>CS411 Final Project - BrightPath Academy Database System</p>
</div>

</body>
</html>
