import React, { PropsWithChildren, MouseEvent } from "react";

type Props = {
  handleClick: (e: MouseEvent) => void;
};

const Button = (props: PropsWithChildren<Props>) => {
  const { handleClick, children } = props;
  return (
    <div
      onClick={handleClick}
      style={{
        border: "4px solid black",
        textAlign: "center",
        width: "100%",
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
};

export default Button;
