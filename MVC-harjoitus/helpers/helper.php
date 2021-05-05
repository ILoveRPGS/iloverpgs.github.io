<?php

function puhdista($input)
{
    $input= trim($input); //poistaa tyhjät välilyönnit alusta ja lopusta
    $input = filter_var($input,FILTER_SANITIZE_STRING);
    return $input;
}

function suojaa_salasana($salasana)
{
    $salasana = password_hash($salasana,PASSWORD_DEFAULT);
    return $salasana;
}