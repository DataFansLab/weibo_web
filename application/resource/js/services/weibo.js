angular.module('weibo.service',['ngResource'])
    .factory('Weibo',["$resource", function ($resource) {
        return $resource('', {}, {
            getStock: {
                method: "GET",
                url: "http://10.108.121.103:8888/getStock"
            },
            getRelatedWeibo: {
                method: "GET",
                url: "http://10.108.121.103:8888/getRelatedWeibo"
            }
        })
    }]);