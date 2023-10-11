import { useEffect, useRef, useState } from "preact/hooks";
import { CommonUtil } from "../utils/common";

type CountType = "up" | "down";

interface Props {
  countType: CountType;
  initTime?: {
    ms?: number;
    s?: number;
  };
}

function useTimeCounter(configs: Props) {
  const { countType, initTime } = configs;
  const [milliseconds, setMilliseconds] = useState(0);
  const [seconds, setSeconds] = useState(initTime?.s || 0);
  const [minutes, setMinutes] = useState(0);
  const [counting, setCounting] = useState(false);
  const delay = 1000;

  const resetCounting = () => {};

  useEffect(() => {
    let interval;
    if (counting) {
      let timeMs = initTime?.s ? initTime?.s * 1000 : initTime?.ms || 0;
      interval = setInterval(() => {
        if (countType === "up") {
          timeMs += delay;
        } else {
          timeMs -= delay;
        }
        let {
          milliseconds: _ms,
          seconds: _s,
          minutes: _m,
        } = CommonUtil.extractMillseconds(timeMs);
        setMilliseconds(_ms);
        setSeconds(_s);
        setMinutes(_m);
      }, delay);
    }

    return () => clearInterval(interval);
  }, [counting]);

  return {
    milliseconds,
    seconds,
    minutes,
    counting,
    setCounting,
    resetCounting,
  };
}

export default useTimeCounter;
