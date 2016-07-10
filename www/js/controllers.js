angular.module('starter.controllers', [])

.controller('FindCtrl', function($scope, $data, $ionicHistory, $rootScope) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  //-------------------------------------

  //Lấy dữ liệu trang find
  $rootScope.words = $data.all();

})

.controller('FavouriteCtrl', function($scope, $ionicHistory, $data, $rootScope) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  //--------------------------------------

  //Lấy dữ liệu trang favourite
  $rootScope.favourites = $data.favourite();
})

.controller('DetailCtrl', function($scope, $stateParams, $data, $rootScope) {
  $scope.word = $data.get($stateParams.id);

  $scope.changeFavourite = function(id, status) {
    $data.changeFavourite(id, status === 1 ? 0 : 1);

    //Sửa lại status 
    $scope.word[0].STATUS = status === 1 ? 0 : 1;

    //Load lại data sau khi thêm hoặc xóa các từ yêu thích
    $rootScope.words = $data.all();
    $rootScope.favourites = $data.favourite();
  };
})

.controller('SettingCtrl', function($scope, $ionicHistory, $ionicLoading, $sync) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  //-----------------------------------

  // Khởi tạo giá trị đồng bộ
  $scope.selectables = [{
    name: "Anh - Việt",
    id: "EV"
  }, {
    name: "Việt - Anh",
    id: "VE"
  }];

  $scope.shoutLoud = function(newValue, oldValue) {
    $sync.sync(newValue.id);
  };
})