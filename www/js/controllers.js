angular.module('starter.controllers', []).controller('FindCtrl', function($scope, $data, $ionicHistory, $rootScope, $q, $cordovaSQLite, $timeout, $ionicScrollDelegate) {
    //2 Hàm này để Back button chạy ổn định
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    //-------------------------------------
    //Giá trị ban đầu
    $scope.words = [];
    $scope.search = {};
    $scope.search.name = "";
    //-------------------------------------
    if(db == null)
    {
    	$timeout(function(){
			$data.all().then(function(data){	
				$scope.words = data;
			});
    	}, 2000);
    }
    else
    {
		$data.all().then(function(data){	
			$scope.words = data;
		});	
    }

    $scope.loadMore = function() {
        if ($scope.words.length > 0) {
            $data.addDataLimit($scope.search.name, $scope.words.length, true).then(function(data){
            	for (var i=0; i<data.length; i++){
				    $scope.words.push(data[i]);
				}
            });
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.searchChange = function() {
        if ($scope.search.name == "") {
            $ionicScrollDelegate.scrollTop();
        	$data.all().then(function(data){
				$scope.words = data;
    		})
        } else {
            $ionicScrollDelegate.scrollTop();
            $data.addDataLimit($scope.search.name, 0, false).then(function(data){
            	$scope.words.length = 0;
			    $scope.words = data;
            });
        }
    };
}).controller('FavouriteCtrl', function($scope, $ionicHistory, $data, $rootScope) {
    //2 Hàm này để Back button chạy ổn định
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    //--------------------------------------
    //

    //Lấy dữ liệu trang favourite
    $rootScope.favourites = $data.favourite();

}).controller('DetailCtrl', function($scope, $stateParams, $data, $rootScope) {
    $scope.word = $data.get($stateParams.id);
    $scope.changeFavourite = function(id, status) {
        $data.changeFavourite(id, status == '1' ? '0' : '1');
        //Sửa lại status 
        $scope.word = $data.get($stateParams.id);
        //Load lại data sau khi thêm hoặc xóa các từ yêu thích
        $rootScope.favourites = $data.favourite();
    };
}).controller('RemindCtrl', function($scope, $stateParams, $data, $rootScope, $ionicHistory) {
    //2 Hàm này để Back button chạy ổn định
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    //Giá trị ban đầu
    $scope.words = [];
    $scope.words = $data.addDataRemind();
}).controller('SettingCtrl', function($scope, $ionicHistory, $ionicLoading, $sync, $rootScope, $cordovaLocalNotification, $state, $timeout, $window) {
    //2 Hàm này để Back button chạy ổn định
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    //-----------------------------------
    $scope.x = {};
    $scope.settings = {};
    $scope.remindClass = "ng-hide";
    $scope.update = function() {
        $ionicLoading.show({
            templateUrl: "templates/loading1.html"
        }).then(function() {
            $sync.syncType();
        });
    };
    $scope.syncLang = function(newValue, oldValue) {
        $ionicLoading.show({
            templateUrl: "templates/loading.html"
        }).then(function() {
            // if (window.Connection) {
            //     if (navigator.connection.type != Connection.NONE) {
                 	if($rootScope.continueSyncFlag != true)
                 	{
            			$rootScope.langSync = newValue.name;
            			$rootScope.cancelSyncFlag = false;
            		}	
                    $sync.sync(newValue.id);
            //     } else {
            //         alert("Network", "No Internet!!!");
            //         $ionicLoading.hide();
            //     }
            // }
        });
    };
    $scope.selectLang = function(newValue, oldValue) {
        $rootScope.lang = newValue;
    };
    $cordovaLocalNotification.get(1).then(function(res) {
        $timeout(function() {
            $scope.settings.remind = true;
            $scope.remindClass = "ng-show";
        }, 100);
        console.log('----------------------------------------------');
        console.log(JSON.parse( window.localStorage.getItem('remainTime')));
        $scope.x.timeValue = JSON.parse(window.localStorage.getItem('remainTime'));
    });
    $scope.onRemind = function() {
        if ($scope.settings.remind == false) {
            $scope.remindClass = "ng-hide";
            $cordovaLocalNotification.cancel(1);
            $cordovaLocalNotification.clear(1);
            $scope.x.timeValue = "";
        } else {
            $scope.remindClass = "ng-show";
        }
    }
    $scope.onTimeChange = function() {
        var now = new Date($scope.x.timeValue + 10 * 1000);
        window.localStorage.setItem('remainTime', JSON.stringify(now));
        $cordovaLocalNotification.schedule({
            id: 1,
            title: 'Tới giờ học từ rồi :)',
            text: 'Nhấn để vào học',
            firstAt: now,
            every: "minute",
            data: {
                state: 'tab.remaind'
            }
        });
    };

	// $rootScope.$watch('continueSyncFlag', function(){
	// 	if($rootScope.continueSyncFlag === true)
	// 	{
	// 		ionicLoading.hide();
	// 	}
	// })

    $rootScope.$on('$cordovaLocalNotification:click', function(event, notification, state) {
        $state.go(notification.data.state);
    });
}).controller('Loadingctrl', function($scope, $data, $rootScope, $ionicLoading) {

	$scope.cancelSync = function(){
        alert("Khởi động lại chương trình");
        ionic.Platform.exitApp();
	}
})