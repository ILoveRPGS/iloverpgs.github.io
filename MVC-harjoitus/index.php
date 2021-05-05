<?php
session_start(); //aloittaa istunnon
//pyynnöt ovat muotoa index.php?action=edit&id=5

if(isset($_GET["action"])) $action = $_GET["action"];
else $action = "index";//mitä tehdään

$method = strtolower($_SERVER["REQUEST_METHOD"]); //onko post vai get
//otetaan kirjastot käyttöön
require "./controllers/playercontroller.php";
require "./helpers/auth.php";

switch($action) {

    case "index":
    indexcontroller(); //funktio, joka hakee etusivun tarvitsemat asiat
    break;

    case "register":
    if($method=="get")
    require "./views/rekisteroidy.view.php";
    else postregistercontroller();
    break;

    case "login":
    if($method =="get")
    require "./views/kirjaudu.view.php";
    else postlogincontroller();
    break;

    case "admin":
    if(islogged()) {
        admincontroller();
    } else require "./views/kirjaudu.view.php";
    break;

    case "logout":
    if(islogged()) {
        logoutcontroller();
    } else indexcontroller();
    break;

    case "poistauutinen":
    if(islogged()) {
        poista_uutinencontroller();
    } else require "./views/kirjaudu.view.php";
    break;

    case "lisaauutinen":
        if(islogged()) {
            if($method=="get"){
            require "./views/lisaauutinen.view.php";}
            else lisaa_uutinencontroller();
        } 
        else require "./views/kirjaudu.view.php";
        break;

    case "muokkaauutista":
    if(islogged()) {
        if($method == "get") {
            loyda_uutinenid();
        }
        else muokkaa_uutista();
    } else require "./views/loginform.view.php";
    break;



    default:
    echo "404";
}
