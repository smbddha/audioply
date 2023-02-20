import { PropsWithChildren, MouseEvent } from "react";
import styles from "./Dropdown.module.css";

type Props = {
  handleClick: (e: MouseEvent) => void;
};

const SelectionDropdownItem = (props: PropsWithChildren<Props>) => {
  const { handleClick, children } = props;
  return (
    <div className={styles.dropdownChild} onClick={handleClick}>
      {children}
    </div>
  );
};

export default SelectionDropdownItem;
