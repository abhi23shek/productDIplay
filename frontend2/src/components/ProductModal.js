import React, { useRef, useEffect } from "react";
import "./ProductModal.css";

const ProductModal = ({
  modalProduct,
  closeModal,
  handleAddToCart,
  handleRemoveFromCart,
  cartItems,
  handlePreviousProduct,
  handleNextProduct,
  handleTouchStart,
  handleTouchEnd,
  currentProductIndex,
  displayOrder,
  setQuantity,
}) => {
  const modalRef = useRef(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  if (!modalProduct) return null;

  const cartProduct = cartItems.find((item) => item.id === modalProduct.id);

  return (
    <div
      className="modal show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div
          className="modal-content"
          ref={modalRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="modal-header">
            <h3 className="modal-title">{modalProduct.name}</h3>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="Model-image col-md-auto">
                <img
                  src={modalProduct.image_url}
                  alt={modalProduct.name}
                  className="img-fluid"
                />
              </div>
              <div className="col-md-auto">
                <div className="Model-price">
                  <h5>Price:</h5>
                  <div className="Model-price-value">₹{modalProduct.price}</div>
                </div>
                <div className="Model-description">
                  <h5>{modalProduct.details}</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {cartProduct ? (
              <div className="d-flex align-items-center gap-1 mt-3">
                <button
                  onClick={() => {
                    if (cartProduct.quantity === 1) {
                      handleRemoveFromCart(modalProduct, true);
                    } else {
                      handleRemoveFromCart(modalProduct);
                    }
                  }}
                  className="btn btn-danger btn-sm"
                >
                  -
                </button>
                {/* <button
                  className="btn btn-success btn-sm d-flex align-items-center"
                  disabled
                >
                  <i className="bi bi-cart me-1"></i>
                  {cartProduct.quantity}
                </button> */}
                <input
                  onClick={(e) => e.stopPropagation()}
                  type="number"
                  value={cartProduct.quantity}
                  // min="0"
                  style={{ width: "60px", textAlign: "center" }}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value);

                    setQuantity(cartProduct, newQuantity);
                  }}
                />
                <button
                  onClick={() => handleAddToCart(modalProduct)}
                  className="btn btn-warning btn-sm"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddToCart(modalProduct)}
                className="btn btn-warning btn-sm mt-3"
              >
                Add to Cart
              </button>
            )}
            <button
              className="btn btn-secondary me-2"
              onClick={handlePreviousProduct}
            >
              Previous
            </button>
            <button className="btn btn-primary" onClick={handleNextProduct}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
