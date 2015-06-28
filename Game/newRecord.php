<?php
file_put_contents('record.json', json_encode(array('Record' => $_GET['record'])));
header('Location: index.php');
