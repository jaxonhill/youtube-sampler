import React, { useState, useEffect } from "react";
import { Howl, Howler } from 'howler';

function App() {
  const [inputText, setInputText] = useState("");
  const [content, setContent] = useState();
  const [player, setPlayer] = useState();
  const [error, setError] = useState("");

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
      .then(data => handleContent(data))
  }

  // Create a new music object everytime the content changes
  useEffect(() => {
    if (content) {
      let sample = new Howl({
        src: [content["audio_url"]],
        ext: [".m4a"],
        autoplay: true,
        html5: true,
      })
      setPlayer(sample);
    }
  }, [content])

  const handleContent = (data) => {
    // If the data that we get back is just an error, then set the error not content
    if (data["error"]) {
      console.log("Error!")
      setError(data["error"]);
    } else {
      let audio_encoded = atob(data["audio_url_base64"]);
      console.log("Got here!")
      setContent(data);
    }
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
      {content ? <p>{content["title"]}</p> : null}
      {player ? <button onClick={Howler.play}>Play</button> : null}
    </div>
  );
}

export default App;
