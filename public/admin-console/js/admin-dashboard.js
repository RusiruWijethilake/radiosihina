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
var selectProPresenter = "";
var selectArt = "";
var daysInAWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("txtUserEmail").innerHTML = user.email;
        var userDisplayName = user.displayName;

        if (userDisplayName == null) {
            document.getElementById("txtUserDisplayName").innerHTML = "<a href='#' onclick='changeUserDisplayName()'>Set your name</a>";
        } else {
            document.getElementById("txtUserDisplayName").innerHTML = user.displayName;
        }

        uid = user.uid;

        document.getElementById("txtUserId").innerHTML = uid;

        db.collection("users").doc(user.uid)
            .onSnapshot((doc) => {
                if (doc.data().roles.includes("admin")) {
                    console.log("Admin Account Verified");
                } else {
                    firebase.auth().signOut();
                    alert("You are not a admin. Please use presenter console if you are a presenter.");
                    location.href = "index.html";
                }
            });

        db.collection("programs")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var programName = doc.data().name;
                    var newLi = document.createElement("li");
                    newLi.className = "nav-item";
                    newLi.innerHTML = "<p>" + programName + "</p>"
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

function changeUserDisplayName() {
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

function signOutUser() {
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

    if (proid != "null") {
        db.collection("programs").doc(proid)
            .get()
            .then((doc) => {
                selectDate = doc.data().day;
                selectTime = doc.data().schedule.toDate();;
                selectProId = doc.id;
                selectProName = doc.data().name;

                storage.refFromURL(doc.data().art).getDownloadURL()
                    .then((url) => {
                        programManager.innerHTML = "<div class='table-responsive table-responsive-xxl'><table class='table'><tr><td rowspan='5'><img src='" + url + "' alt='program art' class='program-art-image'></td><td colspan='3' class='text-center'><span class='h2'>" + doc.data().name + "</span></td></tr><tr><td class='col-sm-4'><span class='h6'>Scheduled Day</span><br><input class='form-control' type='text' value='" + daysInAWeek[selectDate] + "' disabled></td><td class='col-sm-4'><span class='h6'>Scheduled Time</span><br><input class='form-control' type='text' value='" + formatAMPM(doc.data().schedule.toDate()) + "' disabled></td></tr><tr><td colspan='2' class='text-center'><button class='btn btn-gradiented' onclick='setDefault()'>Set Program</button></td></tr></table></div>";

                        selectArt = doc.data().art;

                        db.collection("presenters").doc(doc.data().presenter)
                            .get().then((presenterdoc) => {
                                selectProPresenter = presenterdoc.data().firstname + " " + presenterdoc.data().lastname;
                            }).catch((error) => {
                                console.log("Error getting document:", error);
                            });

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
    } else {
        programManager.innerHTML = "<div class='table-responsive table-responsive-xxl' style='visibility: hidden;'><table class='table'><tr><td rowspan='5'><img src='../img/placeholder.jpg' alt='program art'></td><td colspan='3' class='text-center'><span class='h2'>Program Name</span></td></tr><tr><td class='col-sm-4'><span class='h6'>Scheduled Date </span><br><input class='form-control' type='text' disabled></td><td class='col-sm-4'><span class='h6'>Scheduled Time </span><br><input class='form-control' type='text' disabled></td></tr><tr><td colspan='2' class='text-center'><button class='btn btn-gradiented'>Upload and Publish</button></td></tr></table></div>";
        stopSpinner();
    }
}

function checkSelectedDate(element) {
    var day = new Date(element.value).getDay();
    if (day != selectDate) {
        alert("Invalid program for your date. Select only " + daysInAWeek[selectDate] + "s");
        element.value = "";
    }
}

function getMinDate() {
    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10)
        month = '0' + month.toString();
    if (day < 10)
        day = '0' + day.toString();

    var maxDate = year + '-' + month + '-' + day;

    return maxDate;
}

function setDefault() {
    db.collection("live").doc("radiosihina").set({
        imgurl: selectArt,
        nowplaying: selectProName,
        presenter: selectProPresenter,
        status: true,
        streamurl: "https://www.radioking.com/play/radiosihina13",
    })
        .then(() => {
            alert("Stream data updatede successfully!");
        })
        .catch((error) => {
            alert("Error writing document: ", error);
        });
}

function resetDefault() {
    db.collection("live").doc("radiosihina").set({
        imgurl: "gs://radio-sihina.appspot.com/placeholder.jpg",
        nowplaying: "Sihina Music",
        presenter: "Sihina Team",
        status: true,
        streamurl: "https://www.radioking.com/play/radiosihina13",
    })
        .then(() => {
            alert("Stream data resetted successfully!");
        })
        .catch((error) => {
            alert("Error writing document: ", error);
        });
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

function startSpinner() {
    document.getElementById("overlay").style.display = "block";
}

function stopSpinner() {
    document.getElementById("overlay").style.display = "none";
}

function startUploader() {
    document.getElementById("progress-overlay").style.display = "block";
}

function stopUploader() {
    document.getElementById("progress-overlay").style.display = "none";
}