# LazyLoad
图片懒加载

#方法
lazyLoad(nodeList,opts) 

#参数说明
nodeList 节点列表或者单个节点
opts 懒加载选项

#opts参数对象

默认值
{
        threshold: 0, // 距离底部多少开始加载
        srcAttr: 'data-lazy-src', // 图片地址属性
        animate: false, // 是否支持动画
        animatePro: null, // 动画属性对象
        animateOpts: null // 动画选项对象
}

# example

    /* 图片懒加载 */
    lazyLoad(document.querySelectorAll ? document.querySelectorAll('img'):document.getElementsByTagName('img'),{
        threshold:-150, // 距离底部多少开始加载
        srcAttr:'data-lazy-src',
        animate:true,
        animatePro:{
            opacity:1
        },
        animateOpts:{
            duration:500,
            easing:'linear'
        }
    }) ;
