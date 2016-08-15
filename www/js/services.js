angular.module('starter.services', [])

.factory('$data', function($cordovaSQLite, $q, $timeout, $rootScope) {
    return {
      all: function() {
        var words = [];
        var query = "SELECT * FROM " + $rootScope.lang.id + " LIMIT 20";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
          if (res.rows.length > 0) {

            for (var i = 0; i < res.rows.length; i++) {
              words.push(res.rows.item(i));
            }

          }
        }, function(err) {
          console.log(err);
        });
        return words;
      },
      addDataLimit: function(searchText, flag) {
        var position = $rootScope.words.length;
        if (!flag) {

          $rootScope.words = [];
          position = 0;
        }
        var query = "SELECT * FROM " + $rootScope.lang.id + " WHERE NAME LIKE '" + searchText + "%' LIMIT 20 OFFSET " + position;
        $cordovaSQLite.execute(db, query, []).then(function(res) {
          if (res.rows.length > 0) {
            console.log(res.rows.length);
            for (var i = 0; i < res.rows.length; i++) {
              $rootScope.words.push(res.rows.item(i));
            }
          }
        }, function(err) {
          console.error(err);
        });
      },
      addDataRemind: function() {
        var words = [];
        var query = "SELECT * FROM " + $rootScope.lang.id + " ORDER BY RANDOM() LIMIT 10";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
          if (res.rows.length > 0) {
            console.log(res.rows.length);
            for (var i = 0; i < res.rows.length; i++) {
              words.push(res.rows.item(i));
            }
          }
        }, function(err) {
          console.error(err);
        });
        return words;
      },      
      favourite: function() {
        var favourite = [];
        var query = "SELECT * FROM " + $rootScope.lang.id + " WHERE STATUS = 1 ORDER BY ID DESC ";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
          if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
              favourite.push(res.rows.item(i));
            }
          }
        }, function(err) {
          console.error(err);
        });
        return favourite;
      },
      changeFavourite: function(id, status) {
        var query = "UPDATE " + $rootScope.lang.id + " SET STATUS = ? WHERE ID= ?";
        $cordovaSQLite.execute(db, query, [status, id]);
      },
      get: function(id) {
        var word = [];
        var query = "SELECT * FROM " + $rootScope.lang.id + " WHERE ID = ?";
        $cordovaSQLite.execute(db, query, [id]).then(function(res) {
          if (res.rows.length > 0) {
            word.push(res.rows.item(0));
          }

        }, function(err) {
          console.error(err);
        });

        return word;
      }
    };
  })
  .factory('$sync', function($cordovaSQLite, $firebaseArray, $ionicLoading, $q, $rootScope, $timeout) {
    return {
      sync: function(type) {
        var defer = $q.defer();
        var count = 0;
        var firebaseId = 0;
        //$cordovaSQLite.execute(db, "DROP TABLE " + type);
        console.log("-----------------------------------------Da Vo Ham" );
        var rootRef = new Firebase("https://glaring-fire-4921.firebaseio.com/" + type);
        rootRef.on("value", function(snapshot) {
          var words = snapshot.val();
          console.log("-----------------------------------------" + words.length);
          if (words == null) {
            $ionicLoading.hide();
          }
          $rootScope.totalWordSync = words.length;
          $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS " + type + " (ID INTEGER PRIMARY KEY AUTOINCREMENT, NO TEXT, NAME TEXT, STATUS INT, MEANING TEXT,TYPE TEXT, TRANSLITERATION TEXT, PRONOUNCE TEXT, IMAGE TEXT, EXAMPLE TEXT, FIREBASE_ID INT)");
          var query = "SELECT * FROM " + type + " ORDER BY ID DESC LIMIT 1";
          $cordovaSQLite.execute(db, query, []).then(function(res) {

            if (res.rows.length != 0) {
              firebaseId = res.rows.item(0).FIREBASE_ID + 1;
              count = firebaseId;
              defer.resolve();
            } else {
              defer.resolve();
            }
          }, function(err) {
            alert(err);
          });
          defer.promise.then(function(res) {
            for (var i = firebaseId; i < words.length; i++) {

              if (typeof(words[i]) != "undefined") {
                var query = "INSERT INTO " + type + " (NO, NAME, STATUS, MEANING, TYPE, TRANSLITERATION, PRONOUNCE, IMAGE, EXAMPLE, FIREBASE_ID) VALUES ( ?, ?, ? ,? ,? ,? ,? ,? ,?, ? );";
                $cordovaSQLite.execute(db, query, [words[i].NO, words[i].NAME, 0, words[i].MEANING, words[i].TYPE, words[i].TRANSLITERATION, words[i].PRONOUNCE, words[i].IMAGE, words[i].EXAMPLE, i]).then(function(res) {
                  if (count === words.length - 1) {
                    alert('Sync', 'Thành công');
                    $ionicLoading.hide();
                  }
                  console.log(count);
                  $rootScope.countWordSync = count;
                  count++;
                }, function(err) {
                  console.log(err);
                });
              } else {
                count++;
              }
            }
          })
        });
      }
    };
  })