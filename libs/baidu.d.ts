declare module swan {
    /**
     * 使手机发生较长时间的振动（400ms）    
     * @param object  
     */
    export function vibrateLong(object: _swapVibrateLong): void;

    /**
     * 使手机发生较短时间的振动（15ms），仅在 iPhone 7/7 Plus 以上及 Android 机型生效。
     * @param object 
     */
    export function vibrateShort(object: _swapVibrateShort): void;

    /**
     * 设置是否打开调试开关，此开关对正式版也能生效。
     * @param object 
     */
    export function setEnableDebug(object: _setEnableDebug): void;


    export function createBannerAd(object: _createBannerAd): _bannerAd;

    export function createRewardedVideoAd(object: _createRewardedVideoAd): _videoAd;

    export function getSystemInfoSync(): _getSystemInfoSync;
}



interface _swapVibrateLong {
    success(): void;
    fail(): void;
}

interface _swapVibrateShort {
    success(): void;
    fail(): void;
}

interface _setEnableDebug {
    /**
     * enableDebug	Boolean	是		是否打开调试
     */
    enableDebug: boolean;
    /**
     * 接口调用成功的回调函数，仅支持 Andriod。
     */
    success?(): void;
    /**
     * 接口调用失败的回调函数，仅支持 Andriod。
     */
    fail?(): void;

    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行），仅支持 Andriod。
     */
    complete?(): void;

}

interface _createBannerAd {
    /**
     * 广告位 ID （开发者在 Mssp 平台建立的代码位的 ID https://smartprogram.baidu.com/docs/game/introduction/flow_open/guide/)
     */
    adUnitId: string;
    /**
     * 应用 ID （开发者在 Mssp 平台建立的代码位所属应用的 ID https://smartprogram.baidu.com/docs/game/introduction/flow_open/guide/）
     */
    appSid: string;
    /**
     * banner 样式
     */
    style: _baiduBannerStyle;
}

interface _baiduBannerStyle {
    /**
     * banner 广告左上角的纵坐标值
     */
    left: number;
    /**
     * banner 广告左上角的横坐标值
     */
    top: number;
    /**
     * 	banner 广告的宽度
     */
    width: number;

    /**
     * banner 广告的高度
     */
    height?: number;
}

interface _bannerAd {
    /**
     * show() 是 BannerAd 对象的方法，用于展示 banner 广告组件，返回一个 promise 对象。
     */
    show: () => any;

    /**
     * hide() 是 BannerAd 对象的方法，用来隐藏已展示的 banner 广告组件，该方法没有返回值。
     */
    hide: () => void;

    /**
     * onLoad() 是 BannerAd 对象的方法，监听 banner 广告组件的加载事件。
     */
    onLoad: (func: Function) => void;

    /**
     * offLoad() 是 BannerAd 对象的方法，用于取消监听 banner 广告组件的加载事件。
     */
    offLoad: (func: Function) => void;

    /**
     * onError() 是 BannerAd 对象的方法，监听 banner 广告的错误事件。
     */
    onError: (func: Function) => void;

    /**
     * offError() 是 BannerAd 对象的方法，用于取消监听 banner 广告的错误事件。
     */
    offError: (func: Function) => void;

    /**
     * onResize() 是 BannerAd 对象的方法，监听 banner 广告位尺寸变化的事件。
     */
    onResize: (func: Function) => void;

    /**
     * offResize() 是 BannerAd 对象的方法，用于取消监听 banner 广告位尺寸变化的事件。
     */
    offResize: (func: Function) => void;

    /**
     * destroy() 是 BannerAd 对象的方法，用于销毁 banner 广告组件，该方法没有返回值。
     */
    destroy: () => void;

    style : _baiduBannerStyle; 
}

interface _createRewardedVideoAd {
    // 广告位 ID
    adUnitId: string;
    //应用 ID 
    appSid: string;
}

interface _videoAd {
    /**
    * load() 是 RewardedVideoAd 对象的方法，返回一个 promise 对象。
    */
    load: () => any;

    /**
     * show() 是 RewardedVideoAd 对象的方法，返回一个 promise 对象。
     */
    show: () => any;

    /**
     * onLoad() 是 RewardedVideoAd 对象的方法，监听激励视频的加载事件。
     */
    onLoad: (func: Function) => any;

    /**
     * offLoad() 是 RewardedVideoAd 对象的方法，用于取消监听激励视频的加载事件。
     */
    offLoad: (func: Function) => any;

    /**
     * onError() 是 RewardedVideoAd 对象的方法，监听激励视频的错误事件
     */
    onError: (func: Function) => any;

    /**
     * offError() 是 RewardedVideoAd 对象的方法，用于取消监听激励视频的错误事件。
     */
    offError: (func: Function) => any;

    /**
     * onClose() 是 RewardedVideoAd 对象的方法，监听用户点击关闭广告按钮的事件。
     */
    onClose: (func: Function) => any;
    /**
     * offClose() 是 RewardedVideoAd 对象的方法，用于取消监听点击关闭广告按钮的事件。
     */
    offClose: (func: Function) => any;
}

declare enum _baiduErrCode {
    //appSid 缺失
    c103010 = 103010,
    //错误，MSSP 未收录
    c103011 = 103011,
    // 无效，MSSP 上未生效 
    c103012 = 103012,
    //无效，渠道 ID 信息错误
    c103020 = 103020,
    //缺失
    c107000 = 107000,
    //未收录
    c107001 = 107001,
    //未启用
    c107002 = 107002,
    //与 appSid 不匹配
    c107003 = 107003,
    //无广告返回
    c200000 = 200000,
    //无广告数据
    c201000 = 201000,
    //广告组件挂载失败
    c3010000 = 3010000,
    //广告请求失败
    c3010002 = 3010002,
    //网络连接错误
    c3010003 = 3010003,
    //没有可以展示的广告
    c3010004 = 3010004,
    //广告正在拉取中，不能重复请求
    c3010005 = 3010005,
    //广告正在展示中，不能请求广告
    c3010006 = 3010006,
    //广告请求参数为空
    c3010007 = 3010007,
    //激励视频播放地址为空
    c3010008 = 3010008,
    //激励视频重复初始化错误
    c3010009 = 3010009,
    //没有可以展示的 banner 广告
    c3010010 = 3010010,

}

interface _getSystemInfoSync {
    //	手机品牌
    brand: string;
    //手机型号
    model: string;
    //设备像素比
    pixelRatio: number;
    //屏幕宽度
    screenWidth: number;
    //屏幕高度
    screenHeight: number;
    //可使用窗口宽度
    windowWidth: number;
    //可使用窗口高度
    windowHeight: number;
    //状态栏的高度
    statusBarHeight: number;
    //导航栏的高度
    navigationBarHeight: number;
    //百度 App 设置的语言
    language: string;
    //百度 App 版本号
    version: string;
    //操作系统版本
    system: string;
    //客户端平台
    platform: string;
    //用户字体大小设置
    fontSizeSetting: number;
    //客户端基础库版本
    SDKVersion: string;
    //宿主平台，如：baiduboxapp
    host: string;
    //宿主平台版本号
    swanNativeVersion: string;
    //屏幕密度
    devicePixelRatio: string;
}