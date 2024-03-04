angular.module('olshop', []).controller('Controller', function ($scope) {
  $scope.items = [
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
      name: 'Kemeja Putih Lengan Pendek',
      tags: ['#Kemeja Putih Lengan Pendek'],
      price: 125000,
      rating: 5,
      image: 'baju_kemeja_putih_1.jpg',
      page: 'nextPage/item3.html',
    },
    {
      name: 'Kemeja Flanel Motif Kotak',
      tags: ['#Kemeja Flanel Motif Kotak'],
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
      name: 'Kaus Kaki Hitam Pendek',
      tags: ['Kaus Kaki Hitam Pendek'],
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
      name: 'Mantel Berkerah',
      tags: ['Mantel Berkerah'],
      price: 400000,
      rating: 5,
      image: 'mantel_berkerah.jpg',
      page: 'nextPage/item11.html',
    },
    {
      name: 'Tas Bahu',
      tags: ['Tas Bahu'],
      price: 140000,
      rating: 4,
      image: 'tas_bahu.jpg',
      page: 'nextPage/item12.html',
    },
    {
      name: 'Kemeja Pastel',
      tags: ['Kemeja Pastel'],
      price: 145000,
      rating: 4,
      image: 'kemeja_pastel.jpg',
      page: 'nextPage/item13.html',
    },
    {
      name: 'Rok Panjang',
      tags: ['Rok Panjang'],
      price: 200000,
      rating: 5,
      image: 'rok_panjang.jpg',
      page: 'nextPage/item14.html',
    },
    {
      name: 'Kardigan',
      tags: ['Kardigan'],
      price: 250000,
      rating: 5,
      image: 'kardigan.jpg',
      page: 'nextPage/item15.html',
    },
    {
      name: 'Tester Item',
      tags: ['Tester Item'],
      price: 99999999999,
      rating: 5,
      image: 'rickroll.jpg',
      page: '',
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
