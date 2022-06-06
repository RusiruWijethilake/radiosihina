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

var playerOn = document.getElementById("playeron");
var playerOff = document.getElementById("playeroff");

var txtNowPlaying = document.getElementById("txt-nowplaying");
var txtPresenter = document.getElementById("txt-presenter");
var imgNowPlaying = document.getElementById("img-nowplaying");

var streamUrl = "";

var AudioPlayer = document.getElementById("audio-player");

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


(function () {
  const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

  //I'm adding this section so I don't have to keep updating this pen every year :-)
  //remove this if you don't need it
  let today = new Date(),
      dd = String(today.getDate()).padStart(2, "0"),
      mm = String(today.getMonth() + 1).padStart(2, "0"),
      yyyy = today.getFullYear(),
      nextYear = yyyy + 1,
      dayMonth = "06/04/",
      birthday = dayMonth + yyyy;
  
  today = mm + "/" + dd + "/" + yyyy;
  if (today > birthday) {
    birthday = dayMonth + nextYear;
  }
  //end
  
  const countDown = new Date(birthday).getTime(),
      x = setInterval(function() {    

        const now = new Date().getTime(),
              distance = countDown - now;

        document.getElementById("days").innerText = Math.floor(distance / (day)),
          document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour)),
          document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute)),
          document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);

        //do something later when date is reached
        if (distance < 0) {
          document.getElementById("countdown").style.display = "none";
          clearInterval(x);
        }
        //seconds
      }, 0)
  }());