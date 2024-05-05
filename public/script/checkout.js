// document.getElementById('checkout-form').addEventListener('submit', function (event) {
//   // Mendapatkan nilai dari inputan
//   let address = document.getElementById('address').value;
//   let postalCode = document.getElementById('postal-code').value;
//   let city = document.getElementById('city').value;

//   // Memeriksa apakah semua input telah diisi
//   if (address === '' || postalCode === '' || city === '') {
//     alert('Please fill in all fields before checking out.');
//     event.preventDefault(); // Mencegah pengiriman formulir jika input masih kosong
//   } else {
//     // Lakukan sesuatu jika semua input telah diisi
//     console.log('Address:', address);
//     console.log('Postal Code:', postalCode);
//     console.log('City:', city);
//     const popUpRecieve = document.querySelector('.popupRecieve');
//     popUpRecieve.style.display = 'block';
//     checkout(userID);
//     // Lakukan proses checkout atau tindakan lainnya
//   }
// });

document.addEventListener('DOMContentLoaded', function () {
  let inputs = document.querySelectorAll('input[required]');
  let checkoutBtn = document.querySelector('.checkoutBtn');

  function checkInputs() {
    let allInputsValid = true;
    inputs.forEach(function (input) {
      if (!input.validity.valid) {
        allInputsValid = false;
      }
    });
    checkoutBtn.disabled = !allInputsValid;
  }

  inputs.forEach(function (input) {
    input.addEventListener('input', checkInputs);
  });

  checkoutBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Mencegah pengiriman formulir secara default

    // Memeriksa apakah semua input telah diisi dengan benar
    let allInputsValid = true;
    inputs.forEach(function (input) {
      if (!input.validity.valid) {
        allInputsValid = false;
      }
    });

    // Jika semua input valid, lakukan checkout
    if (allInputsValid) {
      checkout(userID);
      const popUpRecieve = document.querySelector('.popupRecieve');
      popUpRecieve.style.display = 'block';
    } else {
      alert('Please fill in all required fields before checking out.');
    }
  });
});
