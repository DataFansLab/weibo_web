angular.module('weibo.service.user',['ngResource'])
    .factory('User',["$resource", function ($resource) {
        return $resource('', {}, {
            getStockJobs: {
                method: "GET",
                url: "http://10.109.247.65:8080/WeiboCluster/servlet/TaskServletTest"
            },
            getStock: {
                method: "GET",
                url: "http://10.109.247.65:8080/WeiboCluster/servlet/TaskServletTest"
            },
            addStock: {
                method: "GET",
                url: "http://10.109.247.65:8080/WeiboCluster/servlet/TaskServletTest"
            }
        })
    }]);