/* =========================================
   RAST.AI FRONTEND
   ========================================= */


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
==================================================
IMPORTANT

PUT YOUR EXISTING RENDER URL HERE.

Example:

https://rast-ai-xxxx.onrender.com

DO NOT ADD /chat
DO NOT PUT YOUR GEMINI API KEY HERE
==================================================
*/


const BACKEND_URL =
    "YOUR_EXISTING_RENDER_URL_HERE";


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
                        data-prompt="Create a premium Instagram post concept for a modern technology startup. Give me the headline, copy, layout, visual direction, colors, typography and CTA."
                    >

                        <div class="quick-icon">
                            ↗
                        </div>

                        <div>

                            <strong>
                                Instagram
                            </strong>

                            <small>
                                Social creative
                            </small>

                        </div>

                    </button>



                    <button
                        class="quick-card"
                        data-prompt="Create a high-end advertising creative for a startup. Give me the complete visual concept, headline, supporting copy, layout, colors, typography and CTA."
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
   SEND MESSAGE
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


        const response =
            await fetch(
                `${BACKEND_URL}/chat`,
                {

                    method:
                        "POST",

                    headers:
                        {
                            "Content-Type":
                                "application/json"
                        },

                    body:
                        JSON.stringify({

                            message:
                                text,

                            mode:
                                currentMode

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


        thinking.textContent =
            data.reply;


    } catch (error) {

        console.error(
            "rast.ai error:",
            error
        );


        thinking.textContent =
            "Sorry, something went wrong. Please try again.";

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
