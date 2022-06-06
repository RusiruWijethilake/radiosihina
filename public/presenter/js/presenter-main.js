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

const emailField = document.getElementById("txtEmail");
const passwordField = document.getElementById("txtPassword");

function signInUser(){
    if(emailField.value != "" && passwordField.value != ""){
        firebase.auth().signInWithEmailAndPassword(emailField.value, passwordField.value)
        .then((userCredential) => {
            var user = userCredential.user;
            if(user.emailVerified === false){
                firebase.auth().currentUser.sendEmailVerification()
                .then(() => {
                    alert("Verify your email first! A verification mail has been sent to '"+emailField.value+"'");
                    firebase.auth().signOut().then(() => {
                    }).catch((error) => {
                        alert(error.message);
                    });
                });
            }else{
                if(user.disabled === true){
                    alert("Your access has been disbaled. Contact Rusiru for assistance.");
                }else{
                    location.href = "dashboard.html";
                }
            }
        })
        .catch((error) => {
            var errorMessage = error.message;
            console.log(errorMessage);
            alert(errorMessage+"\nContact Rusiru for assistance.");
        });
    }
}

function resetPassword(){
    var email = prompt("Enter your email address");
    bootstrap.Alert.getOrCreateInstance('#myAlert');
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      showAlert("Password reset email has been sent to '"+email+"'!");
    })
    .catch((error) => {
      var errorMessage = error.message;
      showAlert(errorMessage);
    });
}

function showAlert(message){
    alert(message);
}

(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();