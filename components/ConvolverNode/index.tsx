import React, { useState, useEffect } from "react";

// import ParamSlider from "@/uicomponents/paramslider";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";

const IR_FILES = ["irs/ir1.ogg", "irs/ir2.ogg"];

type Props = {
  node: ConvolverNode;
};

const ConvolverNode = (props: Props) => {
  const { node } = props;

  const [selectedFile, setSelectedFile] = useState(IR_FILES[0]);

  useEffect(() => {
    const fetchIR = async () => {
      let response = await fetch(IR_FILES[0]);
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

  return (
    <>
      <SelectionDropdown
        title={selectedFile}
        items={IR_FILES}
        handleClick={(it, i) => handleFileChange(it)}
      />
    </>
  );
};

export default ConvolverNode;
