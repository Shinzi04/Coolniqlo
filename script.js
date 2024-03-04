//Toggle class active utk hamburger menu
const navbarNav = document.querySelector('.navbar-nav');

//ketika humburger menu diklik (ARROW FUNCTION)
document.querySelector('#hamburger-menu').onclick = () => {
  navbarNav.classList.toggle('active');
};

angular.module('olshop', []).controller('Controller', function ($scope) {
  $scope.items = [
    {
      name: 'Celana Panjang Hitam',
      tags: ['Celana Panjang Hitam'],
      price: 150000,
      rating: 4,
      image: 'celana1.jpg',
      link: 'coba.html',
    },
    {
      name: 'Sepatu Pantofel',
      tags: ['#sepatu pantofel, #hitam'],
      price: 250000,
      rating: 3,
      image: 'sepatu_pantofel_1.jpg',
      link: ' ',
    },
    {
      name: 'Baju Kemeja Putih',
      tags: ['#baju', '#kemeja putih', ''],
      price: 125000,
      rating: 5,
      image: 'baju_kemeja_putih_1.jpg',
      link: ' ',
    },
    {
      name: 'Item 4',
      tags: ['#old'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 5',
      tags: ['#new', '#trendy'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 3',
      tags: ['#new', '#trendy'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 4',
      tags: ['#old'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 5',
      tags: ['#new', '#trendy'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 3',
      tags: ['#new', '#trendy'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 4',
      tags: ['#old'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 5',
      tags: ['#new', '#trendy'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 3',
      tags: ['#new', '#trendy'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 4',
      tags: ['#old'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 5',
      tags: ['#new', '#trendy'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 3',
      tags: ['#new', '#trendy'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'Item 4',
      tags: ['#old'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
    {
      name: 'TesterItem',
      tags: ['#new', '#testeritem'],
      price: 150000,
      rating: 3,
      image: 'celana1.jpg',
    },
  ];

  $scope.searchText = '';
  $scope.showSearch = false;

  $scope.toggleSearch = function () {
    $scope.showSearch = !$scope.showSearch;
  };

  $scope.clearSearch = function () {
    $scope.searchText = '';
  };

  $scope.filterItems = function () {
    const filteredItems = $scope.items.filter((item) => {
      return item.tags.some((tag) => tag.toLowerCase().includes($scope.searchText.toLowerCase()));
    });

    const topItems = filteredItems.slice(0, 15);
    return topItems;
  };
});
