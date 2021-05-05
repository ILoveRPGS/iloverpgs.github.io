<?php
include "./views/partials/adminhead.php";
?>

<h1>Lisää uutinen</h1>

<?php
if(isset($message)) echo $message;
?>

<form method ="post">
<label for="otsikko">Otsikko</label><br>
<input type ="text" name ="otsikko" required><br>

<label for ="sisalto">Sisältö</label><br>
<input type="text" name="sisalto" required><br>

<label for ="kirjoittaja">Käyttäjätunnuksesi</label><br>
<input type="text" name="kirjoittaja" required><br>

<input type="submit" value="Lisää uutinen">
</form>

<?php
include "./views/partials/end.php";
?>