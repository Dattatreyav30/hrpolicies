const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", async () => {
  const message = chatInput.value.trim();
  if (message !== "") {
    appendMessage("You", message);

    const otherInput = `Our Employee Code of Conduct company policy outlines our expectations regarding employees behaviour towards their colleagues, supervisors and overall organization. We promote freedom of expression and open communication. But we expect all employees to follow our code of conduct. They should avoid offending, participating in serious disputes and disrupting our workplace. We also expect them to foster a well-organized, respectful and collaborative environment , our company name is aspire, answer based on the above information to this question  : ${message}`;

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otherInput: otherInput }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      appendMessage("bot", data.message.content);
    } catch (error) {
      console.error("Error sending POST request:", error);
    }
    chatInput.value = "";
  }
});

function appendMessage(sender, text) {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
