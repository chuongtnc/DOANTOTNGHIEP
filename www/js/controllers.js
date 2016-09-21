angular.module('starter.controllers', [])

.controller('FindCtrl', function($scope, $data, $ionicHistory, $rootScope, $q, $cordovaSQLite, $timeout, $ionicScrollDelegate) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  //-------------------------------------

  //Giá trị ban đầu
  $rootScope.words = [];
  $scope.search = {};
  $scope.search.name = "";
  //-------------------------------------


  //Load dữ liệu trang find
  if (db == null) {
    $timeout(function() {
      $rootScope.words = $data.all();
    }, 2000);
  } else {
    $rootScope.words = $data.all();
  }



  $scope.loadMore = function() {
    if ($rootScope.words.length > 0) {
      $data.addDataLimit($scope.search.name, true);

    }
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.searchChange = function() {
    if ($scope.search.name == "") {
      $ionicScrollDelegate.scrollTop();
      $rootScope.words = $data.all();
    } else {
      $ionicScrollDelegate.scrollTop();
      $data.addDataLimit($scope.search.name, false);
    }
  };

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
    $data.changeFavourite(id, status == '1' ? '0' : '1');

    //Sửa lại status 
    $scope.word = $data.get($stateParams.id);

    //Load lại data sau khi thêm hoặc xóa các từ yêu thích
    $rootScope.favourites = $data.favourite();

  };
})

.controller('RemindCtrl', function($scope, $stateParams, $data, $rootScope, $ionicHistory) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();

  //Giá trị ban đầu
  $scope.words = [];  
  $scope.words = $data.addDataRemind();

})
.controller('SettingCtrl', function($scope, $ionicHistory, $ionicLoading, $sync, $rootScope, $cordovaLocalNotification, $state, $timeout) {
  //2 Hàm này để Back button chạy ổn định
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  //-----------------------------------
  $scope.x = {};
  $scope.settings = {};
  $scope.remindClass = "ng-hide";
  // $scope.x.timeValue = ;
  // console.log("----------------------vobegin "+ $scope.x.timeValue);

  $scope.syncLang = function(newValue, oldValue) {
    $ionicLoading.show({
      templateUrl: "templates/loading.html"
    }).then(function() {

      // if (window.Connection) {
      //   if (navigator.connection.type != Connection.NONE) {

      $sync.sync(newValue.id);
      //   } else {
      //     alert("Network", "No Internet!!!");
      //     $ionicLoading.hide();
      //   }
      // }
    });
  };

  $scope.selectLang = function(newValue, oldValue) {
    $rootScope.lang = newValue;
  };

  $cordovaLocalNotification.get(1).then(function(res) {

    $timeout(function(){
      $scope.settings.remind = true;
      $scope.remindClass = "ng-show";
    },100);

    console.log("-------------------------" + res.at);
    $scope.x.timeValue = new Date(res.at);
  });


  $scope.onRemind = function() {
    if ($scope.settings.remind == false) {
      $scope.remindClass = "ng-hide";
      console.log("W-----------------------When remind false");
      $cordovaLocalNotification.cancel(1);
      $cordovaLocalNotification.clear(1);
      $scope.x.timeValue = "";
    }
    else
    {
      $scope.remindClass = "ng-show";
    }
  }

  $scope.onTimeChange = function() {
    var now = new Date($scope.x.timeValue + 10 * 1000);
    $cordovaLocalNotification.schedule({
      id: 1,
      title: 'Tới giờ học từ rồi :)',
      text: 'Nhấn để vào học',
      firstAt: now,
      every: "minute",
      data:{state: 'tab.remaind'}
    }).then(function(res) {
      console.log("----------------------------" + res)
    });
    console.log($scope.x.timeValue);
  };

  $rootScope.$on('$cordovaLocalNotification:click',
    function(event, notification, state) {
      $state.go(notification.data.state);
    });
})