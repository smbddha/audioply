import React, { useState } from "react";

import ParamSlider from "@/uicomponents/paramslider";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";

type Props = {
  node: BiquadFilterNode;
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

  const [filterType, setFilterType] = useState(node.type);

  const handleFreqChange = (val: number): void => {
    node.frequency.value = val;
  };

  const handleDetuneChange = (val: number): void => {
    node.detune.value = val;
  };

  const handleQChange = (val: number): void => {
    node.Q.value = val;
  };

  const handleGainChange = (val: number): void => {
    node.frequency.value = val;
  };

  const handleTypeChange = (newType: BiquadFilterType): void => {
    setFilterType(newType);
    node.type = newType;
  };

  console.log("HERE");
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
      <ParamSlider
        title="Q"
        audioParam={node.Q}
        handleChange={handleQChange}
        limits={[1, 100]}
      />
      <ParamSlider
        title="Gain"
        audioParam={node.gain}
        handleChange={handleGainChange}
        limits={[0, 10]}
      />

      <SelectionDropdown
        title={filterType}
        items={biquadFilterTypes}
        handleClick={(it, i) => handleTypeChange(it)}
      />
      {/*<TypeControl default={""} options={""} />*/}
    </>
  );
};

export default BiquadFilterNode;
