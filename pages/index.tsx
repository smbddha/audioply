import Head from "next/head";
import { Inter } from "@next/font/google";
import {
  useState,
  MouseEvent,
  RefObject,
  useRef,
  createRef,
  useMemo,
} from "react";
import React from "react";

import { getCoords } from "@/utils";
import styles from "@/styles/Home.module.css";
import Dropdown from "@/components/dropdown";
import MyAudioNode from "@/components/MyAudioNode";

import { useStore } from "@/store";

import { INode, ConnNode, AudioNodeType } from "@/types";
import SVGLayer from "@/components/svglayer";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

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
};

export default function Home() {
  const [audioCtx, _] = useState<AudioContext | null>(
    typeof window !== "undefined" ? new AudioContext() : null
  );

  const graph = useStore((state) => state.nodes);
  const connections = useStore((state) => state.connections);
  const addNode = useStore((state) => state.addNode);
  const deleteNode = useStore((state) => state.deleteNode);
  const addConnections = useStore((state) => state.addConnections);
  const deleteConnection = useStore((state) => state.deleteConnection);

  // const [graph, setGraph] = useState<INode[]>([]);
  // const [connections, setConnections] = useState<[ConnNode, ConnNode][]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState<ConnNode | null>(null);
  const [connectionEnd, setConnectionEnd] = useState<ConnNode | null>(null);

  const inputMouseHandler = (
    e: MouseEvent,
    node: INode,
    inputIndex: number,
    _ref: RefObject<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (e.type === "mousedown") {
      setConnectionStart([node, "input", inputIndex]);
    } else if (e.type === "mouseenter") {
      setConnectionEnd([node, "input", inputIndex]);
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
    _ref: RefObject<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (e.type === "mousedown") {
      setConnectionStart([node, "output", outputIndex]);
    } else if (e.type === "mouseenter") {
      setConnectionEnd([node, "output", outputIndex]);
      // setHoveredOutput([node, outputIndex]);
    } else if (e.type === "mouseleave") {
      setConnectionEnd(null);
    } else {
      console.log("Unrecognized type ", e.type);
    }
  };

  const makeConnection = (start: ConnNode, end: ConnNode): boolean => {
    const [startNode, startNodeType, _a] = start;
    const [endNode, endNodeType, _b] = end;

    if (startNodeType === endNodeType) return false;

    if (startNodeType === "output") {
      startNode.node.connect(endNode.node);
    } else {
      endNode.node.connect(startNode.node);
    }

    // setConnections((prev) => {
    //   return [...prev, [start, end]];
    // });
    // connections.push([start, end]);
    addConnections([start, end]);

    return true;
  };

  const handleMouseUp = (_: MouseEvent) => {
    // either create the connection or stop drawing the patch line
    console.log(connectionStart, connectionEnd);

    if (connectionEnd && connectionStart) {
      // make connection
      makeConnection(connectionStart, connectionEnd);
    }

    setConnectionStart(null);
    setConnectionEnd(null);
  };

  const handleDeleteConnection = (connIdx: number) => {
    const [start, end] = connections[connIdx];

    const [startNode, startNodeType, _a] = start;
    const [endNode, _b, _c] = end;

    if (startNodeType === "output") {
      startNode.node.disconnect(endNode.node);
    } else {
      endNode.node.disconnect(startNode.node);
    }

    // setConnections((prev) => {
    //   return [...prev.slice(0, connIdx), ...prev.slice(connIdx + 1)];
    // });

    deleteConnection(connIdx);
  };

  const handleDeleteNode = (node: INode) => {
    // setGraph((prev) => {
    //   return prev.filter((n) => n.id !== node.id);
    // });

    // graph.map((n) => {
    //   if (n.id === node.id) {
    //     n.node.disconnect();
    //   }

    //   if (n.id === node.id) {
    //     n.node.disconnect();
    //   }
    // });

    // setConnections((prev) => {
    //   return prev.filter(([start, end]) => {
    //     return !(start[0].id === node.id || end[0].id === node.id);
    //   });
    // });
    deleteNode(node);
  };

  const renderNodes = useMemo(() => {
    return (
      <>
        {graph.map((node, i) => {
          return (
            <MyAudioNode
              key={node.id}
              node={node}
              inputMouseHandler={inputMouseHandler}
              outputMouseHandler={outputMouseHandler}
              deleteNode={handleDeleteNode}
            />
          );
        })}
      </>
    );
  }, [graph]);

  const handleMouseMove = (e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCreateNode = (
    d: string,
    nodeType: AudioNodeType,
    f: (ctx: AudioContext) => AudioNode
  ) => {
    if (!audioCtx) return;
    const node = f(audioCtx);

    console.log(
      "CREATING:",
      nodeType,
      d,
      node,
      node.constructor.name,
      Object.keys(node)
    );

    const newNode: INode<AudioNode> = {
      id: "id" + Math.random().toString(16).slice(2),
      name: d,
      audioNode: node,
      type: nodeType,
      inputRefs: Array(node.numberOfInputs).fill(createRef<HTMLDivElement>()),
      outputRefs: Array(node.numberOfOutputs).fill(createRef<HTMLDivElement>()),
    };

    // setGraph((g) => {
    //   return [
    //     ...g,
    //     {
    //       id: "id" + Math.random().toString(16).slice(2),
    //       name: d,
    //       node: node,
    //       type: nodeType,
    //       inputRefs: Array(node.numberOfInputs).fill(
    //         createRef<HTMLDivElement>()
    //       ),
    //       outputRefs: Array(node.numberOfOutputs).fill(
    //         createRef<HTMLDivElement>()
    //       ),
    //     },
    //   ];
    // });

    addNode(newNode);
  };

  return (
    <>
      <Head>
        <title>Web Audio Api Playground</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${styles.main} ${inter.className}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Header />
        <Dropdown title={"Add Node"}>
          {Object.entries(nodeOptions).map(([_, v], i) => {
            const { f, d, nodeType } = v;
            return (
              <button key={i} onClick={() => handleCreateNode(d, nodeType, f)}>
                {d}
              </button>
            );
          })}
        </Dropdown>
        {renderNodes}
        <SVGLayer
          mouseRef={mouseRef}
          connections={connections}
          connectionStart={connectionStart && getCoords(connectionStart)}
          deleteConnection={handleDeleteConnection}
        />
      </main>
    </>
  );
}
