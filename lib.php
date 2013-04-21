<?php

require('config.php');

function query($sql){
  mysql_connect(DB_LOCATION, DB_USER, DB_PASS);
  mysql_select_db(DB_NAME);
  return mysql_query($sql);
}

function in_database($key){
  $q = query("SELECT * FROM likes WHERE name = '$key'");
  $res = mysql_fetch_array($q);
  if($res != NULL){
    return true;
  } else {
    return false;
  }
}

function add_to_like($key, $num){
  if(in_database($key)){
    query("UPDATE likes SET count = count + $num WHERE name = '$key'");
  } else {
    query("INSERT INTO likes VALUES('$key','$num')");
  }
}

function get_likes(){
  $q = query("SELECT * FROM likes ORDER BY count DESC");
  $return = array();
  while($row = mysql_fetch_assoc($q)){
    $return[] = $row;
  }
  return $return;
}

?>
