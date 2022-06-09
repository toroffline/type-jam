import { createContext } from "preact";
import { useState, useContext, useEffect, useRef } from "preact/hooks";
import { CharacterStatus, Mode, Scene } from "../../constants/commonConstant";
import styles from "./style.css";

const GameContext = createContext(null);

function GameProvider(_props: any) {
  const [mode, setMode] = useState();
  const [scene, setScene] = useState(Scene.Mode_Selecting);

  useEffect(() => {
    if (scene === Scene.Mode_Selecting && mode) {
      setScene(Scene.Game_Playing);
    }
  }, [scene, mode]);

  return (
    <GameContext.Provider value={{ mode, setMode, scene, setScene }}>
      {_props.children}
    </GameContext.Provider>
  );
}

const useInput = (inputRef) => {
  const [value, setValue] = useState("");
  const clear = () => setValue("");

  const input = (
    <input
      ref={inputRef}
      value={value}
      onKeyUp={(e) => setValue((e.target as HTMLInputElement).value)}
      type="text"
    />
  );
  return [value, input, clear];
};

const PlayGame = () => {
  const { mode } = useContext(GameContext);
  const inputRef = useRef(null);
  const [words, setWords] = useState<any>();
  const [typing, TypingInput, clearInput] = useInput(inputRef);

  const mockWords = {
    [Mode.Left_Hand_Only]: [
      "rest",
      "baste",
      "sarge",
      "badger",
      "dab",
      "bad",
      "brew",
      "brave",
    ],
  };

  const prepareWords = (words: string[]) => {
    return words.map((word) => ({
      value: word,
      valid: false,
      characters: (word + " ").split("").map((w) => ({
        value: w,
        status: CharacterStatus.Waiting,
      })),
    }));
  };

  useEffect(() => {
    if (mode) {
      setWords(prepareWords(mockWords[mode]));
    }
  }, [mode]);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  useEffect(() => {
    if (words) {
      const _typed = typing as string;
      let _words = [...words];
      for (let i = 0; i < _words.length; i++) {
        if (!_words[i].valid) {
          let containIncorrect = false;
          for (let j = 0; j < _words[i].characters.length; j++) {
            if (
              _typed[j] === _words[i].characters[j].value &&
              !containIncorrect
            ) {
              _words[i].characters[j].status = CharacterStatus.Correct;
            } else {
              containIncorrect = true;
              _words[i].characters[j].status = CharacterStatus.Incorrect;
            }
          }
          if (
            _words[i].characters.every(
              (c) => c.status === CharacterStatus.Correct
            )
          ) {
            _words[i].valid = true;
            (clearInput as Function)();
          }
          break;
        }
      }
      setWords(_words);
    }
  }, [typing]);

  return (
    <>
      <div>
        <>
          {words
            ? words
                .map((word) => word.characters)
                .map((_character, i) =>
                  _character.map((character, j) => (
                    <span
                      id={`${character.value}-${i}-${j}`}
                      key={`${character.value}-$-${i}-${j}-${character.valid}`}
                      className={`${character.status}`}
                    >
                      {character.value}
                    </span>
                  ))
                )
            : "something wrong"}
        </>
      </div>
      {TypingInput}
    </>
  );
};

const SceneSelectingMode = () => {
  const { setMode } = useContext(GameContext);

  const selectMode = (mode) => setMode(mode);

  return (
    <div>
      <button onClick={() => selectMode(Mode.Left_Hand_Only)}>left</button>
      <button onClick={() => selectMode(Mode.Both_Hand)}>both</button>
      <button onClick={() => selectMode(Mode.Right_Hand_Only)}>right</button>
    </div>
  );
};

const RenderScene = () => {
  const { scene } = useContext(GameContext);

  const render = () => {
    switch (scene) {
      case Scene.Mode_Selecting:
        return <SceneSelectingMode />;
      case Scene.Game_Playing:
        return <PlayGame />;
      default:
        return <div>Something wrong</div>;
    }
  };

  return render();
};

const Home = () => {
  return (
    <GameProvider>
      <div class={styles.home}>
        <RenderScene />
      </div>
    </GameProvider>
  );
};

export default Home;
