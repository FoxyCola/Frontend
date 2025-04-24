import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("https://backend2025tienda.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Inicio de sesión exitoso");

        // Guardar token y rol en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        console.log("Respuesta completa del servidor:", data);
        console.log("talvez mi usuario?:", data.user);
        console.log("Rol recibido:" , data.user.role);

        // Redirigir según el rol
        if (data.user.role === "admin") {
          navigate("/Inventory"); // Admin → Inventario
        } else {
          navigate("/carrito"); // Usuario normal → Carrito de compras
        }
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("❌ Error en el servidor");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Iniciar sesión</button>
        </form>
        <p style={styles.message}>{message}</p>
        <button onClick={() => navigate("/register")} style={styles.button}>
          Registrarse
        </button>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },
  card: {
    width: "350px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  message: {
    color: "red",
    fontWeight: "bold",
  },
};

export default Home;
