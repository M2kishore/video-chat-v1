let state = {
  members:[],
  messages:[]
};
//start firebase
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

function getMessages() {
  let messages = document.querySelector(".messages");
  docRef.get().then((doc) => {
    if (doc.exists) {
      state = doc.data();
      //pushing messages to messages
      state.messages.map(message => {
        messages.innerHTML = messages.innerHTML+
        `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          message.from === user ? "me" : message.from
        }</span> </b>
        <span>${message.text}</span>
    </div>`;
      })
    }
  }).catch((err) => {
    console.log("Error getting document ", err);
  })
}
getMessages()
//firebase complete
const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
myVideo.muted = true;

backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});

const user = prompt("Enter your name");

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, user);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});

socket.on("createMessage", (message, userName) => {
  console.log("came here");
  let messages = document.querySelector(".messages");
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName
        }</span> </b>
        <span>${message}</span>
    </div>`;

    state = {
      //check if member already present
      members: state.members.indexOf(userName) === -1  ? ([...state.members,userName]) : ([...state.members]),
      //adds message
      messages: [...state.messages,{
        from: userName,
        text: message
      }]
    }
});
