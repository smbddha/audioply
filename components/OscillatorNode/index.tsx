import React, { useState } from "react";

import ParamSlider from "@/uicomponents/paramslider";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";
import SelectionDropdownItem from "@/uicomponents/SelectionDropdown/item";
import Button from "@/uicomponents/button";
import { INode } from "@/types";
import { useStore } from "@/store";

type Props = {
  node: INode<OscillatorNode>;
};

const oscillatorTypes: OscillatorType[] = [
  "sine",
  "square",
  "triangle",
  "sawtooth",
  "custom",
];

const OscillatorNode = (props: Props) => {
  const { node } = props;

  const [isPlaying, setIsPlaying] = useState(false);
  const [oscType, setOscType] = useState(node.audioNode.type);

  const remakeConnectionsWithNode = useStore(
    (state) => state.remakeConnectionsWithNode
  );

  const handleFreqChange = (val: number): void => {
    node.audioNode.frequency.value = val;
  };

  const handleDetuneChange = (val: number): void => {
    node.audioNode.detune.value = val;
  };

  const handleOscTypeChange = (newType: OscillatorType): void => {
    node.audioNode.type = newType;
    setOscType(newType);
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      node.audioNode.stop();

      // TODO create new audioOsc
      const newOsc = node.audioNode.context.createOscillator();
      newOsc.frequency.value = node.audioNode.frequency.value;
      newOsc.detune.value = node.audioNode.detune.value;
      newOsc.type = node.audioNode.type;

      // updateOsc()
      // TODO eventually do this mutation in state, dont think
      // it actually matters tho :)
      node.audioNode = newOsc;

      // remake all audionode connections with the new node
      remakeConnectionsWithNode(node);
    } else {
      node.audioNode.start();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <ParamSlider
        title="Freq"
        audioParam={node.audioNode.frequency}
        handleChange={handleFreqChange}
        limits={[0, 20000]}
        unit="hz"
      />
      <ParamSlider
        title="Detune"
        audioParam={node.audioNode.detune}
        handleChange={handleDetuneChange}
        limits={[-1200, 1200]}
        unit="cents"
      />

      <div style={{ margin: "0.3rem" }}>
        <Button handleClick={handlePlayToggle}>
          {isPlaying ? "Stop" : "Play"}
        </Button>
      </div>
      <SelectionDropdown title={oscType}>
        {oscillatorTypes.map((oType, i) => {
          return (
            <SelectionDropdownItem
              key={i}
              handleClick={(e) => handleOscTypeChange(oType)}
            >
              <span>{oType}</span>
            </SelectionDropdownItem>
          );
        })}
      </SelectionDropdown>
    </>
  );
};

export default OscillatorNode;
