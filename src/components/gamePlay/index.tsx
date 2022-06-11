import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { CharacterStatus, HandMode } from "../../constants/common";
import { useGameContext } from "../../contexts/game";
import { CommonUtil } from "../../utils/common";
import useInput from "../hooks/input";

const GamePlay = () => {
  const { handMode, enableHint } = useGameContext();
  const inputRef = useRef(null);
  const [words, setWords] = useState<any>();
  const [focusingChar, setFocusingChar] = useState();
  const [progress, setProgress] = useState(0);
  const [typing, TypingInput, clearInput] = useInput(inputRef);

  const mockWords = {
    [HandMode.Left_Hand_Only]: [
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
    if (handMode) {
      setWords(prepareWords(mockWords[handMode]));
    }
  }, [handMode]);

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
          setProgress(
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
        <h3 class="title">{CommonUtil.toTitleCase(handMode)}</h3>
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

export default GamePlay;
