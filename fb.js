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

function apicall(call){
  var ret = "lol";
  $.ajax({
    url: "https://graph.facebook.com"+call,
    data: {access_token: window.accesstoken},
    async:false,
    success: function(response){ret = response.data; console.log('FAIL');}
  });
  return ret;
}

function getLikes(fbid) {
  console.log(FB.api("/"+fbid+"/likes"));
}

/** Facebook shit */
FB.init({
  appId      : '481960308507673', // App ID
  status     : true, // check login status
  cookie     : true, // enable cookies to allow the server to access the session
  xfbml      : true  // parse XFBML
});

/** Get access token to run queries */
FB.login(function(response) {
  window.accesstoken = response.authResponse.accessToken;
  console.log(apicall("/me"));
}, {scope: 'user_interests user_likes friends_interests friends_likes'});



