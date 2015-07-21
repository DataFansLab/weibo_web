/**
 * Created by Nano on 2015/7/13.
 */
var financialSentimentChartsConfig = {
    // 关联股票网
    relationshipNetwork: {

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
                data: []
                //data: [
                //    {
                //        name: '根节点',
                //        value: 6,
                //        children: [
                //            {
                //                name: '节点啊啊',
                //                value: 4,
                //                emotion: 20,
                //                labelPosition: 'left'
                //            },
                //            {
                //                name: '节点啊啊啊',
                //                value: 4,
                //                emotion: -30,
                //                labelPosition: 'left'
                //            },
                //            {
                //                name: '节点',
                //                value: 1,
                //                emotion: 40,
                //                labelPosition: 'left'
                //            }
                //        ]
                //    }
                //]
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
                data: []

                //data: [
                //    {
                //        name: '',
                //        value: 6,
                //        children: [
                //            {
                //                name: '节点啊啊',
                //                value: 4,
                //                emotion: 20,
                //                labelPosition: 'right'
                //            },
                //            {
                //                name: '节点啊啊啊',
                //                value: 4,
                //                emotion: -30,
                //                labelPosition: 'right'
                //            },
                //            {
                //                name: '节点',
                //                value: 1,
                //                emotion: 40,
                //                labelPosition: 'right'
                //            },
                //            {
                //                name: '节点啊',
                //                value: 1,
                //                emotion: -10,
                //                labelPosition: 'right'
                //            },
                //            {
                //                name: '节点啊',
                //                value: 1,
                //                emotion: -10,
                //                labelPosition: 'right'
                //            },
                //            {
                //                name: '节点啊',
                //                value: 1,
                //                emotion: -10,
                //                labelPosition: 'right'
                //            }
                //        ]
                //    }
                //]
            }
        ]
    },
    // 话题情绪量比
    topicEmotioPercent: {
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
                }
                //data:[
                    //{value:335, name:'正面',
                    //    itemStyle : {
                    //        normal: {
                    //            color : '#FFDE59'
                    //        }
                    //    }},
                    //{value:310, name:'负面',
                    //    itemStyle : {
                    //        normal: {
                    //            color : '#2C4773'
                    //        }
                    //    }},
                    //{value:234, name:'中性',
                    //    itemStyle : {
                    //        normal: {
                    //            color : '#69BFDE'
                    //        }
                    //    }},
                //]
            }
        ]
    },
    // 话题讨论用户粉丝数分析图
    topicInvolvedFans: {
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
                    {value:0, name:'1-1000',
                        itemStyle : {
                            normal: {
                                color : '#FFDE59'
                            }
                        }},
                    {value:0, name:'1000-5000',
                        itemStyle : {
                            normal: {
                                color : '#327cc0'
                            }
                        }},
                    {value:0, name:'5000-1万',
                        itemStyle : {
                            normal: {
                                color : '#2C4773'
                            }
                        }},
                    {value:0, name:'1万以上粉丝',
                        itemStyle : {
                            normal: {
                                color : '#69BFDE'
                            }
                        }}
                ]
            }
        ]
    }
};