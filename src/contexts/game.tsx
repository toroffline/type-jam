import { createContext, h } from "preact";
import {
  StateUpdater,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "preact/hooks";
import { CharacterStatus, HandMode, Mode, Scene } from "../constants/common";
import { CommonUtil } from "../utils/common";
import { mockWords as MockWords } from "../utils/mock/mockData";

interface StatsSummary {
  timeUsed: {
    milliseconds: number;
    seconds: number;
    minutes: number;
  };
  accuracy: number;
}

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
  statsSummary: StatsSummary;

  flipHintValue: () => void;
  finishPracticeRace: () => void;
  resetPractice: () => void;
  nextPractice: () => void;
  startPracticeRace: () => void;
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
  const [startTime, setStartTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
  const [statsSummary, setStatsSummary] = useState<StatsSummary>(null);
  const wordCount = 1;

  const prepareWords = (words: string[], count: number) => {
    return words
      .sort(() => 0.5 - Math.random())
      .slice(0, count)
      .map((word, i) => ({
        value: word,
        valid: false,
        characters: (word + (i === count - 1 ? "" : " "))
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

  const calculateStatsSummary = (startTime, finishTime) => {
    console.log(startTime, finishTime);
    const dateDiff = finishTime.getTime() - startTime.getTime();
    const { milliseconds, seconds, minutes } =
      CommonUtil.extractMillseconds(dateDiff);
    const result = {
      timeUsed: {
        milliseconds,
        seconds,
        minutes,
      },
      accuracy: 0,
    };

    console.log(result);

    return result;
  };

  const setOption: SetOptionFunction = (optionType, key, value) => {
    let _options = { ...options };
    _options[optionType][key] = value;
    _setOptions(_options);
  };

  function flipHintValue() {
    setOption("hint", "value", !options.hint.value);
  }

  function startPracticeRace() {
    setStartTime(new Date());
  }

  function finishPracticeRace() {
    const finishTime = new Date();
    setFinishTime(finishTime);
    setStatsSummary(calculateStatsSummary(startTime, finishTime));

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
          setWords(prepareWords(MockWords[handMode], wordCount));

          setScene(Scene.Game_Playing);
        }

        break;

      case Scene.Game_Playing:
        if (options.resetPractice.value) {
          handleResetPractice();
        }
        break;

      case Scene.Finished_Practice_Race:
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
        statsSummary,

        flipHintValue,
        finishPracticeRace,
        resetPractice,
        nextPractice,
        startPracticeRace,
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => useContext(GameContext);
