angular.module('starter.services', []).factory('$data', function($cordovaSQLite, $q, $timeout, $rootScope) {
    return {
        all: function() {
            var defer = $q.defer();
            var words = [];
            var query = "SELECT * FROM " + $rootScope.lang.id + " LIMIT 20";
            $cordovaSQLite.execute(db, query, []).then(function(res) {
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        words.push(res.rows.item(i));
                    }
                    defer.resolve(words);
                }
            }, function(err) {
                console.log(err);
            });
            return defer.promise;
        },
        addDataLimit: function(searchText, position, flag) {
            var defer = $q.defer();
            var words = [];
            var query = "SELECT * FROM " + $rootScope.lang.id + " WHERE NAME LIKE '" + searchText + "%' LIMIT 20 OFFSET " + position;
            $cordovaSQLite.execute(db, query, []).then(function(res) {
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        words.push(res.rows.item(i));
                    }
                    defer.resolve(words);
                }
            }, function(err) {
                console.error(err);
            });
            return defer.promise;
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
        },
        type: function() {
            var defer = $q.defer();
            var types = [];
            var query = "SELECT NAME as name, NO as id FROM TYPE";
            $cordovaSQLite.execute(db, query, []).then(function(res) {
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        types.push(res.rows.item(i));
                    }
                    defer.resolve(types);
                }
            }, function(err) {
                console.log(err);
            });
            return defer.promise;
        },
        connectDB: function() {
            var defer = $q.defer();
            if (db == null) {
                if (window.cordova) {
                    if (window.sqlitePlugin !== undefined) {
                        window.plugins.sqlDB.copy("dictionary.db", 0, function() {
                            db = $cordovaSQLite.openDB({
                                name: 'dictionary.db',
                                location: 'default'
                            });
                            defer.resolve(db);
                        }, function(error) {
                            db = $cordovaSQLite.openDB({
                                name: 'dictionary.db',
                                location: 'default'
                            });
                            defer.resolve(db);
                        });
                    }
                }
            } else {
                defer.resolve(db);
            }
            return defer.promise;
        }
    };
}).factory('$sync', function($cordovaSQLite, $firebaseArray, $ionicLoading, $q, $rootScope, $timeout) {
    return {
        sync: function(type) {
            var defer = $q.defer();
            var rootRef = new Firebase("https://glaring-fire-4921.firebaseio.com/TYPE");
            rootRef.orderByChild("NO").equalTo(type).on("child_added", function(snapshot) {
                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS " + type + " (ID INTEGER PRIMARY KEY AUTOINCREMENT, NO TEXT, NAME TEXT, STATUS INT, MEANING TEXT,TYPE TEXT, TRANSLITERATION TEXT, PRONOUNCE TEXT, IMAGE TEXT, EXAMPLE TEXT, FIREBASE_ID INT)");
                var query = "SELECT * FROM " + type + " WHERE FIREBASE_ID IS NOT NULL ORDER BY FIREBASE_ID DESC LIMIT 1";
                $cordovaSQLite.execute(db, query, []).then(function(res) {
                    if (res.rows.length != 0) {
                        $rootScope.countWordSync = res.rows.item(0).FIREBASE_ID;
                        $rootScope.totalWordSync = snapshot.val().TOTAL;              
                        defer.resolve({
                            currentWord: $rootScope.countWordSync,
                            totalWord: $rootScope.totalWordSync
                        });
                    } else {
                        $rootScope.countWordSync = 0;
                        $rootScope.totalWordSync = snapshot.val().TOTAL;
                        defer.resolve({
                            currentWord: 0,
                            totalWord: $rootScope.totalWordSync
                        });
                    }
                });
            });
            defer.promise.then(function(res) {
                var totalWord = res.totalWord;
                if (res.currentWord == totalWord - 1) {
                    $ionicLoading.hide();
                    return;
                }
                for (var i = res.currentWord + 1; i < totalWord; i++) {
                    var ref = new Firebase("https://glaring-fire-4921.firebaseio.com/" + type + "/" + i);
                    ref.on("value", function(snapshot) {
                        var value = snapshot.val();
                        if (typeof(value) != "undefined" || value == null) {
                            var query = "INSERT INTO " + type + " (NO, NAME, STATUS, MEANING, TYPE, TRANSLITERATION, PRONOUNCE, IMAGE, EXAMPLE, FIREBASE_ID) VALUES ( ?, ?, ? ,? ,? ,? ,? ,? ,?, ? );";
                            $cordovaSQLite.execute(db, query, [value.NO, value.NAME, 0, value.MEANING, value.TYPE, value.TRANSLITERATION, value.PRONOUNCE, value.IMAGE, value.EXAMPLE, snapshot.key()]).then(function(res) {
                                $rootScope.countWordSync = snapshot.key();
                                if ($rootScope.countWordSync == (totalWord - 1)) {
                                    alert("Cập nhập hoàn tất !!!");
                                    $ionicLoading.hide();
                                }
                            });
                        } else {
                            $rootScope.countWordSync = snapshot.key();
                        }
                    });
                }
            })
        },
        syncType: function(type) {
            var defer = $q.defer();
            var count = 0;
            var firebaseId = 0;
            var rootRef = new Firebase("https://glaring-fire-4921.firebaseio.com/TYPE");
            rootRef.on("value", function(snapshot) {
                var words = snapshot.val();
                if (words == null) {
                    $ionicLoading.hide();
                }
                $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS TYPE (ID INTEGER PRIMARY KEY AUTOINCREMENT, NO TEXT, NAME TEXT, FIREBASE_ID INT)");
                var query = "SELECT * FROM TYPE ORDER BY ID DESC LIMIT 1";
                $cordovaSQLite.execute(db, query, []).then(function(res) {
                    if (res.rows.length != 0) {
                        firebaseId = res.rows.item(0).FIREBASE_ID + 1;
                        count = firebaseId;
                        console.log(count);
                        defer.resolve();
                    } else {
                        defer.resolve();
                    }
                }, function(err) {
                    alert(err);
                });
                defer.promise.then(function(res) {
                    if (words.length == count) {
                        $ionicLoading.hide();
                        return;
                    }
                    for (var i = firebaseId; i < words.length; i++) {
                        console.log(words[i]);
                        if (typeof(words[i]) != "undefined") {
                            var query = "INSERT INTO TYPE (NO, NAME, FIREBASE_ID, TOTAL) VALUES ( ?, ?, ?, ?);";
                            $cordovaSQLite.execute(db, query, [words[i].NO, words[i].NAME, i, words[i].TOTAL]).then(function(res) {
                                if (count == words.length - 1) {
                                    alert("Cập nhập thành công !!!");
                                    ionic.Platform.exitApp();
                                }
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