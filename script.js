// ============================================================
// rast.ai — FRONTEND JAVASCRIPT
// ============================================================


// ------------------------------------------------------------
// BACKEND
// ------------------------------------------------------------

// Put your EXISTING Render backend URL here.
// Example:
// const BACKEND_URL = "https://rast-ai-xxxx.onrender.com";

const BACKEND_URL = "https://rast-ai.onrender.com";


// ------------------------------------------------------------
// GLOBAL STATE
// ------------------------------------------------------------

let chatHistory = [];

let currentMode = "chat";


// ------------------------------------------------------------
// DOM ELEMENTS
// ------------------------------------------------------------

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const chatArea =
    document.getElementById("chatArea");

const imagePrompt =
    document.getElementById("imagePrompt");

const generateImageButton =
    document.getElementById("generateImageButton");

const imageGenerator =
    document.getElementById("imageGenerator");

const heroSection =
    document.getElementById("heroSection");

const chatModeButton =
    document.getElementById("chatModeButton");

const designModeButton =
    document.getElementById("designModeButton");

const imageToolButton =
    document.getElementById("imageToolButton");

const ideasToolButton =
    document.getElementById("ideasToolButton");

const pageTitle =
    document.getElementById("pageTitle");


// ------------------------------------------------------------
// INITIAL SETUP
// ------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    setupEventListeners();

    setupQuickActions();

    autoResizeTextarea();

});


// ------------------------------------------------------------
// EVENT LISTENERS
// ------------------------------------------------------------

function setupEventListeners() {

    // Send button
    if (sendButton) {
        sendButton.addEventListener("click", sendMessage);
    }


    // Enter = send
    if (messageInput) {

        messageInput.addEventListener("keydown", (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        });

    }


    // Auto resize chat textarea
    if (messageInput) {

        messageInput.addEventListener(
            "input",
            autoResizeTextarea
        );

    }


    // Generate image
    if (generateImageButton) {

        generateImageButton.addEventListener(
            "click",
            generateImage
        );

    }


    // Chat mode
    if (chatModeButton) {

        chatModeButton.addEventListener(
            "click",
            () => setMode("chat")
        );

    }


    // Design mode
    if (designModeButton) {

        designModeButton.addEventListener(
            "click",
            () => setMode("design")
        );

    }


    // Image tool
    if (imageToolButton) {

        imageToolButton.addEventListener(
            "click",
            () => {

                setMode("design");

                if (imageGenerator) {

                    imageGenerator.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }


    // Ideas tool
    if (ideasToolButton) {

        ideasToolButton.addEventListener(
            "click",
            () => {

                setMode("chat");

                if (messageInput) {

                    messageInput.value =
                        "Give me 10 creative marketing ideas for a modern startup.";

                    messageInput.focus();

                    autoResizeTextarea();

                }

            }
        );

    }

}


// ------------------------------------------------------------
// MODE SWITCHING
// ------------------------------------------------------------

function setMode(mode) {

    currentMode = mode;


    // Remove active states
    if (chatModeButton) {

        chatModeButton.classList.remove("active");

    }

    if (designModeButton) {

        designModeButton.classList.remove("active");

    }


    // Chat mode
    if (mode === "chat") {

        if (chatModeButton) {

            chatModeButton.classList.add("active");

        }

        if (pageTitle) {

            pageTitle.textContent = "AI Chat";

        }

    }


    // Design mode
    if (mode === "design") {

        if (designModeButton) {

            designModeButton.classList.add("active");

        }

        if (pageTitle) {

            pageTitle.textContent =
                "Design Studio";

        }

    }

}


// ------------------------------------------------------------
// QUICK ACTIONS
// ------------------------------------------------------------

function setupQuickActions() {

    const quickCards =
        document.querySelectorAll(".quick-card");


    quickCards.forEach((card) => {

        card.addEventListener("click", () => {

            const action =
                card.dataset.action;

            handleQuickAction(action);

        });

    });

}


function handleQuickAction(action) {

    const prompts = {

        campaign:
            "Create a creative marketing campaign idea for a modern startup. Include the campaign concept, target audience, content ideas and a catchy tagline.",

        social:
            "Give me 10 creative social media content ideas for a modern startup. Make them engaging, original and suitable for Instagram.",

        copy:
            "Write 5 powerful marketing headlines and short promotional copy for a modern AI and design startup.",

        ideas:
            "Give me 10 unusual and creative ideas that could help an AI and design startup stand out."
    };


    const prompt =
        prompts[action] ||
        "Give me a creative idea.";


    if (messageInput) {

        messageInput.value = prompt;

        autoResizeTextarea();

        messageInput.focus();

    }

}


// ------------------------------------------------------------
// SEND CHAT MESSAGE
// ------------------------------------------------------------

async function sendMessage() {

    if (!messageInput) return;


    const message =
        messageInput.value.trim();


    if (!message) return;


    // Clear input
    messageInput.value = "";

    autoResizeTextarea();


    // Add user message
    addMessage(
        message,
        "user"
    );


    // Add to history
    chatHistory.push({
        role: "user",
        content: message
    });


    // Loading message
    const loadingId =
        addLoadingMessage();


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

                        message: message,

                        history: chatHistory,

                        mode: currentMode

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        removeLoadingMessage(
            loadingId
        );


        const reply =
            data.reply ||
            data.response ||
            data.message ||
            "I couldn't generate a response.";


        addMessage(
            reply,
            "assistant"
        );


        chatHistory.push({

            role: "assistant",

            content: reply

        });


    } catch (error) {

        console.error(
            "Chat error:",
            error
        );


        removeLoadingMessage(
            loadingId
        );


        addMessage(
            "Sorry — I couldn't connect to the AI right now. Please check the backend connection.",
            "assistant"
        );

    }

}


// ------------------------------------------------------------
// ADD MESSAGE
// ------------------------------------------------------------

function addMessage(
    text,
    sender
) {

    if (!chatArea) return;


    const messageElement =
        document.createElement("div");


    messageElement.className =
        `message ${sender}`;


    const bubble =
        document.createElement("div");


    bubble.className =
        "message-bubble";


    // Convert basic line breaks
    bubble.innerHTML =
        formatText(text);


    messageElement.appendChild(
        bubble
    );


    chatArea.appendChild(
        messageElement
    );


    scrollChatToBottom();

}


// ------------------------------------------------------------
// FORMAT TEXT
// ------------------------------------------------------------

function formatText(text) {

    if (!text) return "";


    return text
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /\n/g,
            "<br>"
        );

}


// ------------------------------------------------------------
// LOADING MESSAGE
// ------------------------------------------------------------

function addLoadingMessage() {

    if (!chatArea) return null;


    const id =
        `loading-${Date.now()}`;


    const element =
        document.createElement("div");


    element.className =
        "message assistant";


    element.id = id;


    element.innerHTML = `

        <div class="message-bubble loading-bubble">

            <span class="loading-dot"></span>
            <span class="loading-dot"></span>
            <span class="loading-dot"></span>

        </div>

    `;


    chatArea.appendChild(
        element
    );


    scrollChatToBottom();


    return id;

}


// ------------------------------------------------------------
// REMOVE LOADING
// ------------------------------------------------------------

function removeLoadingMessage(id) {

    if (!id) return;


    const element =
        document.getElementById(id);


    if (element) {

        element.remove();

    }

}


// ------------------------------------------------------------
// IMAGE GENERATION DEMO
// ------------------------------------------------------------

async function generateImage() {

    if (!imagePrompt) return;


    const prompt =
        imagePrompt.value.trim();


    if (!prompt) {

        imagePrompt.focus();

        return;

    }


    // Disable button
    if (generateImageButton) {

        generateImageButton.disabled =
            true;

        generateImageButton.innerHTML =
            "✦ Preparing preview...";

    }


    // Show user request
    addMessage(
        `Create a design: ${prompt}`,
        "user"
    );


    // Small delay to make the demo feel natural
    await new Promise(
        resolve =>
            setTimeout(
                resolve,
                1200
            )
    );


    // Add preview
    addGeneratedImage();


    // Re-enable button
    if (generateImageButton) {

        generateImageButton.disabled =
            false;

        generateImageButton.innerHTML =
            "✦ Generate Image";

    }

}


// ------------------------------------------------------------
// ADD GENERATED IMAGE PREVIEW
// ------------------------------------------------------------

function addGeneratedImage() {

    if (!chatArea) return;


    const element =
        document.createElement("div");


    element.className =
        "message assistant";


    element.innerHTML = `

        <div class="message-bubble image-result">

            <div class="image-result-title">
                ✦ Design Preview
            </div>

            <img
                src="Gemini_Generated_Image_9pr0ap9pr0ap9pr0.png"
                alt="rast.ai design preview"
                class="generated-image"
            >

            <p class="image-result-note">
                Demo preview — live image generation
                is being integrated.
            </p>

            <a
                href="Gemini_Generated_Image_9pr0ap9pr0ap9pr0.png"
                download="rast-ai-demo-image.png"
                class="image-download"
            >
                Download Preview
            </a>

        </div>

    `;


    chatArea.appendChild(
        element
    );


    scrollChatToBottom();

}


// ------------------------------------------------------------
// AUTO RESIZE TEXTAREA
// ------------------------------------------------------------

function autoResizeTextarea() {

    if (!messageInput) return;


    messageInput.style.height =
        "auto";


    messageInput.style.height =
        `${Math.min(
            messageInput.scrollHeight,
            180
        )}px`;

}


// ------------------------------------------------------------
// SCROLL CHAT
// ------------------------------------------------------------

function scrollChatToBottom() {

    if (!chatArea) return;


    setTimeout(() => {

        chatArea.scrollTo({

            top:
                chatArea.scrollHeight,

            behavior:
                "smooth"

        });

    }, 50);

}
