angular.module('olshop', [])
  .controller('Controller', function ($scope) {
    $scope.items = [
      { name: "Item 1", tags: ["#new", "#babi", "Item 1"], image: "celana1.jpg" },
      { name: "Item 2", tags: ["#old"], image: "celana1.jpg" },
      { name: "Item 3", tags: ["#new", "#trendy"], image: "celana1.jpg" },
      { name: "Item 4", tags: ["#old"], image: "celana1.jpg" },
      { name: "Item 5", tags: ["#new", "#trendy"], image: "celana1.jpg" },
      { name: "Item 3", tags: ["#new", "#trendy"], image: "celana1.jpg" },
      { name: "Item 4", tags: ["#old"], image: "celana1.jpg" },
      { name: "Item 5", tags: ["#new", "#trendy"], image: "celana1.jpg" },
      { name: "Item 3", tags: ["#new", "#trendy"], image: "celana1.jpg" },
      { name: "Item 4", tags: ["#old"], image: "celana1.jpg" },
      { name: "Item 5", tags: ["#new", "#trendy"], image: "celana1.jpg" },
      { name: "Item 3", tags: ["#new", "#trendy"], image: "celana1.jpg" },
      { name: "Item 4", tags: ["#old"], image: "celana1.jpg" },
      { name: "Item 5", tags: ["#new", "#trendy"], image: "celana1.jpg" },

    ];

    $scope.searchText = "";
    $scope.showSearch = false;

    $scope.toggleSearch = function () {
      $scope.showSearch = !$scope.showSearch;
    };

    $scope.filterItems = function () {
      return $scope.items.filter(item => {
        return item.tags.some(tag => tag.toLowerCase().includes($scope.searchText.toLowerCase()));
      });
    };
  });