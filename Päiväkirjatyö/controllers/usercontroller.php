<?php
require "./database/models/user.php";
require "./helpers/helper.php";
require "./database/models/merkinta.php";
require "./database/models/tyyppi.php";

function indexcontroller()
{
    require "./views/index.view.php";
}

function admincontroller()
{
    require "./views/admin.view.php";
}

function postregistercontroller()
{
    if(isset($_POST["username"],$_POST["password"],$_POST["password2"],$_POST["email"])  &&  $_POST["password"] === $_POST["password2"])   {
        $username = sanit($_POST["username"]);
        $password = sanitpassword($_POST["password"]);
        $email = sanit($_POST["email"]);
        $data = array($username,$password,$email);

        $ok = addPlayer($data);

        if($ok) {
            $message = "Rekisteröinti onnistui";
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
   if(isset($_POST["username"],$_POST["password"]))  {
       $username = sanit($_POST["username"]);
       $password = sanit($_POST["password"]);

       $ok = loginkayttaja($username,$password); //tietokantamallissa

       if($ok) {
           $username =hae_kayttajanimi($username);
           $id = $username[0]["kayttajaID"];
           $ip = $_SERVER["REMOTE_ADDR"];

           //asetetaan istuntomuuttujan arvot

           $_SESSION["id"] = $id;
           $_SESSION["ip"] = $ip;
           require "./views/admin.view.php";
       } else {
           $message = "Käyttäjää ei löydy";
           require "./views/loginform.view.php";
       }
   } else {
       $message = "Täytä kaikki tiedot!";
       require "./views/loginform.view.php";
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

function poistapaivacontroller()
{
    if(isset($_GET["paivakirjaID"])) {
        $paivakirjaID = $_GET["paivakirjaID"];
        if(poistapaiva($paivakirjaID)) $message="Merkintä poistettu";
        else $message="Merkintää ei poistettu";
        $kayttajaID=$_SESSION["id"];
        $paivakirjat=haemerkinnatid($kayttajaID);
        require "./views/paivakirja.view.php";
    } else header("Location:./index.php?action=admin");
    /* myös 
    } else { $players = getAllPlayers();
        $message = "ei poistettavaa id:tä";
        require "./views/admin.view.php";
    }*/
}

// hakee id:n mukaan pelaajan tiedot kannasta ja antaa ne muokkauslomakkeelle
function muokkaamerkintacontroller()
{
    if(isset($_GET["paivakirjaID"])) {
        $paivakirjaID=$_GET["paivakirjaID"];
        require "./views/muokkaamerkinta.view.php";
        $paivakirjat = haemerkintaid($paivakirjaID);
    } else {
        $message="Ei valittuna pelaajaa";
        $paivakirjat=haemerkinnatid($kayttajaID);
        require "./admin.view.php";
    }
}

function lahetamuokkausmerkintacontroller()
{
    if(isset($_POST["paivakirjaID"],$_POST["pvm"],$_POST["kesto"],$_POST["raskuus"],$_POST["kcal"],$_POST["tyyppi"],$_POST["kommentti"])) {
        $paivakirjaID = $_POST["paivakirjaID"];
        $pvm = $_POST["pvm"];
        $kesto = $_POST["kesto"];
        $raskuus = $_POST["raskuus"];
        $kcal = $_POST["kcal"];
        $tyyppi = $_POST["tyyppi"];
        $kommentti = $_POST["kommentti"];

        $data = array($tyyppi,$pvm,$kesto,$kcal,$raskuus,$kommentti,$paivakirjaID);
        $ok=muokkaamerkinta($data);

        if($ok) {
            $message = "Muokkaus on tehty";
            $kayttajaID=$_SESSION["id"];
            $paivakirjat=haemerkinnatid($kayttajaID);
            require "./views/paivakirja.view.php";
        }else {
            $message = "Muokkaus ei onnistunut";  
        }
    } else { 
        $message = "Lomakkeelta puuttuu tietoja";         
    }
    require "./views/admin.view.php";
}


function lisaamerkintacontroller()
{       
    require "./views/lisaamerkinta.view.php";
    }

function lahetamerkintacontroller()
{
    if(isset($_POST["kayttajaID"],$_POST["pvm"],$_POST["kesto"],$_POST["raskuus"],$_POST["kcal"],$_POST["tyyppi"],$_POST["kommentti"])) {
        $kayttajaID = $_POST["kayttajaID"];
        $pvm = $_POST["pvm"];
        $kesto = $_POST["kesto"];
        $raskuus = $_POST["raskuus"];
        $kcal = $_POST["kcal"];
        $tyyppi = $_POST["tyyppi"];
        $kommentti = $_POST["kommentti"];

        $data = array($kayttajaID,$tyyppi,$pvm,$kesto,$kcal,$raskuus,$kommentti);
        $ok=lisaamerkinta($data);

        if(($ok)) {
            $message = "Muokkaus on tehty";

        } else {
            $message = "Muokkaus ei onnistunut";  
        }
    } else { 
        $message = "Lomakkeelta puuttuu tietoja";         
    }
    require "./views/admin.view.php";
}
function lisaatyyppicontroller()
{       
    require "./views/lisaatyyppi.view.php";
    }

function lahetatyyppicontroller()
{
    if(isset($_POST["tyyppi"],$_POST["lisatiedot"])) {
        $tyyppi = $_POST["tyyppi"];
        $lisatiedot = $_POST["lisatiedot"];

        $data = array($tyyppi,$lisatiedot);
        $ok=lisaatyyppi($data);

        if(($ok)) {
            $message = "Muokkaus on tehty";

        } else {
            $message = "Muokkaus ei onnistunut";  
        }
    } else { 
        $message = "Lomakkeelta puuttuu tietoja";         
    }
    require "./views/admin.view.php";
}
function paivakirjacontroller()
{   
    $kayttajaID=$_SESSION["id"];
    $paivakirjat=haemerkinnatid($kayttajaID);
    require "./views/paivakirja.view.php";
    }

    function hallintacontroller()
{   
    $kayttajat=haekayttajat();
    $merkinnat=haekaikkimerkinnat();
    $tyypit=haekaikkityypit();
    require "./views/kayttajienhallinta.view.php";
    }
?>