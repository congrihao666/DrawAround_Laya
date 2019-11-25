import { JsbBase, AdvertType, SwitchType } from "./JsbBase";

export default class JsbVivoMiGame extends JsbBase {

    public AppId: string = "100003109";
    public OpenScreenId: string = "";
    public BannerId: string = "7981db6d001a4c878ddafd0f00e8cf57";
    public RewardedVideoId: string = "5194388a679f46c5809586e370de75a7";
    public InsertId: string = "6d4974bc2fe74c51ac93592034807ebe";

    //  public AppId :string = "5bf6f9fa4ece4bd8a62881be4515e440";
    // public OpenScreenId: string = "sss";
    // public BannerId: string = "2be20fca90d24d1581a739b687712435";
    // public RewardedVideoId: string = "e39cec44b0534a568abfa285ea507d46";
    // public InsertId: string = "e873daabc90142b8a4761a552d4c97d7";

    public BannerErrCount: number = 0;

    public VoideErrCount: number = 0;

    public InsertErrCount: number = 0;

    public ErrZCount: number = 3;

    public bannerAd: any;

    public isCachedVideo: boolean = false;
    public videoAd: any;

    public isCachedInsert: boolean = false;
    public insertAd: any;

    public audio;
    public openSplashAd() {
        this.initOppoAd();
    }

    public initOppoAd() {
        console.log("initOppoAd ");
        Laya.timer.once(10 * 1000, this, () => {
            this.openBannerView();
        })
        console.log("---------------------------------------------------");
        this.loadInsert();

        this.loadRewardVide();
    }

    openVibrate() {
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

    public openAdvert(type: AdvertType) {
        switch (type) {
            case AdvertType.OpenScreen: {
                this.initOppoAd();
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

    //-------------------------------banner  start ----------------------------------------
    public openBannerView() {
        this.clearBanner();
        if (this.BannerErrCount >= this.ErrZCount) return console.log("加载超时-----banner");

        if (this.bannerAd == null) {

            //不设置style默认在顶部显示，布局起始位置为屏幕左上角
            var bannerAd = qg.createBannerAd({
                posId: this.BannerId,
                style: {}
            });
            bannerAd.show();

            bannerAd.onLoad(() => {
                console.log('Banner广告加载成功');
                bannerAd.show();
                this.BannerErrCount = 0;
            });

            bannerAd.onError((err) => {
                console.log("Banner广告加载失败");
                console.log(JSON.stringify(err));
                this.BannerErrCount++;
            });

            bannerAd.onClose(() => {
                console.log("bannerAd 关闭");

                setTimeout(() => {
                    this.openBannerView();
                }, 1000 * 60);
            });

            this.bannerAd = bannerAd;
        }
    }

    public clearBanner() {
        if (this.bannerAd) {
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }
    //-------------------------------banner  end ----------------------------------------

    //-------------------------------激励视频  start ----------------------------------------
    public loadRewardVide() {
        if (qg.createRewardedVideoAd == null) return;

        if (this.VoideErrCount >= this.ErrZCount) return console.log("加载超时-----video");

        if (this.videoAd == null) {
            let videoAd = qg.createRewardedVideoAd({ posId: this.RewardedVideoId });

            videoAd.onLoad(() => {
                console.log('激励视频加载成功');
                this.isCachedVideo = true;
                this.VoideErrCount = 0;
            });
            let self = this;
            videoAd.onError((err) => {
                console.log("激励视频播放失败" + JSON.stringify(err));
                AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + ",0");
                this.VoideErrCount++;

                setTimeout(() => {
                    this.loadRewardVide();
                }, 1000 * 60);
            });

            videoAd.onClose((res) => {
                if (res && res.isEnded) {
                    console.log("正常播放结束，可以下发游戏奖励");

                    // AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo, 1);
                    AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + ",1");
                } else {
                    console.log("播放中途退出，不下发游戏奖励");
                    // AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo, 0);
                    AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + ",0");
                }
                //vivo 小游戏禁止同时间请求多次
                // if (HoleConfig.FLAG_MUSIC == SwitchType.On) {
                //     this.playMusic(Resources.bg_mp3, 0);
                // }
                setTimeout(() => {
                    this.loadRewardVide();
                }, 1000 * 60);
            });

            this.videoAd = videoAd;
        } else {
            this.videoAd.load().then(() => {
                console.log("激励视频广告加载成功");
                this.isCachedVideo = true;
                this.VoideErrCount = 0;
            }).catch(err => {
                console.log("激励视频广告加载失败", err);

                this.VoideErrCount++;

                setTimeout(() => {
                    this.loadRewardVide();
                }, 1000 * 60);
            });
        }
    }

    public getIsCachedVideo(): boolean {
        console.log("getIsCachedVideo" + this.isCachedVideo);
        return this.isCachedVideo;
    }

    public showRewardVideo() {
        if (this.videoAd && this.isCachedVideo) {
            this.stopMusic();
            this.isCachedVideo = false;
            this.videoAd.show();
        }
    }

    public clearRewardVideo() {
        // if (this.videoAd) {
        //     this.videoAd.offError(() => { });
        //     this.videoAd.offLoad(() => { });
        //     this.videoAd.offRewarded(() => { });
        //     this.videoAd.offVideoStart(() => { });
        //     this.videoAd.destroy();
        //     this.videoAd = null;
        // }
    }
    //-------------------------------激励视频  end ----------------------------------------

    //-------------------------------插屏  start ----------------------------------------
    public loadInsert() {
        console.log("loadInsert   加载插屏");
        if (this.InsertErrCount >= this.ErrZCount) return console.log("加载超时-----loadInsert");

        if (this.insertAd == null) {
            let insertAd = qg.createInterstitialAd({
                posId: this.InsertId
            });

            insertAd.onLoad(() => {
                console.log('插屏广告加载成功');
                this.isCachedInsert = true;
                this.InsertErrCount = 0;
            });

            insertAd.onError((err) => {
                this.InsertErrCount++;
                console.log("插屏打开失败");
                console.log(JSON.stringify(err));
                this.clearInsert();
                setTimeout(() => {
                    this.loadInsert();
                }, 1000 * 60);
            });

            insertAd.onClose(() => {
                console.log("插屏关闭");
                this.clearInsert();
                setTimeout(() => {
                    this.loadInsert();
                }, 1000 * 60);
            });


            this.insertAd = insertAd;
        } else {
            this.insertAd.load().then(() => {
                console.log("重新加载插屏成功");
                this.isCachedInsert = true;
                this.InsertErrCount = 0;
            }).catch((err) => {
                console.log("重新加载插屏失败");
                console.log(JSON.stringify(err));
                this.InsertErrCount++;

                this.clearInsert();
                setTimeout(() => {
                    this.loadInsert();

                }, 1000 * 60);
            })
        }
    }


    public clearInsert() {
        this.isCachedInsert = false;
        this.insertAd = null;
    }

    public showInstertView() {
        console.log("显示插屏")
        if (this.insertAd) {
            this.insertAd.show().catch(() => {
                this.insertAd.load().then(() => {
                    this.insertAd.show();
                })
            })
        }
    }
    //-------------------------------插屏  end ----------------------------------------

    public sendDesktop(func: Function) {
        if (qg.installShortcut) {
            qg.installShortcut({
                success: function (res) {
                    console.log("sendDesktop   success");
                    console.log(JSON.stringify(res));
                    func(1)
                },
                fail: function (err) {
                    console.log("sendDesktop   success");

                    console.log(JSON.stringify(err));
                    func(0)
                },
                complete: function (res) {
                    console.log("sendDesktop   success");
                    console.log(JSON.stringify(res));
                }
            });
        } else {
            func(1)
        }
    }

    public hasShortcutInstalled(callBack: Function) {
        console.log("hasShortcutInstalled")
        if (qg.hasShortcutInstalled) {
            qg.hasShortcutInstalled({
                success: function (status) {
                    if (status) {
                        console.log('已创建')
                        callBack(1);
                    } else {
                        console.log('未创建')
                        callBack(0);
                    }
                },
                fail: () => {

                },
                complete: () => {

                }
            })
        } else {
            callBack(0);
        }
    }

    public getIsDesktop() {
        return typeof qg.installShortcut === "function";
    }

    public playMusic(url: string, loop: number = 0) {
        if (this.audio == null) {
            var audio = qg.createInnerAudioContext();
            audio.loop = loop == 0;
            audio.volume = 1;
            audio.autoplay = false;
            audio.src = url;
            this.audio = audio;
        }
        this.audio.play();
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
        audio.src = url;
        audio.play();
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
}