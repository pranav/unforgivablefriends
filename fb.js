$.getJSON("/jon.json", function(list){
  window.jonlist = list;
});
/*
 * window.friends: = {
 *  "Wylie Conlon" : ["Gossip Girl", "Archer"],
 *  "Ali Ukani" : ["My Little Pony", "Nicki Minaj"]
 * }
 */

//// Load the SDK Asynchronously
//(function(d){
//  var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
//  js = d.createElement('script'); js.id = id; js.async = true;
//  js.src = "//connect.facebook.net/en_US/all.js";
//  d.getElementsByTagName('head')[0].appendChild(js);
//}(document));


window.friends = {};
window.friendcount = 0;
window.jonlist = [];
window.unforgivables = {};
window.fbid = [];

/** Checks if the facebook calls are done yet by comparing friend.length and the current friendcount which is incremented by apis */
function facebookDoneYet(){
  if(Object.keys(window.friends).length <= (window.friendcount) && (Object.keys(window.friends).length > 50))
    return true;
  else
    return false;
}

function addUnforgivable(name){
  if(Object.keys(window.unforgivables).indexOf(name) > -1)
    window.unforgivables[name]++;
  else
    window.unforgivables[name] = 1;

}

/** Facebook connect */
FB.init({
  appId      : '481960308507673', // App ID
  status     : true, // check login status
  cookie     : true, // enable cookies to allow the server to access the session
  xfbml      : true  // parse XFBML
});

function getLikes(fbid,name){
  FB.api("/"+fbid+"/likes", function(likes){
    for(i in likes.data){
      if(window.jonlist.indexOf(likes.data[i].name) > 0){
        addUnforgivable(likes.data[i].name);
        window.friends[name].push(likes.data[i].name);
      }
    }
    window.friendcount++;
  });
}

/** Get access token to run queries */
function startFacebookSort(){
  FB.getLoginStatus(function(statusresponse){
    if(statusresponse.status == "connected"){
      removeLoginPrompt();
      showLoadingPrompt();
      FB.api("/me/friends", function(me){
        console.log(me);
        for(i in me.data){
          window.friends[me.data[i].name] = [];
          window.fbid[me.data[i].name] = me.data[i].id;
        }
        for(i in me.data){
          getLikes(me.data[i].id,me.data[i].name); 
        }
      });
    }
  });
}


// On login, remove the prompt
FB.Event.subscribe('auth.login', function(response){
  removeLoginPrompt();
  startFacebookSortn();
});

// Remove the login row
function removeLoginPrompt(){
  $('#loginprompt').html('');
}

function showLoadingPrompt(){
  console.log('loading?');
  $('#loginprompt').html('<h3>Loading facebook data...</h3><div class="progress progress-striped active"><div class="bar" style="width: 0%;"></div></div>');
  window.loadingInterval = setInterval(function(){
    $('.bar').css('width', ((window.friendcount) / (Object.keys(window.friends).length)) * 100 + '%');
    if(facebookDoneYet()){
      console.log('cleared interval');
      doPostFacebookLoad();
      clearInterval(window.loadingInterval);
    }
  }, 100);
}


function doPostFacebookLoad(){
  removeLoginPrompt();

}










startFacebookSort();
