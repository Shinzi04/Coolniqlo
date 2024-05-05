// // Variable to track whether a fetch operation is in progress
let isFetchingCartItems = false;
function addToCart(userID, productId) {
  if (isFetchingCartItems) {
    console.log("Another fetch operation is already in progress.");
    return;
  }

  isFetchingCartItems = true;

  fetch(`/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID: userID, productID: productId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }
      console.log("Product added to cart");
    })
    .catch((error) => {
      console.error("Error adding product to cart:", error);
    })
    .finally(() => {
      isFetchingCartItems = false;
      // Fetch cart items and render them after addition (or failure)
      fetchAndRenderCartItems(userID);
    });
}

function reduceCartItem(userID, productID) {
  if (isFetchingCartItems) {
    console.log("Another fetch operation is already in progress.");
    return;
  }

  isFetchingCartItems = true;

  fetch(`/cart/reduce`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID: userID, productID: productID }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to reduce quantity of the item in cart");
      }
      console.log("Quantity reduced for the item in cart");
    })
    .catch((error) => {
      console.error("Error reducing quantity of item in cart:", error);
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
      console.error("Error fetching cart items:", error.message);
    });
}

// Call fetchAndRenderCartItems once after DOMContentLoaded event
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await fetchAndRenderCartItems(userID);
  } catch (error) {
    console.error("Error rendering cart items:", error.message);
  }
});

async function fetchCartItems(userID) {
  try {
    const response = await fetch(`/cart/get?userID=${userID}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error("Failed to fetch cart items");
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
    throw error;
  }
}

function renderCartItemsOnPage(cartItems) {
  const checkOutTable = document.getElementById("fetched-table");
  const total = document.getElementById("totalPrice");
  checkOutTable.innerHTML = "";
  total.innerHTML="";
  let totalPrice = 0; 
  cartItems.forEach(async (item) => {
    let userSpecificItem = await fetchSpecificItem(item.product);
    let itemTotalPrice = parseInt(userSpecificItem.price) * parseInt(item.quantity);
    totalPrice += itemTotalPrice;
    const tableBody = `
            <th>
                <div class ="fetched-image-container">
                    <img src="${userSpecificItem.bigImage}" alt="">
                </div>
            </th>
            <th>${item.quantity}</th>
            <th>${new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(userSpecificItem.price)}</th>
        `;
    checkOutTable.innerHTML += tableBody;
    total.innerHTML = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(totalPrice);
  });
  

}

async function fetchSpecificItem(productId) {
  try {
    // Make a GET request to your server endpoint
    const response = await fetch(`/userItems?itemId=${productId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch item");
    }
    return data;
  } catch (error) {
    console.error("Error fetching specific item:", error.message);
    throw error;
  }
}

function deleteAllCartItem(userID, productID) {
  if (isFetchingCartItems) {
    console.log("Another fetch operation is already in progress.");
    return;
  }

  isFetchingCartItems = true;

  fetch("/cart/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID: userID, productID: productID }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Item deleted from cart");
        // Lakukan sesuatu jika item berhasil dihapus
      } else {
        console.error("Failed to delete item from cart");
        // Lakukan sesuatu jika terjadi kesalahan saat menghapus item
      }
    })
    .catch((error) => {
      console.error("Error deleting item from cart:", error);
      // Tangani kesalahan jika terjadi kesalahan saat melakukan permintaan
    })
    .finally(() => {
      isFetchingCartItems = false;
      // Fetch cart items and render them after deletion (or failure)
      fetchAndRenderCartItems(userID);
    });
}
