import React, { useState, useEffect } from "react";

import ParamSlider from "@/uicomponents/paramslider";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";

type Props = {
  node: DynamicsCompressorNode;
};

const CompressorNode = (props: Props) => {
  const { node } = props;

  const handleThreshChange = (val: number): void => {
    node.threshold.value = val;
  };

  const handleKneeChange = (val: number): void => {
    node.knee.value = val;
  };

  const handleRatioChange = (val: number): void => {
    node.ratio.value = val;
  };

  const handleAttackChange = (val: number): void => {
    node.attack.value = val;
  };

  const handleReleaseChange = (val: number): void => {
    node.release.value = val;
  };

  return (
    <>
      <ParamSlider
        title="threshold"
        audioParam={node.threshold}
        handleChange={handleThreshChange}
        limits={[-36, 0]}
        unit="db"
      />
      <ParamSlider
        title="knee"
        audioParam={node.knee}
        handleChange={handleKneeChange}
        limits={[0, 40]}
        unit="db"
      />
      <ParamSlider
        title="ratio"
        audioParam={node.ratio}
        handleChange={handleRatioChange}
        limits={[1, 50]}
      />
      <ParamSlider
        title="attack"
        audioParam={node.attack}
        handleChange={handleAttackChange}
        limits={[0.003, 1]}
        unit="s"
      />
      <ParamSlider
        title="release"
        audioParam={node.release}
        handleChange={handleReleaseChange}
        limits={[0.25, 2]}
        unit="s"
      />
    </>
  );
};

export default CompressorNode;
