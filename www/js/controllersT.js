angular.module('starter.controllersT', [])


    //开奖信息列表
    .controller('LotterylistCtrl', ['HttpStatus', '$scope', '$ionicHistory', '$http', 'ApiEndpoint', '$ionicLoading', '$state', 'UserInfo', function(HttpStatus, $scope, $ionicHistory, $http, ApiEndpoint, $ionicLoading, $state, UserInfo) {
        /*var obj = {
         slide: document.querySelector(".slide"),
         slideBox: document.querySelector('.slide-box'),
         sMain: document.querySelectorAll('.sMain'),
         sItem: document.querySelector('.slide-item').querySelectorAll('li'),
         img: document.querySelector('.sMain').querySelectorAll("img"),
         item: 0,
         time: 5000,
         switch: true
         };
         huadong.Slider(obj);*/
        $scope.ary = {};
        $scope.dopost = function() {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/trade/resultlist",
                data: {
                    token: UserInfo.l.token || ''
                }
            }).success(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    if (data.data == "") {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        dataProcessing(data.data);
                    }

                }
            }).error(function(data) {
                showAlertMsg.showMsgFun('提示', '网络连接失败！');
            });
        }
        $scope.dopost();
        var dataProcessing = function(ary) {
            for (var i = 0; i < ary.length; i++) {
                $scope.ary[ary[i].gid] = {};
                $scope.ary[ary[i].gid].acode = ary[i].acode.split(',');
                if(ary[i].sjh){
                     $scope.ary[ary[i].gid].sjh = ary[i].sjh.split(',');
                }
               
                $scope.ary[ary[i].gid].pid = ary[i].pid;
                $scope.ary[ary[i].gid].atime = ary[i].atime;
            }
        }
        $scope.refreshAry = function() {
            $scope.dopost();
            // $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');

        }
        $scope.goLotteryzq = function(t) {
            $state.go('practice.Lottery', { type: t });
        }
        $scope.godetails = function(a) {
            $state.go('practice.lot-details', { type: a });
        }
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
    }])

    //七星彩 & 排列五
    .controller('lotteryseven', ['showAlertMsg', '$ionicLoading', '$scope', '$stateParams', '$state', 'qxc', 'ApiEndpoint', 'MathRnum', '$http', 'UserInfo', 'PayFlow', 'HttpStatus', '$ionicScrollDelegate', '$ionicPopup', function(showAlertMsg,$ionicLoading, $scope, $stateParams, $state, qxc, ApiEndpoint, MathRnum, $http, UserInfo, PayFlow, HttpStatus, $ionicScrollDelegate, $ionicPopup) {
        var max = 9,
            mix = 0;

        $scope.type = $stateParams.type;
        $scope.postobj = {
            betcount: 1,
            betjson: "",
            doublecount: 1,
            money: 0,
            token: UserInfo.l.token || '',
            type: 3
        }
        if ($scope.type == 5) {
            $scope.nums = 5;
            $scope.typeflag = false;
            $scope.nameary = ["万", "千", "百", "十", "个"];
            $scope.titlehtml = "排列五";
            $scope.postobj.type = 5;
        }
        if ($scope.type == 3) {
            $scope.nums = 7;
            $scope.typeflag = true;

            $scope.titlehtml = "七星彩";
            $scope.postobj.type = 3;
        }

        $http({
            method: 'post',
            url: ApiEndpoint.url + "/trade/lotteryinfo",
            data: {
                token: UserInfo.l.token || '',
                type: $scope.postobj.type
            }
        }).success(function(data) {
            if (data.status == 1) {
                $scope.nOrder = data.data;
                $scope.rAry = data.data.rowsp;
                $scope.ntime = $scope.nOrder.stime.split(",");
                $scope.dispose($scope.rAry[0].acode,data.data.rowsm)
            }
        }).error(function(data) {
            showAlertMsg.showMsgFun('提示', '网络连接失败！');


        });

        // 遗漏值处理 
        $scope.dispose=function (a,b){
            // $scope.nums = 7;
            a=a.split(',');
            b=(b.split(',')).splice(1);
            c=[];
            for (var x =0 ;x<a.length;x++){ 
                c[x]=b.slice(x*10,(x+1)*10);
                 //console.log(c[x])
                for (var y in c[x]){
                    if (c[x][y]==a[x] && c[x][y]==y) c[x][y]="0";
                }
            }
            $scope.omit=c;
            $scope.missflag=true;
            // console.log($scope.omit)
        }
        //助手
        $scope.assistants = function(e) {
            switch (e) {
                case 1:
                    $state.go('practice.detaillist', { type: $scope.type });
                    break;
                case 2:
                    $state.go('practice.play-About', { type: $scope.type });
                    break;
                case 3:
                    $state.go('practice.lot-details', { type: $scope.type });
                    break;
                default:
                    break;
            }
            $scope.assistantShow = !$scope.assistantShow;
        }
        $scope.choosenums = false;
        $scope.flag = false; //投注是否正常
        $scope.aryb = [];
        $scope.ary = [];
        $scope.missflag = true;


        $scope.assistantShow = false;
        $scope.cathNum = 1; //追期数
        $scope.playWay = 1; //玩法方式
        $scope.betWat = 1; //投注方式


        $scope.arys = new Array;
        for (var i = 0; i < 9; i++) {
            $scope.arys[i] = i;
            $scope.arys[i] = new Array;
            $scope.arys[i] = MathRnum.repeatNum(9, $scope.nums);
        }
        for (var i = mix; i <= max; i++) $scope.aryb.push(i);
        for (var i = mix; i <= $scope.nums - 1; i++) $scope.ary[i] = [];

        // 数字点击反馈
        $scope.tempfalg = true;
        $scope.sar = function(a, b) {
            var c = a * 10 + b;
            if ($scope.tempfalg) {
                $('.sccl-r li .temp_li').eq(c).toggleClass("a_class");
                var flag = $('.sccl-r li .temp_li').eq(c).hasClass('a_class');
                if (!flag) {
                    $scope.ary[a].splice($scope.ary[a].indexOf(b), 1);
                } else if ($scope.ary[a] == undefined) {
                    $scope.ary[a] = [];
                    $scope.ary[a][0] = b;
                } else {
                    $scope.ary[a].push(b);
                }
                $scope.statuValue($scope.ary);
            }
        }
        // 数字点击 离开
        $scope.fangdahidea = function(a, b) {
            var c = a * 10 + b;
            $('.sccl-r li .temp_li .scclr-big').eq(c).hide();
            $scope.sar(a, b)
        }
        // 数字点击 滑动
        $scope.fangdahideb = function(a, b) {
            var c = a * 10 + b;
            $('.sccl-r li .temp_li .scclr-big').eq(c).hide();
            $scope.tempfalg = false;
        }
        // 数字点击 点击
        $scope.numclick = function(a, b) {
            var c = a * 10 + b;
             // console.log(a,b)
            $('.sccl-r li .temp_li .scclr-big').eq(c).show();
            $scope.tempfalg = true;
        }
        // 状态值
        $scope.statuValue = function(ary) {
            var ns = qxc.countNuma(ary);
            if (ns != "") $scope.flag = true;
            else $scope.flag = false;

            $scope.ending = ns;
        }
        //摇一摇
        $scope.shake = function() {
            $('.sccl-r li .temp_li').removeClass("a_class");
            var reary = MathRnum.repeatNum(max, $scope.nums);
            for (var x in reary) {
                $scope.ary[x] = [];
                $scope.ary[x].push(reary[x]);
                m = reary[x] + x * 10;
                $('.sccl-r li .temp_li').eq(m).addClass("a_class");
            }
            $scope.statuValue($scope.ary);
        }
        // 返回
        $scope.assistant = function() {
            $scope.assistantShow = !$scope.assistantShow;
        }
        $scope.backGo = function() {
            var history = window.localStorage.historybet;
            if (history != undefined) {
                var tempary = JSON.parse(history)
                 //console.log(tempary)
            }            

            if ((history == undefined || tempary.nums == "") && $scope.flag == false) {
                $state.go('tab.hall');
            } else {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '返回将清空所有已选号码？',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        window.localStorage.removeItem("historybet");
                        $state.go('tab.hall');
                    } else {}
                });
            }
        }
        $scope.randomss = function() {
            $scope.choosenums = !$scope.choosenums;
        }
        // 选择清除
        $scope.deleteary = function() {
            $('.sccl-r li .temp_li').removeClass("a_class");
            for (var i = mix; i <= $scope.nums - 1; i++) $scope.ary[i] = [];
            $scope.flag = false;
        }
        // 切换 （下拉）
        $scope.cotchange = function() {
            $('.seven-cot').toggleClass('s-cot-t');
            $('.sch-f-a img').toggleClass('sch-f-j').toggleClass('sch-f-i');
            $('.sch-f-a').toggleClass('schf-a-top');
        }
        /*            //  上滚
        $scope.scrollup = function() {
                $('.seven-cot').removeClass('s-cot-t');
                $('.sch-f-a img').removeClass('sch-f-i').addClass('sch-f-i')
                $('.sch-f-a').removeClass('schf-a-top');
                // $ionicScrollDelegate.scrollTop()
                //助手
            }
            //  下滚
        $scope.scrolldown = function() {
                var obj = $ionicScrollDelegate.getScrollPosition();
                if (obj.top == 0) {
                    $('.seven-cot').addClass('s-cot-t');
                    $('.sch-f-a img').removeClass('sch-f-i').addClass('sch-f-i');
                    $('.sch-f-a').addClass('schf-a-top');
                }
            }*/
        // 遗漏miss
        $scope.miss = function() {
            $scope.missflag = false;
        }
        // 走势图链接
        $scope.zstopen = function() {
            $state.go('practice.trendchar', { type: $scope.postobj.type });
        }
        // 请求发送
        $scope.postget = function() {
            if (!$scope.flag) {
                //console.log(1111)
                $scope.shake();
                return true
            } else if ($scope.flag) {
                $scope.postobj.betjson = "1|" + qxc.Mosaicchar($scope.ary);
                $scope.postobj.money = qxc.countNuma($scope.ary) * 2;
                var obj = {
                    type: $scope.postobj.type,
                    nums: $scope.ary
                }
                window.localStorage.qxcjson = JSON.stringify(obj);
                $scope.Confirm();
            }
        }

        $scope.Confirm = function() {
            //登录验证
            if (!UserInfo.l.flag) {
                $state.go('user.login', { type: $scope.type });
                return false;
            }
            $ionicLoading.show({ content: 'Loading', duration: 30000 });
            $http({
                method: 'post',
                url: ApiEndpoint.url + '/usr/myinfo',
                data: {
                    token: UserInfo.l.token
                },
            }).success(function(data) {
                $ionicLoading.hide();
                if (data.status == '1') {
                    if ($scope.ending > 10000) {
                        showAlertMsg.showMsgFun('提示', '单个投注方案不能超过10000注!');
                        return false;
                    }
                    UserInfo.save(data.data);
                    $state.go('betinfo.newBet', { type: $scope.type });
                } else if (data.status == '100') {
                    $state.go('user.login', { type: $scope.type });
                }
            })
        }
        // 机选注数
        $scope.rdnums = function(a) {
            window.localStorage.removeItem("jxfalg");
            $scope.choosenums = !$scope.choosenums;
            $state.go('betinfo.newBet', { type: $scope.postobj.type, nums: a });

        }
    }])
    //大乐透 & 双色球 & 七乐彩 
    .controller('lotterysuper', ['prompts', 'HttpStatus', '$ionicLoading', 'showAlertMsg', '$scope', '$stateParams', '$state', 'qxc', 'ApiEndpoint', 'MathRnum', '$http', 'UserInfo', 'PayFlow', 'HttpStatus', '$ionicScrollDelegate', 'cAp', '$ionicPopup', function(prompts, HttpStatus, $ionicLoading, showAlertMsg, $scope, $stateParams, $state, qxc, ApiEndpoint, MathRnum, $http, UserInfo, PayFlow, HttpStatus, $ionicScrollDelegate, cAp, $ionicPopup) {

        $scope.Bankerbetflag = false;
        $scope.title = "普通投注"; //  玩法类
        $scope.ShlistHeght = false; //  弹出框状态
        $scope.chooseflag=false;
        $scope.superflag = $stateParams.flag;
        if ($scope.superflag == "true") {
            $scope.Bankerbetflag = true;
            $scope.title = "胆拖投注";
            $scope.chooseflag=true;
        }
        $scope.postobj = {
            betcount: 1, //投注数
            betjson: "", //彩种ID对应的投注描述
            doublecount: 1, //翻倍数
            money: 0, //投注金额
            token: UserInfo.l.token || '', //用户令牌
            type: 6 //彩种类型
        };
        $scope.postobj.type = $stateParams.type;

        if ($scope.postobj.type == 6) {
            $scope.max = 35;
            $scope.numsa = 5;
            $scope.min = 12;
            $scope.numsb = 2;
            $scope.lotcot = "大乐透";
            $scope.scot = "请至少选择5个红球,2个蓝球";
        }
        if ($scope.postobj.type == 11) {
            $scope.max = 33;
            $scope.numsa = 6;
            $scope.min = 16;
            $scope.numsb = 1;
            $scope.lotcot = "双色球";
            $scope.scot = "请至少选择6个红球,1个蓝球";
        }
        if ($scope.postobj.type == 12) {
            $scope.max = 30;
            $scope.numsa = 7;
            $scope.min = 0;
            $scope.numsb = 0;
            $scope.lotcot = "七乐彩";
            $scope.scot = "请至少选择7个号码";
        }

        $scope.choosenums = false;
        $scope.arya = [];
        $scope.aryb = [];
        $scope.ary = [];
        for (var i = 0; i <= 3; i++) {
            $scope.ary[i] = [];
        }

        $scope.assistantShow = false;
        $scope.cathNum = 1; //追期数
        $scope.playWay = 1; //玩法方式

        $scope.arys = new Array;
        for (var i = 0; i < 9; i++) {
            $scope.arys[i] = new Array;
            $scope.arys[i][0] = MathRnum.norepeatNum($scope.max, $scope.numsa, 1).sort(function(a, b) {
                return a - b;
            });
            if ($scope.min != 0) {
                $scope.arys[i][1] = MathRnum.norepeatNum($scope.min, $scope.numsb, 1).sort(function(a, b) {
                    return a - b;
                });
            }
        }
        // 数字 变两位
        Prefix = function(num) {
            return (Array(2).join(0) + num).slice(-2);
        }
        for (var i = 1; i <= $scope.max; i++) $scope.arya.push(Prefix(i));
        for (var i = 1; i <= $scope.min; i++) $scope.aryb.push(Prefix(i));

        $http({
            method: 'post',
            url: ApiEndpoint.url + "/trade/lotteryinfo",
            data: {
                token: UserInfo.l.token || '',
                type: $scope.postobj.type
            }
        }).success(function(data) {
            if (data.status == 1) {
                $scope.nOrder = data.data;
                $scope.rAry = data.data.rowsp;
                $scope.ntime = $scope.nOrder.stime.split(",");
                $scope.dispose($scope.rAry[0].acode,data.data.rowsm)
            }
        }).error(function(data) {
            showAlertMsg.showMsgFun('提示', '网络连接失败！', '');
        });
        $scope.Shlistlist = function(a) {
            if (a) {
                $scope.Bankerbetflag = true;
                $scope.title = "胆拖投注";
            } else {
                $scope.Bankerbetflag = false;
                $scope.title = "普通投注";
            }
            $scope.ending = undefined;
            if($scope.Bankerbetflag) $scope.chooseflag=true;
            else $scope.chooseflag=false;
        }
        $scope.Shlist = function(a) {
            $scope.ShlistHeght = !$scope.ShlistHeght;
        }

        // 遗漏值处理 
        $scope.dispose=function (a,b){
            // $scope.nums = 7;
            a=a.split(',');
            if ($scope.postobj.type == 12){
                a=a.splice(0,7)
            }
            b=(b.split(',')).splice(1);
            $scope.omit={};
            $scope.omit.a=b.slice(0,$scope.max);
            for (var x in $scope.omit.a){
                for (var y in a){
                    if (a[y]*1==$scope.omit.a[x]*1 && $scope.omit.a[x]*1==x*1+1) $scope.omit.a[x]="0";
                }
            }

            if($scope.min!=0){
            $scope.omit.b=b.slice($scope.max,$scope.max+$scope.min);
            for(var x in $scope.omit.b){
                if ((a[a.length-1]*1==$scope.omit.b[x]*1 || a[a.length-2]*1==$scope.omit.b[x]*1) && $scope.omit.b[x]*1==x*1+1 && $scope.postobj.type == 6) $scope.omit.b[x]="0";
                if (a[a.length-1]*1==$scope.omit.b[x]*1 && $scope.omit.b[x]*1==x*1+1 && $scope.postobj.type == 11 ) $scope.omit.b[x]="0";
            }
        }

            $scope.missflag=true;
            //console.log($scope.omit)
        }

        //结果计算
        $scope.resultcal = function() {
            if ($scope.Bankerbetflag) {
                // console.log($scope.ary)
                var a = $scope.ary[0].length =undefined ? 0:$scope.ary[0].length;
                var b = $scope.ary[1].length =undefined ? 0:$scope.ary[1].length;
                var c = $scope.ary[2].length =undefined ? 0:$scope.ary[2].length;
                var d = $scope.ary[3].length =undefined ? 0:$scope.ary[3].length;
                if (a >= 1 && a <= 4 && c >= 2 && b <= 1 && d >= 2 && a + c >= 6 && $scope.postobj.type == 6) {
                    $scope.ending = cAp.comNumber(c, $scope.numsa - a) * cAp.comNumber(d, $scope.numsb - b);
                } else if (a >= 1 && a <= 5 && c >= 2 && b >= 1 && a + c >= 7 && $scope.postobj.type == 11) {
                    $scope.ending = cAp.comNumber(c, $scope.numsa - a) * cAp.comNumber(b, 1);
                } else if ( a >= 1 && a <= 6 && c >= 2  && a + c >= 8 && $scope.postobj.type == 12) {
                    $scope.ending = cAp.comNumber(c, $scope.numsa - a);
                } else $scope.ending = undefined;

            } else {
                $scope.ary[0] = [];
                $scope.ary[1] = []
                for (var m = 0; m < $scope.max; m++) {
                    var flag = $('.slc-ca li .temp_li').eq(m).hasClass('a_class');
                    if (flag) $scope.ary[0].push(m + 1);
                }
                for (var m = $scope.max; m <= $scope.max + $scope.min; m++) {
                    var flag = $('.slc-ca li .temp_li').eq(m).hasClass('sc-activeb');
                    if (flag) $scope.ary[1].push(m - $scope.max + 1);
                }
                var m = $scope.ary[0].length;
                var n = $scope.ary[1].length;
                if (m >= $scope.numsa && n >= $scope.numsb) $scope.ending = cAp.comNumber(m, $scope.numsa) * cAp.comNumber(n, $scope.numsb);
                else $scope.ending = undefined;
            } 
            if($scope.ary[0]!='' || $scope.ary[1]!='') $scope.chooseflag=true;
            else if($scope.Bankerbetflag) $scope.chooseflag=true;
            else $scope.chooseflag=false;

        }
        // 机选&清除
        $scope.choose=function(a){
            if (a==0) {
                if ($scope.ending !=undefined) return true;
                if ($scope.Bankerbetflag==true) return false;
            }
            if(a==1){
                if ($scope.Bankerbetflag==true) return true;   

            }
        }

        // 数字点击反馈
        $scope.feedback = function(a, b, c, e) {
            a = parseInt(a);
            if ($scope.tempfalg) {
                if ($scope.Bankerbetflag) {
                    if (b == 0) {
                        if (c == 0 && ($scope.ary[0].length < $scope.numsa - 1 || $scope.ary[0].indexOf(a) >= 0)) {
                            var b = a + $scope.max - 1;
                            var flag = $('.temp_lia').eq(b).hasClass("a_class");
                            if (flag) { $('.temp_lia').eq(b).toggleClass("a_class"); }
                            $(e).toggleClass("a_class");
                        }
                        if (c == 1) {
                            var b = a - 1;
                            var flag = $('.temp_lia').eq(b).hasClass("a_class");
                            if (flag) { $('.temp_lia').eq(b).toggleClass("a_class"); }
                            $(e).toggleClass("a_class");
                        }

                        for (var i = 0; i <= 2; i += 2) {
                            $scope.ary[i] = [];
                            for (var m = 0; m <= $scope.max - 1; m++) {
                                var temp = m + ($scope.max * i) / 2;
                                var flag = $('.temp_lia ').eq(temp).hasClass('a_class');
                                if (flag) $scope.ary[i].push(m + 1);
                            }
                        }

                    } else {
                        if (c == 0 && ($scope.ary[1].length < 1 || $scope.ary[1].indexOf(a) >= 0) && $scope.postobj.type == 6) {
                            var b = a + $scope.min;
                            var flag = $('.temp_lib').eq(b).hasClass("sc-activeb");
                            if (flag) { $('.temp_lib').eq(b).toggleClass("sc-activeb"); }
                            $(e).toggleClass("sc-activeb");
                        }
                        if (c == 0 && $scope.postobj.type == 11) {
                            $(e).toggleClass("sc-activeb");
                        }
                        if (c == 1) {
                            var b = a - 1;
                            var flag = $('.temp_lib').eq(b).hasClass("sc-activeb");
                            if (flag) { $('.temp_lib').eq(b).toggleClass("sc-activeb"); }
                            $(e).toggleClass("sc-activeb");
                        }
                        if ($scope.postobj.type == 6) {
                            for (var i = 1; i <= 3; i += 2) {
                                $scope.ary[i] = [];
                                for (var n = 0; n <= $scope.min - 1; n++) {
                                    var temp = n + (6 * (i - 1));
                                    var flag = $('.temp_lib').eq(temp).hasClass("sc-activeb");
                                    if (flag) $scope.ary[i].push(n + 1);
                                }
                            }
                        } else {
                            $scope.ary[1] = [];
                            for (var n = 0; n < $scope.min; n++) {
                                var flag = $('.temp_lib').eq(n).hasClass("sc-activeb");
                                if (flag) $scope.ary[1].push(n + 1);
                            }
                        }


                    }
                    $scope.resultcal();
                } else {
                    if (c == 1) $(e).toggleClass("sc-activeb");
                    else $(e).toggleClass("a_class");
                    //  calculate the result
                    $scope.resultcal();
                }
                if ($scope.Bankerbetflag) {
                    $scope.playWay = 5;
                } else if ($scope.ending > 1) {
                    $scope.playWay = 2;
                } else {
                    $scope.playWay = 1;
                }
            }
        }
        // 数字点击 离开
        $scope.fangdahidea = function(a, b, c, e) {
            e = event.target;
            $(e).find('.scclr-big').hide();
            $scope.feedback(a, b, c, e)
        }
        // 数字点击 滑动
        $scope.fangdahideb = function(e) {
            e = event.target;
            $(e).find('.scclr-big').hide();
            $scope.tempfalg = false;
        }
        // 数字点击 点击
        $scope.numclick = function(a, b, c) {
            e = event.target;
            $(e).find('.scclr-big').show();
            $scope.tempfalg = true;
        }


        // 摇一摇
        $scope.shake = function() {
            $('.slc-ca li .temp_li').removeClass("a_class").removeClass("sc-activeb");
            var redary = MathRnum.norepeatNum($scope.max, $scope.numsa, 1);
            $scope.ary[0] = [];
            for (var x in redary) {
                $scope.ary[0].push(redary[x]);
                m = redary[x] - 1;
                $('.slc-ca li .temp_li').eq(m).addClass("a_class");
            }
            if ($scope.min != 0) {
                $scope.ary[1] = [];
                var lanary = MathRnum.norepeatNum($scope.min, $scope.numsb, 1);
                for (var x in lanary) {
                    $scope.ary[1].push(lanary[x]);
                    m = lanary[x] - 1 + $scope.max;
                    $('.slc-ca li .temp_li').eq(m).addClass("sc-activeb");
                }
            }

            $scope.tempfalg = true;
            $scope.feedback();
        }
        // 助手隐藏
        $scope.assistant = function() {
            $scope.assistantShow = !$scope.assistantShow;
        }
        // 返回
        $scope.backGo = function() {

            var history = window.localStorage.historybet;
            if (history != undefined) {
                var tempary = JSON.parse(history)
            }  
            if ((history == undefined || tempary.nums == "") && $scope.ending == undefined) {
                $state.go('tab.hall');
            }else {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '返回将清空所有已选号码？',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        window.localStorage.removeItem("historybet");
                        $state.go('tab.hall');
                    } else {}
                });
            }
        }
        // 助手
        $scope.assistant = function(e) {
            switch (e) {
                case 1:
                    $state.go('practice.detaillist', { type: $scope.postobj.type });
                    break;
                case 2:
                    $state.go('practice.play-About', { type: $scope.postobj.type });
                    break;
                case 3:
                    $state.go('practice.lot-details', { type: $scope.postobj.type });
                    break;
                default:
                    break;
            }
            $scope.assistantShow = !$scope.assistantShow;
        }
        // 机选
        $scope.randomss = function() {
            $scope.choosenums = !$scope.choosenums;
        }
        // 选择清除
        $scope.deleteary = function() {
            $('.slc-ca li div').removeClass("a_class").removeClass("sc-activeb");
            for (var i = 0; i <= $scope.ary.length - 1; i++) $scope.ary[i] = [];
            $scope.ending = undefined;
            if($scope.Bankerbetflag) $scope.chooseflag=true;
            else $scope.chooseflag=false;
        }

        // 切换 （下拉）
        $scope.cotchange = function() {
            $('.seven-cot').toggleClass('s-cot-t');
            $('.sch-f-a img').toggleClass('sch-f-j').toggleClass('sch-f-i');
            $('.sch-f-a').toggleClass('schf-a-top');
        }
        //  上滚
            // $scope.scrollup = function() {
            //         $('.seven-cot').removeClass('s-cot-t');
            //         $('.sch-f-a img').removeClass('sch-f-i').addClass('sch-f-i')
            //         $('.sch-f-a').removeClass('schf-a-top');
            //         // $ionicScrollDelegate.scrollTop()
            //      }
            //     //  下滚
            // $scope.scrolldown = function() {
            //     var obj = $ionicScrollDelegate.getScrollPosition();
            //     if (obj.top == 0) {
            //         $('.seven-cot').addClass('s-cot-t');
            //         $('.sch-f-a img').removeClass('sch-f-i').addClass('sch-f-i');
            //         $('.sch-f-a').addClass('schf-a-top');
            //     }
            //  }
            // 走势图链接
        $scope.zstopen = function() {
            $state.go('practice.supertrend', { type: $scope.postobj.type });
        }

        //  字符串
        $scope.addmacs = function(ary) {
            var str = "";
            var tempary = [];
            for (var x in ary) {
                if (ary[x].length > 0) {
                    tempary[x] = ary[x].join(",");
                }
            }
            if ($scope.Bankerbetflag) {
                if (tempary[1] === undefined && tempary[3] == undefined) {
                    return tempary[0] + "$" + tempary[2];
                } else if (tempary[1] === undefined) {
                    return tempary[0] + "$" + tempary[2] + "@$" + tempary[3];
                } else if (tempary[3] == undefined) {
                    return tempary[0] + "$" + tempary[2] + "@" + tempary[1];
                } else {
                    return tempary[0] + "$" + tempary[2] + "@" + tempary[1] + "$" + tempary[3];
                }
            } else { 
                if(tempary[1]==undefined){
                    return tempary[0];
                }else   return tempary[0] + "@" + tempary[1];
            }
        }
        // 请求发送
        $scope.postget = function() {
            // console.log($scope.postobj.type, $scope.Bankerbetflag)
            // if ($scope.postobj.type != 6) {
            //     showAlertMsg.showMsgFun('提示', "该彩种  暂停销售");
            //     return true
            // }
            if (!$scope.Bankerbetflag) {
                if ($scope.ary[0].length == 0 && $scope.ary[1].length == 0) {
                    $scope.shake();
                    return true
                }
                var texts = prompts.textord($scope.postobj.type, $scope.ary);

                if (texts != "") {
                    showAlertMsg.showMsgFun('提示', texts, 'PostAddUser');
                    return true
                }
            } else {
                if ($scope.ending == undefined) {
                    var texts = prompts.textdan($scope.postobj.type, $scope.ary);
                    showAlertMsg.showMsgFun('提示', texts, 'PostAddUser');
                    return false;
                }
            }

            if ($scope.ending != undefined) {
                var temp = $scope.addmacs($scope.ary);
                $scope.feedback();
                $scope.postobj.betjson = "1|" + temp + ":1:" + $scope.playWay + ";";
                $scope.postobj.money = $scope.ending * 2;
                if (!$scope.Bankerbetflag) { 
                    $scope.ary.splice(2, 2);
                }
                var obj = {
                    type: $scope.postobj.type,
                    nums: $scope.ary
                }
                window.localStorage.qxcjson = JSON.stringify(obj);
                $scope.Confirm();
            }
        }
        //登录验证
        $scope.Confirm = function() {     
            if (!UserInfo.l.flag) {
                $state.go('user.login', { type: $scope.postobj.type });
                return false;
            }
            $ionicLoading.show({ content: 'Loading', duration: 30000 });
            $http({
                method: 'post',
                url: ApiEndpoint.url + '/usr/myinfo',
                data: {
                    token: UserInfo.l.token
                },
            }).success(function(data) {
                $ionicLoading.hide();
                if (data.status == '1') {
                    UserInfo.save(data.data);
                    if($scope.ending>10000) {
                        showAlertMsg.showMsgFun('提示', '单个投注方案不能超过10000注!');  
                        return false;
                    }
                    $state.go('betinfo.newBet', { type: $scope.postobj.type, id: $scope.Bankerbetflag });
                } else if (data.status == '100') {
                    $state.go('user.login', { type: $scope.postobj.type });
                }
            })
        }
        // 机选注数
        $scope.rdnums = function(a) {
            window.localStorage.removeItem("jxfalg");
            $state.go('betinfo.newBet', { type: $scope.postobj.type, nums: a, id: $scope.Bankerbetflag });
            $scope.choosenums = !$scope.choosenums;
        }
    }])
    // 走势图（排列五/七星彩/排列三/福彩3D）
    .controller('trendchar', ['$ionicLoading', '$timeout', 'Trend', '$scope', '$state', '$stateParams', '$ionicSlideBoxDelegate', 'MathRnum', '$http', 'ApiEndpoint', 'UserInfo', 'PayFlow', 'HttpStatus', function($ionicLoading, $timeout, Trend, $scope, $state, $stateParams, $ionicSlideBoxDelegate, MathRnum, $http, ApiEndpoint, UserInfo, PayFlow, HttpStatus) {
        $scope.aryb = [];
        $scope.aryindex = 0;
        $scope.type = $stateParams.type;
        $scope.falg = true;
        $scope.Elevenflag = false;
        $scope.threeflag = false;
        $scope.assistantShow = false; //  设置
        var max = 9;
        var middlenums = 4;
        var min = 0;
        $scope.tempfalg = false;
        $scope.pagebfalg = false;
        $scope.pagecfalg = false;
        $scope.corner = "{{y}}<i>2<i>";
        $scope.corners = "{{y}}";
        switch (parseInt($scope.type)) {
            case 3:
                nums = 7;
                $scope.counts = 7;
                $scope.titlehtml = "七星彩";
                break;
            case 4:
                nums = 3;
                $scope.titlehtml = "排列三";
                $scope.falg = false;
                $scope.threeflag = true;
                break;
            case 13:
                nums = 3;
                $scope.titlehtml = "福彩3D";
                $scope.falg = false;
                $scope.threeflag = true;
                break;
            case 5:
                nums = 5;
                $scope.counts = 5;
                $scope.titlehtml = "排列五";
                break;
            case 7:
                $scope.titlehtml = "江西11选5";
                break;
            case 8:
                $scope.titlehtml = "山东11选5";
                break;
            case 9:
                $scope.titlehtml = "上海11选5";
                break;
            case 10:
                $scope.titlehtml = "浙江11选5";
                break;
        }

        if ($scope.type >= 7 && $scope.type <= 10) {
            nums = 5;
            max = 11;
            $scope.counts = 5;
            middlenums = 5;
            min = 1;
            $scope.Elevenflag = true;
            $scope.falg = false;
        }

        $scope.listnum = 30; //  统计期数
        $scope.countflag = true; //  统计状态
        $scope.aryorder = false; //  正序逆序
        var _tempObj = new Object;

        $scope.doPost = function(order) {
            $ionicLoading.show({ content: 'Loading', duration: 30000 })
            var obj = {
                count: $scope.listnum,
                token: UserInfo.l.token || '',
                type: $scope.type
            }
            Trend.trends(obj).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    dataProcessing(data.data, order);

                }
            })
        }

        var dataProcessing = function(a, b) {
            $scope.u = a.acodes; //期次
            $scope.alls = a.acodes; //中奖号码、期次、大小比、奇偶比等等...
            $scope.y = a.yltj; //遗漏统计

            $scope.ylz = []; //遗漏统计
            $scope.a = []; //中奖号码

            for (var x in a.yltj.ylcode) {
                $scope.ylz[x] = arrayMp(a.yltj.ylcode[x]);
                $scope.a[x] = a.acodes[x].acode.split(',');
            }

            $scope.cxs = arrayMp(a.yltj.cxcs); //出现次数
            $scope.jyl = arrayMp(a.yltj.pjyl); //平均遗漏
            $scope.zyl = arrayMp(a.yltj.zdyl); //最大遗漏
            $scope.zlc = arrayMp(a.yltj.zdlc); //最大连出

            $scope.allscp = $.extend(true, [], $scope.alls);
            $scope.ylcp = $.extend(true, [], $scope.ylz);
            $scope.acp = $.extend(true, [], $scope.a);

            if (b == undefined) {
                if ($scope.aryorder == false) {
                    $scope.a = $scope.a.reverse();
                    $scope.acp = $scope.acp.reverse();
                    $scope.allscp = $scope.allscp.reverse();
                    $scope.ylcp = $scope.ylcp.reverse();
                }
            }
            if (b == false) {
                $scope.a = $scope.a.reverse();
                $scope.acp = $scope.acp.reverse();
                $scope.allscp = $scope.allscp.reverse();
                $scope.ylcp = $scope.ylcp.reverse();
            }
        }

        var arrayMp = function(a) {
            var b = [];
            a = a.split(',').slice(1);
            var cot = max - min + 1;
            if ($scope.type == 4 || $scope.type == 13 || ($scope.type >= 7 && $scope.type <= 10)) {
                b.str = a.slice(0, cot);
                a = a.slice(cot);
            }
            for (var i = 0; i < nums; i++) {
                b[i] = [];
                b[i] = a.slice(i * cot, (i + 1) * cot);
            }
            return b;
        }

        $scope.addCorner = function(a, b) {
            var m = 0;
            for (var x in a) {
                if (parseInt(a[x]) == $scope.aryb[b]) m++;
            }
            return m;
        }
        for (var i = min; i <= max; i++) $scope.aryb.push(i); //期号 (0-9)(1-11)
        // 角标状态判断 a
        $scope.checkst = function(a, b, flag) {

            var m = 0;

            for (var x in a) {
                if (parseInt(a[x]) == $scope.aryb[b]) m++;
            }
            if (m == 0) return false;
            if (m == 1 && flag != undefined) return false;
            else return true;
        }

        $scope.listcheck = function(a, b) {
            if (a == $scope.aryb[b]) return true;
            else return false;
        }
        // slide 页面切换
        $scope.afalg = 0;
        $scope.pagechange = function(a) {
            if ($scope.falg) {
                if (a == 1) {
                    $scope.pagebfalg = true;
                }
            }
            if (!$scope.falg) {
                if (a == 1) {
                    $scope.pagecfalg = true;
                    $scope.tempfalg = true;
                }
                if (a == 2) { $scope.pagebfalg = true; }
            }
            $scope.afalg = a;
            $ionicSlideBoxDelegate.slide(a);
        }
        $scope.slidechange = function(a) {
            $scope.pagechange(a);
        }

        // 走势图 位数点击效果
        $scope.zsfalg = 0;
        $scope.zstx = function(a) {
            $scope.zsfalg = a;
            $scope.aryindex = a;
        }
        // 设置弹出状态
        $scope.choosebox = function() {
            $scope.assistantShow = true;
        }

        _tempObj.listnum = $scope.listnum;
        _tempObj.aryorder = $scope.aryorder;
        _tempObj.countflag = $scope.countflag;

        //  弹出框 选择事件
        $scope.flagsa = 30;
        $scope.flagsb = false;
        $scope.flagsc = true;
        $scope.chooseevent = function(a, b) {
            if (a == 0) { // 期数
                $scope.flagsa = b;
                _tempObj.listnum = parseInt($scope.flagsa);
            }
            if (a == 1) { //顺序
                $scope.flagsb = b;
                _tempObj.aryorder = $scope.flagsb;
            }
            if (a == 2) { // 统计状态
                $scope.flagsc = b;
                _tempObj.countflag = $scope.flagsc;
            }
            if (a == 3) {
                if (b) {
                    if ($scope.countflag != _tempObj.countflag) {
                        $scope.countflag = _tempObj.countflag;
                    }
                    if ($scope.listnum != _tempObj.listnum) {
                        $scope.listnum = _tempObj.listnum;
                        $scope.aryorder = _tempObj.aryorder;
                        $scope.doPost(_tempObj.aryorder);
                        $scope.assistantShow = false;
                        return false;
                    }
                    if ($scope.aryorder != _tempObj.aryorder) {
                        $scope.aryorder = _tempObj.aryorder;
                        $scope.a = $scope.a.reverse();
                        $scope.acp = $scope.acp.reverse();
                        $scope.allscp = $scope.allscp.reverse();
                        $scope.ylcp = $scope.ylcp.reverse();
                    }
                } else {
                    $scope.flagsa = $scope.listnum;
                    $scope.flagsb = $scope.aryorder;
                    $scope.flagsc = $scope.countflag;
                    _tempObj.listnum = $scope.listnum;
                    _tempObj.aryorder = $scope.aryorder;
                    _tempObj.countflag = $scope.countflag;
                }
                $scope.assistantShow = false;
            }
        }
        // 首页
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
        //  返回
        $scope.backGo = function() {
            window.history.go(-1);
        }
        $scope.load = function($last) {
            if ($last) {
                //console.log(111, $last)
            }
        }


        $scope.$on('$ionicView.beforeEnter', function() {
            $timeout(function() {
                $scope.doPost();
                /* $timeout(function(){
             if($scope.falg){
                $scope.pagebfalg=true;
            }

            if(!$scope.falg){
                $scope.pagecfalg=true;
                $scope.pagebfalg=true;
            }
        },1000)*/
            }, 500)
        });
    }])
    // 走势图（大乐透/双色球/七乐彩）
    .controller('supertrend', ['$stateParams', '$ionicLoading', '$timeout', 'Trend', '$ionicLoading', '$scope', '$state', '$ionicSlideBoxDelegate', 'MathRnum', '$ionicScrollDelegate', '$http', 'ApiEndpoint', 'UserInfo', '$filter', 'PayFlow', 'HttpStatus', function($stateParams, $ionicLoading, $timeout, Trend, $ionicLoading, $scope, $state, $ionicSlideBoxDelegate, MathRnum, $ionicScrollDelegate, $http, ApiEndpoint, UserInfo, $filter, PayFlow, HttpStatus) {
        $scope.aryb = [];
        $scope.aryindex = 0;
        $scope.sfalgs = false;
        $scope.titlehtml = "大乐透";
        $scope.changefalg = false;
        $scope.assistantShow = false;

        $scope.listnum = 30;
        $scope.aryorder = false;
        $scope.countflag = true;


        $scope.cgfalg = true;
        $scope.allscp = '';
        $scope.type = $stateParams.type;
        if ($scope.type == 6) {
            $scope.max = 35;
            $scope.min = 12;
            $scope.numa=5;
            $scope.numb=2;
            $scope.context = "大乐透";
        }
        if ($scope.type == 11) {
            $scope.max = 33;
            $scope.min = 16;
            $scope.numa=6;
            $scope.numb=1;
            $scope.context = "双色球";
        }
        if ($scope.type == 12) {
            $scope.max = 30;
            $scope.min = 0;
            $scope.context = "七乐彩";
        }
        var locallist_t = "",
            locallist_f = "",
            locallist_b = "";
        var sss = '';
        var _tempObj = new Object;
        var arychange = function(a) {
            var b = [];
            for (var x in a) {
                b[a.length - 1 - x] = a[x];
            }
            // console.log(b)
            return b
        }
        var dataProcessing = function(a, b) {

            $scope.u = a.acodes; //期次
            $scope.allscp = a.acodes; //中奖号码、期次、大小比、奇偶比等等...
            $scope.y = a.yltj; //遗漏统计

            $scope.ylz = []; //遗漏统计
            $scope.a = []; //中奖号码
            for (var x in a.yltj.ylcode) {
                $scope.a[x] = a.acodes[x].acode.split(',');
                $scope.ylz[x] = a.yltj.ylcode[x].split(',').slice(1);
            }

            $scope.cxs = a.yltj.cxcs.split(',').slice(1); //出现次数
            $scope.jyl = a.yltj.pjyl.split(',').slice(1); //平均遗漏
            $scope.zyl = a.yltj.zdyl.split(',').slice(1); //最大遗漏
            $scope.zlc = a.yltj.zdlc.split(',').slice(1); //最大连出
            $scope.ylcp = [];
            $scope.acp = [];
            $scope.ylcp = $.extend(true, [], $scope.ylz);
            $scope.acp = $.extend(true, [], $scope.a);


            if ((b == undefined && $scope.aryorder == false) || b == false) {
                $scope.acp = arychange($scope.acp);
                $scope.allscp = arychange($scope.allscp);
                $scope.ylcp = arychange($scope.ylcp);
            }
        }
        $scope.doPost = function(order) {
            var obj = {
                count: $scope.listnum,
                token: UserInfo.l.token || '',
                type: $scope.type
            }
            Trend.trends(obj).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == 1) {
                    sss = data.data
                    locallist_t = data.data;
                    dataProcessing(locallist_t, order);

                }
            })
        }
        $scope.aryc = [];
        aryd = [];

        for (var i = 1; i <= $scope.max; i++) $scope.aryb.push(i);
        for (var i = 1; i <= $scope.min; i++) $scope.aryb.push(i);
        for (var i = 1; i <= $scope.max + $scope.min; i++) aryd.push(i);

        // 角标a
        $scope.checkst = function(a, b) {
            if (b >= 0 && b < $scope.max) {
                for (var x = 0; x < $scope.numa; x++) {
                    if (a[x] == aryd[b]) return true;
                }
            } else {
                for (var x = $scope.numa; x < $scope.numa+$scope.numb; x++) {
                    if (a[x] == (aryd[b] - $scope.max)) return true;
                }
            }
            return false;
        }
        // 角标b
        $scope.checkstb = function(a, b) {
            if (b >= 0 && b < 30) {
                for (var x = 0; x <8; x++) {
                    if (a[x] == aryd[b] && x == 7) return 2;
                    if (a[x] == aryd[b]) return 1;
                }
            }
            return false;
        }
        // 设置弹出状态
        $scope.choosebox = function() {
            $scope.assistantShow = true;
        }
        // 同步滚动
        $scope.scrolls = function() {
            var obj = $ionicScrollDelegate.$getByHandle('dltcon').getScrollPosition();
            $(".st-h-c").scrollLeft(obj.left);
        };
        //  返回
        $scope.backGo = function() {
            window.history.go(-1);
        }
        //  页面切换
        $scope.pagechange = function(a) {
            if (a == 0) {
                $scope.changefalg = false;
                $scope.cgfalg = true;
            }
            if (a == 1) {
                $scope.changefalg = true;
                $scope.sfalgs = true;
                $scope.cgfalg = false;
            }
        }
        //  弹出框 选择事件
        $scope.flagsa = 30;
        $scope.flagsb = false;
        $scope.flagsc = true;
        _tempObj.listnum = $scope.listnum;
        _tempObj.aryorder = $scope.aryorder;
        _tempObj.countflag = $scope.countflag;

        $scope.chooseevent = function(a, b) {
            if (a == 0) { // 期数
                $scope.flagsa = b;
                _tempObj.listnum = parseInt($scope.flagsa);
            }
            if (a == 1) { //顺序
                $scope.flagsb = b;
                _tempObj.aryorder = $scope.flagsb;
            }
            if (a == 2) { // 统计状态
                $scope.flagsc = b;
                _tempObj.countflag = $scope.flagsc;
            }
        }

        $scope.confirme = function(a) {
            if (a) {
                $ionicScrollDelegate.$getByHandle('dltcon').scrollTop();
                $ionicScrollDelegate.$getByHandle('orderlist').scrollTop();
                $scope.countflag = _tempObj.countflag;

                if ($scope.listnum !== _tempObj.listnum) {
                    $scope.listnum = _tempObj.listnum;
                    $scope.aryorder = _tempObj.aryorder;
                    $scope.assistantShow = false;
                    $scope.allscp = [];
                    if ($scope.listnum == 30) {
                        dataProcessing(locallist_t, _tempObj.aryorder);
                    }
                    if ($scope.listnum == 50) {
                        dataProcessing(locallist_f, _tempObj.aryorder);
                    }
                    if ($scope.listnum == 100) {
                        dataProcessing(locallist_b, _tempObj.aryorder);
                    }
                    return false;
                }
                if ($scope.aryorder != _tempObj.aryorder) {
                    $scope.aryorder = _tempObj.aryorder;
                    $scope.acp = $scope.acp.reverse();
                    $scope.allscp = $scope.allscp.reverse();
                    $scope.ylcp = $scope.ylcp.reverse();
                }
            } else {
                $scope.flagsa = $scope.listnum;
                $scope.flagsb = $scope.aryorder;
                $scope.flagsc = $scope.countflag;

                _tempObj.listnum = $scope.listnum;
                _tempObj.aryorder = $scope.aryorder;
                _tempObj.countflag = $scope.countflag;
            }
            $scope.assistantShow = false;
        }
        $scope.golot = function() {
            $state.go('practice.lottery-super', { type: $scope.type });
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }

        function testCtrl() {
            var toDo = function() {
                var objf = {
                    count: 50,
                    token: UserInfo.l.token || '',
                    type: $scope.type
                }
                var obj = {
                    count: 100,
                    token: UserInfo.l.token || '',
                    type: $scope.type
                }
                Trend.trends(objf, false).then(function(data) {
                    HttpStatus.codedispose(data);
                    if (data.status == 1) {
                        locallist_f = data.data;
                    }
                })
                Trend.trends(obj, false).then(function(data) {
                    HttpStatus.codedispose(data);
                    if (data.status == 1) {
                        locallist_b = data.data;
                    }
                })
            };
            $timeout(toDo, 1400)
        }
        testCtrl();
        $scope.$on('$ionicView.beforeEnter', function() {
            $timeout(function() {
                $scope.doPost();
            }, 500)
        });
    }])
    // 下单界面
    .controller('newBetting', ['$ionicHistory', '$scope', '$state', '$ionicPopup', 'qxc', '$stateParams', 'showAlertMsg', 'MathRnum', 'UserInfo', 'PayFlow', 'HttpStatus', '$ionicLoading', '$timeout', 'cAp', function($ionicHistory, $scope, $state, $ionicPopup, qxc, $stateParams, showAlertMsg, MathRnum, UserInfo, PayFlow, HttpStatus, $ionicLoading, $timeout, cAp) {
        var nums = $stateParams.nums;
        var pway = $stateParams.id;
        $scope.type = $stateParams.type;
        $scope.aryflag = false;
        $scope.betflag = true;
        if (pway == "") $scope.betflag = false;
        $scope.confirmation = false;
        $scope.ary = [];

        var arylength = 0;  
        $scope.checkTemp = true;
        $scope.additional = 1;
        $scope.superflag = true;
        $scope.checkfalg = 1; 
        $scope.additional = 1;                //追加期数
        $scope.postobj = {
            betcount: 1, //投注数
            betjson: "", //彩种ID对应的投注描述
            doublecount: 1, //翻倍数
            money: 0, //投注金额
            token: UserInfo.l.token || '', //用户令牌
            type: 3 //彩种类型
        };
        $scope.postobj.money = 2 * $scope.postobj.doublecount * $scope.additional * $scope.postobj.betcount * $scope.checkfalg;
        $scope.postobj.type = $scope.type;
        switch($scope.type){
            case '3' :$scope.nums = 7;break;                                                     // 七星彩
            case '5' :$scope.nums = 5;break;                                                     // 排列五
            case '6' :$scope.max = 35;$scope.nums = 5;$scope.min = 12;$scope.numsb = 2;break;    // 大乐透 
            case '11':$scope.max = 33;$scope.nums = 6;$scope.min = 16;$scope.numsb = 1;break;    // 双色球
            case '12':$scope.max = 30;$scope.nums = 7;$scope.min = 0; $scope.numsb = 0;break;    // 七乐彩
        }
        if (pway == 'true') $scope.superflag = false;


        //  双位处理
        var Prefix = function(num) {
            return (Array(2).join(0) + num).slice(-2);
        }
        // 购彩协议
        $scope.golotage = function() {
            $scope.dochange();
            $state.go('betinfo.lotage');
        }
        // 初始化处理
        $scope.firstPro = function() {
            if (window.localStorage.historybet != undefined) {
                var tempary;
                tempary = JSON.parse(window.localStorage.historybet);
                $scope.type = tempary.type;
                $scope.ary = tempary.nums;
                arylength = $scope.ary.length;
            }
            if (window.localStorage.qxcjson != undefined) {
                var tempary;
                tempary = JSON.parse(window.localStorage.qxcjson);
                $scope.type = tempary.type;
                tempary = tempary.nums;
                for (var x in tempary) {
                    if (pway == "") {
                        if (tempary[x].length == 1) {
                            var temp = tempary[x][0];
                            tempary[x] = temp;
                        }
                    } else {
                        for (var i in tempary[x]) {
                            tempary[x][i] = Prefix(tempary[x][i]);
                        }
                    }
                }
                $scope.ary[arylength] = tempary;
            }
            $scope.endchange();
        }       
        // 输出项状态
        $scope.taflag = function(a, b) {
            if (b == 1) {
                if ($scope.type==12) return false;
                if ($scope.ary[a][1].length > 0 && $scope.ary[a][0].length < $scope.nums) return true;
                else return false;
            }  if (b == 0) {
                if ($scope.ary[a][0].length < $scope.nums) return true;
                else return false;
            } else {
                if ($scope.ary[a][0].length < $scope.nums) return true;
                else return false;
            }
        }
        // 返回上一页 
        $scope.backup=function(){
            if ($scope.type == 6 || $scope.type == 11 || $scope.type == 12) $state.go('practice.lottery-super', { flag: pway, type: $scope.type });
            if ($scope.type == 5 || $scope.type == 3) $state.go('practice.lottery-seven', { type: $scope.type });
        }
        // 主页
        $scope.Gohome = function() {
            if (window.localStorage.historybet != "[]") {
                var confirmPopup = $ionicPopup.confirm({
                    title: '温馨提示',
                    template: '回到主页,将清空所有已选号码',
                    cancelText: '取消',
                    okText: '确定',
                    okType: 'font-color'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        window.localStorage.removeItem("historybet");
                        $state.go('tab.hall');
                    } else {}
                });
            } else $state.go('tab.hall');
        }



        //  继续选号
        $scope.lotteryadd = function() {
            var obj = {
                type: $scope.postobj.type,
                nums: $scope.ary
            };
            window.localStorage.historybet = JSON.stringify(obj);
            $ionicHistory.clearCache().then(function() {$scope.backup();})
        }
        // 机选增加
        $scope.pcadd = function(a) {
            for (var i = 0; i <= a - 1; i++) {
                if ($scope.type==3 || $scope.type==5) {
                    $scope.ary.push(MathRnum.repeatNum(9, $scope.nums));
                } else {
                    var tempary = [];
                    temp = MathRnum.norepeatNum($scope.max, $scope.nums, 1);
                    tempary[0] = temp.sort(function(a, b) {
                        return a - b
                    });
                    if ($scope.min != 0) {
                        temp = MathRnum.norepeatNum($scope.min, $scope.numsb, 1);
                        tempary[1] = temp.sort(function(a, b) {
                            return a - b
                        });
                    }

                    var length = $scope.ary.length;
                    $scope.ary[length] = tempary;
                }
            }
            // $scope.type == 7 ? b = 7 : b = 5;
            $scope.endchange();
        }
        // 删除条目
        $scope.arydelete = function(a) {
            $scope.ary.splice(a, 1);
            $scope.endchange();
        };


        // 类型监测
        $scope.tempcheck = function(a) {
            if (typeof(a) === 'object') {
                return false;
            } else {
                return true;
            }
        }
        // 返回状态
        $scope.hallcancel = function() {
            $scope.lotteryadd();
        }
        // 胆拖注数计算
        $scope.Notecounting = function(a) {
            var o = { a: 0, b: 0 };
            if (a[2] == undefined) { // 单复式 投注
                if (a[0] > $scope.nums || a[1] > $scope.numsb) {
                    var zamount = cAp.comNumber(a[0], $scope.nums) * cAp.comNumber(a[1], $scope.numsb);
                    o.b=2;
                } else { var zamount=1 ; o.b=1;}
            } else {
                if (a[1] == 0 && a[3] == 0) {
                    var zamount = cAp.comNumber(a[2], 7 - a[0]);
                } else if (a[3] == 0) {
                    var zamount = cAp.comNumber(a[2], 6 - a[0]) * cAp.comNumber(a[1], 1);
                } else {
                    var zamount = cAp.comNumber(a[2], 5 - a[0]) * cAp.comNumber(a[3], 2 - a[1]);
                }
                o.b=5;
            }
            o.a=zamount;
            return o;
        }
        // 下标状态
        $scope.remark = function(a) {
            var b = [];
            if ($scope.type == 3 || $scope.type == 5) {
                if (qxc.countNuma(a) != 1) {
                    return "复式　" + qxc.countNuma(a) + "注　" + qxc.countNuma(a) * 2 + "元";
                } else return "单式　1注　2元";
            } else {
                for (var i = 0; i <= a.length - 1; i++) {
                    if (a[i].length >= 0) b[i] = a[i].length;
                    else b[i] = 1;
                }
               var obj = $scope.Notecounting(b);
               if( obj.b==1) return "单式投注　1注　2元";
               if( obj.b==2) return "复式投注　" + obj.a + "注　" + obj.a * 2 + "元";
               if( obj.b==5) return "胆拖投注　" + obj.a + "注　" + obj.a * 2 + "元";
            }
        }
        // 字符拼接
        $scope.addmacs = function(ary) {
            var a = 1;
            if ($scope.checkfalg==1.5) { a = 2; }
            ary = ary.slice(0, 4);
            var tempary = [];
            for (var x in ary) {
                if (ary[x].length > 1) {
                    tempary[x] = ary[x].join(",");
                } else {
                    tempary[x] = ary[x];
                }
            }
            if (tempary.length > 2) {    //胆拖投注
                var str;
                if (tempary[3] == "" && tempary[1] == "") {
                    str = tempary[0] + "$" + tempary[2]; //qlc
                } else if (tempary[3] == "") {
                    str = tempary[0] + "$" + tempary[2] + "@" + tempary[1]; //ssq
                } else if (tempary[1] == "") {
                    str = tempary[0] + "$" + tempary[2] + "@$" + tempary[3]; //dlt-1
                } else {
                    str = tempary[0] + "$" + tempary[2] + "@"  + tempary[1] + "$" + tempary[3]; //dlt-2
                }
                return str + ":" + a + ":5;";

            } else {
                if ($scope.type== 12 && ary[0].length > $scope.nums) var nums = 2;
                else if ($scope.type!= 12 &&  ( ary[0].length > $scope.nums || ary[1].length > $scope.numsb)) var nums = 2;
                else var nums = 1;
                if (tempary[1] == undefined || tempary[1]=='') return tempary[0] + ":" + a + ":" + nums + ";";
                return tempary[0] + "@" + tempary[1] + ":" + a + ":" + nums + ";";
            }
        }


        // 加减
        $scope.addSubtract = function(a, b) {
            if (b == 0) {
                if (a) {
                    $scope.additional--;
                    $scope.doblur()
                } else {
                    $scope.postobj.doublecount--;
                    $scope.doblur()
                }
            } else {
                if (a) {
                    $scope.additional++;
                    $scope.doblur()
                } else {
                    $scope.postobj.doublecount++;
                    $scope.doblur()
                }
            }
            $scope.endchange();
        }
        // 期数倍数
        $scope.dochange = function() {
            if ($scope.postobj.doublecount <= 0 || $scope.postobj.doublecount > 99 || $scope.additional <= 0 || $scope.additional == '' || $scope.additional > 999) {
                $scope.checkTemp = false;
            }
            if ($scope.postobj.doublecount > 99) { $scope.postobj.doublecount = 99; }
            if ($scope.postobj.doublecount == "") { $scope.postobj.money = ""; return false; }
            if ($scope.postobj.doublecount < 0) $scope.postobj.doublecount = 1;

            $scope.postobj.money = 2 * $scope.postobj.doublecount * $scope.additional * $scope.postobj.betcount * $scope.checkfalg;
        }
        // 失焦事件
        $scope.doblur = function() {
            if ($scope.postobj.doublecount <= 0 || $scope.postobj.doublecount == '') {
                $scope.postobj.doublecount = 1;
                showAlertMsg.showMsgFun('单次投注倍数应在1~99之间');
            } else if ($scope.postobj.doublecount > 99) {
                $scope.postobj.doublecount = 99;
                showAlertMsg.showMsgFun('单次投注倍数应在1~99之间');
            }
            if ($scope.additional <= 0 || $scope.additional == '') {
                $scope.additional = 1;
                showAlertMsg.showMsgFun('单次追期数应在1~999之间');
            } else if ($scope.additional > 999) {
                $scope.additional = 999;
                showAlertMsg.showMsgFun('单次追期数应在1~999之间');
            }
            $scope.endchange();
            $scope.checkTemp = true;
        }
        // 追加状态
        $scope.msgboxs = function() {
            $scope.checkfalg == 1?$scope.checkfalg=1.5:$scope.checkfalg=1;
            $scope.endchange();
        }
        // 结果确认
        $scope.endchange = function(a) {
            var m = 0;
            if ($scope.type == 3 || $scope.type == 5) {              
                for (var x in $scope.ary) {
                    m = m + parseInt(qxc.countNuma($scope.ary[x]));
                }
            } else {
                for (var x in $scope.ary) {
                    var b = [];
                    for (var i = 0; i <= $scope.ary[x].length - 1; i++) {
                        if ($scope.ary[x][i].length >= 0) b[i] = $scope.ary[x][i].length;
                        else b[i] = 1;
                    }
                    var zamount= $scope.Notecounting(b);
                    m = m + zamount.a;
                }

            }
            $scope.ary.length == 0 ? $scope.aryflag = false:$scope.aryflag = true;
            $scope.postobj.betcount = m;
            $scope.postobj.money = 2 * $scope.postobj.doublecount * $scope.additional * $scope.postobj.betcount * $scope.checkfalg;
            var obj = {
                type: $scope.postobj.type,
                nums: $scope.ary
            }
            window.localStorage.historybet = JSON.stringify(obj);
            window.localStorage.removeItem("qxcjson");
        }        
        // 清空list
        $scope.clearlist = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: '温馨提示',
                template: '您确定要清空当前的投注内容吗？',
                cancelText: '取消',
                okText: '确定',
                okType: 'font-color'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $scope.ary = [];
                    $scope.additional = 1;
                    $scope.postobj.doublecount = 1;
                    window.localStorage.removeItem("historybet");
                    $scope.endchange();
                } 
            })
        }



        // 下单请求
        $scope.dobill = function(a) {
            if ($scope.type == 3) {
                showAlertMsg.showMsgFun('温馨提示', '七星彩　暂停销售');
                return false;
            }
            if ($scope.postobj.doublecount <= 0 || $scope.postobj.doublecount > 999 || $scope.additional <= 0 || $scope.additional == '' || $scope.additional > 999) {
                $scope.checkTemp = false;
            }
            $scope.endchange();
            if ($scope.aryflag && $scope.checkTemp) {
                var tempjson = "";
                for (var x in $scope.ary) {
                    if (pway == "") {
                        tempjson = tempjson + qxc.Mosaicchar($scope.ary[x]);
                    } else {
                        tempjson = tempjson + $scope.addmacs($scope.ary[x]);
                    }
                }
                $scope.postobj.betjson = $scope.additional + '|' + tempjson;
                PayFlow.bill($scope.postobj).then(function(data) {
                    HttpStatus.codedispose(data);
                    if (data.status == '1') {
                        $scope.Transactiondata = data.data;
                        $scope.confirmation = true;

                    }
                })
            }
            if (!$scope.aryflag) {
                showAlertMsg.showMsgFun('至少选择一注进行投注！');
                return false;
            }
        }
        //  支付窗口
        $scope.CloseConfirmation = function() {
            $scope.confirmation = false;
        }
        // 支付请求
        $scope.payment = function() {
            var chargedata = {
                money: $scope.Transactiondata.chargemoney,
                busorderid: $scope.Transactiondata.betorderid,
            }
            if ($scope.Transactiondata.chargemoney != 0) {
                PayFlow.charge(chargedata);
                return false;
            }
            var paydata = {
                orderid: $scope.Transactiondata.betorderid,
                ordermoney: $scope.Transactiondata.betmoney,
                token: UserInfo.l.token || '',
            }
            PayFlow.pay(paydata).then(function(data) {
                HttpStatus.codedispose(data);
                if (data.status == '1') {
                    if (data.data.payresult == 2) {
                        PayFlow.charge(chargedata);
                    }
                    if (data.data.payresult == 1) {
                        window.localStorage.removeItem("historybet");
                        $state.go('practice.paid', { id: data.data.orderid, type: $scope.postobj.type });
                    }
                }

            })
        }


        $scope.firstPro();
        if (nums != "" && window.localStorage.jxfalg != 'true') {
            if (nums <= 0) nums = 1;
            if (nums > 10) nums = 10;
            window.localStorage.jxfalg = true;
            $scope.pcadd(nums);
        }
    }])
    // 具体的开奖列表
    .controller('lotdatails', ['listcot', '$ionicScrollDelegate', 'order', '$scope', '$state', '$stateParams', '$http', 'UserInfo', 'ApiEndpoint', function(listcot, $ionicScrollDelegate, order, $scope, $state, $stateParams, $http, UserInfo, ApiEndpoint) {
        $scope.type = parseInt($stateParams.type);
        if ($scope.type < 3 || $scope.type > 13) {
            $state.go('practice.Lotterylist');
        }
        pages = 1;
        $scope.ary = [];
        $scope.infintefalg = true;
        $scope.dopost = function() {
            $http({
                method: 'post',
                url: ApiEndpoint.url + "/trade/list",
                data: {
                    pn: pages,
                    token: UserInfo.l.token || '',
                    type: $scope.type
                }
            }).success(function(data) {
                if (data.status == 1) {
                    if (data.data.rowsp == "") {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.infintefalg = false;
                        return false;
                    } else {
                        dataProcessing(data.data.rowsp);
                    }
                }
            }).error(function(data) {
                showAlertMsg.showMsgFun('提示', '网络连接失败！');
            });
        }
        var dataProcessing = function(ary) {
            $scope.temptype = parseInt(ary[0].gid);
            $scope.textcot = listcot.texts($scope.temptype);
            gDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
            for (var x in ary) {
                ary[x].acode = ary[x].acode.split(",");
                if (ary[x].ginfo != undefined) {
                    ary[x].ninfo = ary[x].ninfo.split(",");
                    ary[x].ginfo = ary[x].ginfo.split(",");
                }
                if (ary[x].sjh) {
                    ary[x].sjh = ary[x].sjh.split(",");
                }
                ary[x].goldn = listcot.gold($scope.type);
                if ($scope.type >= 7 && $scope.type <= 10) {
                    ary[x].ginfo = ['130', '65', '1170', '195', '13', '6', '19', '78', '540', '90', '26', '9']
                }
                timea = ary[x].atime;
                ary[x].timea = timea.substring(5, 10);
                ary[x].atime = ary[x].atime.replace(/-/g, '/');
                var datetime = new Date(ary[x].atime);
                ary[x].days = gDays[datetime.getDay()];
                // console.log(datetime.getDay())
            }
            if (pages == 1) {
                $scope.ary = [];

            }
            for (var x = 0; x < ary.length; x++) {
                $scope.ary.push(ary[x]);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');

            if (pages == 1) {
                $('.lot-detail .ldl-up').eq(0).append('<span class="ldl-icon">NEW</span>');
                $('.lot-detail .ldl-down').eq(0).addClass('ldl-new');
            }
        }
        $scope.numfalg = "";
        $scope.openlist = function(x) {
            if ($scope.numfalg == "") {
                $scope.numfalg = x;
            } else if ($scope.numfalg != x) {
                $scope.numfalg = x;
            } else {
                $scope.numfalg = ""
            }
        }

        $scope.checks = function(a) {
            var b=$scope.type;
            if (a == 0) {
                if (b == 3) return true;
            }
            if (a == 1) {
                if (b == 4 || b == 5 || b == 13) return true;
            }
            if (a == 2) {
                if (b == 6 || b == 11 || b == 12) return true;
            } 
            if (a == 3) {
                if (b >= 7 && b <= 10) return true;
            }
            return false;
        }
        $scope.check = function(a, b) {
            for (var i = a; i <= b; i++) {
                if (i == $scope.type) return true;
            }
            return false;
        }
        $scope.backGo = function() {
            window.history.go(-1);
        }
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
        $scope.dopost();
        $scope.golot = function() {
            $state.go(order.getbackurl[$scope.temptype], { type: $scope.temptype });
        }
        $scope.conScorll = function() {
            pages++;
            $scope.dopost();
        }
        $scope.refreshAry = function() {
            pages = 1;
            $scope.dopost();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.infintefalg = true;
        }
    }])
    // 帮助中心
    .controller('helpcenter', ['MathRnum', 'helpcontent', '$state', '$scope', '$stateParams', function(MathRnum, helpcontent, $state, $scope, $stateParams) {
        $scope.obj = helpcontent.cot();
        var type = $stateParams.type;
        var nums = $stateParams.number;
        $scope.tempfalg = 1;
        $scope.ary = [];

        var check = function(a, b, ary) {
            if (ary.length == "") return false;
            for (var x in ary) {
                if (ary[x].aa == a && ary[x].bb == b) return true;
            }
            return false;
        }
        $scope.elseqst = function() {
            for (var i = 0; i < 4; i++) {
                var a = MathRnum.norepeatNum($scope.obj.length - 1, 1, 0) * 1;
                var b = MathRnum.norepeatNum($scope.obj[a].cot.length - 1, 1, 0) * 1;
                var qst = helpcontent.cot(a, b);
                var flag = check(a, b, $scope.ary);
                if (flag) {
                    i = i - 1;
                } else {
                    $scope.ary[i] = {
                        qusetion: qst.question,
                        aa: a,
                        bb: b
                    }
                }
            }
        }
        if (type !== undefined || nums != undefined) {
            type = type * 1;
            nums = nums * 1;
            if (type < 0 || type >= $scope.obj.length) type = 0;
            if (nums < 0 || nums >= $scope.obj[type].cot.length) nums = 0;
            $scope.cotqa = helpcontent.cot(type, nums);
            $scope.elseqst();

        }

        $scope.backGo = function() {
            window.history.back(-1);
        };
        $scope.Gohome = function() {
            $state.go('tab.hall');
        }
        $scope.changeqa = function(a, b) {
            $scope.cotqa = helpcontent.cot(a, b);
            $scope.elseqst();
        }

        $scope.closelist = function(a) {
            if ($scope.tempfalg == a) {
                $scope.tempfalg = "";
            } else {
                $scope.tempfalg = a;
            }

        }
        $scope.goconcrete = function(a, b) {
            $state.go('user.helpcot', { type: a, number: b });
        }
    }])
    //  快三
    .controller('lotterythree', ['fastthree', '$stateParams', '$ionicLoading', '$timeout', 'Trend', '$ionicLoading', '$scope', '$state', '$ionicSlideBoxDelegate', 'MathRnum', '$ionicScrollDelegate', '$http', 'ApiEndpoint', 'UserInfo', '$filter', 'PayFlow', 'HttpStatus', function(fastthree, $stateParams, $ionicLoading, $timeout, Trend, $ionicLoading, $scope, $state, $ionicSlideBoxDelegate, MathRnum, $ionicScrollDelegate, $http, ApiEndpoint, UserInfo, $filter, PayFlow, HttpStatus) {
        $scope.lottypes = 0;
        $scope.title = '和值';
        $scope.goption = false;
        $scope.options = function(a) {
            if (a == 0) {
                $scope.goption = false;
            } else { $scope.goption = true; }
        }
        $scope.lotct = fastthree.lottype();
        // 返回
        $scope.backGo = function() {
            //$ionicHistory.goBack();
            window.history.back();
        }
        //玩法选择
        $scope.choosetype = function(a, b) {
            if ($scope.lottypes != b) {
                $scope.lottypes = b;
                $scope.title = a.a;
            }
        }

        // 走势图链接
        $scope.zstopen = function() {
            // $state.go('practice.trendchar', { type: $scope.postobj.type });
        }
        $scope.assistantShow = false;
        $scope.assistants = function(e) {
            switch (e) {
                case 1:
                    $state.go('practice.detaillist', { type: $scope.type });
                    break;
                case 2:
                    $state.go('practice.play-About', { type: $scope.type });
                    break;
                case 3:
                    $state.go('practice.lot-details', { type: $scope.type });
                    break;
                default:
                    break;
            }
            $scope.assistantShow = !$scope.assistantShow;
        }
        // 返回
        $scope.assistant = function() {
            $scope.assistantShow = !$scope.assistantShow;
        }
    }])