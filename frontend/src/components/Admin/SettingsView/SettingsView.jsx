import React from "react";
import styles from "./SettingsView.module.css";

const SettingsView = () => {
  return (
    <section className={styles.settingsView}>
      <h2>Settings</h2>
      <div className={styles.tableCard}>
        <label>Site title</label>
        <input className={styles.input} defaultValue="My Blog Site" />

        <label>Posts per page</label>
        <input className={styles.input} type="number" defaultValue={10} />

        <div style={{ marginTop: 12 }}>
          <button className={styles.actionBtn}>Save Settings</button>
        </div>
      </div>
    </section>
  );
};

export default SettingsView;
