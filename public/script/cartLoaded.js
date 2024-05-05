// // Variable to track whether a fetch operation is in progress
let isFetchingCartItems = false;
function addToCart(userID, productId) {
  if (isFetchingCartItems) {
    console.log('Another fetch operation is already in progress.');
    return;
  }

  isFetchingCartItems = true;

  fetch(`/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userID: userID, productID: productId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }
      console.log('Product added to cart');
    })
    .catch((error) => {
      console.error('Error adding product to cart:', error);
    })
    .finally(() => {
      isFetchingCartItems = false;
      // Fetch cart items and render them after addition (or failure)
      fetchAndRenderCartItems(userID);
    });
}

function reduceCartItem(userID, productID) {
  if (isFetchingCartItems) {
    console.log('Another fetch operation is already in progress.');
    return;
  }

  isFetchingCartItems = true;

  fetch(`/cart/reduce`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userID: userID, productID: productID }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to reduce quantity of the item in cart');
      }
      console.log('Quantity reduced for the item in cart');
    })
    .catch((error) => {
      console.error('Error reducing quantity of item in cart:', error);
    })
    .finally(() => {
      isFetchingCartItems = false;
      // Fetch cart items and render them after reduction (or failure)
      fetchAndRenderCartItems(userID);
    });
}

function fetchAndRenderCartItems(userID) {
  fetchCartItems(userID)
    .then((cartItems) => {
      renderCartItemsOnPage(cartItems);
    })
    .catch((error) => {
      console.error('Error fetching cart items:', error.message);
    });
}

// Call fetchAndRenderCartItems once after DOMContentLoaded event
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await fetchAndRenderCartItems(userID);
  } catch (error) {
    console.error('Error rendering cart items:', error.message);
  }
});

async function fetchCartItems(userID) {
  try {
    const response = await fetch(`/cart/get?userID=${userID}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch cart items');
  } catch (error) {
    console.error('Error fetching cart items:', error.message);
    throw error;
  }
}

function renderCartItemsOnPage(cartItems) {
  const cartContainer = document.getElementById('cart-items');
  cartContainer.innerHTML = '';

  cartItems.forEach(async (item) => {
    let userSpecificItem = await fetchSpecificItem(item.product);
    const userItem = `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="../${userSpecificItem.bigImage}" alt="">
            </div>
            <div class="cart-item-details">
                <div class="item-title">${userSpecificItem.name}</div>
                <div class="item-quantity">
                  <div class="plusMinesItem">
                  <a class ="minesItem" onclick="reduceCartItem('${userID}','${userSpecificItem._id}')"><i class="fa-solid fa-minus"></i></a>
                  <p>${item.quantity}</p>
                  <a class ="plusItem" onclick="addToCart('${userID}','${userSpecificItem._id}')"><i class="fa-solid fa-plus"></i></a>
                  </div>
                    <div class="deleteCart" onclick="deleteAllCartItem('${userID}','${userSpecificItem._id}')"><i class="fa-solid fa-trash-can"></i></div>
                </div>
            </div>
        </div>
        `;
    cartContainer.innerHTML += userItem;
  });
}

async function fetchSpecificItem(productId) {
  try {
    // Make a GET request to your server endpoint
    const response = await fetch(`/userItems?itemId=${productId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch item');
    }
    return data;
  } catch (error) {
    console.error('Error fetching specific item:', error.message);
    throw error;
  }
}

function deleteAllCartItem(userID, productID) {
  if (isFetchingCartItems) {
    console.log('Another fetch operation is already in progress.');
    return;
  }

  isFetchingCartItems = true;

  fetch('/cart/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userID: userID, productID: productID }),
  })
    .then((response) => {
      if (response.ok) {
        console.log('Item deleted from cart');
        // Lakukan sesuatu jika item berhasil dihapus
      } else {
        console.error('Failed to delete item from cart');
        // Lakukan sesuatu jika terjadi kesalahan saat menghapus item
      }
    })
    .catch((error) => {
      console.error('Error deleting item from cart:', error);
      // Tangani kesalahan jika terjadi kesalahan saat melakukan permintaan
    })
    .finally(() => {
      isFetchingCartItems = false;
      // Fetch cart items and render them after deletion (or failure)
      fetchAndRenderCartItems(userID);
    });
}
