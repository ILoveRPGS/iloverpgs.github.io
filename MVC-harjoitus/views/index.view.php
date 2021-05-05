<?php
include "./views/partials/head.php";
?>

<h1>Kaikki Uudet Uutiset</h1>

<?php
if(isset($message)) echo $message;
?>


<?php
foreach($uutiset as $uutinen) { ?>
<h4><?=$uutinen["otsikko"];?></h4>
<p style="font-style: italic"><?=$uutinen["sisalto"];?></p>
<p style="font-style: italic">Kirjoittaja:   <?=$uutinen["kirjoittaja"];?></p>
<?php
}
include "./views/partials/end.php";
?>