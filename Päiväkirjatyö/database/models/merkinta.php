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

function haekaikkimerkinnat()
{
    global $pdo; //Kohta 1 ota yhteys

    $sql = "SELECT * FROM paivakirja 
    INNER JOIN paivakirja_tyyppi
    ON paivakirja.tyyppiID = paivakirja_tyyppi.tyyppiID
    INNER JOIN paivakirja_kayttaja
    ON paivakirja.kayttajaID = paivakirja_kayttaja.kayttajaID";//Kohta 2 rakenna SQL
    $stm = $pdo->query($sql); //Kohta 3 suorita sql

    $paivakirjat = $stm->fetchAll(PDO::FETCH_ASSOC);

    return $paivakirjat;

}

function testi1($id)
{
    global $pdo;

    $sql = "SELECT * FROM players WHERE playerID = ?";
    $stm = $pdo->prepare($sql);

    $stm->bindValue(1, $id);
    $stm->execute();

    $player = $stm->fetchAll(PDO::FETCH_ASSOC);
    return $player;
}


function haemerkinnatid($kayttajaID)
{
    global $pdo;

    $sql = "SELECT * FROM paivakirja INNER JOIN paivakirja_tyyppi
    ON paivakirja_tyyppi.tyyppiID = paivakirja.tyyppiID WHERE kayttajaID = '$kayttajaID'";
    $stm = $pdo->query($sql); 
    
    $paivakirjat = $stm->fetchAll(PDO::FETCH_ASSOC);
    return $paivakirjat;
}


function lisaamerkinta($data)
{
    global $pdo;
    $sql = "INSERT INTO paivakirja (kayttajaID,tyyppiID,paivays,aika,kcal,raskuus,kommentti) VALUES (?,?,?,?,?,?,?)";
    $stm = $pdo->prepare($sql);
    $ok = $stm->execute($data); //palauttaa true tai false
    return $ok;
}

function muokkaamerkinta($data)
{
    global $pdo;

    $sql ="UPDATE paivakirja SET tyyppiID = ?, paivays = ?, aika = ?, kcal = ?, raskuus = ?, kommentti = ? WHERE paivakirjaID = ?";

    $stm = $pdo->prepare($sql);
    $ok = $stm->execute($data); //palauttaa true tai false
    return $ok;
}

function poistapaiva($paivakirjaID)
{
    global $pdo;

    $sql = "DELETE FROM paivakirja WHERE paivakirjaID = '$paivakirjaID'";
    $stm = $pdo->prepare($sql);
    $stm->bindValue(1, $paivakirjaID);

    $ok = $stm->execute();
    return $ok;
}

//funktio tarkistaa, löytyykö käyttäjä tietokannasta
function haemerkintaid($paivakirjaID)
{
    global $pdo; //yhteys

    $sql = "SELECT * FROM paivakirja WHERE paivakirjaID = '$paivakirjaID'";

    $stm = $pdo->query($sql); 
    
    $paivakirja = $stm->fetchAll(PDO::FETCH_ASSOC);
    return $paivakirja;
}