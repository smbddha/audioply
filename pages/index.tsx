import Head from "next/head";
// import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import react, {
  useState,
  useCallback,
  MouseEvent,
  RefObject,
  MutableRefObject,
  useRef,
  createRef,
  forwardRef,
  ForwardedRef,
} from "react";
import Draggable from "react-draggable";
import React from "react";
// import { useSvgDrawing } from "@svg-drawing/react";

// const inter = Inter({ subsets: ["latin"] });

const Graph = [];

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

type INode = {
  name: String;
  node: AudioNode;
  settings: object;
  inputs: RefObject<HTMLDivElement>[];
  outputs: RefObject<HTMLDivElement>[];
  // params: NodeParam[];
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

const InputOutputNode = React.forwardRef<HTMLDivElement, InputOutputProps>(
  (props, ref) => {
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
  const handleOutputClick = (i: number) => {
    return;
  };

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

const connections: [any, any][] = [];

enum MouseState {
  UP = "Up",
  DOWN = "Down",
}

export default function Home() {
  const [audioCtx, _] = useState<AudioContext | null>(
    typeof window !== "undefined" ? new AudioContext() : null
  );
  const [graph, setGraph] = useState<any[]>([]);
  const [mouseState, setMouseState] = useState(MouseState.UP);
  // const [mouseStart, setMouseStart] = useState({ x1: 0, y1: 0 });
  const [mousePos, setMousePos] = useState([0, 0]);

  // const [activeNode, setActiveNode] = useState<[INode, tid] | null>(null);
  // const [activeOutput, setActiveOutput] = useSta
  const [connectionStart, setConnectionStart] = useState<
    [INode, number, number] | null
  >(null);
  const [connectionEnd, setConnectionEnd] = useState<
    [INode, number, number] | null
  >(null);

  // const [renderRef, draw] = useSvgDrawing({
  //   penWidth: 10, // pen width
  //   penColor: "#e00", // pen color
  //   close: true, // Use close command for path. Default is false.
  //   curve: false, // Use curve command for path. Default is true.
  //   delay: 60, // Set how many ms to draw points every.
  //   fill: "", // Set fill attribute for path. default is `none`
  // });

  // console.log(audioCtx);

  const handleClick = () => {
    addNode();
  };

  const handleAddNode = () => {
    const newNode = {
      name: "NODE",
      inputs: [
        createRef<HTMLDivElement>(),
        createRef<HTMLDivElement>(),
        createRef<HTMLDivElement>(),
      ],
      outputs: [createRef<HTMLDivElement>(), createRef<HTMLDivElement>()],
    };
    console.log("adding node");

    setGraph((g) => {
      return [...g, newNode];
    });
    console.log(graph);
  };

  const addNode = useCallback(() => {
    if (audioCtx) {
      const gainNode = audioCtx.createGain();
      const oscNode = audioCtx.createOscillator();
      oscNode.frequency.setValueAtTime(440, audioCtx.currentTime);

      oscNode.connect(gainNode).connect(audioCtx.destination);
      oscNode.start();

      console.log(gainNode, oscNode);
    }
  }, [audioCtx]);

  const handleMouseDown = (e: MouseEvent) => {
    // setMouseState(MouseState.DOWN);
    // setMouseStart({ x1: e.clientX, y1: e.clientY });
  };

  // const handleMouseUp = (e: MouseEvent) => {
  //   // setMouseState(MouseState.UP);
  // };

  const handleMouseMove = (e: MouseEvent) => {
    setMousePos([e.clientX, e.clientY]);
  };

  const getLineCoords = () => {
    // get the postion of the active input/output
    if (!connectionStart) return;

    const [node, inputIdx, outputIdx] = connectionStart;

    let rect;
    if (inputIdx >= 0) {
      if (!node.inputs[inputIdx].current) return;
      rect = node.inputs[inputIdx].current.getBoundingClientRect();
    } else if (outputIdx >= 0) {
      if (!node.outputs[outputIdx].current) return;
      rect = node.outputs[outputIdx].current.getBoundingClientRect();
    }

    return {
      x1: rect.x,
      y1: rect.y,
      x2: mousePos[0],
      y2: mousePos[1],
    };
  };

  const getConnCoords = (start: ConnNodeTuple, end: ConnNodeTuple) => {
    const [startNode, startInputIdx, startOutputIdx] = start;
    const [endNode, endInputIdx, endOutputIdx] = end;

    let startRef;
    if (startInputIdx >= 0) {
      startRef = startNode.inputs[startInputIdx];
    } else if (startOutputIdx >= 0) {
      startRef = startNode.outputs[startOutputIdx];
    }

    let endRef;
    if (endInputIdx >= 0) {
      endRef = endNode.inputs[endInputIdx];
    } else if (endOutputIdx >= 0) {
      endRef = endNode.outputs[endOutputIdx];
    }

    const startRect = startRef.current.getBoundingClientRect();
    const endRect = endRef.current.getBoundingClientRect();

    return {
      x1: startRect.x,
      y1: startRect.y,
      x2: endRect.x,
      y2: endRect.y,
    };
  };

  const inputMouseHandler = (
    e: MouseEvent,
    node: INode,
    inputIndex: number,
    ref: RefObject<HTMLDivElement>
  ) => {
    console.log(e.type, ref.current);
    if (e.type === "mousedown") {
      setConnectionStart([node, inputIndex, -1]);
    } else if (e.type === "mouseenter") {
      setConnectionEnd([node, inputIndex, -1]);
      // setHoveredOutput([node, outputIndex]);
    } else if (e.type === "mouseleave") {
      setConnectionEnd(null);
    } else {
      console.log("Unrecognized type ", e.type);
    }
  };

  const outputMouseHandler = (
    e: MouseEvent,
    node: INode,
    outputIndex: number,
    ref: RefObject<HTMLDivElement>
  ) => {
    console.log(e.type, ref.current);
    if (e.type === "mousedown") {
      setConnectionStart([node, -1, outputIndex]);
    } else if (e.type === "mouseenter") {
      setConnectionEnd([node, -1, outputIndex]);
      // setHoveredOutput([node, outputIndex]);
    } else if (e.type === "mouseleave") {
      setConnectionEnd(null);
    } else {
      console.log("Unrecognized type ", e.type);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    // either create the connection or stop drawing the patch line
    console.log(connectionStart, connectionEnd);

    if (connectionEnd && connectionStart) {
      // make connection
      connections.push([connectionStart, connectionEnd]);
    }

    setConnectionStart(null);
    setConnectionEnd(null);
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={styles.main}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <svg
          style={{
            pointerEvents: "none",
            position: "absolute",
            zIndex: "10000",
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
            width: "100%",
          }}
        >
          {" "}
          {connectionStart ? (
            <line {...getLineCoords()} stroke="red" strokeWidth={2} />
          ) : null}
          {connections.map((conn, i) => {
            return (
              <line
                {...getConnCoords(...conn)}
                stroke="white"
                strokeWidth={2}
              />
            );
          })}
        </svg>
        <button style={{ zIndex: "1000" }} onClick={handleAddNode}>
          Add Node
        </button>
        <div>
          <button onClick={handleClick}>DO IT</button>
        </div>
        {graph.map((node, i) => {
          return (
            <Node
              node={node}
              inputMouseHandler={inputMouseHandler}
              outputMouseHandler={outputMouseHandler}
            />
          );
        })}
      </main>
    </>
  );
}
