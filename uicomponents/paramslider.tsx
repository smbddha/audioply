import React, { useState, ChangeEvent, useCallback } from "react";

import styles from "./Paramslider.module.css";

const useSlider = (
  min: number,
  max: number,
  defaultState: number,
  id: string,
  onChange?: (val: number) => void
): [
  props: {
    type: string;
    id: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  },
  updateValue: (v: number) => void
] => {
  const [state, setSlide] = useState(defaultState);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlide(e.target.valueAsNumber);

    if (onChange) onChange(e.target.valueAsNumber);
  };

  const updateValue = useCallback(
    (v: number) => {
      setSlide(v);
      if (onChange) onChange(v);
    },
    [onChange]
  );

  const props = {
    type: "range",
    id,
    min,
    max,
    step: max / 1000,
    value: state,
    onChange: handleChange,
  };
  return [props, updateValue];
};

type Props = {
  title: string;
  audioParam: AudioParam;
  handleChange: (a: number) => void;
  limits?: [number, number];
  unit?: string;
};

const ParamSlider = (props: Props) => {
  const { title, audioParam, handleChange, limits, unit } = props;

  const [textValue, setTextValue] = useState<string>(
    audioParam.value.toString()
  );

  const [sliderProps, updateValue] = useSlider(
    limits ? limits[0] : audioParam.minValue,
    limits ? limits[1] : audioParam.maxValue,
    audioParam.defaultValue,
    "",
    (a: number) => {
      setTextValue(a.toString());
      handleChange(a);
    }
  );

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(
      "setting level from text",
      e.target.value,
      e.target.valueAsNumber
    );

    setTextValue(e.target.value);
    const v = parseFloat(e.target.value);
    if (v) {
      updateValue(v);
    }
  };

  return (
    <div
      style={{
        margin: "0.2rem",
        marginBottom: "0.4rem",
        fontSize: "0.8rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "0.1rem",
        }}
      >
        <span>{title}</span>
        <div>
          <input
            className={styles.numinput}
            type="text"
            inputMode="numeric"
            value={textValue}
            onChange={handleInput}
            style={
              {
                // maxWidth: "3rem",
                // background: "none",
                // textDecoration: "none",
                // color: "black",
                // border: "0px solid transparent",
                // fontSize: "0.8rem",
                // textAlign: "right",
                // marginRight: "0.1rem",
              }
            }
          />
          <span>{unit ?? unit}</span>
        </div>
      </div>
      <input {...sliderProps} />
    </div>
  );
};

export default ParamSlider;
