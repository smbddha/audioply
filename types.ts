import { RefObject } from "react";

export type INode<T> = {
  id: string;
  name: string;
  type: AudioNodeType;
  audioNode: T;
  inputRefs: RefObject<HTMLDivElement>[];
  outputRefs: RefObject<HTMLDivElement>[];
  // settings: object;
  // params: string[];
  // otherControls: AudioControl[]
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
}

export type ConnNode = [INode<AudioNode>, OutputOrInput, number];

export type OutputOrInput = "output" | "input";

export type Point = { x: number; y: number };
