/**
 * Created by King on 2017/5/25.
 */
angular.module('starter.directive', [])
    .directive('repeatFinish', ['$timeout',function ($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                if (scope.$last == true) {
                    var pass = scope.Passdata;
                    var type = true;
                    $timeout(function () {
                        //console.log(pass);
                        var b = $('.Bettinglist .betbtns');
                        for (var s = 0; s < pass.length; s++) {
                            type = true;
                            for (var k = 0; k < b.length; k++) {
                                if(type && pass[s].gameid == b[k].getAttribute('data-gameid') && (pass[s].bettingid == 3 || pass[s].bettingid == 2 || pass[s].bettingid == 1)){
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

    .directive('rF', ['$timeout',function ($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, element, attr) {
                if(scope.$first == true){
                    // console.log(new Date().getTime());
                }
                if (scope.$last == true) {
                    // console.log(new Date().getTime());
                }
            }
        }
    }])

    .directive('payType', ['UserInfo',function (UserInfo) {
        return {
            restrict: 'EA',
            scope: {},
            replace: false,
            transclude: true,
            templateUrl:'templates/common/pay.html',
            controller: ['$scope',function($scope) {
                // 控制器逻辑
                $scope.data = {
                    ptype:UserInfo.l.sucpayway||'WX',
                }
                if(!UserInfo.l.sucpayway){
                    UserInfo.add('sucpayway',$scope.data.ptype);
                }
                if(UserInfo.l.is_weixn=='yes'){
                    $scope.is_weixn = true;
                }else{
                    $scope.is_weixn = false;
                }
                $scope.pay = function () {
                    UserInfo.add('sucpayway',$scope.data.ptype);
                }
            }]
        }
    }])
    .directive('scrollMemory', ['$ionicGesture','UserInfo',function ($ionicGesture,UserInfo) {
        return {
            restrict: 'A',
            scope: false,
            replace: false,
            link: function (scope, element, attr) {
                var parent = $(angular.element(element)[0]).parents('ion-view');
                var dome = '<dt style="position: absolute;top:.88rem;" class="match-divider ng-binding" scroll-memory="">170726<span class="hall-mar ng-binding">(周三)</span><em class="date-num ng-binding">27</em>场比赛可投<i class="arrow-ico trans-tf"></i></dt>';
                parent.append(dome);
                $('#zuqiu').on('scroll', function(event){
                    scrollTop=document.getElementById('zuqiu').scrollTop;
                        scope.$apply(function () {
                            scope.scrolllen = scrollTop;
                        })
                });
            },
           /* controller: ['$scope',function($scope,$attrs,attr) {
                // 控制器逻辑
            }]*/
        }
    }])
