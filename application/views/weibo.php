
<!--
 * Created by PhpStorm.
 * User: ruby
 * Date: 2015/6/12
 * Time: 14:53
 -->

<!DOCTYPE html>
<html lang="zh-CN" >
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>社交金融</title>
    <link rel="stylesheet" href="application/resource/css/style.css">
    <script type="text/javascript" src="application/resource/plugins/angular.js"></script>
    <script type="text/javascript" src="application/resource/plugins/angular-route.js"></script>
    <script type="text/javascript" src="application/resource/js/controller/weibo.js"></script>
    <script type="text/javascript" src="application/resource/js/route/weibo.js"></script>
    <script type="text/javascript" src="application/resource/js/weibo.js"></script>
</head>
<body ng-app="weibo">
<div ng-controller="navigationCtrl">
    <ul id="nav">
        <li ng-class="{active: isActive('#/picInfo')}"><a href="#/picInfo">图片资讯</a></li>
        <li ng-class="{active: isActive('#/stockSentiment')}"><a href="#/stockSentiment">股票微舆情</a></li>
        <li ng-class="{active: isActive('#/financialSentiment')}"><a href="#/financialSentiment">财经微舆情</a></li>
        <li ng-class="{active: isActive('#/weiboAnalysis')}"><a href="#/weiboAnalysis">微博话题分析</a></li>
    </ul>
</div>
<!--<script type="text/ng-template" id="picInfo.html">-->
<!--    <p>picInfo</p>-->
<!--</script>-->
<!--<div ng-include="'picInfo.html'" class="well"></div>-->
<div ng-view class="page"></div>
<div id="footer"></div>

<script type="text/javascript" src="application/resource/plugins/echarts/echarts.js"></script>
</body>
</html>