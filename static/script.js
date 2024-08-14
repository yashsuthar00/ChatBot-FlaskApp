        const conversation = document.getElementById("conversation");
        const userInput = document.getElementById("user-input");
        const sendButton = document.getElementById("send-button");

        sendButton.addEventListener("click", sendMessage);
        userInput.addEventListener("keypress", event => {
            if (event.key === "Enter") {
                sendMessage();
            }
        });
        function sendMessage() {
            const userMessage = userInput.value.trim();
            if (userMessage === "") return; // Prevent sending empty messages

            appendUserMessage(userMessage);

            fetch("/get_response", {
                method: "POST",
                body: JSON.stringify({ user_input: userMessage }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => appendBotMessage(data.bot_response))
            .catch(error => appendBotMessage(error.message));

            userInput.value = "";
        }

        function appendUserMessage(message) {
            const messageDiv = document.createElement("div");
            messageDiv.className = "user";
            messageDiv.textContent = message;
            conversation.appendChild(messageDiv);
            conversation.scrollTop = conversation.scrollHeight;
        }

        function appendBotMessage(message) {
            const messageDiv = document.createElement("div");
            messageDiv.className = "bot";
            messageDiv.textContent = message;
            conversation.appendChild(messageDiv);
            conversation.scrollTop = conversation.scrollHeight;
        }
