const jumbo = document.querySelector('.displayImage');
const childs = document.querySelectorAll('.miniImage');
const xx = document.querySelector('.imageBox');

xx.addEventListener('click', function (e) {
  //cek apakah yg diklik itu child img nya
  if (e.target.className == 'miniImage') {
    jumbo.src = e.target.src;
  }
});
