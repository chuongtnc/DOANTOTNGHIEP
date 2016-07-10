angular.module('starter.services', [])

.factory('$data', function($cordovaSQLite) {
    return {
      all: function() {
        var words = [];
        var query = "SELECT * FROM EV";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
          console.log(res.rows.length);
          if (res.rows.length > 0) {
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
        var query = "SELECT * FROM EV WHERE STATUS = 1 ORDER BY ID DESC ";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
          if (res.rows.length > 0) {
            for (var i = 0; i < res.rows.length; i++) {
              favourite.push(res.rows.item(i));
            }
          }
        }, function(err) {
          console.error(err);
        });
        console.log(favourite);
        return favourite;
      },
      changeFavourite: function(id, status) {
        var query = "UPDATE EV SET STATUS = ? WHERE ID= ?";
        $cordovaSQLite.execute(db, query, [status, id]);
      },
      get: function(id) {
        var word = [];
        var query = "SELECT * FROM EV WHERE ID = ?";
        $cordovaSQLite.execute(db, query, [id]).then(function(res) {
          if (res.rows.length > 0) word.push(res.rows.item(0));
        }, function(err) {
          console.error(err);
        });
        return word;
      }
    };
  })
  .factory('$sync', function($cordovaSQLite, $firebaseArray, $ionicLoading) {
    return {
      sync: function(type) {
        $ionicLoading.show({
          templateUrl: "templates/loading.html"
        }).then(function() {
          $cordovaSQLite.execute(db, "DROP TABLE "+ type);
          $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS " + type + " (ID INTEGER PRIMARY KEY AUTOINCREMENT, NO TEXT, NAME TEXT, STATUS INT, MEANING TEXT,TYPE TEXT, TRANSLITERATION TEXT, PRONOUNCE TEXT, IMAGE TEXT, EXAMPLE TEXT)");
          $rootRef = new Firebase("https://glaring-fire-4921.firebaseio.com/" + type);
          $rootRef.on("value", function(snapshot) {
            var words = snapshot.val();
            
            for(var i = 0; i< words.length; i++)
            {
              if(typeof(words[i]) != "undefined")
              {
              console.log(words[i].NO);
              var query = "INSERT INTO "+ type +" (NO, NAME, STATUS, MEANING, TYPE, TRANSLITERATION, PRONOUNCE, IMAGE, EXAMPLE) VALUES ( ?, ?, ? ,? ,? ,? ,? ,? ,?);";
              $cordovaSQLite.execute(db, query, [words[i].NO, words[i].NAME, 0, words[i].MEANING, words[i].TYPE, words[i].TRANSLITERATION, words[i].PRONOUNCE, words[i].IMAGE, words[i].EXAMPLE ]).then(function(res) {}, function(err) {console.error(err);});
              }
            }
            $ionicLoading.hide();
          });
        });
      }
    };
  })