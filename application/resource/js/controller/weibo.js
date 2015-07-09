
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
                    echarts: "application/resource/plugins/echarts"
                }
            });
            require([
                'echarts',
                'echarts/chart/line',
                'echarts/chart/eventRiver'
            ], function(ec) {
                var ecConfig = require("echarts/config");
                var weiboCountChart = ec.init(document.getElementById("weibo-count-chart"));
                var sentimentChart = ec.init(document.getElementById("sentiment-chart"));
                var data = {};
                var weiboCountOption = {
                    tooltip: {
                        trigger: "axis",
                        showDelay: 0,
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: "#504026",
                        backgroundColor: "#242322",
                        textStyle: {fontSize: "10"},
                        axisPointer: {
                            type: "line",
                            lineStyle: {
                                color: "#666666",
                                type: "dashed",
                                width: 2
                            }
                        },
                        formatter: function (params) {
                            return params[0].name + ':<br><span style="color:#f9b03c">' + params[0].seriesName + '： </span>' + params[0].value
                            + '<br>\
                            <span style="color:#327cc0">' + params[1].seriesName + '： </span>' + params[1].value;
                        }
                    },
                    legend: {
                     y: -100,
                     data: ['微博数', '影响度']
                    },
                    grid: {
                        x: 50,
                        y: 5,
                        x2: 50,
                        y2: 20,
                        borderWidth: 0
                        //borderColor: "#171716"
                    },
                    xAxis: [{
                        type: "category",
                        position: "bottom",
                        data: ["2015-06-2", "2015-06-03", "2015-06-04", "2015-06-05", "2015-06-06", "2015-06-07", "2015-06-08"],
                        axisLine: {
                            lineStyle: {
                                color: "#333333",
                                width: 1
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {color: "#ccc"}
                        },
                        splitLine: {show: false}
                    }],
                    yAxis: [{
                        type: "value",
                        show: true,
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {color: "#ccc"}
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: "#333333",
                                width: 1
                            }
                        },
                        splitNumber: 7
                    },{
                         show:true,
                         axisLine: {
                         show: false
                         },
                         axisLabel: {
                         textStyle: { color: "#ccc"}
                         },
                         splitLine: {
                         show: true,
                         lineStyle: {
                         color: "#333333",
                         width: 1
                         }
                         },
                         splitNumber: 7
                    }
                    ],
                    series: [{
                        type: "line",
                        symbol: "none",
                        data: [2, 3, 1, 23, 12, 7, 23],
                        name: "微博数",
                        itemStyle: {
                            normal: {
                                color: "#f9b03c",
                                lineStyle: { width: 1 },
                                areaStyle: {
                                    color: (function (){
                                        var zrColor = require('zrender/tool/color');
                                        return zrColor.getLinearGradient(
                                            0, 200, 0, 400,
                                            [[0, 'rgba(249,176,60,0.1)'],[0.8, 'rgba(255,255,255,0)']]
                                        )
                                    })()
                                }
                            }
                        }
                    },{
                        type: "line",
                        symbol: "none",
                        yAxisIndex: 1,
                        data:[2000,300,1200,200,500,342,523],
                        name: "关注度",
                        itemStyle: {
                            normal: {
                                lineStyle: { width: 1 },
                                color: "#327cc0"
                            }
                        }
                    }
                    ]
                };
                var sentimentOption = {
                    tooltip: {
                        trigger: "axis",
                        showDelay: 0,
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: "#504026",
                        backgroundColor: "#242322",
                        textStyle: {fontSize: "10"},
                        axisPointer: {
                            type: "line",
                            lineStyle: {
                                color: "#666666",
                                type: "dashed",
                                width: 2
                            }
                        },
                        formatter: function (params) {
                            return params[0].name + ':<br><span style="color:#a455a9">' + params[0].seriesName + '： </span>' + params[0].value;
                        }
                    },
                    grid: {
                        backgroundColor: "#1b2129",
                        x: 50,
                        y: 5,
                        x2: 50,
                        y2: 20,
                        borderWidth: 0
                    },
                    xAxis: [{
                        show: false,
                        axisLine: {
                            show: false
                        },
                        data: ["2015-06-2", "2015-06-03", "2015-06-04", "2015-06-05", "2015-06-06", "2015-06-07", "2015-06-08"]
                    }],
                    yAxis: [{
                        min: -100,
                        max: 100,
                        type: "value",
                        show: true,
                        axisLine: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {color: "#ccc"}
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: "#333333",
                                width: 1
                            }
                        },
                        splitArea: {
                            show: true,
                            areaStyle: {
                                color: [
                                    "#2f1e1c",
                                    "#1b2129"
                                ]
                            }
                        },
                        splitNumber: 2
                    }],
                    series: [{
                        type: "line",
                        name: "情感值",
                        symbol: "none",
                        data: [20, -23, -51, 23, 12, 77, 23],
                        itemStyle: {
                            normal: {
                                color: "#a455a9",
                                lineStyle: { width: 1 }
                            }
                        }
                    }]

                }

                console.log(ecConfig);
                //console.log(sentimentChart.on);
                function handler(param) {
                    console.log(param);
                    console.log("clicked");
                    sentimentChart.showTip();
                }
                sentimentChart.on(ecConfig.EVENT.CLICK, handler);

                weiboCountChart.setOption(weiboCountOption);
                sentimentChart.setOption(sentimentOption, true);

                //weiboCountChart.connect([sentimentChart]);
                //sentimentChart.connect([weiboCountChart]);

            });
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
                                orient: 'horizontal',  // vertical horizontal
                                rootLocation: {x: 230,y: 'center'}, // 根节点位置  {x: 100, y: 'center'},
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
                                        name: '根节点',
                                        value: 6,
                                        children: [
                                            {
                                                name: '节点啊啊',
                                                value: 4,
                                                emotion: 20,
                                                labelPosition: 'left'
                                            },
                                            {
                                                name: '节点啊啊啊',
                                                value: 4,
                                                emotion: -30,
                                                labelPosition: 'left'
                                            },
                                            {
                                                name: '节点',
                                                value: 1,
                                                emotion: 40,
                                                labelPosition: 'left'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                name:'树图',
                                type:'tree',
                                orient: 'horizontal',  // vertical horizontal
                                rootLocation: {x: 230,y: 'center'}, // 根节点位置  {x: 100, y: 'center'}
                                layerPadding: 200,
                                nodePadding: 25,
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