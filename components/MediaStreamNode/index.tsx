import React, { useEffect, useRef, useState } from "react";

import { INode } from "@/types";
import { useStore } from "@/store";
import Button from "@/uicomponents/button";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";
import SelectionDropdownItem from "@/uicomponents/SelectionDropdown/item";

// Hot-swaps `node.audioNode` (placeholder -> real source), the codebase's
// audioNode-replacement idiom; React 19's immutability lint flags it, so disable here.
/* eslint-disable react-hooks/immutability */

type Props = {
  node: INode<AudioNode>;
};

type MicStatus = "idle" | "prompting" | "live" | "denied" | "unsupported";

const METER_WIDTH = 180;
const METER_HEIGHT = 10;

const MediaStreamNode = (props: Props) => {
  const { node } = props;

  const context = useStore((state) => state.context);
  const remakeConnectionsWithNode = useStore(
    (state) => state.remakeConnectionsWithNode
  );

  const [status, setStatus] = useState<MicStatus>(() =>
    typeof navigator !== "undefined" && navigator.mediaDevices
      ? "idle"
      : "unsupported"
  );
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const meterRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const drawMeter = () => {
    const analyser = meterRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const buf = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buf);

    // RMS of the centered (-1..1) waveform → a rough input level.
    let sumSq = 0;
    for (let i = 0; i < buf.length; i++) {
      const v = (buf[i] - 128) / 128;
      sumSq += v * v;
    }
    const level = Math.min(1, Math.sqrt(sumSq / buf.length) * 2.5);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillRect(0, 0, METER_WIDTH, METER_HEIGHT);
    ctx.fillStyle = level > 0.9 ? "rgb(220, 40, 40)" : "rgb(40, 180, 80)";
    ctx.fillRect(0, 0, level * METER_WIDTH, METER_HEIGHT);
  };

  const startMeter = () => {
    const loop = () => {
      drawMeter();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const acquire = async (deviceId?: string) => {
    if (!context || !navigator.mediaDevices) {
      setStatus("unsupported");
      return;
    }

    setStatus("prompting");
    try {
      // Autoplay policy: the AudioContext may start suspended until a gesture.
      if (context.state === "suspended") await context.resume();

      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
      });
      streamRef.current = stream;

      // Disconnect the current node (placeholder, or prior source) before replacing it.
      node.audioNode.disconnect();

      const source = context.createMediaStreamSource(stream);
      sourceRef.current = source;
      node.audioNode = source;
      remakeConnectionsWithNode(node);

      // Dead-end analyser tap for the level meter; not routed onward.
      if (!meterRef.current) {
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        meterRef.current = analyser;
        startMeter();
      }
      source.connect(meterRef.current);

      // Labels are only populated once permission has been granted.
      const all = await navigator.mediaDevices.enumerateDevices();
      const inputs = all.filter((d) => d.kind === "audioinput");
      setDevices(inputs);
      setSelectedDeviceId(
        stream.getAudioTracks()[0]?.getSettings().deviceId ??
          inputs[0]?.deviceId ??
          null
      );

      setMuted(false);
      setStatus("live");
    } catch (err) {
      console.error("getUserMedia failed", err);
      stopStream();
      setStatus("denied");
    }
  };

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    acquire(deviceId);
  };

  const handleMuteToggle = () => {
    const next = !muted;
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !next));
    setMuted(next);
  };

  // Release the mic and tear down the meter when the node is removed.
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      sourceRef.current?.disconnect();
      meterRef.current?.disconnect();
      stopStream();
    };
  }, []);

  if (status === "unsupported") {
    return (
      <div style={{ margin: "0.3rem", fontSize: "0.8rem" }}>
        Microphone input is not available in this browser.
      </div>
    );
  }

  if (status === "idle" || status === "prompting") {
    return (
      <div style={{ margin: "0.3rem" }}>
        <Button handleClick={() => acquire()}>
          {status === "prompting" ? "Requesting…" : "Enable mic"}
        </Button>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div style={{ margin: "0.3rem" }}>
        <div style={{ fontSize: "0.8rem", marginBottom: "0.3rem" }}>
          Mic access was blocked. Allow it, then retry.
        </div>
        <Button handleClick={() => acquire(selectedDeviceId ?? undefined)}>
          Retry
        </Button>
      </div>
    );
  }

  // status === "live"
  const selectedDevice = devices.find((d) => d.deviceId === selectedDeviceId);
  return (
    <>
      <canvas
        ref={canvasRef}
        width={METER_WIDTH}
        height={METER_HEIGHT}
        style={{ margin: "0.3rem", display: "block" }}
      ></canvas>
      <div style={{ margin: "0.3rem" }}>
        <Button handleClick={handleMuteToggle}>
          {muted ? "Unmute" : "Mute"}
        </Button>
      </div>
      {devices.length > 1 ? (
        <SelectionDropdown title={selectedDevice?.label || "Input device"}>
          {devices.map((d, i) => (
            <SelectionDropdownItem
              key={d.deviceId || i}
              handleClick={() => handleDeviceChange(d.deviceId)}
            >
              <span>{d.label || `Input ${i + 1}`}</span>
            </SelectionDropdownItem>
          ))}
        </SelectionDropdown>
      ) : null}
    </>
  );
};

export default MediaStreamNode;
