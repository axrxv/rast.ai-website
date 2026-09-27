// =========================================================
// RAST.AI — MAIN JAVASCRIPT
// =========================================================

// IMPORTANT:
// Put your EXISTING Render backend URL here.
// Do NOT add /chat or /generate-image.
// Do NOT put your Gemini or Hugging Face API key here.

const BACKEND_URL =
    "https://rast-ai.onrender.com";


// =========================================================
// ELEMENTS
// =========================================================

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const chatArea =
    document.getElementById("chatArea");

const chatMode =
    document.getElementById("chatMode");

const designMode =
    document.getElementById("designMode");

const modeLabel =
    document.getElementById("modeLabel");

const newChat =
    document.getElementById("newChat");


// Image generator elements
const imagePrompt =
    document.getElementById("imagePrompt");

const generateImageButton =
    document.getElementById("generateImageButton");


// =========================================================
// STATE
// =========================================================

let currentMode = "chat";

let conversation = [];


// =========================================================
// WELCOME MESSAGE
// =========================================================

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
                Ask rast.ai anything, brainstorm an idea,
                or switch to Design Studio.
            </p>

        </div>
    `;
}


// =========================================================
// FORMAT AI TEXT
// =========================================================

function formatText(text) {

    if (!text) {
        return "";
    }

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )
        .replace(/\n/g, "<br>");
}


// =========================================================
// ADD CHAT MESSAGE
// =========================================================

function addMessage(text, sender) {

    const message =
        document.createElement("div");

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

    chatArea.scrollTop =
        chatArea.scrollHeight;
}


// =========================================================
// LOADING ANIMATION
// =========================================================

function showLoading() {

    const loading =
        document.createElement("div");

    loading.id =
        "loadingMessage";

    loading.className =
        "message ai-message";


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

    chatArea.scrollTop =
        chatArea.scrollHeight;
}


function removeLoading() {

    const loading =
        document.getElementById(
            "loadingMessage"
        );

    if (loading) {
        loading.remove();
    }
}


// =========================================================
// SEND CHAT MESSAGE
// =========================================================

async function sendMessage(customText = null) {

    const text =
        customText !== null
            ? customText.trim()
            : messageInput.value.trim();


    if (!text) {
        return;
    }


    const welcome =
        document.querySelector(
            ".welcome-message"
        );


    if (welcome) {
        welcome.remove();
    }


    addMessage(
        text,
        "user"
    );


    conversation.push({
        role: "user",
        text: text
    });


    messageInput.value = "";

    messageInput.style.height =
        "auto";


    showLoading();

    sendButton.disabled = true;


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/chat`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        message: text,

                        mode: currentMode,

                        history:
                            conversation.slice(0, -1)

                    })
                }
            );


        const data =
            await response.json();


        removeLoading();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Server error."
            );
        }


        const reply =
            data.reply ||
            "I didn't receive a response.";


        addMessage(
            reply,
            "ai"
        );


        conversation.push({
            role: "model",
            text: reply
        });


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


// =========================================================
// SWITCH MODES
// =========================================================

function setMode(mode) {

    currentMode =
        mode;


    if (mode === "chat") {

        chatMode.classList.add(
            "active"
        );

        designMode.classList.remove(
            "active"
        );


        modeLabel.textContent =
            "AI Chat";


        messageInput.placeholder =
            "Ask rast.ai anything...";
    }


    if (mode === "design") {

        designMode.classList.add(
            "active"
        );

        chatMode.classList.remove(
            "active"
        );


        modeLabel.textContent =
            "Design Studio";


        messageInput.placeholder =
            "Describe what you want to design...";
    }
}


// =========================================================
// MODE BUTTONS
// =========================================================

chatMode.addEventListener(
    "click",
    () => setMode("chat")
);


designMode.addEventListener(
    "click",
    () => setMode("design")
);


// =========================================================
// SEND BUTTON
// =========================================================

sendButton.addEventListener(
    "click",
    () => sendMessage()
);


// =========================================================
// ENTER TO SEND
// =========================================================

messageInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }
    }
);


// =========================================================
// AUTO-RESIZE TEXTAREA
// =========================================================

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


// =========================================================
// NEW CHAT
// =========================================================

newChat.addEventListener(
    "click",
    () => {

        conversation = [];

        chatArea.innerHTML = "";

        messageInput.value = "";

        showWelcome();

        messageInput.focus();
    }
);


// =========================================================
// QUICK ACTIONS
// =========================================================

const quickButtons =
    document.querySelectorAll(
        "[data-prompt]"
    );


quickButtons.forEach(
    button => {

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


// =========================================================
// IMAGE GENERATION
// =========================================================

async function generateImage(prompt) {

    if (!prompt || !prompt.trim()) {

        return;
    }


    const imagePromptText =
        prompt.trim();


    const welcome =
        document.querySelector(
            ".welcome-message"
        );


    if (welcome) {
        welcome.remove();
    }


    addMessage(
        `Creating your image...`,
        "ai"
    );


    if (generateImageButton) {

        generateImageButton.disabled =
            true;

        generateImageButton.textContent =
            "Generating...";
    }


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/generate-image`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        prompt:
                            imagePromptText
                    })
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Image generation failed."
            );
        }


        // =============================================
        // CREATE IMAGE MESSAGE
        // =============================================

        const imageMessage =
            document.createElement("div");


        imageMessage.className =
            "message ai-message";


        imageMessage.innerHTML = `

            <div class="message-label">
                rast.ai
            </div>

            <div class="message-content">

                <p>
                    Here's your generated image:
                </p>

                <img
                    src="data:image/png;base64,${data.image}"
                    alt="AI generated image"
                    class="generated-image"
                />

                <div class="image-actions">

                    <a
                        href="data:image/png;base64,${data.image}"
                        download="rast-ai-generated.png"
                        class="image-download"
                    >
                        Download Image
                    </a>

                </div>

            </div>
        `;


        chatArea.appendChild(
            imageMessage
        );


        chatArea.scrollTop =
            chatArea.scrollHeight;


    } catch (error) {

        console.error(
            "Image generation error:",
            error
        );


        addMessage(
            "I couldn't generate that image. Please try again.",
            "ai"
        );
    }


    if (generateImageButton) {

        generateImageButton.disabled =
            false;

        generateImageButton.textContent =
            "✦ Generate Image";
    }
}


// =========================================================
// IMAGE GENERATOR BUTTON
// =========================================================

if (
    imagePrompt &&
    generateImageButton
) {

    generateImageButton.addEventListener(
        "click",
        () => {

            const prompt =
                imagePrompt.value.trim();


            if (!prompt) {

                imagePrompt.focus();

                return;
            }


            generateImage(prompt);
        }
    );
}


// =========================================================
// IMAGE PROMPT — CTRL/CMD + ENTER
// =========================================================

if (imagePrompt) {

    imagePrompt.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                (event.ctrlKey ||
                 event.metaKey)
            ) {

                event.preventDefault();

                generateImage(
                    imagePrompt.value
                );
            }
        }
    );
}


// =========================================================
// STARTUP
// =========================================================

showWelcome();

setMode("chat");

messageInput.focus();
