angular.module('starter.controllers', [])

.controller('FindCtrl', function($scope, Data, $ionicHistory) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  //-------------------------------------


  $scope.words = Data.all();
  $scope.remove = function(word) {
    Data.remove(word);
  };

})

.controller('FavouriteCtrl', function($scope, $ionicHistory) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  //--------------------------------------
})

.controller('DetailCtrl', function($scope, $stateParams, Data, $ionicHistory) {
  // $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
  //   viewData.enableBack = true;
  // });
  // $ionicHistory.nextViewOptions({
  //   disableBack: true
  // });
  console.log($ionicHistory.backTitle());
  $scope.word = Data.get($stateParams.id);

})

.controller('SettingCtrl', function($scope, $ionicHistory) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  //-----------------------------------

  $scope.settings = {
    enableFriends: true
  };
})