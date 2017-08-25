/**
 * Created by King on 2017/5/25.
 */
angular.module('starter.directive', [])
    .directive('repeatFinish', ['$timeout', function($timeout) {
        return {
            restrict: 'AE',
            link: function(scope, element, attr) {
                if (scope.$last == true) {
                    var pass = scope.Passdata;
                    var type = true;
                    $timeout(function() {
                        //console.log(pass);
                        var b = $('.Bettinglist .betbtns');
                        for (var s = 0; s < pass.length; s++) {
                            type = true;
                            for (var k = 0; k < b.length; k++) {
                                if (type && pass[s].gameid == b[k].getAttribute('data-gameid') && (pass[s].bettingid == 3 || pass[s].bettingid == 2 || pass[s].bettingid == 1)) {
                                    type = false;
                                    $(b[k]).parents('.mixall').find('.game-more').addClass('ssss');
                                }
                                if (pass[s].gameid == b[k].getAttribute('data-gameid') && pass[s].resultid == b[k].getAttribute('data-resultid') && pass[s].bettingid == b[k].getAttribute('data-bettingid')) {
                                    if (!$(b[k]).hasClass('ssss')) {
                                        $(b[k]).addClass('ssss');
                                    }
                                    break;
                                }
                            }
                        }
                    }, 0)
                }
            }
        }
    }])

.directive('rF', ['$timeout', function($timeout) {
        return {
            restrict: 'AE',
            link: function(scope, element, attr) {
                if (scope.$first == true) {
                    // console.log(new Date().getTime());
                }
                if (scope.$last == true) {
                    // console.log(new Date().getTime());
                }
            }
        }
    }])
    .directive('msgRoll', ['$timeout', '$interval', function($timeout, $interval) {
        return {
            restrict: 'AE',
            link: function(scope, element, attr) {
                var top = 0;
                var num = 0;
                $interval(function() {
                    //console.log(element.find('li'));
                    num++;
                    top -= 0.6;
                    if (num >= element.find('li').length) {
                        top = 0;
                        num = 0;
                        element.css({ 'top': top + 'rem', '-webkit-transition': 'all 0s' });
                    } else {
                        element.css({ 'top': top + 'rem', '-webkit-transition': 'all 2s' });
                    }
                    //console.log(num);
                }, 3000)
                if (scope.$last == true) {
                    // console.log(new Date().getTime());
                    //console.log(element.find('li')[0])
                }
            }
        }
    }])
    /*    .directive('msgCopy', ['$timeout','$interval', function($timeout,$interval) {
            return {
                restrict: 'AE',
                link: function(scope, element, attr) {
                    if (scope.$last == true) {
                        // console.log(new Date().getTime());
                        console.log(element.parent('ul').find('li'))
                        var li = element.parent('ul').find('li');
                        console.log(li)
                        for(var i =0;i<li.length;i++){
                            console.log(element.parent('ul')[0]);
                            element.parent('ul')[0].append(li[i]);
                        }
                    }
                }
            }
        }])*/

.directive('payType', ['UserInfo', function(UserInfo) {
        return {
            restrict: 'EA',
            scope: {},
            replace: false,
            transclude: true,
            templateUrl: 'templates/common/pay.html?0812',
            controller: ['$scope', function($scope) {
                // 控制器逻辑
                /*  $scope.data = {
                      ptype:UserInfo.l.sucpayway||'WX',
                  }
                  if(!UserInfo.l.sucpayway){
                      UserInfo.add('sucpayway',$scope.data.ptype);
                  }
                  if(UserInfo.l.is_weixn=='yes'){
                      $scope.is_weixn = true;
                  }else{
                      $scope.is_weixn = false;
                  }*/
                $scope.data = {};
                if (UserInfo.l.is_weixn == 'yes') {
                    $scope.is_weixn = true;
                    UserInfo.add('sucpayway', 'WX');
                    $scope.data.ptype = 'WX';
                } else {
                    $scope.is_weixn = false;
                    UserInfo.add('sucpayway', 'ALI');
                    $scope.data.ptype = 'ALI';
                }
                $scope.pay = function() {
                    UserInfo.add('sucpayway', $scope.data.ptype);
                }
            }]
        }
    }])
    .directive('moduleWithdraw', ['UserInfo', function(UserInfo) {
        return {
            restrict: 'EA',
            scope: false,
            replace: true,
            transclude: true,
            //template : '<div data="data">子指令:<input ng-model="data.name" /></div>',
            templateUrl: 'templates/common/modulewithdraw.html?0812',
            controller: ['$scope', '$state', function($scope, $state) {
                //console.log($scope.data);
                //console.log($('.modulebankBOX'));
                // 控制器逻辑
                $scope.getbank = function(c, $event) {
                    //console.log(c);
                    if (c == 0) {
                        $scope.showmodule = false;
                    } else if (c == 1) {
                        $state.go('user.BankCardList');
                    } else {
                        $scope.showmodule = false;
                        $scope.showbank = true;
                        //console.log($scope.showmodule);
                        //console.log(c);
                        $scope.login.cant = c.cardno;
                        $scope.login.cname = c.name;
                        $scope.login.msg = c.bank;
                        //console.log($scope.login);
                    }
                    $event.stopPropagation();
                }
                $scope.$on('$ionicView.beforeEnter', function() {
                    //console.log('进入');
                    if (UserInfo.l.bank) {
                        $scope.carlist = JSON.parse(UserInfo.l.bank) || '';
                    }
                })
                if (UserInfo.l.bank) {
                    $scope.carlist = JSON.parse(UserInfo.l.bank) || '';
                }
                $('.modulebankBOX').on('touchmove', function(e) {
                    e.preventDefault();
                })
            }],

        }
    }])
    .directive('scrollMemory', ['$ionicGesture', 'UserInfo', function($ionicGesture, UserInfo) {
        return {
            restrict: 'A',
            scope: false,
            replace: false,
            link: function(scope, element, attr) {
                var parent = $(angular.element(element)[0]).parents('ion-view');
                var dome = '<dt style="position: absolute;top:.88rem;" class="match-divider ng-binding" scroll-memory="">170726<span class="hall-mar ng-binding">(周三)</span><em class="date-num ng-binding">27</em>场比赛可投<i class="arrow-ico trans-tf"></i></dt>';
                parent.append(dome);
                $('#zuqiu').on('scroll', function(event) {
                    scrollTop = document.getElementById('zuqiu').scrollTop;
                    scope.$apply(function() {
                        scope.scrolllen = scrollTop;
                    })
                });
            },
            /* controller: ['$scope',function($scope,$attrs,attr) {
                 // 控制器逻辑
             }]*/
        }
    }])