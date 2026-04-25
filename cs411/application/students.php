<?php require_once 'config.php'; ?>

<!DOCTYPE html>
<html>
<head>
    <title>Students - BrightPath Academy</title>
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

<div class="box">
    <h2>All Students</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Status</th>
        </tr>
        <?php
        $stmt = $pdo->query("SELECT * FROM STUDENT ORDER BY Student_id");
        while ($row = $stmt->fetch()) {
            $badge = $row['Status'] == 'Active' ? 'active-badge' : 'inactive-badge';
            echo "<tr>";
            echo "<td>" . $row['Student_id'] . "</td>";
            echo "<td>" . $row['First_name'] . " " . $row['Last_name'] . "</td>";
            echo "<td>" . $row['Gender'] . "</td>";
            echo "<td>" . $row['Email'] . "</td>";
            echo "<td><span class='$badge'>" . $row['Status'] . "</span></td>";
            echo "</tr>";
        }
        ?>
    </table>
</div>

<div class="box">
    <h2>Student Enrollments</h2>
    <table>
        <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Program</th>
            <th>Status</th>
        </tr>
        <?php
        $sql = "SELECT s.Student_id, s.First_name, s.Last_name, e.Program_name, e.Enrollment_status
               FROM STUDENT s JOIN ENROLLMENT e ON s.Student_id = e.Student_id";
        $stmt = $pdo->query($sql);
        while ($row = $stmt->fetch()) {
            echo "<tr>";
            echo "<td>" . $row['Student_id'] . "</td>";
            echo "<td>" . $row['First_name'] . " " . $row['Last_name'] . "</td>";
            echo "<td>" . $row['Program_name'] . "</td>";
            echo "<td>" . $row['Enrollment_status'] . "</td>";
            echo "</tr>";
        }
        ?>
    </table>
</div>

<div class="box">
    <h2>Student Performance (Sorted by Score)</h2>
    <table>
        <tr>
            <th>Student Name</th>
            <th>Subject</th>
            <th>Score</th>
            <th>Grade</th>
            <th>Progress</th>
        </tr>
        <?php
        $sql = "SELECT s.First_name, s.Last_name, sub.Subject_name, sp.Score, sp.Grade, sp.Progress_status
               FROM STUDENT s
               JOIN STUDENT_PERFORMANCE sp ON s.Student_id = sp.Student_id
               JOIN SUBJECT sub ON sp.Subject_id = sub.Subject_id
               ORDER BY sp.Score DESC";
        $stmt = $pdo->query($sql);
        while ($row = $stmt->fetch()) {
            echo "<tr>";
            echo "<td>" . $row['First_name'] . " " . $row['Last_name'] . "</td>";
            echo "<td>" . $row['Subject_name'] . "</td>";
            echo "<td><b>" . $row['Score'] . "</b></td>";
            echo "<td>" . $row['Grade'] . "</td>";
            echo "<td>" . $row['Progress_status'] . "</td>";
            echo "</tr>";
        }
        ?>
    </table>
</div>

</div>

<div class="footer">
    <p>CS411 Final Project - BrightPath Academy Database System</p>
</div>

</body>
</html>
