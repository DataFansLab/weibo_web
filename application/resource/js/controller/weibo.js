
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
        
	(function() {
            require.config({
                paths: {
                    echarts: 'application/resource/plugins/echarts' ,
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
                    var option = {
                        title : {
                            text: '关联股票网',
                            textStyle: {
                                fontSize: 16
                            }
                        },
                        calculable : false,
series : [
{
name:'树图',
type:'tree',
direction: 'inverse',
orient: 'horizontal', // vertical horizontal
rootLocation: {x: 230,y: 'center'}, // 根节点位置 {x: 100, y: 'center'},
layerPadding: 70,
nodePadding: 70,
symbolSize: 10,
itemStyle: {
normal: {
label: {
show: true,
formatter: "{b}",
textStyle: {
fontSize: 14,
color: '#cccccc'
}
},
lineStyle: {
color: '#cccccc',
shadowColor: '#000',
shadowBlur: 3,
shadowOffsetX: 3,
shadowOffsetY: 5,
type: 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
}
},
emphasis: {
label: {
show: true,
textStyle: {
fontSize: 14,
color: '#cccccc'
}
}
}
},
                                data: [
                                    {
                                        name: '',
                                        value: 6,
                                        children: [
                                            {
                                                name: '节点啊啊',
                                                value: 4,
                                                emotion: 20,
                                                labelPosition: 'right'
                                            },
                                            {
                                                name: '节点啊啊啊',
                                                value: 4,
                                                emotion: -30,
                                                labelPosition: 'right'
                                            },
                                            {
                                                name: '节点',
                                                value: 1,
                                                emotion: 40,
                                                labelPosition: 'right'
                                            },
                                            {
                                                name: '节点啊',
                                                value: 1,
                                                emotion: -10,
                                                labelPosition: 'right'
                                            },
                                            {
                                                name: '节点啊',
                                                value: 1,
                                                emotion: -10,
                                                labelPosition: 'right'
                                            },
                                            {
                                                name: '节点啊',
                                                value: 1,
                                                emotion: -10,
                                                labelPosition: 'right'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    };

                    var tep = ec.init(document.getElementById('topic-emotion-percent'));
                    var option_for_tep = {
                        title : {
                            text: '话题情绪量比',
                            x:'left',
                            textStyle: {
                                fontSize: 16
                            }
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{b}</br>{c}</br>{d}%",
                            showDelay: 0,
                            //transitionDuration: 0,
                            textStyle: {
                                fontSize: 14
                            }
                        },
                        legend: {
                            // orient : 'vertical',
                            x : 'left',
                            y : 'bottom',
                            selectedMode : false,

                            data:[
                                {name : '正面', icon : 'rectangle'},
                                {name : '负面', icon : 'rectangle'},
                                {name : '中性', icon : 'rectangle'}]
                        },
                        series : [
                            {
                                name:'话题情绪量比',
                                type:'pie',
                                clockWise: false,
                                radius : '55%',
                                center: ['35%', '50%'],
                                itemStyle : {
                                    normal : {
                                        label : {
                                            show: false
                                        },
                                        labelLine : {
                                            show : false
                                        },
                                        borderWidth: 3,
                                        borderColor: '#1B1B1B'
                                    }
                                },
                                data:[
                                    {value:335, name:'正面',
                                        itemStyle : {
                                            normal: {
                                                color : '#FFDE59'
                                            }
                                        }},
                                    {value:310, name:'负面',
                                        itemStyle : {
                                            normal: {
                                                color : '#2C4773'
                                            }
                                        }},
                                    {value:234, name:'中性',
                                        itemStyle : {
                                            normal: {
                                                color : '#69BFDE'
                                            }
                                        }},
                                ]
                            }
                        ]
                    };

                    var tif = ec.init(document.getElementById('topic-involved-fans'));
                    var option_for_tif = {
                        title : {
                            text: '话题讨论用户粉丝数分析图',
                            x:'left',
                            textStyle: {
                                fontSize: 16
                            }
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{c}</br>{d}%",
                            showDelay: 0,
                            //transitionDuration: 0,
                            textStyle: {
                                fontSize: 14
                            }
                        },
                        legend: {
                            // orient : 'vertical',
                            x : 'left',
                            y : 'bottom',
                            selectedMode : false,

                            data:[
                                {name : '1-1000', icon : 'rectangle'},
                                {name : '1000-5000', icon : 'rectangle'},
                                {name : '5000-1万', icon : 'rectangle'},
                                {name : '1万以上粉丝', icon : 'rectangle'}]
                        },
                        series : [
                            {
                                name:'粉丝数',
                                type:'pie',
                                clockWise: false,
                                radius : '55%',
                                center: ['35%', '50%'],
                                itemStyle : {
                                    normal : {
                                        label : {
                                            show: false
                                        },
                                        labelLine : {
                                            show : false
                                        },
                                        borderWidth: 3,
                                        borderColor: '#1B1B1B'
                                    }
                                },
                                data:[
                                    {value:335, name:'1-1000',
                                        itemStyle : {
                                            normal: {
                                                color : '#FFDE59'
                                            }
                                        }},
                                    {value:310, name:'1000-5000',
                                        itemStyle : {
                                            normal: {
                                                color : '#327cc0'
                                            }
                                        }},
                                    {value:234, name:'5000-1万',
                                        itemStyle : {
                                            normal: {
                                                color : '#2C4773'
                                            }
                                        }},
                                    {value:234, name:'1万以上粉丝',
                                        itemStyle : {
                                            normal: {
                                                color : '#69BFDE'
                                            }
                                        }}
                                ]
                            }
                        ]
                    };
                require(['application/resource/plugins/echarts/theme/dark'], function(tarTheme){
                    rn.setTheme(tarTheme);
                    tep.setTheme(tarTheme);
                    tif.setTheme(tarTheme);
                })
                rn.setOption(option);
                tep.setOption(option_for_tep);
                tif.setOption(option_for_tif);
    }
)
})();
}])
.controller('weiboAnalysisCtrl', ["$scope", function ($scope) {
    $scope.period = 0;
    // 添加瀑布流数据
    $scope.pics = [
        {
            "title": "1. 财经周刊微博：就铁路运输签署战略合作协议，金属、贸易、金融股票收益",
                "image": "application/resource/images/pic.png",
                "affectedSector": "金融（1级）贸易（2级）农业（-2级）",
                "affectedStock": "中国软件（1级）"
            },
            {
                "title": "2. 财经周刊微博：就铁路运输签署战略合作协议，金属、贸易、金融股票收益",
                "image": "application/resource/images/pic.png",
                "affectedSector": "金融（1级）贸易（2级）农业（-2级）",
                "affectedStock": "中国软件（1级）"
            },
            {
                "title": "3. 财经周刊微博：就铁路运输签署战略合作协议，金属、贸易、金融股票收益",
                "image": "application/resource/images/pic.png",
                "affectedSector": "金融（1级）贸易（2级）农业（-2级）",
                "affectedStock": "中国软件（1级）"
            },
            {
                "title": "4. 财经周刊微博：就铁路运输签署战略合作协议，金属、贸易、金融股票收益",
                "image": "application/resource/images/pic.png",
                "affectedSector": "金融（1级）贸易（2级）农业（-2级）",
                "affectedStock": "中国软件（1级）"
            }
        ];
        // 万以上的就精确到万，万以下的就精确到个位
        $scope.rankUp = [
            {
                "stockName": "招商银行",
                "effect": 310000,
                "emotion": 50,
                "topics": "P2P 金融 利率"
            },
            {
                "stockName": "中国银行",
                "effect": 2900000,
                "emotion": 100,
                "topics": "P2P 金融 利率"
            },
            {
                "stockName": "工商银行",
                "effect": 600000,
                "emotion": 80,
                "topics": "P2P 金融 利率"
            }
        ];
        $scope.rankDown = [
            {
                "stockName": "招商银行",
                "effect": 310000,
                "emotion": -50,
                "topics": "P2P 金融 利率"
            },
            {
                "stockName": "中国银行",
                "effect": 2900000,
                "emotion": -100,
                "topics": "P2P 金融 利率"
            },
            {
                "stockName": "工商银行",
                "effect": 600000,
                "emotion": -80,
                "topics": "P2P 金融 利率"
            }
        ];
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
    });
