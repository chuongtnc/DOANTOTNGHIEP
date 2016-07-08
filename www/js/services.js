angular.module('starter.services', ['ngCordova', 'firebase'])

.factory('Data', function($cordovaSQLite, $firebaseArray, $firebaseObject) {
  var rootRef = new Firebase("https://glaring-fire-4921.firebaseio.com/EV");

  return {
    all: function() {
      var words = $firebaseArray(rootRef);
      return words;
    },
    favourite: function() {
      var favourite = $firebaseArray(rootRef.orderByChild("STATUS").equalTo(1));
      return favourite;
    },
    changeFavourite: function(id,status) {
      rootRef.child(id).update({'STATUS' : status});
    },
    get: function(id) {
      var word = $firebaseObject(rootRef.child(id));
      return word;
    }
  };
});