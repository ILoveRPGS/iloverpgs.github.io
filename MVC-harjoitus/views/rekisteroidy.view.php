<?php
include "./views/partials/head.php";
?>

<div class="neon">
  <span class="text" data-text="Rekisteröidy">Rekisteröidy</span>
  <span class="gradient"></span>
  <span class="spotlight"></span>
</div>

<?php
if(isset($message)) echo $message;
?>

<form method ="post">
<div id="inputboxit">
<input type="text" name="kttunnus" class="question" id="nme" required autocomplete="off" />
  <label for="nme"><span>Käyttäjätunnuksesi</span></label>

  <textarea name="salasana" rows="2" class="question" id="msg" required autocomplete="off"></textarea>
  <label for="msg"><span>Salasanasi</span></label>

<textarea name="salasana2" rows="2" class="question" id="msg" required autocomplete="off"></textarea>
  <label for="msg"><span>Salasana uudelleen</span></label>
  <input type="submit" value="Rekisteröidy">
</div>

</form>

<?php
include "./views/partials/end.php";
?>