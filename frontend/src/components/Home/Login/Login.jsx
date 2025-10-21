import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_BASE } from "../../../utils/api";
import styles from "./Login.module.css";
import useAuth from "../../../hooks/useAuth";
import Toast from "../../Ui/Toast";

// Animated Icons
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

const EmailIcon = () => (
  <svg className={styles.inputIcon} viewBox="0 0 24 24">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const PasswordIcon = () => (
  <svg className={styles.inputIcon} viewBox="0 0 24 24">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </svg>
);

const EyeIcon = ({ show }) => (
  <svg className={styles.eyeIcon} viewBox="0 0 24 24">
    {show ? (
      <>
        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
      </>
    ) : (
      <>
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </>
    )}
  </svg>
);

const SparkleIcon = () => (
  <svg className={styles.sparkle} viewBox="0 0 24 24">
    <path d="M19.8 10.7c-.2-.5-.8-.7-1.3-.5l-2.4 1.1-1.1-2.4c-.2-.5-.8-.7-1.3-.5s-.7.8-.5 1.3l1.1 2.4-2.4 1.1c-.5.2-.7.8-.5 1.3s.8.7 1.3.5l2.4-1.1 1.1 2.4c.2.5.8.7 1.3.5s.7-.8.5-1.3l-1.1-2.4 2.4-1.1c.5-.2.7-.8.5-1.3zm-15.6 0c-.2-.5-.8-.7-1.3-.5l-2.4 1.1-1.1-2.4c-.2-.5-.8-.7-1.3-.5s-.7.8-.5 1.3l1.1 2.4-2.4 1.1c-.5.2-.7.8-.5 1.3s.8.7 1.3.5l2.4-1.1 1.1 2.4c.2.5.8.7 1.3.5s.7-.8.5-1.3l-1.1-2.4 2.4-1.1c.5-.2.7-.8.5-1.3z" />
  </svg>
);

const Login = ({ noContainer = false, onClose, onSignupClick }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
  });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Animation triggers
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    setAnimate(true);

    // Pre-fill demo credentials for testing
    // setFormData({
    //   email: "demo@example.com",
    //   password: "demopassword",
    // });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleBlur = (field) => {
    setIsFocused((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));
    try {
      const res = await api.post("/api/v1/users/login", {
        email: formData.email,
        password: formData.password,
      });

      if (res.data && res.data.token) {
        const email = formData.email?.trim().toLowerCase();
        const pwd = formData.password;
        const adminEmail = "dawitsolo8908@gmail.com";
        const adminPwd = "devasol@123";
        const isAdmin = email === adminEmail && pwd === adminPwd;
        auth.login(res.data.token, { isAdmin });
        setToast({ message: "Login successful!", type: "success" });
        if (onClose) onClose();
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setErrors((prev) => ({ ...prev, general: "Login failed" }));
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
          err?.response?.data?.message || err.message || "Login failed";
        setErrors((prev) => ({ ...prev, general: msg }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeToast = () => setToast({ message: "", type: "success" });

  const handleGoogleLogin = () => {
    setIsLoading(true);

    // Simulate Google OAuth process
    setTimeout(() => {
      window.location.href = "/auth/google"; // Replace with your OAuth endpoint
    }, 1000);
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic
    alert("Forgot password feature coming soon!");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const card = (
    <div className={styles.loginCard}>
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      {onClose && (
        <button
          type="button"
          className={styles.innerClose}
          onClick={onClose}
          aria-label="Close login"
        >
          ×
        </button>
      )}
      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <div
          className={styles.floatingCircle}
          style={{ "--delay": "0s" }}
        ></div>
        <div
          className={styles.floatingCircle}
          style={{ "--delay": "1s" }}
        ></div>
        <div
          className={styles.floatingCircle}
          style={{ "--delay": "2s" }}
        ></div>
        <SparkleIcon />
      </div>

      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <h1>Welcome Back</h1>
        </div>
        <p className={styles.subtitle}>Sign in to your account to continue</p>
      </div>

      {/* Google OAuth Button */}
      <button
        className={styles.googleButton}
        onClick={handleGoogleLogin}
        disabled={isLoading}
        type="button"
      >
        <GoogleIcon />
        Continue with Google
        <span className={styles.buttonLoader}></span>
      </button>

      {/* Divider */}
      <div className={styles.divider}>
        <span>or continue with email</span>
      </div>

      {errors.general && (
        <div className={styles.errorText} role="alert">
          {errors.general}
        </div>
      )}

      {/* Login Form */}
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className={styles.inputGroup}>
          <div className={styles.inputContainer}>
            <EmailIcon />
            <input
              ref={emailRef}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              className={`${styles.input} ${errors.email ? styles.error : ""} ${
                isFocused.email ? styles.focused : ""
              }`}
              placeholder=" "
              disabled={isLoading}
            />
            <label className={styles.label}>Email Address</label>
          </div>
          {errors.email && (
            <span className={styles.errorText}>{errors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div className={styles.inputGroup}>
          <div className={styles.inputContainer}>
            <PasswordIcon />
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              className={`${styles.input} ${
                errors.password ? styles.error : ""
              } ${isFocused.password ? styles.focused : ""}`}
              placeholder=" "
              disabled={isLoading}
            />
            <label className={styles.label}>Password</label>
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={togglePasswordVisibility}
              disabled={isLoading}
            >
              <EyeIcon show={showPassword} />
            </button>
          </div>
          {errors.password && (
            <span className={styles.errorText}>{errors.password}</span>
          )}
        </div>

        {/* Options Row */}
        <div className={styles.optionsRow}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className={styles.checkbox}
            />
            <span className={styles.checkmark}></span>
            Remember me
          </label>
          <button
            type="button"
            className={styles.forgotPassword}
            onClick={handleForgotPassword}
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
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
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className={styles.footer}>
        <p>
          Don't have an account?{" "}
          {onSignupClick ? (
            <button
              type="button"
              className={styles.signupLink}
              onClick={onSignupClick}
            >
              Sign up
            </button>
          ) : (
            <a href="/signup" className={styles.signupLink}>
              Sign up
            </a>
          )}
        </p>
      </div>

      {/* Demo Credentials Hint */}
      <div className={styles.demoHint}>
        {/* <p>Demo credentials: demo@example.com / demopassword</p> */}
      </div>
    </div>
  );

  if (noContainer) {
    return card;
  }

  return (
    <div
      className={`${styles.loginContainer} ${animate ? styles.animate : ""}`}
    >
      {card}
    </div>
  );
};

export default Login;
