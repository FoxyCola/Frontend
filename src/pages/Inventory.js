import React, { useState, useEffect } from "react";

function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  // Obtener productos
  const fetchInventory = async () => {
    try {
      const response = await fetch("https://backend2025tienda.onrender.com/api/inventory");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error al obtener inventario:", error);
    }
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Agregar o actualizar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `https://backend2025tienda.onrender.com/api/inventory/${editingId}`
      : "https://backend2025tienda.onrender.com/api/inventory";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setForm({ nombre: "", precio: "", stock: "" });
        setEditingId(null);
        fetchInventory(); // Actualizar lista
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      const response = await fetch(`https://backend2025tienda.onrender.com/api/inventory/${id}`, {
        method: "DELETE",
      });

      if (response.ok) fetchInventory();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  // Editar producto
  const handleEdit = (item) => {
    setForm({ name: item.name, price: item.price, stock: item.stock });
    setEditingId(item._id);
  };

  return (
    <div style={styles.container}>
      <h2>Inventario</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? "Actualizar" : "Agregar"}</button>
      </form>

      <ul style={styles.list}>
        {items.map((item) => (
          <li key={item._id} style={styles.item}>
            <span>
              {item.nombre} - ${item.precio} - Stock: {item.stock}
            </span>
            <button onClick={() => handleEdit(item)}>✏️ Editar</button>
            <button onClick={() => handleDelete(item._id)}>🗑️ Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { width: "400px", margin: "20px auto", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" },
  list: { listStyle: "none", padding: 0 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    border: "1px solid #ddd",
    padding: "10px",
  },
};

export default Inventory;
