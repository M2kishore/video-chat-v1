var firebaseConfig = {
  //change the api key as your wish
  apiKey: "AIzaSyCpRrzv2SJtccb4YLtJaE_TI3-qzxNwbwY",
  authDomain: "ipif-interview.firebaseapp.com",
  projectId: "ipif-interview",
  storageBucket: "ipif-interview.appspot.com",
  messagingSenderId: "6473115274",
  appId: "1:6473115274:web:4332284e5f446a5b78af73"

}
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var docRef = db.collection("room").doc(ROOM_ID);

//adds new message every 10 seconds
setInterval(addMessage, 10000);

function addMessage() {
  docRef.set({
    ...state
  })
    .then(() => {
      console.log("Messages saved");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function getMessages() { //you need to figure out whether it is 'me' or not
  let messages = document.querySelector(".messages");
  docRef.get().then((doc) => {
    if (doc.exists) {
      state = doc.data();
      //pushing messages to messages
      state.messages.map(message => {
        messages.innerHTML = messages.innerHTML+
        `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          message.from
        }</span> </b>
        <span>${message.text}</span>
    </div>`;
      })
      console.log(state)
    }
  }).catch((err) => {
    console.log("Error getting document ", err);
  })
}
getMessages()