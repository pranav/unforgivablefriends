<?php
require('lib.php');

foreach($_POST['data'] as $key=>$val){
  add_to_like($key, $val);

}

?>
