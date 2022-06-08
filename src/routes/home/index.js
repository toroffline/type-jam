import { h, createContext } from "preact";
import style from "./style.css";
import { useState, useContext, useEffect } from "preact/hooks";

const Scene = {
  Mode_Selecting: "mode-selecting",
  Play_Game: "play-game",
};
const Mode = {
  Left_Hand_Only: "left-hand-only",
  Both_Hand: "both-hand",
  Right_Hand_Only: "right-hand-only",
};

const GameContext = createContext();

function GameProvider(_props) {
  const [mode, setMode] = useState();
  const [scene, setScene] = useState(Scene.Mode_Selecting);

  useEffect(() => {
    if (scene === Scene.Mode_Selecting && mode) {
      setScene(Scene.Play_Game);
    }
  }, [scene, mode]);

  return (
    <GameContext.Provider value={{ mode, setMode, scene, setScene }}>
      {_props.children}
    </GameContext.Provider>
  );
}

const SceneSelectingMode = () => {
  const { setMode } = useContext(GameContext);

  const selectMode = (mode) => setMode(mode);

  return (
    <div>
      <button onClick={() => selectMode(Mode.Left_Hand_Only)}>left</button>
      <button onClick={() => selectMode(Mode.Both_Hand)}>both</button>
      <button onClick={() => selectMode(Mode.Right_Hand_Only)}>right</button>
    </div>
  );
};

const RenderScene = () => {
  const { scene } = useContext(GameContext);

  const render = () => {
    switch (scene) {
      case Scene.Mode_Selecting:
        return <SceneSelectingMode />;
      case Scene.Play_Game:
        return <div>Play Game</div>;
      default:
        return <div>Something wrong</div>;
    }
  };

  return render();
};

const Home = () => {
  return (
    <GameProvider>
      <div class={style.home}>
        <RenderScene />
      </div>
    </GameProvider>
  );
};

export default Home;
