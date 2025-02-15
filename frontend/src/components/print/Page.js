// import React, { useRef, useEffect } from "react";
// import "./Page.css";

// const Page = ({
//   dateApplicable,
//   companyName,
//   phoneNumbers,
//   hintText,
//   subcategoryName,
//   subPageNumber,
//   productsOnPage = [],
//   pageNumber,
//   totalPage,
//   priceFlag,
//   priceAdjustment,
// }) => {
//   const productNameRefs = useRef([]);

//   useEffect(() => {
//     productNameRefs.current.forEach((ref, index) => {
//       if (ref) {
//         const maxWidth = 240.6; // Cell width in pixels
//         let fontSize = 18; // Initial font size

//         // // Temporarily set the font size to measure the width
//         // ref.style.fontSize = `${fontSize}px`;

//         // Reduce font size until the text fits within the cell width
//         while (ref.scrollWidth > maxWidth && fontSize > 6) {
//           fontSize -= 0.5;
//           ref.style.fontSize = `${fontSize}px`;
//         }

//         // Ensure the text does not wrap
//         ref.style.whiteSpace = "nowrap";
//         ref.style.overflow = "hidden";
//         ref.style.textOverflow = "ellipsis";
//       }
//     });
//   }, [productsOnPage]);

//   return (
//     <div className="parentcontainerforprint">
//       <div id="a4-page" className="a4-page">
//         {/* Header Section */}
//         <div className="date-applicable">
//           Rates List applicable from {dateApplicable}
//         </div>
//         <div className="companyName">{companyName}</div>
//         <div className="phoneNumbers">{phoneNumbers}</div>
//         <div className="hintText">{hintText}</div>
//         <div className="subcategoryName">{subcategoryName}</div>
//         <div className="subPageNumber">{subPageNumber}</div>

//         {/* Product Grid */}
//         <div className="productgrid">
//           {productsOnPage.map((product, index) => (
//             <div key={index} className="productcardtoprint">
//               <div
//                 ref={(el) => (productNameRefs.current[index] = el)}
//                 className="productnametoprint"
//                 style={{ fontSize: "18px", whiteSpace: "nowrap" }} // Initial styles
//               >
//                 {product.name}
//               </div>
//               <div className="productnameline"></div>

//               <div className="productdetailstoprint">
//                 <div className="productpricetoprint">
//                   Rs.{" "}
//                   {priceFlag
//                     ? (() => {
//                         const basePrice = parseFloat(product.price);
//                         if (priceAdjustment === 0) {
//                           return basePrice;
//                         }
//                         const adjustment = basePrice * (priceAdjustment / 100);
//                         const adjustedPrice = basePrice + adjustment;
//                         const roundedPrice = Math.round(adjustedPrice);
//                         return roundedPrice;
//                       })()
//                     : ""}
//                 </div>
//                 <div className="productsizetoprint">{product.details}</div>
//               </div>
//               <div className="productdetailline"></div>
//               <img
//                 src={product.image_url}
//                 alt={product.productName}
//                 className="productimagetoprint"
//               />
//             </div>
//           ))}
//         </div>
//         <div className="pagenumbertoprint">
//           Page {pageNumber} of {totalPage}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;

import React, { useRef, useEffect } from "react";
import "./Page.css";

const Page = ({
  dateApplicable,
  companyName,
  phoneNumbers,
  hintText,
  subcategoryName,
  subPageNumber,
  productsOnPage = [],
  pageNumber,
  totalPage,
  priceFlag,
  priceAdjustment,
}) => {
  const productNameRefs = useRef([]);

  // useEffect(() => {
  //   const resizeObserver = new ResizeObserver((entries) => {
  //     entries.forEach((entry) => {
  //       const ref = entry.target;
  //       const maxWidth = 240.6; // Cell width in pixels
  //       let fontSize = 18; // Initial font size

  //       // Reduce font size until the text fits within the cell width
  //       while (ref.scrollWidth > maxWidth && fontSize > 6) {
  //         fontSize -= 0.5;
  //         ref.style.fontSize = `${fontSize}px`;
  //       }

  //       // Ensure the text does not wrap
  //       ref.style.whiteSpace = "nowrap";
  //       ref.style.overflow = "hidden";
  //       ref.style.textOverflow = "ellipsis";
  //     });
  //   });

  //   productNameRefs.current.forEach((ref) => {
  //     if (ref) {
  //       resizeObserver.observe(ref);
  //     }
  //   });

  //   return () => {
  //     productNameRefs.current.forEach((ref) => {
  //       if (ref) {
  //         resizeObserver.unobserve(ref);
  //       }
  //     });
  //   };
  // }, [productsOnPage]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const ref = entry.target;
        const maxWidth = 240.6; // Cell width in pixels
        let fontSize = 18; // Initial font size

        // Reduce font size until the text fits within the cell width
        while (ref.scrollWidth > maxWidth && fontSize > 6) {
          fontSize -= 1;
          ref.style.fontSize = `${fontSize}px`;
        }

        // Ensure the text does not wrap
        ref.style.whiteSpace = "nowrap";
        ref.style.overflow = "hidden";
        ref.style.textOverflow = "ellipsis";
      });
    });

    // Wait for all images to load before observing
    const images = document.querySelectorAll(".productimagetoprint");
    let imagesLoaded = 0;

    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === images.length) {
        // All images are loaded, now observe the product names
        productNameRefs.current.forEach((ref) => {
          if (ref) {
            resizeObserver.observe(ref);
          }
        });
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
      }
    });

    return () => {
      productNameRefs.current.forEach((ref) => {
        if (ref) {
          resizeObserver.unobserve(ref);
        }
      });
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
      });
    };
  }, [productsOnPage]);

  return (
    <div className="parentcontainerforprint">
      <div id="a4-page" className="a4-page">
        {/* Header Section */}
        <div className="date-applicable">
          Rates List applicable from {dateApplicable}
        </div>
        <div className="companyName">{companyName}</div>
        <div className="phoneNumbers">{phoneNumbers}</div>
        <div className="hintText">{hintText}</div>
        <div className="subcategoryName">{subcategoryName}</div>
        <div className="subPageNumber">{subPageNumber}</div>

        {/* Product Grid */}
        <div className="productgrid">
          {productsOnPage.map((product, index) => (
            <div key={index} className="productcardtoprint">
              <div
                ref={(el) => (productNameRefs.current[index] = el)}
                className="productnametoprint"
                style={{ fontSize: "18px", whiteSpace: "nowrap" }} // Initial styles
              >
                {product.name}
              </div>
              <div className="productnameline"></div>

              <div className="productdetailstoprint">
                <div className="productpricetoprint">
                  Rs.{" "}
                  {priceFlag
                    ? (() => {
                        const basePrice = parseFloat(product.price);
                        if (priceAdjustment === 0) {
                          return basePrice;
                        }
                        const adjustment = basePrice * (priceAdjustment / 100);
                        const adjustedPrice = basePrice + adjustment;
                        const roundedPrice = Math.round(adjustedPrice);
                        return roundedPrice;
                      })()
                    : ""}
                </div>
                <div className="productsizetoprint">{product.details}</div>
              </div>
              <div className="productdetailline"></div>
              <img
                src={product.image_url}
                alt={product.productName}
                className="productimagetoprint"
              />
            </div>
          ))}
        </div>
        <div className="pagenumbertoprint">
          Page {pageNumber} of {totalPage}
        </div>
      </div>
    </div>
  );
};

export default Page;
