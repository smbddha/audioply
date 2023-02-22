import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  MouseEvent,
} from "react";
import styles from "./ConvolverNode.module.css";

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
  const [isNormalized, setIsNormalized] = useState(node.audioNode.normalize);
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

    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async (readerEvent: ProgressEvent<FileReader>) => {
      if (!readerEvent.target) return;

      let arraybuffer = readerEvent.target.result;
      if (!arraybuffer) return;
      if (typeof arraybuffer === "string") {
        // let arraybuffer: ArrayBuffer = readerEvent.target.result;
        // TODO handle invalid arraybuffer result
      } else {
        node.audioNode.buffer = await node.audioNode.context.decodeAudioData(
          arraybuffer
        );

        setSelectedFile(file.name);
      }
    };
  };

  const handleNormalizeToggle = () => {
    node.audioNode.normalize = !isNormalized;
    console.log(node.audioNode);
    setIsNormalized(!isNormalized);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "1rem",
          gap: "1rem",
        }}
      >
        <div
          className={`${styles.checkmark} ${isNormalized ? styles.filled : ""}`}
          onClick={handleNormalizeToggle}
        ></div>
        <span>normalize</span>
      </div>
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
