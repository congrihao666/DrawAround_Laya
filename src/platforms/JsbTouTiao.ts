import { JsbBase, AdvertType } from "./JsbBase";
import { VideoCom } from "../Component/VideoCom";

const pushIcon = ['fklfsicon', 'qqtkicon', 'bzklicon', 'cjjyicon', 'qqbwticon'];

export default class JsbTouTiao extends JsbBase {


    public BannerId: string = "2c4dh0j0oc9dh9a2n7";

    public RewardedVideoId: string = "1c0jag1fd3geb88400";

    public bannerAd: any = null;

    public videoAd: any = null;

    public isCachedVideo: boolean = false;

    public game: any = null;
    public type: any = null;    //0复活,1积分翻倍

    public btn_shart: any = null;
    public btna: any = null;
    public btnb: any = null;
    public btnc: any = null;
    public btnd: any = null;
    public share_demand: number = 1;  //多少关显示一次分享

    public windowWidth: number;
    public windowHeight: number;

    public pushNum: number = 0;
    public tweenNum: number = 0;

    public excitationHandler: Laya.Handler;

    public openAdvert(type: AdvertType) {
        switch (type) {
            case AdvertType.OpenScreen: {
                this.openSplashAd();
                break;
            }

            case AdvertType.ExcitationVideo: {
                this.openRewardVideo();
                break;
            }

        }
    }

    public openVideoAdvert() {
        this.openRewardVideo();
    }

    openVibrateShort() {
        tt.vibrateShort({
            success(res) {
                // console.log(`${res}`);
            },
            fail(res) {
                console.log(`vibrateShort调用失败`);
            }
        });
    }

    openVibrateLong() {
        tt.vibrateLong({
            success(res) {
                // console.log(`${res}`);
            },
            fail(res) {
                console.log(`vibrateShort调用失败`);
            }
        })
    }

    openSplashAd() {
        this.openBanner();
        if(typeof tt.createRewardedVideoAd == "function"){
            this.loadVideo();
        } 
    }

    openBanner() {
        this.clearBanner();

        if (this.bannerAd == null) {
            // 创建一个居于屏幕底部正中的广告
            let windowWidth = tt.getSystemInfoSync().windowWidth;
            let windowHeight = tt.getSystemInfoSync().windowHeight;
            this.windowWidth = windowWidth;
            this.windowHeight = windowHeight;

            var targetBannerAdWidth = 200;
            if(targetBannerAdWidth > windowWidth){
                targetBannerAdWidth = windowWidth - 40;
            }
            let bannerAd = tt.createBannerAd({
                adUnitId: this.BannerId,
                style: {
                    width: targetBannerAdWidth,
                    top: windowHeight - (targetBannerAdWidth / 16 * 9), // 根据系统约定尺寸计算出广告高度
                    left: (windowWidth - targetBannerAdWidth) / 2
                },
            });
            // // 尺寸调整时会触发回调
            // // 注意：如果在回调里再次调整尺寸，要确保不要触发死循环！！！
            bannerAd.onResize(size => {
                if (targetBannerAdWidth != size.width) {
                    targetBannerAdWidth = size.width;
                    bannerAd.style.left = (windowWidth - size.width) / 2;
                    bannerAd.style.top = windowHeight - (size.height + 20);
                }
                console.log("广告宽高---", size.width, size.height, 'left,top---',bannerAd.style.left, bannerAd.style.top);
            });

            bannerAd.onLoad(() => {
                console.log("banner 加载成功");
                this.bannerAd.show()
                    .then(() => {
                        console.log('广告显示成功');
                    })
                    .catch(err => {
                        console.log('广告组件出现问题', err);
                    })
            });

            bannerAd.onError((err) => {
                console.log("bannerAd 加载失败" + JSON.stringify(err));
                Laya.timer.once(1000 * 60, this, () => {
                    this.openBanner();
                })
            })

            this.bannerAd = bannerAd;

            console.log('this.bannerAd.style.width-----'+this.bannerAd.style.width,'this.bannerAd.style.height------'+this.bannerAd.style.height)
        }
    }

    clearBanner() {
        if (this.bannerAd) {
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }

    getIsCachedVideo() {
        return this.isCachedVideo;
    }

    loadVideo() {
        console.log("loadVideo =-===================================");
        if (this.videoAd == null) {
            let videoAd = tt.createRewardedVideoAd({
                adUnitId: this.RewardedVideoId,
            })

            this.videoAd = videoAd;

            videoAd.onLoad(() => {
                console.log("激励视频  加载成功 -- ");
                this.isCachedVideo = true;
            })

            videoAd.onError((err) => {
                console.log("激励视频加载失败 -- " + JSON.stringify(err));

                setTimeout(() => {
                    this.loadVideo();
                }, 1000 * 60);
            });

            videoAd.onClose(res => {
                if (res.isEnded) {
                    // 给予奖励
                    console.log("正常播放结束，可以下发游戏奖励");
                    
                    // AudioManager.getInstance().playMusic(Res.bgMusic, true);
                    // (<any>window).NativeCon.revivalResult("1");
                    AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + ",1");
                    this.loadVideo();
                }else{
                    console.log("播放中途退出，不下发游戏奖励");
                    // AudioManager.getInstance().playMusic(Res.bgMusic, true);
                    // (<any>window).NativeCon.revivalResult("0");
                    AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + ",0");
                    this.loadVideo();
                }
            });
        } else {
            // 可以手动加载一次
            this.videoAd.load()
                .then(() => {
                    this.isCachedVideo = true;
                    console.log('手动加载成功');
                }).catch(err => {
                    console.log('广告组件出现问题', err);

                    setTimeout(() => {
                        this.loadVideo();
                    }, 1000 * 60);
                });;
        }
    }
    public runRewardHandler(value: number) {
        if (this.excitationHandler) {
            this.excitationHandler.runWith(value);
        }
        this.excitationHandler = undefined;
    }

    openRewardVideo() {
        if (this.videoAd) {
            this.videoAd.show()
                .then(() => {
                    console.log('openRewardVideo  广告显示成功');
                })
                .catch(err => {
                    console.log('openRewardVideo  广告组件出现问题', err);
                    setTimeout(() => {
                        this.loadVideo();
                    }, 1000 * 60);
                });
        }
    }

    /** 广告隐藏*/
    hideBannder() {
        console.log("广告隐藏")
        if (this.bannerAd) {
            this.bannerAd.hide()
        }
    }

    /** 广告显示*/
    showBannder() {
        console.log("广告显示")
        if (this.bannerAd) {
            this.bannerAd.show()
        }
    }

    /** 判断是否ios*/
    isIos() {
        const systemInfo = tt.getSystemInfoSync();
        return systemInfo.platform == 'ios';
    }

    /** 录制开关*/
    videoPlay(game, type) {
        this.game = game;
        if (type) {
            console.log("开始游戏,开始录制")
            let video_com = game.btn_camera.getComponent(VideoCom);
            video_com.isPlay(game, type);
            video_com.onResetVideoClick();
            game.btn_camera.visible = false;
        } else {
            //停止录制
            console.log("结束游戏,停止录制")
            let video_com = game.btn_camera.getComponent(VideoCom);
            video_com.isPlay(game, type);
            video_com.onResetVideoClick();
            game.btn_camera.visible = true;
        }
    }

    /** 分享*/
    onShare(game, type) {
        console.log("分享");
        if (game.btn_camera.visible) {
            let video_com = game.btn_camera.getComponent(VideoCom);
            video_com.share(type);
        }
    }

    /** 生成更多游戏按钮*/
    gameBtn() {
        if (this.btn_shart) {
            this.btn_shart.show();
        } else {
            let id = "ttf3f0854d6cda1ee2";
            let skin = "res/push/img_icon.png";
            this.btn_shart = tt.createMoreGamesButton({
                type: "image",
                image: skin,
                style: {
                    left: 0,
                    top: 500,
                    width: 40,
                    height: 35,
                    lineHeight: 40,
                    backgroundColor: "#ff0000",
                    textColor: "#ffffff",
                    textAlign: "center",
                    fontSize: 16,
                    borderRadius: 4,
                    borderWidth: 0,
                    borderColor: '#ff0000'
                },
                appLaunchOptions: [
                    {
                        appId: id,
                        query: "foo=bar&baz=qux",
                        extraData: {}
                    },
                    // {...}
                ],
                onNavigateToMiniGame(res) {
                    console.log('跳转其他小游戏', res)
                }
            });

            this.btn_shart.onTap(() => {
                console.log('点击更多游戏')
            });
        }
    }

    /** 隐藏更多游戏按钮*/
    btnDestroy() {
        if (this.btn_shart) {
            this.btn_shart.hide();
        }
    }

    /** 生成4宫格游戏按钮*/
    gameBtns() {
        if (this.btna) {
            this.btna.show();
            this.btnb.show();
            this.btnc.show();
            this.btnd.show();
        } else {
            let n = 720 - this.windowHeight;
            this.game.bg_push.y = 1292 - n*(1630/750);
            console.log('this.game.bg_push.y---'+ this.game.bg_push.y);

            let id = "ttf3f0854d6cda1ee2";
            this.btna = tt.createMoreGamesButton({
                type: "image",
                image: "res/push/fklfsicon.png",
                style: {
                    left: 22,
                    top: this.windowHeight - 100,
                    width: 64,
                    height: 80,
                    lineHeight: 40,
                    backgroundColor: "#ff0000",
                    textColor: "#ffffff",
                    textAlign: "center",
                    fontSize: 16,
                    borderRadius: 4,
                    borderWidth: 0,
                    borderColor: '#ff0000'
                },
                appLaunchOptions: [
                    {
                        appId: id,
                        query: "foo=bar&baz=qux",
                        extraData: {}
                    },
                ],
            });

            this.btnb = tt.createMoreGamesButton({
                type: "image",
                image: "res/push/qqtkicon.png",
                style: {
                    left: 94,
                    top: this.windowHeight - 100,
                    width: 64,
                    height: 80,
                    lineHeight: 40,
                    backgroundColor: "#ff0000",
                    textColor: "#ffffff",
                    textAlign: "center",
                    fontSize: 16,
                    borderRadius: 4,
                    borderWidth: 0,
                    borderColor: '#ff0000'
                },
                appLaunchOptions: [
                    {
                        appId: id,
                        query: "foo=bar&baz=qux",
                        extraData: {}
                    },
                ],
            });

            this.btnc = tt.createMoreGamesButton({
                type: "image",
                image: "res/push/bzklicon.png",
                style: {
                    left: 166,
                    top: this.windowHeight - 100,
                    width: 64,
                    height: 80,
                    lineHeight: 40,
                    backgroundColor: "#ff0000",
                    textColor: "#ffffff",
                    textAlign: "center",
                    fontSize: 16,
                    borderRadius: 4,
                    borderWidth: 0,
                    borderColor: '#ff0000'
                },
                appLaunchOptions: [
                    {
                        appId: id,
                        query: "foo=bar&baz=qux",
                        extraData: {}
                    },
                ],
            });

            this.btnd = tt.createMoreGamesButton({
                type: "image",
                image: "res/push/cjjyicon.png",
                style: {
                    left: 240,
                    top: this.windowHeight - 100,
                    width: 64,
                    height: 80,
                    lineHeight: 40,
                    backgroundColor: "#ff0000",
                    textColor: "#ffffff",
                    textAlign: "center",
                    fontSize: 16,
                    borderRadius: 4,
                    borderWidth: 0,
                    borderColor: '#ff0000'
                },
                appLaunchOptions: [
                    {
                        appId: id,
                        query: "foo=bar&baz=qux",
                        extraData: {}
                    },
                ],
            });
        }
    }

    /** 隐藏4个更多游戏按钮*/
    btnDestroys() {
        if (this.btna) {
            this.btna.hide();
            this.btnb.hide();
            this.btnc.hide();
            this.btnd.hide();
        }
    }

    /** 是否显示分享*/
    showShare(game, Gate_number) {
        this.game = game;
        let video_com = game.btn_camera.getComponent(VideoCom);
        let isplay = video_com.isRecord;
        return (Gate_number / this.share_demand == Math.floor(Gate_number / this.share_demand)) && !isplay;
    }

    /** 是不是胖子*/
    isFat(){
        return (this.windowHeight / this.windowWidth) < 1.9;
    }

    /** 跳转小游戏*/
    TTnavigateToMiniGame() {
        if (this.isIos()) return;
        // 打开互跳弹窗
        tt.showMoreGamesModal({
            appLaunchOptions: [
                {
                    appId: 'tt68a61e1bf78cb645',
                    query: "foo=bar&baz=qux"
                }
            ],
            success(res) {
                console.log('success', res.errMsg)
            },
            fail(res) {
                console.log('fail', res.errMsg)
            }
        })
    }

    /** 头条互推轮播*/
    ttPushShake(game) {
        if (typeof tt.showMoreGamesModal == "function") {
            game.tt_btnPush.visible = true;
            game.tt_iconPush.skin = `res/push/${pushIcon[this.pushNum]}.png`;
            this.pushNum++;
            if (this.pushNum > 4) this.pushNum = 0;
            this.tween_push(game);
            setTimeout(() => {
                this.ttPushShake(game);
            }, 1000 * 4.8)
        }
    }
    /** 头条互推轮播缓动序列*/
    tween_push(game){
        this.tweenNum++;
        if(this.tweenNum > 4)return this.tweenNum = 0;
        Laya.Tween.to(game.tt_btnPush,{ rotation: 30 }, 200, null, Laya.Handler.create(this,this.tween_1,[game]));
    }
    tween_1(game){
        Laya.Tween.to(game.tt_btnPush,{ rotation: 0 }, 200, null, Laya.Handler.create(this,this.tween_2,[game]));
    }
    tween_2(game){
        Laya.Tween.to(game.tt_btnPush,{ rotation: -30 }, 200, null, Laya.Handler.create(this,this.tween_3,[game]), 400);
    }
    tween_3(game){
        Laya.Tween.to(game.tt_btnPush,{ rotation: 0 }, 200, null, Laya.Handler.create(this,this.tween_push,[game]));
    }
}