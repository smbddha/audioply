import React from "react";

import ParamSlider from "@/uicomponents/paramslider";
import { INode } from "@/types";

type Props = {
  node: INode<GainNode>;
};

const AudioOutNode = (props: Props) => {
  const { node } = props;

  console.log(node);

  return <></>;
};

export default AudioOutNode;
