import { useContext, useState } from "react";
import { CartContext } from "./context/Cart";

export default function Cart() {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    setQuantity,
  } = useContext(CartContext);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handlePlaceOrder = () => {
    if (!name || !phone) {
      alert("Please enter your name and phone number.");
      return;
    }
    // .map(
    //   (item) =>
    //     `${item.category}-${item.name} (Qty: ${item.quantity}) - ₹${
    //       item.price * item.quantity
    //     }`
    // Generate the WhatsApp message
    const orderDetails = cartItems
      .map((item) => `${item.category}-${item.name} (Qty: ${item.quantity})`)
      .join("\n");

    const totalAmount = getCartTotal();
    // const message = `Order Details:\n${orderDetails}\n\nTotal: ₹${totalAmount}\n\nName: ${name}\nPhone: ${phone}`;
    const message = `Order Details:\n${orderDetails}\n\nName: ${name}\nPhone: ${phone}`;

    // Encode the message for the WhatsApp URL
    const encodedMessage = encodeURIComponent(message);

    // Replace with your admin's WhatsApp number
    const adminWhatsAppNumber = "916204234534"; // Example number

    // Open WhatsApp with the order details
    window.open(
      `https://wa.me/${adminWhatsAppNumber}?text=${encodedMessage}`,
      "_blank"
    );

    // Clear the cart and close the form
    // clearCart();
    setShowOrderForm(false);
  };

  return (
    <div className="container py-5">
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
                    alt={item.title}
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
                    {/* <span>{item.quantity}</span> */}
                    <input
                      type="number"
                      value={item.quantity}
                      // min="0"
                      style={{ width: "60px", textAlign: "center" }}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value);

                        setQuantity(item, newQuantity);

                        // if (isNaN(newQuantity)) {
                        //   removeFromCart(item, true);
                        // }
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
          <button className="btn btn-danger mt-3" onClick={() => clearCart()}>
            Clear Cart
          </button>
          <button
            className="btn btn-success mt-3 ms-3"
            onClick={() => setShowOrderForm(true)}
          >
            Place Order
          </button>
        </div>
      ) : (
        <h3 className="text-center mt-4">Your cart is empty</h3>
      )}

      {/* Order Form Modal */}
      {showOrderForm && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-content bg-white p-4 rounded"
            style={{ width: "300px" }}
          >
            <h3 className="text-center mb-3">Place Order</h3>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => setShowOrderForm(false)}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={handlePlaceOrder}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
