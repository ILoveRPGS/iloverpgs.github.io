<!DOCTYPE html>
<html>
<head>
<?php $kayttajaID=$_SESSION["id"]?>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Päiväkirja</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Spartan:wght@100;400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="/resources/demos/style.css">
  <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <script>
  $( function() {
    $( "#datepicker" ).datepicker();
  } );
  </script>
    <link rel="stylesheet" href="./public/css/tyyli.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<div id="nav">
    <div id="Index">
    <a href="./index.php?action=admin">Päiväkirja</a>
    </div>
</div>
<div class="dropdown" >
  <div class="dropbtn"></div>
  <div class="dropdown-content" >
  <a href="./index.php?action=logout">Kirjaudu ulos</a>
    <a href="./index.php?action=lisaamerk">Lisää merkintä</a>
    <a href="./index.php?action=paivakirja">Omat merkinnät</a>
    <?php if($kayttajaID==60){
      ?>
      <a href="./index.php?action=kayttajahallinta">Hallinta</a>
      <?php
      }?>
  </div>
</div>
    <div id="contents">
    <a href="./index.php?action=logout">Kirjaudu ulos</a>
    <a href="./index.php?action=lisaamerk">Lisää merkintä</a>
    <a href="./index.php?action=paivakirja">Omat merkinnät</a>
    <?php if($kayttajaID==60){
      ?>
      <a href="./index.php?action=kayttajahallinta">Hallinta</a>
      <?php
      }?>
    </div>
    <hr>
<?php if($_GET["action"]=="admin" || $_GET["action"]=="login"){
  include "./views/partials/indexkeski.php";
}
?>

