// =========================================================
// RAST.AI V2
// =========================================================


// =========================================================
// BACKEND URL
// =========================================================

// PUT YOUR EXISTING RENDER URL HERE.
//
// Example:
// https://rast-ai-xxxx.onrender.com
//
// DO NOT add /chat
// DO NOT put your Gemini API key here.

const BACKEND_URL =
    "https://rast-ai.onrender.com";


// =========================================================
// ELEMENTS
// =========================================================

const messageInput =
    document.getElementById(
        "messageInput"
    );

const sendButton =
    document.getElementById(
        "sendButton"
    );

const chatArea =
    document.getElementById(
        "chatArea"
    );

const chatMode =
    document.getElementById(
        "chatMode"
    );

const designMode =
    document.getElementById(
        "designMode"
    );

const modeLabel =
    document.getElementById(
        "modeLabel"
    );

const newChat =
    document.getElementById(
        "newChat"
    );


// =========================================================
// STATE
// =========================================================

let currentMode = "chat";

let conversation = [];

let chats = [];


// =========================================================
// WELCOME
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
                Ask rast.ai anything,
                brainstorm an idea,
                or switch to Design Studio.
            </p>

        </div>

    `;

}


// =========================================================
// TEXT FORMATTER
// =========================================================

function formatText(text) {

    if (!text) {
        return "";
    }


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
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )

        .replace(
            /\n/g,
            "<br>"
        );

}


// =========================================================
// ADD MESSAGE
// =========================================================

function addMessage(
    text,
    sender
) {

    const message =
        document.createElement(
            "div"
        );


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


    chatArea.appendChild(
        message
    );


    chatArea.scrollTop =
        chatArea.scrollHeight;

}


// =========================================================
// LOADING
// =========================================================

function showLoading() {

    const loading =
        document.createElement(
            "div"
        );


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


    chatArea.appendChild(
        loading
    );


    chatArea.scrollTop =
        chatArea.scrollHeight;

}


// =========================================================
// REMOVE LOADING
// =========================================================

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
// SEND MESSAGE
// =========================================================

async function sendMessage(
    customText = null
) {


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


    // Show user message

    addMessage(
        text,
        "user"
    );


    // Save user message

    conversation.push({

        role: "user",

        text: text

    });


    // Clear input

    messageInput.value =
        "";

    messageInput.style.height =
        "auto";


    // Loading

    showLoading();


    sendButton.disabled =
        true;


    try {


        const response =
            await fetch(

                `${BACKEND_URL}/chat`,

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            message:
                                text,

                            mode:
                                currentMode,

                            history:
                                conversation.slice(
                                    0,
                                    -1
                                )

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


        // Show AI response

        addMessage(
            reply,
            "ai"
        );


        // Save AI response

        conversation.push({

            role: "model",

            text: reply

        });


    }

    catch (error) {


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


    sendButton.disabled =
        false;


    messageInput.focus();

}


// =========================================================
// MODE
// =========================================================

function setMode(
    mode
) {

    currentMode =
        mode;


    if (
        mode === "chat"
    ) {


        chatMode
            .classList
            .add("active");


        designMode
            .classList
            .remove("active");


        modeLabel.textContent =
            "AI Chat";


        messageInput.placeholder =
            "Ask rast.ai anything...";


    }


    if (
        mode === "design"
    ) {


        designMode
            .classList
            .add("active");


        chatMode
            .classList
            .remove("active");


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

    () => {

        setMode(
            "chat"
        );

    }

);


designMode.addEventListener(

    "click",

    () => {

        setMode(
            "design"
        );

    }

);


// =========================================================
// SEND
// =========================================================

sendButton.addEventListener(

    "click",

    () => {

        sendMessage();

    }

);


// =========================================================
// ENTER
// =========================================================

messageInput.addEventListener(

    "keydown",

    event => {


        if (

            event.key ===
                "Enter" &&

            !event.shiftKey

        ) {


            event.preventDefault();


            sendMessage();

        }

    }

);


// =========================================================
// AUTO RESIZE
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


        conversation =
            [];


        chatArea.innerHTML =
            "";


        messageInput.value =
            "";


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


                sendMessage(
                    prompt
                );

            }

        );

    }

);


// =========================================================
// START
// =========================================================

showWelcome();

setMode(
    "chat"
);

messageInput.focus();
