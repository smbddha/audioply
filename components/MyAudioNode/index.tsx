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
        return <OscillatorNode node={node.node as OscillatorNode} />;
      case AudioNodeType.Delay:
        return <DelayNode node={node.node as DelayNode} />;
      case AudioNodeType.Biquad:
        return <BiquadFilterNode node={node.node as BiquadFilterNode} />;
      case AudioNodeType.Gain:
        return <GainNode node={node.node as GainNode} />;
      case AudioNodeType.Convolver:
        return <ConvolverNode node={node.node as ConvolverNode} />;
      case AudioNodeType.Analyser:
        return <AnalyserNode node={node.node as AnalyserNode} />;
      case AudioNodeType.Compressor:
        return <CompressorNode node={node.node as DynamicsCompressorNode} />;
      case AudioNodeType.AudioBuffer:
        return <AudioBufferNode node={node.node as AudioBufferSourceNode} />;
      default:
        return <></>;
    }
  };

  return <Node {...props}>{renderNode()}</Node>;
};

export default MyAudioNode;
