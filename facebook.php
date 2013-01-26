<?php

require 'facebook-php-sdk/src/facebook.php';

$facebook = new Facebook(array(
  'appId'  => '481960308507673',
  'secret' => '8e5be1119b92c3b976816671974cf2be'
));

$user = $facebook->getUser() or die("NOT LOGGED IN");
$params = array('scope' => 'friends_likes');
$loginUrl = $facebook->getLoginUrl($params);

$friends_raw = $facebook->api("/me/friends");
$friends_raw = $friends_raw['data'];
$friends = array();
foreach($friends_raw as $f){
  $friends[] = $f['name'];
}

for($i = 0; $i < 10; $i++){
  $req = "/".$friends_raw[$i]['id']."/likes";
  $likes = $facebook->api($req);
  for($j = 0; $j < count($likes['data']); $j++){
    $friends[$friends_raw[$i]['name']][] = $likes['data'][$j]['name'];
  }
}

header("Content-Type: application/json");
echo json_encode($friends);


?>
