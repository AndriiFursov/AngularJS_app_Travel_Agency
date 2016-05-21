<?php
/*------------------------------------*\
    #SECTION-LIST-OF-TOURS-SHORT-INFO
\*------------------------------------*/

include "connect.php";

$sql = "SELECT * FROM `tours` WHERE `view` = 1 ORDER BY id DESC";
$result = $conn->query($sql);

// create result array
$tours = "[";

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // take data about tour destination
        $sql_tour = "SELECT cities.name_rus, countries.eng_name, cities.region, " .
                    "countries.rus_name, currency.symbol " .
                    "FROM cities, countries, currency " .
                    "WHERE cities.name_eng = '" . $row["city"] . "' " .
                           "AND cities.country = countries.eng_name " .
                           "AND currency.code = '" . $row["currency"] . "'";


        $result_tour = $conn->query($sql_tour); 
        $row_tour = $result_tour->fetch_assoc();
        
        // set auxiliary variables
        if ($row_tour["region"] !== "") {
            $region = " (" . $row_tour["region"] . ")";
        }
        
        switch ($row["tour_type"]) {
            case 'hotest':
                $typerus = "hotest";
                break;
            case 'hot':
                $typerus = "hot";
                break;
            case 'premium':
                $typerus = "premium";
                break;
            case 'extrim':
                $typerus = "early booking";
                break;
            default:
               $typerus = "Error";
        }
        
        $country_full = $row_tour["rus_name"] . $region;
        $region = "";
        
        // put together tagline (text at the header of tour presentation)
        if ($row["tagline"]) {
            $tagline = $country_full . "! " . $row_tour["name_rus"] . "! " . $row["tagline"] . "!";
        } else {
            $tagline = $country_full . "! " . $row_tour["name_rus"] . ", " . 
                       $row["price"] . " " . $row_tour["symbol"] . " for 1 persone!";
        }

        if ($tours !== "[") { $tours .= ","; }
        $tours .= '{"id": "' . $row["id"] . '",' .
                   '"type": "' . $row["tour_type"] . '",' .
                   '"typerus": "' . $typerus . '",' .
                   '"countrycode": "' . $row_tour["eng_name"] . '",' .
                   '"countryname": "' . $country_full . '",' .
                   '"city": "' . $row_tour["name_rus"] . '",' .
                   '"price": "' . $row["price"] . '",' .
                   '"currency": "' . $row_tour["symbol"] . '",' .
                   '"people": "' . "1 persone" . '",' .
                   '"departure": "' . $row["date_of_leaving"] . '",' .
                   '"duration": "' . $row["duration"] . '",' .
                   '"vehicle": "' . $row["vehicle"] . '",' .
                   '"from": "' . $row["from_place"] . '",' .
                   '"hotel": "' . $row["hotel"] . '",' .
                   '"hotelId": "' . $row["hotel_id"] . '",' .
                   '"room": "' . $row["tour_room"] . '",' .
                   '"accomodation": "' . $row["tour_accomodation"] . '",' .
                   '"added": "' . $row["date_of_adding"] . '",' .
                   '"operator": "' . $row["tour_operator"] . '",' .
                   '"visa": "' . $row["tour_visa"] . '",' .
                   '"tagline": "' . $tagline . '"}';
    }
}

$tours .= "]";
$tours = preg_replace('/\t/', '', $tours);
$tours = preg_replace('/\n/', '', $tours);
echo $tours;
?>