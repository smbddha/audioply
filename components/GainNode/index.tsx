import React from "react";

import ParamSlider from "@/uicomponents/paramslider";

type Props = {
  node: GainNode;
};

const GainNode = (props: Props) => {
  const { node } = props;

  const handleGainChange = (val: number) => {
    node.gain.value = val;
  };

  return (
    <>
      <ParamSlider
        title="Gain"
        audioParam={node.gain}
        handleChange={handleGainChange}
        limits={[0, 10]}
      />
    </>
  );
};

export default GainNode;
