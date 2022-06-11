import { createContext, h } from "preact";
import { StateUpdater, useContext, useEffect, useState } from "preact/hooks";
import { HandMode, Mode, Scene } from "../constants/common";

interface Game {
  mode: Mode;
  setMode: StateUpdater<Mode>;
  handMode: HandMode;
  setHandMode: StateUpdater<HandMode>;
  scene: Scene;
  setScene: StateUpdater<Scene>;
  enableHint: boolean;
  setEnableHint: StateUpdater<boolean>;
  visibleHint: boolean;
  setVisibleHint: StateUpdater<boolean>;
}

const GameContext = createContext<Game>(null);

export function GameProvider(_props: any) {
  const [handMode, setHandMode] = useState();
  const [mode, setMode] = useState();
  const [enableHint, setEnableHint] = useState(false);
  const [visibleHint, setVisibleHint] = useState(false);
  const [scene, setScene] = useState(Scene.Mode_Selecting);

  useEffect(() => {
    if (scene === Scene.Mode_Selecting && mode) {
      setScene(Scene.Hand_Mode_Selecting);
    } else if (scene === Scene.Hand_Mode_Selecting && handMode) {
      setVisibleHint(true);
      setScene(Scene.Game_Playing);
    }
  }, [scene, mode, handMode]);

  return (
    <GameContext.Provider
      value={{
        mode,
        setMode,
        handMode,
        setHandMode,
        scene,
        setScene,
        enableHint,
        setEnableHint,
        visibleHint,
        setVisibleHint,
      }}
    >
      {_props.children}
    </GameContext.Provider>
  );
}

export const useGameContext = () => useContext(GameContext);
