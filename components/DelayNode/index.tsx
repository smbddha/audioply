import React from "react";

import ParamSlider from "@/uicomponents/paramslider";
import { INode } from "@/types";

type Props = {
  node: INode<DelayNode>;
};

const DelayNode = (props: Props) => {
  const { node } = props;

  const handleDelayTimeChange = (val: number) => {
    node.audioNode.delayTime.value = val;
  };

  return (
    <>
      <ParamSlider
        title="Delay Time"
        audioParam={node.audioNode.delayTime}
        handleChange={handleDelayTimeChange}
      />
    </>
  );
};

export default DelayNode;
