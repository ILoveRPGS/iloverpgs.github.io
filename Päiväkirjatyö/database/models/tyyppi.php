<?php
/*  
CREATE TABLE IF NOT EXISTS `players` (
  `playerID` int(10) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `current_character` varchar(15) NOT NULL,
  `money` decimal(10,0) NOT NULL DEFAULT '500',
  `lastLogin` date NOT NULL,
  `banned` tinyint(1) NOT NULL DEFAULT '0',
  `teamID` int(10) DEFAULT NULL,
  PRIMARY KEY (`playerID`),
  KEY `teamID` (`teamID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;
*/

require "./database/connection.php";

function haekaikkityypit()
{
    global $pdo; //Kohta 1 ota yhteys

    $sql = "SELECT * FROM paivakirja_tyyppi";//Kohta 2 rakenna SQL
    $stm = $pdo->query($sql); //Kohta 3 suorita sql

    $tyypit = $stm->fetchAll(PDO::FETCH_ASSOC);

    return $tyypit;

}

function r($id)
{
    global $pdo;

    $sql = "SELECT * FROM players WHERE playerID = ?";
    $stm = $pdo->prepare($sql);

    $stm->bindValue(1, $id);
    $stm->execute();

    $player = $stm->fetchAll(PDO::FETCH_ASSOC);
    return $player;
}


function e($username)
{
    global $pdo;

    $sql = "SELECT kayttajaID FROM paivakirja_kayttaja WHERE kttunnus = '$username'";
    $stm = $pdo->prepare($sql);

    $stm->bindValue(1, $username);
    $stm->execute();
    
    $username = $stm->fetchAll(PDO::FETCH_ASSOC);
    return $username;
}


function lisaatyyppi($data)
{
    global $pdo;
    $sql = "INSERT INTO paivakirja_tyyppi (tyyppi,lisatiedot) VALUES (?,?)";
    $stm = $pdo->prepare($sql);
    $ok = $stm->execute($data); //palauttaa true tai false
    return $ok;
}

function i($data)
{
    global $pdo;

    $sql ="UPDATE players SET nickname = ?, email = ?, current_character = ?, banned = ? WHERE playerID = ?";

    $stm = $pdo->prepare($sql);
    $ok = $stm->execute($data); //palauttaa true tai false
    return $ok;
}

function o($id)
{
    global $pdo;

    $sql = "DELETE FROM players WHERE playerID = ?";
    $stm = $pdo->prepare($sql);
    $stm->bindValue(1, $id);

    $ok = $stm->execute();
    return $ok;
}

//funktio tarkistaa, löytyykö käyttäjä tietokannasta
function p($username,$password)
{
    global $pdo; //yhteys

    $sql = "SELECT kttunnus,`password` FROM paivakirja_kayttaja WHERE kttunnus = '$username'";

    $stm = $pdo->prepare($sql);
    $stm->bindValue(1,$username);
    $stm->execute();

    $gotinfo = $stm->fetchAll(PDO::FETCH_ASSOC);

    //tarkistetaan, vastaavatko salasanat toisiaan
    if($gotinfo) {
        if(password_verify($password,$gotinfo[0]["password"]))  {
            return TRUE;
        } else return FALSE;
    } else return FALSE;
}