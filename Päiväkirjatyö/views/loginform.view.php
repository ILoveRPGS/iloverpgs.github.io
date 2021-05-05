<?php
include "./views/partials/head.php";
if(isset($message)) echo $message;
?>
<div id="kuva"></div>
<div class="forms">
<div class="form-items-align">
<h1>Kirjaudu</h1>
<form method ="post">

<label for="nickname">Käyttäjätunnus</label><br>
<input type="text" name="username"><br>

<label for="password">Salasana</label><br>
<input type="password" name="password"><br><br>

<input type="submit" id="rekisteroidy" value="Kirjaudu">
</form>
</div>
</div>
<?php
include "./views/partials/end.php";
?>