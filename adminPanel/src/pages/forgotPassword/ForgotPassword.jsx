import { useState } from "react";
import { forgotPasswordEmail } from "../../apiCalls/authCalls";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await forgotPasswordEmail(email);
    if(res.ok){
      console.log(res.message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Recuperar contraseña</h2>

      <input
        type="email"
        placeholder="Tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button type="submit">Enviar</button>

      {message && <p>{message}</p>}
    </form>
  );
}
