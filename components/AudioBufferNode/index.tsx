import React, { useState, useEffect } from "react";

import SelectionDropdown from "@/uicomponents/SelectionDropdown";
import Button from "@/uicomponents/button";

const AUDIO_FILES = ["sounds/test1.ogg", "sounds/test2.ogg"];

type Props = {
  node: AudioBufferSourceNode;
};

const AudioBufferNode = (props: Props) => {
  const { node } = props;

  const [isPlaying, setIsPlaying] = useState(false);

  const [selectedFile, setSelectedFile] = useState(AUDIO_FILES[0]);

  useEffect(() => {
    const fetchIR = async () => {
      let response = await fetch(AUDIO_FILES[0]);
      let arraybuffer = await response.arrayBuffer();
      node.buffer = await node.context.decodeAudioData(arraybuffer);
    };

    fetchIR();
  }, [node]);

  const handleFileChange = async (f: string) => {
    // what
    let response = await fetch(f);
    let arraybuffer = await response.arrayBuffer();
    node.buffer = await node.context.decodeAudioData(arraybuffer);

    setSelectedFile(f);
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      node.stop();
    } else {
      node.start();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <div style={{ margin: "0.3rem" }}>
        <Button handleClick={handlePlayToggle}>
          {isPlaying ? "Stop" : "Play"}
        </Button>
      </div>
      <SelectionDropdown
        title={selectedFile}
        items={AUDIO_FILES}
        handleClick={(it, i) => handleFileChange(it)}
      />
    </>
  );
};

export default AudioBufferNode;
