<?php
include "./views/partials/head.php";
?>
<div id="kuva"></div>
<div class="forms">
<div class="form-items-align">

<h1>Rekisteröidy</h1>

<?php
?>

<form method ="post">
<label for="username">Käyttäjätunnus</label><br>
<input type ="text" name ="username" required><br>

<label for ="email">Email</label><br>
<input type="email" name="email" required><br>

<label for="password">Salasana </label><br>
<input type="password" name="password" required><br>

<label for="password2">Salasana uudelleen</label><br>
<input type="password" name="password2" required><br><br>

<input type="submit" id="rekisteroidy"value="Rekisteröidy">
</form>
</div>
</div>
<?php
include "./views/partials/end.php";
?>