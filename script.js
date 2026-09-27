/* =========================================
   RAST.AI FRONTEND
   ========================================= */

// Paste your actual Gemini API Key inside quotes below
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

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


let currentMode =
    "chat";


/* =========================================
   ADD MESSAGE
   ========================================= */

function addMessage(
    text,
    type
) {

    const message =
        document.createElement("div");

    message.className =
        `message ${type}`;

    message.textContent =
        text;

    messages.appendChild(
        message
    );

    messages.scrollTop =
        messages.scrollHeight;

    return message;

}


/* =========================================
   HERO
   ========================================= */

function showWelcome() {

    messages.innerHTML = `

        <div class="hero">

            <div class="hero-image"></div>

            <div class="hero-overlay"></div>

            <div class="hero-content">

                <div class="hero-pill">

                    <span class="pill-dot"></span>

                    ${
                        currentMode === "design"
                        ? "DESIGN STUDIO"
                        : "AI + DESIGN"
                    }

                </div>


                <h1>

                    ${
                        currentMode === "design"

                        ? `Turn ideas into<br>
                           <span>something visual.</span>`

                        : `Turn ideas into<br>
                           <span>something remarkable.</span>`
                    }

                </h1>


                <p>

                    ${
                        currentMode === "design"

                        ? `Create campaign concepts,
                           brand systems, social creatives,
                           UI directions and production-ready
                           design briefs.`

                        : `Chat, brainstorm, create campaigns,
                           build brands and transform ideas
                           into clear, creative concepts.`
                    }

                </p>


                <div class="quick-actions">


                    <button
                        class="quick-card"
                        data-prompt="Create a premium vertical marketing creative layout excluding human images. Focus on typography, graphic hierarchy, layout, color palette, and compelling copy."
                    >

                        <div class="quick-icon">
                            ↗
                        </div>

                        <div>

                            <strong>
                                Creative Design
                            </strong>

                            <small>
                                Layout & Direction
                            </small>

                        </div>

                    </button>



                    <button
                        class="quick-card"
                        data-prompt="Create a high-end advertising creative concept. Give me the complete visual concept, headline, supporting copy, layout, colors, typography and CTA."
                    >

                        <div class="quick-icon">
                            ◉
                        </div>

                        <div>

                            <strong>
                                Ad Creative
                            </strong>

                            <small>
                                Campaign concept
                            </small>

                        </div>

                    </button>



                    <button
                        class="quick-card"
                        data-prompt="Create a complete modern brand identity direction for a startup. Include brand personality, logo direction, colors, typography, imagery and visual language."
                    >

                        <div class="quick-icon">
                            ◆
                        </div>

                        <div>

                            <strong>
                                Branding
                            </strong>

                            <small>
                                Identity direction
                            </small>

                        </div>

                    </button>



                    <button
                        class="quick-card"
                        data-prompt="Create a premium landing page UI concept for an AI startup. Describe the sections, hierarchy, typography, colors, components and user experience."
                    >

                        <div class="quick-icon">
                            □
                        </div>

                        <div>

                            <strong>
                                UI / UX
                            </strong>

                            <small>
                                Product design
                            </small>

                        </div>

                    </button>


                </div>

            </div>

        </div>

    `;


    attachQuickButtons();

}


/* =========================================
   MODE
   ========================================= */

function setMode(
    mode
) {

    currentMode =
        mode;


    if (
        mode === "design"
    ) {

        designModeButton
            .classList
            .add("active");

        chatModeButton
            .classList
            .remove("active");

        modeLabel.textContent =
            "DESIGN STUDIO";

        pageTitle.textContent =
            "Design Studio";

        input.placeholder =
            "Describe the design you want...";

        document.body
            .classList
            .add("design-mode");


    } else {

        chatModeButton
            .classList
            .add("active");

        designModeButton
            .classList
            .remove("active");

        modeLabel.textContent =
            "CHAT";

        pageTitle.textContent =
            "rast.ai";

        input.placeholder =
            "Ask rast.ai anything...";

        document.body
            .classList
            .remove("design-mode");

    }


    showWelcome();

}


/* =========================================
   SEND MESSAGE (DIRECT GEMINI API INTEGRATION)
   ========================================= */

async function sendMessage(
    customText = null
) {

    const text =
        customText ||
        input.value.trim();


    if (!text) {

        return;

    }


    const hero =
        document.querySelector(".hero");


    if (hero) {

        hero.remove();

    }


    addMessage(
        text,
        "user-message"
    );


    input.value =
        "";

    input.style.height =
        "auto";


    const thinking =
        addMessage(
            currentMode === "design"
                ? "Creating your design concept..."
                : "Thinking...",
            "bot-message"
        );


    sendButton.disabled =
        true;


    try {

        // System instruction context based on mode selection
        const systemPrompt = currentMode === "design"
            ? "You are rast.ai Design Studio, an expert graphic designer and brand strategist. Generate high-quality visual concepts, vertical graphic layouts, color palettes, typography specs, and creative briefs. Avoid including real-life people in design descriptions unless explicitly requested."
            : "You are rast.ai, an AI & Design Assistant. Provide concise, helpful, and creative responses.";

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: `${systemPrompt}\n\nUser request: ${text}` }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || "Gemini API request failed."
            );
        }

        const reply = data.candidates[0].content.parts[0].text;
        thinking.textContent = reply;

    } catch (error) {

        console.error(
            "rast.ai error:",
            error
        );

        thinking.textContent =
            "Sorry, something went wrong. Please check your API key and try again.";

    } finally {

        sendButton.disabled =
            false;

        input.focus();

    }

}


/* =========================================
   QUICK ACTIONS
   ========================================= */

function attachQuickButtons() {

    document
        .querySelectorAll(
            "[data-prompt]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        sendMessage(
                            button.dataset.prompt
                        );

                    }
                );

            }
        );

}


/* =========================================
   SEND BUTTON
   ========================================= */

sendButton.addEventListener(
    "click",
    () => {

        sendMessage();

    }
);


/* =========================================
   ENTER TO SEND
   ========================================= */

input.addEventListener(
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


/* =========================================
   TEXTAREA AUTO-GROW
   ========================================= */

input.addEventListener(
    "input",
    function() {

        this.style.height =
            "auto";

        this.style.height =
            Math.min(
                this.scrollHeight,
                130
            ) + "px";

    }
);


/* =========================================
   NEW CHAT
   ========================================= */

newChatButton.addEventListener(
    "click",
    () => {

        showWelcome();

        input.value =
            "";

        input.style.height =
            "auto";

        input.focus();

    }
);


/* =========================================
   MODE BUTTONS
   ========================================= */

chatModeButton.addEventListener(
    "click",
    () => {

        setMode("chat");

    }
);


designModeButton.addEventListener(
    "click",
    () => {

        setMode("design");

    }
);


/* =========================================
   START
   ========================================= */

showWelcome();
