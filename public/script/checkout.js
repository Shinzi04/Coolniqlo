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
