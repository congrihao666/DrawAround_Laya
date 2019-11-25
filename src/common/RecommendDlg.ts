import { ui } from "./../ui/layaMaxUI";
import g_evnetM from "./EventManager";
import { PlatformManager } from "../platforms/PlatformManager";
import PubUtils from "./PubUtils";
import { SwitchType } from "../platforms/JsbBase";

export default class RecommendDlg extends ui.RecommendDlgUI {
    private lunboList = [];
    timeline: Laya.TimeLine;
    cur_index: number = 0;

    constructor() {
        super();
        this.init();
    }

    init() {
        this.mouseThrough = true;
        this.btn_other_mi_game.visible = false;
        this.btn_other_mi_game.mouseThrough = false;
        this.openMini(false);
        this.openLunbo(false);
        g_miniGM.initMinGame();

        // this.btn_other_mi_game.on(Laya.Event.CLICK, this, this.openMini, [true]);

        g_evnetM.AddEvent("load_mi_config_success", this, function () {
            this.registClick();
            this.initLunbo();
        });
        g_evnetM.AddEvent("open_lunbo_minigame", this, this.openLunbo);
    }

    openOtherGameClick(e: Laya.Event) {
        let btn = e.target as Laya.Image;
        let model = new DataDockingMiGameModel();
        model.fromName = "color_hole_laya";
        model.url = "http://pushgame.kuaizhiyou.cn/log";
        model.toName = e.target.name;
        model.index = btn.tag;
        model.gameId = g_miniGM.mi_game_id;
        model.userId = PlatformManager.userid;
        PubUtils.DataDocking(model.url, model.getParam());

        PlatformManager.Jsb.openGame(e.target.name);
        console.log("打开分享视频", e.target.name);
    }

    onMiGameClick() {
        let obj = this.lunboList[this.cur_index % this.lunboList.length];

        let model = new DataDockingMiGameModel();
        model.fromName = g_miniGM.mi_game_name;
        model.url = "http://pushgame.kuaizhiyou.cn/log";
        model.toName = obj["lunbo_apkname"];
        model.index = 0;
        model.gameId = g_miniGM.mi_game_id;
        model.userId = PlatformManager.userid;
        PubUtils.DataDocking(model.url, model.getParam());

        PlatformManager.Jsb.openGame(obj["lunbo_apkname"]);
    }

    registClick() {
        let stayData = g_miniGM.stayData;
        let mi_game_id = g_miniGM.mi_game_id;
        let migameData;
        for (let k = 0; k < stayData.length; ++k) {
            if (+stayData[k]["id"] != mi_game_id) continue;
            this.btn_other_mi_game.visible = true;
            migameData = stayData[k];
            break;
        }

        if (!migameData) return;
        for (let i = 0; i < this.icon_panel.numChildren; ++i) {
            let btn = this.icon_panel.getChildByName("icon" + i) as Laya.Image;
            !!btn && (btn.visible = false);
            let listName = "list" + (i + 1);
            if (!!migameData[listName]) {
                if (!btn) continue;
                btn.name = migameData["list" + (i + 1) + "_apkname"];
                btn.skin = "https://kuaizhiyou.com.cn/fenfa/icon/" + migameData[listName + "_icon"] + ".png";
                btn.tag = i + 1;
                btn.visible = true;
                PubUtils.registerScaleListener(btn, this, this.openOtherGameClick, 1.2, true);
            }
        }

        PubUtils.registerTouchListenner(this.box_clickAera, this, null, null, function() {
            this.openMini(false);
        } , null, true);
        PubUtils.registerTouchListenner(this.btn_other_mi_game, this, null, null, function () {
            this.openMini(true);
        } , null, true);
    }

    openMini(vis: boolean) {
        this.box_clickAera.visible = vis;
    }

    initLunbo() {
        let lunboData = g_miniGM.lunboData;
        let mi_game_id = g_miniGM.mi_game_id;
        let oneData;

        for (let k = 0; k < lunboData.length; ++k) {
            if (lunboData[k]["id"] != "" && +lunboData[k]["id"] != mi_game_id) continue;
            oneData = lunboData[k];
            break;
        }

        if (!oneData) return;

        let len = +oneData["lunbo_num"]
        for (let i = 0; i < len; ++i) {
            if(oneData["lunbo" + i + "_icon"] == "") break;
            let obj = {
                cd: parseInt(oneData["lunbo_cd"]),
                lunbo_apkname: oneData["lunbo" + i + "_apkname"],
                lunbo_icon: "https://kuaizhiyou.com.cn/fenfa/icon/" + oneData["lunbo" + i + "_icon"] + ".png",
            }
            this.lunboList.push(obj);
        }

        if (this.lunboList.length > 0) {
            // this.btn_migame.visible = true;
            this.img_icon.skin = this.lunboList[this.cur_index]["lunbo_icon"];
            PubUtils.registerScaleListener(this.btn_migame, this, this.onMiGameClick, 1.2, true);
            
            this.timeline = new Laya.TimeLine();
            this.timeline.addLabel("right0", 0).to(this.btn_migame, { rotation: -15 }, 0.3 * 1000);
            this.timeline.addLabel("left1", 0).to(this.btn_migame, { rotation: 15 }, 0.3 * 1000);
            this.timeline.addLabel("right2", 0).to(this.btn_migame, { rotation: -15 }, 0.3 * 1000);
            this.timeline.addLabel("left3", 0).to(this.btn_migame, { rotation: 15 }, 0.3 * 1000);
            this.timeline.addLabel("right4", 0).to(this.btn_migame, { rotation: -15 }, 0.3 * 1000);
            this.timeline.play();
            this.timeline.on(Laya.Event.COMPLETE, this, this.rotateOver);
        }
    }

    rotateOver() {
        this.cur_index++;
        this.img_icon.skin = this.lunboList[this.cur_index % this.lunboList.length]["lunbo_icon"];
        Laya.timer.once(2 * 1000, this, () => {
            this.timeline.play();
        });
    }

    openLunbo(vis: boolean) {
        this.btn_migame.visible = vis;
    }
}


export class DataDockingModel {
    public url: string = "";
    public userId:string = "";
    public getParam(): string {
        return "";
    }
}


export class DataDockingMiGameModel extends DataDockingModel {

    /**
     * 从什么游戏跳转
     */
    fromName: string = "";

    /**
     * 跳转到什么游戏
     */
    toName: string = "";

    /**
     * 位置索引
     */
    index: number = 0;

    /**
     * 游戏id
     */
    gameId: number = 0;

    getParam() {
        return `fromName=${this.fromName}&toName=${this.toName}&index=${this.index}&gameId=${this.gameId}&userId=${this.userId}`
    }
}


class MiniGameManager {
    static readonly Instance: MiniGameManager = new MiniGameManager;

    lunboList: Array<any> = []; //分发轮播列表
    currentIndex: number = 0; //轮播索引
    lunboData; //轮播数据
    stayData; //常驻数据
    mi_game_id = 20;
    mi_game_name = "com_kzy_cbty";

    initMinGame() {
        PlatformManager.Jsb.checkIsMiGame((flag: SwitchType) => {
            // if (flag == SwitchType.On) {
                this.loadMiConfig();
            // }
        })
    }

    loadMiConfig() {
        let url = "https://kuaizhiyou.com.cn/fenfa/fenfalunbo.json";
        PubUtils.GetNetJson(url, (res) => {
            // console.log(res);
            this.lunboData = res;
            this.parseData(res);
            let url = "https://kuaizhiyou.com.cn/fenfa/fenfalist.json";
            PubUtils.GetNetJson(url, (res) => {
                this.stayData = res;
                g_evnetM.DispatchEvent("load_mi_config_success");
            })
        })
    }

    parseData(res) {
        for (let i = 1; i < res.length; i++) {
            let json = res[i];
            if (json["id"] == "") break;
            if (parseInt(json["id"]) == this.mi_game_id) {
                for (let j = 1; j < json["lunbo_num"]; j++) {
                    let obj = {
                        cd: parseInt(json["lunbo_cd"]),
                        lunbo_apkname: json["lunbo" + j + "_apkname"],
                        lunbo_icon: "https://kuaizhiyou.com.cn/fenfa/icon/" + json["lunbo" + j + "_icon"] + ".png",
                    }
                    this.lunboList.push(obj);
                }
            }
        }

    }
}

let g_miniGM = MiniGameManager.Instance;