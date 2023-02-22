import React, {
  useState,
  createRef,
  PropsWithChildren,
  MouseEvent,
} from "react";

import { INode, AudioNodeType } from "@/types";
import { useStore } from "@/store";

const nodeOptions: Record<
  string,
  {
    f: (ctx: AudioContext) => AudioNode;
    d: string;
    nodeType: AudioNodeType;
  }
> = {
  analyserNode: {
    f: (ctx) => ctx.createAnalyser(),
    d: "analyser",
    nodeType: AudioNodeType.Analyser,
  },
  delayNode: {
    f: (ctx) => ctx.createDelay(),
    d: "delay",
    nodeType: AudioNodeType.Delay,
  },
  convolverNode: {
    f: (ctx) => ctx.createConvolver(),
    d: "convolver",
    nodeType: AudioNodeType.Convolver,
  },
  biquadFilter: {
    f: (ctx) => ctx.createBiquadFilter(),
    d: "biquad filter",
    nodeType: AudioNodeType.Biquad,
  },
  gainNode: {
    f: (ctx) => ctx.createGain(),
    d: "gain",
    nodeType: AudioNodeType.Gain,
  },
  oscillatorNode: {
    f: (ctx) => ctx.createOscillator(),
    d: "oscillator",
    nodeType: AudioNodeType.Oscillator,
  },
  compressorNode: {
    f: (ctx) => ctx.createDynamicsCompressor(),
    d: "dynamics compressor",
    nodeType: AudioNodeType.Compressor,
  },
  audioBufferNode: {
    f: (ctx) => ctx.createBufferSource(),
    d: "audio buffer source",
    nodeType: AudioNodeType.AudioBuffer,
  },
  audioOut: {
    f: (ctx) => ctx.destination,
    d: "audio output",
    nodeType: AudioNodeType.AudioOut,
  },
};

type Props = {};

const Controls = (props: Props) => {
  const [isShowing, setIsShowing] = useState(false);

  const audioCtx = useStore((state) => state.context);
  const addNode = useStore((state) => state.addNode);
  const reset = useStore((state) => state.reset);

  const handleHeadClick = () => {
    console.log("HERE");
    setIsShowing(!isShowing);
  };
  const handleCreateNode = (
    d: string,
    nodeType: AudioNodeType,
    f: (ctx: AudioContext) => AudioNode
  ) => {
    if (!audioCtx) return;
    const node = f(audioCtx);

    const newNode: INode<AudioNode> = {
      id: "id" + Math.random().toString(16).slice(2),
      name: d,
      audioNode: node,
      type: nodeType,
      inputRefs: Array(node.numberOfInputs).fill(createRef<HTMLDivElement>()),
      outputRefs: Array(node.numberOfOutputs).fill(createRef<HTMLDivElement>()),
    };

    addNode(newNode);
  };

  const handleResetClick = () => {
    reset();
  };

  const renderNodeOptions = () => {
    if (!isShowing) return null;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          position: "absolute",
          width: "100%",
        }}
      >
        {Object.entries(nodeOptions).map(([_, v], i) => {
          const { f, d, nodeType } = v;
          return (
            <ControlButton
              key={i}
              handleClick={(_) => handleCreateNode(d, nodeType, f)}
            >
              <span>{d}</span>
            </ControlButton>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          zIndex: "10000",
          marginLeft: "1rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          className="mybutton"
          style={{
            border: "3px solid black",
            padding: "1rem",
            cursor: "pointer",
            minWidth: "14rem",
            marginBottom: "0.4rem",
            fontWeight: "600",
            fontSize: "1.4rem",
          }}
          onClick={handleHeadClick}
        >
          + create node
        </div>
        {renderNodeOptions()}
      </div>
      <div
        style={{
          zIndex: "10000",
          marginLeft: "1rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          className="mybutton"
          style={{
            border: "3px solid black",
            padding: "1rem",
            cursor: "pointer",
            minWidth: "14rem",
            marginBottom: "0.4rem",
            fontWeight: "600",
            fontSize: "1.4rem",
          }}
          onClick={handleResetClick}
        >
          reset
        </div>
      </div>
    </>
  );
};

export default Controls;

type ControlButtonProps = {
  handleClick: (e: MouseEvent) => void;
};

const ControlButton = (props: PropsWithChildren<ControlButtonProps>) => {
  const { handleClick, children } = props;
  return (
    <div
      className="mybutton"
      style={{
        border: "3px solid black",
        padding: "1rem",
        paddingTop: "0.4rem",
        paddingBottom: "0.4rem",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};
