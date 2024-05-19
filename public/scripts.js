const socket = io();
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const chat = document.getElementById("chat");
const userList = document.getElementById("user-list");

document
  .getElementById("username-submit")
  .addEventListener("click", setUsername);

function setUsername() {
  const usernameInput = document.getElementById("username-input").value;
  if (usernameInput) {
    socket.emit("set username", usernameInput);
    document.getElementById("username-container").style.display = "none";
    document.getElementById("main-content").style.display = "flex";
  } else {
    console.log("Username is empty");
  }
}

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message) {
    socket.emit("chat message", message);
    messageInput.value = "";
  } else {
    console.log("Message is empty");
  }
});

socket.on("server message", (data) => {
  if (data) {
    const item = document.createElement("li");
    item.innerHTML = `${data.name}: ${data.msg}`;
    chat.appendChild(item);
    chat.scrollTop = chat.scrollHeight;
  }
});

socket.on("update user list", (users) => {
  userList.innerHTML = "";
  users.forEach((user) => {
    const userItem = document.createElement("li");
    userItem.textContent = user;
    userList.appendChild(userItem);
  });
});

socket.on("user joined", (username) => {
  const item = document.createElement("li");
  item.textContent = `${username} joined the chat`;
  item.style.fontStyle = "italic";
  chat.appendChild(item);
  chat.scrollTop = chat.scrollHeight;
});

socket.on("user left", (username) => {
  const item = document.createElement("li");
  item.textContent = `${username} left the chat`;
  item.style.fontStyle = "italic";
  chat.appendChild(item);
  chat.scrollTop = chat.scrollHeight;
});
