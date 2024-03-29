import { JsbBase, AdvertType, SwitchType } from "./JsbBase";
import PubUtils from "../common/PubUtils";

export default class JsbOppoMiniGame extends JsbBase {
    public AppId: string = "30219614";

    public OpenScreenId: string = "138492";

    public BannerId: string = "138485";

    public RewardedVideoId: string = "138489";

    public InsertId: string = "138487";


    public isCachedVideo: boolean = false;


    public insertAd: any = null;

    public isCachedInsert: boolean = false;

    public isShowIntertView: boolean = true;

    public BannerErrCount: number = 0;

    public VoideErrCount: number = 0;

    public InsertErrCount: number = 0;

    public ErrZCount: number = 3;

    public bannerAd: _BannerAd;

    public videoAd: _VideoAd;

    public audio: any;

    public is_auto_close_banner: boolean = true;

    insertCnt: number = 8;
    bannerCnt: number = 5;
    insertCd: boolean = false;

    public openAdvert(type: AdvertType) {
        switch (type) {
            case AdvertType.OpenScreen: {
                console.log("初始化");
                this.openSplashAd();
                break;
            }

            case AdvertType.ExcitationVideo: {
                this.showRewardVideo();
                break;
            }

            case AdvertType.TableScreen: {
                this.showInstertView();
                break;
            }
        }
    }


    public openSplashAd() {
        this.initFlag();
        this.initOppoAd();
    }

    public initFlag() {
        let day = new Date().getDate();
        /**
         * 使用天来判断    天数相同   直接使用本地保存的次数就行 不用另做处理
         */
        let localday = PubUtils.GetLocalData("curDay");
        if (localday == null || localday == "" || day != localday) {
            console.log("初始化广告次数参数");
            PubUtils.SetLocalData("curDay", day);
            PubUtils.SetLocalData("instertCount", this.insertCnt);
            PubUtils.SetLocalData("bannerCount", this.bannerCnt);
        }
    }

    public openRewardVideo() {
        this.showRewardVideo();
    }

    public getIntertCount(): number {
        let c = PubUtils.GetLocalData("instertCount");
        return +c||0;
    }

    /**
     * 获取是否可以展示插屏
     */
    // public getIsShowInstert(): number {
    //     let day = new Date().getDate();
    //     let count = 0;
    //     let localday = PubUtils.GetLocalData("curDay");
    //     if (localday == null || localday == "" || day != localday) {
    //         PubUtils.SetLocalData("curDay", day);
    //         PubUtils.SetLocalData("instertCount", 100);
    //         count = 8;
    //     } else {
    //         count = this.getIntertCount();
    //     }
    //     return count;
    // }

    public subInstertCount(): void {
        let c = this.getIntertCount();
        if (c == 0) return;
        c--;
        PubUtils.SetLocalData("instertCount", c);
    }

    public initOppoAd() {
        let self = this;
        qg.initAdService({
            appId: this.AppId,
            isDebug: false,
            success: (res) => {
                // console.log("success " + JSON.stringify(res));
                Laya.timer.once(10 * 1000, self, () => {
                    self.openBannerView();
                })
                this.loadRewardVide();

                // console.log("---------------------------------------------------");
                self.loadInsert();
                // this.loadInsert();
            },
            fail: (res) => {
                // console.log("fail:" + res.code + res.msg);
            },
            complete: (res) => {
                // console.log("complete " + JSON.stringify(res));
                // this.openBannerView();
            }
        });
    }

    public openBannerView() {
        // console.log("openBannerView");
        this.clearBanner();
        if (this.BannerErrCount >= this.ErrZCount) return console.log("加载超时-----banner");
        let self = this;
        if (this.bannerAd == null) {
            let bannerAd = qg.createBannerAd(
                { posId: this.BannerId }
            );

            bannerAd.onShow(() => {
                console.log('banner 广告显示');
                this.BannerErrCount = 0;
            });

            bannerAd.onHide(() => {
                // console.log('banner 广告隐藏');
                // Laya.timer.once(1000 * 60, self, () => {
                //     this.openBannerView();
                // })
                console.log("是否是用户自己关闭baner", this.is_auto_close_banner)
                if (this.is_auto_close_banner) {
                    this.subBannerCount();
                }
                this.is_auto_close_banner = true;
            });

            bannerAd.onError(function (err) {
                console.log("banner 打开失败   " + JSON.stringify(err));
                self.BannerErrCount++;
                bannerAd.offError(null);

                // Laya.timer.once(1000 * 60, self, () => {
                //     self.openBannerView();
                // })

            })

            // bannerAd.onError((err) => { console.log(err) });
            this.bannerAd = bannerAd;
            this.showBanner();
        }
    }

    public clearBanner() {
        if (this.bannerAd) {
            this.bannerAd.offError(() => {

            });

            this.bannerAd.offHide(() => {

            })

            this.bannerAd.offShow(() => {

            })
            this.bannerAd = null;
        }
    }

    hideBanner() {
        console.log("隐藏banner广告")
        this.is_auto_close_banner = false;
        Laya.timer.once(1000, this, ()=> {
            this.is_auto_close_banner = true;
        })
        this.bannerAd.hide();
    }
    
    showBanner() {
        let count = this.getBannerCount();
        if (count == 0) {
            console.log("banner达到玩家关闭上限");
            return;
        }
        this.bannerAd && this.bannerAd.show();
    }

    subBannerCount() {
        let c = this.getBannerCount();
        if (c == 0) return;
        c--;
        PubUtils.SetLocalData("bannerCount", c);
    }

    public getBannerCount(): number {
        let c = PubUtils.GetLocalData("bannerCount");
        console.log("banner剩余次数",c+",",+c);
        return +c||0;
    }

    public loadRewardVide() {
        if (this.VoideErrCount >= this.ErrZCount) return console.log("加载超时-----video");
        this.clearRewardVideo();
        if (this.videoAd == null) {
            let videoAd = qg.createRewardedVideoAd({ posId: this.RewardedVideoId });

            videoAd.load();

            videoAd.onLoad(() => {
                console.log('激励视频加载成功');
                this.isCachedVideo = true;
                this.VoideErrCount = 0;
            });
            let self = this;
            videoAd.onError((err) => {
                console.log("激励视频打开失败" + JSON.stringify(err));
                AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + "," + 0);
                this.clearRewardVideo();
                this.VoideErrCount++;
                Laya.timer.once(1000 * 60, self, () => {
                    this.loadRewardVide();
                });
            });

            videoAd.onVideoStart(() => {
                console.log('激励视频 开始播放');
            });

            videoAd.onClose((res) => {
                if (res.isEnded) {
                    console.log('激励视频广告完成，发放奖励');
                    AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + ",1");
                } else {
                    console.log('激励视频广告取消关闭，不发放奖励')
                    AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + ",0");
                }

                this.clearRewardVideo();
                setTimeout(() => {
                    this.loadRewardVide();
                }, 200);
            });

            this.videoAd = videoAd;
        }
    }

    public showRewardVideo() {
        if (this.videoAd && this.isCachedVideo) {
            this.isCachedVideo = false;
            this.videoAd.show();
        }
    }

    public clearRewardVideo() {
        if (this.videoAd) {
            this.videoAd.offError(() => { });
            this.videoAd.offLoad(() => { });
            this.videoAd.offRewarded(() => { });
            this.videoAd.offVideoStart(() => { });
            this.videoAd.destroy();
            this.videoAd = null;
        }
    }

    public getIsCachedVideo(): boolean {
        return this.isCachedVideo;
    }

    public loadInsert() {
        // console.log("loadInsert   加载插屏");
        // if (this.InsertErrCount >= this.ErrZCount) return console.log("加载超时-----loadInsert");
        // if (this.insertAd == null) {
        //     let self = this;
        //     let insertAd = qg.createInsertAd({
        //         posId: this.InsertId
        //     });
        //     insertAd.load();
        //     insertAd.onLoad(() => {
        //         console.log('插屏广告加载');
        //         // alert("插屏广告加载" );
        //         self.isCachedInsert = true;
        //         self.InsertErrCount = 0;
        //     });
        //     insertAd.onShow(() => {
        //         console.log('插屏广告展示');
        //         // AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo, 1);
        //         self.InsertErrCount = 0;
        //         self.clearInsert();
        //     });
        //     insertAd.onError((err) => {
        //         self.InsertErrCount++;
        //         console.log("插屏打开失败" + JSON.stringify(err));
        //         // alert("插屏打开失败"  + JSON.stringify(err));
        //         Laya.timer.once(1000 * 60, self, () => {
        //             self.clearInsert();
        //             self.loadInsert();
        //         });
        //     });
        //     this.insertAd = insertAd;
        // }
    }

    //插屏广告一分钟只能有一次
    isInsertCd() {
        let bol = this.insertCd;
        if (!this.insertCd) {
            this.insertCd = true;
            Laya.timer.once(60*1000, this, ()=> {
                this.insertCd = false;
            })
        }
        return bol;
    }

    insertNone() {
        AndroidToJs.CallJs("no_insert_play_push", null);
    }

    public showInstertView() {
        if (this.InsertErrCount >= this.ErrZCount) return console.log("加载超时-----loadInsert");

        let count = this.getIntertCount();

        if (count == 0) {
            this.insertNone();
            console.log("插屏广告达到当日上限");
            return;
        }

        if (this.isInsertCd()) {
            this.insertNone();
            console.log("插屏广告冷却中");
            return;
        }

        if (this.insertAd == null) {
            console.log("showInstarview 加载插屏");
            let self = this;
            let insertAd = qg.createInsertAd({
                posId: this.InsertId
            });

            this.insertAd = insertAd;
            insertAd.load();
            insertAd.onLoad(() => {
                console.log('插屏广告加载');
                // alert("插屏广告加载" );
                self.isCachedInsert = true;
                self.InsertErrCount = 0;
                insertAd.show();
            });

            insertAd.onShow(() => {
                console.log('插屏广告展示');
                self.InsertErrCount = 0;
                this.subInstertCount();
                self.clearInsert();
            });

            insertAd.onError((err) => {
                self.InsertErrCount++;
                console.log("插屏打开失败" + JSON.stringify(err));
                Laya.timer.once(1000 * 60, self, () => {
                    self.clearInsert();
                });
            });
        } else {
            console.log("showInstertView ---------- 清理上次的对象")
            this.insertAd.destroy();
            this.insertAd = null;
        }
    }

    public clearInsert() {
        if (this.insertAd) {
            this.insertAd.offError();
            this.insertAd.offLoad();
            this.insertAd.offShow();
            this.insertAd = null;
        }
        this.isCachedInsert = false;
    }

    public openVibrate() {
        qg.vibrateShort({
            success: () => {
                console.log("openVibrate   success");
                // console.log(JSON.stringify(res));
            },
            fail: () => {
                console.log("openVibrate   fail");
                // console.log(JSON.stringify(res));
            },
            complete: () => {
                console.log("openVibrate   complete");
                // console.log(JSON.stringify(res));
            }
        });
    }

    public openVibrateShort() {
        qg.vibrateShort({
            success: () => {
                console.log("openVibrateShort   success");
                // console.log(JSON.stringify(res));
            },
            fail: () => {
                console.log("openVibrateShort   fail");
                // console.log(JSON.stringify(res));
            },
            complete: () => {
                console.log("openVibrateShort   complete");
                // console.log(JSON.stringify(res));
            }
        });
    }

    public openVibrateLong() {
        qg.vibrateLong({
            success: (res) => {
                console.log("openVibrateLong   success");
                console.log(JSON.stringify(res));
            },
            fail: (res) => {
                console.log("openVibrateLong   fail");
                console.log(JSON.stringify(res));
            },
            complete: (res) => {
                console.log("openVibrateLong   complete");
                console.log(JSON.stringify(res));
            }
        });
    }

    public playMusic(url: string, loop: number = 0) {
        if (this.audio == null) {
            var audio = qg.createInnerAudioContext();
            audio.loop = loop == 0;
            audio.volume = 1;
            audio.autoplay = false;
            var playSound = function () {
                audio.play();
                audio.offCanplay(playSound);
            };
            audio.onCanplay(playSound);
            audio.src = url;
            this.audio = audio;
        } else {
            this.audio.play();
        }
    }

    public stopMusic() {
        if (this.audio) {
            this.audio.pause();
        }
    }

    public playSound(url: string, v: number = 1) {
        var audio = qg.createInnerAudioContext();
        audio.loop = false;
        audio.volume = 0.7;
        audio.autoplay = false;
        var playSound = function () {
            audio.play();
            audio.offCanplay(playSound);
        };
        audio.onCanplay(playSound);
        audio.src = url;
    }

    public checkIsMiGame(callback: Function) {
        qg.getSystemInfo({
            success: (res) => {
                if (res.platformVersion >= 1044) {
                    callback(SwitchType.On);
                } else {
                    callback(SwitchType.Off);
                }
            },
            fail: () => {

            },
            complete: () => {

            }
        })
    }

    public openGame(name: string) {
        //pkgName: `com.kzy.${name}.nearme.gamecenter`
        qg.navigateToMiniGame({
            pkgName: name

        });
    }

    public sendDesktop(func: Function) {
        console.log("-sendDesktop-------------------");
        qg.installShortcut({
            success: function (res) {
                console.log("sendDesktop   success");
                console.log(JSON.stringify(res));
                func(1)
            },
            fail: function (err) {
                console.log("sendDesktop   err");

                console.log(JSON.stringify(err));
                func(0)
            },
            complete: function (res) {
                console.log("sendDesktop   complete");
                console.log(JSON.stringify(res));
            }
        })
    }

    public getIsDesktop() {
        return true;
    }

    public hasShortcutInstalled(callback: Function) {
        qg.getSystemInfo({
            success: (res) => {
                if (res.platformVersion >= 1044) {
                    qg.hasShortcutInstalled({
                        success: (res) => {
                            callback(res);
                        },
                        fail: () => {

                        },
                        complete: () => {

                        }
                    })
                } else {
                    callback(0);
                }
            },

            fail: () => { },
            complete: () => { }
        })

    }
}