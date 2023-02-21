import React from "react";

import ParamSlider from "@/uicomponents/paramslider";
import { INode } from "@/types";

type Props = {
  node: INode<GainNode>;
};

const GainNode = (props: Props) => {
  const { node } = props;

  const handleGainChange = (val: number) => {
    node.audioNode.gain.value = val;
  };

  return (
    <>
      <ParamSlider
        title="Gain"
        audioParam={node.audioNode.gain}
        handleChange={handleGainChange}
        limits={[0, 10]}
      />
    </>
  );
};

export default GainNode;
