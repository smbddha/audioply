import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { useImmerReducer } from "use-immer";
import { Bezier } from "bezier-js";

// import ParamSlider from "@/uicomponents/paramslider";
// import SelectionDropdown from "@/uicomponents/SelectionDropdown";
import { INode } from "@/types";

const WIDTH = 400;
const HEIGHT = 400;

const MARGIN = 20;

type Point = {
  x: number;
  y: number;
};

type ControlPoint = {
  a: Point;
  handle1: Point;
  handle2: Point;
};

type Props = {
  node: INode<WaveShaperNode>;
};

type OversampleOpts = "none" | "2x" | "4x";
const oversampleOpts: OversampleOpts[] = ["none", "2x", "4x"];

// const makePoint

function dist(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2.0, false);

  ctx.fillStyle = "rgb(100,100,200)";
  ctx.fill();
  // ctx.lineWidth
}

type State = {
  points: Point[];
  handles: Point[];
  selectedPoint: number | null;
  selectedHandle: number | null;
  isDragging: boolean;
};

const initialState: State = {
  points: [
    { x: MARGIN, y: HEIGHT - MARGIN },
    { x: WIDTH / 2, y: HEIGHT / 2 },
    { x: WIDTH - MARGIN, y: MARGIN },
  ],
  handles: [
    { x: WIDTH / 4, y: HEIGHT - MARGIN },
    { x: WIDTH / 2, y: 3 * (HEIGHT / 4) },
    { x: WIDTH / 2, y: HEIGHT / 4 },
    { x: 3 * (WIDTH / 4), y: MARGIN },
  ],
  selectedPoint: null,
  selectedHandle: null,
  isDragging: false,
};

type MoveSelectedAction = {
  type: "MOVE_SELECTED";
  payload: Point;
};

type SelectPointAction = {
  type: "SELECT_POINT";
  payload: { idx: number };
};

type SelectHandleAction = {
  type: "SELECT_HANDLE";
  payload: { idx: number };
};

type EndDragAction = {
  type: "END_DRAG";
};

type Actions =
  | MoveSelectedAction
  | SelectPointAction
  | SelectHandleAction
  | EndDragAction;

function reducer(draft: State, action: Actions) {
  switch (action.type) {
    // case "ADD_POINT":
    //   break;
    // case "MOVE_POINT":
    //   draft.points[payload.idx] = { x: payload.x, y: payload.y };
    //   return draft;
    case "MOVE_SELECTED":
      // const { idx, hidx, x, y } = action.payload;

      // console.log("MOVE", action.payload);

      if (draft.selectedPoint !== null) {
        if (draft.selectedPoint === 0) {
          draft.points[draft.selectedPoint] = {
            x: MARGIN,
            y: action.payload.y,
          };
        } else if (draft.selectedPoint === draft.points.length - 1) {
          draft.points[draft.selectedPoint] = {
            x: WIDTH - MARGIN,
            y: action.payload.y,
          };
        } else {
          draft.points[draft.selectedPoint] = {
            x: action.payload.x,
            y: action.payload.y,
          };
        }
      }

      if (draft.selectedHandle !== null) {
        draft.handles[draft.selectedHandle] = {
          x: action.payload.x,
          y: action.payload.y,
        };
      }

      return draft;

    case "SELECT_POINT":
      console.log("selected point: ", action.payload.idx);
      draft.selectedPoint = action.payload.idx;
      draft.selectedHandle = null;
      draft.isDragging = true;
      return draft;

    case "SELECT_HANDLE":
      console.log("selected handled: ", action.payload.idx);
      draft.selectedHandle = action.payload.idx;
      draft.selectedPoint = null;
      draft.isDragging = true;
      return draft;

    case "END_DRAG":
      draft.selectedHandle = null;
      draft.selectedPoint = null;
      draft.isDragging = false;
      return draft;
  }
}

const WaveshaperNode = (props: Props) => {
  const { node } = props;

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const [oversampleOpt, setOversampleOpt] = useState(
    node.audioNode.oversample as OversampleOpts
  );

  const requestRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setCurve = () => {
    const numSteps = 100;
    const stepSize = (WIDTH - MARGIN * 2) / numSteps;
    let pointIdx = 1;

    let curP1 = state.points[pointIdx - 1];
    let curP2 = state.points[pointIdx];
    let curH1 = state.handles[2 * (pointIdx - 1)];
    let curH2 = state.handles[2 * (pointIdx - 1) + 1];

    let points: number[] = new Array(100);
    let curBezier = new Bezier(curP1, curH1, curH2, curP2);
    for (let i = 0; i < numSteps; i++) {
      if (i * stepSize + MARGIN > curP2.x) {
        pointIdx += 1;

        curP1 = state.points[pointIdx - 1];
        curP2 = state.points[pointIdx];
        curH1 = state.handles[2 * (pointIdx - 1)];
        curH2 = state.handles[2 * (pointIdx - 1) + 1];

        // console.log("NEXT", pointIdx, curP1, curP1, curP2, curP2);
        curBezier = new Bezier(curP1, curH1, curH2, curP2);
      }

      const intersect = curBezier.intersects({
        p1: { x: MARGIN + i * stepSize, y: 0 },
        p2: { x: MARGIN + i * stepSize, y: HEIGHT },
      });

      let isct = intersect[0];
      if (typeof isct === "number") {
        const p = curBezier.get(isct);

        if (intersect) {
          // console.log("INTERSECTS", intersect, curBezier.get(intersect[0]));
          // console.log(b);
        }

        points[i] = p.y / HEIGHT;
      }

      // points = points.concat(
      //   b
      //     .getLUT(10)
      //     .map((p: { x: number; y: number; t: number }) => p.x / HEIGHT)
      // );
    }

    // console.log(points);

    // console.log("CURVE", points);
    node.audioNode.curve = new Float32Array(points);
    // return points;
  };

  const draw = () => {
    if (!canvasRef.current) return;

    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) return;

    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";
    canvasCtx.beginPath();

    for (let i = 0; i < state.points.length; i++) {
      const { x, y } = state.points[i];

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        const h1 = state.handles[2 * (i - 1)];
        const h2 = state.handles[2 * (i - 1) + 1] || { x, y };

        canvasCtx.bezierCurveTo(h1.x, h1.y, h2.x, h2.y, x, y);
        // canvasCtx.lineTo(x, y);
        canvasCtx.moveTo(x, y);
      }
    }

    canvasCtx.stroke();

    // draw handles
    for (let i = 0; i < state.points.length; i++) {
      const a = state.points[i];

      const h1 = i === 0 ? state.handles[0] : state.handles[i * 2 - 1];

      let h2;
      if (state.handles.length > i * 2) {
        h2 = state.handles[i * 2];
      }

      canvasCtx.strokeStyle = "rgb(255, 0, 0)";
      canvasCtx.beginPath();
      canvasCtx.moveTo(h1.x, h1.y);
      canvasCtx.lineTo(a.x, a.y);

      if (h2) {
        canvasCtx.lineTo(h2.x, h2.y);
      }

      canvasCtx.stroke();

      drawCircle(canvasCtx, a.x, a.y, 4);
      drawCircle(canvasCtx, h1.x, h1.y, 4);

      if (h2) {
        drawCircle(canvasCtx, h2.x, h2.y, 4);
      }
    }

    // const numSteps = 100;
    // const stepSize = (WIDTH - MARGIN * 2) / numSteps;

    // const pts = setCurve();

    // canvasCtx.strokeStyle = "rgb(255, 0, 0)";
    // for (let i = 0; i < pts.length; i++) {
    //   drawCircle(canvasCtx, stepSize * i + MARGIN, pts[i], 4);
    //   canvasCtx.stroke();
    // }
  };

  useEffect(() => {
    draw();
    setCurve();
  }, [state]);

  useEffect(() => {}, []);

  const animate = () => {
    // if (requestRef.current) {
    //   cancelAnimationFrame(requestRef.current);
    // }

    draw();
    requestRef.current = requestAnimationFrame(animate);
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    console.log("IN MOUSE DOWN");

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("mouse down: x: " + x + " y: " + y);

    const clickRadius = 6;
    for (let i = 0; i < state.points.length; i++) {
      const a = state.points[i];

      if (dist(a.x, a.y, x, y) < clickRadius) {
        console.log("clicked point: ", i);
        dispatch({
          type: "SELECT_POINT",
          payload: { idx: i },
        });
      }
    }

    for (let i = 0; i < state.handles.length; i++) {
      const h = state.handles[i];
      if (dist(h.x, h.y, x, y) < clickRadius) {
        dispatch({
          type: "SELECT_HANDLE",
          payload: { idx: i },
        });
      }
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    console.log("MOUSE UP");

    // setIsDragging(false);
    // setSelectedPoint(null);
    dispatch({
      type: "END_DRAG",
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!state.isDragging) return;

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // setPoints((prev) => {
    //   const [i, p] = selectedPoint;
    //   return [
    //     ...prev.slice(0, i),
    //     { ...prev[i], [p]: { x, y } },
    //     ...prev.slice(i + 1),
    //   ];
    // });

    dispatch({
      type: "MOVE_SELECTED",
      payload: { x, y },
    });
  };

  // const handleClick = (e: MouseEvent) => {
  //   console.log("CLICKED ");
  //   if (!canvasRef.current) return;
  // };

  const handleClick = (e: MouseEvent) => {
    console.log("CLICKED ");
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
    // setPoints((prev) => {
    //   return [...prev, [x, y]];
    // });
    // if (requestRef.current) {
    //   cancelAnimationFrame(requestRef.current);
    // }
    // animate();
  };

  return (
    <>
      <canvas
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
      ></canvas>
    </>
  );
};

export default WaveshaperNode;
