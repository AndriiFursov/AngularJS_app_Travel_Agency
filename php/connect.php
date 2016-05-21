<?php
/*------------------------------------*\
    #SECTION-CONNECT
    conect to database
\*------------------------------------*/

// connection info
// $servername, $username, $password, $dbname

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// set data charset
$sql = "SET NAMES 'utf8'";
$conn->query($sql);
?>
