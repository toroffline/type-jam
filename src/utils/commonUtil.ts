import { FingerHint, Hand_Mode } from "../constants/commonConstant";

export namespace CommonUtil {
  export const getFingerHint = (char) => {
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
  };
}
