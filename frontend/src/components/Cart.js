import { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { CartContext } from "./context/Cart";

export default function Cart() {
  const navigate = useNavigate(); // Initialize useNavigate
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    setQuantity,
  } = useContext(CartContext);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return; // Prevent empty orders

    const orderDetails = cartItems
      .map((item) => `${item.category} - ${item.name} (Qty: ${item.quantity})`)
      .join("\n");

    const totalAmount = getCartTotal();
    const message = `Order Details:\n${orderDetails}\n\nTotal: ₹${totalAmount}`;

    const encodedMessage = encodeURIComponent(message);
    const adminWhatsAppNumber = "916204234534"; // Replace with actual number

    window.open(
      `https://wa.me/${adminWhatsAppNumber}?text=${encodedMessage}`,
      "_blank"
    );
    clearCart(); // Clear cart after placing order
  };

  return (
    <div className="container py-5">
      {/* Back Button */}
      <button
        className="btn btn-secondary mb-4"
        onClick={() => navigate(-1)} // Go back to the previous page
      >
        &larr; Back
      </button>

      <h1 className="text-center mb-4">Your Shopping Cart</h1>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Category</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.category}</td>
                <td>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="img-fluid"
                    style={{ maxWidth: "100px", height: "auto" }}
                  />
                </td>
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>

                    <input
                      type="number"
                      value={item.quantity}
                      style={{ width: "60px", textAlign: "center" }}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);
                        setQuantity(item, newQuantity);
                      }}
                    />
                    <button
                      className="btn btn-secondary btn-sm ms-2"
                      onClick={() => removeFromCart(item)}
                    >
                      -
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item, true)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {cartItems.length > 0 ? (
        <div className="text-center mt-4">
          <h3>Total: ₹{getCartTotal()}</h3>
          <button className="btn btn-danger mt-3" onClick={clearCart}>
            Clear Cart
          </button>
          <button
            className="btn btn-success mt-3 ms-3"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      ) : (
        <h3 className="text-center mt-4">Your cart is empty</h3>
      )}
    </div>
  );
}
