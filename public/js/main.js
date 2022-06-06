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
const analytics = firebase.analytics();
const messaging = firebase.messaging();
var storage = firebase.storage();

messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
});

var playerOn = document.getElementById("playeron");
var playerOff = document.getElementById("playeroff");

var txtNowPlaying = document.getElementById("txt-nowplaying");
var txtPresenter = document.getElementById("txt-presenter");
var imgNowPlaying = document.getElementById("img-nowplaying");

var streamUrl = "";

var AudioPlayer = document.getElementById("audio-player");

AudioPlayer.addEventListener('playing', logEvent("started playing"));
AudioPlayer.addEventListener('pause', logEvent("stoped playing"));

function logEvent(message){
  analytics.logEvent("RADIO-PLAYER "+message);
}

db.collection("live").doc("radiosihina")
    .onSnapshot((doc) => {
        if(doc.data().status){
          playerOff.style.display = "none";
          playerOn.style.display = "block";
          txtNowPlaying.innerHTML = doc.data().nowplaying;
          txtPresenter.innerHTML = doc.data().presenter;
          var newStreamUrl = doc.data().streamurl;

          if(newStreamUrl != streamUrl){
            streamUrl = newStreamUrl;
            AudioPlayer.setAttribute("src", streamUrl);
          }

          var pathReference = storage.refFromURL(doc.data().imgurl);
          pathReference.getDownloadURL().then((url) => {
            imgNowPlaying.src = url;
          })
          .catch((error) => {
            imgNowPlaying.src = "img/placeholder.jpg";
          });
        }else{
          AudioPlayer.pause();
          AudioPlayer.setAttribute("src", "");
          playerOn.style.display = "none";
          playerOff.style.display = "block";
        }
    });