import React, { useState, useEffect } from "react";
import api from "../../../utils/api";
import styles from "./SettingsView.module.css";

const SettingsView = () => {
  const [settings, setSettings] = useState({
    siteTitle: "My Blog Site",
    siteDescription: "A place for amazing content",
    postsPerPage: 10,
    contactEmail: "",
    siteLogo: "",
    favicon: "",
    socialLinks: {
      twitter: "",
      facebook: "",
      instagram: "",
    },
    emailSettings: {
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPass: "",
    },
    analyticsSettings: {
      googleAnalyticsId: "",
      facebookPixelId: "",
    },
    privacySettings: {
      allowComments: true,
      requireCommentApproval: true,
      maxCommentLength: 500,
    }
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // For now, using localStorage as a fallback since backend doesn't have settings endpoint yet
        const savedSettings = localStorage.getItem('blogSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nameParts = name.split('.');
    
    setSettings(prev => {
      const updatedSettings = { ...prev };
      
      if (nameParts.length === 1) {
        // Direct property update
        updatedSettings[nameParts[0]] = type === 'checkbox' ? checked : value;
      } else {
        // Nested property update (e.g., socialLinks.twitter)
        updatedSettings[nameParts[0]] = {
          ...updatedSettings[nameParts[0]],
          [nameParts[1]]: type === 'checkbox' ? checked : value
        };
      }
      
      return updatedSettings;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveStatus("");
    
    try {
      // Save settings to localStorage as a fallback (in a real app, this would be to a backend)
      localStorage.setItem('blogSettings', JSON.stringify(settings));
      setSaveStatus("Settings saved successfully!");
      
      // In a real application, you would make an API call like this:
      // await api.patch('/api/v1/settings', settings, true);
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus("Error saving settings: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "social", label: "Social" },
    { id: "email", label: "Email" },
    { id: "analytics", label: "Analytics" },
    { id: "privacy", label: "Privacy" }
  ];

  return (
    <section className={styles.settingsView}>
      <h2>Site Settings</h2>
      
      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className={styles.settingsForm}>
        {/* General Settings */}
        {activeTab === "general" && (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="siteTitle">Site Title</label>
              <input
                type="text"
                id="siteTitle"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="My Blog Site"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="siteDescription">Site Description</label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
                className={styles.textarea}
                placeholder="A place for amazing content"
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="postsPerPage">Posts Per Page</label>
              <input
                type="number"
                id="postsPerPage"
                name="postsPerPage"
                value={settings.postsPerPage}
                onChange={handleInputChange}
                className={styles.input}
                min="1"
                max="50"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contactEmail">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="admin@example.com"
              />
            </div>
          </div>
        )}

        {/* Social Settings */}
        {activeTab === "social" && (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="socialLinks.twitter">Twitter URL</label>
              <input
                type="url"
                id="socialLinks.twitter"
                name="socialLinks.twitter"
                value={settings.socialLinks.twitter}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="https://twitter.com/youraccount"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="socialLinks.facebook">Facebook URL</label>
              <input
                type="url"
                id="socialLinks.facebook"
                name="socialLinks.facebook"
                value={settings.socialLinks.facebook}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="socialLinks.instagram">Instagram URL</label>
              <input
                type="url"
                id="socialLinks.instagram"
                name="socialLinks.instagram"
                value={settings.socialLinks.instagram}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="https://instagram.com/youraccount"
              />
            </div>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === "email" && (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="emailSettings.smtpHost">SMTP Host</label>
              <input
                type="text"
                id="emailSettings.smtpHost"
                name="emailSettings.smtpHost"
                value={settings.emailSettings.smtpHost}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="emailSettings.smtpPort">SMTP Port</label>
              <input
                type="number"
                id="emailSettings.smtpPort"
                name="emailSettings.smtpPort"
                value={settings.emailSettings.smtpPort}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="587"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="emailSettings.smtpUser">SMTP Username</label>
              <input
                type="text"
                id="emailSettings.smtpUser"
                name="emailSettings.smtpUser"
                value={settings.emailSettings.smtpUser}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="your-email@gmail.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="emailSettings.smtpPass">SMTP Password</label>
              <input
                type="password"
                id="emailSettings.smtpPass"
                name="emailSettings.smtpPass"
                value={settings.emailSettings.smtpPass}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="••••••••"
              />
            </div>
          </div>
        )}

        {/* Analytics Settings */}
        {activeTab === "analytics" && (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label htmlFor="analyticsSettings.googleAnalyticsId">Google Analytics ID</label>
              <input
                type="text"
                id="analyticsSettings.googleAnalyticsId"
                name="analyticsSettings.googleAnalyticsId"
                value={settings.analyticsSettings.googleAnalyticsId}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="UA-XXXXXXXXX-X"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="analyticsSettings.facebookPixelId">Facebook Pixel ID</label>
              <input
                type="text"
                id="analyticsSettings.facebookPixelId"
                name="analyticsSettings.facebookPixelId"
                value={settings.analyticsSettings.facebookPixelId}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="123456789012345"
              />
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === "privacy" && (
          <div className={styles.tabContent}>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="privacySettings.allowComments"
                  checked={settings.privacySettings.allowComments}
                  onChange={handleInputChange}
                />
                Allow comments on posts
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="privacySettings.requireCommentApproval"
                  checked={settings.privacySettings.requireCommentApproval}
                  onChange={handleInputChange}
                />
                Require comment approval
              </label>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="privacySettings.maxCommentLength">Maximum Comment Length</label>
              <input
                type="number"
                id="privacySettings.maxCommentLength"
                name="privacySettings.maxCommentLength"
                value={settings.privacySettings.maxCommentLength}
                onChange={handleInputChange}
                className={styles.input}
                min="100"
                max="2000"
              />
            </div>
          </div>
        )}

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.actionBtn}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
          {saveStatus && (
            <div className={`${styles.saveStatus} ${saveStatus.includes('Error') ? styles.error : styles.success}`}>
              {saveStatus}
            </div>
          )}
        </div>
      </form>
    </section>
  );
};

export default SettingsView;
