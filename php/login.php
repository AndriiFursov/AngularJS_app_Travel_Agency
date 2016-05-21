<?php
/*------------------------------------*\
    #SECTION-LOGIN
\*------------------------------------*/

session_start();

include "connect.php";


// receiving data (JSON object) from angular $http.post service
$data = json_decode(file_get_contents('php://input'));


$salt = "sAlt2exAmple"; // 
$user_password = /* create hash */;


$sql = "SELECT ...";
       
$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
/* data handling */
    
    echo '{"response":"ok","user":"manager"}';
} else {
    session_unset();
    echo '{"response":"error","session":"killed"}'; 
}
?>
