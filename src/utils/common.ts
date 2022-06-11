import { FingerHint } from "../constants/common";

export namespace CommonUtil {
  export function getFingerHint(char: string) {
    const mapFinger_Character = {
      [FingerHint.Weaknest]: ["1", "q", "a", "z"],
      [FingerHint.Wedding]: ["2", "w", "s", "x"],
      [FingerHint.Fuck]: ["3", "e", "d", "c"],
      [FingerHint.Power]: ["4", "r", "t", "f", "g", "v", "b"],
      [FingerHint.Good]: [" "],
    };

    let resultFinger: string = FingerHint.Extra;
    for (const [finger, chars] of Object.entries(mapFinger_Character)) {
      if (chars.includes(char)) {
        resultFinger = finger;
        break;
      }
    }

    return resultFinger;
  }

  export function toTitleCase(val: string) {
    return val.charAt(0).toUpperCase() + val.substring(1).toLowerCase();
  }

  export function extractMillseconds(timeMs: number) {
    let milliseconds = timeMs % 1000,
      seconds = Math.floor((timeMs / 1000) % 60),
      minutes = Math.floor(timeMs / (1000 * 60));

    minutes = minutes < 10 ? 0 + minutes : minutes;
    seconds = seconds < 10 ? 0 + seconds : seconds;

    return {
      milliseconds,
      seconds,
      minutes,
    };
  }

  export function displayTime(ms, s, m, fixed) {
    return `${s}:${ms.toString().slice(0, fixed)}`;
  }
}
