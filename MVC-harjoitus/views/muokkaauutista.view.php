<?php
include "./views/partials/adminhead.php";
?>
<h1>Hallintapaneeli</h1>

<?php
if(isset($message)) echo $message;
?>

<form method ="post">

    <input type ="hidden" name="uutinenID" value="<?= $uutinen[0]["uutinenID"];?>">
    <input type ="hidden" name="kirjoittaja" value="<?= $uutinen[0]["kirjoittaja"];?>">

    <label for="otsikko">Otsikko</label><br>
    <input type ="text" name ="otsikko" value ="<?= $uutinen[0]["otsikko"];?>" required><br>

   
    <label for="email">Sisältö</label><br>
    <input type="textarea" name="sisalto" value ="<?= $uutinen[0]["sisalto"]; ?>" required><br><br>



    <input type="submit" value="Päivitä uutinen">
    </form>



<?php 
include "./views/partials/end.php";
?>