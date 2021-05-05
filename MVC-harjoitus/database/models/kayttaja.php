<?php
require "./database/yhteys.php";

function hae_kaikki_kayttajat()
{
    global $pdo; //Kohta 1 ota yhteys

    $sql = "SELECT * FROM kayttaja_uutinen";//Kohta 2 rakenna SQL
    $stm = $pdo->query($sql); //Kohta 3 suorita sql

    $kayttajat = $stm->fetchAll(PDO::FETCH_ASSOC);

    return $kayttajat;
}

function lisaa_kayttaja($data)
{
    global $pdo;
    $sql = "INSERT INTO kayttaja_uutinen (kayttajatunnus,salasana) VALUES (?,?)";
    $stm = $pdo->prepare($sql);
    $ok = $stm->execute($data); //palauttaa true tai false
    return $ok;
}

function poista_kayttaja($id)
{
    global $pdo;

    $sql = "DELETE FROM kayttaja_uutinen WHERE kayttajaID = ?";
    $stm = $pdo->prepare($sql);
    $stm->bindValue(1, $id);

    $ok = $stm->execute();
    return $ok;
}

function hae_kayttajaid($kttunnus)
{
    global $pdo;

    $sql = "SELECT kayttajaID FROM kayttaja_uutinen WHERE kayttajatunnus = '$kttunnus'";
    $stm = $pdo->prepare($sql);


    $stm->execute();

    $kayttaja = $stm->fetchAll(PDO::FETCH_ASSOC);
    return $kayttaja;
}

function tarkista_kirjautuminen($kttunnus,$salasana)
{
    global $pdo; //yhteys

    $sql = "SELECT kayttajatunnus , salasana FROM kayttaja_uutinen WHERE kayttajatunnus = ?";

    $stm = $pdo->prepare($sql);
    $stm->bindValue(1,$kttunnus);
    $stm->execute();

    $kayttaja = $stm->fetchAll(PDO::FETCH_ASSOC);

    //tarkistetaan, vastaavatko salasanat toisiaan
    if($kayttaja) {
        if(password_verify($salasana,$kayttaja[0]["salasana"]))  {
            return TRUE;
        } else return FALSE;
    } else return FALSE;
}




?>