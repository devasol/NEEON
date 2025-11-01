import React, { useState } from "react";
import styles from "./Contact.module.css";
import api from '../../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFocus = (field) => {
    setFocused(field);
  };

  const handleBlur = () => {
    setFocused("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const data = await api.post('/api/contact', formData);

      if (data.status === 'success') {
        setSubmitStatus({ type: 'success', message: data.message });
        // Reset form after successful submission
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Failed to send message' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Animated Background Elements */}
        <div className={styles.background}>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>👋</div>
          </div>
          <h1 className={styles.title}>Let's Talk</h1>
          <p className={styles.subtitle}>
            Ready to create something amazing? Get in touch.
          </p>
        </div>

        {/* Contact Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
              className={`${styles.input} ${
                focused === "name" ? styles.focused : ""
              }`}
              placeholder=" "
              required
            />
            <label className={styles.label}>Your Name</label>
            <div className={styles.inputLine}></div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
              className={`${styles.input} ${
                focused === "email" ? styles.focused : ""
              }`}
              placeholder=" "
              required
            />
            <label className={styles.label}>Email Address</label>
            <div className={styles.inputLine}></div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              onFocus={() => handleFocus("subject")}
              onBlur={handleBlur}
              className={`${styles.input} ${
                focused === "subject" ? styles.focused : ""
              }`}
              placeholder=" "
              required
            />
            <label className={styles.label}>Subject</label>
            <div className={styles.inputLine}></div>
          </div>

          <div className={styles.inputGroup}>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => handleFocus("message")}
              onBlur={handleBlur}
              rows="4"
              className={`${styles.input} ${styles.textarea} ${
                focused === "message" ? styles.focused : ""
              }`}
              placeholder=" "
              required
            />
            <label className={styles.label}>Your Message</label>
            <div className={styles.inputLine}></div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
            <div className={styles.arrow}>→</div>
          </button>

          {submitStatus && (
            <div className={`${styles.statusMessage} ${styles[submitStatus.type]}`}>
              {submitStatus.message}
            </div>
          )}
        </form>

        {}
        <div className={styles.quickContact}>
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>📧</div>
            <span>dawit8908@gmail.com</span>
          </div>
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>📱</div>
            <span>+251974079812</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
