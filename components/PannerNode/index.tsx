import React, { useState } from "react";

import ParamSlider from "@/uicomponents/paramslider";
import SelectionDropdown from "@/uicomponents/SelectionDropdown";
import SelectionDropdownItem from "@/uicomponents/SelectionDropdown/item";
import { INode } from "@/types";

// Param edits mutate node.audioNode.* — the app's audio-control idiom (see
// BiquadFilterNode); React 19's immutability lint flags it, so disable here.
/* eslint-disable react-hooks/immutability */

type Props = {
  node: INode<PannerNode>;
};

const panningModels: PanningModelType[] = ["equalpower", "HRTF"];

const POSITION_LIMITS: [number, number] = [-10, 10];

const PannerNode = (props: Props) => {
  const { node } = props;

  const [panningModel, setPanningModel] = useState(node.audioNode.panningModel);

  const handlePositionXChange = (val: number): void => {
    node.audioNode.positionX.value = val;
  };

  const handlePositionYChange = (val: number): void => {
    node.audioNode.positionY.value = val;
  };

  const handlePositionZChange = (val: number): void => {
    node.audioNode.positionZ.value = val;
  };

  const handlePanningModelChange = (newModel: PanningModelType): void => {
    node.audioNode.panningModel = newModel;
    setPanningModel(newModel);
  };

  return (
    <>
      <ParamSlider
        title="Pos X"
        audioParam={node.audioNode.positionX}
        handleChange={handlePositionXChange}
        limits={POSITION_LIMITS}
      />
      <ParamSlider
        title="Pos Y"
        audioParam={node.audioNode.positionY}
        handleChange={handlePositionYChange}
        limits={POSITION_LIMITS}
      />
      <ParamSlider
        title="Pos Z"
        audioParam={node.audioNode.positionZ}
        handleChange={handlePositionZChange}
        limits={POSITION_LIMITS}
      />
      <SelectionDropdown title={panningModel}>
        {panningModels.map((model, i) => (
          <SelectionDropdownItem
            key={i}
            handleClick={(_) => handlePanningModelChange(model)}
          >
            <span>{model}</span>
          </SelectionDropdownItem>
        ))}
      </SelectionDropdown>
    </>
  );
};

export default PannerNode;
