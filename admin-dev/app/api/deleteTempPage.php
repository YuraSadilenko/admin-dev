<?php 
  session_start();

  if($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
  } 

  $file = "../../temporary_file-no_use_qwertyytrewq1990.html";

  if(file_exists($file)) {
    unlink($file);
  } else {
    header("HTTP/1.0 400 Bad Request");
  }