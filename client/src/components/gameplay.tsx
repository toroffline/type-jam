import { useEffect, useState } from "preact/hooks";
import socket from "../socket";

export function GamePlay() {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [startTime, setStartTime] = useState(0);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to the server");
      socket.emit("newWordRequest");
    });

    socket.on("newWord", (word) => {
      console.log({ word });
      setCurrentWord(word);
      setFeedback("");
      setStartTime(Date.now());
    });

    socket.on("wordCompleted", (data) => {
      setFeedback(`Typed in ${data.time} seconds. WPM: ${data.wpm}`);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInput = (event: Event) => {
    const typedWord = (event.target as HTMLInputElement).value;
    if (typedWord === currentWord) {
      const endTime = Date.now();
      const elapsedTime = (endTime - startTime) / 1000;
      const wordsPerMinute = currentWord.length / 5 / (elapsedTime / 60);

      setFeedback(`Typed in ${elapsedTime} seconds. WPM: ${wordsPerMinute.toFixed(2)}`);

      // Emit an event to the server with the time and WPM
      // Example: socket.emit('wordCompleted', { time: elapsedTime, wpm: wordsPerMinute });
    }
  };

  return (
    <div class="game-container">
      <h1>Type!</h1>
      <p id="word-display">{currentWord}</p>
      <input type="text" id="user-input" onInput={handleInput} autocomplete="off" />
      <p id="feedback">{feedback}</p>
    </div>
  );
}
