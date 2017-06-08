
//Get elements

var btnLogin = document.getElementById('btnLogin');
var btnSignUp = document.getElementById('btnSignUp');
var btnLogout = document.getElementById('btnLogout');
var userDisplay = document.getElementById('user-display');
// Get the modal
var modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var provider = new firebase.auth.GoogleAuthProvider();

// Add login event
btnLogin.addEventListener('click', () => {
  // Get email and password
  firebase.auth().signInWithPopup(provider).then(result => {
    var token = result.credential.accessToken;

    var user = result.user;
    setTimeout(function () {
      location.reload()
    }, 3000);
  }).catch(e => {
    console.log("Error:" + e.code + e.message + e.credential);
  });
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    var username = user.displayName.split(" ")[0];

    var el = document.createTextNode(" " + username);
    userDisplay.appendChild(el);
  } else {
    modal.style.display = "block";
  }
});

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


btnLogout.addEventListener('click', () => {
  firebase.auth().signOut().then(function () {
    console.log('logout success');
  }, function (err) {
    console.log(err.code + err.message);
  });
});


