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
        const requestData = {
            messages: messages,
            person: null,
        };
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
    msgContent.innerText = contents;
    msg.appendChild(msgContent);
    row.appendChild(msg);
    return row;
}
