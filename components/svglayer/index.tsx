import { useState, useEffect, RefObject } from "react";

import { ConnNode, Point } from "@/types";

// enum MouseState {
//   UP = "Up",
//   DOWN = "Down",
// }

// type SVGConn =

type Props = {
  mouseRef: RefObject<Point>;
  connections: [ConnNode, ConnNode][];
  connectionStart: Point | null;
  deleteConnection: (idx: number) => void;
};

const SVGLayer = (props: Props) => {
  const { mouseRef, connections, connectionStart, deleteConnection } = props;
  const [_, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getConnCoords = (start: ConnNode, end: ConnNode) => {
    const [startNode, startNodeType, startIdx] = start;
    const [endNode, endNodeType, endIdx] = end;

    const startRef =
      startNodeType === "input"
        ? startNode.inputRefs[startIdx]
        : startNode.outputRefs[startIdx];

    const endRef =
      endNodeType === "output"
        ? endNode.outputRefs[endIdx]
        : endNode.inputRefs[endIdx];

    // if (startInputIdx >= 0) {
    //   startRef = startNode.inputRefs[startInputIdx];
    // } else if (startOutputIdx >= 0) {
    //   startRef = startNode.outputRefs[startOutputIdx];
    // }

    // let endRef;
    // if (endInputIdx >= 0) {
    //   endRef = endNode.inputRefs[endInputIdx];
    // } else if (endOutputIdx >= 0) {
    //   endRef = endNode.outputRefs[endOutputIdx];
    // }

    const startRect = startRef.current?.getBoundingClientRect();
    const endRect = endRef.current?.getBoundingClientRect();

    return {
      x1: startRect?.x || 0,
      y1: startRect?.y || 0,
      x2: endRect?.x || 0,
      y2: endRect?.y || 0,
    };
  };

  const handleConnectionClick = (e: MouseEvent, connIdx: number) => {
    console.log("CLICKED ", connIdx);
    console.log("CONNECTIONS", connections);
    deleteConnection(connIdx);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "100%",
        width: "100%",
      }}
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
          <line
            x1={connectionStart.x}
            y1={connectionStart.y}
            x2={mouseRef.current?.x || 0}
            y2={mouseRef.current?.y || 0}
            stroke="red"
            strokeWidth={2}
          />
        ) : null}
        {connections.map((conn: [ConnNode, ConnNode], i) => {
          return (
            <>
              <line
                key={`${i}`}
                {...getConnCoords(conn[0], conn[1])}
                stroke="black"
                strokeWidth={2}
                onClick={(e) => handleConnectionClick(e, i)}
              />
              <line
                style={{ pointerEvents: "auto" }}
                key={`${i}_overlay`}
                {...getConnCoords(conn[0], conn[1])}
                stroke="red"
                strokeWidth={10}
                strokeOpacity={0.5}
                onClick={(e) => handleConnectionClick(e, i)}
              />
            </>
          );
        })}
      </svg>
    </div>
  );
};

export default SVGLayer;
