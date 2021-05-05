<?php 
require "./views/partials/adminhead.php";
$tyypit=haekaikkityypit();
?>
<div id="kuva"></div>
<form method="post">
<div class="forms">
<div class="form-items-align">

<label for="tyyppi">Tyypin nimi:</label><br>
<input type="text" name="tyyppi" id="tyyppi"><br>

<label for="lisatiedot">Lisätiedot:</label><br>
<input type="text" name="lisatiedot" id="lisatiedot"><br><br>

<label for="tyyppinfo">Jos lisäys onnistui se näkyy täällä.</label><br>
<select name="tyyppinfo" id="tyyppinfo">
<?php foreach($tyypit as $tyyppi){?>
<option value='<?php echo $tyyppi["tyyppiID"]?>'><?php echo $tyyppi["tyyppi"]?></option>";
<?php
}
?>

<input type="submit" name="rekisteröidy" id="rekisteroidy" value="Lisää tyyppi!">


</form>
    </div>
</div>
<?php 
require "./views/partials/end.php";
?>