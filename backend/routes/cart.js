const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart
router.post('/add', async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [], totalPrice: 0 });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    // Calculate total price
    cart.totalPrice = await calculateTotalPrice(cart.items);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Calculate total price
async function calculateTotalPrice(items) {
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId);
    total += product.price * item.quantity;
  }
  return total;
}

module.exports = router;