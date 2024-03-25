document.addEventListener("DOMContentLoaded", function () {
  const searchToggle = document.getElementById("searchToggle");
  const searchIcon = document.getElementById("searchIcon");
  const closeIcon = document.getElementById("closeIcon");
  const searchBar = document.getElementById("searchBar");

  searchToggle.addEventListener("click", function () {
    toggleSearch();
  });

  function toggleSearch() {
    searchIcon.style.display =
      searchIcon.style.display === "none" ? "inline" : "none";
    closeIcon.style.display =
      closeIcon.style.display === "none" ? "inline" : "none";
    searchBar.style.display =
      closeIcon.style.display === "none" ? "inline" : "none";
  }
});

//Toggle class active utk hamburger menu
const navbarNav = document.querySelector(".navbar-nav");

//ketika humburger menu diklik (ARROW FUNCTION)
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};
