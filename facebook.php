<?php

require 'facebook-php-sdk/src/facebook.php';

$facebook = new Facebook(array(
  'appId'  => '481960308507673',
  'secret' => '8e5be1119b92c3b976816671974cf2be'
));

$user = $facebook->getUser();
print_r($user);

?>
