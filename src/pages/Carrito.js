import { useState, useEffect } from "react";

function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({ name: "", number: "", cvv: "", expiry: "" });
  const [user, setUser] = useState(null);
  const [savedCard, setSavedCard] = useState(null);

  useEffect(() => {
    fetchInventory();
    fetchUser();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/inventory");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error al obtener inventario:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setSavedCard(data.user.card); // Guardar los datos de la tarjeta
      } else {
        console.error("Error al obtener usuario:", data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleBuy = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const processPayment = async () => {
    if (!user) {
      alert("Debes iniciar sesión para comprar.");
      return;
    }

    if (
      savedCard &&
      (savedCard.name !== cardDetails.name ||
        savedCard.number !== cardDetails.number ||
        savedCard.cvv !== cardDetails.cvv ||
        savedCard.expiry !== cardDetails.expiry)
    ) {
      alert("Los datos de la tarjeta no coinciden con los registrados.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          cart,
          cardInfo: {
            name: cardDetails.name,
            number: cardDetails.number,
            securityCode: cardDetails.cvv,
            expiryDate: cardDetails.expiry
          }
        }),
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        setCart([]);
        setShowPaymentModal(false);
        setCardDetails({ name: "", number: "", cvv: "", expiry: "" });
        fetchInventory();
      }
    } catch (error) {
      console.error("Error en el pago:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Productos Disponibles</h2>
      <ul style={styles.list}>
        {items.map((item) => (
          <li key={item._id} style={styles.item}>
            <span>{item.nombre} - ${item.precio} - Stock: {item.stock}</span>
            <button onClick={() => addToCart(item)}>➕ Agregar</button>
          </li>
        ))}
      </ul>

      <h2>Carrito de Compras</h2>
      <ul style={styles.list}>
        {cart.map((item, index) => (
          <li key={index} style={styles.item}>
            <span>{item.nombre} - ${item.precio}</span>
          </li>
        ))}
      </ul>

      {cart.length > 0 && <button onClick={handleBuy} style={styles.buyButton}>🛒 Comprar</button>}

      {showPaymentModal && (
        <div style={styles.modal}>
          <h3>Ingrese los datos de su tarjeta</h3>
          <input type="text" name="name" placeholder="Nombre en la tarjeta" value={cardDetails.name} onChange={handlePaymentChange} required />
          <input type="text" name="number" placeholder="Número de tarjeta" value={cardDetails.number} onChange={handlePaymentChange} required />
          <input type="text" name="cvv" placeholder="CVV" value={cardDetails.cvv} onChange={handlePaymentChange} required />
          <input type="text" name="expiry" placeholder="Fecha de vencimiento" value={cardDetails.expiry} onChange={handlePaymentChange} required />
          <button onClick={processPayment}>💳 Pagar</button>
          <button onClick={() => setShowPaymentModal(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { width: "400px", margin: "20px auto", textAlign: "center" },
  list: { listStyle: "none", padding: 0 },
  item: { display: "flex", justifyContent: "space-between", marginBottom: "10px", border: "1px solid #ddd", padding: "10px" },
  buyButton: { marginTop: "10px", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" },
  modal: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "20px", boxShadow: "0 0 10px rgba(0,0,0,0.3)" },
};

export default ShoppingCart;