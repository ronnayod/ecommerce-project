const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');


// Create a product (POST)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all products (GET) - เพิ่มเพื่อทดสอบ
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route: DELETE /api/products/:id
// Deletes a product by ID from the database
router.delete('/:id', async (req, res) => {
    try {
        // Log the received product ID for debugging
        console.log('Received ID:', req.params.id);

        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.log('Invalid ID format');
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Find and delete the product by ID
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            // If product not found, return 404
            console.log('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        // Successfully deleted the product
        res.json({ message: 'Product deleted' });
    } catch (error) {
        // Handle any errors during deletion
        console.error('Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Route: PUT /api/products/:id
// Updates a product by ID in the database
router.put('/:id', async (req, res) => {
    try {
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Find and update the product by ID
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body, // ข้อมูลที่ส่งมาเพื่ออัปเดต
            { new: true, runValidators: true } // ตัวเลือก: return ข้อมูลใหม่หลังอัปเดต และตรวจสอบ validation
        );

        if (!product) {
            // If product not found, return 404
            return res.status(404).json({ message: 'Product not found' });
        }

        // Successfully updated the product
        res.json(product); // ส่งข้อมูลที่อัปเดตแล้วกลับ
    } catch (error) {
        // Handle any errors during update
        console.error('Error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;