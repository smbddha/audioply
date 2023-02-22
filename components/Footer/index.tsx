import Link from "next/link";
import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.footercontainer}>
      <span>
        made by <Link href="https://littlepurpose.dev">doob</Link>
      </span>
    </div>
  );
};

export default Footer;
