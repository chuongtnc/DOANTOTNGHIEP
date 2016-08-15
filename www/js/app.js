// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var db = null;
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'firebase', 'ionic-modal-select', 'ion-datetime-picker'])

.run(function($ionicPlatform, $cordovaSQLite, $ionicLoading, $firebaseArray, $rootScope, $cordovaInAppBrowser, $timeout, $cordovaLocalNotification) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }


      // Khởi tạo danh sách giá trị đồng bộ
      $rootScope.selectables = [{
        name: "Anh - Việt",
        id: "EV"
      }, {
        name: "Việt - Anh",
        id: "VE"
      }];


      //Khởi tạo ngôn ngử mặc định
      $rootScope.lang = $rootScope.selectables[0];

      if (window.cordova) {
        if (window.sqlitePlugin !== undefined) {
          window.plugins.sqlDB.copy("dictionary.db", 0, function() {
            db = $cordovaSQLite.openDB({
              name: 'dictionary.db',
              location: 'default'
            });
          }, function(error) {
            console.log(JSON.stringify(error));
            db = $cordovaSQLite.openDB({
              name: 'dictionary.db',
              location: 'default'
            });
          });

        }

      } else {
        db = window.openDatabase("DICTIONARY", "1.0", "DICTIONARY", 200000);
      }
    });

  })
  .directive('onReadFile', function($parse) {
    return {
      restrict: 'A',
      scope: false,
      link: function(scope, element, attrs) {
        var fn = $parse(attrs.onReadFile);

        element.on('change', function(onChangeEvent) {
          var reader = new FileReader();

          reader.onload = function(onLoadEvent) {
            scope.$apply(function() {
              fn(scope, {
                $fileContent: onLoadEvent.target.result
              });
            });
          };

          reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
        });
      }
    };
  })
  .config(function($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.find', {
        url: '/find',
        views: {
          'tab-find': {
            templateUrl: 'templates/tab-find.html',
            controller: 'FindCtrl'
          }
        }
      })
      .state('tab.favourite', {
        url: '/favourite',
        views: {
          'tab-favourite': {
            templateUrl: 'templates/tab-favourite.html',
            controller: 'FavouriteCtrl'
          }
        }
      })
      .state('tab.find-detail', {
        url: '/find/:id',
        views: {
          'tab-find': {
            templateUrl: 'templates/detail.html',
            controller: 'DetailCtrl'
          }
        }
      })
      .state('tab.favourite-detail', {
        url: '/favourite/:id',
        views: {
          'tab-favourite': {
            templateUrl: 'templates/detail.html',
            controller: 'DetailCtrl'
          }
        }
      })
      .state('tab.remind-detail', {
        url: '/remind/:id',
        views: {
          'tab-remind': {
            templateUrl: 'templates/detail.html',
            controller: 'DetailCtrl'
          }
        }
      })      
      .state('tab.setting', {
        url: '/setting',
        views: {
          'tab-setting': {
            templateUrl: 'templates/tab-setting.html',
            controller: 'SettingCtrl'
          }
        }
      })
      .state('tab.remind', {
        url: '/remind',
        views: {
          'tab-remind': {
            templateUrl: 'templates/tab-remind.html',
            controller: 'RemindCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/find');

  });