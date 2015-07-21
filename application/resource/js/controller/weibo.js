
angular.module("weibo.controllers", ["ngDialog"])
    .controller('picInfoCtrl', ["$scope", function($scope){
        console.log("picInfoCtrl");
    }])
    .controller('stockSentimentCtrl', ["$scope", "Weibo", "User", "ngDialog", function ($scope, Weibo, User, ngDialog) {
        $scope.period = -1; //singleWeek: 0,doubleWeek: 1,singleMonth: 2,all: 3
        $scope.currentStockCode;
        $scope.stockAnalysis;
        $scope.relatedWeibo = [];
        $scope.rank = {};

        var startTime, //时间跨度起始时间
            endTime,  //时间跨度结束时间
            sentimentData = [],
            weiboCountData = [],
            influenceData = [],
            rankData = {board: [], industry: []},
            timeline = [],
            sentimentChart = null,
            weiboCountChart = null,
            hotRankingChart = null;

        //获取用户的关注的股票
        function getStocks() {
            User.getStockJobs({
                type: "getStock",
                usrid: "tangye"
            }, function (_res) {
                $scope.stockList = _res.usr_task;
                $scope.currentStockCode = $scope.stockList[0].stock_code;
                $scope.switchPeriod(0);
            });
        }

        getStocks();

        //用户切换时间跨度
        $scope.switchPeriod = function(_period, force) {
            if(_period == $scope.period && !force)
                return;

            $scope.period = _period;

            var today = new Date("2015-04-03");
            var fromDate;

            endTime = dateFormat(today);
            timeline.length = 0;
            sentimentData.length = 0;
            weiboCountData.length = 0;
            influenceData.length = 0;
            rankData = {board: [], industry: []};

            if(sentimentChart) {
                sentimentChart.clear();
                weiboCountChart.clear();

                weiboCountChart.showLoading({
                    text: '正在努力的读取数据中...'
                });
                hotRankingChart.showLoading({
                    text: '正在努力的读取数据中...'
                });
            }

            switch(_period) {
                //最近一周
                case 0:
                    fromDate = new Date(today.setDate(today.getDate() - 7));
                    break;
                //最近两周
                case 1:
                    fromDate = new Date(today.setDate(today.getDate() - 14));
                    break;
                //最近一月
                case 2:
                    fromDate = new Date(today.setMonth(today.getMonth() - 1));
                    break;
            }
            startTime = dateFormat(fromDate);

            Weibo.getStockInfo({
                type: "getStockInfo",
                stockcode: $scope.currentStockCode,
                startTime: startTime,
                endTime: endTime
            }, function(_res) {
                console.log(_res);
                $scope.stockAnalysis = _res;
                //TODO初始化表格数据
                $scope.relatedWeibo = _res.stock_analysis[0].related_weibo;

                for(var i in _res.stock_analysis[0].social_words) {
                    var word = _res.stock_analysis[0].social_words[i];
                    var classes;
                    //情感
                    if(word[1] == 0)
                        classes = "silver ";
                    else
                        classes = word[1] > 0 ? "red " : "green ";
                    if(word[2] < 10)
                        classes += "font12";
                    else if(word[2] < 15)
                        classes += "font14";
                    else if(word[2] < 20)
                        classes += "font16";
                    else if(word[2] < 40)
                        classes += "font20";
                    else
                        classes += "font24";
                    word.push(classes);
                }

                $scope.socialWords = _res.stock_analysis[0].social_words;

                for(var index in _res.stock_analysis) {
                    var analysis = _res.stock_analysis[index];
                    var date = analysis.date.split(" ")[0];
                    sentimentData.push(analysis.sentiment);
                    weiboCountData.push(analysis.weibo_count);
                    influenceData.push(analysis.influence);
                    rankData.board.push(analysis.rankA);
                    rankData.industry.push(analysis.rankIndustry);
                    timeline.push(date);
                }
                console.log(rankData);
                $scope.rank = {
                    boardRank: _res.stock_analysis[0].rankA,
                    industryRank: _res.stock_analysis[0].rankIndustry,
                    industry: _res.stock_analysis[0].industry

                };

                stockSentimentChartConfig.sentimentOption.xAxis[0].data
                    = stockSentimentChartConfig.weiboCountOption.xAxis[0].data
                    = stockSentimentChartConfig.hotRankingOption.xAxis[0].data
                    = timeline;
                stockSentimentChartConfig.sentimentOption.series[0].data = sentimentData;
                stockSentimentChartConfig.weiboCountOption.series[0].data = weiboCountData;
                stockSentimentChartConfig.weiboCountOption.series[1].data = influenceData;
                stockSentimentChartConfig.hotRankingOption.series[0].data = rankData.board;
                stockSentimentChartConfig.hotRankingOption.series[1].data = rankData.industry;

                if(!sentimentChart)
                    initChart();
                else {
                    weiboCountChart.hideLoading();
                    hotRankingChart.hideLoading();
                    sentimentChart.setOption(stockSentimentChartConfig.sentimentOption);
                    weiboCountChart.setOption(stockSentimentChartConfig.weiboCountOption);
                    hotRankingChart.setOption(stockSentimentChartConfig.hotRankingOption);
                }

            });

        }

        $scope.switchStock = function(index) {
            $scope.currentStockCode = $scope.stockList[index].stock_code;
            $scope.switchPeriod(0, true);
        }

        //添加股票
        $scope.addStock = function(){
            var dialog = ngDialog.open({
                template: "application/resource/js/templates/addStockTemplate.html",
                showClose: false,
                controller: ['$scope', 'User', function($scope, User) {
                    var searchCondition = {
                        type: "getStockIntro",
                        stockID: "null",
                        stockName: "null",
                        stockCategory: "null"
                    };
                    $scope.stockList = [];
                    $scope.condition = "";
                    $scope.stockToAdd = null;

                    $scope.selectStock = function($index) {
                        $scope.stockToAdd = $scope.stockList[$index];
                        $scope.condition = $scope.stockList[$index].stock_code + "," + $scope.stockList[$index].stock_name;
                    }

                    $scope.confirmChoice = function() {
                        if(!$scope.stockToAdd)
                            return;
                        User.addStock({
                            type: "saveStock",
                            usrid: "tangye",
                            stock_code: $scope.stockToAdd.stock_code,
                            stock_name: $scope.stockToAdd.stock_name,
                            industry: $scope.stockToAdd.industry
                        }, function(){
                            alert("添加成功");
                            $scope.closeThisDialog();
                        }, function() {
                            alert("添加股票失败")
                        })
                    }

                    $scope.$watch('condition', function(newCondition, oldCondition) {
                        if(newCondition == oldCondition)
                            return;
                        if(newCondition.indexOf(",") != -1)
                            return;
                        if(isNaN(newCondition)) {
                            searchCondition.stockID = "null";
                            searchCondition.stockName = newCondition;
                        }
                        if(!isNaN(newCondition)) {
                            searchCondition.stockName = "null";
                            searchCondition.stockID = newCondition;
                        }
                        $scope.stockToAdd = null;
                        User.getStock( searchCondition, function(_stocks) {
                            $scope.stockList = _stocks.stock_answer;
                        }, function(err) {});
                    })
                }]
            });

            dialog.closePromise.then(function() {
                getStocks();
            });
        }

        $scope.deleteStock = function(index) {
            var dialog = ngDialog.openConfirm({
                template:'application/resource/js/templates/confirmTemplate.html'
            });
            dialog.then(function(){
                console.log($scope.stockList[index].stock_code);
                User.deleteStock({
                    type: "deleteStock",
                    usrid: "tangye",
                    stockID: $scope.stockList[index].stock_code
                }, function(_res) {
                    $scope.stockList.splice(index, 1);
                    $scope.currentStockCode = $scope.stockList[0].stock_code;
                    $scope.switchPeriod(0);
                    alert("删除成功!");
                }, function(err){
                    alert("删除失败!");
                });
            });
        }

        function dateFormat(date) {
            var month = date.getMonth() + 1,
                day = date.getDate();
            month = month < 10 ?  "0" + month : month;
            day = day < 10 ?  "0" + day : day;
            return date.getFullYear() + "-" + month + "-" + day;
        }

        $scope.refreshRelatedWeibo = function(index) {
            $scope.relatedWeibo = $scope.stockAnalysis.stock_analysis[index].related_weibo;
            $scope.$apply();
        }

        //初始化表格绘制
        function initChart() {
            require.config({
                paths: {echarts: "application/resource/plugins/source"}
            });
            require([
                'echarts',
                'echarts/chart/line'
            ], function (echarts) {
                var ecConfig = require("echarts/config");
                sentimentChart = echarts.init(document.getElementById("sentiment-chart"));
                weiboCountChart = echarts.init(document.getElementById("weibo-count-chart"));
                hotRankingChart = echarts.init(document.getElementById("hot-ranking-chart"));

                stockSentimentChartConfig.weiboCountOption.series[0].itemStyle.normal.areaStyle.color = (function () {
                    var zrColor = require('zrender/tool/color');
                    return zrColor.getLinearGradient(
                        0, 200, 0, 400,
                        [[0, 'rgba(249,176,60,0.1)'], [0.8, 'rgba(255,255,255,0)']]
                    )
                })();

                sentimentChart.setOption(stockSentimentChartConfig.sentimentOption);
                weiboCountChart.setOption(stockSentimentChartConfig.weiboCountOption);
                hotRankingChart.setOption(stockSentimentChartConfig.hotRankingOption);
                weiboCountChart.connect([sentimentChart]);
                sentimentChart.connect([weiboCountChart]);

                weiboCountChart.on(ecConfig.EVENT.CLICK, function (param) {
                    $scope.refreshRelatedWeibo(param.dataIndex);
                });
            });
        }
    }])
    .controller('financialSentimentCtrl', ["$scope", "Weibo", "Finance", "ngDialog", function ($scope, Weibo, Finance, ngDialog) {
        var currentUser = "tangye";
        var _timeline = [], //所有图表的很坐标时间轴
            _sentimentData = [], //情感值数据
            _weiboCountData = [], //微博数数据
            _influenceData = [],  //关注度数据
            _relatedStockData = [], //关联股票网数据
            _topicSentimentData = [], //话题情绪数据
            _fansNumData,
            _sentimentChart = null,
            _weiboCountChart = null,
            rn = null,
            tep = null,
            tif = null;


        Weibo.getFinancialTask({ type: "getTask", usrid: currentUser}, function(_res) {
            console.log(_res);
            $scope.taskList = _res.keyword_task;
            $scope.currentTaskId = $scope.taskList[0].task_id;
            $scope.currentTask = $scope.taskList[0];
            $scope.period = 0;
            $scope.switchPeriod(0, true);
        });



        $scope.switchTask = function($index) {
            $scope.currentTaskId = $scope.taskList[$index].task_id;
            $scope.currentTask = $scope.taskList[$index];
            $scope.period = 0;
            $scope.switchPeriod(0, true);
        }

        $scope.switchPeriod = function(_period, force) {
            if(_period == $scope.period && !force)
                return;

            $scope.period = _period;

            var today = new Date("2015-04-03");
            var fromDate;

            var endTime = dateFormat(today);
            _timeline.length = 0;
            _sentimentData.length = 0;
            _weiboCountData.length = 0;
            _influenceData.length = 0;
            _relatedStockData.length = 0;
            _topicSentimentData.length = 0;

            if(_sentimentChart) {
                _sentimentChart.clear();
                _weiboCountChart.clear();

                _weiboCountChart.showLoading({
                    text: '正在努力的读取数据中...'
                });
            }

            switch(_period) {
                //最近一周
                case 0:
                    fromDate = new Date(today.setDate(today.getDate() - 7));
                    break;
                //最近两周
                case 1:
                    fromDate = new Date(today.setDate(today.getDate() - 14));
                    break;
                //最近一月
                case 2:
                    fromDate = new Date(today.setMonth(today.getMonth() - 1));
                    break;
            }
            var startTime = dateFormat(fromDate);

            Finance.getFinanceAnalysis({
                type: "getTaskInfo",
                task_id: $scope.currentTaskId,
                startTime: startTime,
                endTime: endTime
            }, function(_res) {
                console.log(_res);
                $scope.financialAnalysis = _res;
                if(_res.task_analysis == undefined) {
                    $scope.relatedWeibo = null;
                    _weiboCountChart.hideLoading();
                    _weiboCountChart.clear();
                    _sentimentChart.clear();
                    rn.clear();
                    tep.clear();
                    tif.clear();
                    alert("找不到该关键词相关的数据");
                    return;
                }
                //TODO初始化表格数据
                $scope.relatedWeibo = _res.task_analysis[0].related_weibo;
                //$scope.relateStock = _res.task_analysis[0].related_stock;

                for(var index in _res.task_analysis) {
                    var analysis = _res.task_analysis[index];
                    var date = analysis.date.split(" ")[0];
                    _sentimentData.push(analysis.sentiment);
                    _weiboCountData.push(parseInt(analysis.weibo_count.negative_count)
                    + parseInt(analysis.weibo_count.neutual_count)
                    + parseInt(analysis.weibo_count.positive_count) );
                    _influenceData.push(analysis.influence);
                    _timeline.push(date);
                    _topicSentimentData.push(analysis.weibo_count);
                    for(var i in analysis.related_stock)
                        _relatedStockData.push(analysis.related_stock[i]);
                }
                //关联股票按照关联度由大到小排序
                _relatedStockData.sort(function(a,b){return a[1]<b[1]?1:-1});
                financialSentimentChartsConfig.relationshipNetwork.series[0].data[0] = {
                    name: $scope.currentTask.task_name,
                    value: 0,
                    children : []
                };
                financialSentimentChartsConfig.relationshipNetwork.series[1].data[0] = {
                    name: $scope.currentTask.task_name,
                    value: 0,
                    children : []
                };

                for(var i = 0; i < 3 && i < _relatedStockData.length; i++) {
                    var single = {};
                    single.name = _relatedStockData[i][0];
                    single.value = _relatedStockData[i][1];
                    single.emotion = _relatedStockData[i][2];
                    single.labelPosition = "left";
                    financialSentimentChartsConfig.relationshipNetwork.series[0].data[0].children.push(single);
                }
                for(i = 3; i < _relatedStockData.length && i < 9; i++) {
                    var single = {};
                    single.name = _relatedStockData[i][0];
                    single.value = _relatedStockData[i][1];
                    single.emotion = _relatedStockData[i][2];
                    single.labelPosition = "right";
                    financialSentimentChartsConfig.relationshipNetwork.series[1].data[0].children.push(single);
                }

                var emotionPercent = [{
                    value: 0,
                    name: "正面",
                    itemStyle : {normal: {color : '#FFDE59'}}
                },
                {
                    value: 0,
                    name: "负面",
                    itemStyle : {normal: {color : '#2C4773'}}
                },
                {
                    value: 0,
                    name: "中性",
                    itemStyle : {normal: {color : '#69BFDE'}}
                }];

                for(i = 0; i < _topicSentimentData.length; i ++) {
                    emotionPercent[0].value += parseInt(_topicSentimentData[i].positive_count);
                    emotionPercent[1].value += parseInt(_topicSentimentData[i].negative_count);
                    emotionPercent[2].value += parseInt(_topicSentimentData[i].neutual_count);
                }

                stockSentimentChartConfig.sentimentOption.xAxis[0].data
                    = stockSentimentChartConfig.weiboCountOption.xAxis[0].data
                    = stockSentimentChartConfig.hotRankingOption.xAxis[0].data
                    = _timeline;
                stockSentimentChartConfig.sentimentOption.series[0].data = _sentimentData;
                stockSentimentChartConfig.weiboCountOption.series[0].data = _weiboCountData;
                stockSentimentChartConfig.weiboCountOption.series[1].data = _influenceData;

                for(i = 0; i < 4; i ++) {
                    financialSentimentChartsConfig.topicInvolvedFans.series[0].data[i].value = 0;
                }

                for(i = 0; i < $scope.financialAnalysis.task_analysis.length; i++) {
                    var fansCount = $scope.financialAnalysis.task_analysis[i].fans_count;
                    if(fansCount == "[]")
                        break;
                    fansCount = fansCount.substr(1, fansCount.length -2);
                    fansCount = fansCount.split(",");
                    for(var j = 0; j < fansCount.length; j ++) {
                        if (parseInt(fansCount[j]) < 1000) {
                            financialSentimentChartsConfig.topicInvolvedFans.series[0].data[0].value += 1;
                        } else if (parseInt(fansCount[j]) < 5000) {
                            financialSentimentChartsConfig.topicInvolvedFans.series[0].data[1].value += 1;
                        } else if (parseInt(fansCount[j]) < 10000) {
                            financialSentimentChartsConfig.topicInvolvedFans.series[0].data[2].value += 1;
                        } else {
                            financialSentimentChartsConfig.topicInvolvedFans.series[0].data[3].value += 1;
                        }
                    }
                }

                financialSentimentChartsConfig.topicEmotioPercent.series[0].data = emotionPercent;

                if(!_sentimentChart)
                    initChart();
                else {
                    _weiboCountChart.hideLoading();
                    _sentimentChart.setOption(stockSentimentChartConfig.sentimentOption);
                    _weiboCountChart.setOption(stockSentimentChartConfig.weiboCountOption);
                    rn.setOption(financialSentimentChartsConfig.relationshipNetwork);
                    tep.setOption(financialSentimentChartsConfig.topicEmotioPercent);
                    tif.setOption(financialSentimentChartsConfig.topicInvolvedFans);
                }
            });
        }

        //日期格式化为后台的格式
        function dateFormat(date) {
            var month = date.getMonth() + 1,
                day = date.getDate();
            month = month < 10 ?  "0" + month : month;
            day = day < 10 ?  "0" + day : day;
            return date.getFullYear() + "-" + month + "-" + day;
        }

        $scope.deleteTask = function (usr_id, task_id) {
            var result = ngDialog.openConfirm({
                template:'application/resource/js/templates/confirmTemplate.html'
            });
            result.then(function success() {
                Weibo.getFinancialTask({ type: "deleteTask", usrid: usr_id, taskID: task_id}, function(_res) {
                    for (var index in $scope.taskList) {
                        if ($scope.taskList[index].task_id == task_id) {
                            removeByIndexFromArray($scope.taskList, index);
                        }
                    }
                });
            }, function error() {
                //console.info();
            });
        };

        $scope.addTask = function(){
            ngDialog.open({
                template: "application/resource/js/templates/addTaskFormTemplate.html",
                controller: ['$scope', function($scope) {
                    $scope.includedKeywords = new Array();
                    $scope.excludedKeywords = new Array();
                    $scope.addKeywords = function(type) {
                        var id;
                        var arr;
                        if (type == 'ex') {
                            id = "excluded-keywords";
                            arr = $scope.excludedKeywords;
                        } else {
                            id = "included-keywords";
                            arr = $scope.includedKeywords;
                        }
                        var keywords = document.getElementById(id).value.split(",");
                        for (var index in keywords) {
                            arr.push({ name: keywords[index] })
                        }
                        $("#" + id).val("");
                    };
                    $scope.deleteKeyword = function (type, index) {
                        if (type == 'ex') {
                            removeByIndexFromArray($scope.excludedKeywords, index);
                        } else {
                            removeByIndexFromArray($scope.includedKeywords, index);
                        }
                    };
                    $scope.saveTask = function() {
                        var flag = true;
                        var task_name = $('#task-name').val();
                        if (task_name == '') {
                            $('#task-name').parent().addClass("error");
                            flag = false;
                        } else $('#task-name').parent().removeClass("error");
                        if ($scope.includedKeywords.length == 0) {
                            $('.form.row')[1].className += " error";
                            flag = false;
                        } else $('.form.row')[1].className = "form row";
                        var condition = $("input[type='radio']:checked").val();
                        if (condition == null) {
                            $('.form.row')[2].className += " error";
                            flag = false;
                        } else $('.form.row')[2].className = "form row";
                        if ($scope.excludedKeywords.length == 0) {
                            $('.form.row')[3].className += " error";
                            flag = false;
                        } else $('.form.row')[3].className = "form row";
                        if (flag) {
                            $(".dialog p")[0].innerText = "";
                            var keywords = '';
                            for (var index in $scope.includedKeywords) {
                                keywords += $scope.includedKeywords[index].name + ' ';
                            }
                            keywords = keywords.substr(0, keywords.length - 1);
                            var non_keywords = '';
                            for (var index in $scope.excludedKeywords) {
                                non_keywords += $scope.excludedKeywords[index].name + ' ';
                            }
                            non_keywords = non_keywords.substr(0, non_keywords.length - 1);
                            Weibo.getFinancialTask({
                                type: "saveTask",
                                usrid: "tangye",
                                task_name: task_name,
                                keywords: keywords,
                                condition: condition,
                                non_keywords: non_keywords
                            }, function(_res) {
                                $scope.closeThisDialog();
                                location.reload();
                            });
                        } else {
                            $(".dialog p")[0].innerText = "请完善必要信息";
                        }
                    };
                }]
            });
        }

        //初始化表格
        function initChart() {
            require.config({
                paths: {echarts: "application/resource/plugins/source"}
            });
            require([
                'echarts',
                'echarts/chart/line'
            ], function(echarts) {
                var ecConfig = require("echarts/config");
                _sentimentChart = echarts.init(document.getElementById("sentiment-chart-f"));
                _weiboCountChart = echarts.init(document.getElementById("weibo-count-chart-f"));
                stockSentimentChartConfig.weiboCountOption.series[0].itemStyle.normal.areaStyle.color = (function (){
                    var zrColor = require('zrender/tool/color');
                    return zrColor.getLinearGradient(
                        0, 200, 0, 400,
                        [[0, 'rgba(249,176,60,0.1)'],[0.8, 'rgba(255,255,255,0)']]
                    )
                })();
                _sentimentChart.setOption(stockSentimentChartConfig.sentimentOption);
                _weiboCountChart.setOption(stockSentimentChartConfig.weiboCountOption);
                _weiboCountChart.connect([_sentimentChart]);
                _sentimentChart.connect([_weiboCountChart]);
                _weiboCountChart.on(ecConfig.EVENT.CLICK, function(param) {
                    $scope.relatedWeibo = $scope.financialAnalysis.task_analysis[param.dataIndex].related_weibo;
                    $scope.$apply();
                });
            });

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
                    rn = ec.init(document.getElementById('relationship-network'));
                    tep = ec.init(document.getElementById('topic-emotion-percent'));
                    tif = ec.init(document.getElementById('topic-involved-fans'));
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
        }

    }])
    .controller('weiboAnalysisCtrl', ["$scope", "Weibo", function ($scope, Weibo) {
        //$('.ui.pics').css("display", "none");
        //$('.rank.table').css("display", "none");
        $scope.load = function(period) {
            $scope.period = period;


            //$('.ui.pics').addClass("hidden");
            //$('.rank.table').removeClass("visible");
            //$('.rank.table').addClass("hidden");
            var time = 'day';
            var startTime = '2015-03-23 01';
            if (period == 1) time = 'week';
            Weibo.getWeiboTopic({type: 'getEvents', time: time, startTime: startTime}, function(_res) {
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
            Weibo.getWeiboTopic({type: 'getRank', time: time, startTime: startTime}, function(_res) {
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
            Weibo.getWeiboTopic({type: 'getNRank', time: time, startTime: startTime}, function(_res) {
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
                        var emotion = parseInt(item.sentiment);
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
        };
        $scope.load(0);
        $scope.$on('ngRepeatFinished', function () {
            $('.ui.pics').transition("toggle");
            $('.rank.table').transition("toggle");
            $(".ui.pics").transition("fade up", "1s");
            $(".rank.table").transition("fade up", "1s");
        });
    }])
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

/*
 *  功能:删除数组元素.
 *  参数:dx删除元素的下标.
 */
function removeByIndexFromArray(arr, dx)
{
    if(isNaN(dx)||dx>arr.length){return false;}
    for(var i=0,n=0;i<arr.length;i++)
    {
        if(arr[i]!=arr[dx])
        {
            arr[n++]=arr[i]
        }
    }
    arr.length-=1
}
