angular.module('olshop', [])
  .controller('Controller', function($scope) {
    $scope.items = [
      { name: "Item 1", tags: ["#new", "#trendy"] },
      { name: "Item 2", tags: ["#old"] },
      { name: "Item 3", tags: ["#new", "#trendy"] },
    ];

    $scope.searchText = "";

    $scope.filterItems = function() {
      return $scope.items.filter(item => {
        return item.tags.some(tag => tag.toLowerCase().includes($scope.searchText.toLowerCase()));
      });
    };
  });
