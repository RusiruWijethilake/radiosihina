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

const db = firebase.firestore();
var storage = firebase.storage();

var programList = document.getElementById("program-list");
var recordingList = document.getElementById("list-tab");

db.collection("programs")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var newProgram = document.createElement("option");

            db.collection("presenters").doc(doc.data().presenter).get().then((presenter) => {
              newProgram.innerHTML = doc.data().name+" by "+presenter.data().firstname+" "+presenter.data().lastname;
              newProgram.value = ""+doc.id+"";
              programList.appendChild(newProgram);
            }).catch((er) => {
              console.log("Error getting document:", er);
            });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

function showRecordings(selected) {
  var proid = selected.value;
  recordingList.innerHTML = "";

  if(proid != "null"){
    db.collection("library").where("id", "==", proid).orderBy("number", "desc")
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              var id = doc.data().id;
              var number = doc.data().number;
              var link = doc.data().link;
              var dat = doc.data().date.toDate().toDateString() + " " + doc.data().date.toDate().toLocaleTimeString('en-US');
              db.collection("programs").doc(id).get().then((program) => {
                db.collection("presenters").doc(program.data().presenter).get().then((presenter) => {
                  var by = presenter.data().firstname + " " + presenter.data().lastname;

                  var newDesc = document.createElement("tr");
                  var newPlayer = document.createElement("tr");

                  newDesc.innerHTML = "<th>"+number+"</th><th>"+program.data().name+"</th><td>By "+by+"</td><td class='text-muted'>"+dat+"</td>";
                  newPlayer.innerHTML = "<td colspan='4'><audio preload='none' controls><source src="+link+" type='audio/mpeg'></audio></td>";

                  recordingList.append(newDesc);
                  recordingList.append(newPlayer);
                }).catch((er) => {
                  console.log("Error getting document:", er);
                });
              }).catch((error) => {
                console.log("Error getting document:", error);
              });
          });
      })
      .catch((error) => {
          console.log("Error getting documents: ", error);
      });
  }else{
    recordingList.innerHTML = "";
  }
}