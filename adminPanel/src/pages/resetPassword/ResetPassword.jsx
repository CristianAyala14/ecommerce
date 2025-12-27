import "./ResetPassword.css";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordReq } from "../../apiCalls/authCalls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

/* REGEX (igual al login) */
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,16}$/;

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const passwordRef = useRef(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidPassword(passwordRegex.test(password));
  }, [password]);

  useEffect(() => {
    setError("");
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validPassword) {
      setError(
        "La contraseña debe tener entre 8 y 16 caracteres, una mayúscula, una minúscula, un número y un símbolo."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const res = await resetPasswordReq(token, password);

      if (!res.ok) {
        setError(res.message || "Error al actualizar la contraseña.");
        return;
      }

      setSuccess("Contraseña actualizada correctamente.");
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (isValid, value) => {
    if (!value) return null;
    return isValid ? faCheck : faTimes;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Restablecer contraseña</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* NEW PASSWORD */}
          <div className="field">
            <label className="label-with-icon">
              Nueva contraseña:
              <span
                className={`icon ${
                  password
                    ? validPassword
                      ? "show valid"
                      : "show invalid"
                    : ""
                }`}
              >
                {renderIcon(validPassword, password) && (
                  <FontAwesomeIcon icon={renderIcon(validPassword, password)} />
                )}
              </span>
            </label>

            <input
              ref={passwordRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />

            <p className={`hint ${passwordFocus && !validPassword ? "show" : ""}`}>
              <FontAwesomeIcon icon={faInfoCircle} />
              8–16 chars, uppercase, lowercase, number and !@#$%
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="field">
            <label className="label-with-icon">Confirmar contraseña:</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <div className="button-container">
            <button disabled={loading || !validPassword}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </form>
      </div>
    </div>
  );
}
