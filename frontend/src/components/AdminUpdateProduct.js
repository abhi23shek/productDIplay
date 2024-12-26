import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AdminUpdateProduct = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const navigate = useNavigate(); // Use navigate to redirect after successful update
    const [product, setProduct] = useState({ name: '', price: '', details: '', image_url: '' });

    // Fetch product details when the component mounts
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/products/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3001/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });

            if (response.ok) {
                const updatedProduct = await response.json();
                console.log('Product updated:', updatedProduct);
                navigate('/admin'); // Redirect to admin dashboard after update
            } else {
                console.error('Error updating product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div>
            <h2>Update Product</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                />
                <textarea
                    name="details"
                    value={product.details}
                    onChange={handleChange}
                    placeholder="Details"
                />
                <input
                    type="text"
                    name="image_url"
                    value={product.image_url}
                    onChange={handleChange}
                    placeholder="Image URL"
                />
                <button type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default AdminUpdateProduct;
