import React from "react";

import ParamSlider from "@/uicomponents/paramslider";

type Props = {
  node: DelayNode;
};

const DelayNode = (props: Props) => {
  const { node } = props;

  const handleDelayTimeChange = (val: number) => {
    node.delayTime.value = val;
  };

  return (
    <>
      <ParamSlider
        title="Delay Time"
        audioParam={node.delayTime}
        handleChange={handleDelayTimeChange}
      />
    </>
  );
};

export default DelayNode;
