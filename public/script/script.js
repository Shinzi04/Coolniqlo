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

//Toggle class active utk hamburger menu
const navbarNav = document.querySelector('.navbar-nav');

//ketika humburger menu diklik (ARROW FUNCTION)
document.querySelector('#hamburger-menu').onclick = () => {
  navbarNav.classList.toggle('active');
};
