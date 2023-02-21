import React, { useState, useEffect } from "react";

import ParamSlider from "@/uicomponents/paramslider";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";
import { INode } from "@/types";

type Props = {
  node: INode<DynamicsCompressorNode>;
};

const CompressorNode = (props: Props) => {
  const { node } = props;

  const handleThreshChange = (val: number): void => {
    node.audioNode.threshold.value = val;
  };

  const handleKneeChange = (val: number): void => {
    node.audioNode.knee.value = val;
  };

  const handleRatioChange = (val: number): void => {
    node.audioNode.ratio.value = val;
  };

  const handleAttackChange = (val: number): void => {
    node.audioNode.attack.value = val;
  };

  const handleReleaseChange = (val: number): void => {
    node.audioNode.release.value = val;
  };

  return (
    <>
      <ParamSlider
        title="threshold"
        audioParam={node.audioNode.threshold}
        handleChange={handleThreshChange}
        limits={[-36, 0]}
        unit="db"
      />
      <ParamSlider
        title="knee"
        audioParam={node.audioNode.knee}
        handleChange={handleKneeChange}
        limits={[0, 40]}
        unit="db"
      />
      <ParamSlider
        title="ratio"
        audioParam={node.audioNode.ratio}
        handleChange={handleRatioChange}
        limits={[1, 50]}
      />
      <ParamSlider
        title="attack"
        audioParam={node.audioNode.attack}
        handleChange={handleAttackChange}
        limits={[0.003, 1]}
        unit="s"
      />
      <ParamSlider
        title="release"
        audioParam={node.audioNode.release}
        handleChange={handleReleaseChange}
        limits={[0.25, 2]}
        unit="s"
      />
    </>
  );
};

export default CompressorNode;
