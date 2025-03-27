const responses = {};
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const suggestions = document.getElementById("suggestions");
const notificationSound = new Audio("notification.wav");

let soundEnabled = false;

document.body.addEventListener(
  "click",
  () => {
    notificationSound.play().catch(() => {});
    soundEnabled = true;
  },
  { once: true }
);

fetch("response.json")
  .then((res) => res.json())
  .then((data) => {
    Object.assign(responses, data);
    botReply(responses.welcomeGeneric);
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
  const message = userInput.value.trim();
  if (!message) return;
  printMessage(message, "user");
  userInput.value = "";
  getBotResponse(message.toLowerCase());
}

function getBotResponse(msg) {
  let response = getMatchingResponse(msg);
  botReply(response);
}

function getMatchingResponse(msg) {
  if (
    msg.includes("merhaba") ||
    msg.includes("selam") ||
    msg.includes("naber") ||
    msg.includes("nasılsın") ||
    msg.includes("selamun aleyküm")
  )
    return getRandom(responses.greeting);

  if (msg.includes("game of thrones") || msg.includes("got"))
    return "Winter is coming... ❄️";
  if (msg.includes("buğra")) return "borç -5K 💸";
  if (msg.includes("can")) return "artık kırmızı yeme birader!";

  if (msg.includes("teşekkür")) return getRandom(responses.thanks);
  if (
    msg.includes("görüşürüz") ||
    msg.includes("bay") ||
    msg.includes("hoşça kal")
  )
    return getRandom(responses.farewell);
  if (msg.includes("şaka")) return getRandom(responses.joke);
  if (msg.includes("motive")) return getRandom(responses.motivation);
  if (msg.includes("moral") || msg.includes("mod"))
    return getRandom(responses.mood);
  if (msg.includes("react") || msg.includes("kod"))
    return getRandom(responses.developer);
  if (msg.includes("yapay zeka") || msg.includes("ai"))
    return getRandom(responses.aiQuestions);
  if (msg.includes("yardım")) return responses.help.join(", ");
  if (msg.includes("film")) return getRandom(responses.smalltalk);
  if (msg.includes("müzik")) return getRandom(responses.smalltalk);
  if (msg.includes("hava")) return responses.weather;
  if (msg.includes("saat"))
    return responses.time.replace("{{time}}", new Date().toLocaleTimeString());
  if (msg.includes("gün") || msg.includes("tarih"))
    return responses.date.replace("{{date}}", new Date().toLocaleDateString());

  return getRandom(responses.unknown);
}

function botReply(text) {
  setTimeout(() => {
    printMessage(text, "bot");
    if (soundEnabled) {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(() => {});
    }
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
