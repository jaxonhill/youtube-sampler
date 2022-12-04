import React, { useState, useEffect, useRef } from "react";
import { Howl, Howler } from 'howler';

function App() {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchSampleInfo = () => {
    // Create some JSON to send to the POST request for the Flask API
    const requestData = { ytLink: inputText };
    const requestBody = JSON.stringify(requestData);

    // Fetch the JSON back from the Flask API
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

  // Every time the response gets updated (new link is converted)
  useEffect(() => {
    // If the response is not null
    if (response) {

      // If there is already a music player present
      if (player) {
        // Then set it to not playing and destroy it
        setIsPlaying(!isPlaying);
        player.unload();
      }

      // From a blank slate, create a new player object
      const currentPlayer = new Howl({
        src: response["audio_url"],
        html5: true,
      })

      // Store the player in state
      setPlayer(currentPlayer);
    }
  }, [response])

  const handlePlay = () => {
    // If the player is already playing, then pause it
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }

    // Set opposite of isPlaying because we just changed this
    setIsPlaying(!isPlaying);
  }

  console.log(response);

  return (
    <div>
      <input value={inputText} onChange={(e) => setInputText(e.target.value)} type="text" />
      <button onClick={fetchSampleInfo}>Submit</button>
      {player && <button onClick={handlePlay}>{isPlaying ? "Pause" : "Play"}</button>}
    </div>
  );
}

export default App;
