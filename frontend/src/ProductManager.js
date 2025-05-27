import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductManager.css'; // เพิ่มไฟล์ CSS คู่มือ

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', stock: '' });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  // Add
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', newProduct);
      setNewProduct({ name: '', price: '', description: '', stock: '' });
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  // Delete
  const handleDeleteProduct = async (id) => {
      try {
          console.log(id); 
          await axios.delete(`http://localhost:5000/api/products/${id}`);
          fetchProducts();
      } catch (err) {
          console.error('Error deleting product:', err);
      }
  };
  const handleEditProduct = (product) => {
    setEditProduct({ ...product });
  };

  // Update
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    console.log('Updating product:', editProduct); // ตรวจสอบข้อมูลก่อนส่ง
    try {
      await axios.put(`http://localhost:5000/api/products/${editProduct._id}`, editProduct);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Ecommerce Product Manager</h1>

      {/* Form เพิ่มสินค้า */}
      <div className="card p-4 mb-4">
        <h3>Add New Product</h3>
        <form onSubmit={handleAddProduct} className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              required
            />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </form>
      </div>

      {/* Form แก้ไขสินค้า */}
      {editProduct && (
        <div className="card p-4 mb-4">
          <h3>Edit Product</h3>
          <form onSubmit={handleUpdateProduct} className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                value={editProduct.name}
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                value={editProduct.price}
                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                value={editProduct.description}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                value={editProduct.stock}
                onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                required
              />
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-success me-2">Update</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditProduct(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* รายการสินค้า */}
      <h2 className="mb-4">Products</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Price: ${product.price}</p>
                <p className="card-text">Stock: {product.stock}</p>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditProduct(product)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductManager;