import { JsbBase, AdvertType } from "./JsbBase";
import g_evnetM from "../common/EventManager";

export class JsbQQMinniGame extends JsbBase {

    audio: InnerAudioContext;

    public BannerId: string = "674c388a429c077300c8593b6b869412";

    public RewardedVideoId: string = "eb8d4d59a32a1213b7dcf065f8e3984b";

    public InsertId: string = "89932";

    public bannerAd: _qqBanner;

    public videoAd: _qqVideo;

    public isCachedVideo: boolean = false;

    public systemInfo: _qqSystemInfoSync;

    public isBannerChange: boolean = false;

    public init() {
        g_evnetM.AddEvent("Active", this, this.onActiveHandle);

        try {
            this.systemInfo = qq.getSystemInfoSync();
            console.log(this.systemInfo);
        } catch (e) {
            qq.getSystemInfo({
                success(res: _qqSystemInfoSync) {
                    this.systemInfo = res;
                }
            });
        }
    }

    public openVibrateLong() {
        qq.vibrateShort({
            fail: (res) => {
                qq.vibrateLong({});
            },
        })
    }

    public playMusic(url: string, loop: number = 0) {
        if (this.audio == null) {
            const audio = qq.createInnerAudioContext();
            audio.src = Laya.URL.basePath + "/" + url; // src 可以设置 http(s) 的路径，本地文件路径或者代码包文件路径
            audio.autoplay = false;
            audio.loop = true;
            var playSound = function () {
                // console.log("播放音效");
                audio.play();
                audio.offCanplay(playSound);
            };
            audio.onCanplay(playSound);
            this.audio = audio;
        } else {
            this.audio.play();
        }
    }

    public onActiveHandle() {
        if (this.audio) {
            this.audio.play();
        }
    }

    public stopMusic() {
        if (this.audio) {
            this.audio.pause();
        }
    }

    public playSound(url) {
        // console.log("playSound -------- " + url);

        let audio = qq.createInnerAudioContext();
        audio.src = Laya.URL.basePath + "/" + url;
        audio.autoplay = false;

        let playSound = function () {
            audio.play();
            audio.offCanplay(playSound);
        };

        audio.onCanplay(playSound);

        // let stopSound = function () {
        //     audio.onStop(stopSound);
        //     audio.destroy();
        // }
        // audio.onStop(stopSound);
    }

    public openAdvert(type: AdvertType) {
        switch (type) {
            case AdvertType.OpenScreen: {
                setTimeout(() => {
                    this.openBanner();
                }, 2 * 1000);

                this.loadRewardVideo();
                break;
            }
            case AdvertType.ExcitationVideo: {
                this.showRewardVideo();
                break;
            }
        }
    }

    public openBanner() {
        if (this.bannerAd) return;
        console.log("openBanner");
        let w = 900;
        let h = 60;
        let c = h / w;

        let banner = qq.createBannerAd({
            adUnitId: this.BannerId,
            style: {
                width: 300, height: 72, left: 0, top: this.systemInfo.windowHeight
            }
        });
        this.bannerAd = banner;
        banner.onResize((size: Laya.Size) => {
            // bannerAd.style.top = 76;              
            // bannerAd.style.left = 320;
            console.log(size);
            if (!this.isBannerChange) {
                this.isBannerChange = true;
                // banner.style.width = this.systemInfo.windowWidth;
                // banner.style.height = banner.style.width * c;
                banner.style.top = this.systemInfo.windowHeight - size.height;

                banner.style.left = this.systemInfo.windowWidth / 2 - size.width / 2;
                // console.log(banner.style.width, banner.style.height, banner.style.top);
            }
        });

        banner.onLoad(() => {
            console.log("banner onLoad ---");
            banner.show();
        });


        banner.onError((res) => {
            console.log("banner加载失败    " + JSON.stringify(res));
            if (res.errCode == ErrorCode.c1004 || res.errCode == ErrorCode.c1003) {
                this.clearBanner();
                setTimeout(() => {
                    this.openBanner();
                }, 10 * 1000);
            }
        });
    }

    public clearBanner() {
        if (this.bannerAd) {
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }

    public loadRewardVideo() {
        if (this.videoAd == null) {
            console.log("loadRewardVideo");
            let video = qq.createRewardedVideoAd({ adUnitId: this.RewardedVideoId });

            video.onClose((res) => {
                if (res.isEnded) {
                    AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + ",1");
                    console.log("发放奖励");
                } else {
                    AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + ",0");
                }

                setTimeout(() => {
                    this.loadRewardVideo();
                }, 2 * 1000);
            })

            video.onError((res) => {
                console.log("video加载失败    " + JSON.stringify(res));
                if (res.errCode == ErrorCode.c1004 || res.errCode == ErrorCode.c1003) {
                    this.clearRewardVideo();
                    setTimeout(() => {
                        this.loadRewardVideo();
                    }, 10 * 1000);
                }
            });

            video.onLoad(() => {
                console.log("video 加载成功");
                this.isCachedVideo = true;
            });
            this.videoAd = video;
        } else {
            this.videoAd.load();
        }

    }

    public showRewardVideo() {
        this.isCachedVideo = false;
        this.videoAd.show();
    }

    public clearRewardVideo() {
        // if(this.videoAd){
        //     this.videoAd.
        // }
    }

    public getIsCachedVideo() {
        return this.isCachedVideo;
    }
}

export enum ErrorCode {
    /**
     * 后端接口调用失败
     */
    c1000 = 1000,

    /**
     * 参数错误
     */
    c1001,

    /**
     * 广告单元无效
     */
    c1002,

    /**
     * 内部错误
     */
    c1003,

    /**
     * 无合适的广告
     */
    c1004,

    /**
     * 广告组件审核中
     */
    c1005,

    /**
     * 	广告组件被驳回
     */
    c1006,

    /**
     * 广告组件被封禁
     */
    c1007,

    /**
     * 广告单元已关闭
     */
    c1008,


}