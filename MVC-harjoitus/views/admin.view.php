<?php
include "./views/partials/adminhead.php";
?>
<div class="neon">
  <span class="text" data-text="Hallintapaneeli">Hallintapaneeli</span>
  <span class="gradient"></span>
  <span class="spotlight"></span>
</div>

<?php
if(isset($message)) echo $message;
?>


<?php
foreach($uutiset as $uutinen) { ?>
<h4><?=$uutinen["otsikko"];?></h4>
<p style="font-style: italic"><?=$uutinen["sisalto"];?><br>
<a href="./index.php?action=poistauutinen&uutinenID=<?= $uutinen["uutinenID"];?>">Poista</a><br>
<a href="./index.php?action=muokkaauutista&uutinenID=<?= $uutinen["uutinenID"];?>">Muokkaa</a><br>

<?php
}
?><br>
<a href='./index.php?action=lisaauutinen&kayttajaID=<?php $kayttaja[0]["kayttajaID"]?>'>Lisää uutinen</a><br>
<?php
include "./views/partials/end.php";

?>