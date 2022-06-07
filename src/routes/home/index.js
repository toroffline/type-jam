import { h } from 'preact';
import style from './style.css';
import { useState, useEffect } from 'preact/hooks';

const player = {
	mode: null
};

const SceneSelectingMode = () => {

	const selectMode = (mode) => {
		player.mode = mode;
	}

	return <div>
		<button onClick={() => selectMode('left')}>left</button>
		<button>both</button>
		<button>right</button>
	</div>
}

const Home = () => {
	const sceneIdx = useState(1);

	useEffect(() => {
		console.log(player);
	}, [player.mode])

	const RenderScene = () => {
		switch (sceneIdx) {
			case 1:
			default:
				return <SceneSelectingMode />
				break;
		}
		return <div>Something wrong</div>
	}


	return <div class={style.home}>
			<RenderScene />
		</div>
};

export default Home;
