import {
  useState,
  useContext,
  forwardRef,
  RefObject,
  MouseEvent,
  useRef,
  ChangeEvent,
} from "react";
import Draggable from "react-draggable";

import { INode, ConnNodeTuple } from "@/types";

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

const useSlider = (
  min: number,
  max: number,
  defaultState: number,
  label: string,
  id: string
) => {
  const [state, setSlide] = useState(defaultState);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("setting level", e.target.value);
    setSlide(e.target.valueAsNumber);
  };

  const props = {
    type: "range",
    id,
    min,
    max,
    step: max / 1000,
    value: state,
    onChange: handleChange,
  };
  return props;
};

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
          backgroundColor: "black",
          width: "14px",
          height: "14px",
        }}
      ></div>
    );
  }
);

type NodeParamProps = {
  name: string;
  audioNode: AudioNode;
  audioParam: AudioParam;
};

const NodeParam = ({ name, audioNode, audioParam }: NodeParamProps) => {
  const sliderProps = useSlider(
    audioParam.minValue,
    audioParam.maxValue,
    audioParam.defaultValue,
    "",
    ""
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <text>{name}</text>
        <label>{sliderProps.value}</label>
      </div>
      <div>
        <input {...sliderProps} />
      </div>
    </div>
  );
};

const Node = ({ node, inputMouseHandler, outputMouseHandler }: NodeProps) => {
  const nodeRef = useRef(null);
  console.log("node render", node.node);

  const renderParam = (paramName: string) => {
    const param = node.node[paramName as keyof AudioNode];
    if (!(param instanceof AudioParam)) return;

    console.log(param.value, param.minValue, param.maxValue);
    return (
      <NodeParam name={paramName} audioNode={node.node} audioParam={param} />
    );
  };

  const handleParamChange = (param: AudioParam, e: InputEvent) => {
    if (!e.target) return;

    console.log(e);
    param.setValueAtTime(
      e.target.valueAsNumber,
      node.node.context.currentTime + 1
    );
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".handle">
      <div
        ref={nodeRef}
        style={{
          zIndex: "1000",
          border: "4px solid black",
          display: "flex",
          flexDirection: "column",
          // gap: "6px",
          backgroundColor: "white",
          color: "black",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {/*<div
            style={{
              width: "20px",
              height: "10px",
              backgroundColor: "blue",
            }}
          ></div>*/}
        </div>
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
        <div className="handle" style={{ padding: "8px" }}>
          {node.name}
        </div>
        {/* ---- params ---- */}
        <div>{node.params ? node.params.map(renderParam) : null}</div>
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
