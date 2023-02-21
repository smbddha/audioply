import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  MouseEvent,
} from "react";

// import ParamSlider from "@/uicomponents/paramslider";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";
import SelectionDropdownItem from "@/uicomponents/SelectionDropdown/item";
import { INode } from "@/types";

const IR_FILES = ["irs/ir1.ogg", "irs/ir2.ogg"];

type Props = {
  node: INode<ConvolverNode>;
};

const ConvolverNode = (props: Props) => {
  const { node } = props;

  const [selectedFile, setSelectedFile] = useState(IR_FILES[0]);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchIR = async () => {
      let response = await fetch(IR_FILES[0]);
      let arraybuffer = await response.arrayBuffer();
      node.audioNode.buffer = await node.audioNode.context.decodeAudioData(
        arraybuffer
      );
    };

    fetchIR();
  }, [node]);

  const handleFileChange = async (f: string) => {
    // what
    let response = await fetch(f);
    let arraybuffer = await response.arrayBuffer();
    node.audioNode.buffer = await node.audioNode.context.decodeAudioData(
      arraybuffer
    );

    setSelectedFile(f);
  };

  const onUploadClick = (e: MouseEvent) => {
    if (!inputFileRef || !inputFileRef.current) return;

    e.stopPropagation();
    e.preventDefault();
    inputFileRef.current.click();
  };

  const handleUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!e.target.files) return;
    const file = e.target.files[0];

    console.log(file);

    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async (readerEvent: ProgressEvent<FileReader>) => {
      console.log("in onload");
      if (!readerEvent.target) return;

      let arraybuffer = readerEvent.target.result;
      if (!arraybuffer) return;
      if (typeof arraybuffer === "string") {
        // let arraybuffer: ArrayBuffer = readerEvent.target.result;
        console.log("AHH", arraybuffer);
      } else {
        console.log("loading audio data...");
        node.audioNode.buffer = await node.audioNode.context.decodeAudioData(
          arraybuffer
        );

        console.log("node.audioNode.buffer", node.audioNode.buffer);

        setSelectedFile(file.name);
      }
    };
  };

  return (
    <>
      <SelectionDropdown title={selectedFile}>
        {IR_FILES.map((f, i) => {
          return (
            <SelectionDropdownItem
              key={i}
              handleClick={(e) => handleFileChange(f)}
            >
              <span>{f}</span>
            </SelectionDropdownItem>
          );
        })}

        <SelectionDropdownItem handleClick={onUploadClick}>
          <span>Load file...</span>
        </SelectionDropdownItem>
      </SelectionDropdown>
      <input
        type="file"
        id="file"
        ref={inputFileRef}
        style={{ display: "none" }}
        onChange={handleUploadChange}
      />
    </>
  );
};

export default ConvolverNode;
