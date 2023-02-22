import Link from "next/link";
import React from "react";
import Controls from "../Controls";

const Header = () => {
  return (
    <div
      style={{
        width: "100%",
        margin: "1rem",
        marginTop: "1rem",
        marginBottom: "4rem",
        // borderTop: "4px solid black",
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
            fontSize: "2.8rem",
            maxWidth: "20rem",
            textAlign: "right",
          }}
        >
          web audio api playground
        </text>
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            borderTop: "4px solid black",
            marginLeft: "2rem",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
            }}
          >
            <Controls />
          </div>
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "row-reverse",
              padding: "1rem",
              fontSize: "1.4rem",
              alignItems: "flex-start",
              height: "100%",
            }}
          >
            <Link href="/#">about</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
