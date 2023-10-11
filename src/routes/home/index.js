import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

const Home = () => {
  const _words = ["note", "week", "quantity", "bride", "fail", "carry", "policy", "forum", "convenience", "past"];

  const [words, setWords] = useState({ characters: [] });
  const typing = useState("");
  const currentIdx = useState(0);

  function initial() {
    const _chars = [];
    let concat = "";
    for (let word of _words) {
      for (let i = 0; i < word.length; i++) {
        const _char = {
          character: word[i],
          status: "wait",
        };
        _chars.push(_char);
        concat += word[i];
      }
      concat += " ";
    }

    console.log(concat);

    // const waitBoard = document.getElementById("wait");
    // waitBoard.innerHTML = words.characters.map((w) => w.character).join(" ");
  }

  useEffect(() => {
    initial();
  }, []);

  useEffect(() => {
    if (typing) {
    }
  }, typing);

  return (
    <div className="home">
      <div id="board" className="board">
        <span id="done" className="done" />
        <span id="current" className="current" />
        <span id="wait" className="wait" />
      </div>
      <input id="typing-box" />
    </div>
  );
};

export default Home;
