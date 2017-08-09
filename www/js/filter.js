/**
 * Created by King on 2017/5/19.
 */
angular.module('starter.filter', [])

    .filter('moneyleft', [function () {
        return function (y) {
            if (y == 0 || y == undefined) {
                y = '0.0';
            }
            var type = "";
            var a = String(y).split(".");
            type = a[0];
            return type;

        }
    }])
    .filter('ordestatus', [function () {
        return function (s) {
            var j = '';
            switch (s) {
                case '0':
                    j = '未中奖';
                    break;
                case '1':
                    j = '中奖';
                    break;
                case '10':
                    j = '待出票';
                    break;
                case '20':
                    j = '已出票';
                    break;
                case '30':
                    j = '待开奖';
                    break;
                case '40':
                    j = '待派奖';
                    break;
                case '10002':
                    j = '已退款';
                    break;
            }
            return j;
        }
    }])
    .filter('ordebcast', [function () {
        return function (s) {
            var j = '';
            switch (s) {
                case '1':
                    j = '自购';
                    break;
                case '2':
                    j = '追号';
                    break;
            }
            return j;
        }
    }])
    .filter('moneyright', [function () {
        return function (s) {
            if (s == 0 || s == undefined) {
                s = '0.0';
            }
            var type = "";
            var a = String(s).split(".");
            type = '.' + a[1];
            if (a[1] == undefined) {
                return '.' + 0;
            } else {
                return type;
            }

        }
    }])
    .filter('gamelist', [function () {
        return function (s, f, gamearry) {
            var n = 0;
            for (var i in s) {
                switch (f) {
                    case 1:
                        if (s[i].spfopen == true && gamearry.indexOf(s[i].matchname) != -1) {
                            n++;
                        }
                        ;
                        break;
                    case 2:
                        if (s[i].rspfopen == true && gamearry.indexOf(s[i].matchname) != -1) {
                            n++;
                        }
                        ;
                        break;
                    case 3:
                        if (s[i].bqcopen == true && gamearry.indexOf(s[i].matchname) != -1) {
                            n++;
                        }
                        ;
                        break;
                    case 4:
                        if (s[i].cbfopen == true && gamearry.indexOf(s[i].matchname) != -1) {
                            n++;
                        }
                        ;
                        break;
                    case 5:
                        if (s[i].jqsopen == true && gamearry.indexOf(s[i].matchname) != -1) {
                            n++;
                        }
                        ;
                        break;
                    case 6:
                        if (s[i].sfopen == true && gamearry.indexOf(s[i].matchname) != -1) {
                            n++;
                        }
                        ;
                        break;
                    case 7:
                        if (s[i].rfsfopen == true && gamearry.indexOf(s[i].matchname) != -1) {
                            n++;
                        }
                        ;
                        break;
                    case 8:
                        if (s[i].sfcopen == true && gamearry.indexOf(s[i].matchname) != -1) {
                            n++;
                        }
                        ;
                        break;
                    case 9:
                        if (s[i].dxfopen == true && gamearry.indexOf(s[i].matchname) != -1) {
                            n++;
                        }
                        ;
                        break;
                    case 10:
                        if (gamearry.indexOf(s[i].matchname) != -1){
                            n++;
                        }
                        ;
                        break;
                    default:
                        break
                }
            }
            return n;
        }
    }])
    .filter('Filresult', [function () {
        return function (s) {
            if (s == undefined || s == '') {
                return '点击选择投注选项';
            } else {
                return s;
            }
        }
    }])
    .filter('gate', [function () {
        return function (s) {
            var str = '';
            str = s.replace('*', "串")
            return str;
        }
    }])
    .filter('gates', ['UserInfo', function (UserInfo) {
        var l = JSON.parse(UserInfo.l.jsongate);
        return function (s) {
            var str = '';
            for (var i in l) {
                if (s == l[i].id) {
                    str = l[i].name;
                    break;
                }
            }
            //console.log(str)
            if(str=='1*1'){
                str = '单关';
            }else {
                str = str.replace('*', "串")
            }
            return str;
        }
    }])
    .filter('itemlisttime', [function () {
        return function (s, index) {
            var time = '';
            var f = '';
            var g = '';
            if (!s) {
                return;
            }
            var num = s.replace(/[^0-9]/ig, "");
            if (index == 1) {
                f = num.substring(4, 6);
                g = num.substring(6, 8);
                time = f + "/" + g;
            } else if (index == 2) {
                f = num.substring(8, 10);
                g = num.substring(10, 12);
                time = f + ":" + g;
            }
            return time;
        }
    }])

    //获取星期
    .filter('getweek', [function () {
        return function (time) {
            var str = '20'+time.substring(0,2)+'/'+time.substring(2,4)+'/'+time.substring(4,6);
            /*var reg = /(\d{4})\-(\d{2})\-(\d{2})/;
            var date = str.replace(reg, "$1/$2/$3");*/
            date = new Date(str);
            var d = date;
            var weekday = new Array(7)
            weekday[0] = "周日"
            weekday[1] = "周一"
            weekday[2] = "周二"
            weekday[3] = "周三"
            weekday[4] = "周四"
            weekday[5] = "周五"
            weekday[6] = "周六"
            return weekday[d.getDay()];
        }
    }])
    .filter('lottery', [function () {
        return function (z, index) {
            var n = '';
            var i = '';
            var j = '';
            var sf = function () {
                if (z.ms > z.ss) {
                    j = '胜'
                } else if (z.ms == z.ss) {
                    j = '平'
                } else if (z.ms < z.ss) {
                    j = '负';
                }
                return j;
            }
            if (index == 1) {
                n = sf();
            } else if (index == 2) {
                if (z.ms - (-z.lose) > z.ss) {
                    n = '胜'
                } else if (z.ms - (-z.lose) == z.ss) {
                    n = '平'
                } else if (z.ms - (-z.lose) < z.ss) {
                    n = '负';
                }
            } else if (index == 3) {
                n = Number(z.ms) + Number(z.ss);
            } else if (index == 4) {
                if (z.hms > z.hss) {
                    i = '胜'
                } else if (z.hms == z.hss) {
                    i = '平'
                } else if (z.hms < z.hss) {
                    i = '负'
                }
                n = i + '-' + sf();
            }
            return n;
        }
    }])
    .filter('getSubStr', [function () {
        return function (str, s, f, g) {
            var subStr1 = str.substr(0, s);
            var subStr2 = str.substr(str.length - f);
            if (g == 1) {
                var subStr = subStr1 + "**** **** **** " + subStr2;
            } else {
                var subStr = subStr1 + "****" + subStr2;
            }
            return subStr;
        }
    }])
    .filter('plstz', [function () {
        return function (s) {
            var j = '';
            switch (s) {
                case 'zx3':
                    j = '直选三';
                    break;
                case 'z3_ds':
                    j = '组三单式';
                    break;
                case 'z3_fs':
                    j = '组三复式';
                    break;
                case 'z6_fs':
                    j = '组选六';
                    break;
                case 'zx_hz':
                    j = '直选三和值';
                    break;
            }
            return j;
        }
    }])
    .filter('syxwtz', [function () {
        return function (s) {
            var j = '';
            s = parseInt(s);
            switch (s) {
                case 1:
                    j = '任选一';
                    break;
                case 2:
                    j = '任选二';
                    break;
                case 3:
                    j = '任选三';
                    break;
                case 4:
                    j = '任选四';
                    break;
                case 5:
                    j = '任选五';
                    break;
                case 6:
                    j = '任选六';
                    break;
                case 7:
                    j = '任选七';
                    break;
                case 8:
                    j = '任选八';
                    break;
                case 9:
                    j = '前二直选';
                    break;
                case 10:
                    j = '前三直选';
                    break;
                case 11:
                    j = '前二组选';
                    break;
                case 12:
                    j = '前三组选';
                    break;
            }
            return j;
        }
    }])
    .filter('plsplace', [
        function () {
            return function (t, y) {
                var j = '';
                if (y == '直选三' || y == '直选') {
                    switch (t) {
                        case 0:
                            j = '百位';
                            break;
                        case 1:
                            j = '十位';
                            break;
                        case 2:
                            j = '个位';
                            break;
                    }
                } else if (y == '组三单式') {
                    switch (t) {
                        case 0:
                            j = '重号';
                            break;
                        case 1:
                            j = '单号';
                            break;
                    }
                } else {
                    j = '选号'
                }
                return j;
            }
        }
    ])
    .filter('syxwplace', [
        function () {
            return function (t, y) {
                var j = '';
                if (y.indexOf('dt') != -1) {
                    switch (t) {
                        case 0:
                            j = '胆码';
                            break;
                        case 1:
                            j = '拖码';
                            break;
                    }
                } else if (y == 'q2_pt') {
                    switch (t) {
                        case 0:
                            j = '万位';
                            break;
                        case 1:
                            j = '千位';
                            break;
                    }
                } else if (y == 'q3_pt') {
                    switch (t) {
                        case 0:
                            j = '万位';
                            break;
                        case 1:
                            j = '千位';
                            break;
                        case 2:
                            j = '百位';
                            break;
                    }
                } else {
                    j = '选号'
                }
                return j;
            }
        }
    ])
    .filter('tzxq', [
        function () {
            return function (t,i) {
                str = t.replace(/,/g, ' ');
                str1 = str.replace(/\$/g, ' # ');
                str2 = str1.replace('@', ' | ');
                str3 = str2.split('|');
                return str3[i];
            }
        }])
    .filter('acode', [
        function () {
            return function (acode) {
                if (!acode) {
                    return '等待开奖';
                    console.log(acode);
                }
                var str3 = acode.replace(/,/g, ' ');
                var str2 = str3.replace(/\|/g, ' ');
                return str2;
            }
        }])
    .filter('downtime', [
        function () {
            return function (t) {
                if (t > 0) {
                    var s = parseInt(t / 60);
                    var m = t % 60;
                    return s + '分' + m + '秒'
                } else {
                    return '已截止'
                }
            }
        }])
    .filter('syxwstr', [
        function () {
            return function (t) {
                var s = t;
                return s;
            }
        }])