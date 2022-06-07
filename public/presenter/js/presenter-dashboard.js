startSpinner();

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
const storage = firebase.storage();

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

var uid = "";
var selectDate = 0;
var selectTime = new Date();
var selectProId = "";
var selectProName = "";
var daysInAWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

        document.getElementById("txtUserId").innerHTML = uid;

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
        stopSpinner();
    } else {
        location.replace("index.html");
    }
});

function changeUserDisplayName(){
    var newDisplayName = prompt("Enter your first and last name (Eg: John Doe)");
    startSpinner();
    firebase.auth().currentUser.updateProfile({
        displayName: newDisplayName,
      }).then(() => {
        alert("Name updated successfully!")
        stopSpinner();
      }).catch((error) => {
        alert(error.message);
        stopSpinner();
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
    startSpinner();

    var proid = selected.value;
    programManager.innerHTML = "";

    if(proid != "null"){
        db.collection("programs").doc(proid)
            .get()
            .then((doc) => {
                selectDate = doc.data().day;
                selectTime = doc.data().schedule.toDate();;
                selectProId = doc.id;
                selectProName = doc.data().name;

                storage.refFromURL(doc.data().art).getDownloadURL()
                .then((url) => {
                    programManager.innerHTML = "<div class='table-responsive table-responsive-xxl'><table class='table'><tr><td rowspan='5'><img src='"+url+"' alt='program art' class='program-art-image'></td><td colspan='3' class='text-center'><span class='h2'>"+doc.data().name+"</span></td></tr><tr><td class='col-sm-4'><span class='h6'>Scheduled Day</span><br><input class='form-control' type='text' value='"+daysInAWeek[selectDate]+"' disabled></td><td class='col-sm-4'><span class='h6'>Scheduled Time</span><br><input class='form-control' type='text' value='"+formatAMPM(doc.data().schedule.toDate())+"' disabled></td></tr><tr><td colspan='2'><span class='h5'>Upload new program</span></td></tr><tr><td><span class='h6'>Select a date</span><input class='form-control' type='date' onchange='checkSelectedDate(this)' min='"+getMinDate()+"' id='txtDate' required></td><td><span class='h6'>Upload program</span><input class='form-control' type='file' id='txtFile' accept='.mp3,audio/*' required></td></tr><tr><td colspan='2' class='text-center'><button class='btn btn-gradiented' onclick='uploadAndSubmit()'>Upload and Publish</button></td></tr></table></div>";

                    stopSpinner();
                })
                .catch((error) => {
                  console.log(error.message);
                  stopSpinner();
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
                stopSpinner();
            });
      }else{
        programManager.innerHTML = "<div class='table-responsive table-responsive-xxl' style='visibility: hidden;'><table class='table'><tr><td rowspan='5'><img src='../img/placeholder.jpg' alt='program art'></td><td colspan='3' class='text-center'><span class='h2'>Program Name</span></td></tr><tr><td class='col-sm-4'><span class='h6'>Scheduled Date </span><br><input class='form-control' type='text' disabled></td><td class='col-sm-4'><span class='h6'>Scheduled Time </span><br><input class='form-control' type='text' disabled></td></tr><tr><td colspan='2'><span class='h5'>Upload new program</span></td></tr><tr><td><span class='h6'>Select a date</span><input class='form-control' type='date' onchange='checkSelectedDate(this)' id='txtDate' required></td><td><span class='h6'>Upload program</span><input class='form-control' type='file' accept='.mp3,audio/*' required></td></tr><tr><td colspan='2' class='text-center'><button class='btn btn-gradiented'>Upload and Publish</button></td></tr></table></div>";
        stopSpinner();
      }
}

function checkSelectedDate(element){
    var day = new Date(element.value).getDay();
    if(day != selectDate){
        alert("Invalid program for your date. Select only "+daysInAWeek[selectDate]+"s");
        element.value = "";
    }
}

function getMinDate(){
    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();

    var maxDate = year + '-' + month + '-' + day;

    return maxDate;
}

function uploadAndSubmit(){
    if(selectProId != ""){
        var date = document.getElementById("txtDate").value;
        var file = document.getElementById("txtFile").files[0];
        if(date != "" && file != null){
            var conf = confirm("Are you sure you want to upload");
            if(conf){
                startSpinner();

                var newDate = new Date(date+" "+selectTime.toLocaleTimeString());
                var newTimeStamp = firebase.firestore.Timestamp.fromDate(newDate);

                var alreadyThere = false;

                db.collection("library").where("date", "==", newTimeStamp)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        alreadyThere = true;
                        console.log(doc.id, " => ", doc.data());
                    });

                    if(!alreadyThere){
                        stopSpinner();
                        startUploader();

                        var storageRef = storage.ref().child('programs-recordings/'+selectProName+" - "+date+".mp3");
                        var task = storageRef.put(file);
    
                        task.on('state_changed', 
                            (snapshot) => {
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                document.getElementById("progressValue").innerHTML = (snapshot.bytesTransferred / (1024 ** 2)).toFixed(2)+"mb / "+(snapshot.totalBytes / (1024 ** 2)).toFixed(2)+"mb";
                            }, 
                            (error) => {
                                stopSpinner();
                                alert("File upload failed\n"+error.message);
                            }, 
                            () => {
                                task.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                    console.log('File available at', downloadURL);
                                    db.collection("library").add({
                                        id: selectProId,
                                        link: downloadURL,
                                        date: newTimeStamp
                                    })
                                    .then((docRef) => {
                                        stopUploader();
                                        alert("Created recording successfully! New recording for "+selectProName+" added to "+date);
                                        document.getElementById("txtDate").value = "";
                                        document.getElementById("txtFile").value = "";
                                    })
                                    .catch((error) => {
                                        stopSpinner();
                                        alert("Failed to create the record\n"+error.message);
                                    });
                                });
                            }
                        );
                    }else{
                        stopSpinner();
                        alert("Record for this date already exists!")
                    }
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            }
        }else{
            alert("Please fill all the required fields");
        }
    }
}

const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function startSpinner(){
    document.getElementById("overlay").style.display = "block";
}

function stopSpinner(){
    document.getElementById("overlay").style.display = "none";
}

function startUploader(){
    document.getElementById("progress-overlay").style.display = "block";
}

function stopUploader(){
    document.getElementById("progress-overlay").style.display = "none";
}