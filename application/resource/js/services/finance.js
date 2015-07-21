angular.module('weibo.service.finance',['ngResource'])
    .factory('Finance',["$resource", function ($resource) {
        return $resource('', {}, {
            getFinanceAnalysis: {
                method: "GET",
                url: "http://10.109.247.65:8080/WeiboCluster/servlet/TaskECOServletBeta"
            }
        })
    }]);