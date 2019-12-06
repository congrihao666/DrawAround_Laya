import g_tipM from "../common/TipManger";

export class VideoCom extends Laya.Script {


    public isOp: boolean = false;

    /** 是否在录制中*/
    public isRecord: boolean = false;

    public recorder: any;

    public curTimer: number = 0;

    public owner: Laya.Image;

    public norSkin: string = "img/img_camera.png";


    public videoSkin: string = "img/img_record.png";

    public videoRes: any;
    /**0,停止录制,1,开始录制 */
    public playType: any = true;

    uiScene: any;

    isClick: any = true;

    /** 是否玩家主动录制*/
    public isInitiative: boolean = true;

    constructor() { super(); }

    onEnable(): void {
        this.owner.on(Laya.Event.CLICK, this, this.onResetVideoClick);

        this.recorder = tt.getGameRecorderManager();

        this.recorder.onStart(res => {
            this.isOp = false;
            console.log("开始录屏");
            // do somethine;
        })

        this.recorder.onStop(res => {
            this.isOp = false;
            this.owner.skin = this.norSkin;
            this.isRecord = false;
            console.log("停止录屏-------------------- " + res.videoPath);
            this.videoRes = res;
            if (this.isInitiative) {
                this.share(0);
            }

            this.isInitiative = true;
            this.playType = true;
        })

        this.recorder.onError((err) => {
            console.log("播放错误" + err);
        })
    }

    onDisable(): void {
        this.owner.off(Laya.Event.CLICK, this, this.onResetVideoClick);
    }

    onResetVideoClick() {
        console.log("onResetVideoClick  isOp = " + this.isOp + "  isRecord = " + this.isRecord + 'playType = ' + this.playType + 'this.isInitiative' + this.isInitiative);
        if (this.isInitiative) {
            if (!this.isClick) return;
            if (this.isOp) return;
            this.isOp = true;

            if (this.isRecord) {
                if (this.curTimer >= 3 * 1000) {
                    //在录制中   打开分享
                    this.owner.skin = this.norSkin;

                    this.recorder.stop();
                }
                else {
                    console.log("不足3秒,停止失败,3秒后自动停止")
                    g_tipM.showTip("不足3秒,无法停止,3秒后自动停止!", 1 * 1000);
                    this.isClick = false;
                    setTimeout(() => {
                        this.isClick = true;
                        this.owner.skin = this.norSkin;
                        this.recorder.stop();
                    }, 1000 * 3);
                    this.isOp = false;
                    return;
                }

            } else {
                this.playType = false
                this.owner.skin = this.videoSkin;
                this.recorder.start({
                    duration: 30,
                })
                this.isOp = false;
            }
        } else {
            if (this.playType) {
                this.playType = false
                this.owner.skin = this.videoSkin;
                this.recorder.start({
                    duration: 300,
                });
                this.isInitiative = true;
            } else {
                if (this.curTimer >= 3 * 1000) {
                    this.isClick = false;
                    this.isClick = true;
                    this.owner.skin = this.norSkin;
                    this.recorder.stop();
                    this.isOp = false;
                    this.playType = true;
                } else {
                    g_tipM.showTip("不足3秒,无法停止,3秒后自动停止!", 1 * 1000);
                    setTimeout(() => {
                        this.isClick = false;
                        this.isClick = true;
                        this.owner.skin = this.norSkin;
                        this.recorder.stop();
                        this.isOp = false;
                        this.playType = true;
                    }, 1000 * 3);
                }

            }
        }
        this.isRecord = !this.isRecord;
    }

    onUpdate() {
        if (this.isRecord) {
            this.curTimer += Laya.timer.delta;
        } else {
            this.curTimer = 0;
        }
    }

    /** 分享*/
    share(type) {
        console.log("分享视频")
        let game = this.uiScene;
        try {
            tt.shareAppMessage({
                channel: "video",
                imageUrl: '',
                query: '',
                extra: {
                    videoPath: this.videoRes.videoPath,
                    // videoTopics: ['@我 一款有颜色的黑洞吞噬游戏，灵活的吞掉方块挑战丰富的关卡！']
                },

                success() {
                    console.log('分享视频成功');
                    if (type) {
                        console.log('胜利分享, 发放奖励');
                        // g_EventDis.dispatchEvent(GlobalEvent.ADVERTISEMENT, [AdvertType.ShareVideo, 1]);
                    } else {
                        console.log('失败分享, 不发放奖励');
                    }
                },
                fail(e) {
                    console.log('分享视频失败' + JSON.stringify(e));
                    g_tipM.showTip("分享视频失败!", 1 * 1000);
                }
            })
        } catch (e) {
            console.log("recorder.onStop  " + e);
        }
    }

    isPlay(game, type) {
        this.isInitiative = false;
        this.uiScene = game;
        this.playType = type;
    }
}


declare module tt {

    export function getGameRecorderManager(): any;

    export function shareAppMessage(obj: any): any;

}