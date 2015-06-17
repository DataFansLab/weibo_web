angular.module('weibo.route',['ngRoute']).config([
    '$routeProvider',
    '$locationProvider',
    function ($routeProvider, $locationProvider) {

        $routeProvider
        .when('/picInfo', {
            templateUrl: 'application/resource/js/templates/picInfo.html',
            controller: 'picInfoCtrl'
        })
        .when('/stockSentiment', {
            templateUrl: 'application/resource/js/templates/stockSentiment.html',
            controller: 'stockSentimentCtrl'
        })
        .when('/financialSentiment', {
            templateUrl: 'application/resource/js/templates/financialSentiment.html',
            controller: 'financialSentimentCtrl'
        })
        .when('/weiboAnalysis', {
            templateUrl: 'application/resource/js/templates/weiboAnalysis.html',
            controller: 'weiboAnalysisCtrl'
        })
        .otherwise({
            redirectTo: '/picInfo'
        })
    }])
    .controller('navigationCtrl', function($scope, $location) {
        $scope.isActive = function(route) {
            if(route.indexOf($location.path()) != -1){
                return true;
            }
            return false;
        }
    });