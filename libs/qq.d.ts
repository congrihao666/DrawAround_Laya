

declare namespace qq {
    export function vibrateShort(obj: any);

    export function vibrateLong(obj: any);

    export function loadSubpackage(obj: any);

    export function createInnerAudioContext(): InnerAudioContext;

    export function onAudioInterruptionEnd(callback: Function);

    export function showShareMenu(obj: any);

    export function onShareAppMessage(obj: any);

    /**
     * 设置 InnerAudioContext 的播放选项。设置之后对当前小程序全局生效。
     * mixWithOther 是否与其他音频混播，设置为 true 之后，不会终止其他应用或QQ内的音乐
     * obeyMuteSwitch（仅在 iOS 生效）是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音
     * @param obj {mixWithOther:boolean,obeyMuteSwitch:boolean,success:function,fail:function,complete:function}
     */
    export function setInnerAudioOption(obj: any);

    export function getSystemInfoSync(): _qqSystemInfoSync;

    export function getSystemInfo(object: any): void;

    export function createCanvas();

    export function shareAppMessage(obj: any);

    export function createBannerAd(obj: _qqCreateBannerAd): _qqBanner;

    export function createRewardedVideoAd(obj: any): _qqVideo;

}

interface _qqSystemInfoSync {
    /**
     * 设备品牌
     */
    brand: string;
    /**
     * 设备型号	
     */
    model: string
    /**
     * 	设备像素比	
     */
    pixelRatio: number
    /**
     * 屏幕宽度，单位dp	
     */
    screenWidth: number
    /**
     * 屏幕高度，单位dp	
     */
    screenHeight: number
    /**
     * 可使用窗口宽度，单位dp	
     */
    windowWidth: number
    /**
     * 可使用窗口高度，单位dp	
     */
    windowHeight: number
    /**
     * 状态栏的高度，单位dp	
     */
    statusBarHeight: number
    /**
     * QQ设置的语言	
     */
    language: string
    /**
     * 	QQ版本号	
     */
    version: string
    /**
     * 操作系统及版本	
     */
    system: string
    /**
     * 客户端平台	
     */
    platform: string
    /**
     * 用户字体大小（单位px）。以QQ客户端「我-设置-通用-字体大小」中的设置为准	
     */
    fontSizeSetting: number
    /**
     * 客户端基础库版本	
     */
    SDKVersion: string
    /**
     * 设备性能等级（仅Android小游戏）。取值为：-2 或 0（该设备无法运行小游戏），-1（性能未知），>=1（设备性能值，该值越高，设备性能越好，目前最高不到50）	
     */
    benchmarkLevel: number
    /**
     * 允许QQ使用相册的开关（仅 iOS 有效）	
     */
    albumAuthorized: boolean
    /**
     * 允许QQ使用摄像头的开关	
     */
    cameraAuthorized: boolean
    /**
     * 	允许QQ使用定位的开关	
     */
    locationAuthorized: boolean
    /**
     * 允许QQ使用麦克风的开关	
     */
    microphoneAuthorized: boolean
    /**
     * 允许QQ通知的开关（仅 iOS 有效）	
     */
    notificationAuthorized: boolean
    /**
     * 允许QQ通知带有提醒的开关（仅 iOS 有效）	
     */
    notificationAlertAuthorized: boolean
    /**
     * 允许QQ通知带有标记的开关（仅 iOS 有效）	
     */
    notificationBadgeAuthorized: boolean
    /**
     * 允许QQ通知带有声音的开关（仅 iOS 有效）	
     */
    notificationSoundAuthorized: boolean
    /**
     * 蓝牙的系统开关
     */
    bluetoothEnabled: boolean
    /**
     * 地理位置的系统开关	
     */
    locationEnabled: boolean
    /**
     * Wi-Fi 的系统开关	
     */
    wifiEnabled: boolean
    /**
     * 右上角胶囊位置 (仅Android小游戏)
     */
    navbarPosition: object
}

interface InnerAudioContext {
    /**
     * 音频资源的地址，用于直接播放。
     */
    src: string;

    /**
     * 开始播放的位置（单位：s），默认为 0
     */
    startTime: number;

    /**
     * 是否自动开始播放，默认为 false
     */
    autoplay: boolean;

    /**
     * 是否循环播放，默认为 false
     */
    loop: boolean;

    /**
     * 音量。范围 0~1。默认为 1
     */
    volume: number;

    /**
     * 当前音频的长度（单位 s）。只有在当前有合法的 src 时返回（只读）
     */
    duration: number;

    /**
     * 当前音频的播放位置（单位 s）。只有在当前有合法的 src 时返回，时间保留小数点后 6 位（只读）
     */
    currentTime: number;

    /**
     * 当前是是否暂停或停止状态（只读）
     */
    paused: boolean;

    /**
     * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲（只读）
     */
    buffered: number;

    /**
     * 播放
     */
    play: () => void;

    /**
     * 暂停。暂停后的音频再播放会从暂停处开始播放
     */
    pause: () => void;

    /**
     * 停止。停止后的音频再播放会从头开始播放
     */
    stop: () => void;

    /**
     * 跳转到指定位置
     */
    seek: (position: number) => void;

    /**
     * 销毁当前实例
     */
    destroy: () => void;

    /**
     * 监听音频进入可以播放状态的事件。但不保证后面可以流畅播放
     */
    onCanplay: (callback: Function) => void;

    /**
     * 取消监听音频进入可以播放状态的事件
     */
    offCanplay: (callback: Function) => void;

    /**
     * 监听音频播放事件
     */
    onPlay: (callback: Function) => void;

    /**
     * 取消监听音频播放事件
     */
    offPlay: (callback: Function) => void;

    /**
     * 监听音频暂停事件
     */
    onPause: (callback: Function) => void;

    /**
     * 取消监听音频暂停事件
     */
    offPause: (callback: Function) => void;

    /**
     * 监听音频停止事件
     */
    onStop: (callback: Function) => void;

    /**
     * 取消监听音频停止事件
     */
    offStop: (callback: Function) => void;

    /**
     * 监听音频自然播放至结束的事件
     */
    onEnded: (callback: Function) => void;

    /**
     * 取消监听音频自然播放至结束的事件
     */
    offEnded: (callback: Function) => void;

    /**
     * 监听音频播放进度更新事件
     */
    onTimeUpdat: (callback: Function) => void;

    /**
     * 取消监听音频播放进度更新事件
     */
    offTimeUpdate: (callback: Function) => void;

    /**
     * 监听音频播放错误事件
     */
    onError: (callback: Function) => void;

    /**
     * 取消监听音频播放错误事件
     */
    offError: (callback: Function) => void;

    /**
     * 监听音频加载中事件。当音频因为数据不足，需要停下来加载时会触发
     */
    onWaiting: (callback: Function) => void;

    /**
     * 取消监听音频加载中事件
     */
    offWaiting: (callback: Function) => void;

    /**
     * 监听音频进行跳转操作的事件
     */
    onSeeking: (callback: Function) => void;

    /**
     * 取消监听音频进行跳转操作的事件
     */
    offSeeking: (callback: Function) => void;

    /**
     * 监听音频完成跳转操作的事件
     */
    onSeeked: (callback: Function) => void;

    /**
     * 取消监听音频完成跳转操作的事件
     */
    offSeeked: (callback: Function) => void;
}

interface _qqCreateBannerAd {
    /**
    * 广告单元 id
    */
    adUnitId: string;

    style: _qqBannerStyle;

    //指定要测试的广告规格，该属性仅在开发者工具有效	1.4.0
    testDemoType?: string;
}

interface _qqBanner {
    /**
     * 显示 banner 广告。
     */
    show: () => any;

    /**
     * 监听 banner 广告尺寸变化事件
     */
    onResize: (callback: Function) => void;

    /**
     * 监听 banner 广告加载事件
     */
    onLoad: (callback: Function) => void;

    /**
     * 监听 banner 广告错误事件
     */
    onError: (callback: Function) => void;

    /**
     * 取消监听 banner 广告尺寸变化事件
     */
    offResize: (callback: Function) => void;

    /**
     * 取消监听 banner 广告加载事件
     */
    offLoad: (callback: Function) => void;

    /**
     * 取消监听 banner 广告错误事件
     */
    offError: (callback: Function) => void;

    /**
     * 隐藏 banner 广告
     */
    hide: () => void;

    /**
     * 销毁 banner 广告
     */
    destroy: () => void;

    style:_qqBannerStyle;
}

interface _qqBannerStyle {
    /**
     * banner 广告左上角的纵坐标值
     */
    left?: number;
    /**
     * banner 广告左上角的横坐标值
     */
    top?: number;
    /**
     * banner 广告组件的宽度。最小 300，最大至 屏幕宽度（屏幕宽度可以通过 qq.getSystemInfoSync() 获取）。
     */
    width?: number;

    /**
     * banner 广告的高度
     */
    height?: number;
}

interface _qqVideo {
    /**
     * 加载隐藏激励视频
     */
    load: () => any;

    /**
     * 取消监听用户点击 关闭广告 按钮的事件
     */
    offClose: (callback: Function) => void;

    /**
     * 取消监听激励视频错误事件
     */
    offError: (callback: Function) => void;

    /**
     * 取消监听激励视频广告加载事件
     */
    offLoad: (callback: Function) => void;

    /**
     * 监听用户点击 关闭广告 按钮的事件
     */
    onClose: (callback: Function) => void;

    /**
     * 监听激励视频错误事件
     */
    onError: (callback: Function) => void;

    /**
     * 监听激励视频广告加载事件
     */
    onLoad: (callback: Function) => void;

    /**
     * 显示激励视频广告。激励视频广告将从屏幕下方推入。
     */
    show: () => any;
}
