const messages =
    document.getElementById("messages");

const input =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const newChatButton =
    document.getElementById("newChat");

const chatModeButton =
    document.getElementById("chatModeButton");

const designModeButton =
    document.getElementById("designModeButton");

const modeLabel =
    document.getElementById("modeLabel");

const pageTitle =
    document.getElementById("pageTitle");


/*
    IMPORTANT:
    Replace this with your existing Render URL.

    Example:

    https://rast-ai-xxxx.onrender.com

    DO NOT add /chat.
*/

const BACKEND_URL =
    "https://rast-ai.onrender.com";


let currentMode = "chat";


function addMessage(text, type) {

    const message =
        document.createElement("div");

    message.className =
        `message ${type}`;

    message.textContent = text;

    messages.appendChild(message);

    messages.scrollTop =
        messages.scrollHeight;

    return message;
}


function showWelcome() {

    messages.innerHTML = `

        <div class="hero">

            <div class="hero-badge">
                ${
                    currentMode === "design"
                    ? "DESIGN STUDIO"
                    : "AI + DESIGN"
                }
            </div>

            <h1>
                ${
                    currentMode === "design"
                    ? "Turn ideas into<br><span>great design.</span>"
                    : "Build ideas.<br>Make them <span>stand out.</span>"
                }
            </h1>

            <p>
                ${
                    currentMode === "design"
                    ? "Create campaign concepts, brand systems, social creatives, UI directions and production-ready design briefs."
                    : "Chat, brainstorm, create campaigns, develop brands and turn ideas into production-ready concepts."
                }
            </p>


            <div class="quick-grid">

                <button
                    class="quick-card"
                    data-prompt="Create a modern Instagram post for a technology startup. Give me the complete design concept, headline, copy, layout, colors, typography and CTA."
                >
                    <strong>Instagram Post</strong>
                    <small>Social creative</small>
                </button>


                <button
                    class="quick-card"
                    data-prompt="Create a premium advertising creative for a startup. Give me the visual concept, headline, supporting copy, layout, typography, colors and CTA."
                >
                    <strong>Ad Creative</strong>
                    <small>Campaign concept</small>
                </button>


                <button
                    class="quick-card"
                    data-prompt="Create a modern brand identity concept for a new startup. Include brand personality, colors, typography, logo direction and visual language."
                >
                    <strong>Brand Identity</strong>
                    <small>Brand system</small>
                </button>


                <button
                    class="quick-card"
                    data-prompt="Create a clean modern landing page UI concept for a technology startup. Describe the layout, sections, typography, colors and user experience."
                >
                    <strong>UI Concept</strong>
                    <small>Product design</small>
                </button>

            </div>

        </div>

    `;


    attachQuickButtons();

}


function setMode(mode) {

    currentMode = mode;

    if (mode === "design") {

        designModeButton.classList.add("active");

        chatModeButton.classList.remove("active");

        modeLabel.textContent =
            "DESIGN STUDIO";

        pageTitle.textContent =
            "Design Studio";

        document.body.classList.add(
            "design-mode"
        );

        input.placeholder =
            "Describe the design you want...";

    } else {

        chatModeButton.classList.add("active");

        designModeButton.classList.remove("active");

        modeLabel.textContent =
            "CHAT";

        pageTitle.textContent =
            "rast.ai";

        document.body.classList.remove(
            "design-mode"
        );

        input.placeholder =
            "Ask rast.ai anything...";

    }

    showWelcome();

}


async function sendMessage(customText = null) {

    const text =
        customText ||
        input.value.trim();

    if (!text) {
        return;
    }


    const welcome =
        document.querySelector(".hero");

    if (welcome) {
        welcome.remove();
    }


    addMessage(
        text,
        "user-message"
    );


    input.value = "";

    input.style.height =
        "auto";


    const thinkingMessage =
        addMessage(
            currentMode === "design"
                ? "Creating your design concept..."
                : "Thinking...",
            "bot-message"
        );


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

                        mode: currentMode

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Something went wrong."
            );

        }


        thinkingMessage.textContent =
            data.reply;


    } catch (error) {

        console.error(error);

        thinkingMessage.textContent =
            "Sorry, something went wrong. Please try again.";

    } finally {

        sendButton.disabled = false;

        input.focus();

    }

}


function attachQuickButtons() {

    document
        .querySelectorAll(
            "[data-prompt]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    sendMessage(
                        button.dataset.prompt
                    );

                }
            );

        });

}


/* SEND */

sendButton.addEventListener(
    "click",
    () => sendMessage()
);


/* ENTER */

input.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* AUTO GROW */

input.addEventListener(
    "input",
    function() {

        this.style.height =
            "auto";

        this.style.height =
            Math.min(
                this.scrollHeight,
                140
            ) + "px";

    }
);


/* NEW CHAT */

newChatButton.addEventListener(
    "click",
    function() {

        showWelcome();

        input.value = "";

        input.focus();

    }
);


/* MODES */

chatModeButton.addEventListener(
    "click",
    () => setMode("chat")
);


designModeButton.addEventListener(
    "click",
    () => setMode("design")
);


/* INITIALIZE */

attachQuickButtons();
