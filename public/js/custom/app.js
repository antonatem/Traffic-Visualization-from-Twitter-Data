  	
  	//Get elements

  	var btnLogin = document.getElementById('btnLogin');
  	var btnSignUp = document.getElementById('btnSignUp');
  	var btnLogout = document.getElementById('btnLogout');
    var userDisplay = document.getElementById('user-display');

    var provider = new firebase.auth.GoogleAuthProvider();

  	// Add login event
 	btnLogin.addEventListener('click', () => {
 		// Get email and password
    firebase.auth().signInWithPopup(provider).then( result =>{
      var token = result.credential.accessToken;

      var user = result.user;
    }).catch( e =>{
      console.log("Error:" + e.code + e.message + e.credential);
    });
 	});
    
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log(user.displayName);

          var username =user.displayName;

          var el = document.createTextNode(username);
          userDisplay.appendChild(el);


        }else{
          console.log('not logged in');
        }
    });
    
  
    btnLogout.addEventListener('click', () =>{
      firebase.auth().signOut().then(function(){
        console.log('logout success');
      }, function (err){
        console.log(err.code + err.message);
      });
    });


