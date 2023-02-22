import { useState, ReactNode, PropsWithChildren } from "react";
import styles from "./Dropdown.module.css";

type Props = {
  title: string;
  style?: React.CSSProperties;
  // items: string[];
  // handleClick: (it: string, i: number) => void;
};

const SelectionDropdown = (props: PropsWithChildren<Props>) => {
  const { title, style, children } = props;

  const [isShowing, setIsShowing] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsShowing(!isShowing);
  };

  const handleChildClick = () => {
    setIsShowing(!isShowing);
  };

  return (
    <div className={styles.dropdownContainer} style={style}>
      <div>
        <div className={styles.dropdownHeader} onClick={toggleDropdown}>
          <span>{title}</span>
          <div
            style={{
              fontWeight: "bold",
            }}
          >
            v
          </div>
        </div>
      </div>
      {/*isShowing
        ? items.map((it, i) => {
            return (
              <div
                key={i}
                className={styles.dropdownChild}
                onClick={(_) => wrapHandleClick(it, i)}
              >
                <span>{it}</span>
              </div>
            );
          })
        : null*/}
      {isShowing && children ? (
        <div
          style={
            {
              // zIndex: "12000",
              // position: "absolute",
              // width: "100%",
              // border: "4px solid black",
              // display: "flex",
              // flexDirection: "column",
              // backgroundColor: "white",
            }
          }
          onClick={handleChildClick}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default SelectionDropdown;
