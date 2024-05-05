document.addEventListener('DOMContentLoaded', function () {
  const searchToggle = document.getElementById('searchToggle');
  const searchIcon = document.getElementById('searchIcon');
  const closeIcon = document.getElementById('closeIcon');
  const searchBar = document.getElementById('searchBar');

  searchToggle.addEventListener('click', function () {
    searchBar.classList.toggle('noSearch');
    if (searchBar.classList.contains('noSearch')) {
      searchIcon.style.display = 'none';
      closeIcon.style.display = 'block';
    } else {
      searchIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    }
  });
});

//untuk membuat biar bisa discroll
let currentIndex = 0;
const slideWidth = document.querySelector('.sort-container ul button').offsetWidth;
const slider = document.querySelector('.sort-container ul');
const numItems = slider.children.length;
const sLeft = document.querySelector('.scrollLeft');
const sRight = document.querySelector('.scrollRight');

if (numItems > 6) {
  sLeft.style.display = 'block';
  sRight.style.display = 'block';
} else {
  sLeft.style.display = 'none';
  sRight.style.display = 'none';
}

function scrollSlider(direction) {
  if (direction === 'left' && currentIndex > 0) {
    currentIndex--;
  } else if (direction === 'right' && currentIndex < numItems - 1) {
    currentIndex++;
  }
  const offset = -currentIndex * slideWidth;
  slider.style.transform = `translateX(${offset}px)`;
}

//Toggle class active utk hamburger menu
const navbarNav = document.querySelector('.navbar-nav');

//ketika humburger menu diklik (ARROW FUNCTION)
document.querySelector('#hamburger-menu').onclick = () => {
  navbarNav.classList.toggle('active');
};

const userPopup = document.querySelector('.userPopup');
const iconUserContainer = document.querySelector('.iconUserContainer');
const closeBtnDown = document.querySelector('.closeBtnDown');

iconUserContainer.onclick = () => {
  userPopup.classList.toggle('displayBlock');
  userPopup.style.animation = 'slideInFromBottom 0.5s ease-in-out forwards';
  iconUserContainer.style.animation = 'fadeOut 0.5s ease-in forwards';
};

closeBtnDown.addEventListener('click', function () {
  userPopup.style.animation = 'slideInFromTop 0.5s ease-in-out forwards';
  iconUserContainer.style.animation = 'fadeIn 0.5s ease-in forwards';

  // Setelah 0.5 detik (durasi animasi), hilangkan kelas displayBlock
  setTimeout(() => {
    userPopup.classList.remove('displayBlock');
  }, 500);
});

function selectButton(button, type) {
  const buttons = document.querySelectorAll('.sort-container ul li button');
  // Mencari semua tombol dalam elemen <ul>

  // Menghapus kelas 'selected' dari semua tombol
  buttons.forEach(function (btn) {
    btn.classList.remove('selected');
  });

  // Menambahkan kelas 'selected' pada tombol yang diklik
  button.classList.add('selected');

  // Lakukan sesuatu berdasarkan jenis (type) tombol yang diklik
  switch (type) {
    case 'price':
      // Lakukan sesuatu jika tombol Price (Descending) diklik
      sortBy_Desc('price');
      break;
    case 'rating':
      // Lakukan sesuatu jika tombol Rating (Ascending) diklik
      sortBy_Asc('rating');
      break;
    case 'greaterThanFour':
      // Lakukan sesuatu jika tombol rating lebih besar 4 diklik
      sortByRatingGreaterThanFour('rating');
      break;
    case 'sold':
      // Lakukan sesuatu jika tombol Sold (Descending) diklik
      sortBy_Desc('sold');
      break;
    default:
    // Lakukan sesuatu jika tombol lainnya diklik
  }
  clearBtn = document.querySelector('.submitBtn');

  clearBtn.addEventListener('click', function () {
    buttons.forEach(function (btn) {
      btn.classList.remove('selected');
    });
  });
}
