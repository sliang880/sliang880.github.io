<?php require_once 'config.php'; ?>

<!DOCTYPE html>
<html>
<head>
    <title>Data Analytics - BrightPath Academy</title>
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

<h2 style="color:#2c3e50;">Data Analysis Queries (10 Queries)</h2>

<!-- Query 1 -->
<div class="query-block">
    <div class="query-header">Query 1: Active Students List</div>
    <div class="query-body">
        <div class="sql-code">SELECT First_name, Last_name, Email FROM STUDENT WHERE Status='Active'</div>
        <table>
            <tr><th>First Name</th><th>Last Name</th><th>Email</th></tr>
            <?php
            $q = $pdo->query("SELECT First_name, Last_name, Email FROM STUDENT WHERE Status='Active'");
            while ($r = $q->fetch()) {
                echo "<tr><td>{$r['First_name']}</td><td>{$r['Last_name']}</td><td>{$r['Email']}</td></tr>";
            }
            ?>
        </table>
    </div>
</div>

<!-- Query 2 -->
<div class="query-block">
    <div class="query-header">Query 2: Students with Score > 85</div>
    <div class="query-body">
        <div class="sql-code">SELECT ... FROM STUDENT JOIN STUDENT_PERFORMANCE WHERE Score > 85 ORDER BY Score DESC</div>
        <table>
            <tr><th>Name</th><th>Subject</th><th>Score</th><th>Grade</th></tr>
            <?php
            $sql = "SELECT s.First_name, s.Last_name, sub.Subject_name, sp.Score, sp.Grade
                   FROM STUDENT s JOIN STUDENT_PERFORMANCE sp ON s.Student_id=sp.Student_id
                   JOIN SUBJECT sub ON sp.Subject_id=sub.Subject_id WHERE sp.Score>85 ORDER BY sp.Score DESC";
            $q = $pdo->query($sql);
            while ($r = $q->fetch()) {
                echo "<tr><td>{$r['First_name']} {$r['Last_name']}</td><td>{$r['Subject_name']}</td><td><b>{$r['Score']}</b></td><td>{$r['Grade']}</td></tr>";
            }
            ?>
        </table>
    </div>
</div>

<!-- Query 3 -->
<div class="query-block">
    <div class="query-header">Query 3: Students Count by Program</div>
    <div class="query-body">
        <div class="sql-code">SELECT Program_name, COUNT(Student_id) FROM ENROLLMENT GROUP BY Program_name</div>
        <table>
            <tr><th>Program Name</th><th>Number of Students</th></tr>
            <?php
            $q = $pdo->query("SELECT e.Program_name, COUNT(s.Student_id) as cnt FROM STUDENT s JOIN ENROLLMENT e ON s.Student_id=e.Student_id GROUP BY e.Program_name");
            while ($r = $q->fetch()) {
                echo "<tr><td>{$r['Program_name']}</td><td><b>{$r['cnt']}</b></td></tr>";
            }
            ?>
        </table>
    </div>
</div>

<!-- Query 4 -->
<div class="query-block">
    <div class="query-header">Query 4: Sessions Conducted by Each Tutor</div>
    <div class="query-body">
        <div class="sql-code">SELECT Tutor name, COUNT(Session_id) from TUTOR JOIN TUTORING_SESSION GROUP BY Tutor_id</div>
        <table>
            <tr><th>Tutor Name</th><th>Specialization</th><th>Sessions</th></tr>
            <?php
            $sql = "SELECT t.First_name, t.Last_name, t.Specialization, COUNT(ts.Session_id) as cnt
                   FROM TUTOR t LEFT JOIN TUTORING_SESSION ts ON t.Tutor_id=ts.Tutor_id
                   GROUP BY t.Tutor_id";
            $q = $pdo->query($sql);
            while ($r = $q->fetch()) {
                echo "<tr><td>{$r['First_name']} {$r['Last_name']}</td><td>{$r['Specialization']}</td><td><b>{$r['cnt']}</b></td></tr>";
            }
            ?>
        </table>
    </div>
</div>

<!-- Query 5 -->
<div class="query-block">
    <div class="query-header">Query 5: Payment Statistics</div>
    <div class="query-body">
        <div class="sql-code">SELECT AVG(Amount), SUM(Amount), MIN(Amount), MAX(Amount), COUNT(*) FROM PAYMENT</div>
        <?php
        $r = $pdo->query("SELECT AVG(Avg) as a, SUM(Amount) as total, MIN(Amount) as mn, MAX(Amount) as mx, COUNT(*) as c FROM PAYMENT")->fetch();
        ?>
        <div class="stats">
            <div class="stat-box"><h3>$<?php echo number_format($r['a'],2); ?></h3><p>Average</p></div>
            <div class="stat-box"><h3>$<?php echo number_format($r['total'],2); ?></h3><p>Total</p></div>
            <div class="stat-box"><h3><?php echo $r['c']; ?></h3><p>Count</p></div>
            <div class="stat-box"><h3>$<?php echo number_format($r['mn'],2); ?></h3><p>Min</p></div>
            <div class="stat-box"><h3>$<?php echo number_format($r['mx'],2); ?></h3><p>Max</p></div>
        </div>
    </div>
</div>

<!-- Query 6 -->
<div class="query-block">
    <div class="query-header">Query 6: Workshop Events with Participation</div>
    <div class="query-body">
        <div class="sql-code">SELECT Event_name, Event_type, Venue, COUNT(Student_id) from WORKSHOP_EVENT GROUP BY Event_id</div>
        <table>
            <tr><th>Event</th><th>Type</th><th>Venue</th><th>Date</th><th>Participants</th></tr>
            <?php
            $sql = "SELECT w.Event_name, w.Event_type, w.Venue, w.Event_date, COUNT(ep.Student_id) as p
                   FROM WORKSHOP_EVENT w LEFT JOIN EVENT_PARTICIPATION ep ON w.Event_id=ep.Event_id
                   GROUP BY w.Event_id";
            $q = $pdo->query($sql);
            while ($r = $q->fetch()) {
                echo "<tr><td>{$r['Event_name']}</td><td>{$r['Event_type']}</td><td>{$r['Venue']}</td><td>{$r['Event_date']}</td><td><b>{$r['p']}</b></td></tr>";
            }
            ?>
        </table>
    </div>
</div>

<!-- Query 7 -->
<div class="query-block">
    <div class="query-header">Query 7: Staff by Job Title</div>
    <div class="query-body">
        <div class="sql-code">SELECT Job_title, COUNT(*), AVG(Salary_rate) FROM STAFF GROUP BY Job_title</div>
        <table>
            <tr><th>Job Title</th><th>Count</th><th>Avg Salary</th></tr>
            <?php
            $q = $pdo->query("SELECT Job_title, COUNT(*) as c, AVG(Salary_rate) as sal FROM STAFF GROUP BY Job_title");
            while ($r = $q->fetch()) {
                echo "<tr><td>{$r['Job_title']}</td><td><b>{$r['c']}</b></td><td>$".number_format($r['sal'],2)."</td></tr>";
            }
            ?>
        </table>
    </div>
</div>

<!-- Query 8 -->
<div class="query-block">
    <div class="query-header">Query 8: Counseling by Concern Type</div>
    <div class="query-body">
        <div class="sql-code">SELECT Concern_type, COUNT(*) FROM COUNSELING_SESSION GROUP BY Concern_type</div>
        <table>
            <tr><th>Concern Type</th><th>Sessions</th></tr>
            <?php
            $q = $pdo->query("SELECT Concern_type, COUNT(*) as c FROM COUNSELING_SESSION GROUP BY Concern_type");
            while ($r = $q->fetch()) {
                echo "<tr><td>{$r['Concern_type']}</td><td><b>{$r['c']}</b></td></tr>";
            }
            ?>
        </table>
    </div>
</div>

<!-- Query 9 -->
<div class="query-block">
    <div class="query-header">Query 9: User Accounts with Roles</div>
    <div class="query-body">
        <div class="sql-code">SELECT Username, Role_name, Last_login from USER_ACCOUNT JOIN ROLE</div>
        <table>
            <tr><th>Username</th><th>Role</th><th>Last Login</th><th>Status</th></tr>
            <?php
            $sql = "SELECT ua.Username, r.Role_name, ua.Last_login, ua.Account_status
                   FROM USER_ACCOUNT ua JOIN ROLE r ON ua.Role_id=r.Role_id";
            $q = $pdo->query($sql);
            while ($r = $q->fetch()) {
                echo "<tr><td>{$r['Username']}</td><td>{$r['Role_name']}</td><td>{$r['Last_login']}</td><td>{$r['Account_status']}</td></tr>";
            }
            ?>
        </table>
    </div>
</div>

<!-- Query 10 -->
<div class="query-block">
    <div class="query-header">Query 10: System Overview (KPI Dashboard)</div>
    <div class="query-body">
        <div class="sql-code">Multiple aggregate queries for key metrics</div>
        <?php
        $activeStu = $pdo->query("SELECT COUNT(*) FROM STUDENT WHERE Status='Active'")->fetchColumn();
        $inactStu = $pdo->query("SELECT COUNT(*) FROM STUDENT WHERE Status='Inactive'")->fetchColumn();
        $paidPay = $pdo->query("SELECT COUNT(*) FROM PAYMENT WHERE Payment_status='Paid'")->fetchColumn();
        $pendPay = $pdo->query("SELECT COUNT(*) FROM PAYMENT WHERE Payment_status='Pending'")->fetchColumn();
        $avgScore = $pdo->query("SELECT AVG(Score) FROM STUDENT_PERFORMANCE")->fetchColumn();
        $actEvt = $pdo->query("SELECT COUNT(*) FROM WORKSHOP_EVENT WHERE Status='Active'")->fetchColumn();
        ?>
        <div class="stats">
            <div class="stat-box"><h3><?php echo $activeStu; ?></h3><p>Active Students</p></div>
            <div class="stat-box"><h3><?php echo $inactStu; ?></h3><p>Inactive Students</p></div>
            <div class="stat-box"><h3><?php echo $paidPay; ?></h3><p>Paid Payments</p></div>
            <div class="stat-box"><h3><?php echo $pendPay; ?></h3><p>Pending Payments</p></div>
            <div class="stat-box"><h3><?php echo round($avgScore,1); ?></h3><p>Avg Score</p></div>
            <div class="stat-box"><h3><?php echo $actEvt; ?></h3><p>Active Events</p></div>
        </div>
    </div>
</div>

</div>

<div class="footer">
    <p>CS411 Final Project - BrightPath Academy Database System</p>
</div>

</body>
</html>
