/**
 * Created by ZOUFENG186 on 2016-07-12.
 */
var Util = (function () {
    var emptyObj = {},class2type = {}, toString = Object.prototype.toString;

    /**
     * @name isNaN
     * @description 检测是否是NaN
     * @params
     * @return boolean
     * */
    function isNaN(obj) {
        return obj !== obj;
    }



    /**
     * @name isIdNumber
     * @description 检测身份证号码
     * @params idNumber{string}
     * @return boolean (true表示身份证号码正确)
     * @example
     *  */
    function isIdNumber(scCard) {
        var vcity = {
            11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
            21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
            33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
            42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
            51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
            63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
        };
        var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

        //检查号码是否符合规范，包括长度，类型
        function isCardNo(obj) {
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            return /(^\d{15}$)|(^\d{17}(\d|X)$)/.test(obj);
        }

        //取身份证前两位,校验省份
        function checkProvince(obj) {
            return vcity[obj.substr(0, 2)] !== undefined;
        }

        //检查生日是否正确
        function checkBirthday(obj) {
            var len = obj.length,
                re_fifteen, re_eighteen,
                arr_data,
                year,
                month,
                day,
                birthday;
            //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
            if (len === 15) {
                re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
                arr_data = obj.match(re_fifteen);
                year = arr_data[2];
                month = arr_data[3];
                day = arr_data[4];
                birthday = new Date('19' + year + '/' + month + '/' + day);
                return verifyBirthday('19' + year, month, day, birthday);
            }
            //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
            if (len === 18) {
                re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                arr_data = obj.match(re_eighteen);
                year = arr_data[2];
                month = arr_data[3];
                day = arr_data[4];
                birthday = new Date(year + '/' + month + '/' + day);
                return verifyBirthday(year, month, day, birthday);
            }
            return false;
        }

        //校验日期
        function verifyBirthday(year, month, day, birthday) {
            var now_year = new Date().getFullYear();
            //年月日是否合理
            if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
                //判断年份的范围（0岁到130岁之间)
                return (now_year - year) >= 0 && (now_year - year) <= 130;
            }
            return false;
        }

        //校验位的检测
        function checkParity(obj) {
            //15位转18位
            obj = changeFifteenToEighteen(obj);
            if (obj.length === 18) {
                var cardTemp = 0, i;
                for (i = 0; i < 17; i++) {
                    cardTemp += obj[i] * arrInt[i];
                }
                return arrCh[cardTemp % 11] === obj[17];
            }
            return false;
        }

        //15位转18位身份证号
        function changeFifteenToEighteen(obj) {
            if (obj.length === 15) {
                var cardTemp = 0, i;
                obj = obj.replace(/(\d{6})(\d{9})/, '$1' + '19' + '$2');
                for (i = 0; i < 17; i++) {
                    cardTemp += obj[i] * arrInt[i];
                }
                return obj + arrCh[cardTemp % 11];
            }
            return obj;
        }

        return isCardNo(scCard)
            && checkProvince(scCard)
            && checkBirthday(scCard)
            && checkParity(scCard);
    }

    /**
     * @name Array.prototype.indexOf
     * @description 数组元素索引值
     * @params ele 要查找的元素
     * @return number index
     * @example
     *
     * [1,2,3,4].indexOf(3) // 2
     * */
    if (typeof (Array.prototype.indexOf) !== 'function') {
        Array.prototype.indexOf = function (ele) {
            for (var i = 0, len = this.length; i < len; i++) {
                if (i in this && this[i] === ele) {
                    return i;
                }
            }
            return -1;
        }
    }

    /**
     * @name Array.prototype.some
     * @description 在数组元素上执行回调函数，若有一个返回true则返回true,否则false
     * @params callback；回调函数，thisArg:上下文对象
     * @return boolean
     * @example
     *
     * */
    if (typeof (Array.prototype.some) !== 'function') {
        Array.prototype.some = function (callback, thisArg) {
            if (typeof (callback) !== 'function') {
                throw new TypeError(callback + 'is not a function.');
            }
            for (var i = 0, len = this.length; i < len; i++) {
                if (i in this && callback.call((arguments.length > 1 ? thisArg : null), this[i], this) === true) {
                    return true;
                }
            }
            return false;
        }
    }

    /**
     * @name Array.prototype.every
     * @description 在数组元素上执行回调函数，若全部返回true则返回true,否则false
     * @params callback；回调函数，thisArg:上下文对象
     * @return boolean
     * @example
     *
     * */
    if (typeof (Array.prototype.every) !== 'function') {
        Array.prototype.every = function (callback, thisArg) {
            if (typeof (callback) !== 'function') {
                throw new TypeError(callback + 'is not a function.');
            }
            for (var i = 0, len = this.length; i < len; i++) {
                if (i in this && callback.call((arguments.length > 1 ? thisArg : null), this[i], this) === false) {
                    return false;
                }
            }
            return true;
        }
    }
    /**
     * @name Array.prototype.forEach
     * @description 数组遍历
     * @params callback；回调函数，thisArg:上下文对象
     * @return
     * @example
     *
     * */

    if (typeof (Array.prototype.forEach) !== 'function') {
        Array.prototype.forEach = function (callback, thisArg) {
            if (typeof (callback) !== 'function') {
                throw new TypeError(callback + 'is not a function.');
            }
            for (var i = 0, len = this.length; i < len; i++) {
                if (i in this && callback.call((arguments.length > 1 ? thisArg : null),this[i], i,  this) === false) {
                    return;
                }
            }
        }
    }

    /**
     * @name Array.prototype.map
     * @description 在数组元素上调用回调并以函数返回值组成的新数组返回
     * @params callback；回调函数，thisArg:上下文对象
     * @return
     * @example
     *
     * */
    if (typeof (Array.prototype.map) !== 'function') {
        Array.prototype.map = function (callback, thisArg) {
            if (typeof (callback) !== 'function') {
                throw new TypeError(callback + 'is not a function.');
            }
            var len = this.length, k = 0,mapArr = [];
            while (k < len) {
                if (k in this) {
                    mapArr[k] = callback.call((arguments.length > 1 ? thisArg : null), this[k], k, this);
                }
                k++;
            }
            return mapArr;
        }
    }

    /**
     * @name Array.prototype.filter
     * @description 在数组元素上调用回调并以函数返回值组成的新数组返回
     * @params callback；回调函数，thisArg:上下文对象
     * @return  {Array}
     * @example
     *
     * */
    if (typeof (Array.prototype.filter) !== 'function') {
        Array.prototype.filter = function (callback, thisArg) {
            if (typeof (callback) !== 'function') {
                throw new TypeError(callback + 'is not a function.');
            }
            var len = this.length, k = 0,subArr = [];
            while (k < len) {
                if (k in this && callback.call((arguments.length > 1 ? thisArg : null), this[k], k, this)) {
                    subArr.push(this[k]) ;
                }
                k++;
            }
            return subArr;
        }
    }

    /**
     * @name Array.prototype.sort
     * @description 数组排序
     * @params callback；回调函数，thisArg:上下文对象
     * @return  {Array}
     * @example
     *
     * */
    if (typeof (Array.prototype.sort) !== 'function') {
        Array.prototype.sort = function (callback, thisArg) {
            if (typeof (callback) !== 'function') {
                throw new TypeError(callback + 'is not a function.');
            }
            var middleVal;
            for (var i = 1, len = this.length; i < len; i++) {
                for (var k = 0; k < len - i; k++) {
                    if (callback.call(thisArg, this[k], this[k + 1]) > 0) {
                        middleVal = this[k];
                        this[k] = this[k + 1];
                        this[k + 1] = middleVal;
                    }
                }
            }
            return this ;
        }
    }


    /**
     * @name String.prototype.trim
     * @description 去掉字符串首尾空格
     * @params String str
     * @return {String}
     * @example
     *
     * */
    if (typeof (String.prototype.trim) !== 'function') {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    }
    /**
     * @name Number.prototype.formatCurrency
     * @description 格式化数字为货币格式
     * @params Number str
     * @return {String}
     * @example
     *
     * */
    Number.prototype.formatCurrency = function () {
        if (isNaN(this) || Math.abs(this.valueOf()) === Infinity) {
            return this + '';
        }
        var dotStr = '.',
            thisString = this + '',
            hasDot = thisString.indexOf(dotStr) > -1, // 是否是小数
            strArr = thisString.split(dotStr), // 数字字符串拆分
            integerPart = strArr[0], // 整数部分
            len = integerPart.length, // 整数部分长度
        // 计算逗号的数目：长度为3的整数倍则减一，否则取整
            commaNum = len % 3 === 0 ? Math.floor(len / 3) - 1 : Math.floor(len / 3),
            integerPartStart, integerPartEnd;
        if (commaNum < 1) {
            return thisString;
        } else {
            integerPartStart = integerPart.slice(0, len - commaNum * 3);
            integerPartEnd = integerPart.slice(len - commaNum * 3, len);
            integerPartEnd = integerPartEnd.replace(/(\d{3})/g, function (match, str, posi) {
                return ',' + str;
            });
            return integerPartStart + integerPartEnd + (hasDot ? dotStr + strArr[1] : '');
        }
    };
    /**
     * @name getType
     * @description 检测类型
     * @params
     * @return string 类型字符串
     *
     * */
    ('Function Number String Boolean Array Object Date RegExp').split(' ').forEach(function (item, index) {
        class2type['[object ' + item + ']'] = item.toLowerCase();
    });
    function getType(o) {
        return o == null ? o + '' : class2type[Object.prototype.toString.call(o)];
    }

    /**
     * @name Element.prototype.insertAdjacentHTML
     * @description 插入毗邻的HTML
     * @params String pos,String html
     * @return
     * @example
     *
     * */
    var Insert = (function () {
        // 如果元素存在原生的insertAdjacentHTML
        if (document.createElement('div').insertAdjacentHTML) {
            return {
                before: function (elt, html) {
                    elt.insertAdjacentHTML('beforebegin', html);
                },
                after: function (elt, html) {
                    elt.insertAdjacentHTML('afterend', html);
                },
                atStart: function (elt, html) {
                    elt.insertAdjacentHTML('afterbegin', html);
                },
                atEnd: function (elt, html) {
                    elt.insertAdjacentHTML('beforeend', html);
                }
            };
        }
        // 否则，实现同样的4个插入函数，并使用它们来定义insertAdjacentHTML
        function fragment(html) {
            var frag = document.createDocumentFragment(),
                elt = document.createElement('div');
            elt.innerHTML = html;
            while (elt.firstChild) {
                frag.appendChild(elt.firstChild);
            }
            return frag;
        }

        var Insert = {
            before: function (elt, html) {
                elt.parentNode.insertBefore(fragment(html), elt);
            },
            after: function (elt, html) {
                elt.parentNode.insertBefore(fragment(html), elt.nextSibling);
            },
            atStart: function (elt, html) {
                elt.insertBefore(fragment(html), elt.firstChild);
            },
            atEnd: function (elt, html) {
                elt.insertBefore(fragment(html), elt.lastChild);
            }
        };

        Element.prototype.insertAdjacentHTML = function (pos, html) {
            switch (pos.toLowerCase()) {
                case 'beforebegin':
                    return Insert.before(this, html);
                case 'afterend':
                    return Insert.after(this, html);
                case 'afterbegin':
                    return Insert.atStart(this, html);
                case 'beforeend':
                    return Insert.atEnd(this, html);
            }
        };

        return Insert;
    }());

    /**
     * @name getScrollOffset
     * @description
     * @params window
     * @return {x:Number,y:Number}
     * @example
     *
     * */
    function getScrollOffset(w) {
        w = w || window;
        // IE9+
        if (w.pageXOffset != null) {
            return {x: w.pageXOffset, y: w.pageYOffset};
        }
        // 对标准模式下的IE
        var d = w.document;
        if (document.compatMode == 'CSS1Compat') {
            return {x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop};
        }
        // 对怪异模式下的浏览器
        return {x: d.body.scrollLeft, y: d.body.scrollTop};
    }

    /**
     * @name getWindowSize
     * @description
     * @params window
     * @return {w:Number,h:Number}
     * @example
     *
     * */
    function getWindowSize(w) {
        w = w || window;
        // IE9+
        if (w.innerWidth != null) {
            return {w: w.innerWidth, h: w.innerHeight};
        }
        // 对于标准模式下的IE
        var d = w.document;
        if (document.compatMode == 'CSS1Compat') {
            return {w: d.documentElement.clientWidth, h: d.documentElement.clientHeight};
        }
        // 对于怪异模式下的IE
        return {w: d.body.clientWidth, h: d.body.clientHeight};
    }

    /**
     * @name getPosition
     * @description 返回元素的几何位置
     * @params Element
     * @return
     * @example
     *
     * */
    function getPosition(elt) {
        var box = elt && elt.getBoundingClientRect();
        var offset = getScrollOffset();
        return elt && {
                l: box.left + offset.x,
                t: box.top + offset.y,
                w: box.width || box.right - box.left ,
                h: box.height || box.bottom - box.top
            }
    }


    /**
     * @name addEvent
     * @description 添加事件监听
     * @params
     * @return
     * @example
     *
     * */
    var addEvent = (function(w){
        if(w.addEventListener){
            return function(el,ev,fn){
                el.addEventListener(ev,fn,false) ;
            }
        }else if(w.attachEvent){
            return function(el,ev,fn){
                el.attachEvent('on'+ev,fn) ;
            }
        }else{
            return function(el,ev,fn){
                el['on'+ev] = fn ;
            }
        }
    }(window)) ;

    /**
     * @name removeEvent
     * @description 移除事件监听
     * @params
     * @return
     * @example
     *
     * */
    var removeEvent = (function(w){
        if(w.removeEventListener){
            return function(el,ev,fn){
                el.removeEventListener(ev,fn,false) ;
            }
        }else if(w.detachEvent){
            return function(el,ev,fn){
                el.detachEvent('on'+ev,fn) ;
            }
        }else{
            return function(el,ev){
                el['on'+ev] = null ;
            }
        }
    }(window)) ;



    // 开放对外接口
    return {
        // 节点插入
        Insert: Insert,
        // 获取窗口的视口尺寸
        getWindowSize: getWindowSize,
        //获取滚动条位置
        getScrollOffset: getScrollOffset,
        // 获取元素的尺寸以及位置
        getPosition: getPosition,
        // 添加事件监听
        addEvent:addEvent,
        // 移除事件监听
        removeEvent:removeEvent
    }
}());