import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendToAI = async () => {
    if (!text.trim()) {
      setResponse("Please enter input");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8081/api/ai/describe", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
      });

      const data = await res.text();
      setResponse(data);
    } catch (err) {
      setResponse("Error connecting to AI service");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>AI ESG Assistant</h2>

      <textarea
        rows="4"
        cols="50"
        placeholder="Enter your text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <button onClick={sendToAI}>
        {loading ? "Loading..." : "Send to AI"}
      </button>

      <h3>Response:</h3>
      <p>{response}</p>
    </div>
  );
}

export default App;