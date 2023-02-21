import React, { RefObject, MouseEvent } from "react";

import OscillatorNode from "@/components/OscillatorNode";
import DelayNode from "@/components/DelayNode";
import BiquadFilterNode from "@/components/BiquadFilterNode";
import GainNode from "@/components/GainNode";
import ConvolverNode from "@/components/ConvolverNode";
import AnalyserNode from "@/components/AnalyserNode";
import CompressorNode from "@/components/CompressorNode";
import AudioBufferNode from "@/components/AudioBufferNode";

import Node from "@/uicomponents/node";
import { AudioNodeType, INode } from "@/types";

type Props = {
  node: INode;
  inputMouseHandler: (
    a: MouseEvent,
    b: INode,
    c: number,
    d: RefObject<HTMLDivElement>
  ) => void;
  outputMouseHandler: (
    a: MouseEvent,
    b: INode,
    c: number,
    d: RefObject<HTMLDivElement>
  ) => void;
  deleteNode: (a: INode) => void;
};

const MyAudioNode = (props: Props) => {
  const { node } = props;

  const renderNode = () => {
    switch (node.type) {
      case AudioNodeType.Oscillator:
        return <OscillatorNode node={node} />;
      case AudioNodeType.Delay:
        return <DelayNode node={node} />;
      case AudioNodeType.Biquad:
        return <BiquadFilterNode node={node} />;
      case AudioNodeType.Gain:
        return <GainNode node={node} />;
      case AudioNodeType.Convolver:
        return <ConvolverNode node={node} />;
      case AudioNodeType.Analyser:
        return <AnalyserNode node={node} />;
      case AudioNodeType.Compressor:
        return <CompressorNode node={node} />;
      case AudioNodeType.AudioBuffer:
        return <AudioBufferNode node={node} />;
      default:
        return <></>;
    }
  };

  return <Node {...props}>{renderNode()}</Node>;
};

export default MyAudioNode;
