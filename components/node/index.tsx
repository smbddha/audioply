import { useState, useContext, forwardRef, RefObject, MouseEvent } from "react";
import Draggable from "react-draggable";

import { INode } from "@/types";

type NodeProps = {
  node: INode;
  inputMouseHandler: (
    e: MouseEvent,
    node: INode,
    i: number,
    ref: RefObject<HTMLDivElement>
  ) => void;
  outputMouseHandler: (
    e: MouseEvent,
    node: INode,
    i: number,
    ref: RefObject<HTMLDivElement>
  ) => void;
};

enum NodeParamEnum {
  Input = "INPUT",
  Output = "OUTPUT",
}

type NodeParam = {
  type: NodeParamEnum;
  idx: number;
  name: string;
};

type InputOutputProps = {
  // ref: RefObject<HTMLDivElement | undefined>;
  mouseHandler: (e: MouseEvent) => void;
};

type ConnNodeTuple = [INode, number, number];

const InputOutputNode = forwardRef<HTMLDivElement, InputOutputProps>(
  function InputOutputNode(props, ref) {
    // const iref = useRef<HTMLDivElement>(ref);
    const { mouseHandler } = props;

    return (
      <div
        ref={ref}
        onMouseDown={(e) => mouseHandler(e)}
        onMouseEnter={(e) => mouseHandler(e)}
        onMouseLeave={(e) => mouseHandler(e)}
        style={{
          backgroundColor: "green",
          width: "8px",
          height: "8px",
        }}
      ></div>
    );
  }
);

const Node = ({ node, inputMouseHandler, outputMouseHandler }: NodeProps) => {
  return (
    <Draggable handle=".handle">
      <div
        style={{
          zIndex: "1000",
          border: "2px solid white",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          padding: "10px",
        }}
      >
        <div
          className="handle"
          style={{
            width: "20px",
            height: "10px",
            backgroundColor: "blue",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            gap: "8px",
          }}
        >
          {node.inputs.map((ref, i) => {
            return (
              <InputOutputNode
                key={i}
                ref={ref}
                mouseHandler={(e) => inputMouseHandler(e, node, i, ref)}
              />
            );
          })}
        </div>
        <div>{node.name}</div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            gap: "8px",
          }}
        >
          {node.outputs.map((ref, i) => {
            return (
              <InputOutputNode
                key={i}
                ref={ref}
                mouseHandler={(e) => outputMouseHandler(e, node, i, ref)}
              />
            );
          })}
        </div>
      </div>
    </Draggable>
  );
};

export default Node;
