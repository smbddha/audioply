import Head from "next/head";
import { Inter } from "@next/font/google";
import {
  useState,
  MouseEvent,
  RefObject,
  useRef,
  useMemo,
  useCallback,
} from "react";
import React from "react";

import { getCoords } from "@/utils";
import styles from "@/styles/Home.module.css";
import MyAudioNode from "@/components/MyAudioNode";

import { useStore } from "@/store";

import { INode, ConnNode } from "@/types";
import SVGLayer from "@/components/svglayer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Controls from "@/components/Controls";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const graph = useStore((state) => state.nodes);
  const deleteNode = useStore((state) => state.deleteNode);
  const addConnections = useStore((state) => state.addConnections);

  const mouseRef = useRef({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState<ConnNode | null>(null);
  const [connectionEnd, setConnectionEnd] = useState<ConnNode | null>(null);

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
      } else if (e.type === "mouseleave") {
        setConnectionEnd(null);
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
      } else if (e.type === "mouseleave") {
        setConnectionEnd(null);
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
    if (connectionEnd && connectionStart) {
      // make connection
      makeConnection(connectionStart, connectionEnd);
    }

    setConnectionStart(null);
    setConnectionEnd(null);
  };

  const handleDeleteNode = useCallback(
    (node: INode) => {
      deleteNode(node);
    },
    [deleteNode]
  );

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
        <Controls />
        {renderNodes}
        <SVGLayer
          mouseRef={mouseRef}
          connectionStart={connectionStart && getCoords(connectionStart)}
        />
        <Footer />
      </main>
    </>
  );
}
