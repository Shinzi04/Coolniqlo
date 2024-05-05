const { Router } = require('express');
const cartRouter = Router();
const Cart = require('../../models/cart');
const mongoose = require('mongoose');

// Route to add an item to the cart
cartRouter.post('/add', async (req, res) => {
  try {
    const { userID, productID } = req.body;

    // Search existed product in database
    let cartItem = await Cart.findOne({ userID: userID, productID: productID });

    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cartItem = new Cart({
        userID: userID,
        productID: productID,
        quantity: 1,
      });
    }
    await cartItem.save();
    res.send('Item added to cart');
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).send('Internal Server Error');
  }
});

cartRouter.post('/reduce', async (req, res) => {
  try {
    const { userID, productID } = req.body;

    const cartItem = await Cart.findOne({
      userID: userID,
      productID: productID,
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in the cart' });
    }

    cartItem.quantity -= 1;

    if (cartItem.quantity === 0) {
      // If quantity becomes 0, remove the item from the cart
      await Cart.deleteOne({ _id: cartItem._id });
      res.json({
        message: 'Item removed from the cart as its quantity became 0',
      });
    } else {
      // Otherwise, save the updated quantity
      await cartItem.save();
      res.json({ message: 'Quantity reduced successfully' });
    }
  } catch (error) {
    console.error('Error reducing quantity of item in cart:', error);
    res.status(500).send('Internal Server Error');
  }
});

cartRouter.get('/get', async (req, res) => {
  try {
    const userID = req.query.userID;

    if (!userID) {
      return res.status(400).json({ message: 'userID parameter is required' });
    }

    const cartItems = await Cart.find({ userID: userID });
    const userCartItems = await Promise.all(
      cartItems.map(async (item) => {
        return {
          _id: item._id,
          userID: item.userID,
          product: item.productID,
          quantity: item.quantity,
        };
      })
    );
    res.json(userCartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).send('Internal Server Error');
  }
});

cartRouter.delete('/delete', async (req, res) => {
  try {
    const { userID, productID } = req.body;
    await Cart.deleteOne({ userID: userID, productID: productID });
    res.send('Item deleted from cart');
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Adds a new item to the

module.exports = cartRouter;
