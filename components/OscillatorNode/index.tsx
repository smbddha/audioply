import React, { useState } from "react";

import ParamSlider from "@/uicomponents/paramslider";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";
import SelectionDropdownItem from "@/uicomponents/SelectionDropdown/item";
import Button from "@/uicomponents/button";

type Props = {
  node: OscillatorNode;
};

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
  const [oscType, setOscType] = useState(node.type);

  const handleFreqChange = (val: number): void => {
    node.frequency.value = val;
  };

  const handleDetuneChange = (val: number): void => {
    node.detune.value = val;
  };

  const handleOscTypeChange = (newType: OscillatorType): void => {
    node.type = newType;
    setOscType(newType);
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

      <div style={{ margin: "0.3rem" }}>
        <Button handleClick={handlePlayToggle}>
          {isPlaying ? "Stop" : "Play"}
        </Button>
      </div>
      <SelectionDropdown title={oscType}>
        {oscillatorTypes.map((oType, i) => {
          return (
            <SelectionDropdownItem
              key={i}
              handleClick={(e) => handleOscTypeChange(oType)}
            >
              <span>{oType}</span>
            </SelectionDropdownItem>
          );
        })}
      </SelectionDropdown>
    </>
  );
};

export default OscillatorNode;
