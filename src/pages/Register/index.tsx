import { useState, FormEvent } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../FirebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register: React.FC = (): JSX.Element => {
  // Estado com tipagem explícita
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Navegação com tipagem de hooks do React Router
  const navigate = useNavigate();

  // Função para lidar com o registro
  const handleRegister = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (email !== "" && password !== "") {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/admin", { replace: true });
      } catch (error) {
        alert("Falha ao criar a conta, tente novamente.");
      }
    } else {
      alert("Preencha corretamente o formulário!");
    }
  };

  return (
    <div className="home-container">
      <h1>Registrar</h1>
      <h3>Vamos criar sua conta!</h3>
      <form className="form" onSubmit={handleRegister}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          placeholder="*******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Registrar</button>

        <h4>
          Já possui uma conta?{" "}
          <Link to="/" className="login">
            Login
          </Link>
        </h4>
      </form>
    </div>
  );
};

export default Register;
