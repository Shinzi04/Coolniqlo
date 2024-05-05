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
  