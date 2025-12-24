import { useState, useRef, useEffect } from "react";
import { forgotPasswordEmail } from "../../apiCalls/authCalls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

/* REGEX */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COOLDOWN_SECONDS = 45;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [cooldown, setCooldown] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidEmail(emailRegex.test(email));
  }, [email]);

  /* ⏳ Cuenta regresiva */
  useEffect(() => {
    if (cooldown === 0) {
      setSent(false);
      setMessage("");
      return;
    }

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validEmail) {
      setError("Ingresá un email válido.");
      return;
    }

    const res = await forgotPasswordEmail(email);

    if (res.ok) {
      setSent(true);
      setCooldown(COOLDOWN_SECONDS);
      setMessage("Te enviamos un email para recuperar tu contraseña.");
    } else {
      setError(res.message || "Error al enviar el email.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Recuperar contraseña</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="field">
            <label className="label-with-icon">
              Email:
              <span
                className={`icon ${
                  email ? (validEmail ? "show valid" : "show invalid") : ""
                }`}
              >
                {email && (
                  <FontAwesomeIcon icon={validEmail ? faCheck : faTimes} />
                )}
              </span>
            </label>

            <input
              ref={emailRef}
              type="email"
              value={email}
              disabled={sent}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />

            <p className={`hint ${emailFocus && !validEmail ? "show" : ""}`}>
              <FontAwesomeIcon icon={faInfoCircle} />
              Ingresá el email con el que te registraste.
            </p>
          </div>

          {/* BUTTON */}
          <div className="button-container">

            {/* BOTÓN CANCELAR */}
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/")}
            >
              Cancelar
            </button>

            <button
              disabled={!validEmail || sent}
              className={!validEmail || sent ? "disabled " : " send-button"}
            >
              {sent ? "Email enviado" : "Enviar email"}
            </button>

            {sent && (
              <span className="cooldown">
                Reenviar en {cooldown}s
              </span>
            )}

            
            
          </div>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
        </form>
      </div>
    </div>
  );
}
