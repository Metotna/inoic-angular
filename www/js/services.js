angular.module('starter.services', [])
//非空验证
    .factory('stock', [function () {
            return {
                Nonull: function (y) {
                    if (y == null || y == undefined || y == '') {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }]
    )

    /**
     * 判断是}否在微信中
     *
     * @returns {Boolean}
     */
    .factory('browser', [function () {
        var u = navigator.userAgent;
        var ua = navigator.userAgent.toLowerCase();
        return {
            is_weixn: function () {
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    return 'yes';
                } else {
                    return 'no';
                }
            },
            navigator:function () {
                var type = '';
                var isA = ua.indexOf("android") > -1;
                var isIph = ua.indexOf("iphone") > -1;
                if(isA){
                    type = 'android'
                }else if(isIph){
                    type = 'ios'
                }
                return type;
            },
            webp:function () {
                    try{
                        return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0);
                    }catch(err) {
                        return  false;
                    }
            },
            isSafari:function () {
                if(window.openDatabase && ua.match(/version\/([\d.]+)/)){
                    return true;
                }else{
                    return false;
                }
            },
            iswebapp:function () {
                if(u.indexOf('Safari') == -1){
                    return true;
                }else{
                    return false;
                }
            }
        }
    }])

    //保存用户信息
    .factory('UserInfo', [function () {
        var userinfo = {};

        function isArray(o) {
            return o instanceof Object;
        }

        return {
            save: function (j) {
                for (var k in j) {
                    //window.localStorage[k] = userinfo[k] = j[k];
                    if (!isArray(j[k])) {
                        window.localStorage[k] = userinfo[k] = j[k];
                    } else {
                        for (var s in j[k]) {
                            window.localStorage[s] = userinfo[s] = j[k][s];
                        }
                    }
                }
                return userinfo;
            },
            remove: function (f) {
                if (f.constructor == Array) {
                    for (var i = 0; i < f.length; i++) {
                        window.localStorage.removeItem(f[i]);
                    }
                }
                window.localStorage.removeItem(f);
            },
            add: function (k, v) {
                window.localStorage[k] = userinfo[k] = v;
            },
            addLong: function (k, v) {
                window.localStorage[k] = v;
            },
            l: window.localStorage
        };
    }])
        //支付调用
    .factory('PayFlow', ['ApiEndpoint', '$http', '$ionicLoading', 'HttpStatus', '$q', 'UserInfo', 'showAlertMsg', function (ApiEndpoint, $http, $ionicLoading, HttpStatus, $q, UserInfo, showAlertMsg) {
        var ua = navigator.userAgent.toLowerCase();
        return {
            money: function (d) {
                var defer = $q.defer();
                $ionicLoading.show({content: 'Loading', duration: 30000})
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/betting/money",
                    data: d,
                }).success(function (data) {
                    $ionicLoading.hide();
                    defer.resolve(data);
                }).error(function () {
                    $ionicLoading.hide();
                    defer.resolve(false);
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            },
            bill: function (d) {
                var defer = $q.defer();
                $ionicLoading.show({content: 'Loading', duration: 30000})
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/betting/bill",
                    data: d,
                }).success(function (data) {
                    $ionicLoading.hide();
                    defer.resolve(data);
                }).error(function () {
                    defer.resolve(false);
                    $ionicLoading.hide();
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            },
            pay: function (d) {
                var defer = $q.defer();
                $ionicLoading.show({content: 'Loading', duration: 30000})
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/wallet/pay",
                    data: d,
                }).success(function (data) {
                    $ionicLoading.hide();
                    defer.resolve(data);
                   /* if (data.status == '1') {
                        if (data.data.payresult == 2) {
                            this.charge(data.data);
                        }
                    }*/
                }).error(function () {
                    defer.resolve(false);
                    $ionicLoading.hide();
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            },
            charge: function (chdata) {
                //$ionicLoading.show({content: 'Loading', duration: 30000});
                chdata.ctype = 'H5';
                chdata.cvalue = ua;
                chdata.ptype = UserInfo.l.sucpayway;
                chdata.backurl = ApiEndpoint.bacgurl+'/#/user/Paysuccess',
                chdata.token = UserInfo.l.token || '';
                //console.log(chdata);
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/wallet/charge",
                    data: chdata,
                }).success(function (data) {
                    $ionicLoading.hide();
                    HttpStatus.codedispose(data);
                    if (data.status == '1') {
                        window.location.href = data.data.h5Charge.url+'?' + data.data.h5Charge.parmkvs;
                    }
                })
            },
            login: function (ld) {
                var defer = $q.defer();
                $ionicLoading.show({content: 'Loading', duration: 30000})
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/auth/login',
                    data: ld,
                }).success(function (data) {
                    $ionicLoading.hide();
                    if (data.status == '1') {
                        UserInfo.add('flag', '1');
                        defer.resolve(data);
                    }
                }).error(function (data) {
                    defer.resolve(false);
                    $ionicLoading.hide();
                });
                return defer.promise;
            }
        }
    }])
    //正则
    .factory('regularExpression', [function () {
        var phoneReg = /^1[3456789]\d{9}$/;
        var nullReg = /(^$)|(^\s{1,}$)|(^null$)/;
        var passWordReg = /^[A-Za-z0-9_]{6,12}$/;
        var bankCardNumReg = /^(\d{16}|\d{19})$/;
        var strLengthReg = /^\d{4}$/;
        return {
            phoneRegFun: function () {
                return phoneReg;
            },
            nullRegFun: function () {
                return nullReg;
            },
            passWordRegFun: function () {
                return passWordReg;
            },
            bankCardNumRegFun: function () {
                return bankCardNumReg;
            },
            strLengthRegFun: function () {
                return strLengthReg;
            }
        };

    }])
    //http状态处理
    .factory('HttpStatus', ['$ionicLoading','$q','browser','showAlertMsg', '$http', '$state', 'UserInfo', 'ApiEndpoint', 'serializeUrl', function ($ionicLoading,$q,browser,showAlertMsg, $http, $state, UserInfo, ApiEndpoint, serializeUrl) {
        var jsondata = serializeUrl.url(location.href);
        var pid = jsondata.param.pid || '';
        if(jsondata.param.ctype){
            var ctype = jsondata.param.ctype;
        }else if(UserInfo.l.is_weixn == 'yes'){
            var ctype = 'H5WX';
        }else{
            var ctype = 'H5';
        }
        var gate = function () {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/match/zq/gate",
                data: {
                    token: UserInfo.l.token
                }
            }).success(function (data) {
                if (data.status == '1') {
                    var jsongate = JSON.stringify(data.data);
                    UserInfo.add('jsongate', jsongate);
                }
            })
        };
        return {
            codedispose: function (data) {
                var status = data.status;
                if (status == 0) {
                    if(data.msg){
                        showAlertMsg.showMsgFun('温馨提示', data.msg);
                    }else{
                        showAlertMsg.showMsgFun('温馨提示', '网络繁忙，请稍后再试');
                    }
                } else if (status == 100) {
                    window.localStorage.removeItem('flag');
                    //showAlertMsg.showMsgFun('未登录','请登录');
                    $state.go('user.login');
                } else if (status == 2) {
                    $http({
                        method: 'post',
                        url: ApiEndpoint.url + '/init',
                        data: {
                            token: UserInfo.l.token || '',
                            pid: pid,
                            ctype:ctype,
                        },
                    }).success(function (data) {
                        UserInfo.add('token', data.data.token);
                        UserInfo.add('guid', data.data.guid);
                    })
                } else if (status == 200) {
                    showAlertMsg.showMsgFun('余额不足', '请充值');
                } else if (status == 3) {
                    showAlertMsg.showMsgFun('警告', 'null');
                }
            },
            getinit: function () {
                if(jsondata.param.account){
                    UserInfo.add('account',jsondata.param.account);
                }
               /* var sjjj = 'sss27ss982'
                console.log(sjjj.replace(/[^0-9]/ig,""))*/
                //console.log(jsondata);
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/init',
                    data: {
                        token: UserInfo.l.token || '',
                        pid: pid,
                        ctype:ctype,
                    },
                }).success(function (data) {
                    if (data.status == '1') {
                        UserInfo.add('token', data.data.token);
                        UserInfo.add('guid', data.data.guid);
                        if(browser.is_weixn == 'yes'){
                            UserInfo.add('sucpayway','WX');
                        }
                        gate();
                    } else if (data.status == '100') {
                        showAlertMsg.showMsgFun('提示', '请重新登录');
                        //UserInfo.l.clear();
                    }
                })
            },
            getgate: function () {
                var defer = $q.defer();
                $ionicLoading.show({content: 'Loading', duration: 30000})
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + "/match/zq/gate",
                    data: {
                        token: UserInfo.l.token
                    }
                }).success(function (data) {
                    $ionicLoading.hide();
                    defer.resolve(data);
                }).error(function () {
                    defer.resolve(false);
                    showAlertMsg.showMsgFun('网络连接失败', '请检查网络连接');
                })
                return defer.promise;
            }
        }
    }])
    //弹窗
    .factory('showAlertMsg', ['$ionicPopup', '$state', '$ionicScrollDelegate', '$timeout', '$ionicPopover', function ($ionicPopup, $state, $ionicScrollDelegate, $timeout, $ionicPopover) {
        return {
            showMsgFun: function (title, txt, jump) {
                //定义按钮文字
                var buttonText = [{text: '关闭'}];
                //注册成功弹窗没有按钮，2秒自动关闭
                if (jump == 'PostAddUser') {
                    buttonText = null;
                    $timeout(function () {
                        myPopup.close();
                    }, 2000);
                }
                var myPopup = $ionicPopup.show({
                    template: txt,
                    title: title,
                    buttons: buttonText,
                    scope: ''
                });
            },
            showProject: function (txt) {
                var template = '<ion-popover-view style = "background-color:#f05244 !important" class = "light padding" > ' + txt + ' </ion-popover-view>';
                var popover = $ionicPopover.fromTemplate(template)
                popover.show();
                $timeout(function () {
                    popover.hide();
                }, 2000);
            }
        }
    }])
    .factory('Flottery', [function () {
        return {
            //胜负平赛选
            spf: function (games) {
                var data = {};
                if (games.spf.bettingList) {
                    for (var k = 0; k < games.spf.bettingList.length; k++) {
                        if (games.spf.bettingList[k].name == '胜') {
                            data.s = games.spf.bettingList[k].rate;
                        } else if (games.spf.bettingList[k].name == '平') {
                            data.p = games.spf.bettingList[k].rate;
                        } else if (games.spf.bettingList[k].name == '负') {
                            data.f = games.spf.bettingList[k].rate;
                        }
                    }
                }
                data.spfopen = games.spf.open;
                return data;
            },
            //让球胜平负
            rspf: function (games) {
                var data = {};
                if (games.rspf.bettingList) {
                    for (var k = 0; k < games.rspf.bettingList.length; k++) {
                        if (games.rspf.bettingList[k].name == '胜') {
                            data.rs = games.rspf.bettingList[k].rate;
                        } else if (games.rspf.bettingList[k].name == '平') {
                            data.rp = games.rspf.bettingList[k].rate;
                        } else if (games.rspf.bettingList[k].name == '负') {
                            data.rf = games.rspf.bettingList[k].rate;
                        }
                    }
                }
                data.rspfopen = games.rspf.open;
                data.lose = games.rspf.lose;
                return data;
            },
            //半全场
            bqc: function (games) {
                var data = {};
                if (games.bqc.bettingList) {
                    for (var k = 0; k < games.bqc.bettingList.length; k++) {
                        if (games.bqc.bettingList[k].name == '胜胜') {
                            data.ss = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '胜平') {
                            data.sp = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '胜负') {
                            data.sf = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '平胜') {
                            data.ps = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '平平') {
                            data.pp = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '平负') {
                            data.pf = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '负胜') {
                            data.fs = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '负平') {
                            data.fp = games.bqc.bettingList[k].rate;
                        } else if (games.bqc.bettingList[k].name == '负负') {
                            data.ff = games.bqc.bettingList[k].rate;
                        }
                    }
                }
                data.bqcopen = games.bqc.open;
                return data;
            },
            //猜比分
            cbf: function (games) {
                var data = {};
                if (games.cbf.bettingList) {
                    var g = games.cbf.bettingList;
                    for (var k = 0; k < g.length; k++) {
                        switch (g[k].name) {
                            case '1:0':
                                data.ovz = g[k].rate;
                                break;
                            case '2:0':
                                data.tvz = g[k].rate;
                                break;
                            case '2:1':
                                data.tvo = g[k].rate;
                                break;
                            case '3:0':
                                data.ttvz = g[k].rate;
                                break;
                            case '3:1':
                                data.ttvo = g[k].rate;
                                break;
                            case '3:2':
                                data.ttvt = g[k].rate;
                                break;
                            case '4:0':
                                data.fvz = g[k].rate;
                                break;
                            case '4:1':
                                data.fvo = g[k].rate;
                                break;
                            case '4:2':
                                data.fvt = g[k].rate;
                                break;
                            case '5:0':
                                data.ffvz = g[k].rate;
                                break;
                            case '5:1':
                                data.ffvo = g[k].rate;
                                break;
                            case '5:2':
                                data.ffvt = g[k].rate;
                                break;
                            case '胜其它':
                                data.sqt = g[k].rate;
                                break;
                            case '0:0':
                                data.zvz = g[k].rate;
                                break;
                            case '1:1':
                                data.ovo = g[k].rate;
                                break;
                            case '2:2':
                                data.tvt = g[k].rate;
                                break;
                            case '3:3':
                                data.ttvtt = g[k].rate;
                                break;
                            case '平其它':
                                data.pqt = g[k].rate;
                                break;
                            case '0:1':
                                data.zvo = g[k].rate;
                                break;
                            case '0:2':
                                data.zvt = g[k].rate;
                                break;
                            case '1:2':
                                data.ovt = g[k].rate;
                                break;
                            case '0:3':
                                data.ovtt = g[k].rate;
                                break;
                            case '1:3':
                                data.ovtt = g[k].rate;
                                break;
                            case '2:3':
                                data.tvtt = g[k].rate;
                                break;
                            case '0:4':
                                data.zvf = g[k].rate;
                                break;
                            case '1:4':
                                data.ovf = g[k].rate;
                                break;
                            case '2:4':
                                data.tvf = g[k].rate;
                                break;
                            case '0:5':
                                data.zvff = g[k].rate;
                                break;
                            case '1:5':
                                data.ovff = g[k].rate;
                                break;
                            case '2:5':
                                data.tvff = g[k].rate;
                                break;
                            case '负其它':
                                data.fqt = g[k].rate;
                                break;
                        }
                    }
                }
                data.cbfopen = games.cbf.open;
                return data;
            },
            //进球数
            jqs: function (games) {
                var data = {};
                if (games.jqs.bettingList) {
                    var g = games.jqs.bettingList;
                    for (var k = 0; k < g.length; k++) {
                        switch (g[k].name) {
                            case '0球':
                                data.fzero = g[k].rate;
                                break;
                            case '1球':
                                data.fone = g[k].rate;
                                break;
                            case '2球':
                                data.ftwo = g[k].rate;
                                break;
                            case '3球':
                                data.fthree = g[k].rate;
                                break;
                            case '4球':
                                data.ffour = g[k].rate;
                                break;
                            case '5球':
                                data.ffive = g[k].rate;
                                break;
                            case '6球':
                                data.fsix = g[k].rate;
                                break;
                            case '7+球':
                                data.fseven = g[k].rate;
                                break;
                        }
                    }
                }
                data.jqsopen = games.jqs.open;
                return data;
            }
        }
    }])
    //篮球数组
    .factory('BasketbalLlist', [function () {
        return {
            //胜负平赛选
            sf: function (games) {
                var data = {};
                if (games.sf.bettingList) {
                    for (var k = 0; k < games.sf.bettingList.length; k++) {
                        if (games.sf.bettingList[k].name == '胜') {
                            data.s = games.sf.bettingList[k].rate;
                        } else if (games.sf.bettingList[k].name == '负') {
                            data.f = games.sf.bettingList[k].rate;
                        }
                    }
                }
                data.sfopen = games.sf.open;
                return data;
            },
            //让球胜平负
            rfsf: function (games) {
                var data = {};
                if (games.rfsf.bettingList) {
                    for (var k = 0; k < games.rfsf.bettingList.length; k++) {
                        if (games.rfsf.bettingList[k].name == '胜') {
                            data.rs = games.rfsf.bettingList[k].rate;
                        } else if (games.rfsf.bettingList[k].name == '负') {
                            data.rf = games.rfsf.bettingList[k].rate;
                        }
                    }
                }
                data.rfsfopen = games.rfsf.open;
                data.lose = games.rfsf.lose;
                return data;
            },
            //胜分差
            sfc: function (games) {
                var data = {};
                if (games.sfc.bettingList) {
                    var g = games.sfc.bettingList;
                    for (var k = 0; k < g.length; k++) {
                        switch (g[k].id) {
                            case 0:
                                data.zero = g[k].rate;
                                break;
                            case 1:
                                data.one = g[k].rate;
                                break;
                            case 2:
                                data.two = g[k].rate;
                                break;
                            case 3:
                                data.three = g[k].rate;
                                break;
                            case 4:
                                data.four = g[k].rate;
                                break;
                            case 5:
                                data.five = g[k].rate;
                                break;
                            case 6:
                                data.six = g[k].rate;
                                break;
                            case 7:
                                data.seven = g[k].rate;
                                break;
                            case 8:
                                data.eight = g[k].rate;
                                break;
                            case 9:
                                data.nine = g[k].rate;
                                break;
                            case 10:
                                data.ten = g[k].rate;
                                break;
                            case 11:
                                data.eleven = g[k].rate;
                                break;
                        }
                    }
                }
                data.sfcopen = games.sfc.open;
                return data;
            },
            //大小分
            dxf: function (games) {
                var data = {};
                if (games.dxf.bettingList) {
                    var g = games.dxf.bettingList;
                    for (var k = 0; k < g.length; k++) {
                        switch (g[k].id) {
                            case 0:
                                data.dy = g[k].rate;
                                break;
                            case 1:
                                data.xy = g[k].rate;
                                break;
                        }
                    }
                }
                data.dxfopen = games.dxf.open;
                data.zlose = games.dxf.zlose;
                return data;
            }
        }
    }])

    //数据保存
    .factory('myFactory', [function () {
        //定义参数对象
        var myObject = {};

        /**
         * 定义传递数据的setter函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _setter = function (data) {
            myObject = data;
        };

        /**
         * 定义获取数据的getter函数
         * @param {type} xxx
         * @returns {*}
         * @private
         */
        var _getter = function () {
            return myObject;
        };

        // Public APIs
        // 在controller中通过调setter()和getter()方法可实现提交或获取参数的功能
        return {
            setter: _setter,
            getter: _getter
        };
    }])
    /*赛事筛选,及赛事数据处理*/
    .factory('Match', ['UserInfo', 'Flottery', '$timeout', 'Chats', 'BasketbalLlist', function (UserInfo, Flottery, $timeout, Chats, BasketbalLlist) {
        //按时间分类赛事
        var TimeSort = function (arr) {
            var map = new Object();
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                // /console.log(item.gameid);
                var time = item.gameid.substring(0,6);
                //console.log(item.gametime);
                if (!map[time]) {
                    var array = new Array();
                    array.push(item);
                    map[time] = {time: time, file: array};
                } else {
                    var temp = map[time];
                    temp.file.push(item);
                    map[time] = temp;
                }
            }
            var resultArray = new Array();
            for (var key in map) {
                resultArray.push(map[key]);
            }
            resultArray = resultArray.sort(function (a, b) {
                return Date.parse(a.time) - Date.parse(b.time);//时间正序
            });
            var resultArray1 = [];
                for(var j in resultArray){
                    resultArray[j].file.sort(function (a, b) {
                            return a.gameid - b.gameid;//时间正序
                        }
                    );
                }
            return resultArray;
        };
        return {
            //type投注页面数据标识-足球
            MatchFilter: function (index, type) {
                if (typeof Object.assign != 'function') {
                    Object.assign = function (target) {
                        'use strict';
                        if (target == null) {
                            throw new TypeError('Cannot convert undefined or null to object');
                        }
                        target = Object(target);
                        for (var index = 1; index < arguments.length; index++) {
                            var source = arguments[index];
                            if (source != null) {
                                for (var key in source) {
                                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                                        target[key] = source[key];
                                    }
                                }
                            }
                        }
                        return target;
                    };
                }
                var list = JSON.parse(UserInfo.l.jsondatazq);
                var Mannerlist = [];
                //console.log(list);
                for (var i = 0; i < list.length; i++) {
                    var games = list[i].games;
                    var arry1 = {};
                    for (var j = 0; j < games.length; j++) {
                        //console.log(games[j]);
                        arry1 = {
                            gameid: games[j].gameid,
                            gname: games[j].gname,
                            hname: games[j].hname,
                            matchname: games[j].matchname,
                            gameid: games[j].gameid,
                            endsale: games[j].endsale.substring(11,16),
                            gametime: games[j].gametime,
                            gamename: games[j].gamename,
                            moregateopen: games[j].moregateopen,
                            onegateopen: games[j].onegateopen,
                        }
                        //console.log(games[j].moregateopen);
                        if (index == 1 && games[j].moregateopen || index == 7 && games[j].onegateopen) {
                            arry1 = Object.assign(arry1, Flottery.spf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 2 && games[j].moregateopen || index == 8 && games[j].onegateopen) {
                            arry1 = Object.assign(arry1, Flottery.rspf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 3 && games[j].moregateopen || index == 9 && games[j].onegateopen) {
                            arry1 = Object.assign(arry1, Flottery.bqc(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 4 && games[j].moregateopen || index == 10 && games[j].onegateopen) {
                            arry1 = Object.assign(arry1, Flottery.cbf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 5 && games[j].moregateopen || index == 11 && games[j].onegateopen) {
                            arry1 = Object.assign(arry1, Flottery.jqs(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 6 && games[j].moregateopen || index == 12 && games[j].onegateopen) {
                            arry1 = Object.assign(arry1, Flottery.spf(games[j]), Flottery.rspf(games[j]), Flottery.bqc(games[j]), Flottery.cbf(games[j]), Flottery.jqs(games[j]));
                            Mannerlist.push(arry1);
                        }
                    }
                }
                if (type == 2) {
                    return Mannerlist;
                } else {
                    return TimeSort(Mannerlist);
                }
            },
            //type投注页面数据标识-篮球
            Matchbasball: function (index, type) {
                if (typeof Object.assign != 'function') {
                    Object.assign = function (target) {
                        'use strict';
                        if (target == null) {
                            throw new TypeError('Cannot convert undefined or null to object');
                        }
                        target = Object(target);
                        for (var index = 1; index < arguments.length; index++) {
                            var source = arguments[index];
                            if (source != null) {
                                for (var key in source) {
                                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                                        target[key] = source[key];
                                    }
                                }
                            }
                        }
                        return target;
                    };
                }
                var list = JSON.parse(UserInfo.l.jsondatalq);
                var Mannerlist = [];
                for (var i = 0; i < list.length; i++) {
                    var games = list[i].games;
                    var arry1 = {};
                    for (var j = 0; j < games.length; j++) {
                        //console.log(games[j]);
                        arry1 = {
                            gameid: games[j].gameid,
                            gname: games[j].gname,
                            hname: games[j].hname,
                            matchname: games[j].matchname,
                            gameid: games[j].gameid,
                            endsale: games[j].endsale.substring(11,16),
                            gametime: games[j].gametime,
                            gamename: games[j].gamename,
                            moregateopen: games[j].moregateopen,
                            onegateopen: games[j].onegateopen,
                        }
                        if (index == 1 && games[j].moregateopen || index == 7 && games[j].onegateopen) {
                            arry1 = Object.assign(arry1, BasketbalLlist.sf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 2 && games[j].moregateopen || index == 8 && games[j].onegateopen) {
                            arry1 = Object.assign(arry1, BasketbalLlist.rfsf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 3 && games[j].moregateopen || index == 9 && games[j].onegateopen) {
                            arry1 = Object.assign(arry1, BasketbalLlist.sfc(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 4 && games[j].moregateopen || index == 10 && games[j].onegateopen) {
                            arry1 = Object.assign(arry1, BasketbalLlist.dxf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 5 && games[j].moregateopen || index == 11 && games[j].onegateopen) {
                            arry1 = Object.assign(arry1, BasketbalLlist.sf(games[j]), BasketbalLlist.rfsf(games[j]), BasketbalLlist.sfc(games[j]), BasketbalLlist.dxf(games[j]));
                            Mannerlist.push(arry1);
                        } else if (index == 6 && games[j].moregateopen || index == 12 && games[j].onegateopen) {
                        }
                        console.log(Mannerlist);
                    }
                }
                //console.log(Mannerlist);
                if (type == 2) {
                    return Mannerlist;
                } else {
                    return TimeSort(Mannerlist);
                }
            },
            //提交赛事数据拼接
            datatreatment: function (Pass) {
                var p = Pass;
                var str = ''
                for (var i = 0; i < Pass.length; i++) {
                    str += Pass[i].gameid + ':' + Pass[i].bettingid + ':' + Pass[i].resultid + ',';
                }
                return str;
            },
            //数组去重
            unique: function (arr) {
                var re = [arr[0]];
                for (var i = 1; i < arr.length; i++) {
                    if (arr[i] !== re[re.length - 1]) {
                        re.push(arr[i]);
                    }
                }
                return re;
            },
            //猜比分投注页面数据展示
            result: function (list, data) {
                var l = list;
                var d = data;
                var arry1 = [];
                for (var i = 0; i < l.length; i++) {
                    var result = '';
                    for (var j = 0; j < d.length; j++) {
                        if (l[i].gameid == d[j].gameid) {
                            result += d[j].result + " ";
                        }
                    }
                    l[i].result = result;
                    arry1.push(l[i]);
                }
                return arry1;
            },
            //猜比分已选赛事计算
            countsession: function (array, indextype) {
                var len = array.length;
                var a = '';
                for (var i = 0; i < array.length - 1; i++) {
                    for (var j = i + 1; j < array.length; j++) {
                        var num = array[i];
                        if (array[j].gameid == num.gameid) {
                            // 重复，数组总长度减1
                            len--;
                            i++;
                        }
                    }
                }
                if (len < 2 && indextype <= 6) {
                    a = '请至少选择两场比赛';
                } else if (len < 1 && indextype > 6) {
                    a = '请至少选择一场比赛';
                } else {
                    a = '已选择' + len + '场比赛';
                }
                return a;
            },
            //选择页面猜比分已选奖项渲染
            cbfselected: function (cbf) {
                var a = $('.betbtns');
                for (var i = 0; i < a.length; i++) {
                    if (cbf.result.indexOf($(a[i]).find('span').first().text()) != -1) {
                        $(a[i]).toggleClass('ssss');
                    }
                }
            },
            //投注页面猜比分已选奖项渲染
            cbfbetting: function (pass) {
                var b = $('.Showcbf .betbtns');
                $timeout(function () {
                    for (var s = 0; s < pass.length; s++) {
                        for (var k = 0; k < b.length; k++) {
                            if (pass[s].gameid == b[k].getAttribute('data-gameid') && pass[s].resultid == b[k].getAttribute('data-resultid') && pass[s].bettingid == b[k].getAttribute('data-bettingid')) {
                                if (!$(b[k]).hasClass('ssss')) {
                                    $(b[k]).addClass('ssss');
                                }
                                break;
                            }
                        }
                    }
                }, 0)
            },
            //混合投注弹出窗已选奖项渲染
            hhselected: function (hh) {
                var pass = hh;
                var c = Chats.rtrim(pass.result);
                var d = Chats.rtrim(pass.resbettingid);
                var e = Chats.rtrim(pass.resresultid);
                $timeout(function () {
                    var b = $('.Showcbf .betbtns');
                    for (var s = 0; s < c.length; s++) {
                        for (var k = 0; k < b.length; k++) {
                            if (pass.gameid == b[k].getAttribute('data-gameid') && e[s] == b[k].getAttribute('data-resultid') && d[s] == b[k].getAttribute('data-bettingid')) {
                                $(b[k]).addClass('ssss');
                                break;
                            }
                        }
                    }
                }, 2)
            },
            //混合页面已选奖项渲染
            hhpageselected: function (hh) {
                var pass = hh;
                var d = [];
                var e = [];
                var gameid = [];
                for (var s = 0; s < pass.length; s++) {
                    for (var g = 0; g < pass[s].file.length; g++) {
                        if (pass[s].file[g].resbettingid != undefined && pass[s].file[g].resbettingid != '') {
                            d.push(pass[s].file[g].resbettingid);
                            e.push(pass[s].file[g].resresultid);
                            gameid.push(pass[s].file[g].gameid);
                        }
                    }
                }
                var dd = [];
                var ee = [];
                var gg = [];
                for (var i = 0; i < d.length; i++) {
                    dd.push(Chats.rtrim(d[i]));
                    ee.push(Chats.rtrim(e[i]));
                }
                $timeout(function () {
                    var b = $('.betbtns');
                    for (var kk = 0; kk < b.length; kk++) {
                        $(b[kk]).removeClass('ssss');
                    }
                    for (var ii = 0; ii < dd.length; ii++) {
                        for (var gim = 0; gim < dd[ii].length; gim++) {
                            for (var k = 0; k < b.length; k++) {
                                if (gameid[ii] == b[k].getAttribute('data-gameid') && ee[ii][gim] == b[k].getAttribute('data-resultid') && dd[ii][gim] == b[k].getAttribute('data-bettingid')) {
                                    $(b[k]).addClass('ssss');
                                    break;
                                }
                            }
                        }
                    }

                }, 2)
            },
            //混合投注已选赛事提取
            fructus: function (hh) {
                var pass = hh;
                var d = [];
                var e = [];
                var r = [];
                var gameid = [];
                for (var s = 0; s < pass.length; s++) {
                    for (var g = 0; g < pass[s].file.length; g++) {
                        if (pass[s].file[g].resbettingid != undefined && pass[s].file[g].resbettingid != '') {
                            d.push(pass[s].file[g].resbettingid);
                            e.push(pass[s].file[g].resresultid);
                            gameid.push(pass[s].file[g].gameid);
                            r.push(pass[s].file[g].result);
                        }
                    }
                }
                var dd = [];
                var ee = [];
                var gg = [];
                for (var i = 0; i < d.length; i++) {
                    dd.push(Chats.rtrim(d[i]));
                    ee.push(Chats.rtrim(e[i]));
                    gg.push(Chats.rtrim(r[i]));
                }
                var arry1 = [];
                for (var ii = 0; ii < dd.length; ii++) {
                    for (var gim = 0; gim < dd[ii].length; gim++) {
                        var obj = {};//场次
                        obj.gameid = gameid[ii];
                        obj.bettingid = dd[ii][gim];
                        obj.resultid = ee[ii][gim];
                        obj.result = gg[ii][gim];
                        arry1.push(obj);
                    }
                }
                //console.log(arry1);
                return arry1;
            },
            //猜比分已选结果数据获取
            resultacquire: function (list) {
                var l = list;
                for (var i in l) {
                    for (var j = 0; j < l[i].file.length; j++) {
                        if (l[i].file[j].result != undefined && l[i].file[j].result != '') {
                            //console.log(l[i].file[j]);
                        }
                    }
                }
            },
            //猜比分提交数据获取处理
            splicearry1: function (spcbf) {
                var data = spcbf;
                var resultobj = {};
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].length; j++) {
                        resultobj[data[i][j]['gameid']] = data[i];
                    }
                }
                var values = [];//定义一个数组用来接受value
                for (var key in resultobj) {
                    values.push(resultobj[key]);//取得value
                }
                var arry1 = [];
                for (var j = 0; j < values.length; j++) {
                    for (var g = 0; g < values[j].length; g++) {
                        arry1.push(values[j][g]);
                    }
                }
                return arry1;
            },
            //混合投注投注选择
            hhjsondata: function (t, list) {
                var a = t.parents('.match-list').index();
                var b = t.parents('.match-item').index() - 1;
                if (list[a].file[b].result == undefined || list[a].file[b].result == '') {
                    var c = [];
                    var d = [];
                    var e = [];
                } else {
                    var c = Chats.rtrim(list[a].file[b].result);
                    var d = Chats.rtrim(list[a].file[b].resbettingid);
                    var e = Chats.rtrim(list[a].file[b].resresultid);
                }
                var f = t.data('bettingid');
                var g = t.data('resultid');
                var h = $(t).find('span').first().text();
                var tf = false;
                var cc = '';
                var dd = '';
                var ee = '';
                if (!t.hasClass('ssss')) {
                    for (var i = 0; i < c.length; i++) {
                        if (d[i] == f && e[i] == g) {
                            tf = true;
                            c.splice(i, 1);
                            d.splice(i, 1);
                            e.splice(i, 1);
                            break;
                        }
                    }
                    //console.log(c,d,e);
                } else {
                    c.push(h);
                    d.push(f);
                    e.push(g);
                }
                for (var j = 0; j < c.length; j++) {
                    cc += c[j] + " ";
                    dd += d[j] + " ";
                    ee += e[j] + " ";
                }
                list[a].file[b].result = cc;
                list[a].file[b].resbettingid = dd;
                list[a].file[b].resresultid = ee;
                //console.log(list);
                return list;
            }
        }
    }])
    //投注页面处理
    .factory('Bettingpage', [function () {
        //获取选择过关方式
        var bianli = function () {
            var span = $('.methods-con span');
            var arry = [];
            for (var i = 0; i < span.length; i++) {
                var a = {};
                if ($(span[i]).hasClass('ott-img')) {
                    a.id = $(span[i]).data('connect');
                    a.gatename = $(span[i]).text();
                    arry.push(a);
                }
                ;
            }
            return arry;
        }
        return {
            traverse: function () {
                var a = bianli();
                return a;
            },
            passway: function (a) {
                var s = '';
                for (var j = 0; j < a.length; j++) {
                    s += a[j].id + ',';
                }
                return s;
            }
        }

    }])
    .factory('Chats', [function () {
        function overlap(arr, arr2) {
            var arr3 = new Array();
            var index = 0, i = 0, j = 0;
            for (i = 0; i < arr.length; i++) {
                var has = false;
                if (arr[i].gameid == arr2.gameid) {
                    has = true;
                }
                if (!has) {
                    arr3[index++] = arr[i];
                }
            }
            return arr3;
        };
        return {
            //删除赛事投注方案处理
            deletPassdata: function (l, p) {
                return overlap(p, l);
            },

            //删除赛事list数组处理
            remove: function (chat, chats) {
                chats.splice(chats.indexOf(chat), 1);
                return chats;
            },
            removeindex: function (chat, chats) {
                chats.splice(chat, 1);
                return chats;
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            },
            rtrim: function (s) {
                var arry1 = [];
                var i = s.replace(/(\s*$)/g, "");
                arry1 = i.split(" ");
                return arry1;
            },
            gamefilter: function (l) {
                var obj = '';
                var arry1 = [];
                for (var i = 0; i < l.length; i++) {
                    for (var j = 0; j < l[i].file.length; j++) {
                        if (obj.indexOf(l[i].file[j].matchname) == -1) {
                            obj += l[i].file[j].matchname;
                            arry1.push(l[i].file[j].matchname)
                        }
                    }
                }
                return arry1;
            },
            gamenameQD: function () {
                var li = $('.gamename li');
                var s = '';
                for (var i = 0; i < li.length; i++) if (li[i].className.indexOf('ott-img') != -1) {
                    s += $(li[i]).text() + ',';
                }
                return s;
            }
        }
    }])
    .factory('History', ['$ionicHistory', '$state', function ($ionicHistory, $state) {
        return {
            clear: function (type) {
                if (type == 'zq') {
                    $ionicHistory.clearCache(['practice.Soccerhall', 'practice.basketballhall']).then(function () {
                        $state.go('practice.Soccerhall')
                    })
                } else if (type == 'lq') {
                    $ionicHistory.clearCache(['practice.Soccerhall', 'practice.basketballhall']).then(function () {
                        $state.go('practice.basketballhall');
                    })
                }
            },
            passwayss: function (p, g) {
                var Passway = [];
                if (p > 6) {
                    Passway = [
                        {
                            gatename: "仅支持单关",
                            id: 100
                        }
                    ];
                } else {
                    switch (g) {
                        case 1:
                            Passway = [
                                {
                                    gatename: "2串1",
                                    id: 200
                                }
                            ];
                            break;
                        case 2:
                            Passway = [
                                {
                                    gatename: "2串1",
                                    id: 200
                                }
                            ];
                            break;
                        case 3:
                            Passway = [
                                {
                                    gatename: "3串1",
                                    id: 300
                                }
                            ];
                            break;
                        case 4:
                            Passway = [
                                {
                                    gatename: "4串1",
                                    id: 400
                                }
                            ];
                            break;
                        case 5:
                            Passway = [
                                {
                                    gatename: "5串1",
                                    id: 500
                                }
                            ];
                            break;
                        case 6:
                            Passway = [
                                {
                                    gatename: "6串1",
                                    id: 600
                                }
                            ];
                            break;
                        case 7:
                            Passway = [
                                {
                                    gatename: "7串1",
                                    id: 700
                                }
                            ];
                            break;
                        case 8:
                            Passway = [
                                {
                                    gatename: "8串1",
                                    id: 800
                                }
                            ];
                            break;
                        default:
                            Passway = [
                                {
                                    gatename: "8串1",
                                    id: 800
                                }
                            ];
                    }
                }
                return Passway;
            }
        }
    }])
    /*反序列化*/
    .factory('serializeUrl', [function () {
        return {
            url: function (str) {
                var param = {}, hash = {}, anchor;
                var url = str || location.href;
                var arr = /([^?]*)([^#]*)(.*)/.exec(url);
                var ar1 = /(.*:)?(?:\/?\/?)([\.\w]*)(:\d*)?(.*?)([^\/]*)$/.exec(arr[1]);
                var ar2 = arr[2].match(/[^?&=]*=[^?&=]*/g);
                var ar3 = arr[3].match(/[^#&=]*=[^#&=]*/g);

                if (ar2) {
                    for (var i = 0, l = ar2.length; i < l; i++) {
                        var ar22 = /([^=]*)(?:=*)(.*)/.exec(ar2[i]);
                        param[ar22[1]] = ar22[2];
                    }
                }

                if (ar3) {
                    for (var i = 0, l = ar3.length; i < l; i++) {
                        var ar33 = /([^=]*)(?:=*)(.*)/.exec(ar3[i]);
                        hash[ar33[1]] = ar33[2];
                    }
                }

                if (arr[3] && !/[=&]/g.test(arr[3])) {
                    anchor = arr[3];
                }

                function getUrl() {
                    var that = this, url = [], param = [], hash = [];

                    url.push(that.protocol, that.protocol && '//' || ' ', that.host, that.port, that.path, that.file);

                    for (var p in that.param) {
                        param.push(p + '=' + that.param[p]);
                    }

                    for (var p in that.hash) {
                        hash.push(p + '=' + that.hash[p]);
                    }

                    url.push(param.length && '?' + param.join('&') || ' ');

                    if (that.anchor) {
                        url.push(that.anchor);
                    } else {
                        url.push(hash.length && '#' + hash.join('&') || '');
                    }

                    return url.join(' ');
                }

                return {
                    href: arr[0],
                    protocol: ar1[1],
                    host: ar1[2],
                    port: (ar1[3] || ' '),
                    path: ar1[4],
                    file: ar1[5],
                    param: param,
                    hash: hash,
                    anchor: anchor,
                    getUrl: getUrl
                };
            }
        }
    }])
    /*订单处理*/
    .factory('order', [function () {
        var lotteryid = {
            '1': 'practice.Soccerhall',
            '2': 'practice.basketballhall',
            '3': 'practice.lottery-seven',
            '4': 'practice.plshall',
            '5': 'practice.lottery-seven',
            '6': 'practice.lottery-super',
            '7': 'practice.syxwhall',
            '8': 'practice.syxwhall',
            '9': 'practice.syxwhall',
            '10': 'practice.syxwhall',
            '11': 'practice.lottery-super',
            '12': 'practice.lottery-super',
            '13': 'practice.plshall',
        }
        var zqarry = {
            SPF: {
                '3': '胜',
                '1': '平',
                '0': '负',
            },
            RSPF: {
                '3': '让胜',
                '1': '让平',
                '0': '让负',
            },
            BQC: {
                '3-3': '胜胜',
                '3-1': '胜平',
                '3-0': '胜负',
                '1-3': '平胜',
                '1-1': '平平',
                '1-0': '平负',
                '0-3': '负胜',
                '0-1': '负平',
                '0-0': '负负',
            },
            JQS: {
                '0': '0球',
                '1': '1球',
                '2': '2球',
                '3': '3球',
                '4': '4球',
                '5': '5球',
                '6': '6球',
                '7': '7+球',
            },
            SF: {
                '3': '胜',
                '0': '负',
            },
            RFSF: {
                '3': '胜',
                '0': '负',
            },
            SFC: {
                '01': '1-5',
                '02': '6-10',
                '03': '11-15',
                '04': '16-20',
                '05': '21-25',
                '06': '26+',
                '11': '1-5',
                '12': '6-10',
                '13': '11-15',
                '14': '16-20',
                '15': '21-25',
                '16': '26+',
            },
            DXF: {
                '3': '大于',
                '0': '小于',
            },
        }
        var bj = function (o, s) {
            var t = '';
            t = zqarry[o][s[0]];
            return t;
        }
        var Format = {
            '3': {
                '1': '七星彩'
            },
            '4': {
                '1': '直选三',
                '2': '组三',
                '3': '组六',
            },
            '5': {
                '1': '排列五',
            },
            '6': {
                '1': '普通',
                '2': '追加',
            },
            '7': {
                '1': '任选一',
                '2': '任选二',
                '3': '任选三',
                '4': '任选四',
                '5': '任选五',
                '6': '任选六',
                '7': '任选七',
                '8': '任选八',
                '9': '前二直选',
                '10': '前三直选',
                '11': '前二组选',
                '12': '前三组选',
            },
            '8': {
                '1': '任选一',
                '2': '任选二',
                '3': '任选三',
                '4': '任选四',
                '5': '任选五',
                '6': '任选六',
                '7': '任选七',
                '8': '任选八',
                '9': '前二直选',
                '10': '前三直选',
                '11': '前二组选',
                '12': '前三组选',
            },
            '9': {
                '1': '任选一',
                '2': '任选二',
                '3': '任选三',
                '4': '任选四',
                '5': '任选五',
                '6': '任选六',
                '7': '任选七',
                '8': '任选八',
                '9': '前二直选',
                '10': '前三直选',
                '11': '前二组选',
                '12': '前三组选',
            },
            '10': {
                '1': '任选一',
                '2': '任选二',
                '3': '任选三',
                '4': '任选四',
                '5': '任选五',
                '6': '任选六',
                '7': '任选七',
                '8': '任选八',
                '9': '前二直选',
                '10': '前三直选',
                '11': '前二组选',
                '12': '前三组选',
            },
            '11': {
                '1': '普通',
            },
            '12': {
                '1': '普通',
            },
            '13': {
                '1': '直选',
                '2': '组三',
                '3': '组六',
            }
        }
        var Firstsd = {
            '1': '单式',
            '2': '复式',
            '3': '包号',
            '4': '和值',
            '5': '胆拖',
        }
        return {
            //详情过关方式
            Passway: function (i) {
                var arry = [];
                arry = i.split(",")
                var arry1 = [];
                for (var j = 0; j < arry.length; j++) {
                    if (arry[j].length == 3) {
                        arry1.push(arry[j]);
                    }
                }
                return arry1;
            },
            ccodeslist: function (t) {
                s = t.ccodes;
                var arry = [];
                var arry1 = [];
                var arry2 = [];
                var arry3 = [];
                var obj = {};
                arry = s.split(',');
                for (var i = 0; i < arry.length; i++) {
                    arry1 = arry[i].split('=');
                    arry2 = arry1[1].split('_');
                    switch (arry1[0]) {
                        case "SPF":
                            arry2[0] = bj('SPF', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '胜平负'
                            break;
                        case "BQC":
                            arry2[0] = bj('BQC', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '半全场'
                            break;
                        case "JQS":
                            arry2[0] = bj('JQS', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '进球数'
                            break;
                        case "CBF":
                            if (arry2[0] == '9:0') {
                                arry2[0] = '胜其它'
                            } else if (arry2[0] == '9:9') {
                                arry2[0] = '平其它'
                            } else if (arry2[0] == '0:9') {
                                arry2[0] = '负其它'
                            }
                            arry1[2] = arry1[0];
                            arry1[0] = '猜比分'
                            break;
                        case "RSPF":
                            arry2[0] = bj('RSPF', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '让胜平负' + '(' + t.lose + ')';
                            break;
                        case "SF":
                            arry2[0] = bj('SF', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '胜负'
                            break;
                        case "RFSF":
                            arry2[0] = bj('RFSF', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '让分胜负'
                            break;
                        case "SFC":
                            arry2[0] = bj('SFC', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '胜分差'
                            break;
                        case "DXF":
                            arry2[0] = bj('DXF', arry2);
                            arry1[2] = arry1[0];
                            arry1[0] = '大小分'
                            break;
                    }
                    obj = {
                        bettype: arry1[0],
                        betresult: arry2[0],
                        winrate: arry2[1],
                        bettypeID: arry1[2]
                    }
                    arry3.push(obj);
                }
                return arry3;
            },
            zjpd: function (l) {
                var objlist = {};
                l = l.bbets;
                for (var i = 0; i < l.length; i++) {
                    var q = '';
                    var w = '';
                    var obj1 = {};
                    if (!l[i].hs) {
                        objlist[l[i].pid] = obj1;
                        break;
                    }
                    if (l[i].hs > l[i].gs) {
                        obj1.SPF = '胜';
                    } else if (l[i].hs == l[i].gs) {
                        obj1.SPF = '平';
                    } else if (l[i].hs < l[i].gs) {
                        obj1.SPF = '负';
                    }
                    if (l[i].hs - (-l[i].lose) > l[i].gs) {
                        obj1.RSPF = '让胜';
                    } else if (l[i].hs - (-l[i].lose) == l[i].gs) {
                        obj1.RSPF = '让平';
                    } else if (l[i].hs - (-l[i].lose) < l[i].gs) {
                        obj1.RSPF = '让负';
                    }
                    if (l[i].hhs > l[i].hgs) {
                        q = '胜'
                    } else if (l[i].hhs == l[i].hgs) {
                        q = '平'
                    } else if (l[i].hhs < l[i].hgs) {
                        q = '负'
                    }
                    if (l[i].hs > l[i].gs) {
                        w = '胜'
                    } else if (l[i].hs == l[i].gs) {
                        w = '平'
                    } else if (l[i].hs < l[i].gs) {
                        w = '负'
                    }
                    if (l[i].hs - (-l[i].gs) < 7) {
                        obj1.JQS = l[i].hs - (-l[i].gs) + '球';
                    } else {
                        obj1.JQS = '7+球';
                    }
                    if (l[i].hs > 5 && l[i].gs > 2) {
                        obj1.CBF = '胜其它';
                    } else if (l[i].hs > 2 && l[i].gs > 5) {
                        obj1.CBF = '负其它';
                    } else if (l[i].hs == l[i].gs && l[i].hs > 3) {
                        obj1.CBF = '平其他';
                    } else {
                        obj1.CBF = l[i].hs + ':' + l[i].gs;
                    }
                    obj1.BQC = q + w;
                    objlist[l[i].pid] = obj1;
                }
                return objlist;
            },
            /*数字彩拆分*/
            NumberGame: function (list) {
                y = list.bcontext;
                var str = '';
                var str1 = '';
                var obj = {};
                var arry = [];
                var arry1 = [];
                var arry2 = [];
                arry = y.split("|")
                arry1 = arry[1].split(";")
                for (var j = 0; j < arry1.length - 1; j++) {
                    str = '';
                    obj = {};
                    var arry3 = [];
                    arry3 = arry1[j].split(':')
                    for (var k = 0; k < arry3.length - 2; k++) {
                        var arry4 = [];
                        arry4 = arry3[k].split(',')
                        for (var f = 0; f < arry4.length; f++) {
                            str += arry4[f] + ',';
                        }
                        str1 = Format[list.lotteryid][arry3[arry3.length - 2]] + Firstsd[arry3[arry3.length - 1]];
                    }
                    obj.bets = str;
                    obj.play = str1;
                    arry2.push(obj);
                }
                return arry2;
            },
            getbackurl: lotteryid,
        }
    }])
    //摇一摇代码
    /*
     var SHAKE_THRESHOLD = 3000;
     var last_update = 0;
     var x = y = z = last_x = last_y = last_z = 0;
     !(function init() {
     if (window.DeviceMotionEvent) {
     window.addEventListener('devicemotion', deviceMotionHandler, false);
     } else {
     alert('not support mobile event');
     }
     })()
     function deviceMotionHandler(eventData) {
     var acceleration = eventData.accelerationIncludingGravity;
     var curTime = new Date().getTime();
     if ((curTime - last_update) > 100) {
     var diffTime = curTime - last_update;
     last_update = curTime;
     x = acceleration.x;
     y = acceleration.y;
     z = acceleration.z;
     var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

     if (speed > SHAKE_THRESHOLD) {
     alert(x);
     }
     last_x = x;
     last_y = y;
     last_z = z;
     }
     }*/

    // 随机数获取
    .factory('MathRnum', [function () {
        return {
            norepeatNum: function (max, num, min) {
                min == undefined ? min = 0 : 1;
                var nary = [], temp;
                var x = max - min + 1;

                function rs(a) {
                    return Math.floor(Math.random() * a + min);
                };
                Prefix = function (num) {
                    return (Array(2).join(0) + num).slice(-2);
                }
                nary.push(rs(x));
                function cli() {
                    temp = rs(x);
                    if (nary.length == num)return;
                    if (nary.indexOf(temp) < 0) {
                        nary.push(temp);
                    }
                    cli();
                }

                cli();
                if (min == 1) {
                    for (var x in nary) {
                        nary[x] = Prefix(nary[x]);
                    }
                }
                return nary;
            },
            repeatNum: function (max, num, min) {
                min == undefined ? min = 0 : 1;
                var nAry = [], temp;
                var x = max - min + 1;

                function rs(a) {
                    return Math.floor(Math.random() * a + min);
                }

                Prefix = function (num) {
                    return (Array(2).join(0) + num).slice(-2);
                }
                for (var i = 0; i <= num - 1; i++) {
                    nAry.push(rs(x));
                }
                return nAry;
            },
            roundNum: function (max) {
                return Math.round(Math.random() * (max));
            }
        }
    }])

    // 排列三
    .factory('pls', ['MathRnum', function (MathRnum) {
        var plsfs = function (p, f) {
            var s = '';
            switch (p) {
                case 'zx3':
                    if (!f) {
                        s = ':1:1';
                    } else {
                        s = ':1:2';
                    }
                    break;
                case 'z3_ds':
                    s = ':2:1';
                    break;
                case 'z3_fs':
                    s = ':2:1';
                    break;
                case 'z6_fs':
                    if (!f) {
                        s = ':3:1';
                    } else {
                        s = ':3:2';
                    }
                    break;
                case 'zx_hz':
                    s = ':1:4';
                    break;
                case 'z3_hz':
                    s = ':2:4';
                    break;
                case 'z6_hz':
                    s = ':3:4';
                    break;
            }
            return s;
        }
        return {
            tzs: function (t, e) {
                var r;
                switch (t) {
                    case "zx_hz":
                        r = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1];
                        m = 0;
                        break;
                    case "z3_fs":
                        r = [0, 0, 2, 6, 12, 20, 30, 42, 56, 72, 90];
                        break;
                    case "z3_hz":
                        r = [1, 2, 1, 3, 3, 3, 4, 5, 4, 5, 5, 4, 5, 5, 4, 5, 5, 4, 5, 4, 3, 3, 3, 1, 2, 1];
                        m = 1;
                        break;
                    case "z6_fs":
                        r = [0, 0, 0, 1, 4, 10, 20, 35, 56, 84, 120];
                        break;
                    case "z6_hz":
                        r = [1, 1, 2, 3, 4, 5, 7, 8, 9, 10, 10, 10, 10, 9, 8, 7, 5, 4, 3, 2, 1, 1];
                        m = 3
                }
                if ("zx_hz" == t || "z3_hz" == t || "z6_hz" == t) {
                    var a = 0;
                    for (var s = 0; s < e.length; s++) a += r[parseInt(e[s] - m)]
                } else if ("z3_fs" == t || "z6_fs" == t) {
                    a = r[e.length];
                } else if ('zx3' == t) {
                    var f = 1;
                    for (var n = 0; n < e.length; n++) {
                        f *= e[n].length;
                    }
                    a = f;
                }
                return a
            },
            toggleplay: function (id) {
                var n = 1;
                switch (id) {
                    case "zx3":
                        n = 3;
                        break;
                    case "z3_ds":
                        n = 2;
                        break;
                    case "z3_fs":
                        n = 1;
                        break;
                    case "z6_fs":
                        n = 1;
                        break;
                }
                return n;
            },
            sjs: function (p, m, n) {
                var i = 0;
                switch (p) {
                    case "zx3":
                        i = MathRnum.repeatNum(m, n);
                        break;
                    case "z3_ds":
                        i = MathRnum.norepeatNum(m, n);
                        break;
                    case "z3_fs":
                        i = MathRnum.norepeatNum(m, 2);
                        break;
                    case "z6_fs":
                        i = MathRnum.norepeatNum(m, 3);
                        break;
                    case "zx_hz":
                        i = MathRnum.repeatNum(27, 1);
                        break;
                    case "z3_hz":
                        i = MathRnum.repeatNum(26, 1,1);
                        break;
                    case "z6_hz":
                        i = MathRnum.repeatNum(24, 1,3);
                        break;
                }
                return i;
            },
            ts: function (p,t) {
                var s = {};
                if(t == 4){
                    switch (p) {
                        case "zx3":
                            s.o = '猜中开奖数且一一对应，即奖';
                            s.f = '1040元';
                            s.t = '每位至少选1个号码';
                            break;
                        case "z3_ds":
                            s.o = '猜中开奖号码且为组三形态，即奖';
                            s.f = '346元';
                            s.t = '每位只能选1个号';
                            break;
                        case "z3_fs":
                            s.o = '猜中开奖号码且为组三形态，即奖';
                            s.f = '346元';
                            s.t = '至少选2个号';
                            break;
                        case "z6_fs":
                            s.o = '猜中开奖数且每位数均不相同，即奖';
                            s.f = '346元';
                            s.t = '至少选3个号';
                            break;
                        case "zx_hz":
                            s.o = '猜中开奖号码之和，即奖';
                            s.f = '346元';
                            s.t = '至少选1个号';
                            break;
                    }
                }else if(t == 13){
                    switch (p) {
                        case "zx3":
                            s.o = '按位猜中全部3个号码,即中';
                            s.f = '1040元';
                            s.t = '每位至少选1个号码';
                            break;
                        case "z3_ds":
                            s.o = '猜中开奖号码，顺序不限，即中';
                            s.f = '346元';
                            s.t = '选择1个重号和1个单号';
                            break;
                        case "z3_fs":
                            s.o = '猜中开奖号码，顺序不限，即中';
                            s.f = '346元';
                            s.t = '至少选2个号';
                            break;
                        case "z6_fs":
                            s.o = '猜中开奖号码，顺序不限，即中';
                            s.f = '173元';
                            s.t = '至少选3个号';
                            break;
                        case "zx_hz":
                            s.o = '猜中开奖号码之和，即中';
                            s.f = '1040元';
                            s.t = '至少选1个号';
                            break;
                        case "z3_hz":
                            s.o = '猜中开奖号码之和，即中';
                            s.f = '346元';
                            s.t = '至少选1个号';
                            break;
                        case "z6_hz":
                            s.o = '猜中开奖号码之和，即中';
                            s.f = '173元';
                            s.t = '至少选1个号';
                            break;
                    }
                }
                return s;
            },
            //排列三投注数据处理
            tz: function (t, z) {
                var obj = {};
                obj = {
                    playid: t,
                    plsarry: z,
                }
                return obj;
            },
            handle: function (p) {
                var n = false;
                var s = '';
                var ss = ''
                for (var i = 0; i < p.length; i++) {
                    s = '';
                    n = false;
                    if (p[i].playid == 'zx3') {
                        for (var j1 in p[i].plsarry) {
                            for (var g in p[i].plsarry[j1]) {
                                if (p[i].plsarry[j1].length > 1) {
                                    n = true;
                                }
                                s += p[i].plsarry[j1][g];
                            }
                            s += ',';
                        }
                        ;
                    } else if (p[i].playid == 'z3_ds') {
                        s = '';
                        for (var j2 in p[i].plsarry) {
                            for (var g in p[i].plsarry[j2]) {
                                if (j2 == 1) {
                                    s += p[i].plsarry[j2][0];
                                } else {
                                    s += p[i].plsarry[j2][g] + ',' + p[i].plsarry[j2][g];
                                }
                            }
                            s += ',';
                        }
                        ;
                    } else if (p[i].playid == 'z3_fs') {
                        var arry = '';
                        var sss = '';
                        for (var j3 in p[i].plsarry) {
                            for (var g = 0; g < p[i].plsarry.length; g++) {
                                if (j3 != g) {
                                    sss = p[i].plsarry[j3] + ',' + p[i].plsarry[g] + ',' + p[i].plsarry[g] + plsfs(p[i].playid, n) + ';';
                                    arry += sss;
                                }
                            }
                        }
                        ss += arry;
                    } else if (p[i].playid == 'z6_fs') {
                        var sss = '';
                        var arry1 = '';
                        var array = p[i].plsarry;
                        for (var f = 0, len1 = array.length; f < len1; f++) {
                            var a2 = array.concat();
                            a2.splice(0, f + 1);
                            for (var j = 0, len2 = a2.length; j < len2; j++) {
                                var a3 = a2.concat();
                                a3.splice(0, j + 1);
                                for (var k = 0, len3 = a3.length; k < len3; k++) {
                                    arry1 += array[f] + ',' + a2[j] + ',' + a3[k] + plsfs(p[i].playid, n) + ';'
                                }
                            }
                        }
                        ss += arry1;
                    } else if (p[i].playid == "zx_hz" || p[i].playid == "z3_hz" || p[i].playid == "z6_hz") {
                        s = '';
                        for (var ll = 0; ll < p[i].plsarry.length; ll++) {
                            if (p[i].plsarry.length > 1) {
                                n = true;
                            }
                            s += p[i].plsarry[ll] + plsfs(p[i].playid, n) + ';';
                        };
                        ss += s;
                    }
                    if (p[i].playid !== 'z3_fs' && p[i].playid !== 'z6_fs' && p[i].playid !== 'zx_hz' && p[i].playid != "z3_hz" && p[i].playid != "z6_hz") {
                        ss += s.replace(/(.*)[,，]$/, '$1') + plsfs(p[i].playid, n) + ';';
                    }
                    //console.log(ss);
                }
                return ss;
            },
            //页面显示数据处理
            zs: function (p) {
                var s = [];
                for (var i = 0; i < p.length; i++) {
                    s = [];
                    if (p[i].playid != 'zx3' && p[i].playid != 'z3_ds') {
                        for (var j = 0; j < p[i].plsarry.length; j++) {
                            s[j] = p[i].plsarry[j];
                        }
                        p[i].plsarry = [];
                        p[i].plsarry[0] = s;
                    }
                }
                return p;
            }
        }
    }])
    // 十一选五
    .factory("syxw", ['MathRnum', function (MathRnum) {
        var syxwfs = function (p, f) {
            var s = '';
            switch (p) {
                case 'zx3':
                    if (!f) {
                        s = ':1:1';
                    } else {
                        s = ':1:2';
                    }
                    break;
                case 'z3_ds':
                    s = ':2:1';
                    break;
                case 'z3_fs':
                    s = ':2:1';
                    break;
                case 'z6_fs':
                    if (!f) {
                        s = ':3:1';
                    } else {
                        s = ':3:2';
                    }
                    break;
                case 'zx_hz':
                    s = ':1:4';
                    break;
            }
            return s;
        }
        var A = function (num) {
            if (num < 0) {
                return -1;
            } else if (num === 0 || num === 1) {
                return 1;
            } else {
                for (var i = num - 1; i >= 1; i--) {
                    num *= i;
                }
            }
            return num;
        };
        var Anm = function (n, m) {
            for (var i = 1; i <= (n - m + 1); i++) {
                n *= n - i;
            }
            return n;
        };
        return {
            sjs: function (p, n) {
                var i = 0;
                var m = 11;
                var min = 1;
                i = MathRnum.norepeatNum(m, n, min);
                return i;
            },
            C: function (n, m) {
                if (m <= n) {
                    return A(n) / (A(m) * A(n - m));
                } else {
                    return 0;
                }
            },
            tz: function (t, z, r, u) {
                var obj = {};
                obj = {
                    playid: t,
                    plsarry: z,
                    rx: r,
                    payluid: u,
                }
                //console.log(obj.plsarry[0]);
                return obj;
            },
            //页面显示数据处理
            zs: function (p) {
                var s = [];
                for (var i = 0; i < p.length; i++) {
                    s = [];
                    if (p[i].playid.indexOf('dt') == -1 && p[i].playid != 'q2_pt' && p[i].playid != 'q3_pt') {
                        for (var j = 0; j < p[i].plsarry.length; j++) {
                            s[j] = p[i].plsarry[j];
                        }
                        p[i].plsarry = [];
                        p[i].plsarry[0] = s;
                    }
                }
                //console.log(p);
                return p;
            },
            handle: function (p) {
                var n = false;
                var A = /(.*)[,，]$/;
                var s = '';
                var str = '';
                var str1 = '';
                var str2 = '';
                var ss = ''
                for (var i = 0; i < p.length; i++) {
                    s = '';
                    str = '';
                    str1 = '';
                    str2 = '';
                    n = false;
                    if (p[i].playid.indexOf('dt') != -1) {
                        for (var j = 0; j < p[i].plsarry[0].length; j++) {
                            str += p[i].plsarry[0][j] + ',';
                        }
                        for (var j = 0; j < p[i].plsarry[1].length; j++) {
                            str1 += p[i].plsarry[1][j] + ',';
                        }
                        s = str.replace(A, '$1') + '$' + str1.replace(A, '$1') + ':' + p[i].payluid + ':' + '5';
                    } else if (p[i].playid == 'q2_pt' || p[i].playid == 'q3_pt') {
                        var h = '1';
                        for (var j = 0; j < p[i].plsarry[0].length; j++) {
                            str += p[i].plsarry[0][j] + ',';
                        }
                        for (var j = 0; j < p[i].plsarry[1].length; j++) {
                            str1 += p[i].plsarry[1][j] + ',';
                        }
                        if (p[i].plsarry[0].length > 1 || p[i].plsarry[1].length > 1) {
                            h = '2';
                        }
                        if (p[i].plsarry.length >= 3) {
                            for (var j = 0; j < p[i].plsarry[2].length; j++) {
                                str2 += p[i].plsarry[2][j] + ',';
                            }
                            if (p[i].plsarry[2].length > 1) {
                                h = '2';
                            }
                            s = str.replace(A, '$1') + '@' + str1.replace(A, '$1') + '@' + str2.replace(A, '$1') + ':' + p[i].payluid + ':' + h;
                        } else {
                            s = str.replace(A, '$1') + '@' + str1.replace(A, '$1') + ':' + p[i].payluid + ':' + h;
                        }
                    } else {
                        var h = '1';
                        for (var j = 0; j < p[i].plsarry.length; j++) {
                            str += p[i].plsarry[j] + ',';
                        }
                        if (p[i].plsarry.length > p[i].rx) {
                            h = '2';
                        }
                        s = str.replace(A, '$1') + ':' + p[i].payluid + ':' + h;
                    }
                    ss += s + ';';
                    //console.log(ss);
                }
                return ss;
            },
            ts: function (p) {
                var s = {};
                switch (p) {
                    case "rx1_pt":
                        s.o = '猜中开奖的任意1个号码，即奖';
                        s.f = '13元';
                        s.t = '至少选择1个号';
                        break;
                    case "rx2_pt":
                        s.o = '猜中开奖的任意2个号码，即奖';
                        s.f = '6元';
                        s.t = '至少选择2个号';
                        break;
                    case "rx3_pt":
                        s.o = '猜中开奖的任意3个号码，即奖';
                        s.f = '19元';
                        s.t = '至少选择3个号';
                        break;
                    case "rx4_pt":
                        s.o = '猜中开奖的任意4个号码，即奖';
                        s.f = '78元';
                        s.t = '至少选择4个号';
                        break;
                    case "rx5_pt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '540元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx6_pt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '90元';
                        s.t = '至少选择6个号';
                        break;
                    case "rx7_pt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '26元';
                        s.t = '至少选择7个号';
                        break;
                    case "rx8_pt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '9元';
                        s.t = '至少选择8个号';
                        break;
                    case "q2_pt":
                        s.o = '猜中开奖前2位一一对应，即奖';
                        s.f = '130元';
                        s.t = '每位至少选择1个号';
                        break;
                    case "q2zx_pt":
                        s.o = '猜中开奖前2位顺序不限，即奖';
                        s.f = '65元';
                        s.t = '至少选2个号';
                        break;
                    case "q3_pt":
                        s.o = '猜中开奖前3位一一对应，即奖';
                        s.f = '1170元';
                        s.t = '每位至少选择1个号';
                        break;
                    case "q3zx_pt":
                        s.o = '猜中开奖前3位顺序不限，即奖';
                        s.f = '540元';
                        s.t = '至少选择3个号';
                        break;
                    case "rx2_dt":
                        s.o = '猜中开奖的任意2个号码，即奖';
                        s.f = '6元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx3_dt":
                        s.o = '猜中开奖的任意3个号码，即奖';
                        s.f = '19元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx4_dt":
                        s.o = '猜中开奖的任意4个号码，即奖';
                        s.f = '78元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx5_dt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '540元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx6_dt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '90元';
                        s.t = '至少选择5个号';
                        break;
                    case "rx7_dt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '26元';
                        s.t = '至少选择5个号';
                        break;
                    case "q2zx_dt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '65元';
                        s.t = '至少选择5个号';
                        break;
                    case "q3zx_dt":
                        s.o = '猜中开奖的任意5个号码，即奖';
                        s.f = '195元';
                        s.t = '至少选择5个号';
                        break;
                }
                return s;
            },
        }
    }])
    // 字符串拼接&&计数
    .factory("qxc", [function () {
        return {
            Mosaicchar: function (ary) {
                var copy = ary.slice();
                var str = "";
                var a = 1;
                for (var x in copy) {
                    if (typeof(ary[x]) == 'object') {
                        a = 2;
                        copy[x] = copy[x].sort().join("");
                    }
                }
                return copy.join(",") + ':' + 1 + ":" + a + ";";
            },
            countNuma: function (ary) {
                var ns = 1;
                for (var i in ary) {
                    if (typeof(ary[i]) == 'object')
                        ns = ns * ary[i].length;
                }
                return ns;
            }
        }
    }])
    // 数学运算C(排列)
    .factory("cAp", [function () {
        return {
            comNumber: function (a, b) {
                var arya = [];
                var aryb = [];
                var acot = bcot = 1;
                for (var i = 0; i <= b - 1; i++) {
                    arya.push(a - i);
                    aryb.push(b - i);
                }
                for (var x in arya) {
                    acot = acot * arya[x];
                    bcot = bcot * aryb[x];
                }
                return acot / bcot;
            },
            perNumber: function (a, b) {

            }
        }
    }])
    //走势图
    .factory('Trend', ['ApiEndpoint', '$http', '$ionicLoading', 'HttpStatus', '$q', 'UserInfo', 'showAlertMsg', function (ApiEndpoint, $http, $ionicLoading, HttpStatus, $q, UserInfo, showAlertMsg) {
        return {
            trends: function (obj,falg) {
                var defer = $q.defer();
                if(falg==undefined){
                    $ionicLoading.show({content: 'Loading', duration: 30000});
                }
                $http({
                    method: 'post',
                    url: ApiEndpoint.url + '/trade/zs/code',
                    data: obj,
                }).success(function (data) {
                    if(falg==undefined){
                        $ionicLoading.hide();
                    }
                    defer.resolve(data);
                }).error(function (data) {
                    defer.resolve(false);
                    if(falg==undefined){
                        $ionicLoading.hide();
                    }
                    showAlertMsg.showMsgFun('数据请求失败', '请检查网络连接');
                })
                return defer.promise;
            }
        }
    }])

    // 快三
    .factory('fastthree', ['cAp', function(cAp) {
        return {
            lotcot: function(a) {
                var o = {};
                switch (a) {
                    case 'pt_hz':
                        o.t = '猜中开奖号码相加和';
                        o.a = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
                        o.b = ['奖金80元', '奖金40元', '奖金25元', '奖金16元', '奖金12元', '奖金10元', '奖金9元', '奖金9元', '奖金10元', '奖金12元', '奖金16元', '奖金25元', '奖金40元', '奖金80元'];
                        o.ary = [];
                        break;
                    case 'pt_sth':
                        o.t = '猜豹子号（3个相同）';
                        o.a = [111, 222, 333, 444, 555, 666];
                        o.b = ['奖金240元', '奖金240元', '奖金240元', '奖金240元', '奖金240元', '奖金240元'];
                        o.ary = [[],[]];
                        break;
                    case 'pt_eth':
                        o.t = '猜对子号（有2个相同）';
                        o.ta = '选择同号和不同号的组合，奖金80元';
                        o.c = [11, 22, 33, 44, 55, 66];
                        o.d = [1, 2, 3, 4, 5, 6];
                        o.tb = '猜开奖的2个指定的相同号码，奖金15元';
                        o.e = ['11*', '22*', '33*', '44*', '55*', '66*'];
                        o.ary = [[[],[]],[]];
                        break;
                    case 'pt_sbth':
                        o.ta = '猜开奖的三个不同号码，奖金40元';
                        o.c = [1, 2, 3, 4, 5, 6];
                        o.tb = '123,234,345,456,任一开出即中10元';
                        o.ary = [[],[]];
                        break;

                    case 'pt_ebth':
                        o.t = '猜开奖号码中2个指定的不同号码,奖8元';
                        o.a = [1, 2, 3, 4, 5, 6];
                        o.ary = [];
                        break;
                }
                return o;
            },
            lotnum: function(a, ary) {
                if (a == 'pt_hz') {
                    return ary.length;
                }
                if (a == 'pt_sth') {
                    return ary[0].length + ary[1].length;
                }
                if (a == 'pt_eth') {
                    var a = 0;
                    if (ary[0][0] != "") { a = cAp.comNumber(ary[0][0].length, 1); }
                    var b = 0;
                    if (ary[0][1] != "") { b = cAp.comNumber(ary[0][1].length, 1); }
                    return a * b + ary[1].length;
                }
                if (a == 'pt_sbth') {
                    var a = 0;
                    if (ary[0].length >= 3) { a = cAp.comNumber(ary[0].length, 3) };
                    return a + ary[1].length;
                }
                if (a = 'pt_ebth') {
                    var a = 0;
                    if (ary.length >= 2) { a = cAp.comNumber(ary.length, 2) };
                    return a;
                }
            },
            lottype:function(){
                var o = [
                    {a: '和值', b: '奖金9-80元', c: 'pt_hz',d:[1,2,3] },
                    {a: '三同号', b: '奖金40-240元', c: 'pt_sth',d:[1,1,1]},
                    {a: '二同号', b: '奖金15-80元', c: 'pt_eth',d:[1,1,3]},
                    {a: '三不同号', b: '奖金10-40元', c: 'pt_sbth',d:[2,3,5]},
                    {a: '二不同号', b: '奖金8元', c: 'pt_ebth',d:[3,5] }
                ];
                return o;
            }
        }
    }])
    .factory('listcot', [function() {
        return {
            texts: function(a) {
                switch (a) {
                    case 3:
                        var textcot = "七星彩";
                        break;
                    case 4:
                        var textcot = "排列三";
                        break;
                    case 5:
                        var textcot = "排列五";
                        break;
                    case 6:
                        var textcot = "大乐透";
                        break;
                    case 7:
                        var textcot = "江西11选5";
                        break;
                    case 8:
                        var textcot = "山东11选5";
                        break;
                    case 9:
                        var textcot = "上海11选5";
                        break;
                    case 10:
                        var textcot = "浙江11选5";
                        break;
                }
                return textcot;
            },
            gold: function(a) {
                switch (a) {
                    case 3:
                        var goldn = ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖"];
                        break;
                    case 4:
                        var goldn = ["直选", "组三", "组六"];
                        break;
                    case 5:
                        var goldn = ["一等奖"];
                        break;
                    case 6:
                        var goldn = ["一等奖","一等奖-追加", "二等奖", "二等奖-追加", "三等奖-追加", "三等奖","四等奖-追加", "四等奖",  "五等奖-追加","五等奖", "六等奖"  ];
                        break;
                    case 11:
                        var goldn = ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖"];
                        break;
                    case 12:
                        var goldn = ["一等奖", "二等奖", "三等奖", "四等奖", "五等奖", "六等奖", "七等奖"];
                        break;
                    case 13:
                        var goldn = ["直选", "组三", "组六"];
                        break;
                }
                if (a >= 7 && a <= 10) {
                    var goldn = ["前二", "前二组选", "前三", "前三组选", "任选一", "任选二", "任选三", "任选四", "任选五", "任选六", "任选七", "任选八"];
                }
                return goldn;
            }
        }
    }])
    .factory('helpcontent', [function() {
        return {
            cot: function(a,b) {
                var listobj = [{
                    title: "充值提现",
                    nums:1,
                    cot: [
                        { question: "提现什么时候可以到账？", answer: "本平台暂时仅支持支付宝提现，提现时间以支付宝提示为准。在实名与账号相符、信息正确并且网络畅通的情况下，一般到账时间为10分钟内。" },
                        { question: "提现是否有限额？", answer: "本平台单次限额为100万元。" },
                        { question: "提现会收取手续费吗？", answer: "提现金额满100元免手续费，不足100元每笔收取1元手续费，每日不限提现次数。" },
                        { question: "提现失败怎么办？", answer: "请先确认您输入的支付宝账号和姓名是否有误，如果仍旧失败，请您拨打我们的客服电话咨询：0571-86981383。" },
                        { question: "提现时姓名与账户不符？", answer: "请耐心稍等一下，姓名与账户不符时，我们会将资金退回至您的账户余额内。" },
                        { question: "提现可以直接提到银行卡吗？", answer: "您可以提现到支付宝。本平台暂时不支持提现到银行卡，此项功能正在研发中，敬请期待。" }
                    ]
                },
                    {
                        title: "购彩兑奖",
                        nums:2,
                        cot: [
                            { question: "在销售时间外购买竞彩足球，什么时候出票？", answer: "竞彩足球的销售时间为：周一至周五 9:00—00:00，周六至周日 9:00—次日01：00，在销售时间外购买的彩票会在销售时间开始时陆续出票，请您耐心等待。" },
                            { question: "已到开奖时间为什么没有显示开奖？", answer: "平台获取数据需要一段时间，请耐心等待。" },
                            { question: "快彩的开奖信息不全？", answer: "获取数据时有一定的延时，请耐心等待。" },
                            { question: "如果中了大奖要如何领取？", answer: "在本平台您中奖金额≤1万时，奖金会直接派送到您的账户中，您可以直接操作提现。中奖金额＞1万时，本平台客服人员将会第一时间电话联系您，您可以在本平台人员陪同下亲自领取，也可以授权本平台为您代领奖金，然后派奖到您的账户中。。" },
                            { question: "什么时候开奖？", answer: "在官方开奖后本平台会在第一时间进行开奖，如果您对开奖有任何疑问，可以拨打我们的客服电话咨询：0571-86981383。" },
                            { question: "提取走势数据失败（走势图获开奖信息获取失败）？", answer: "请您拨打我们的客服电话咨询：0571-86981383。" },
                            { question: "开奖后多久会派奖？", answer: "在官方开奖后本平台会在一定时间内进行派奖，如果您对派奖有任何疑问，可以拨打我们的客服电话咨询：0571-86981383。" },
                            { question: "什么是追号？", answer: "预定您看好的一注或一组号码，连续购买几十或上百期，这样可以预防在某一期忘记购彩，而错过中奖。" },
                            { question: "什么是胆拖？", answer: "在购买高频彩和数字彩时选出一个或几个号码为胆码，固定以这一个或几个号码与其他号码分别组成单式或者复式号码进行投注，固定不变的号码为胆码，其他变化的号码为拖码，简称胆拖。" },
                            { question: "奖金如何扣税？", answer: "根据国家相关规定，中奖彩票单注奖金超过1万元时，中奖人需要交纳奖金的20%作为个人所得税，税金由彩票中心代扣代缴，本平台派发到账户内的奖金是根据国家相关规定自动扣除个人所得税后的金额。" }
                        ]
                    },
                    {
                        title: "账号安全",
                        nums:3,
                        cot: [
                            { question: "你们的平台正规吗？可以保证我的资金安全吗？", answer: "本平台会保证您的资金安全，如果您对资金有任何疑问，可以拨打我们的客服电话咨询：0571-86981383。" },
                            { question: "如何提高账户的安全性？", answer: "在设置密码时有如下建议：（1）组成密码的字符最好在8位以上，字符内容包含大写字母、小写字母和数字。（2）不用常用字符，常用字符包括生日，学号，身份证号，这些字符容易被猜到并被破解。" },
                            { question: "账号是否可以注销？", answer: "不支持注销账户，本平台会保留您的账户记录，方便您的下次登录。" },
                            { question: "如何找回密码？", answer: "点击个人中心----点击登录----点击忘记密码----输入您注册的手机号，再输入您所获取的验证码----设置您的新密码。" }
                        ]
                    },
                    {
                        title: "注册登录",
                        nums:4,
                        cot: [
                            { question: "注册账号可以修改吗？", answer: "注册账号不支持修改。" },
                            { question: "登录时忘记账号用户名怎么办？", answer: "可能是网络或地域的问题，会造成验证信息存在延时，请您耐心等待。如果读秒完成后再次重试失败，您可以拨打我们的客服电话咨询：  0571-86981383。" }
                        ]
                    },
                ];
                if(a==undefined || b==undefined) return listobj;
                else {
                    return listobj[a].cot[b];
                }
            }

        }
    }])

    // 选择提示语
    .factory('prompts', [function() {
        return {
            textord: function(a, ary) {
                var texts="";
                if (a == 6) {
                    m = 5;
                    n = 2;
                }
                if (a == 11) {
                    m = 6;
                    n = 1;
                }
                if (a == 12) {
                    m = 7;
                    n = 0;
                }
                if (ary[0].length >= 0 && ary[0].length < m) {
                    if (a == 12)  texts = "请至少选择" + m + "个号码";
                    else  texts = "请至少选择" + m + "个红球";
                    return texts;
                }else if (ary[1].length >= 0 && ary[1].length < n) {
                    texts = "请至少选择" + n + "个蓝球";
                    return texts;
                }else return texts;

            },
            textdan: function(a, ary) {
                var texts = "";
                if (a == 6) {
                    if (ary[0].length <= 0) {
                        texts = "请至少选择1个前区胆码";
                    } else if (ary[2].length < 2) {
                        texts = "请至少选择2个前区拖码";
                    } else if (ary[0].length + ary[2].length < 6) {
                        texts = "请至少选择6个前区号码";
                    } else if (ary[3].length < 2) {
                        texts = "请至少选择2个后区拖码";
                    }

                }
                if (a == 11) {
                    if (ary[0].length <= 0) {
                        texts = "请至少选择1个胆码区红球";
                    } else if (ary[2].length < 1) {
                        texts = "请至少选择2个胆码区红球";
                    } else if (ary[0].length + ary[2].length <7) {
                        texts = "请至少选择7个红球";
                    } else if (ary[1].length < 1) {
                        texts = "请至少选择1个拖码区蓝球";
                    }
                }
                if (a == 12) {
                    if (ary[0].length <= 0) {
                        texts = "请至少选择1个胆码";
                    } else if (ary[2].length < 2) {
                        texts = "请至少选择2个拖码";
                    } else if(ary[0].length +ary[1].length <8 ){
                        texts = "胆码和拖码之和至少为8个";
                    }

                }
                return texts
            }
        }
    }])
