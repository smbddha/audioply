import React, { useState, useRef } from "react";

import ParamSlider from "@/uicomponents/paramslider";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";
import { INode } from "@/types";

const WIDTH = 400;
const HEIGHT = 400;

type Props = {
  node: INode<WaveShaperNode>;
};

type OversampleOpts = "none" | "2x" | "4x";
const oversampleOpts: OversampleOpts[] = ["none", "2x", "4x"];

const WaveshaperNode = (props: Props) => {
  const { node } = props;

  const [oversampleOpt, setOversampleOpt] = useState(
    node.audioNode.oversample as OversampleOpts
  );

  const requestRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // const draw = () => {
  //   node.audioNode.fftSize = 2048;
  //   const bufferLength = node.audioNode.frequencyBinCount;
  //   const dataArray = new Uint8Array(bufferLength);

  //   node.audioNode.getByteTimeDomainData(dataArray);

  //   if (!canvasRef.current) return;

  //   const canvasCtx = canvasRef.current.getContext("2d");
  //   if (!canvasCtx) return;

  //   canvasCtx.fillStyle = "rgb(200, 200, 200)";
  //   canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
  //   canvasCtx.lineWidth = 2;
  //   canvasCtx.strokeStyle = "rgb(0, 0, 0)";
  //   canvasCtx.beginPath();
  //   const sliceWidth = WIDTH / bufferLength;
  //   let x = 0;

  //   for (let i = 0; i < bufferLength; i++) {
  //     const v = dataArray[i] / 128.0;
  //     const y = v * (HEIGHT / 2);

  //     if (i === 0) {
  //       canvasCtx.moveTo(x, y);
  //     } else {
  //       canvasCtx.lineTo(x, y);
  //     }

  //     x += sliceWidth;
  //   }
  //   canvasCtx.lineTo(WIDTH, HEIGHT / 2);
  //   canvasCtx.stroke();
  // };

  // const animate = () => {
  //   draw();
  //   requestRef.current = requestAnimationFrame(animate);
  // };

  return (
    <>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
    </>
  );
};

export default WaveshaperNode;
