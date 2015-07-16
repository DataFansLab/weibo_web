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
            },
            getWeiboTopic: {
                method: "GET",
                url: "http://10.109.247.65:8080/WeiboCluster/servlet/TaskTopicTest"
                // type=getEvents&time=day&startTime=2015-07-07
                // type=getRank&time=day&startTime=2015-07-05
                // type=getNRank&time=day&startTime=2015-07-05
            }
        })
    }]);