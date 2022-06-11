import { h } from "preact";
import GamePlay from "../../components/gamePlay";
import ToggleButton from "../../components/toggleButton";
import { HandMode, Mode, Scene } from "../../constants/common";
import { GameProvider, useGameContext } from "../../contexts/game";
import styles from "./style.css";

const SceneSelectingHandMode = () => {
  const { setHandMode } = useGameContext();

  const selectHandMode = (handMode: HandMode) => setHandMode(handMode);

  return (
    <div className="nes-container with-title is-centered">
      <p className="title">Select Hand</p>
      <div className="btn-group-select-mode">
        <button
          type="button"
          className="nes-btn is-primary"
          onClick={() => selectHandMode(HandMode.Left_Hand_Only)}
        >
          Left
        </button>
        <button
          type="button"
          className="nes-btn"
          onClick={() => selectHandMode(HandMode.Both_Hand)}
        >
          Both
        </button>
        <button
          type="button"
          className="nes-btn is-success"
          onClick={() => selectHandMode(HandMode.Right_Hand_Only)}
        >
          Right
        </button>
      </div>
    </div>
  );
};

const SceneSelectingMode = () => {
  const { setMode } = useGameContext();
  const selectMode = (mode: Mode) => setMode(mode);

  return (
    <div className="nes-container with-title is-centered">
      <p className="title">Select Mode</p>
      <div className="nes-field mb-2">
        <button
          type="button"
          className="nes-btn is-disabled"
          onClick={() => selectMode(Mode.Multiplayer)}
          disabled
        >
          Enter Type Jam
        </button>
      </div>
      <div className="nes-field">
        <button
          type="button"
          className="nes-btn is-primary"
          onClick={() => selectMode(Mode.Practice)}
        >
          Practice yourself
        </button>
      </div>
    </div>
  );
};

const RenderScene = () => {
  const { scene, enableHint, setEnableHint, visibleHint } = useGameContext();

  const render = () => {
    switch (scene) {
      case Scene.Mode_Selecting:
        return <SceneSelectingMode />;
      case Scene.Hand_Mode_Selecting:
        return <SceneSelectingHandMode />;
      case Scene.Game_Playing:
        return <GamePlay />;
      default:
        return <div>Something wrong</div>;
    }
  };

  return (
    <>
      {visibleHint && (
        <ToggleButton
          enable={enableHint}
          setEnable={setEnableHint}
          text={{ true: "Enable", false: "Disable" }}
        />
      )}
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
