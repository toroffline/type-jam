import { createContext, h } from "preact";
import { StateUpdater, useContext, useEffect, useState } from "preact/hooks";
import { CharacterStatus, HandMode, Mode, Scene } from "../constants/common";

type OptionValueType = boolean;

interface Option {
  value: OptionValueType;
  visible: boolean;

  blinking?: boolean;
  disabled?: boolean;
}

interface Options {
  hint: Option;
  resetPractice: Option;
  nextPractice: Option;
}

type OptionsType = keyof Options;
type OptionType = keyof Option;

type SetOptionFunction = (
  optionType: OptionsType,
  key: OptionType,
  value: OptionValueType
) => void;

interface Game {
  mode: Mode;
  setMode: StateUpdater<Mode>;
  handMode: HandMode;
  setHandMode: StateUpdater<HandMode>;
  scene: Scene;
  setScene: StateUpdater<Scene>;
  options: Options;

  words: any;

  flipHintValue: () => void;
  finishPracticeRace: () => void;
  resetPractice: () => void;
  nextPractice: () => void;
}

const GameContext = createContext<Game>(null);

const defaultOptions: Options = {
  hint: { value: false, visible: false },
  resetPractice: { value: false, visible: false },
  nextPractice: { value: false, visible: false },
};

export function GameProvider(props: any) {
  const [mode, setMode] = useState();
  const [handMode, setHandMode] = useState();
  const [scene, setScene] = useState(Scene.Mode_Selecting);
  const [options, _setOptions] = useState(defaultOptions);
  const [words, setWords] = useState(null);
  const [playing, setPlaying] = useState(false);

  const mockWords = {
    [HandMode.Left_Hand_Only]: [
      "rest",
      //  "baste",
      //  "sarge",
      //  "badger",
      //  "dab",
      //  "bad",
      //  "brew",
      //  "brave",
    ],
  };

  const prepareWords = (words: string[]) => {
    return words.map((word, i) => ({
      value: word,
      valid: false,
      characters: (word + (i === words.length - 1 ? "" : " "))
        .split("")
        .map((w, j) => ({
          value: w,
          status:
            i === j && i === 0
              ? CharacterStatus.Focusing
              : CharacterStatus.Wait,
        })),
    }));
  };

  const setOption: SetOptionFunction = (optionType, key, value) => {
    let _options = { ...options };
    _options[optionType][key] = value;
    _setOptions(_options);
  };

  function flipHintValue() {
    setOption("hint", "value", !options.hint.value);
  }

  function finishPracticeRace() {
    setScene(Scene.Finished_Practice_Race);
  }

  function resetPractice() {
    setOption("resetPractice", "value", true);
  }

  function handleResetPractice() {
    setOption("resetPractice", "value", false);

    setScene(Scene.Prepare_Game);
  }

  function nextPractice() {
    setOption("nextPractice", "value", true);
  }

  useEffect(() => {
    console.log(scene);
    switch (scene) {
      case Scene.Mode_Selecting:
        if (mode) {
          setScene(Scene.Hand_Mode_Selecting);
        }
        break;

      case Scene.Hand_Mode_Selecting:
        if (handMode) {
          setOption("hint", "visible", true);
          setOption("resetPractice", "visible", true);
          setOption("nextPractice", "visible", true);
          setScene(Scene.Prepare_Game);
        }
        break;

      case Scene.Prepare_Game:
        if (handMode) {
          setWords(prepareWords(mockWords[handMode]));
          setPlaying(true);

          setScene(Scene.Game_Playing);
        }

        break;

      case Scene.Game_Playing:
        if (options.resetPractice.value) {
          handleResetPractice();
        }
        //  if (!playing && handMode) {
        //  }
        // setOption("nextPractice", "value", false);
        // setOption("resetPractice", "value", false);
        break;

      case Scene.Finished_Practice_Race:
        setPlaying(false);
        if (options.resetPractice.value) {
          handleResetPractice();
        }
        break;
    }
  }, [scene, mode, handMode, options]);

  return (
    <GameContext.Provider
      value={{
        mode,
        setMode,
        handMode,
        setHandMode,
        scene,
        setScene,
        options,

        words,

        flipHintValue,
        finishPracticeRace,
        resetPractice,
        nextPractice,
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => useContext(GameContext);
