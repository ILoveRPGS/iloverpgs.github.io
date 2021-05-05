<?php
include "./views/partials/head.php";
if(isset($message)) echo $message;
?>

<div class="neon">
  <span class="text" data-text="Kirjaudu">Kirjaudu</span>
  <span class="gradient"></span>
  <span class="spotlight"></span>
</div>

<form method ="post">
<div id="inputboxit">
<input type="text" name="kttunnus" class="question" id="nme" required autocomplete="off" />
  <label for="nme"><span>Käyttäjätunnuksesi</span></label>

  <textarea name="salasana" rows="2" class="question" id="msg" required autocomplete="off"></textarea>
  <label for="msg"><span>Salasanasi</span></label>

<input type="submit" value="Kirjaudu">
</div>
</form>

<?php
include "./views/partials/end.php";
?>