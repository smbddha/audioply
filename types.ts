import { RefObject } from "react";

export type INode<T = AudioNode> = {
  id: string;
  name: string;
  type: AudioNodeType;
  audioNode: T;
  inputRefs: RefObject<HTMLDivElement>[];
  outputRefs: RefObject<HTMLDivElement>[];
};

export enum AudioNodeType {
  Delay = "DELAY",
  Oscillator = "OSCILLATOR",
  Gain = "GAIN",
  Biquad = "BIQUAD",
  Convolver = "CONVOLVER",
  Analyser = "ANALYSER",
  Compressor = "COMPRESSOR",
  AudioBuffer = "AUDIO_BUFFER",
  AudioOut = "AUDIO_OUT",
  MediaStream = "MEDIA_STREAM",
  WaveShaper = "WAVE_SHAPER",
}

export type ConnNode = [INode, OutputOrInput, number];

export type OutputOrInput = "output" | "input";

export type Point = { x: number; y: number };
