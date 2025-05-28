import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductManager.css'; // เพิ่มไฟล์ CSS คู่มือ
import { Link } from 'react-router-dom';
import ProductList from './components/product/ProductList';
import ProductEdit from './components/product/ProductEdit';
import ProductAdd from './components/product/ProductAdd';

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
    <> 
      <div className="container mt-5">
        <h1 className="text-center mb-4">Ecommerce Product Manager</h1>

        {/* Form เพิ่มสินค้า */}
        <ProductAdd
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          handleAddProduct={handleAddProduct}
        />

        {/* Form แก้ไขสินค้า */}
        <ProductEdit
          editProduct={editProduct}
          setEditProduct={setEditProduct}
          handleUpdateProduct={handleUpdateProduct}
        />

        {/* รายการสินค้า */}
        <ProductList
          products={products}
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
        />
      </div>
      <div className="text-center mt-4">
          <Link to="/">
            <button className="btn btn-primary">กลับหน้าหลัก</button>
          </Link>
      </div>
    </>
 
  );
}

export default ProductManager;