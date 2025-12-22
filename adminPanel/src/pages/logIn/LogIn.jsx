import "./LogIn.css";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {useAuthContext} from "../../contexts/authContext"


/* REGEX */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,16}$/;


export default function LogIn() {
  const emailRef = useRef(null);
  const {signUp, signIn, error, loading} = useAuthContext()

 

  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [frontErrorMessage, setFrontErrorMessage] = useState("");

  useEffect(() => {
    emailRef.current?.focus();
  }, [isRegister]);

  useEffect(() => {
    setValidEmail(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(passwordRegex.test(password));
  }, [password]);

  useEffect(() => {
    setFrontErrorMessage("");
  }, [email, password, isRegister]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!validEmail || !validPassword) {
      setFrontErrorMessage("Invalid entry.");
      return;
    }

    const formData ={
      email, password
    }
    console.log(formData)

    let res;
    if(isRegister){
      res = await signUp(formData);
    }else{
      res = await signIn(formData)
    }
    
  };

  /* 🔑 ICON LOGIC */
  const renderIcon = (isValid, value) => {
    if (!value) return null;
    return isValid ? faCheck : faTimes;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          {isRegister ? "Registrarse" : "Iniciar sesion"}
        </h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            {/* EMAIL */}
            <div className="field">
              <label className="label-with-icon">
                Email:
                <span
                  className={`icon ${
                    email
                      ? validEmail
                        ? "show valid"
                        : "show invalid"
                      : ""
                  }`}
                >
                  {renderIcon(validEmail, email) && (
                    <FontAwesomeIcon
                      icon={renderIcon(validEmail, email)}
                    />
                  )}
                </span>
              </label>

              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />

              <p
                className={`hint ${
                  emailFocus && !validEmail ? "show" : ""
                }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Enter a valid email address.
              </p>
            </div>

            {/* PASSWORD */}
            <div className="field">
              <label className="label-with-icon">
                Password:
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
                    <FontAwesomeIcon
                      icon={renderIcon(validPassword, password)}
                    />
                  )}
                </span>
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />

              <p
                className={`hint ${
                  passwordFocus && !validPassword ? "show" : ""
                }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                8–16 chars, uppercase, lowercase, number and !@#$%
              </p>
            </div>
          </div>

          {/* BUTTON */}
          <div className="button-container">
            <button
              disabled={!validEmail || !validPassword}
              className={!validEmail || !validPassword ? "disabled" : ""}
              onClick={handleSubmit}
            >
              {loading
                ? "Loading..."
                : isRegister
                ? "Crear cuenta"
                : "Iniciar sesion"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}
          {frontErrorMessage && (
            <p className="error">{frontErrorMessage}</p>
          )}
        </form>

        <p className="toggle-text">
          {isRegister ? "Ya estas registrado?" : "No tenes cuenta?"}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Iniciar sesion" : " Registrate"}
          </span>
        </p>
      </div>
    </div>
  );
}
