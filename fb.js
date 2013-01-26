/*
 * window.friends: = {
 *  "Wylie Conlon" : ["Gossip Girl", "Archer"],
 *  "Ali Ukani" : ["My Little Pony", "Nicki Minaj"]
 * }
 */

window.friends = {};

/** Facebook shit */
window.fbAsyncInit = function() {
  FB.init({
    appId      : '481960308507673', // App ID
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  /** Get access token to run queries */
  FB.login(function(response) {
    FB.api('/me/friends', function(response){
      for(i in response.data){
        var fbid = response.data[i].id;
        name = response.data[i].name;
        window.friends[name] = [];
        console.log(name);
        FB.api('/'+fbid+'/likes',function(data){
          for(j in data.data){
            window.friends[name].push(data.data[j].name);
          }
        });
      }
    });

  }, {scope: 'user_interests user_likes friends_interests friends_likes'});

};

// Load the SDK Asynchronously
(function(d){
  var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js";
  d.getElementsByTagName('head')[0].appendChild(js);
}(document));

