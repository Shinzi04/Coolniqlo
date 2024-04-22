const { Router } = require("express");
const cartRouter = Router();
const Cart = require("../../models/cart");
const Product = require("../../models/productList");
const mongoose = require('mongoose');

// Route to add an item to the cart
cartRouter.post('/add-to-cart', async (req, res) => {
    try {
        const { userID, productID } = req.body;
        
        // Search existed product in database
        let cartItem = await Cart.findOne({userID:userID, productID:productID});
        
        if(cartItem){
            cartItem.quantity +=1;

        }else{
            cartItem = new Cart({ userID: userID, productID: productID, quantity:1 });
        }
        await cartItem.save();  
        res.send('Item added to cart');
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

cartRouter.get('/cart-items', async (req, res) => {
    try {
        const userID = req.query.userID; // Extract userID from query parameters
        
        if (!userID) {
            return res.status(400).json({ message: 'userID parameter is required' });
        }

        // Find all items in the cart for the specified user and populate product details
        const cartItems = await Cart.find({ userID: userID }).populate('productID');
        
        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = cartRouter;
