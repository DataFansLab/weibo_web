var stockSentimentChartConfig = {
    //关注度排名
    hotRankingOption: {
        //title: {
        //    x: 30,
        //    y: 0,
        //    text: "沪深股票排名第55名 酒类板块排名第2名",
        //    textStyle: {
        //        fontSize: 14,
        //        color: "#ccc",
        //        fontWeight: "normal"
        //    }
        //},
        grid: {
            x: 50,
            y: 15,
            x2: 50,
            y2: 20,
            borderWidth: 0
        },
        legend: {y: 0, data: ["总排名", "板块排名"], textStyle: {color: "#ccc"}, itemWidth: 10, itemHeight: 10 },
        xAxis: [{
            type: "category",
            position: "bottom",
            //data: (function (){
            //    var now = new Date();
            //    var res = [];
            //    var len = 10;
            //    while (len--) {
            //        res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
            //        now = new Date(now - 2000);
            //    }
            //    return res;
            //})(),
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
                show: false
            },
            splitNumber: 5
        },{
            type: "value",
            show: false,
            axisLine: {
                show: false
            },
            axisLabel: {
                textStyle: {color: "#ccc"}
            },
            splitLine: {
                show: false
            },
            splitNumber: 5
        }],
        series: [{
            name: "板块排名",
            type: "line",
            symbol: "none",
            yAxisIndex: 0,
            //data: (function (){
            //    var res = [];
            //    var len = 10;
            //    while (len--) {
            //        res.push(Math.round(Math.random() * 10));
            //    }
            //    return res;
            //})(),
            smooth: true,
            itemStyle: {
                normal: {
                    color: "#ffde59",
                    lineStyle: { width: 1 }
                }
            }
        },{
            name: "总排名",
            type: "line",
            symbol: "none",
            yAxisIndex: 1,
            //data:(function (){
            //    var res = [];
            //    var len = 10;
            //    while (len--) {
            //        res.push(Math.round(Math.random() * 10));
            //    }
            //    return res;
            //})(),
            smooth: true,
            itemStyle: {
                normal: {
                    lineStyle: { width: 1 },
                    color: "#327cc0"
                }
            }
        }
        ]
    },
    //微博数统计
    weiboCountOption: {
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
                return params[0].name + ':<br><span style="color:#f9b03c">' + params[0].seriesName + '： </span>' + params[0].value + '<br>\
                    <span style="color:#327cc0">' + params[1].seriesName + '： </span>' + params[1].value;
            }
        },
        grid: {
            x: 50,
            y: 5,
            x2: 50,
            y2: 20,
            borderWidth: 0
        },
        xAxis: [{
            type: "category",
            boundaryGap: false,
            position: "bottom",
            /*data: function (){
             var list = [];
             for (var i = 1; i <= 7; i++) {
             list.push('2015-04-' + i);
             }
             return list;
             }(),*/
            axisLine: {
                lineStyle: {
                    color: "#333333",
                    width: 1
                }
            },
            /*axisTick: {
             show: false
             },*/
            axisLabel: {textStyle: {color: "#ccc"}},
            splitLine: {show: false}
        }],
        yAxis: [{
            type: "value",
            show: true,
            axisLine: {show: false},
            axisLabel: {textStyle: {color: "#ccc"}},
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
            axisLine: {show: false},
            axisLabel: {textStyle: { color: "#ccc"}},
            splitLine: {
                show: true,
                lineStyle: {
                    color: "#333333",
                    width: 1
                }
            },
            splitNumber: 7
        }], series: [{
            type: "line",
            //symbol: "emptyCircle",
            //data: [2, 3, 1, 23, 12, 7, 23],
            name: "微博数",
            itemStyle: {
                normal: {
                    color: "#f9b03c",
                    lineStyle: { width: 1 },
                    areaStyle: {}
                }
            }
        },{
            type: "line",
            //symbol: "none",
            yAxisIndex: 1,
            //data:[2000,300,1200,200,500,342,523],
            name: "关注度",
            itemStyle: {
                normal: {
                    lineStyle: { width: 1 },
                    color: "#327cc0"
                }
            }
        }
        ]},
    //情感值
    sentimentOption: {
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
        title: {
            x: 600,
            y: -5,
            subtext: "正能量\n\n负能量",
            subtextStyle: {
                color: "#ccc",
                lineHeight: 20
            }
        },
        xAxis: [{
            boundaryGap: false,
            show: false,
            axisLine: {
                show: false
            }
            //data: ["2015-06-2", "2015-06-03", "2015-06-04", "2015-06-05", "2015-06-06", "2015-06-07", "2015-06-08"]
        }],
        yAxis: [{
            min: -20,
            max: 20,
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
            //data: [20, -23, -51, 23, 12, 77, 23],
            itemStyle: {
                normal: {
                    color: "#a455a9",
                    lineStyle: { width: 1 }
                }
            }
        }]
    }

};