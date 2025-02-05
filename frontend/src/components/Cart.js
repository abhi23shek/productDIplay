// import { useContext } from "react";
// import { CartContext } from "./context/Cart";

// export default function Cart() {
//   const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } =
//     useContext(CartContext);

//   return (
//     <div className="container py-5">
//       <h1 className="text-center mb-4">Your Shopping Cart</h1>

//       <div className="row">
//         {cartItems.map((item) => (
//           <div className="col-12 col-md-6 col-lg-4 mb-4" key={item.id}>
//             <div className="card">
//               <img
//                 src={item.image_url}
//                 alt={item.title}
//                 className="card-img-top"
//               />
//               <div className="card-body">
//                 <h5 className="card-title">{item.name}</h5>
//                 <p className="card-text text-muted">{item.price}</p>

//                 <div className="d-flex justify-content-between align-items-center">
//                   <div className="d-flex align-items-center">
//                     <button
//                       className="btn btn-secondary btn-sm me-2"
//                       onClick={() => addToCart(item)}
//                     >
//                       +
//                     </button>
//                     <span>{item.quantity}</span>
//                     <button
//                       className="btn btn-secondary btn-sm ms-2"
//                       onClick={() => removeFromCart(item)}
//                     >
//                       -
//                     </button>
//                   </div>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => removeFromCart(item)}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {cartItems.length > 0 ? (
//         <div className="text-center mt-4">
//           <h3>Total: ${getCartTotal()}</h3>
//           <button className="btn btn-danger mt-3" onClick={() => clearCart()}>
//             Clear Cart
//           </button>
//         </div>
//       ) : (
//         <h3 className="text-center mt-4">Your cart is empty</h3>
//       )}
//     </div>
//   );
// }

import { useContext } from "react";
import { CartContext } from "./context/Cart";

export default function Cart() {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } =
    useContext(CartContext);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Your Shopping Cart</h1>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
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
                <td>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-fluid"
                    style={{ maxWidth: "100px", height: "auto" }}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-secondary btn-sm me-2"
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>
                    <span>{item.quantity}</span>
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
                    onClick={() => removeFromCart(item)}
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
          <h3>Total: ${getCartTotal()}</h3>
          <button className="btn btn-danger mt-3" onClick={() => clearCart()}>
            Clear Cart
          </button>
        </div>
      ) : (
        <h3 className="text-center mt-4">Your cart is empty</h3>
      )}
    </div>
  );
}
