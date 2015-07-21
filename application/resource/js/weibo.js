
angular.module('weibo', [
    'weibo.service',
    'weibo.service.user',
    'weibo.controllers',
    'weibo.route'
])
    .filter('emotion', function() {
        return function(input) {
            var direction = "up";
<<<<<<< HEAD
            var base = 10;
=======
            var base = 60;
>>>>>>> 2a3ff568ce68fe52da3825f9281d3b656e9d000c
            var qty;
            if (input < 0) direction = "down";
            input = Math.abs(input);
<<<<<<< HEAD
            switch (parseInt(input / base)) {
=======
            switch (Math.ceil(input / base)) {
>>>>>>> 2a3ff568ce68fe52da3825f9281d3b656e9d000c
                case 0:
                case 1: qty = "one"; break;
                case 2: qty = "two"; break;
                case 3: qty = "three"; break;
                case 4: qty = "four"; break;
<<<<<<< HEAD
                case 5: qty = "five"; break;
                default: qty = "five"; break;
=======
                default : qty = "five"; break;
>>>>>>> 2a3ff568ce68fe52da3825f9281d3b656e9d000c
            }
            return "emotion " + direction + " " + qty;
        };
    });

