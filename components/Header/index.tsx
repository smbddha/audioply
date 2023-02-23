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
        marginBottom: "0.2rem",
        // borderTop: "3px solid black",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontWeight: "500",
            fontSize: "1.6 rem",
            maxWidth: "20rem",
            textAlign: "right",
          }}
        >
          web audio playground
        </span>
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            borderTop: "2px solid black",
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
          ></div>
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "row-reverse",
              padding: "1rem",
              fontSize: "1rem",
              alignItems: "flex-start",
              height: "100%",
            }}
          ></div>
        </div>
        <div
          style={{
            margin: "1rem",
            marginTop: "0.5rem",
            marginBottom: "2rem",
            marginLeft: "2rem",
            // borderTop: "3px solid black",
          }}
        >
          <Link href="/#">about</Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
