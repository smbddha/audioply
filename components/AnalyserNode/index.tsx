import React, { useEffect, useRef, useState } from "react";

import { INode } from "@/types";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";
import SelectionDropdownItem from "@/uicomponents/SelectionDropdown/item";

type Props = {
  node: INode<AnalyserNode>;
};

// enum AnalyserTypes {
//   sin = "sine",
//   square = "square",
//   triangle = "triangle",
//   sawtooth = "sawtooth",
// }

const WIDTH = 400;
const HEIGHT = 400;

type ViewOptions = "wave" | "freq";
const VIEW_OPTIONS: ViewOptions[] = ["wave", "freq"];

const AnalyserNode = (props: Props) => {
  const { node } = props;

  const requestRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedView, setSelectedView] = useState<ViewOptions>("wave");

  const drawWave = () => {
    node.audioNode.fftSize = 2048;
    const bufferLength = node.audioNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    node.audioNode.getByteTimeDomainData(dataArray);

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

  const drawFreq = () => {
    node.audioNode.fftSize = 2048;
    const bufferLength = node.audioNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    node.audioNode.getByteFrequencyData(dataArray);

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

    // console.log(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 255;
      // const y = v * (HEIGHT / 2);
      const y = v * HEIGHT;

      if (i === 0) {
        canvasCtx.moveTo(x, HEIGHT);
      } else {
        canvasCtx.lineTo(x, HEIGHT - y);
      }

      x += sliceWidth;
    }
    // canvasCtx.lineTo(WIDTH, HEIGHT / 2);
    canvasCtx.stroke();
  };

  const animate = (f: () => void) => {
    const _animate = () => {
      f();

      requestRef.current = requestAnimationFrame(_animate);
    };
    requestRef.current = requestAnimationFrame(_animate);
  };

  useEffect(() => {
    // requestRef.current = requestAnimationFrame(animate);
    if (selectedView === "wave") {
      animate(drawWave);
    } else if (selectedView === "freq") {
      animate(drawFreq);
    }

    return () => cancelAnimationFrame(requestRef.current || 0);
  }, []);

  const handleViewChange = (newView: ViewOptions) => {
    //TODO restart animation with new draw function
    setSelectedView(newView);
    cancelAnimationFrame(requestRef.current || 0);

    if (newView === "wave") {
      animate(drawWave);
    } else if (newView === "freq") {
      animate(drawFreq);
    }
  };

  return (
    <>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}></canvas>
      <SelectionDropdown title={selectedView}>
        {VIEW_OPTIONS.map((opt, i) => {
          return (
            <SelectionDropdownItem
              key={i}
              handleClick={(_) => handleViewChange(opt)}
            >
              <span>{opt}</span>
            </SelectionDropdownItem>
          );
        })}
      </SelectionDropdown>
    </>
  );
};

export default AnalyserNode;
