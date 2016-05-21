<?php
/*------------------------------------*\
    #SECTION-LIST-OF-COUNTRIES
\*------------------------------------*/

include "connect.php";

$sql = "SELECT * FROM `countries` ORDER BY rus_name ASC";
$result = $conn->query($sql);

// create result array
$countries = "[";

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        if ($countries !== "[") { $countries .= ","; }
        $countries .= '{"id": "' . $row["eng_name"] . '",' .
                       '"name": "' . $row["rus_name"] . '"}';
    }
}

$countries .= "]";
$countries = preg_replace('/\t/', '', $countries);
$countries = preg_replace('/\n/', '', $countries);
echo $countries;
?>