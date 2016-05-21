<?php
/*------------------------------------*\
    #SECTION-LIST-OF-HOTELS
\*------------------------------------*/

include "connect.php";

$tourId = $_GET["id"];

class Result_info {
    var $tour;
    var $hotel;
}

class Tour_info {
    var $id;
    var $type;
    var $typerus;
    var $countrycode;
    var $countryname;
    var $city;
    var $price;
    var $currency;
    var $people;
    var $departure;
    var $duration;
    var $vehicle;
    var $from;
    var $hotel;
    var $hotelId;
    var $room;
    var $accomodation;
    var $added;
    var $operator;
    var $visa;
}

class Hotel_info {
    var $id;
    var $name;
    var $class;
    var $country;
    var $site;
    var $description;
    var $build;
    var $photos;
    var $other;
}

class Hotel_other {
    var $name;
    var $code;
    var $arr;
}


/* create tour info object: */

$sql = "SELECT * FROM `tours` WHERE id=" . $tourId;
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
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
    $region = "";
    if ($row_tour["region"] !== "") {
        $region = " (" . $row_tour["region"] . ")";
    }
    
    switch ($row["tour_type"]) {
        case 'hotest':
            $typerus = "Hotest";
            break;
        case 'hot':
            $typerus = "Hot";
            break;
        case 'premium':
            $typerus = "Premium";
            break;
        case 'extrim':
            $typerus = "Early booking";
            break;
        default:
           $typerus = "Error";
    }
    
    $country_full = $row_tour["rus_name"] . $region;

    
    // create new object with tour info
    $tour = new Tour_info;
    
    $tour->id = $row["id"];
    $tour->type = $row["tour_type"];
    $tour->typerus = $typerus;
    $tour->countrycode = $row_tour["eng_name"];
    $tour->countryname = $country_full;
    $tour->city = $row_tour["name_rus"];
    $tour->price = $row["price"];
    $tour->currency = $row["currency"];
    $tour->people = "1-го взрослого";
    $tour->departure = $row["date_of_leaving"];
    $tour->duration = $row["duration"];
    $tour->vehicle = $row["vehicle"];
    $tour->from = $row["from_place"];
    $tour->hotel = $row["hotel"];
    $tour->hotelId = $row["hotel_id"];
    $tour->room = $row["tour_room"];
    $tour->accomodation = $row["tour_accomodation"];
    $tour->added = $row["date_of_adding"];
    $tour->operator = $row["tour_operator"];
    $tour->visa = $row["tour_visa"];
}    


/* create hotel info object: */

$sql = "SELECT * FROM `hotels` WHERE h_code=" . $row["hotel_id"];
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // create new object with hotel info
    $hotel = new Hotel_info;
    
    $hotel->id = $row["h_code"];
    $hotel->name = $row["h_name"];
    $hotel->class = $row["h_class"];
    $hotel->country = $row["h_country"];
    $hotel->site = $row["h_site"];
    $hotel->description = $row["h_description"];
    $hotel->build = explode('|', $row["h_build"]);
    $hotel->photos = explode('|', $row["h_photos"]);
    
    $other = array();
    $obj0 = new Hotel_other;
    $obj0->name = "Distances:";
    $obj0->code = "distance";
    $obj0->arr = explode('|', $row["h_distances"]);
    array_push($other, $obj0);
    $obj1 = new Hotel_other;
    $obj1->name = "In the room:";
    $obj1->code = "in-room";
    $obj1->arr = explode('|', $row["h_in_rooms"]);
    array_push($other, $obj1);
    $obj2 = new Hotel_other;
    $obj2->name = "Avalibale:";
    $obj2->code = "available";
    $obj2->arr = explode('|', $row["h_numbers"]);
    array_push($other, $obj2);
    $obj3 = new Hotel_other;
    $obj3->name = "Accomodation:";
    $obj3->code = "food";
    $obj3->arr = explode('|', $row["h_food"]);
    array_push($other, $obj3);
    $obj4 = new Hotel_other;
    $obj4->name = "Territory:";
    $obj4->code = "territory";
    $obj4->arr = explode('|', $row["h_territory"]);
    array_push($other, $obj4);
    $obj5 = new Hotel_other;
    $obj5->name = "Pools:";
    $obj5->code = "pool";
    $obj5->arr = explode('|', $row["h_pools"]);
    array_push($other, $obj5);
    $obj6 = new Hotel_other;
    $obj6->name = "For chilldren:";
    $obj6->code = "children";
    $obj6->arr = explode('|', $row["h_for_children"]);
    array_push($other, $obj6);
    $obj7 = new Hotel_other;
    $obj7->name = "Sercices:";
    $obj7->code = "services";
    $obj7->arr = explode('|', $row["h_services"]);
    array_push($other, $obj7);
    $obj8 = new Hotel_other;
    $obj8->name = "Beauty and Health:";
    $obj8->code = "beauty";
    $obj8->arr = explode('|', $row["h_health"]);
    array_push($other, $obj8);
    $obj9 = new Hotel_other;
    $obj9->name = "Entertainment:";
    $obj9->code = "party";
    $obj9->arr = explode('|', $row["h_fun"]);
    array_push($other, $obj9);
    $obj10 = new Hotel_other;
    $obj10->name = "Sport:";
    $obj10->code = "sport";
    $obj10->arr = explode('|', $row["sport"]);
    array_push($other, $obj10);
    
    $hotel->other = $other;
}

$result_info = new Result_info;
$result_info->tour = $tour;
$result_info->hotel = $hotel;

echo json_encode($result_info);