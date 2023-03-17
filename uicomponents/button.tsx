import React, { PropsWithChildren, MouseEvent } from "react";
import styles from "./Button.module.css";

type Props = {
  handleClick: (e: MouseEvent) => void;
};

const Button = (props: PropsWithChildren<Props>) => {
  const { handleClick, children } = props;
  return (
    <div
      className={styles.mybutton}
      onClick={handleClick}
      style={
        {
          // border: "3px solid black",
          // textAlign: "center",
          // width: "100%",
          // cursor: "pointer",
        }
      }
    >
      {children}
    </div>
  );
};

export default Button;
