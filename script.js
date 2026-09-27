const messages =
    document.getElementById("messages");

const input =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const newChatButton =
    document.getElementById("newChat");


const BACKEND_URL =
    "YOUR_RENDER_URL_HERE";


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


async function sendMessage() {

    const text =
        input.value.trim();

    if (!text) {
        return;
    }

    const welcome =
        document.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }

    addMessage(
        text,
        "user-message"
    );

    input.value = "";

    const thinkingMessage =
        addMessage(
            "Thinking...",
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
                        message: text
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

        thinkingMessage.textContent =
            "Sorry, something went wrong.";

        console.error(error);

    } finally {

        sendButton.disabled = false;

        input.focus();

    }

}


sendButton.addEventListener(
    "click",
    sendMessage
);


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


newChatButton.addEventListener(
    "click",
    function() {

        messages.innerHTML = `

            <div class="welcome">

                <h1>
                    How can I help?
                </h1>

                <p>
                    Ask me anything.
                </p>

            </div>

        `;

    }
);
