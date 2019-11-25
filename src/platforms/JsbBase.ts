export class JsbBase {

    public init() {

    };

    /**
     * 打开 开屏
     */
    public openSplashAd() {

    }

    public getIsCachedVideo(): boolean {
        return false;
    }

    public openRewardVideo() {

    }

    hideBanner() {}
    
    showBanner() {}

    /**
     * 使手机发生较短时间的振动。
     * 某些机型在不支持短振动时会
     */
    public openVibrateShort() {

    }

    /**
     * 使手机发生较长时间的振动。
     */
    public openVibrateLong() {

    }

    public openVibrate() {
    }

    /**
     * 发送到桌面
     */
    public sendDesktop(func: Function) {

    }

    public showInstertView() {

    }

    public hasShortcutInstalled(callBack: Function) {

    }

    /**
     * 获取是否支持创建桌面快捷方式
     */
    public getIsDesktop() {
        return false;
    }

    public openAdvert(type: AdvertType) {
        // AndroidToJs.CallJs("Advertisement", type + "," + 1);

    }

    public playMusic(url: string, loop: number = 0) {
        if (url == "") return console.log("playMusic   背景音乐播放失败  = " + url);
        Laya.SoundManager.playMusic(url, loop);
    }

    public stopMusic() {
        Laya.SoundManager.stopMusic();
    }

    public playSound(url: string, v: number = 1) {
        Laya.SoundManager.playSound(url, v);
    }

    /**
     * 打开其他小游戏
     * @param name 
     */
    public openGame(name: string) {
        console.log(name);
    }

    /**
     * 获取是否支持打开小游戏
     */
    public checkIsMiGame(callback: Function) {
        callback(SwitchType.Off);
    }

    public getHeight(): number {
        return Laya.Browser.height;
    }

    public exitGame(){
        
    }
}


export const enum AdvertType {
    None,

    /**
     * 原生信息流
     */
    NativeMsgFlow,

    /**
     * banner 广告
     */
    Banner,

    /**
     * 插屏广告
     */
    TableScreen,

    /**
     * 原生广告
     */
    Native,

    /**
     * 激励视频广告
     */
    ExcitationVideo,

    /**
     * 全屏视频广告
     */
    FullScreenVideo,

    /**
     * Draw竖版视频信息流广告
     */
    DrawFeedVideo,

    /**
     * 开屏广告
     */
    OpenScreen,
}


export const enum SwitchType {
    None,
    /**
     * 开
     */
    On,
    /**
     * 关
     */
    Off
}