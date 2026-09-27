// ==========================================
// RAST.AI FRONTEND
// ==========================================


// 🔴 IMPORTANT:
// Replace this with your ACTUAL Render backend URL.
//
// Example:
// https://rast-ai-xxxx.onrender.com
//
// DO NOT add /chat at the end.
// DO NOT put your Gemini API key here.

const BACKEND_URL =
    "YOUR_EXISTING_RENDER_URL_HERE";


// ==========================================
// ELEMENTS
// ==========================================

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatArea = document.getElementById("chatArea");

const chatMode = document.getElementById("chatMode");
const designMode = document.getElementById("designMode");

const modeLabel = document.getElementById("modeLabel");
const newChat = document.getElementById("newChat");


// ==========================================
// STATE
// ==========================================

let currentMode = "chat";


// ==========================================
// WELCOME SCREEN
// ==========================================

function showWelcome() {

    chatArea.innerHTML = `
        <div class="welcome-message">

            <div class="welcome-icon">
                ✦
            </div>

            <h2>
                What are we creating today?
            </h2>

            <p>
                Ask me anything, brainstorm an idea,
                or start building your next creative project.
            </p>

        </div>
    `;
}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className =
        sender === "user"
            ? "message user-message"
            : "message ai-message";


    const label =
        sender === "user"
            ? "You"
            : "rast.ai";


    message.innerHTML = `
        <div class="message-label">
            ${label}
        </div>

        <div class="message-content">
            ${formatText(text)}
        </div>
    `;


    chatArea.appendChild(message);

    chatArea.scrollTop = chatArea.scrollHeight;
}


// ==========================================
// BASIC TEXT FORMATTER
// ==========================================

function formatText(text) {

    if (!text) return "";

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
}


// ==========================================
// LOADING MESSAGE
// ==========================================

function showLoading() {

    const loading = document.createElement("div");

    loading.className = "message ai-message";
    loading.id = "loadingMessage";

    loading.innerHTML = `
        <div class="message-label">
            rast.ai
        </div>

        <div class="message-content loading">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    chatArea.appendChild(loading);

    chatArea.scrollTop = chatArea.scrollHeight;
}


// ==========================================
// REMOVE LOADING
// ==========================================

function removeLoading() {

    const loading =
        document.getElementById("loadingMessage");

    if (loading) {
        loading.remove();
    }
}


// ==========================================
// SEND MESSAGE
// ==========================================

async function sendMessage(customText = null) {

    const text =
        customText !== null
            ? customText.trim()
            : messageInput.value.trim();


    if (!text) return;


    // Make sure the welcome screen disappears
    const welcome =
        document.querySelector(".welcome-message");

    if (welcome) {
        welcome.remove();
    }


    // Show user's message
    addMessage(text, "user");


    // Clear input
    messageInput.value = "";

    messageInput.style.height = "auto";


    // Show loading
    showLoading();


    // Disable button
    sendButton.disabled = true;


    try {

        const response = await fetch(
            `${BACKEND_URL}/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    message: text,

                    mode: currentMode

                })
            }
        );


        const data = await response.json();


        removeLoading();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "The server returned an error."
            );

        }


        if (data.reply) {

            addMessage(
                data.reply,
                "ai"
            );

        } else {

            addMessage(
                "I didn't receive a response from the AI.",
                "ai"
            );

        }


    } catch (error) {

        console.error(
            "rast.ai error:",
            error
        );


        removeLoading();


        addMessage(
            "Sorry, something went wrong. Please try again.",
            "ai"
        );

    }


    sendButton.disabled = false;

    messageInput.focus();
}


// ==========================================
// CHAT MODE
// ==========================================

function setMode(mode) {

    currentMode = mode;


    if (mode === "chat") {

        chatMode.classList.add("active");
        designMode.classList.remove("active");

        modeLabel.textContent = "AI Chat";

        messageInput.placeholder =
            "Ask rast.ai anything...";

    }


    if (mode === "design") {

        designMode.classList.add("active");
        chatMode.classList.remove("active");

        modeLabel.textContent =
            "Design Studio";

        messageInput.placeholder =
            "Describe what you want to design...";

    }

}


// ==========================================
// MODE BUTTONS
// ==========================================

chatMode.addEventListener(
    "click",
    () => {

        setMode("chat");

    }
);


designMode.addEventListener(
    "click",
    () => {

        setMode("design");

    }
);


// ==========================================
// SEND BUTTON
// ==========================================

sendButton.addEventListener(
    "click",
    () => {

        sendMessage();

    }
);


// ==========================================
// ENTER TO SEND
// ==========================================

messageInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ==========================================
// AUTO-GROW TEXTAREA
// ==========================================

messageInput.addEventListener(
    "input",
    () => {

        messageInput.style.height =
            "auto";

        messageInput.style.height =
            Math.min(
                messageInput.scrollHeight,
                160
            ) + "px";

    }
);


// ==========================================
// NEW CHAT
// ==========================================

newChat.addEventListener(
    "click",
    () => {

        chatArea.innerHTML = "";

        messageInput.value = "";

        messageInput.style.height =
            "auto";

        showWelcome();

        messageInput.focus();

    }
);


// ==========================================
// QUICK ACTIONS
// ==========================================

const quickButtons =
    document.querySelectorAll(
        "[data-prompt]"
    );


quickButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const prompt =
                    button.getAttribute(
                        "data-prompt"
                    );

                sendMessage(prompt);

            }
        );

    }
);


// ==========================================
// INITIALIZE
// ==========================================

showWelcome();

setMode("chat");

messageInput.focus();
