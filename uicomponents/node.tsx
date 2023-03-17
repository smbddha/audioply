import React, {
  PropsWithChildren,
  RefObject,
  MouseEvent,
  useRef,
  forwardRef,
} from "react";
import Draggable from "react-draggable";

import { INode } from "@/types";
import styles from "./Node.module.css";

type InputOutputProps = {
  mouseHandler: (e: MouseEvent) => void;
  isOutput: boolean;
};

// forward ref so we can pass a pre-created refobject
const InputOutputNode = forwardRef<HTMLDivElement, InputOutputProps>(
  function InputOutputNode(props, ref) {
    const { mouseHandler, isOutput } = props;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {isOutput ? <span>out</span> : null}
        <div
          className={`${styles.inputoutput} ${
            isOutput ? styles.output : styles.input
          }`}
          ref={ref}
          style={
            {
              // transform: `translate(${isOutput ? "0.2rem" : "-0.2rem"}, 0rem)`,
            }
          }
          onMouseDown={(e) => mouseHandler(e)}
          onMouseEnter={(e) => mouseHandler(e)}
          onMouseLeave={(e) => mouseHandler(e)}
        >
          {/*
<svg style={{ cursor: "pointer" }} width={19} height={19}>
          {isOutput ? (
            <polygon points="18,0 0,9 18,18" fill="black" />
          ) : (
            <polygon points="0,0 18,9 0,18" fill="black" />
          )}
        </svg>
	  */}
        </div>
        {isOutput ? null : <span>in</span>}
      </div>
    );
  }
);

type Props = {
  node: INode;
  inputMouseHandler: (
    a: MouseEvent,
    b: INode,
    c: number,
    d: RefObject<HTMLDivElement>
  ) => void;
  outputMouseHandler: (
    a: MouseEvent,
    b: INode,
    c: number,
    d: RefObject<HTMLDivElement>
  ) => void;
  deleteNode: (a: INode) => void;
};

const Node = (props: PropsWithChildren<Props>) => {
  const { node, inputMouseHandler, outputMouseHandler, deleteNode, children } =
    props;
  const nodeRef = useRef(null);

  const handleDelete = () => {
    deleteNode(node);
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".handle">
      <div
        ref={nodeRef}
        style={{
          zIndex: "1000",
          border: "3px solid black",
          display: "flex",
          flexDirection: "column",
          // gap: "6px",
          backgroundColor: "white",
          color: "black",
          minWidth: "14rem",
          position: "absolute",
          fontSize: "0.8rem",
          top: "45%",
          left: "45%",
        }}
      >
        <div
          className="handle"
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "3px solid black",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              paddingLeft: "0.3rem",
              paddingTop: "0.1rem",
              fontWeight: "600",
              fontSize: "0.8rem",
            }}
          >
            {node.name}
          </span>
          <div
            style={{
              padding: "2px",
              borderLeft: "3px solid black",
              width: "2rem",
              textAlign: "center",
            }}
            onClick={handleDelete}
          >
            <button
              style={{
                background: "none",
                color: "inherit",
                textDecoration: "none",
                border: "0px solid transparent",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            gap: "4px",
            paddingTop: "8px",
            paddingBottom: "8px",
            justifyContent: "space-between",
          }}
        >
          <div>
            {node.inputRefs.map((ref, i) => {
              return (
                <InputOutputNode
                  key={i}
                  ref={ref}
                  mouseHandler={(e) => inputMouseHandler(e, node, i, ref)}
                  isOutput={false}
                />
              );
            })}
          </div>
          <div>
            {node.outputRefs.map((ref, i) => {
              return (
                <InputOutputNode
                  key={i}
                  ref={ref}
                  mouseHandler={(e) => outputMouseHandler(e, node, i, ref)}
                  isOutput={true}
                />
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // padding: "4px",
            gap: "6px",
          }}
        >
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export default Node;
