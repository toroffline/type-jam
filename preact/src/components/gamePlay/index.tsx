import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { CharacterStatus } from "../../constants/common";
import { useGameContext } from "../../contexts/game";
import useTimeCounter from "../../hooks/useTimeCounter";
import { CommonUtil } from "../../utils/common";
import useInput from "../hooks/input";

const GamePlay = () => {
  const {
    words: _words,
    options,
    finishPracticeRace,
    startPracticeRace: start,
  } = useGameContext();
  // const { milliseconds, seconds, counting, setCounting, resetCounting } =
  //   useTimeCounter({ countType: "up" });
  const {
    counting: countingDownStart,
    setCounting: setCountingDownStart,
    seconds: secondsDown,
  } = useTimeCounter({ countType: "down", initTime: { s: 1 } });

  const inputRef = useRef(null);
  const dialogCountDownStartRef = useRef<HTMLDialogElement>(null);
  const [words, setWords] = useState(
    _words ? CommonUtil.deepCloneArray(_words) : null
  );
  const [focusingChar, setFocusingChar] = useState();
  const [progress, setProgress] = useState(0);
  const [typing, TypingInput, clearInput] = useInput(inputRef);

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
        if (i === _words.length - 1) {
          // setCounting(false);
          finishPracticeRace();
        }
      }
      setWords(_words);
    }
  }, [typing]);

  useEffect(() => {
    if (secondsDown === 0) {
      setCountingDownStart(false);
      dialogCountDownStartRef.current.close();
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
        start();
      }
    }
  }, [secondsDown]);

  useEffect(() => {
    if (!countingDownStart) {
      dialogCountDownStartRef.current.showModal();
      setTimeout(() => {
        setCountingDownStart(true);
      }, 100);
    }
  }, []);

  return (
    <div className="play-zone">
      <progress class="nes-progress mb-2" value={progress} max="100" />
      <section class="nes-container with-title">
        <h3 class="title title-end">
          {/*{("0" + seconds).slice(-2)}
          :{("0" + milliseconds / 10).slice(-2)}*/}
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
          </div>
          {options.hint.value ? (
            <div className="nes-fied">
              hint : {CommonUtil.getFingerHint(focusingChar)}
            </div>
          ) : (
            <></>
          )}
        </div>
      </section>
      <section>
        {/* Dialog */}
        <dialog
          ref={dialogCountDownStartRef}
          class="nes-dialog is-rounded"
          id="dialog-count-down-start"
        >
          <form method="dialog">
            <p class="title">Start In</p>
            <p style={{ textAlign: "center" }}>{secondsDown}</p>
          </form>
        </dialog>
      </section>
    </div>
  );
};

export default GamePlay;
