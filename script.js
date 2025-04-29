const responses = {};
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const suggestions = document.getElementById("suggestions");

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const notificationSound = new Audio("notification.wav");

let soundEnabled = false;
let isBotResponding = false;

if (!isMobile) {
  document.body.addEventListener(
    "click",
    () => {
      // İlk tıklamada ses ÇALMAYACAK, sadece izin verilecek
      soundEnabled = true;
    },
    { once: true }
  );
}

fetch("response.json")
  .then((res) => res.json())
  .then((data) => {
    Object.assign(responses, data);
    botReply(responses.welcomeGeneric, true); // İlk mesaj sessiz
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
  if (msg.includes("merhaba") || msg.includes("selam"))
    return getRandom(responses.greeting);

  if (msg.includes("teşekkür") || msg.includes("sağ ol"))
    return getRandom(responses.thanks);

  if (msg.includes("game of thrones") || msg.includes("got"))
    return "Winter is coming... ❄️";
  if (msg.includes("buğra")) return "borç -5K 💸";
  if (msg.includes("can")) return "Artık kırmızı yeme be birader!";
  if (
    msg.includes("halflife") ||
    msg.includes("gman") ||
    msg.includes("g-man") ||
    msg.includes("gordon") ||
    msg.includes("half life")
  )
    return "Rise and shine Mr.Freeman, rise and shine.";

  if (msg.includes("şaka")) return getRandom(responses.joke);
  if (
    msg.includes("naber") ||
    msg.includes("nasılsın") ||
    msg.includes("iyi misin")
  )
    return getRandom(responses.casualGreet);

  if (msg.includes("motive")) return getRandom(responses.motivation);
  if (msg.includes("moral") || msg.includes("mod"))
    return getRandom(responses.mood);

  if (msg.includes("js") || msg.includes("kod") || msg.includes("javascript"))
    return getRandom(responses.developer);

  if (msg.includes("yapay") || msg.includes("zeka"))
    return getRandom(responses.aiQuestions);

  if (msg.includes("yardım")) return responses.help.join(", ");

  if (msg.includes("müzik") || msg.includes("şarkı") || msg.includes("dinle"))
    return getRandom(responses.musicSuggest);

  if (msg.includes("film")) return getRandom(responses.movieSuggest);

  if (msg.includes("dizi") || msg.includes("seyret") || msg.includes("bölüm"))
    return getRandom(responses.seriesSuggest);

  if (msg.includes("hava")) return responses.weather;

  if (msg.includes("saat"))
    return responses.time.replace("{{time}}", new Date().toLocaleTimeString());

  if (msg.includes("tarih") || msg.includes("gün"))
    return responses.date.replace("{{date}}", new Date().toLocaleDateString());

  return getRandom(responses.unknown);
}

function botReply(text, forceSilent = false) {
  const typingMsg = document.createElement("div");
  typingMsg.className = "message bot typing";
  typingMsg.innerText = "Bot yazıyor...";
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
