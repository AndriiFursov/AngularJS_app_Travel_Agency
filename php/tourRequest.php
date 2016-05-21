<?php
/*------------------------------------*\
    #SECTION-TOUR-REQUEST
\*------------------------------------*/

// receiving data (JSON object) from angular $http.post service
$data = json_decode(file_get_contents('php://input'));


foreach($data as $key => $value) {
    $value = strip_tags($value);
    $value = htmlspecialchars($value);
    $value = mysql_escape_string($value);
}
       
       
if ($data->clientName && $data->clientPhone) { 
    $mail_body = "name - " . $data->clientName . "\n" .
                 "phone - " . $data->clientPhone . "\n";
}
             
if ($data->clientMail) { 
    $mail_body .= "e-mail - " . $data->clientMail . "\n"; 
}

if ($data->tourId) { 
    $mail_body .= "tour ID - " . $data->tourId . "\n". 
                  "link - http://travelingua.com.ua/#!/tour/" . $data->tourId . "\n"; 
}

if ($data->clientComment) { 
    $mail_body .= "comment - " . $data->clientComment . "\n"; 
}


// sending email
if (mail("example@example.com", "client common tour request " . date("Y/m/d-H:i"), $mail_body)) {
    echo '{"response":"ok"}';
} else {
    echo '{"response":"error"}';
}
?>
