import { useState, useEffect, FormEvent } from "react";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../FirebaseConnection";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  async function handleLogin(e: FormEvent): Promise<void> {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.warn("Por favor, preencha todos os campos");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Usuário ou senha incorretos. Tente novamente.");
    }
  }

  async function handleGoogleLogin(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then(() => {
        navigate("/admin", { replace: true });
      })
      .catch(() => {
        toast.error("Falha ao logar na conta. Tente novamente.");
      });
  }

  return (
    <div className="home-container">
      <ToastContainer autoClose={3000} />
      <h1>Login</h1>
      <h3>Acesse sua conta!</h3>
      <form className="form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="*******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Acessar</button>
      </form>
      <button className="btn-google" onClick={handleGoogleLogin}>
        Login com Google
      </button>
      <h4>
        Não tem uma conta? <Link to="/register">Registre-se aqui!</Link>
      </h4>
    </div>
  );
}