angular.module('weibo.service',['ngResource'])
    .factory('Weibo',["$resource", function ($resource) {
        return $resource('', {}, {
            //获取股票分析结果
            getStockInfo: {
                method: "GET",
                url: "http://10.109.247.65:8080/WeiboCluster/servlet/TaskServletTest"
            },
            getRelatedWeibo: {
                method: "GET",
                url: "http://10.108.121.103:8888/getRelatedWeibo"
            }
        })
    }]);