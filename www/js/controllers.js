angular.module('starter.controllers', [])

.controller('FindCtrl', function($scope, Data, $ionicHistory) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  //-------------------------------------

  //Lấy dữ liệu đầu tiên
  $scope.words = Data.all();

})

.controller('FavouriteCtrl', function($scope, $ionicHistory, Data) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  //--------------------------------------

  $scope.words = Data.favourite();

})

.controller('DetailCtrl', function($scope, $stateParams, Data) {
  $scope.word = Data.get($stateParams.id);  

  $scope.changeFavourite = function(id, status)
  {
    Data.changeFavourite(id, status === 1 ? 0:1);
  };
})

.controller('SettingCtrl', function($scope, $ionicHistory) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  //-----------------------------------
})