window.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("chatSendBtn")
        .addEventListener("click", sendChatMessage);
    document
        .getElementById("chatResetBtn")
        .addEventListener("click", resetChat);
    document.getElementById("chatInputBox").addEventListener("keyup", (e) => {
        if (e.keyCode === 13) {
            sendChatMessage();
        }
    });
    resetChat();
});

let messages = [];

const moods = [
    { mood: "neutral", numImages: 6 },
    { mood: "angry", numImages: 2 },
    { mood: "happy", numImages: 8 },
    { mood: "laughing", numImages: 4 },
    { mood: "surprised", numImages: 2 },
    { mood: "thinking", numImages: 3 },
    { mood: "waving", numImages: 1 },
];

function getImageForMessage(msg) {
    const moodRegex = /^\[([a-z]+)\]/i;
    const match = msg.match(moodRegex);

    const imagePath = "../images/jonquil/";
    if (match && match.length > 1) {
        const mood = match[1].toLowerCase();
        let moodInfo = moods.find((m) => m.mood === mood);
        if (!moodInfo) {
            moodInfo = moods.find((m) => m.mood === "neutral");
        }
        const imageNum = Math.floor(Math.random() * moodInfo.numImages) + 1;
        return imagePath + mood + imageNum + ".jpg";
    }
}

function stripMoodFromMessage(msg) {
    const moodRegex = /^\[([a-z]+)\]/i;
    return msg.replace(moodRegex, "").trim();
}

function resetChat() {
    messages = [];
    const inputBox = document.getElementById("chatInputBox");
    inputBox.value = "";
    inputBox.disabled = false;
    document.getElementById("msgBlock").innerHTML = "";
}

function sendChatMessage() {
    const inputBox = document.getElementById("chatInputBox");
    const msg = inputBox.value;
    if (msg.trim() === "") {
        alert("Please enter a message");
    } else {
        messages.push({
            role: "user",
            content: msg,
        });
        const msgRow = buildMessage(msg, "user", "You");
        document.getElementById("msgBlock").appendChild(msgRow);
        inputBox.value = "Loading...";
        inputBox.disabled = true;
        const address = apiAddress + `/api/Jonquil/Chat`;
        const requestData = messages;
        makePostRequest(address, JSON.stringify(requestData), (data) => {
            const response = JSON.parse(data);
            const msgRow = buildMessage(response.content, "npc", "Jonquil");
            messages.push({
                role: "assistant",
                content: response.content,
            });
            document.getElementById("msgBlock").appendChild(msgRow);
            inputBox.value = "";
            inputBox.disabled = false;
            inputBox.focus();
        });
    }
}

let lineUniquifier = 1;

function buildMessage(contents, sender, label) {
    const row = document.createElement("div");
    row.classList.add("msgRow");
    row.classList.add(sender);
    const msg = document.createElement("div");
    msg.classList.add("msg");
    const msgLabel = document.createElement("div");
    msgLabel.classList.add("msgHeader");
    msgLabel.innerText = label;
    msg.appendChild(msgLabel);
    const msgContent = document.createElement("div");
    msgContent.classList.add("msgContent");
    if (sender === "npc") {
        const img = document.getElementById("avatar");
        img.src = getImageForMessage(contents);
        contents = stripMoodFromMessage(contents);
    }
    msgContent.innerText = contents;
    msg.appendChild(msgContent);
    row.appendChild(msg);
    return row;
}
