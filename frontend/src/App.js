import React, { useState, useEffect, useRef } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState(null);

  const inputRef = useRef();

  const fetchSampleInfo = () => {
    console.log(JSON.stringify({ ytLink: inputText }));

    const requestData = { ytLink: inputText };
    const requestBody = JSON.stringify(requestData);

    //   // Fetch the JSON from the Flask API
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    })
      .then((res) => res.json())
      .then((json) => setResponse(json));
  };

  console.log(inputText);
  console.log(response);

  return (
    <div>
      <input ref={inputRef} value={inputText} onChange={(e) => setInputText(e.target.value)} type="text" />
      <button onClick={fetchSampleInfo}>Submit</button>
      {response && <audio src={response["audio_url"]} controls></audio>}
    </div>
  );
}

export default App;
