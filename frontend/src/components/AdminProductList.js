import React, { useEffect, useState } from "react";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Send a DELETE request to the backend
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update the local state to remove the product from the list
        setProducts(products.filter((product) => product.id !== id));
      } else {
        console.error("Error deleting product:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Product List</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-lg-2 col-md-4 col-sm-6 mb-4">
              <div className="card shadow-sm">
                <img
                  src={product.image_url}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="card-title">{product.name}</h6>
                  <p className="card-text">
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <p className="card-text text-truncate">{product.details}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                    <a
                      href={`/admin/update/${product.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <p>No products available.</p>
          </div>
        )}
      </div>
    </div>

    // <div>
    //   <h2>Product List</h2>
    //   <ul>
    //     {products.map((product) => (
    //       <li key={product.id}>
    //         <p>{product.name}</p>
    //         <p>{product.price}</p>
    //         <p>{product.details}</p>
    //         <img src={product.image_url} alt={product.name} width="100" />
    //         <button onClick={() => handleDelete(product.id)}>Delete</button>
    //         <a href={`/admin/update/${product.id}`}>Edit</a>{" "}
    //         {/* Link to edit the product */}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
};

export default AdminProductList;

// import React, { useEffect, useState } from 'react';

// const AdminProductList = () => {
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await fetch('http://localhost:3001/api/products');
//                 const data = await response.json();
//                 setProducts(data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             }
//         };
//         fetchProducts();
//     }, []);

//     const handleDelete = async (id) => {
//         try {
//             await fetch(`http://localhost:3001/api/products/${id}`, {
//                 method: 'DELETE',
//             });
//             setProducts(products.filter((product) => product.id !== id)); // Remove the product from the list
//         } catch (error) {
//             console.error('Error deleting product:', error);
//         }
//     };

//     return (
//         <div>
//             <h2>Product List</h2>
//             <ul>
//                 {products.map((product) => (
//                     <li key={product.id}>
//                         <p>{product.name}</p>
//                         <p>{product.price}</p>
//                         <p>{product.details}</p>
//                         <img src={product.image_url} alt={product.name} width="100" />
//                         <button onClick={() => handleDelete(product.id)}>Delete</button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default AdminProductList;