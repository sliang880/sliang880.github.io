<?php require_once 'config.php'; ?>

<!DOCTYPE html>
<html>
<head>
    <title>Tutors & Staff - BrightPath Academy</title>
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
    <h2>Tutor List</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Rate ($/hr)</th>
            <th>Status</th>
        </tr>
        <?php
        $stmt = $pdo->query("SELECT * FROM TUTOR ORDER BY Tutor_id");
        while ($row = $stmt->fetch()) {
            echo "<tr>";
            echo "<td>" . $row['Tutor_id'] . "</td>";
            echo "<td>" . $row['First_name'] . " " . $row['Last_name'] . "</td>";
            echo "<td>" . $row['Specialization'] . "</td>";
            echo "<td>$" . number_format($row['Payment_rate'], 2) . "</td>";
            echo "<td><span class='active-badge'>" . $row['Status'] . "</span></td>";
            echo "</tr>";
        }
        ?>
    </table>
</div>

<div class="box">
    <h2>Staff List</h2>
    <table>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Job Title</th>
            <th>Salary ($/mo)</th>
        </tr>
        <?php
        $stmt = $pdo->query("SELECT * FROM STAFF ORDER BY Staff_id");
        while ($row = $stmt->fetch()) {
            echo "<tr>";
            echo "<td>" . $row['Staff_id'] . "</td>";
            echo "<td>" . $row['First_name'] . " " . $row['Last_name'] . "</td>";
            echo "<td>" . $row['Job_title'] . "</td>";
            echo "<td>$" . number_format($row['Salary_rate'], 2) . "</td>";
            echo "</tr>";
        }
        ?>
    </table>
</div>

<div class="box">
    <h2>Sessions per Tutor</h2>
    <table>
        <tr>
            <th>Tutor Name</th>
            <th>Specialization</th>
            <th>Total Sessions</th>
        </tr>
        <?php
        $sql = "SELECT t.First_name, t.Last_name, t.Specialization, COUNT(ts.Session_id) as cnt
               FROM TUTOR t LEFT JOIN TUTORING_SESSION ts ON t.Tutor_id = ts.Tutor_id
               GROUP BY t.Tutor_id ORDER BY cnt DESC";
        $stmt = $pdo->query($sql);
        while ($row = $stmt->fetch()) {
            echo "<tr>";
            echo "<td>" . $row['First_name'] . " " . $row['Last_name'] . "</td>";
            echo "<td>" . $row['Specialization'] . "</td>";
            echo "<td><b>" . $row['cnt'] . "</b></td>";
            echo "</tr>";
        }
        ?>
    </table>
</div>

<div class="box">
    <h2>Subject Assignments</h2>
    <table>
        <tr>
            <th>Tutor</th>
            <th>Subject</th>
        </tr>
        <?php
        $sql = "SELECT t.First_name, t.Last_name, s.Subject_name
               FROM TUTOR t JOIN TUTOR_SUBJECT ts ON t.Tutor_id = ts.Tutor_id
               JOIN SUBJECT s ON ts.Subject_id = s.Subject_id";
        $stmt = $pdo->query($sql);
        while ($row = $stmt->fetch()) {
            echo "<tr>";
            echo "<td>" . $row['First_name'] . " " . $row['Last_name'] . "</td>";
            echo "<td>" . $row['Subject_name'] . "</td>";
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
