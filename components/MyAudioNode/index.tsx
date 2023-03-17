import React, { RefObject, MouseEvent } from "react";

import OscillatorNode from "@/components/OscillatorNode";
import DelayNode from "@/components/DelayNode";
import BiquadFilterNode from "@/components/BiquadFilterNode";
import GainNode from "@/components/GainNode";
import ConvolverNode from "@/components/ConvolverNode";
import AnalyserNode from "@/components/AnalyserNode";
import CompressorNode from "@/components/CompressorNode";
import AudioBufferNode from "@/components/AudioBufferNode";
import AudioOutNode from "@/components/AudioOutNode";
import MediaStreamNode from "@/components/MediaStreamNode";
import WaveshaperNode from "@/components/WaveshaperNode";

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
        return <OscillatorNode node={node as INode<OscillatorNode>} />;
      case AudioNodeType.Delay:
        return <DelayNode node={node as INode<DelayNode>} />;
      case AudioNodeType.Biquad:
        return <BiquadFilterNode node={node as INode<BiquadFilterNode>} />;
      case AudioNodeType.Gain:
        return <GainNode node={node as INode<GainNode>} />;
      case AudioNodeType.Convolver:
        return <ConvolverNode node={node as INode<ConvolverNode>} />;
      case AudioNodeType.Analyser:
        return <AnalyserNode node={node as INode<AnalyserNode>} />;
      case AudioNodeType.Compressor:
        return <CompressorNode node={node as INode<DynamicsCompressorNode>} />;
      case AudioNodeType.AudioBuffer:
        return <AudioBufferNode node={node as INode<AudioBufferSourceNode>} />;
      case AudioNodeType.AudioOut:
        return <AudioOutNode node={node as INode<AudioDestinationNode>} />;
      case AudioNodeType.WaveShaper:
        return <WaveshaperNode node={node as INode<WaveShaperNode>} />;
      case AudioNodeType.MediaStream:
        //@ts-ignore
        return <MediaStreamNode node={node as INode} />;
      default:
        return <></>;
    }
  };

  return <Node {...props}>{renderNode()}</Node>;
};

export default MyAudioNode;
