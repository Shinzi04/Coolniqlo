angular.module('olshop', []).controller('Controller', function ($scope) {
  ($scope.items = [
    {
      name: 'Celana Panjang Hitam',
      tags: ['#Celana Panjang Hitam'],
      price: 150000,
      rating: 4,
      image: 'celana1.jpg',
      page: 'nextPage/item1.html',
    },
    {
      name: 'Sepatu Pantofel',
      tags: ['#Sepatu Pantofel'],
      price: 250000,
      rating: 3,
      image: 'sepatupantofel.jpg',
      page: 'nextPage/item2.html',
    },
    {
      name: 'Baju Kemeja Putih',
      tags: ['#Baju Kemeja Putih'],
      price: 125000,
      rating: 5,
      image: 'baju_kemeja_putih_1.jpg',
      page: 'nextPage/item3.html',
    },
    {
      name: 'Kemeja Kotak Hijau',
      tags: ['#Kemeja Kotak Hijau'],
      price: 150000,
      rating: 3,
      image: 'kemeja_kotak_hijau.jpg',
      page: 'nextPage/item4.html',
    },
    {
      name: 'Kaus Putih Polos',
      tags: ['#Kaus Putih Polos'],
      price: 88000,
      rating: 3,
      image: 'kaosputih.jpg',
      page: 'nextPage/item5.html',
    },
    {
      name: 'Celana Pendek Hitam',
      tags: ['Celana Pendek Hitam'],
      price: 45000,
      rating: 3,
      image: 'celanapendekhitam.jpg',
      page: 'nextPage/item6.html',
    },
    {
      name: 'Celana Jeans Denim',
      tags: ['Celana Jeans Denim'],
      price: 200000,
      rating: 5,
      image: 'celanajeansdenim.jpg',
      page: 'nextPage/item7.html',
    },
    {
      name: 'Dasi Hitam Polos',
      tags: ['Dasi Hitam Polos'],
      price: 30000,
      rating: 4,
      image: 'dasihitam.jpg',
      page: 'nextPage/item8.html',
    },
    {
      name: 'Kaus Kaki Hitam',
      tags: ['Kaus Kaki Hitam'],
      price: 18000,
      rating: 5,
      image: 'kauskaki.jpg',
      page: 'nextPage/item9.html',
    },
    {
      name: 'Kacamata Hitam',
      tags: ['Kacamata Hitam'],
      price: 64000,
      rating: 5,
      image: 'kacamatahitam.jpeg',
      page: 'nextPage/item10.html',
    },
    {
      name: 'Tester Item',
      tags: ['Tester Item'],
      price: 99999999999,
      rating: 5,
      image: 'rickroll.jpg',
      page: '',
    },
  ]),
    ($scope.searchText = '');
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

    const topItems = filteredItems.slice(0, 10);
    return topItems;
  };
});

//Toggle class active utk hamburger menu
const navbarNav = document.querySelector('.navbar-nav');

//ketika humburger menu diklik (ARROW FUNCTION)
document.querySelector('#hamburger-menu').onclick = () => {
  navbarNav.classList.toggle('active');
};
