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
const analytics = firebase.analytics();
const user = auth.currentUser;
const db = firebase.firestore();

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

        db.collection("programs").where("presenter", "==", uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var programName = doc.data().name;
                var newLi = document.createElement("li");
                newLi.className = "nav-item";
                newLi.innerHTML = "<p>"+programName+"</p>"
                document.getElementById("sidebar-itemlist").append(newLi);

                var proid = doc.id;
                var newOption = document.createElement("option");
                newOption.value = proid;
                newOption.innerHTML = programName;
                document.getElementById("program-selector").append(newOption);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    } else {
        location.replace("index.html");
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

var programManager = document.getElementById("program-manager-view");

function showProgramManager(selected) {
    var proid = selected.value;
    programManager.innerHTML = "";

    if(proid != "null"){
        db.collection("programs").doc(proid)
            .get()
            .then((doc) => {
                console.log(doc.data());
                var newTableView = document.createElement("table");
                newTableView.innerHTML = "<tr><td></td></tr>";
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
      }else{
        programManager.innerHTML = "";
      }
}