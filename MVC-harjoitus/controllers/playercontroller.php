<?php
require "./database/models/kayttaja.php";
require "./database/models/uutinen.php";
require "./helpers/helper.php";
function indexcontroller()
{
    $uutiset = hae_kaikki_uutiset();
    //var_dump($players);
    require "./views/index.view.php";
}

function admincontroller()
{
    $uutiset = hae_uutinenid();
    //var_dump($players);
    require "./views/admin.view.php";
}

function postregistercontroller()
{
    if(isset($_POST["kttunnus"],$_POST["salasana"],$_POST["salasana2"])  &&  $_POST["salasana"] === $_POST["salasana2"])   {
        $kttunnus = puhdista($_POST["kttunnus"]);
        $salasana = suojaa_salasana($_POST["salasana"]);

        $data = array($kttunnus,$salasana);

        //var_dump($data);

        $ok = lisaa_kayttaja($data);

        if($ok) {
            $message = "Rekisteröinti onnistui";
            $uutiset = hae_kaikki_uutiset(); //hakee kaikki pelaajat kannasta
            require "./views/index.view.php";
        }
        else {
            $message = "Rekisteröinti ei onnistu...";
            require "./views/registerform.view.php";
        }
    } else {
        $message = "Tiedoissa vikaa...";
        require "./views/registerform.view.php";
    }
}

function postlogincontroller()
{
   if(isset($_POST["kttunnus"],$_POST["salasana"]))  {
       $kttunnus = puhdista($_POST["kttunnus"]);
       $salasana = puhdista($_POST["salasana"]);

       $ok = tarkista_kirjautuminen($kttunnus,$salasana); //tietokantamallissa

       if($ok) {
           $kayttaja =hae_kayttajaid($kttunnus);
           $id = $kayttaja[0]["kayttajaID"];
           $ip = $_SERVER["REMOTE_ADDR"];

           //asetetaan istuntomuuttujan arvot

           $_SESSION["id"] = $id;
           $_SESSION["ip"] = $ip;

           $uutiset = hae_kaikki_uutisetid($id);
           
           require "./views/admin.view.php";
       } else {
           $message = "Käyttäjää ei löydy";
           require "./views/kirjaudu.view.php";
       }
   } else {
       $message = "Täytä kaikki tiedot!";
       require "./views/kirjaudu.view.php";
   }
}

function logoutcontroller()
{
    if(isset($_SESSION["ip"],$_SESSION["id"]))  {
        session_unset(); //poistaa istuntomuuttujat
        session_destroy();//poistaa koko istunnon
        header("Location:./index.php");
    } else header("Location:./index.php");

}

function poista_uutinencontroller()
{
    if(isset($_GET["uutinenID"])) {
        $uutinenID = $_GET["uutinenID"];
        if(poista_uutinen($uutinenID)) $message="Uutinen on poistettu";
        else $message="Pelaaja ei poistunut";
        $uutiset = hae_kaikki_uutiset();
        require "./views/admin.view.php";
    } else header("Location:./index.php?action=admin");
    /* myös 
    } else { $players = getAllPlayers();
        $message = "ei poistettavaa id:tä";
        require "./views/admin.view.php";
    }*/
}
    function lisaa_uutinencontroller()
{
   if(isset($_POST["otsikko"],$_POST["sisalto"],$_POST["kirjoittaja"]))  {
       
       
       $otsikko = puhdista($_POST["otsikko"]);
       $sisalto = puhdista($_POST["sisalto"]);
       $kirjoituspvm=date("y-m-d");
       $kirjoittaja = $_POST["kirjoittaja"];
       $kayttaja =hae_kayttajaid($kirjoittaja);
       $id = $kayttaja[0]["kayttajaID"];
       $data = array($otsikko,$sisalto,$kirjoituspvm,$kirjoittaja,$id);

       $ok = lisaa_uutinen($data);

       if($ok) {
        $message = "Uutisen lisääminen onnistui onnistui";
        $uutiset = hae_kaikki_uutiset(); //hakee kaikki pelaajat kannasta
        require "./views/admin.view.php";
    }
    else {
        $message = "Lisääminen ei onnistu...";
        require "./views/lisaauutinen.view.php";
    }
} 
    else {
    $message = "Tiedoissa vikaa...";
    require "./views/lisaauutinen.view.php";
    }
}
function loyda_uutinenid()
{
    if(isset($_GET["uutinenID"])) {
        $uutinenID=$_GET["uutinenID"];
        $uutinen = hae_uutinenid($uutinenID);
        var_dump($uutinenID);
        require "./views/muokkaauutista.view.php";
    } else {
        $message="Ei valittuna pelaajaa";
        $uutinenID = hae_kaikki_uutiset();
        require "./admin.view.php";
    }
}
function muokkaa_uutista()
{
    if(isset($_POST["otsikko"],$_POST["sisalto"],$_POST["kirjoittaja"],$_POST["uutinenID"])) {
        $otsikko = puhdista($_POST["otsikko"]);
        $sisalto = puhdista($_POST["sisalto"]);
        $kirjoittaja=puhdista($_POST["kirjoittaja"]);
        $kirjoituspvm = date("Y-m-d");
        $uutinenID=$_POST["uutinenID"];



        $data = array($otsikko,$sisalto,$kirjoituspvm,$kirjoittaja,$uutinenID);

        if(muokkaauutista($data)) {
            $message = "Muokkaus on tehty";

        } else {
            $message = "Muokkaus ei onnistunut";  
        }
    } else { 
        $message = "Lomakkeelta puuttuu tietoja";         
    }
    $uutiset = hae_kaikki_uutiset();
    require "./views/admin.view.php";
}
?>