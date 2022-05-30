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

var presentersView = document.getElementById("presenters");
var loadingview = document.getElementById("loading");

db.collection("presenters")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var name = doc.data().firstname+" "+doc.data().lastname;
            var position = doc.data().position;
            var imgurl = doc.data().photo;
            var job = doc.data().job;
            var work = doc.data().work;
            var field = doc.data().field;
            var education = doc.data().education;
            var social = doc.data().social;

            var imgNowPlaying = "img/presenter-placeholder.jpg";
            
            var presenterCard = document.createElement("div");
            presenterCard.className = "col";

            var pathReference = storage.refFromURL(imgurl);
            pathReference.getDownloadURL().then((url) => {
                imgNowPlaying = url;
            
                var cardInside = "<div class='card'><img src='"+imgNowPlaying+"' class='card-img-top' alt='Presenter Photo'><div class='card-body'><h5 class='card-title'>"+name+"</h5><p class='card-text'>"+position+"</p><hr><p class='card-text'><strong>"+job+"</strong><br>"+work+"</p><p class='card-text'><strong>"+field+"</strong><br>at "+education+"</p></div><div class='card-footer'>";
    
                if(social.facebook != null){
                    cardInside = cardInside + "<a href='"+social.facebook+"' target='_blank' class='fa fa-facebook'></a>"
                }
    
                if(social.instagram != null){
                    cardInside = cardInside + "<a href='"+social.instagram+"' target='_blank' class='fa fa-instagram'></a>"
                }
    
                if(social.linkedin != null){
                    cardInside = cardInside + "<a href='"+social.linkedin+"' target='_blank' class='fa fa-linkedin'></a>"
                }
    
                if(social.twitter != null){
                    cardInside = cardInside + "<a href='"+social.twitter+"' target='_blank' class='fa fa-twitter'></a>"
                }
    
                cardInside = cardInside + "</div></div>";
    
                presenterCard.innerHTML = cardInside;
    
                presentersView.appendChild(presenterCard);
            })
            .catch((error) => {
                imgNowPlaying = "img/presenter-placeholder.jpg";
            
                var cardInside = "<div class='card'><img src='"+imgNowPlaying+"' class='card-img-top' alt='Presenter Photo'><div class='card-body'><h5 class='card-title'>"+name+"</h5><p class='card-text'>"+position+"</p><hr><p class='card-text'><strong>"+job+"</strong><br>"+work+"</p><p class='card-text'><strong>"+field+"</strong><br>at "+education+"</p></div><div class='card-footer'>";
    
                if(social.facebook != null){
                    cardInside = cardInside + "<a href='"+social.facebook+"' target='_blank' class='fa fa-facebook'></a>"
                }
    
                if(social.instagram != null){
                    cardInside = cardInside + "<a href='"+social.instagram+"' target='_blank' class='fa fa-instagram'></a>"
                }
    
                if(social.linkedin != null){
                    cardInside = cardInside + "<a href='"+social.linkedin+"' target='_blank' class='fa fa-linkedin'></a>"
                }
    
                if(social.twitter != null){
                    cardInside = cardInside + "<a href='"+social.twitter+"' target='_blank' class='fa fa-twitter'></a>"
                }
    
                cardInside = cardInside + "</div></div>";
    
                presenterCard.innerHTML = cardInside;
    
                presentersView.appendChild(presenterCard);
            });

            loadingview.style.display = "none";
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });