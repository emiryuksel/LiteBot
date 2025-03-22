const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const suggestions = document.getElementById("suggestions");

let userName = "";

function appendMessage(content, sender = "bot") {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = content;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;

  const audio = new Audio("notification.wav");
  if (sender === "bot") audio.play();
}

function getTimeString() {
  return new Date().toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDateString() {
  return new Date().toLocaleDateString("tr-TR");
}

let responses = {};

fetch("response.json")
  .then((res) => res.json())
  .then((data) => {
    responses = data;
    appendMessage(responses.welcomeGeneric);
  });

function getResponse(input) {
  input = input.toLowerCase();

  if (!userName) {
    userName = input;
    return responses.nameConfirm.replace("{{name}}", userName);
  }

  if (input.includes("merhaba") || input.includes("selam")) {
    return random(responses.greeting).replace("{{name}}", userName);
  }

  if (input.includes("nasılsın")) {
    return random(responses.howAreYou);
  }

  if (input.includes("şaka")) {
    return random(responses.joke);
  }

  if (input.includes("motive") || input.includes("moral")) {
    return random(responses.motivation);
  }

  if (input.includes("react")) {
    return random(responses.developer);
  }

  if (input.includes("yardım")) {
    return responses.help.join(", ");
  }

  if (input.includes("teşekkür")) {
    return random(responses.thanks);
  }

  if (input.includes("görüşürüz") || input.includes("hoşça kal")) {
    return random(responses.farewell);
  }

  if (input.includes("saat")) {
    return responses.time.replace("{{time}}", getTimeString());
  }

  if (input.includes("gün") || input.includes("tarih")) {
    return responses.date.replace("{{date}}", getDateString());
  }

  return random(responses.unknown);
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

sendBtn.addEventListener("click", () => {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage(input, "user");
  setTimeout(() => {
    appendMessage(getResponse(input));
  }, 600);

  userInput.value = "";
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

suggestions.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    userInput.value = e.target.textContent;
    sendBtn.click();
  }
});
