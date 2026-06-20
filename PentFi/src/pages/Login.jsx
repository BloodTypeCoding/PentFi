import { useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import logo from "../Logos/IntentoDeLogo.png";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "example" && password === "example123") {
      navigate("/home");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-15">
      <div className="card bg-base-300 shadow-xl w-96 py-2">
        <img src={logo} alt="Logo" className="w-50 h-auto mx-auto mb-4" />
        <div className="card-body">
          <h2 className="card-title justify-center">Iniciar Sesión</h2>

          <input
            type="text"
            placeholder="Usuario"
            className="input input-bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin} className="btn btn-primary mt-4">
            Ingresar
          </button>
          <p>
            ¿No tienes una cuenta?{" "}
            <a
              href="https://wa.me/qr/THMKRQMKL3GEL1"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
            >
              Contáctanos para registrarte
            </a>
          </p>
        </div>
      </div>
      {/**Se renderiza en caso de que las credenciales sean incorrectas */}
      {error && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            onClick={() => setError(false)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Las credenciales proporcionadas son incorrectas.</span>
        </div>
      )}
    </div>
  );
}

export default Login;
