export enum Scene {
  Hand_Mode_Selecting = "hand-mode-selecting",
  Prepare_Game = "prepare-game",
  Game_Playing = "game-playing",
  Mode_Selecting = "mode-selecting",
  Finished_Practice_Race = "finished-practice-race",
}

export enum Mode {
  Practice = "practice",
  Multiplayer = "multiplayer",
}

export enum HandMode {
  Left_Hand_Only = "left",
  Both_Hand = "both",
  Right_Hand_Only = "right",
}

export enum CharacterStatus {
  Wait = "",
  Focusing = "is-warning",
  Correct = "is-success",
  Incorrect = "is-error",
}

export enum FingerHint {
  Weaknest = "smallest",
  Wedding = "wedding",
  Fuck = "f**k",
  Power = "power",
  Good = "good",
  Extra = "extra",
}
