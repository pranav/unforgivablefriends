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
window.fbid = {};

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
  startFacebookSort();
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

function friendComparator(a, b){
  if(a.length > b.length) {
    return -1;
  }
  else if(a.length < b.length) {
    return 1;
  }
  else
    return 0;
}

function doPostFacebookLoad(){
  // Create a sorted array of friends
  window.sortedfriends = [];
  for(i in window.friends){
    if(window.friends[i].length > 0) {
      window.sortedfriends.push(window.friends[i]);
      window.sortedfriends[window.sortedfriends.length - 1].name = i;
    }
  }
  window.sortedfriends.sort(friendComparator);
  
  removeLoginPrompt();

  $('#loginprompt').html('<div id="friendlist" class="span12"><h1>Top 10 Unforgivable Friends</h2></div>');
  for(var i = 0; i < 10; i++){
    addFriendToPage(window.sortedfriends[i]);
  }
  $.post('/addtodb.php', {data: window.unforgivables});

}

function popularunforgivables(){
  // Add the unforgivables to the database
  $('#friendlist').html('<h1>Popular Unforgivables</h1>');
  $.getJSON('/getpopular.php', function(popular){
    for(i in popular){
      $('#friendlist').append('<h2>'+popular[i].count+' | '+popular[i].name+'</h2>');
      for(j in window.friends){
        if(window.friends[j].indexOf(popular[i].name)  > -1){
          $('#friendlist').append(j + ', ');
        }
      }
    }
  });
}

function addFriendToPage(friend){
  $('#friendlist').append('<h3>'+friend.name+' has '+friend.length+' unforgivables</h3>');
  for(i = 0; i < friend.length; i++){
    $('#friendlist').append(friend[i]+', ');
  }
  $('#friendlist').append('</div>');

}






$('a[href="#home"]').click(function(e){
  $('a').attr('class', '');
  $(this).addClass('active');
  doPostFacebookLoad();
});

$('a[href="#popular"]').click(function(e){
  $('a').removeClass('active');
  $(this).addClass('active');
  popularunforgivables();
});

startFacebookSort();
