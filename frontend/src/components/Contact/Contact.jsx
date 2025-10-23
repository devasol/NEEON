import { useState, useRef, useEffect } from "react";
import styles from "./Contact.module.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      detail: "hello@blog.com",
      action: "mailto:hello@blog.com",
      color: "#6366f1",
    },
    {
      icon: "📞",
      title: "Call Us",
      detail: "+1 (555) 123-4567",
      action: "tel:+15551234567",
      color: "#10b981",
    },
    {
      icon: "💬",
      title: "Live Chat",
      detail: "Start conversation",
      action: "#chat",
      color: "#ec4899",
    },
    {
      icon: "📍",
      title: "Visit Us",
      detail: "123 Blog Street, City",
      action: "#map",
      color: "#f59e0b",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    alert("Message sent successfully!");
  };

  return (
    <section ref={sectionRef} className={styles.contact}>
      <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Get In Touch</h2>
          <p className={styles.subtitle}>
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Let's Start a Conversation</h3>
              <p className={styles.infoDescription}>
                Whether you have a question about features, trials, pricing, or
                anything else, our team is ready to answer all your questions.
              </p>

              <div className={styles.contactMethods}>
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.action}
                    className={styles.contactMethod}
                    style={{ "--method-color": method.color }}
                  >
                    <div className={styles.methodIcon}>
                      <span>{method.icon}</span>
                    </div>
                    <div className={styles.methodContent}>
                      <h4>{method.title}</h4>
                      <p>{method.detail}</p>
                    </div>
                    <div className={styles.methodArrow}>→</div>
                  </a>
                ))}
              </div>

              <div className={styles.socialLinks}>
                <h4>Follow Us</h4>
                <div className={styles.socialIcons}>
                  {["📘", "🐦", "📷", "💼"].map((icon, index) => (
                    <button key={index} className={styles.socialIcon}>
                      <span>{icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  />
                  <label className={styles.formLabel}>Your Name</label>
                  <div className={styles.inputHighlight}></div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  />
                  <label className={styles.formLabel}>Email Address</label>
                  <div className={styles.inputHighlight}></div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  />
                  <label className={styles.formLabel}>Subject</label>
                  <div className={styles.inputHighlight}></div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className={`${styles.formInput} ${styles.textarea}`}
                  ></textarea>
                  <label className={styles.formLabel}>Your Message</label>
                  <div className={styles.inputHighlight}></div>
                </div>
              </div>

              <button
                type="submit"
                className={`${styles.submitButton} ${
                  isSubmitting ? styles.submitting : ""
                }`}
                disabled={isSubmitting}
              >
                <span className={styles.buttonText}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </span>
                <div className={styles.buttonLoader}></div>
                <div className={styles.buttonSuccess}>✓</div>
              </button>
            </form>
          </div>
        </div>

        <div className={styles.mapSection}>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapOverlay}>
              <h3>Visit Our Office</h3>
              <p>
                123 Blog Street, Creative District
                <br />
                City, State 12345
              </p>
              <button className={styles.mapButton}>View Larger Map</button>
            </div>
            <div className={styles.mapAnimation}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
