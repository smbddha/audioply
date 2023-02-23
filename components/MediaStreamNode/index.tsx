import React, { useEffect } from "react";

// import ParamSlider from "@/uicomponents/paramslider";
// import SelectionDropdown from "@/uicomponents/SelectionDropdown";
// import SelectionDropdownItem from "@/uicomponents/SelectionDropdown/item";
// import Button from "@/uicomponents/button";
import { INode } from "@/types";
import { useStore } from "@/store";

// const AUDIO_FILES = ["irs/ir1.ogg", "irs/ir2.ogg"];

type Props = {
  node: INode<MediaStreamAudioSourceNode>;
};

const MediaStreamNode = (props: Props) => {
  const { node } = props;

  const context = useStore((state) => state.context);

  // const [isPlaying, setIsPlaying] = useState(false);

  // const [selectedFile, setSelectedFile] = useState(AUDIO_FILES[0]);
  // const inputFileRef = useRef<HTMLInputElement | null>(null);

  const remakeConnectionsWithNode = useStore(
    (state) => state.remakeConnectionsWithNode
  );

  useEffect(() => {
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        // const source = node.audioNode.context.create;
        console.log("HERE", stream);
        let source;
        if (context) {
          source = context.createMediaStreamSource(stream);
          node.audioNode = source;
          remakeConnectionsWithNode(node);
        }
      });
    }
  }, []);

  console.log("MEDIA STREAM");

  // useEffect(() => {
  //   const fetchIR = async () => {
  //     console.log("FETCHING");
  //     let response = await fetch(AUDIO_FILES[0]);
  //     let arraybuffer = await response.arrayBuffer();
  //     node.audioNode.buffer = await node.audioNode.context.decodeAudioData(
  //       arraybuffer
  //     );
  //   };

  //   if (!node.audioNode.buffer) fetchIR();
  // }, []);

  // const handleDetuneChange = (val: number): void => {
  //   node.audioNode.detune.value = val;
  // };

  // const handleFileChange = async (f: string) => {
  //   // need to create a new node on file change
  //   // node.audioNode.stop();
  //   setIsPlaying(false);

  //   const newBuff = node.audioNode.context.createBufferSource();
  //   newBuff.detune.value = node.audioNode.detune.value;
  //   // newBuff.buffer = node.audioNode.buffer;

  //   node.audioNode = newBuff;
  //   remakeConnectionsWithNode(node);

  //   // what
  //   let response = await fetch(f);
  //   let arraybuffer = await response.arrayBuffer();
  //   node.audioNode.buffer = await node.audioNode.context.decodeAudioData(
  //     arraybuffer
  //   );

  //   setSelectedFile(f);
  // };

  // const handlePlayToggle = () => {
  //   if (isPlaying) {
  //     node.audioNode.stop();

  //     const newBuff = node.audioNode.context.createBufferSource();
  //     newBuff.detune.value = node.audioNode.detune.value;
  //     newBuff.buffer = node.audioNode.buffer;

  //     node.audioNode = newBuff;

  //     remakeConnectionsWithNode(node);
  //   } else {
  //     node.audioNode.start();
  //   }

  //   setIsPlaying(!isPlaying);
  // };
  // const onUploadClick = (e: MouseEvent) => {
  //   if (!inputFileRef || !inputFileRef.current) return;

  //   e.stopPropagation();
  //   e.preventDefault();
  //   inputFileRef.current.click();
  // };

  // const handleUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
  //   e.stopPropagation();
  //   e.preventDefault();

  //   if (!e.target.files) return;
  //   const file = e.target.files[0];

  //   console.log(file);

  //   let reader = new FileReader();
  //   reader.readAsArrayBuffer(file);
  //   reader.onload = async (readerEvent: ProgressEvent<FileReader>) => {
  //     console.log("in onload");
  //     if (!readerEvent.target) return;

  //     let arraybuffer = readerEvent.target.result;
  //     if (!arraybuffer) return;
  //     if (typeof arraybuffer === "string") {
  //       // let arraybuffer: ArrayBuffer = readerEvent.target.result;
  //       console.log("AHH", arraybuffer);
  //     } else {
  //       console.log("loading audio data...");
  //       node.audioNode.buffer = await node.audioNode.context.decodeAudioData(
  //         arraybuffer
  //       );

  //       console.log("node.audioNode.buffer", node.audioNode.buffer);

  //       setSelectedFile(file.name);
  //     }
  //   };
  // };

  return <></>;
};

export default MediaStreamNode;
