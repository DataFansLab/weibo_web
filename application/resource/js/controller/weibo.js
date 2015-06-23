
angular.module("weibo.controllers", [])
    .controller('picInfoCtrl', ["$scope", function($scope){
        console.log("picInfoCtrl");
    }])
    .controller('stockSentimentCtrl', ["$scope", function ($scope) {
        var PERIOD_TYPE = {
            singleWeek: 0,
            doubleWeek: 1,
            singleMonth: 2,
            all: 3
        };
        $scope.period = 0;

        $scope.stockList = [
            {name: "中国软件", id: 232345},
            {name: "中国银行", id: 132345},
            {name: "中国石油", id: 432345},
            {name: "浦发银行", id: 265645},
            {name: "中国软件", id: 100000}
        ];

        $scope.relatedWeibo = [{
            img_url: "",
            title: "资金面陷入“一钱难求”",
            up: 400,
            down: 200,
            related: ["美的空调", "格力电器"]
        }, {
            img_url: "",
            title: "资金面陷入“一钱难求”",
            up: 300,
            down: 20,
            related: ["美的空调", "格力电器"]
        },{
            img_url: "",
            title: "联通电商部总经理巴拉拉",
            up: 200,
            down: 50,
            related: ["中国石化","中国石油"]
        },  {
            img_url: "",
            title: "联通电商部总经理巴拉拉",
            up: 200,
            down: 50,
            related: ["中国石化","中国石油"]
        },  {
            img_url: "",
            title: "联通电商部总经理巴拉拉",
            up: 200,
            down: 450,
            related: ["中国石化","中国石油"]
        }];
        
        $scope.SNSKeyword = [{keyword: "央企改革"}, {keyword: "互联网金融"}, {keyword: "互联网金融"}, {keyword: "银行"}, {keyword: "税改"}, {keyword: "一带一路"}, {keyword: "以房养老"}];
        $scope.SNSKeyword.forEach(function(item, index){
            var colors = ["sliver", "red", "green"],
                font = ["font14", "font16", "font24"];
            var i = index % 3;
            item.classes = colors[i] + " " + font[i];
        });

        (function(){
            require.config({
                paths: {
                    //echarts: 'http://echarts.baidu.com/build/dist'
                    echarts: 'application/resource/plugins/echarts'
                }
            });

            // 使用
            require(
                [
                    'echarts',
                    'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
                ],
                function (ec) {
                    // 基于准备好的dom，初始化echarts图表
                    var myChart = ec.init(document.getElementById('stock-sentiment-chart'));

                    option = {
                        title : {
                            text: '未来一周气温变化',
                            subtext: '纯属虚构'
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['最高气温','最低气温']
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : ['周一','周二','周三','周四','周五','周六','周日'],
                                show: false
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                axisLabel : {
                                    formatter: '{value} °C'
                                },
                                show: false
                            }
                        ],
                        series : [
                            {
                                name:'最高气温',
                                type:'line',
                                data:[11, 11, 15, 13, 12, 13, 10],
                                markPoint : {
                                    data : [
                                        {type : 'max', name: '最大值'},
                                        {type : 'min', name: '最小值'}
                                    ]
                                },
                                markLine : {
                                    data : [
                                        {type : 'average', name: '平均值'}
                                    ]
                                },
                                itemStyle: {normal: {
                                    lineStyle: {
                                        width: 1
                                    },
                                    areaStyle: {type: 'default'}
                                }}
                            },
                            {
                                name:'最低气温',
                                type:'line',
                                data:[1, -2, 2, 5, 3, 2, 0],
                                markPoint : {
                                    data : [
                                        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                                    ]
                                },
                                markLine : {
                                    data : [
                                        {type : 'average', name : '平均值'}
                                    ]
                                }
                            }
                        ]
                    };
                    // 为echarts对象加载数据
                    myChart.setOption(option);
                }
            );
        })();


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
    .controller('financialSentimentCtrl', ["$scope", function ($scope) {
        console.log("financialSentiment");
    }])
    .controller('weiboAnalysisCtrl', ["$scope", function ($scope) {
        console.log("weiboAnalysisCtrl");
    }]);