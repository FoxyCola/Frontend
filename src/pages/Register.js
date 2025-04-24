import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    role: "user", // "user" o "admin"
    cardName: "", // Campo para el nombre de la tarjeta
    cardInfo: {
      number: "",
      securityCode: "",
      expiryDate: "",
    },
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("cardInfo.")) {
      const key = name.split(".")[1]; // Obtener la clave después de "cardInfo."
      setFormData({
        ...formData,
        cardInfo: { ...formData.cardInfo, [key]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("https://backend2025tienda.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registro exitoso 🎉");
        console.log("Registro exitoso:", data);
        setTimeout(() => navigate("/"), 2000); // Redirigir a /home después de 2 segundos
      } else {
        setMessage("Error: " + data.message);
        console.error("Error en el registro:", data);
      }
    } catch (error) {
      setMessage("Error en el servidor");
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Registro</h2>
      {message && <p style={styles.message}>{message}</p>} {/* Mostrar mensaje */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>

        <h3>Datos de la Tarjeta</h3>
        <input
          type="text"
          name="cardName"
          placeholder="Nombre en la tarjeta"
          value={formData.cardInfo.cardName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cardInfo.number"
          placeholder="Número de Tarjeta"
          value={formData.cardInfo.number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cardInfo.securityCode"
          placeholder="Código de Seguridad"
          value={formData.cardInfo.securityCode}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cardInfo.expiryDate"
          placeholder="Fecha de Vencimiento (MM/YY)"
          value={formData.cardInfo.expiryDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: "300px",
    margin: "50px auto",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    color: "red",
    fontWeight: "bold",
  },
};

export default Register;
