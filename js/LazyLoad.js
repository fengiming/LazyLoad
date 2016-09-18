/**
 * Created by ZOUFENG186 on 2016-09-18.
 */
/**
 * @name lazyLoad
 * @description 懒加载
 * @param {HTMLImageElement|HTMLCollection} nodeList 节点集合或者单个节点
 * @param {Object} opts
 * @example
 *
 * lazyLoad($('img'),{
 *      threshold: 0, // 距离底部多少开始加载
        srcAttr: 'data-lazy-src', // 图片地址属性
        animate: false, // 是否支持动画
        animatePro: null, // 动画属性对象
        animateOpts: null // 动画选项对象
 * }) ;
 * */
var lazyLoad = (function () {
    var _lazyLoad,
        _onScroll,
        isInsideWindow,
        loadImage,
        lazyOpts,
        _isImageNode,
        _isImageNodeList;
    // 默认懒加载选项
    lazyOpts = {
        threshold: 0, // 距离底部多少开始加载
        srcAttr: 'data-lazy-src', // 图片地址属性
        animate: false, // 是否支持动画
        animatePro: null, // 动画属性对象
        animateOpts: null // 动画选项对象
    };
    // 判断目标对象是否显示在窗口中
    isInsideWindow = function (elt) {
        var box = elt && elt.getBoundingClientRect();
        var windowH = $(window).height();
        /*
         * 图片上边缘减去临界值在窗口底部之上 或者 图片下边缘减去临界值在窗口底部之上 返回 true
         * 否则返回false
         */
        if ((box.top - lazyOpts.threshold) <= windowH
            || (box.bottom - lazyOpts.threshold) <= windowH) {
            return true;
        }
        return false;
    };
    // 加载图片处理
    loadImage = function (imageNode, srcAttr) {
        if (imageNode && (srcAttr = imageNode.getAttribute(srcAttr)))
            imageNode.src = srcAttr;
        if (lazyOpts.animate) {
            $(imageNode).one('load', function () {
                lazyOpts.animatePro
                && lazyOpts.animateOpts
                && $(this).animate(lazyOpts.animatePro, lazyOpts.animateOpts);
            });
        }
    };
    // 判断一个节点是否是图片节点
    _isImageNode = function (elt) {
        if (!elt) {
            return false;
        }
        return elt.tagName && elt.tagName.toLowerCase() === 'img';
    };
    // 判断一个集合是否是图片节点集合
    _isImageNodeList = function (nodeList) {
        for (var i = 0, elt; elt = nodeList[i]; i++) {
            if (!_isImageNode(elt)) {
                return false;
            }
        }
        return true;
    };
    // 返回一个合法的节点nodeList 
    _nomalizeNodeList = function (nodeList) {
        if ('length' in nodeList && _isImageNodeList(nodeList)) {
            return nodeList;
        }
        if (!('length' in nodeList) && _isImageNode(nodeList)) {
            return [nodeList];
        }
        return [];
    };
    // 懒加载实现逻辑
    _lazyLoad = function (nodeList, opts) {
        var elems = [];
        if (!nodeList) {
            return;
        }
        elems = _nomalizeNodeList(nodeList);
        if (elems.length === 0) {
            return;
        }
        // 混合选项
        $.extend(lazyOpts, opts);
        // 滚动逻辑处理
        _onScroll = function () {
            // 过滤掉已经显示的节点
            elems = [].filter.call(elems, function (imageNode) {
                /* 若节点显示在窗口中，则加载图片 */
                if (isInsideWindow(imageNode)) {
                    loadImage(imageNode, lazyOpts.srcAttr);
                    return false;
                }
                return true;
            });
            // 若全部加载完，则移除事件监听
            if (elems.length === 0) {
                $(window).off('scroll resize', _onScroll);
            }
        };
        /* 监听浏览器滚动和调整浏览器窗口事件 */
        $(window).on('scroll resize', _onScroll);

        /* 初始执行一次 */
        _onScroll();
    };

    return _lazyLoad;
}());
