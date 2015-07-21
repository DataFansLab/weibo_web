
angular.module('weibo', [
    'weibo.service',
    'weibo.service.user',
    'weibo.controllers',
    'weibo.route'
])
    .filter('emotion', function() {
        return function(input) {
            var direction = "up";
            var base = 60;
            var qty;
            if (input < 0) direction = "down";
            input = Math.abs(input);
            switch (Math.ceil(input / base)) {
                case 0:
                case 1: qty = "one"; break;
                case 2: qty = "two"; break;
                case 3: qty = "three"; break;
                case 4: qty = "four"; break;
                default : qty = "five"; break;
            }
            return "emotion " + direction + " " + qty;
        };
    });

