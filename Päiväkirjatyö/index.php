<?php
session_start(); //aloittaa istunnon
//pyynnöt ovat muotoa index.php?action=edit&id=5

if(isset($_GET["action"])) $action = $_GET["action"];
else $action = "index";//mitä tehdään

$method = strtolower($_SERVER["REQUEST_METHOD"]); //onko post vai get
//otetaan kirjastot käyttöön
require "./controllers/usercontroller.php";
require "./helpers/auth.php";

switch($action) {

    case "index":
    indexcontroller(); //funktio, joka hakee etusivun tarvitsemat asiat
    break;

    case "register":
    if($method=="get")
    require "./views/registerform.view.php";
    else postregistercontroller();
    break;

    case "login":
    if($method =="get")
    require "./views/loginform.view.php";
    else postlogincontroller();
    break;

    case "admin":
    if(islogged()) {
        admincontroller();
    } else require "./views/loginform.view.php";
    break;

    case "logout":
    if(islogged()) {
        logoutcontroller();
    } else indexcontroller();
    break;

    case "poistapaiva":
    if(islogged()) {
        poistapaivacontroller();
    } else require "./views/loginform.view.php";
    break;

    case "lisaamerk":
    if(islogged()) {
        if($method == "get") {
            lisaamerkintacontroller();
        }
        else lahetamerkintacontroller();
    } else require "./views/loginform.view.php";
    break;

    case "lisaatyyppi":
        if(islogged()) {
            if($method == "get") {
                lisaatyyppicontroller();
            }
            else lahetatyyppicontroller();
        } else require "./views/loginform.view.php";
        break;

    case "muokkaapaiva":
        if(islogged()) {
            if($method == "get") {
                muokkaamerkintacontroller();
            }
            else lahetamuokkausmerkintacontroller();
        } else require "./views/loginform.view.php";
        break;
        
    case "paivakirja":
        if(islogged()) {
            paivakirjacontroller();
        } else require "./views/loginform.view.php";
        break;

        case "kayttajahallinta":
            if(islogged()) {
                hallintacontroller();
            } else require "./views/loginform.view.php";
            break;
    

    default:
    echo "404";
}