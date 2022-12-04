import React, { useState } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [content, setContent] = useState({});

  const fetchURLInfo = (e) => {
    e.preventDefault();
    const url = "http://localhost:5000/youtube";

    // Options for the fetch function to make it a POST
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ytlink: inputText }),
    };

    fetch(url, options)
      .then(response => response.json())
      .then(data => setContent(data))
  }

  console.log(content);
  console.log(inputText);

  return (
    <div>
      <form>
        <input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          type="text" name="ytlink" required placeholder="YouTube URL"
        />
        <button onClick={(e) => fetchURLInfo(e)}>Download</button>
      </form>
      {content ? <p>{content["title"]}</p> : <p></p>}
    </div>
  );
}

export default App;
