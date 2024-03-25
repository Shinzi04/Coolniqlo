angular.module("olshop", []).controller("Controller", function ($scope) {
  $scope.items = [
    {
      name: "Celana Panjang Hitam",
      tags: ["#Celana Panjang Hitam"],
      price: 150000,
      rating: 4,
      image: "celana1.jpg",
      page: "/detail/celana-panjang-hitam",
    },
    {
      name: "Sepatu Pantofel",
      tags: ["#Sepatu Pantofel"],
      price: 250000,
      rating: 5,
      image: "sepatupantofel.jpg",
      page: "/detail/sepatu-pantofel",
    },
    {
      name: "Kemeja Putih Lengan Pendek",
      tags: ["#Kemeja Putih Lengan Pendek"],
      price: 125000,
      rating: 5,
      image: "baju_kemeja_putih_1.jpg",
      page: "/detail/item3",
    },
    {
      name: "Kemeja Flanel Motif Kotak",
      tags: ["#Kemeja Flanel Motif Kotak"],
      price: 150000,
      rating: 3,
      image: "kemeja_kotak_hijau.jpg",
      page: "/detail/item4",
    },
    {
      name: "Kaus Putih Polos",
      tags: ["#Kaus Putih Polos"],
      price: 88000,
      rating: 3,
      image: "kaosputih.jpg",
      page: "/detail/item5",
    },
    {
      name: "Celana Pendek Hitam",
      tags: ["Celana Pendek Hitam"],
      price: 45000,
      rating: 3,
      image: "celanapendekhitam.jpg",
      page: "/detail/item6",
    },
    {
      name: "Celana Jeans Denim",
      tags: ["Celana Jeans Denim"],
      price: 200000,
      rating: 5,
      image: "celanajeansdenim.jpg",
      page: "/detail/item7",
    },
    {
      name: "Dasi Hitam Polos",
      tags: ["Dasi Hitam Polos"],
      price: 30000,
      rating: 4,
      image: "dasihitam.jpg",
      page: "/detail/item8",
    },
    {
      name: "Kaus Kaki Hitam Pendek",
      tags: ["Kaus Kaki Hitam Pendek"],
      price: 18000,
      rating: 5,
      image: "kauskaki.jpg",
      page: "/detail/item9",
    },
    {
      name: "Kacamata Hitam",
      tags: ["Kacamata Hitam"],
      price: 64000,
      rating: 5,
      image: "kacamatahitam.jpeg",
      page: "/detail/item10",
    },
    {
      name: "Mantel Berkerah",
      tags: ["Mantel Berkerah"],
      price: 400000,
      rating: 5,
      image: "mantel_berkerah.jpg",
      page: "/detail/item11",
    },
    {
      name: "Tas Bahu",
      tags: ["Tas Bahu"],
      price: 140000,
      rating: 4,
      image: "tas_bahu.jpg",
      page: "/detail/item12",
    },
    {
      name: "Kemeja Pastel",
      tags: ["Kemeja Pastel"],
      price: 145000,
      rating: 4,
      image: "kemeja_pastel.jpg",
      page: "/detail/item13",
    },
    {
      name: "Rok Panjang",
      tags: ["Rok Panjang"],
      price: 200000,
      rating: 5,
      image: "rok_panjang.jpg",
      page: "/detail/item14",
    },
    {
      name: "Kardigan",
      tags: ["Kardigan"],
      price: 250000,
      rating: 5,
      image: "kardigan.jpg",
      page: "/detail/item15",
    },
    {
      name: "Tester Item",
      tags: ["Tester Item"],
      price: 99999999999,
      rating: 5,
      image: "rickroll.jpg",
      page: "",
    },
  ];

  $scope.searchText = "";
  $scope.showSearch = false;

  $scope.toggleSearch = function () {
    $scope.showSearch = !$scope.showSearch;
  };

  $scope.clearSearch = function () {
    $scope.searchText = "";
  };

  $scope.filterItems = function () {
    const filteredItems = $scope.items.filter((item) => {
      return item.tags.some((tag) =>
        tag.toLowerCase().includes($scope.searchText.toLowerCase())
      );
    });

    const topItems = filteredItems.slice(0, 15);
    return topItems;
  };
});

//Toggle class active utk hamburger menu
const navbarNav = document.querySelector(".navbar-nav");

//ketika humburger menu diklik (ARROW FUNCTION)
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};
