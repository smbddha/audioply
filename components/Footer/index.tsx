import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.footercontainer}>
      <span>
        made by <a href="https://littlepurpose.dev">doob</a> -{" "}
        <a href="https://github.com/smbddha/audioply">questions/issues?</a>
      </span>
    </div>
  );
};

export default Footer;
