<?php 
require "./views/partials/adminhead.php";
$paivakirjaID=$_GET["paivakirjaID"];
$paivakirja=haemerkintaid($paivakirjaID);
$tyypit=haekaikkityypit();
$date=date("d/m/Y");
?>
<div id="kuva"></div>
<form method="post">
<div class="forms">
<div class="form-items-align">
<input type="text" name="paivakirjaID"hidden value='<?= $paivakirja[0]["paivakirjaID"];?>'>
<label for="datepicker">Päivämäärä:</label><br>
<input type="text" name="pvm" id="datepicker" value='<?= $paivakirja[0]["paivays"];?>'><br>

<label for="kesto">Kesto:</label><br>
<input type="text" name="kesto" id="kesto" value='<?= $paivakirja[0]["aika"];?>'><br>

<label for="kcal">Kcal-kulutus:</label><br>
<input type="text" name="kcal" id="kcal" value='<?= $paivakirja[0]["kcal"];?>'><br>

<label for="raskuus">Raskuus asteikko:</label><br>
<select name="raskuus" id="raskuus">
<?php
for($i=1;$i<=5;$i++){?>
<option <?php if($paivakirja[0]["raskuus"]==$i){
            echo "selected";
            }
            ?> value="<?=$i?>"><?=$i?></option>";
<?php
}
?>

</select>

<label for="tyyppi"></label><br>
<select name="tyyppi" id="tyyppi">
<?php foreach($tyypit as $tyyppi){?>
<option <?php if($paivakirja[0]["tyyppiID"]==$tyyppi["tyyppiID"]){
            echo "selected";
            }
            ?> 
            value='<?php echo $tyyppi["tyyppiID"]?>'><?php echo $tyyppi["tyyppi"]?></option>";
<?php
}
?>
<p>Kommentoitavaa:</p><br>
<textarea name="kommentti" id="kommentti" cols="30" rows="10" maxlength="50"><?=$paivakirja[0]["kommentti"]?></textarea>

<input type="submit" name="rekisteröidy" id="rekisteroidy" value="Päivitä merkintä!">

<a href="./index.php?action=lisaatyyppi" id="tyyppilinkki">Ei haluamaa tyyppiä? Tee uusi tästä.</a>


</form>
    </div>
</div>
<?php 
require "./views/partials/end.php";
?>