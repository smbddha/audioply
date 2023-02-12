import React, { useState } from "react";

import ParamSlider from "@/uicomponents/paramslider";
import Dropdown from "../dropdown";

type Props = {
  node: OscillatorNode;
};

// enum OscillatorTypes {
//   sin = "sine",
//   square = "square",
//   triangle = "triangle",
//   sawtooth = "sawtooth",
// }

const oscillatorTypes: OscillatorType[] = [
  "sine",
  "square",
  "triangle",
  "sawtooth",
  "custom",
];

const OscillatorNode = (props: Props) => {
  const { node } = props;

  const [isPlaying, setIsPlaying] = useState(false);

  const handleFreqChange = (val: number): void => {
    node.frequency.value = val;
  };

  const handleDetuneChange = (val: number): void => {
    node.detune.value = val;
  };

  const handleOscTypeChange = (newType: OscillatorType): void => {
    node.type = newType;
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      node.stop();
    } else {
      node.start();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <ParamSlider
        title="Freq"
        audioParam={node.frequency}
        handleChange={handleFreqChange}
        limits={[0, 20000]}
        unit="hz"
      />
      <ParamSlider
        title="Detune"
        audioParam={node.detune}
        handleChange={handleDetuneChange}
        limits={[-1200, 1200]}
        unit="cents"
      />
      <Dropdown title={node.type}>
        {oscillatorTypes.map((ot, i) => (
          <button key={i} onClick={() => handleOscTypeChange(ot)}>
            {ot}
          </button>
        ))}
      </Dropdown>
      <button onClick={handlePlayToggle}>{isPlaying ? "Stop" : "Play"}</button>
    </>
  );
};

export default OscillatorNode;
