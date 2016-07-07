angular.module('starter.services', [])

.factory('Data', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var words = [{
    id: 0,
    name: 'Hello',
    meaning: 'Xin chào',
    example: 'Hello, how are you ?',
    face: 'img/adam.jpg'
  }, {
    id: 1,
    name: 'Goodbye',
    meaning: 'Chào tạm biệt',
    example: 'Goodbye! see you tomorrow',
    face: 'img/ben.png'
  }, {
    id: 2,
    name: 'rice',
    meaning: 'gạo',
    example: 'I have eat broken rice',
    face: 'img/perry.png'
  }, {
    id: 3,
    name: 'meat',
    meaning: 'thịt',
    example: 'I very like meat',
    face: 'img/max.png'
  }, {
    id: 4,
    name: 'food',
    meaning: 'Thức ăn',
    example: 'Chicken is a food :)',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return words;
    },
    remove: function(word) {
      words.splice(words.indexOf(word), 1);
    },
    get: function(id) {
      for (var i = 0; i < words.length; i++) {
        if (words[i].id === parseInt(id)) {
          return words[i];
        }
      }
      return null;
    }
  };
});
