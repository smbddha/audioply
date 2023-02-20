import React, { useState, useEffect } from "react";

import ParamSlider from "@/uicomponents/paramslider";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";

type Props = {
  node: WaveshaperNode;
};

type OversampleOpts = "none" | "2x" | "4x";
const oversampleOpts: OversampleOpts[] = ["none", "2x", "4x"];

const WaveshaperNode = (props: Props) => {
  const { node } = props;

  const [oversampleOpt, setOversampleOpt] = useState(
    node.oversample as OversampleOpts
  );

  const handleThreshChange = (val: number): void => {
    node.threshold.value = val;
  };

  return (
    <>
      <SelectionDropdown
        title={oversampleOpt}
        items={oversampleOpts}
        handleClick={(it, i) => handleTypeChange(it)}
      />
    </>
  );
};

export default WaveshaperNode;
