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

function initApplication(){
    if(user == null){
        alert("Authentication failed! Please login again!");
        location.href = "index.html";
    }else{

    }
}

initApplication();

function signOutUser(){
    firebase.auth().signOut().then(() => {
        alert("You have been logged out!");
        location.href = "index.html";
    }).catch((error) => {
        alert(error.message);
    });
}