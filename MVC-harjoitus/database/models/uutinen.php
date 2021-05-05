<?php
require "./database/yhteys.php";

function hae_kaikki_uutiset()
{
    global $pdo; //Kohta 1 ota yhteys

    $sql = "SELECT * FROM uutinen";//Kohta 2 rakenna SQL
    $stm = $pdo->query($sql); //Kohta 3 suorita sql

    $uutiset = $stm->fetchAll(PDO::FETCH_ASSOC);

    return $uutiset;
}

function hae_kaikki_uutisetid($id)
{
    global $pdo;
    $sql = "SELECT * FROM uutinen WHERE kayttajaID = ?";
    $stm = $pdo->prepare($sql);

    $stm->bindValue(1, $id);
    $stm->execute();

    $uutinen = $stm->fetchAll(PDO::FETCH_ASSOC);
    return $uutinen;
}
function hae_uutinenid($id)
{
    global $pdo;
    $sql = "SELECT * FROM uutinen WHERE uutinenID = ?";
    $stm = $pdo->prepare($sql);

    $stm->bindValue(1, $id);
    $stm->execute();

    $uutinen = $stm->fetchAll(PDO::FETCH_ASSOC);
    return $uutinen;
}

function lisaa_uutinen($data)
{
    global $pdo;
    $sql = "INSERT INTO uutinen (otsikko,sisalto,kirjoituspvm,kirjoittaja,kayttajaID) VALUES (?,?,?,?,?)";
    $stm = $pdo->prepare($sql);
    $ok = $stm->execute($data); //palauttaa true tai false
    return $ok;
}

function poista_uutinen($id)
{
    global $pdo;

    $sql = "DELETE FROM uutinen WHERE uutinenID = ?";
    $stm = $pdo->prepare($sql);
    $stm->bindValue(1,$id);

    $ok = $stm->execute();
    return $ok;
}

function muokkaauutista($data)
{
    global $pdo;

    $sql ="UPDATE uutinen SET otsikko = ?, sisalto = ?, kirjoituspvm = ?, kirjoittaja = ? WHERE uutinenID = ?";

    $stm = $pdo->prepare($sql);
    $ok = $stm->execute($data); //palauttaa true tai false
    return $ok;
}





?>