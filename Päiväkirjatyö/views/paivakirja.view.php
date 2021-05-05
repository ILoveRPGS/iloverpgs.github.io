
<?php 
require "./views/partials/adminhead.php";?>
<div id="kuva">

</div><?php
echo "<div id='paivakirjascroll' style='overflow-y: scroll;'><h2>Omat Merkinnät:</h2><br>";
foreach($paivakirjat as $paivakirja){
    echo "<div class='paivakirjadiv'>";
    echo "<h2>".$paivakirja['paivays']."</h2>";
    echo "<p> Valitsemasi tyyppi: ".$paivakirja['tyyppi']."</p>";
    echo "<p> Käytetty aika: ".$paivakirja['aika']."</p>";
    echo "<p> Kalorien kulutus: ".$paivakirja['kcal']."</p>";
    echo "<p> Valitsemasi intesiteetti: ".$paivakirja['raskuus']."</p>";
    ?>
    <a class="div-a" href='./index.php?action=poistapaiva&paivakirjaID=<?php echo $paivakirja["paivakirjaID"]?>'>Poista</a>
    <a class="div-a" href='./index.php?action=muokkaapaiva&paivakirjaID=<?php echo $paivakirja["paivakirjaID"]?>'>Muokkaa</a>
    <?php

    echo "</div>";
    
}
echo"</div>";
require "./views/partials/end.php"
?>
