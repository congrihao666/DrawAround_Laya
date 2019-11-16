import { JsbBase, AdvertType } from "./JsbBase";

export default class JsbTouTiao extends JsbBase {


    public BannerId: string = "442t6prlson1015acg";

    public RewardedVideoId: string = "1a5c43n1gncb109eea";

    public bannerAd: any = null;

    public videoAd: any = null;

    public isCachedVideo: boolean = false;
    openVibrate() {

    }

    openAdvert(type: AdvertType) {
        switch (type) {
            case AdvertType.OpenScreen: {
                this.openSplashAd();
                break;
            }
            case AdvertType.ExcitationVideo:{
                this.openRewardVideo();
                break;
            }
        }
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
        // this.openBanner();
        this.loadVideo();
    }

    openBanner() {
        this.clearBanner();

        if (this.bannerAd == null) {
            // 创建一个居于屏幕底部正中的广告
            // const {
            //     windowWidth,
            //     windowHeight,
            // } = tt.getSystemInfoSync();
            var systemInfo = tt.getSystemInfoSync();
            const windowWidth = systemInfo.windowWidth;
            const windowHeight = systemInfo.windowHeight;
            var targetBannerAdWidth = 200;
            console.log("openBanner -----------------  windowWidth = " + windowWidth + "  windowHeight = " + windowHeight);

            let bannerAd = tt.createBannerAd({
                adUnitId: this.BannerId,
                style: {
                    width: windowWidth,
                    top: windowHeight - (targetBannerAdWidth / 16 * 9), // 根据系统约定尺寸计算出广告高度
                },
            });
            console.log("openBanner -----------------" + (windowHeight - (targetBannerAdWidth / 16 * 9)));

            // // 尺寸调整时会触发回调
            // // 注意：如果在回调里再次调整尺寸，要确保不要触发死循环！！！
            bannerAd.onResize(size => {
                console.log("ssssssssssssssssssssssssssss  ", size.width, size.height);

                // 如果一开始设置的 banner 宽度超过了系统限制，可以在此处加以调整
                if (targetBannerAdWidth != size.width) {
                    targetBannerAdWidth = size.width;
                    bannerAd.style.top = windowHeight - (size.width / 16 * 9);
                    bannerAd.style.left = (windowWidth - size.width) / 2;
                }
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
            // videoAd.load();

            videoAd.onLoad(() => {
                console.log("激励视频  加载成功 -- ");
                this.isCachedVideo = true;
            })

            videoAd.onError((err) => {
                console.log("激励视频加载失败 -- " + JSON.stringify(err));

                AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + "," + 0);

                Laya.timer.once(1000 * 60, self, () => {
                    this.loadVideo();
                });
            });

            videoAd.onClose(res => {
                if (res.isEnded) {
                    // 给予奖励
                    AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + "," + 1);
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
                    AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + "," + 0);

                    Laya.timer.once(1000 * 60, self, () => {
                        this.loadVideo();
                    });
                });;
        }
    }

    openRewardVideo() {
        if (this.videoAd) {
            this.videoAd.show()
                .then(() => {
                    console.log('openRewardVideo  广告显示成功');
                })
                .catch(err => {
                    console.log('openRewardVideo  广告组件出现问题', err);
                    AndroidToJs.CallJs("Advertisement", AdvertType.ExcitationVideo + "," + 0);


                    Laya.timer.once(1000 * 60, self, () => {
                        this.loadVideo();
                    });
                });
        }
    }
}