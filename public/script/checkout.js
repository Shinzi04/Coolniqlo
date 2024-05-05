document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var cardHolder = document.getElementById('card-holder').value;
    var cardNumber = document.getElementById('card-number').value;
    var expiryDate = document.getElementById('expiry-date').value;
    var cvv = document.getElementById('cvv').value;
    if (cardHolder === '' || cardNumber === '' || expiryDate === '' || cvv === '') {
      alert('Mohon isi semua field');
      return;
    }
    alert('Pembayaran berhasil!');
  });

async function addItemToPurchaseHistory(userID, productID, quantity) {
  try {
    const response = await fetch(`/purchaseHistory/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userID: userID, 
        productID: productID, 
        quantity: quantity,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add history');
    }

    console.log("Item added to purchase history");
  } catch (error) {
    console.error('Error adding item to purchase history:', error);
  }
}