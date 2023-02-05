import { RefObject } from "react";

export type INode = {
  name: String;
  node: AudioNode;
  settings: object;
  inputs: RefObject<HTMLDivElement>[];
  outputs: RefObject<HTMLDivElement>[];
  // params: NodeParam[];
};
