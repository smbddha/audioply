import { createRef, RefObject } from "react";
import { INode, ConnNode, Point, AudioNodeType } from "@/types";

export const getRefCoords = (ref: RefObject<HTMLElement>): Point | null => {
  if (!ref) return null;
  if (!ref.current) return null;
  const rect = ref.current.getBoundingClientRect();

  return { x: rect.x, y: rect.y };
};

const CONNECTION_X_OFFSET = 16;
const CONNECTION_Y_OFFSET = 9;
export const getCoords = (connNode: ConnNode): Point | null => {
  const [node, outputOrInput, idx] = connNode;

  let ref;
  if (outputOrInput === "input") {
    ref = node.inputRefs[idx];
  } else if (outputOrInput === "output") {
    ref = node.outputRefs[idx];
  }

  if (!ref) return null;

  const p = getRefCoords(ref);
  if (!p) return null;

  return {
    x: p.x + (outputOrInput === "input" ? 4 : CONNECTION_X_OFFSET),
    y: p.y + CONNECTION_Y_OFFSET,
  };
};

export const nodeOptions: Record<
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

export const createNode = (
  ctx: AudioContext,
  nodeOpts: {
    f: (ctx: AudioContext) => AudioNode;
    d: string;
    nodeType: AudioNodeType;
  }
) => {
  const { f, d, nodeType } = nodeOpts;
  const node = f(ctx);
  return {
    id: "id" + Math.random().toString(16).slice(2),
    name: d,
    audioNode: node,
    type: nodeType,
    inputRefs: Array(node.numberOfInputs).fill(createRef<HTMLDivElement>()),
    outputRefs: Array(node.numberOfOutputs).fill(createRef<HTMLDivElement>()),
  } as INode;
};
