import React, { useEffect, useRef } from "react";

type Props = {
  node: AnalyserNode;
};

// enum AnalyserTypes {
//   sin = "sine",
//   square = "square",
//   triangle = "triangle",
//   sawtooth = "sawtooth",
// }

const WIDTH = 400;
const HEIGHT = 400;

const AnalyserNode = (props: Props) => {
  const { node } = props;

  const requestRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    node.fftSize = 2048;
    const bufferLength = node.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    node.getByteTimeDomainData(dataArray);

    if (!canvasRef.current) return;

    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) return;

    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";
    canvasCtx.beginPath();
    const sliceWidth = WIDTH / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * (HEIGHT / 2);

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }
    canvasCtx.lineTo(WIDTH, HEIGHT / 2);
    canvasCtx.stroke();
  };

  const animate = () => {
    draw();
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current || 0);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
    </>
  );
};

export default AnalyserNode;
