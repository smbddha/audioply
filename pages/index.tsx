import Head from "next/head";
import { Inter } from "@next/font/google";
import {
  useState,
  MouseEvent,
  RefObject,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import React from "react";

import { getCoords } from "@/utils";
import styles from "@/styles/Home.module.css";
import MyAudioNode from "@/components/MyAudioNode";

import { useStore } from "@/store";

import { INode, ConnNode, AudioNodeType } from "@/types";
import SVGLayer from "@/components/svglayer";
import Header from "@/components/Header";
// import Controls from "@/components/Controls";
import Footer from "@/components/Footer";
import Controls from "@/components/Controls";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // const audioCtx = useStore((state) => state.context);
  const graph = useStore((state) => state.nodes);
  // const addNode = useStore((state) => state.addNode);
  const deleteNode = useStore((state) => state.deleteNode);
  const addConnections = useStore((state) => state.addConnections);
  const deleteConnection = useStore((state) => state.deleteConnection);
  const showNodesPanel = useStore((state) => state.showNodesPanel);
  const toggleNodesPanel = useStore((state) => state.toggleNodesPanel);
  const reset = useStore((state) => state.reset);

  const mouseRef = useRef({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState<ConnNode | null>(null);
  const [connectionEnd, setConnectionEnd] = useState<ConnNode | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "c") {
        toggleNodesPanel();
      } else if (e.key === "r") {
        reset();
      }
    };
    window.addEventListener("keyup", handleKeyPress);

    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  const inputMouseHandler = useCallback(
    (
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
    },
    []
  );

  const outputMouseHandler = useCallback(
    (
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
    },
    []
  );

  const makeConnection = (start: ConnNode, end: ConnNode): boolean => {
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
    deleteConnection(connIdx);
  };

  const handleDeleteNode = useCallback((node: INode) => {
    deleteNode(node);
  }, []);

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
  }, [graph, inputMouseHandler, outputMouseHandler, handleDeleteNode]);

  const handleMouseMove = (e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleBackClick = () => {
    toggleNodesPanel();
  };

  return (
    <>
      <Head>
        <title>Web Audio Playground</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="A visual audio editor for exploring the Web Audio API's audio nodes."
        />
        <meta property="og:title" content="Web Audio Playground" key="title" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${styles.main} ${inter.className}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Header />
        {showNodesPanel ? <Controls /> : null}
        {renderNodes}
        <div
          onClick={handleBackClick}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1rem",
            fontWeight: "500",
            pointerEvents: "auto",
            zIndex: "100",
          }}
        >
          (+) click anywhere to add a node
        </div>
        <SVGLayer
          mouseRef={mouseRef}
          connectionStart={connectionStart && getCoords(connectionStart)}
          deleteConnection={handleDeleteConnection}
        />
        <Footer />
      </main>
    </>
  );
}
