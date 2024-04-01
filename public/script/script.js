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
