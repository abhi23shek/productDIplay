// // import React from "react";
// // import styled from "styled-components";

// // const ProductCardContainer = styled.div`
// //   width: 100%;
// //   height: 100vh; /* Full viewport height */
// //   display: flex;
// //   flex-direction: column; /* Align items vertically */
// //   background-color: #f8f8f8; /* Example background color */
// //   overflow-y: auto; /* Enable scrolling if content overflows */
// // `;

// // const ProductImage = styled.img`
// //   width: 100%;
// //   height: 60vh;
// //   object-fit: contain; // Key change
// //   border-bottom: 1px solid #ddd;
// // `;

// // const ProductDetails = styled.div`
// //   padding: 16px;
// //   flex-grow: 1; /* Allow details to take up remaining space */
// // `;

// // const ProductName = styled.h2`
// //   font-size: 1.8rem;
// //   margin-bottom: 8px;
// //   color: #333;
// // `;

// // const ProductPrice = styled.p`
// //   font-size: 1.4rem;
// //   color: #007bff; /* Example - Use your brand color */
// //   margin-bottom: 16px;
// // `;

// // const ProductDescription = styled.p`
// //   font-size: 1rem;
// //   color: #666;
// //   line-height: 1.5;
// // `;

// // const AddToCartButton = styled.button`
// //   background-color: #007bff;
// //   color: white;
// //   padding: 12px 20px;
// //   border: none;
// //   border-radius: 5px;
// //   font-size: 1.2rem;
// //   cursor: pointer;
// //   transition: background-color 0.3s;

// //   &:hover {
// //     background-color: #0056b3;
// //   }
// // `;

// // const TrialProductCard = ({ product }) => {
// //   return (
// //     <ProductCardContainer>
// //       <ProductImage src={product.image} alt={product.name} />
// //       <ProductDetails>
// //         <ProductName>{product.name}</ProductName>
// //         <ProductPrice>${product.price}</ProductPrice>
// //         <ProductDescription>{product.description}</ProductDescription>
// //         <AddToCartButton>Add to Cart</AddToCartButton>
// //       </ProductDetails>
// //     </ProductCardContainer>
// //   );
// // };

// // export default TrialProductCard;

// import React from "react";
// import styled from "styled-components";
// // ... (imports)

// const ProductCardContainer = styled.div`
//   width: 90%; /* Slightly narrower card */
//   max-width: 600px; /* Set a maximum width */
//   margin: 20px auto; /* Center the card */
//   background-color: #f8f8f8; /* Light gray background */
//   border-radius: 8px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
//   overflow: hidden; /* Prevents image from overflowing rounded corners */
//   font-family: sans-serif;
// `;

// const ProductImage = styled.img`
//   width: 100%;
//   height: 40vh; /* Slightly smaller image */
//   object-fit: cover;
// `;

// const ProductDetails = styled.div`
//   padding: 20px;
// `;

// // ... (ProductName, ProductPrice, ProductDescription styles - similar to previous examples)

// const ProductName = styled.h2`
//   font-size: 1.8rem;
//   margin-bottom: 8px;
//   color: #333;
// `;

// const ProductPrice = styled.p`
//   font-size: 1.4rem;
//   color: #007bff; /* Example - Use your brand color */
//   margin-bottom: 16px;
// `;

// const ProductDescription = styled.p`
//   font-size: 1rem;
//   color: #666;
//   line-height: 1.5;
// `;

// const AddToCartButton = styled.button`
//   background-color: #007bff;
//   color: white;
//   padding: 14px 24px;
//   border: none;
//   border-radius: 8px;
//   font-size: 1.2rem;
//   font-weight: 500;
//   cursor: pointer;
//   transition: background-color 0.3s, transform 0.2s;

//   &:hover {
//     background-color: #0056b3;
//     transform: translateY(-2px);
//   }

//   &:active {
//     transform: translateY(0);
//   }
// `;

// // ... (TrialProductCard component remains the same)
// const TrialProductCard = ({ product }) => {
//   return (
//     <ProductCardContainer>
//       <ProductImage src={product.image} alt={product.name} />
//       <ProductDetails>
//         <ProductName>{product.name}</ProductName>
//         <ProductPrice>${product.price}</ProductPrice>
//         <ProductDescription>{product.description}</ProductDescription>
//         <AddToCartButton>Add to Cart</AddToCartButton>
//       </ProductDetails>
//     </ProductCardContainer>
//   );
// };

// export default TrialProductCard;

import React from "react";
import styled from "styled-components";

const ProductCardContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden; /* Hide scrollbars */
  position: relative; /* For absolute positioning of details */
`;

const ProductImage = styled.img`
  width: 90%;
  height: 70%;
  object-fit: contain;
`;

const ProductDetails = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent black */
  color: white;
  padding: 20px;
`;

const ProductName = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ProductPrice = styled.p`
  font-size: 1.4rem;
  margin-bottom: 12px;
`;

const ProductDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const AddToCartButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const TrialProductCard = ({ product }) => {
  return (
    <ProductCardContainer>
      <ProductImage src={product.image} alt={product.name} />
      <ProductDetails>
        <ProductName>{product.name}</ProductName>
        <ProductPrice>${product.price}</ProductPrice>
        <ProductDescription>{product.description}</ProductDescription>
        <AddToCartButton>Add to Cart</AddToCartButton>
      </ProductDetails>
    </ProductCardContainer>
  );
};

export default TrialProductCard;
