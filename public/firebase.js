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

function addMessage() {
  docRef.set({
    members: ['person1', 'person2'],
    messages: [{
      from: 'person1',
      text: 'hi'
    },
    {
      from: 'person2',
      text: 'hello'
    }]
  })
    .then(() => {
      console.log("Room Created Successfuly");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function getMessages() {
  docRef.get().then((doc) => {
    if (doc.exists) {
      state = doc.data();
      console.log(state)
    }
  }).catch((err) => {
    console.log("Error getting document ", err);
  })
}
addMessage();
getMessages();