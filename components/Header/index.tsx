import Link from "next/link";
import React, { useState } from "react";
import Controls from "../Controls";

import styles from "./Header.module.css";

import { useStore } from "@/store";
import { serializeGraph, buildShareUrl } from "@/share";

const Header = () => {
  const showNodePanel = useStore((state) => state.toggleNodesPanel);
  const reset = useStore((state) => state.reset);
  const nodes = useStore((state) => state.nodes);
  const connections = useStore((state) => state.connections);

  const [copied, setCopied] = useState(false);

  const handleResetClick = () => {
    reset();
  };

  const handleCreateClick = () => {
    console.log("CLICKKKKK");
    showNodePanel();
  };

  const handleShareClick = async () => {
    const url = buildShareUrl(serializeGraph(nodes, connections));
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (e.g. insecure context) — fall back to a prompt.
      window.prompt("Copy this share link:", url);
    }
  };
  return (
    <div
      className={styles.container}
      onClick={(e) => e.stopPropagation()}
      style={
        {
          // width: "100%",
          // // margin: "1rem",
          // // marginTop: "1rem",
          // // marginBottom: "4rem",
          // border: "4px solid black",
          // display: "flex",
          // flexDirection: "row",
          // justifyContent: "space-between",
          // zIndex: "200000",
          // backgroundColor: "#fff",
        }
      }
    >
      <span
        style={{
          fontWeight: "500",
          fontSize: "1.4rem",
          // maxWidth: "20rem",
          // textAlign: "right",

          padding: "0.3rem",
          paddingRight: "4rem",
          paddingLeft: "4rem",
          // width: "30%",
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
          // borderTop: "4px solid black",
          // marginLeft: "2rem",
          // marginTop: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
            fontSize: "0.8rem",
            fontWeight: "450",
          }}
        >
          <div
            className={`${styles.createButton} ${styles.topButton}`}
            onClick={handleCreateClick}
            style={
              {
                // borderLeft: "4px solid black",
                // borderRight: "4px solid black",
                // padding: "0.2rem",
                // width: "8rem",
                // textAlign: "center",
                // display: "flex",
                // flexDirection: "column",
                // justifyContent: "center",
                // alignItems: "center",
              }
            }
          >
            add node (c)
          </div>
          <div
            className={`${styles.resetButton} ${styles.topButton}`}
            onClick={handleResetClick}
            style={
              {
                // borderLeft: "8px solid black",
                // borderRight: "4px solid black",
                // padding: "0.2rem",
                // textAlign: "center",
                // display: "flex",
                // flexDirection: "column",
                // justifyContent: "center",
                // alignItems: "center",
                // width: "8rem",
              }
            }
          >
            reset (r)
          </div>
          <div
            className={`${styles.resetButton} ${styles.topButton}`}
            onClick={handleShareClick}
          >
            {copied ? "copied!" : "share"}
          </div>
          {/*<Controls />*/}
        </div>
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "row",
            padding: "0.2rem",
            paddingRight: "0.8rem",
            fontSize: "1rem",
            justifyContent: "flex-end",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/*<Link href="/#">about</Link>*/}
        </div>
      </div>
    </div>
  );
};

export default Header;
