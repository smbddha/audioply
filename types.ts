import { RefObject } from "react";

export type INode = {
  id: string;
  name: string;
  type: AudioNodeType;
  node: AudioNode;
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
}

enum AudioControlType {}

/*
	Control node (wrapper class around audio node)
	main issue: defining reusable controls and reusable interfaces together
	*/

interface AudioControl {
  type: AudioControlType;
}

type OptionControl = {
  options: string[];
};

export type ConnNodeTuple = [INode, number, number];
export type ConnNode = [INode, OutputOrInput, number];

export type OutputOrInput = "output" | "input";

export type Point = { x: number; y: number };
