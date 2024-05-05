const Router = require("express");
const purchaseHistoryModel = require('../../models/purchaseHistory');
const purchaseHistoryRouter = Router();

purchaseHistoryRouter.post('/add', async (req, res) => {
    try {
        const { userID, productID, quantity } = req.body
        const purchaseHistory = new purchaseHistoryModel({
            userID: userID,
            productID: productID,
            quantity: quantity
        })
        await purchaseHistory.save()
        res.send('Item added to purchase history')
    } catch (error) {
        res.status(500).send(error.message)
    }
})

purchaseHistoryRouter.get('/get', async (req, res) => {
    try {
        const productID = req.query.productID
        const purchaseHistory = await purchaseHistoryModel.find({ productID: productID })
        res.send(purchaseHistory)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

purchaseHistoryRouter.delete('/delete', async (req, res) => {
    try {
        const history_id = req.query._id
        const purchaseHistory = await purchaseHistoryModel.deleteOne({ _id : history_id })
        res.send("Item deleted from purchase history")

    } catch (error) {
       console.error('Error deleting item from cart:', error);
       res.status(500).send('Internal Server Error');
    }
})
module.exports = purchaseHistoryRouter;
