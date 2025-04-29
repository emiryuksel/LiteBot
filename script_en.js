const responses = {};
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const suggestions = document.getElementById("suggestions");

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const notificationSound = new Audio("../notification.wav");

let soundEnabled = false;
let isBotResponding = false;

// 🔇 Only enable sound permission on desktop, no sound on first click
if (!isMobile) {
  document.body.addEventListener(
    "click",
    () => {
      soundEnabled = true; // DO NOT play sound here!
    },
    { once: true }
  );
}

fetch("../response_en.json")
  .then((res) => res.json())
  .then((data) => {
    Object.assign(responses, data);
    botReply(responses.welcomeGeneric, true); // Silent first message
  });

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

suggestions.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    userInput.value = e.target.innerText;
    sendMessage();
  }
});

function sendMessage() {
  if (isBotResponding) return;

  const message = userInput.value.trim();
  if (!message) return;

  isBotResponding = true;
  printMessage(message, "user");
  userInput.value = "";
  getBotResponse(message.toLowerCase());
}

function getBotResponse(msg) {
  const response = getMatchingResponse(msg);
  botReply(response);
}

function getMatchingResponse(msg) {
  if (
    msg.includes("hello") ||
    msg.includes("hi") ||
    msg.includes("what's up") ||
    msg.includes("sup") ||
    msg.includes("yo")
  )
    return getRandom(responses.greeting);

  if (msg.includes("game of thrones") || msg.includes("got"))
    return "Winter is coming... ❄️";
  if (msg.includes("buğra")) return "debt -5K 💸";
  if (msg.includes("can")) return "stop eating red stuff, bro!";
  if (
    msg.includes("halflife") ||
    msg.includes("gman") ||
    msg.includes("g-man") ||
    msg.includes("gordon") ||
    msg.includes("half life")
  )
    return "Rise and shine Mr.Freeman, rise and shine.";

  if (msg.includes("thank")) return getRandom(responses.thanks);
  if (msg.includes("bye") || msg.includes("see you"))
    return getRandom(responses.farewell);
  if (msg.includes("joke")) return getRandom(responses.joke);
  if (msg.includes("motivate") || msg.includes("motivation"))
    return getRandom(responses.motivation);
  if (msg.includes("mood")) return getRandom(responses.mood);
  if (msg.includes("js") || msg.includes("code") || msg.includes("javascript"))
    return getRandom(responses.developer);
  if (msg.includes("ai") || msg.includes("artificial"))
    return getRandom(responses.aiQuestions);
  if (msg.includes("help")) return responses.help.join(", ");

  if (msg.includes("music") || msg.includes("song") || msg.includes("listen"))
    return getRandom(responses.musicSuggest);

  if (msg.includes("movie") || msg.includes("film"))
    return getRandom(responses.movieSuggest);

  if (msg.includes("series") || msg.includes("tv"))
    return getRandom(responses.seriesSuggest);

  if (msg.includes("weather")) return responses.weather;
  if (msg.includes("time"))
    return responses.time.replace("{{time}}", new Date().toLocaleTimeString());
  if (msg.includes("date") || msg.includes("day"))
    return responses.date.replace("{{date}}", new Date().toLocaleDateString());

  return getRandom(responses.unknown);
}

function botReply(text, forceSilent = false) {
  const typingMsg = document.createElement("div");
  typingMsg.className = "message bot typing";
  typingMsg.innerText = "Bot is typing...";
  chatBox.appendChild(typingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    typingMsg.remove();
    printMessage(text, "bot");

    if (!forceSilent && soundEnabled && !isMobile) {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(() => {});
    }

    isBotResponding = false;
  }, 500);
}

function printMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.getElementById("clearChat").addEventListener("click", () => {
  chatBox.innerHTML = "";
});
