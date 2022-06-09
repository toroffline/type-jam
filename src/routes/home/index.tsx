import { createContext } from "preact";
import { useState, useContext, useEffect, useRef } from "preact/hooks";
import {
  CharacterStatus,
  FingerHint,
  Hand_Mode,
  Scene,
} from "../../constants/commonConstant";
import { CommonUtil } from "../../utils/commonUtil";
import styles from "./style.css";

const GameContext = createContext(null);

function GameProvider(_props: any) {
  const [mode, setMode] = useState();
  const [enableHint, setEnableHint] = useState(false);
  const [scene, setScene] = useState(Scene.Mode_Selecting);

  useEffect(() => {
    if (scene === Scene.Mode_Selecting && mode) {
      setScene(Scene.Game_Playing);
    }
  }, [scene, mode]);

  return (
    <GameContext.Provider
      value={{ mode, setMode, scene, setScene, enableHint, setEnableHint }}
    >
      {_props.children}
    </GameContext.Provider>
  );
}

const ToggleHint = ({ enable, setEnable }) => {
  return (
    <div className="toggle-hint mb-2">
      <button
        type="button"
        class={`nes-btn ${enable ? "is-success" : ""}`}
        onClick={() => setEnable(!enable)}
      >
        {enable ? "Enable" : "Disable"} Hint
      </button>
    </div>
  );
};

const useInput = (inputRef) => {
  const [value, setValue] = useState("");
  const clear = () => setValue("");

  const input = (
    <input
      ref={inputRef}
      value={value}
      onKeyUp={(e) => setValue((e.target as HTMLInputElement).value)}
      type="text"
      className="nes-input"
    />
  );
  return [value, input, clear];
};

const PlayGame = () => {
  const { mode, enableHint } = useContext(GameContext);
  const inputRef = useRef(null);
  const [words, setWords] = useState<any>();
  const [focusingChar, setFocusingChar] = useState();
  const [progress, setProgress] = useState(0);
  const [typing, TypingInput, clearInput] = useInput(inputRef);

  const mockWords = {
    [Hand_Mode.Left_Hand_Only]: [
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
    return words.map((word, i) => ({
      value: word,
      valid: false,
      characters: (word + " ").split("").map((w, j) => ({
        value: w,
        status:
          i === j && i === 0 ? CharacterStatus.Focusing : CharacterStatus.Wait,
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
      let allCorrect = 0;
      for (let i = 0; i < _words.length; i++) {
        if (!_words[i].valid) {
          let containIncorrect = false;
          for (let j = 0; j < _words[i].characters.length; j++) {
            if (
              _typed[j] === _words[i].characters[j].value &&
              !containIncorrect
            ) {
              _words[i].characters[j].status = CharacterStatus.Correct;
              allCorrect += 1;
            } else {
              if (_typed[j] === undefined) {
                if (_typed.length === j) {
                  _words[i].characters[j].status = CharacterStatus.Focusing;
                  setFocusingChar(_words[i].characters[j].value);
                } else {
                  _words[i].characters[j].status = CharacterStatus.Wait;
                }
              } else {
                containIncorrect = true;
                _words[i].characters[j].status = CharacterStatus.Incorrect;
              }
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
          console.log(
            allCorrect,
            _words.map((word) => word.value).join(" ").length,
            (allCorrect / _words.map((word) => word.value).join(" ").length) *
              100
          );
          setProgress(
            (prev) =>
              (allCorrect / _words.map((word) => word.value).join(" ").length) *
              100
          );
          break;
        } else {
          allCorrect += _words[i].value.length + 1;
        }
      }
      setWords(_words);
    }
  }, [typing]);

  return (
    <div className="play-zone">
      <section class="nes-container with-title">
        <h3 class="title">
          {mode.charAt(0).toUpperCase() + mode.substr(1).toLowerCase()}
        </h3>
        <div id="inputs" class="item">
          <div class="nes-field">
            <label for="name_field">
              {words
                ? words
                    .map((word) => word.characters)
                    .map((_character, i) =>
                      _character.map((character, j) => (
                        <span
                          id={`${character.value}-${i}-${j}`}
                          key={`${character.value}-$-${i}-${j}-${character.valid}`}
                          className={`nes-text ${character.status}`}
                        >
                          {character.value}
                        </span>
                      ))
                    )
                : "something wrong"}
            </label>
            {TypingInput}
            <progress
              class="nes-progress"
              value={progress}
              max="100"
            ></progress>
          </div>
          {enableHint ? (
            <div className="nes-fied">
              hint : {CommonUtil.getFingerHint(focusingChar)}
            </div>
          ) : (
            <></>
          )}
        </div>
      </section>
    </div>
  );
};

const SceneSelectingMode = () => {
  const { setMode } = useContext(GameContext);

  const selectMode = (mode) => setMode(mode);

  return (
    <div className="btn-group-select-mode">
      <button
        type="button"
        className="nes-btn is-primary"
        onClick={() => selectMode(Hand_Mode.Left_Hand_Only)}
      >
        Left
      </button>
      <button
        type="button"
        className="nes-btn"
        onClick={() => selectMode(Hand_Mode.Both_Hand)}
      >
        Both
      </button>
      <button
        type="button"
        className="nes-btn is-success"
        onClick={() => selectMode(Hand_Mode.Right_Hand_Only)}
      >
        Right
      </button>
    </div>
  );
};

const RenderScene = () => {
  const { scene, enableHint, setEnableHint } = useContext(GameContext);

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

  return (
    <>
      <ToggleHint enable={enableHint} setEnable={setEnableHint} />
      {render()}
    </>
  );
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
