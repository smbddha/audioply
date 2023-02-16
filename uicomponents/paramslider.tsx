import React, { useState, ChangeEvent, useCallback } from "react";

const useSlider = (
  min: number,
  max: number,
  defaultState: number,
  id: string,
  onChange?: (val: number) => void
) => {
  const [state, setSlide] = useState(defaultState);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlide(e.target.valueAsNumber);

    if (onChange) onChange(e.target.valueAsNumber);
  };

  const setValue = useCallback(
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
    setValue: setValue,
  };
  return props;
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

  const sliderProps = useSlider(
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
      console.log(v);
      sliderProps.setValue(v);
    }
  };

  return (
    <div
      style={{
        margin: "0.2rem",
        marginBottom: "0.4rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "0.2rem",
        }}
      >
        <span>{title}</span>
        <div>
          <input
            type="text"
            inputMode="numeric"
            value={textValue}
            onChange={handleInput}
            style={{
              maxWidth: "3rem",
              background: "none",
              textDecoration: "none",
              color: "black",
              border: "0px solid transparent",
            }}
          />
          <span>{unit ?? unit}</span>
        </div>
      </div>
      <input {...sliderProps} />
    </div>
  );
};

export default ParamSlider;
