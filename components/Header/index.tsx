import React from "react";

const Header = () => {
  return (
    <div
      style={{
        width: "100%",
        margin: "1rem",
        marginTop: "1rem",
        borderTop: "4px solid black",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <text
          style={{
            fontWeight: "500",
            fontSize: "2rem",
          }}
        >
          Web Audio Playground
        </text>
      </div>
    </div>
  );
};

export default Header;
