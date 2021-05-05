<?php 
require "./views/partials/adminhead.php";
$tyypit=haekaikkityypit();
$date=date("d/m/Y");
?>
<div id="kuva"></div>
<form method="post">
<div class="forms">
<input type="hidden" name="kayttajaID" id="kayttajaID" value=<?php echo $_SESSION['id']?>>
<label for="datepicker">Päivämäärä:</label><br>
<input type="text" name="pvm" id="datepicker" value='<?= $date;?>'><br>

<label for="kesto">Kesto:</label><br>
<input type="text" name="kesto" id="kesto"><br>

<label for="kcal">Kcal-kulutus:</label><br>
<input type="text" name="kcal" id="kcal"><br>

<label for="raskuus">Raskuus asteikko:</label>
<select name="raskuus" id="raskuus"><br>
<option value="1">1</option>
<option value="2">2</option>
<option value="3">3</option>
<option value="4">4</option>
<option value="5">5</option>
</select>


<textarea name="kommentti" id="kommentti" cols="30" rows="10" maxlength="50"></textarea>
<label for="tyyppi"></label><br>
<select name="tyyppi" id="tyyppi">
<?php foreach($tyypit as $tyyppi){?>
<option value='<?php echo $tyyppi["tyyppiID"]?>'><?php echo $tyyppi["tyyppi"]?></option>";
<?php
}
?><br>
<input type="submit" name="rekisteröidy" id="rekisteroidy" value="Lisää merkintä!"><br>

<a href="./index.php?action=lisaatyyppi" id="tyyppilinkki">Ei haluamaa tyyppiä? Tee uusi tästä.</a>


</form>
</div>
<?php 
require "./views/partials/end.php";
?>