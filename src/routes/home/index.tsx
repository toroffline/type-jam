import { h } from "preact";
import { useMemo } from "preact/hooks";
import GamePlay from "../../components/gamePlay";
import ToggleButton from "../../components/toggleButton";
import { HandMode, Mode, Scene } from "../../constants/common";
import { StyleType } from "../../constants/style";
import { GameProvider, useGameContext } from "../../contexts/game";

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

const Options = () => {
  const { options, flipHintValue, resetPractice, nextPractice } =
    useGameContext();

  return (
    <section class="nes-container with-title">
      <h3 class="title">Options</h3>
      <div class="nes-field is-inline">
        {options.hint.visible && (
          <ToggleButton
            title="Hint"
            enable={options.hint.value}
            onClick={(_value) => flipHintValue()}
            text={{ true: "Enable", false: "Disable" }}
            style={{ true: StyleType.Success, false: StyleType.Normal }}
            disabled={options.hint.disabled}
          />
        )}
        {options.resetPractice.visible && (
          <ToggleButton
            title="Reset"
            enable={options.resetPractice.value}
            onClick={(_value) => resetPractice()}
            glowing={options.resetPractice.blinking}
          />
        )}
        {options.nextPractice.visible && (
          <ToggleButton
            title="Next Practice"
            enable={options.nextPractice.value}
            onClick={(_value) => nextPractice()}
          />
        )}
      </div>
    </section>
  );
};

const RenderScene = () => {
  const { scene, options } = useGameContext();

  const visibleOptions = useMemo(
    () => Object.entries(options).some(([_key, val]) => val.visible),
    [options]
  );

  const render = () => {
    switch (scene) {
      case Scene.Mode_Selecting:
        return <SceneSelectingMode />;
      case Scene.Hand_Mode_Selecting:
        return <SceneSelectingHandMode />;
      case Scene.Prepare_Game:
        return <div>loading...</div>;
      case Scene.Game_Playing:
        return <GamePlay />;
      case Scene.Finished_Practice_Race:
        return <div>Continue ?</div>;
      default:
        return <div>Something wrong</div>;
    }
  };

  return (
    <>
      <div className="">{render()}</div>
      <div className="options">{visibleOptions && <Options />}</div>
    </>
  );
};

const Home = () => {
  return (
    <GameProvider>
      <div className="home">
        <RenderScene />
      </div>
    </GameProvider>
  );
};

export default Home;
