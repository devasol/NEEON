import React, { useState, useEffect } from "react";
import styles from "../Login/Login.module.css";
import api, { API_BASE } from "../../../utils/api";
import useAuth from "../../../hooks/useAuth";
import Toast from "../../Ui/Toast";

// Inline Google icon reused for parity with Login
const GoogleIcon = () => (
  <svg className={styles.googleIcon} viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const Signup = ({ noContainer = false, onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be 6+ characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));
    try {
      const res = await api.post("/api/v1/users/signup", {
        fullName: formData.name,
        email: formData.email,
        username: formData.email.split("@")[0],
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
      });

      if (res.data && res.data.token) {
        auth.login(res.data.token, { isAdmin: false });
        setToast({ message: "Signup successful!", type: "success" });
        if (onClose) onClose();
      } else {
        setErrors((prev) => ({ ...prev, general: "Signup failed" }));
      }
    } catch (err) {
      console.error(err);
      if (err.code === "ECONNABORTED" || err.message === "Network Error") {
        setErrors((prev) => ({
          ...prev,
          general: `Network error: can't reach server at ${API_BASE}. Is backend running?`,
        }));
      } else {
        const msg =
          err?.response?.data?.message || err.message || "Signup failed";
        setErrors((prev) => ({ ...prev, general: msg }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const auth = useAuth();
  const [toast, setToast] = useState({ message: "", type: "success" });
  const closeToast = () => setToast({ message: "", type: "success" });

  const handleGoogleSignup = () => {
    setIsLoading(true);
    // Simulate quick redirect to OAuth endpoint
    setTimeout(() => {
      window.location.href = "/auth/google"; // replace with real signup/oauth endpoint
    }, 800);
  };

  const card = (
    <div className={styles.loginCard}>
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      {onClose && (
        <button
          type="button"
          className={styles.innerClose}
          onClick={onClose}
          aria-label="Close signup"
        >
          ×
        </button>
      )}

      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <h1>Create Account</h1>
        </div>
        <p className={styles.subtitle}>Create your account to get started</p>
      </div>

      <button
        className={styles.googleButton}
        onClick={handleGoogleSignup}
        disabled={isLoading}
        type="button"
      >
        <GoogleIcon />
        Continue with Google
        <span className={styles.buttonLoader}></span>
      </button>

      <div className={styles.divider}>
        <span>or continue with email</span>
      </div>

      {errors.general && (
        <div className={styles.errorText} role="alert">
          {errors.general}
        </div>
      )}

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.error : ""}`}
              placeholder=" "
              disabled={isLoading}
            />
            <label className={styles.label}>Full name</label>
          </div>
          {errors.name && (
            <span className={styles.errorText}>{errors.name}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputContainer}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.error : ""}`}
              placeholder=" "
              disabled={isLoading}
            />
            <label className={styles.label}>Email Address</label>
          </div>
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputContainer}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.password ? styles.error : ""
              }`}
              placeholder=" "
              disabled={isLoading}
            />
            <label className={styles.label}>Password</label>
          </div>
          {errors.password && (
            <span className={styles.errorText}>{errors.password}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputContainer}>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${styles.input} ${
                errors.confirmPassword ? styles.error : ""
              }`}
              placeholder=" "
              disabled={isLoading}
            />
            <label className={styles.label}>Confirm password</label>
          </div>
          {errors.confirmPassword && (
            <span className={styles.errorText}>{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${
            isLoading ? styles.loading : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className={styles.spinner}></div>
              Creating...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <div className={styles.footer}>
        <p>
          Already have an account?{" "}
          {onLoginClick ? (
            <button
              type="button"
              className={styles.signupLink}
              onClick={onLoginClick}
            >
              Sign in
            </button>
          ) : (
            <a href="/login" className={styles.signupLink}>
              Sign in
            </a>
          )}
        </p>
      </div>
    </div>
  );

  if (noContainer) return card;

  return (
    <div
      className={`${styles.loginContainer} ${animate ? styles.animate : ""}`}
    >
      {card}
    </div>
  );
};

export default Signup;
