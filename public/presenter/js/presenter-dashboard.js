const firebaseConfig = {
    apiKey: "AIzaSyANGR2PoeFAXlEm0VAnLHPCoyrvq6L6T1Q",
    authDomain: "radio-sihina.firebaseapp.com",
    projectId: "radio-sihina",
    storageBucket: "radio-sihina.appspot.com",
    messagingSenderId: "679358100866",
    appId: "1:679358100866:web:e7096de0c1af2a4f440b9b",
    measurementId: "G-NH0V4XV7NQ"
  };
  
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const user = auth.currentUser;

var uid = "";

auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("txtUserEmail").innerHTML = user.email;
        var userDisplayName = user.displayName;
        if(userDisplayName == null){
            document.getElementById("txtUserDisplayName").innerHTML = "<a href='#' onclick='changeUserDisplayName()'>Set your name</a>";
        }else{
            document.getElementById("txtUserDisplayName").innerHTML = user.displayName;
        }
        uid = user.uid;
        console.log(user);
    } else {
        window.href = "index.html";
    }
});

function changeUserDisplayName(){
    var newDisplayName = prompt("Enter your first and last name (Eg: John Doe)");
    firebase.auth().currentUser.updateProfile({
        displayName: newDisplayName,
      }).then(() => {
        alert("Name updated successfully!")
      }).catch((error) => {
        alert(error.message);
      });
}

function signOutUser(){
    firebase.auth().signOut().then(() => {
        alert("You have been logged out!");
        location.href = "index.html";
    }).catch((error) => {
        alert(error.message);
    });
}