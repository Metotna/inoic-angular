// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.controllersT', 'starter.services', 'starter.filter', 'starter.directive'])

    .run(['$stateParams','ApiEndpoint','$rootScope','$ionicGesture','$ionicPlatform','browser','UserInfo','serializeUrl','HttpStatus',function ($stateParams,ApiEndpoint,$rootScope,$ionicGesture,$ionicPlatform,browser,UserInfo,serializeUrl,HttpStatus) {
        $ionicPlatform.ready(function () {
            UserInfo.add('is_weixn',browser.is_weixn());
            UserInfo.add('navigator',browser.navigator());
            UserInfo.add('webp',browser.webp());
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                    /*console.info( toParams, fromParams);*/
                    var jsondata = serializeUrl.url(location.href);
                    var pid = jsondata.param.pid || '';
                    //console.info(toState, fromState);
                    var type = $stateParams.type;
                    var account = UserInfo.l.account;
                    if(fromState.name=='user.register' && !type && account && UserInfo.l.guid == 'true'){
                        console.log('1');
                        //console.log($stateParams.type);
                        //console.log(ApiEndpoint.bacgurl+'?'+'account='+account+'&pid='+pid+'#/'+toState.name.replace('.','/'));
                        if(UserInfo.l.navigator == 'ios'){
                            if(UserInfo.l.is_weixn == 'yes'){
                                var d ="<div class='Backdrops-new'><img src='img/ios.png'><div class='back-close'><a class='icon iconfont icon-tianjia'></a></div></div>";
                                $('body').append(d);
                                $('body').on('touchstart','.back-close',function(e){
                                        $('.Backdrops-new').remove();
                                        $('body').off('touchstart');
                                    return false;
                                })
                            }
                        }else{
                            window.location.href = ApiEndpoint.bacgurl+'?'+'account='+account+'&pid='+pid+'#/practice/appdownload';
                        }
                    }
                }
            )
            //alert(ionic.Platform.version());
            //HttpStatus.getinit();
            //console.log(serializeUrl.url(location.href).pid);
            /*if(serializeUrl.url(location.href).pid){
                HttpStatus.getinit();
            }*/
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
           /* if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            };
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }*/
        });
    }])

    .config(['ApiEndpoint','$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider',function (ApiEndpoint,$stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        //$httpProvider.defaults.headers.post['ua'] = 'ios';
        //console.log($httpProvider.defaults.headers);
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('bottom');
        $ionicConfigProvider.platform.ios.navBar.alignTitle('left');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');
        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
        var param = function (obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value !== undefined && value !== null){
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html?0726'
            })
            .state('user', {
                url: '/user',
                abstract: false,
                templateUrl: 'templates/user/user.html'
            })
            .state('practice', {
                url: '/practice',
                abstract: false,
                templateUrl: 'templates/practice/practice.html?0726'
            })
            .state('betinfo', {
                url: '/betinfo',
                abstract: false,
                templateUrl: 'templates/practice/newbet.html?0726'
            })

            // Each tab has its own nav history stack:
            .state('tab.hall', {
                url: '/hall/:flag',
                views: {
                    'tab-hall': {
                        templateUrl: 'templates/tab-hall.html?0726',
                        controller: 'HallCtrl'
                    }
                }
            })
            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html   ',
                        controller: 'DashCtrl'
                    }
                }
            })

            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })

            .state('tab.account', {
                url: '/account',
                cache: true,
                views: {
                    'tab-hall': {
                        templateUrl: 'templates/tab-account.html?0726',
                        controller: 'AccountCtrl'
                    }
                }
            })

            //user
            .state('user.Setting', {
                url: '/Setting',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/Setting.html?0726',
                        controller: 'SettingCtrl'
                    }
                }
            })

            .state('user.about', {
                url: '/Setting/about',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/aboutus.html?0726',
                        controller: 'SettingCtrl'
                    }
                }
            })

            // 帮助中心
            .state('user.helpcenter', {
                url: '/Setting/center',
                cache: true,
                views: {
                    'user': {
                        templateUrl: 'templates/user/helpcenter.html?0726',
                        controller: 'helpcenter'
                    }
                }
            })
             // 帮助中心-问题详细
            .state('user.helpcot', {
                url: '/Setting/center/cot/:type/:number',
                cache: true,
                views: {
                    'user': {
                        templateUrl: 'templates/user/helpcot.html?0726',
                        controller: 'helpcenter'
                    }
                }
            })

            .state('user.login', {
                url: '/login/:type',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/login.html?0726',
                        controller: 'loginCtrl'
                    }
                }
            })

            .state('user.register', {
                url: '/register/:type',
                cache: true,
                views: {
                    'user': {
                        templateUrl: 'templates/user/register.html?0726',
                        controller: 'registerCtrl'
                    }
                }
            })

            .state('user.LostPWD', {
                url: '/LostPWD/:type',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/LostPWD.html?0726',
                        controller: 'LostPWDCtrl'
                    }
                }
            })

            .state('user.ChangePWD', {
                url: '/ChangePWD',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/ChangePWD.html?0726',
                        controller: 'ChangePWDCtrl'
                    }
                }
            })
            .state('user.RetrievePWD', {
                url: '/RetrievePWD/:type',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/RetrievePWD.html?0726',
                        controller: 'RetrievePWDCtrl'
                    }
                }
            })
            .state('user.BankCardList', {
                url: '/BankCardList',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/BankCardList.html?0726',
                        controller: 'BankCardListCtrl'
                    }
                }
            })
            .state('user.BankCardBinding', {
                url: '/BankCardBinding',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/bank-card-binding.html?0726',
                        controller: 'BankCardBindingCtrl'
                    }
                }
            })
            .state('user.IDcard', {
                url: '/IDcard',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/IDcard.html?0726',
                        controller: 'IDcardCtrl'
                    }
                }
            })
            .state('user.WalletPay', {
                url: '/WalletPay',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/WalletPay.html?0726',
                        controller: 'WalletPayCtrl'
                    }
                }
            })
            .state('user.Withdraw', {
                url: '/Withdraw',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/withdraw.html?0726',
                        controller: 'WithdrawCtrl'
                    }
                }
            })
            .state('user.Paysuccess', {
                url: '/Paysuccess',
                cache: false,
                views: {
                    'user': {
                        templateUrl: 'templates/user/Paysuccess.html?0726',
                        controller: 'PaysuccessCtrl'
                    }
                }
            })
            //practice
            .state('practice.Soccerhall', {
                url: '/Soccerhall',
                cache: true,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/Soccerhall.html?v='+ApiEndpoint.version,
                        controller: 'SoccerhallCtrl'
                    }
                }
            })
            .state('practice.Betting', {
                url: '/Betting/:id/:gamenum/:palytype',
                cache: false,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/Betting.html?0726',
                        controller: 'BettingCtrl'
                    }
                }
            })
            .state('practice.basketballhall', {
                url: '/basketballhall',
                cache: true,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/basketballhall.html?0726',
                        controller: 'basketballhallCtrl'
                    }
                }
            })
            .state('practice.basballbetting', {
                url: '/basballbetting/:id/:gamenum/:palytype',
                cache: false,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/basballbetting.html?0726',
                        controller: 'basballbettingCtrl'
                    }
                }
            })
            .state('practice.paid', {
                url: '/paid/:id/:type/:palytype/:backurl',//type:彩种id
                cache: false,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/paid.html?0726',
                        controller: 'paidCtrl'
                    }
                }
            })
            //record
            .state('practice.detaillist', {
                url: '/detaillist/:type',
                cache: true,
                views: {
                    'practice': {
                        templateUrl: 'templates/record/detaillist.html?0726',
                        controller: 'detaillistCtrl'
                    }
                }
            })
            .state('practice.detail', {
                url: '/detail/:id/:type/:goback',
                cache: false,
                views: {
                    'practice': {
                        templateUrl: 'templates/record/detail.html?0726',
                        controller: 'detailCtrl'
                    }
                }
            })
            .state('practice.Lotterylist', {
                url: '/Lotterylist',
                cache: false,
                views: {
                    'practice': {
                        templateUrl: 'templates/record/Lotterylist.html?0726',
                        controller: 'LotterylistCtrl'
                    }
                }
            })
            .state('practice.Lottery', {
                url: '/Lottery/:type',
                cache: false,
                views: {
                    'practice': {
                        templateUrl: 'templates/record/Lottery.html?0726',
                        controller: 'LotteryCtrl'
                    }
                }
            })
            .state('practice.plshall', {
                url: '/plshall/:type',
                cache: true,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/plshall.html?0726',
                        controller: 'plshallCtrl'
                    }
                }
            })
            .state('practice.plsbetting', {
                url: '/plsbetting/:id/:type/:typeid',
                cache: false,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/plsbetting.html?0726',
                        controller: 'plsbettingCtrl'
                    }
                }
            })
            .state('practice.syxwhall', {
                url: '/syxwhall/:type',
                cache: true,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/syxwhall.html?0726',
                        controller: 'syxwhallCtrl'
                    }
                }
            })
            .state('practice.syxwbetting', {
                url: '/syxwbetting/:id/:type/:lotteryid/:rx/:payluid',
                cache: false,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/syxwbetting.html?0726',
                        controller: 'syxwbettingCtrl'
                    }
                }
            })
            .state('practice.play-About', {
                url: '/play-About/:type',
                cache: false,
                views: {
                    'practice': {
                        templateUrl: 'templates/common/play-About.html?0726',
                        controller: 'playAboutCtrl'
                    }
                }
            })
            .state('practice.appdownload', {
                url: '/appdownload/:account',
                cache: false,
                views: {
                    'practice': {
                        templateUrl: 'templates/common/appdownload.html?0726',
                        controller: 'appdownloadCtrl'
                    }
                }
            })
            //qxc && plw
            .state('practice.lottery-seven', {
                url: '/lotteryseven/:type',
                cache: true,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/lottery-seven.html?0726',
                        controller: 'lotteryseven'
                    }
                }
            })
            // 普通走势图
            .state('practice.trendchar', {
                url: '/trendchar/:type',
                cache: true,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/lottery-trend.html?0726',
                        controller: 'trendchar'
                    }
                }
            })
            // 下单页面
            .state('betinfo.newBet', {
                url: '/newBet/:type/:nums/:id',
                cache: false,
                views: {
                    'betinfo': {
                        templateUrl: 'templates/practice/newBetting.html?0726',
                        controller: 'newBetting'
                    }
                }
            })
            .state('betinfo.lotage', {
                url: '/lotage',
                cache: true,
                views: {
                    'betinfo': {
                        templateUrl: 'templates/common/lotteryage.html?0726',
                        controller: 'playAboutCtrl'
                    }
                }
            })
            // 大乐透 & 双色球
            .state('practice.lottery-super', {
                url: '/lotterysuper/:type/:flag',
                cache: true,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/lottery-super.html?0726',
                        controller: 'lotterysuper'
                    }
                }
            })
            // 大乐透 & 双色球 走势图
            .state('practice.supertrend', {
                url: '/supertrend/:type',
                cache: true,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/lottery-supertrend.html?0726',
                        controller: 'supertrend'
                    }
                }
            })
            // 开奖详情
            .state('practice.lot-details', {
                url: '/lotterylist/lotdetail/:type',
                cache: false,
                views: {
                    'practice': {
                        templateUrl: 'templates/record/Lottery-details.html?0726',
                        controller: 'lotdatails'
                    }
                }
            })
            .state('practice.lottery-three', {
                url: '/lotterythree/:type',
                cache: true,
                views: {
                    'practice': {
                        templateUrl: 'templates/practice/lottery-three.html?0726',
                        controller: 'lotterythree'
                    }
                }
            })


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/hall/');

    }]);
