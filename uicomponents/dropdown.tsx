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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            borderTop: "3px solid black",
            padding: "0.2rem",
          }}
        >
          <span>{title}</span>
          <div
            onClick={toggleDropdown}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            v
          </div>
        </div>
      </div>
      {isShowing && children ? (
        <div>
          {/*children.map((child, i) => {
            return (
              <div
                style={{
                  width: "100%",
                  padding: "0.4rem",
                  borderTop: "4px solid black",
                }}
              >
                {child}
              </div>
            );
          })*/}
        </div>
      ) : null}
    </div>
  );
};

export default Dropdown;
