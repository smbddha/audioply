import { useState, ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

const Dropdown = ({ title, children }: Props) => {
  const [isShowing, setIsShowing] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsShowing(!isShowing);
  };

  return (
    <div
      className="dropdown"
      style={{
        zIndex: "1000",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div>
        {title}
        <button onClick={toggleDropdown}>SHOW</button>
      </div>
      {isShowing ? children : null}
    </div>
  );
};

export default Dropdown;
