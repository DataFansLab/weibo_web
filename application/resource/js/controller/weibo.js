
angular.module("weibo.controllers", [])
    .controller('picInfoCtrl', ["$scope", function($scope){
        console.log("picInfoCtrl");
    }])
    .controller('stockSentimentCtrl', ["$scope", "Weibo", function ($scope, Weibo) {
        //test interface
        Weibo.getStock({}, function(_res) {
            $scope.stockList = _res.stock_list;
        });

        var PERIOD_TYPE = {
            singleWeek: 0,
            doubleWeek: 1,
            singleMonth: 2,
            all: 3
        };
        $scope.period = 0;
        
        $scope.SNSKeyword = [{keyword: "央企改革"}, {keyword: "互联网金融"}, {keyword: "互联网金融"}, {keyword: "银行"}, {keyword: "税改"}, {keyword: "一带一路"}, {keyword: "以房养老"}];
        $scope.SNSKeyword.forEach(function(item, index){
            var colors = ["sliver", "red", "green"],
                font = ["font14", "font16", "font24"];
            var i = index % 3;
            item.classes = colors[i] + " " + font[i];
        });

        //初始化表格
        require.config({
            paths: {echarts: "application/resource/plugins/source"}
        });
        require([
            'echarts',
            'echarts/chart/line'
        ], function(echarts) {
            var ecConfig = require("echarts/config");
            var sentimentChart = echarts.init(document.getElementById("sentiment-chart"));
            var weiboCountChart = echarts.init(document.getElementById("weibo-count-chart"));
            var hotRankingChart = echarts.init(document.getElementById("hot-ranking-chart"));

            stockSentimentChartConfig.weiboCountOption.series[0].itemStyle.normal.areaStyle.color = (function (){
                var zrColor = require('zrender/tool/color');
                return zrColor.getLinearGradient(
                    0, 200, 0, 400,
                    [[0, 'rgba(249,176,60,0.1)'],[0.8, 'rgba(255,255,255,0)']]
                )
            })();

            sentimentChart.setOption(stockSentimentChartConfig.sentimentOption);
            weiboCountChart.setOption(stockSentimentChartConfig.weiboCountOption);
            hotRankingChart.setOption(stockSentimentChartConfig.hotRankingOption);
            weiboCountChart.connect([sentimentChart]);
            sentimentChart.connect([weiboCountChart]);

            var lastData = 11;
            var axisData;
            timeTicket = setInterval(function (){
                lastData += Math.random() * ((Math.round(Math.random() * 10) % 2) == 0 ? 1 : -1);
                lastData = lastData.toFixed(1) - 0;
                axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
                // 动态数据接口 addData
                hotRankingChart.addData([
                    [
                        0,        // 系列索引
                        Math.round(Math.random() * 10), // 新增数据
                        false,     // 新增数据是否从队列头部插入
                        false,     // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
                        axisData
                    ],
                    [
                        1,        // 系列索引
                        lastData, // 新增数据
                        false,    // 新增数据是否从队列头部插入
                        false,    // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
                        axisData  // 坐标轴标签
                    ]
                ]);
            }, 5000);

            weiboCountChart.on(ecConfig.EVENT.CLICK, function(param) {
                var date = param.name;
                console.log(date);
                //TODO 获取当天的关联微博
                Weibo.getRelatedWeibo({}, function(_res) {

                    $scope.relatedWeibo = _res.related;
                    console.log($scope.relatedWeibo);
                });
            });

        });

    }])
    .filter('sentimentFilter', function () {
        return function(value, index, trend){
            var starNum = 0;
            var dom;
            trend == "up" ? dom = "<img src='application/resource/images/icon_up.png'>" : dom = "<img src='application/resource/images/icon_down.png'>";

            if(value >= 0 && value <= 50)
                starNum = 1;
            else if(value <= 100)
                starNum = 2;
            else if(value <= 200)
                starNum = 3;
            else if(value <= 350)
                starNum = 4;
            else
                starNum = 5;

            for(var count = 0; count < starNum; count ++) {
                $(".wb-sentiment:eq(" + index + ")").append(dom);
            }
            $(".wb-sentiment:eq(" + index + ")").append("<br>");
        };
    })
    .controller('financialSentimentCtrl', ["$scope", "Weibo", function ($scope, Weibo) {
        Weibo.getStock({}, function(_res) {
            $scope.stockList = _res.stock_list;
        });

        $scope.period = 0;

        //初始化表格
        require.config({
            paths: {echarts: "application/resource/plugins/source"}
        });
        require([
            'echarts',
            'echarts/chart/line'
        ], function(echarts) {
            var ecConfig = require("echarts/config");
            var sentimentChart = echarts.init(document.getElementById("sentiment-chart"));
            var weiboCountChart = echarts.init(document.getElementById("weibo-count-chart"));
            stockSentimentChartConfig.weiboCountOption.series[0].itemStyle.normal.areaStyle.color = (function (){
                var zrColor = require('zrender/tool/color');
                return zrColor.getLinearGradient(
                    0, 200, 0, 400,
                    [[0, 'rgba(249,176,60,0.1)'],[0.8, 'rgba(255,255,255,0)']]
                )
            })();
            sentimentChart.setOption(stockSentimentChartConfig.sentimentOption);
            weiboCountChart.setOption(stockSentimentChartConfig.weiboCountOption);
            weiboCountChart.connect([sentimentChart]);
            sentimentChart.connect([weiboCountChart]);
            weiboCountChart.on(ecConfig.EVENT.CLICK, function(param) {
                var date = param.name;
                console.log(date);
                //TODO 获取当天的关联微博
                Weibo.getRelatedWeibo({}, function(_res) {
                    $scope.relatedWeibo = _res.related;
                    console.log($scope.relatedWeibo);
                });
            });
        });

        (function () {
            require.config({
                paths: {
                    echarts: 'application/resource/plugins/echarts',
                    zrender: 'application/resource/plugins/zrender'
                }
                //paths: { echarts: 'http://echarts.baidu.com/build/dist' }
            });

            // 使用
            require(
                [
                    'echarts',
                    'echarts/chart/tree',
                    'echarts/chart/pie'
                ],
                function (ec) {
                    // 基于准备好的dom，初始化echarts图表
                    var rn = ec.init(document.getElementById('relationship-network'));
                    var tep = ec.init(document.getElementById('topic-emotion-percent'));
                    var tif = ec.init(document.getElementById('topic-involved-fans'));
                    require(['application/resource/plugins/echarts/theme/dark'], function (tarTheme) {
                        rn.setTheme(tarTheme);
                        tep.setTheme(tarTheme);
                        tif.setTheme(tarTheme);
                    })
                    rn.setOption(financialSentimentChartsConfig.relationshipNetwork);
                    tep.setOption(financialSentimentChartsConfig.topicEmotioPercent);
                    tif.setOption(financialSentimentChartsConfig.topicInvolvedFans);
                }
            )
        })();
    }])
    .controller('weiboAnalysisCtrl', ["$scope", "Weibo", function ($scope, Weibo) {
        $scope.period = 0;
        Weibo.getWeiboTopic({type: 'getEvents', time: 'day', startTime: '2015-07-07'}, function(_res) {
            var events = _res.events;

            // 添加瀑布流数据
            $scope.pics = new Array();
            if (events) {
                for (var index in events) {
                    // 数据准备
                    var event = events[index];
                    var title = event.topic;
                    var num = Math.ceil( Math.random() * 5 );
                    var affectedSector = '';
                    var affectedStock = '';
                    for (var sector in event.related_stock) {
                        affectedSector += sector + '（' + event.related_stock[sector] + '）';
                    }
                    for (var stock in event.related_industry) {
                        affectedStock += stock + '（' + event.related_industry[stock] + '）';
                    }
                    // push操作
                    $scope.pics.push({
                        "title": title,
                        "image": "application/resource/images/" + num + ".png",
                        "affectedSector": affectedSector,
                        "affectedStock": affectedStock
                    });
                }
            }
        });
        // Rank Up
        // 万以上的就精确到万，万以下的就精确到个位
        Weibo.getWeiboTopic({type: 'getRank', time: 'day', startTime: '2015-07-05'}, function(_res) {
            var rankUp = _res.stock_rank;
            // 加载rank up数据
            // 按影响力由大到小
            $scope.rankUp = new Array();
            if (rankUp) {
                for (var index in rankUp) {
                    // 数据准备
                    var item = rankUp[index];
                    var stockName = item.stock_name;
                    var effect = parseInt(item.influence);
                    var emotion = parseInt(item.sentiment);
                    var topics = item.topic.replace(new RegExp("\\+","gm"), " ");
                    // push
                    $scope.rankUp.push({
                        "stockName": stockName,
                        "effect": effect,
                        "emotion": emotion,
                        "topics": topics
                    });
                }
            }
        });
        // Rank Down
        Weibo.getWeiboTopic({type: 'getNRank', time: 'day', startTime: '2015-07-05'}, function(_res) {
            var rankDown = _res.stock_nrank;
            // 加载rank down数据
            // 按话题情绪绝对值由大到小
            $scope.rankDown = new Array();
            if (rankDown) {
                for (var index in rankDown) {
                    // 数据准备
                    var item = rankDown[index];
                    var stockName = item.stock_name;
                    var effect = parseInt(item.influence);
                    var emotion = parseInt("-" + item.sentiment);
                    var topics = item.topic.replace(new RegExp("\\+","gm"), " ");
                    // push
                    $scope.rankDown.push({
                        "stockName": stockName,
                        "effect": effect,
                        "emotion": emotion,
                        "topics": topics
                    });
                }
            }
        });
        $scope.$on('ngRepeatFinished', function () {
            $(".ui.box").transition("fade up", "1s");
            $(".rank.table").transition("fade up", "1s");
        });
        console.log("weiboAnalysisCtrl");
    }])
    .filter('emotion', function() {
        return function(input) {
            var direction = "up";
            var base = 20;
            var qty;

            if (input < 0) direction = "down";
            input = Math.abs(input);
            switch (parseInt(input / base)) {
                case 1: qty = "one"; break;
                case 2: qty = "two"; break;
                case 3: qty = "three"; break;
                case 4: qty = "four"; break;
                case 5: qty = "five"; break;
            }
            return "emotion " + direction + " " + qty;
        };
    })
    .filter('effect', function() {
        return function(input) {
            if (input > 10000) input = parseInt(input / 10000) + '万';
            return input;
        };
    })
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    });
