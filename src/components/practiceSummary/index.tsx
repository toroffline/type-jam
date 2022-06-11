import { h } from "preact";
import { useGameContext } from "../../contexts/game";
import { CommonUtil } from "../../utils/common";
import ToggleButton from "../toggleButton";

const PracticeSummary = () => {
  const { options, resetPractice, nextPractice, statsSummary } =
    useGameContext();
  const {
    timeUsed: { milliseconds, seconds },
    accuracy,
  } = statsSummary;

  return (
    <div class="nes-container with-title is-centered">
      <p class="title">Summary</p>

      <div class="nes-table-responsive mb-2">
        <table class="nes-table is-bordered is-centered">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Time</td>
              <td>{CommonUtil.displayTime(milliseconds, seconds, 0, 2)}</td>
            </tr>
            <tr>
              <td>Accuracy</td>
              <td>{accuracy}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="nes-field">
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
    </div>
  );
};

export default PracticeSummary;
