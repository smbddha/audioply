import React, { useState } from "react";

import ParamSlider from "@/uicomponents/paramslider";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";
import SelectionDropdownItem from "@/uicomponents/SelectionDropdown/item";
import { INode } from "@/types";

type Props = {
  node: INode<BiquadFilterNode>;
};

const biquadFilterTypes: BiquadFilterType[] = [
  "allpass",
  "highpass",
  "bandpass",
  "lowpass",
  "lowshelf",
  "highshelf",
  "notch",
  "peaking",
];

const BiquadFilterNode = (props: Props) => {
  const { node } = props;

  const [filterType, setFilterType] = useState(node.audioNode.type);

  const handleFreqChange = (val: number): void => {
    node.audioNode.frequency.value = val;
  };

  const handleDetuneChange = (val: number): void => {
    node.audioNode.detune.value = val;
  };

  const handleQChange = (val: number): void => {
    node.audioNode.Q.value = val;
  };

  const handleGainChange = (val: number): void => {
    node.audioNode.frequency.value = val;
  };

  const handleTypeChange = (newType: BiquadFilterType): void => {
    setFilterType(newType);
    node.audioNode.type = newType;
  };

  console.log("HERE");
  return (
    <>
      <ParamSlider
        title="Freq"
        audioParam={node.audioNode.frequency}
        handleChange={handleFreqChange}
        limits={[0, 20000]}
        unit="hz"
      />
      <ParamSlider
        title="Detune"
        audioParam={node.audioNode.detune}
        handleChange={handleDetuneChange}
        limits={[-1200, 1200]}
        unit="cents"
      />
      <ParamSlider
        title="Q"
        audioParam={node.audioNode.Q}
        handleChange={handleQChange}
        limits={[1, 100]}
      />
      <ParamSlider
        title="Gain"
        audioParam={node.audioNode.gain}
        handleChange={handleGainChange}
        limits={[0, 10]}
      />
      <SelectionDropdown title={filterType}>
        {biquadFilterTypes.map((fType, i) => {
          return (
            <SelectionDropdownItem
              key={i}
              handleClick={(_) => handleTypeChange(fType)}
            >
              <span>{fType}</span>
            </SelectionDropdownItem>
          );
        })}
      </SelectionDropdown>
    </>
  );
};

export default BiquadFilterNode;
