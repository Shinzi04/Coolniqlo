// Make a GET request to fetch cart items for the specified user
// fetch(`cart-items?userID=${userID}`)
//     .then(response => {
//         // Check if the response is successful (status code 200)
//         if (response.ok) {
//             // Parse the JSON response
//             return response.json();
//         }
//         // If response is not successful, throw an error
//         throw new Error('Failed to fetch cart items');
//     })
//     .then(cartItems => {
//         console.log('Cart Items:', cartItems);
//     })
//     .catch(error => {

//         console.error('Error fetching cart items:', error.message);
//     });

function addToCart(userID, productId) {
    fetch(`/cart/add-to-cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userID, productID: productId }),
    })
    .then(response => {
        if (response.ok) {
            
            console.log('Product added to cart');
        } else {
            console.error('Failed to add product to cart');
        }
    })
    .catch(error => {
        console.error('Error adding product to cart:', error);
    });
  }
  