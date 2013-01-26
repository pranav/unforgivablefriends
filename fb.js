/*
 * window.friends: = {
 *  "Wylie Conlon" : ["Gossip Girl", "Archer"],
 *  "Ali Ukani" : ["My Little Pony", "Nicki Minaj"]
 * }
 */

// Load the SDK Asynchronously
(function(d){
  var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = false;
  js.src = "//connect.facebook.net/en_US/all.js";
  d.getElementsByTagName('head')[0].appendChild(js);
}(document));


window.friends = {};
window.friendcount = 0;

/** Checks if the facebook calls are done yet by comparing friend.length and the current friendcount which is incremented by apis */
function facebookDoneYet(){
  if(Object.keys(window.friends).length <= window.friendcount)
    return true;
  else
    return false;
}

/** Facebook shit */
FB.init({
  appId      : '481960308507673', // App ID
  status     : true, // check login status
  cookie     : true, // enable cookies to allow the server to access the session
  xfbml      : true  // parse XFBML
});

function getLikes(fbid,name){
  FB.api("/"+fbid+"/likes", function(likes){
    for(i in likes.data){
      window.friends[name].push(likes.data[i].name);
    }
    window.friendcount++;
  });
}

/** Get access token to run queries */
FB.login(function(response) {
  window.accesstoken = response.authResponse.accessToken;

  FB.api("/me/friends", function(me){
    for(i in me.data){
      window.friends[me.data[i].name] = [];
    }
    for(i in me.data){
      getLikes(me.data[i].id,me.data[i].name); 
    }
  });




}, {scope: 'user_interests user_likes friends_interests friends_likes'});




/** Some frontend for josh */





