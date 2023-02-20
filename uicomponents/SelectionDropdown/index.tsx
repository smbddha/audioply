import { useState, ReactNode } from "react";
import styles from "./Dropdown.module.css";

type Props = {
  title: string;
  items: string[];
  handleClick: (it: string, i: number) => void;
};

const SelectionDropdown = (props: Props) => {
  const { title, items, handleClick } = props;

  const [isShowing, setIsShowing] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsShowing(!isShowing);
  };

  const wrapHandleClick = (it: string, i: number) => {
    setIsShowing(!isShowing);
    handleClick(it, i);
  };

  return (
    <div className={styles.dropdownContainer}>
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
      {isShowing
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
        : null}
      {/*isShowing && children ? (
        <div>
          {children.map((child, i) => {
            return <div className={styles.dropdownChild}>{child}</div>;
          })}
        </div>
      ) : null*/}
    </div>
  );
};

export default SelectionDropdown;
