import React, {
  PropsWithChildren,
  RefObject,
  MouseEvent,
  useRef,
  forwardRef,
} from "react";
import Draggable from "react-draggable";

import { INode } from "@/types";

type InputOutputProps = {
  // ref: RefObject<HTMLDivElement | undefined>;
  mouseHandler: (e: MouseEvent) => void;
  isOutput: boolean;
};

const InputOutputNode = forwardRef<HTMLDivElement, InputOutputProps>(
  function InputOutputNode(props, ref) {
    // const iref = useRef<HTMLDivElement>(ref);
    const { mouseHandler, isOutput } = props;

    return (
      <div
        ref={ref}
        style={{
          transform: `translate(${isOutput ? "0.2rem" : "-0.2rem"}, 0rem)`,
        }}
        onMouseDown={(e) => mouseHandler(e)}
        onMouseEnter={(e) => mouseHandler(e)}
        onMouseLeave={(e) => mouseHandler(e)}
      >
        <svg width={19} height={19}>
          {isOutput ? (
            <polygon points="18,0 0,9 18,18" fill="black" />
          ) : (
            <polygon points="0,0 18,9 0,18" fill="black" />
          )}
        </svg>
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

/*
	node has the event handers for making connections, but how is it aware of
	the node that is passed to it ...
	there needs to be some default connect and disconnect feature ...

	so what if we had a container node and then the inner part of the node ..

	Node -> OscillatorNode

	<Node node={node} eventHandler={asdf} />
	<div>
	<OscillatorNode/>
	</div>
*/

const Node = (props: PropsWithChildren<Props>) => {
  const { node, inputMouseHandler, outputMouseHandler, deleteNode, children } =
    props;
  const nodeRef = useRef(null);

  const handleDelete = () => {
    //TODO remove connections	 to and from this node
    deleteNode(node);
  };

  return (
    <Draggable
      defaultPosition={{ x: 50, y: 50 }}
      nodeRef={nodeRef}
      handle=".handle"
    >
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
          minWidth: "16rem",
          position: "absolute",
        }}
      >
        <div
          className="handle"
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottom: "4px solid black",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              paddingLeft: "1px",
              fontWeight: "600",
              fontSize: "1.2rem",
            }}
          >
            {node.name}
          </span>
          <div
            style={{
              padding: "4px",
              borderLeft: "4px solid black",
              width: "2rem",
              textAlign: "center",
            }}
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
              onClick={handleDelete}
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
            gap: "8px",
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
