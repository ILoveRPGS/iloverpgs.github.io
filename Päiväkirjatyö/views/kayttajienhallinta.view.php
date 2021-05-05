<?php 
require "./views/partials/adminhead.php";
echo"<div id='hallintanakyma'>";
echo "<div class='paivakirjascroll1 id='paivakirjascroll' style='overflow-y: scroll;'><h2>Käyttäjien merkinnät:</h2><br>";
foreach($merkinnat as $merkinta){
    echo "<div class='paivakirjadiv'>";
    echo "<h2>".$merkinta['paivays']."</h2>";
    echo "<p> Valitsemasi tyyppi: ".$merkinta['tyyppi']."</p>";
    echo "<p> Käytetty aika: ".$merkinta['aika']."</p>";
    echo "<p> Kalorien kulutus: ".$merkinta['kcal']."</p>";
    echo "<p> Valitsemasi intesiteetti: ".$merkinta['raskuus']."</p>";
    echo "<p> Merkitsijä: ".$merkinta['kttunnus']."</p>";
    ?>
    <a class="div-a" href='./index.php?action=poistapaiva&paivakirjaID=<?php echo $merkinta["paivakirjaID"]?>'>Poista</a>
    <?php

    echo "</div>";
    
}
echo"</div>";
echo "<div id='paivakirjascroll2' style='overflow-y: scroll;'><h2>Käyttäjien tyypit:</h2><br>";
foreach($tyypit as $tyyppi){
    echo "<div class='paivakirjadiv'>";
    echo "<h2>".$tyyppi['tyyppi']."</h2>";
    echo "<p> Tyypin ID: ".$tyyppi['tyyppiID']."</p>";
    echo "<p> Tarkennettu: ".$tyyppi['lisatiedot']."</p>";
    ?>
    <a class="div-a" href='./index.php?action=poistapaiva&tyyppiID=<?php echo $tyyppi["tyyppiID"]?>'>Poista</a>
    <?php

    echo "</div>";
    
}
echo"</div>";
echo "<div id='paivakirjascroll3' style='overflow-y: scroll;'><h2>Käyttäjät:</h2><br>";
foreach($kayttajat as $kayttaja){
    echo "<div class='paivakirjadiv'>";
    echo "<h2>".$kayttaja['kttunnus']."</h2>";
    echo "<p> Käyttäjän ID: ".$kayttaja['kayttajaID']."</p>";
    echo "<p> Sähköposti: ".$kayttaja['email']."</p>";
    ?>
    <a class="div-a" href='./index.php?action=poistapaiva&kayttajaID=<?php echo $kayttaja["kayttajaID"]?>'>Poista</a>
    <?php

    echo "</div>";
    
}
echo"</div></div>";

require "./views/partials/end.php"
?>
