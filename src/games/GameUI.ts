import { ui } from "../ui/layaMaxUI";
import g_evnetM from "../common/EventManager";
import g_sceneM from "./SceneManager";
import g_actionM from "./ActionManager";
import g_constD from "./ConstData";
import { PlatformManager, PlatformType } from "../platforms/PlatformManager";
import { AdvertType } from "../platforms/JsbBase";
import g_tipM from "../common/TipManger";
import { VideoCom } from "../Component/VideoCom";

export default class GameUI extends ui.MainSceneUI {
    countdownNum: number = 10;

    constructor() {
        super();
        this.initMouseEvent();
    }

    init() {
        this.initGame();
        Laya.timer.once(500, this, this.playBGM);
    }

    playBGM() {
        g_evnetM.DispatchEvent("play_music");
    }

    stopBGM() {
        g_evnetM.DispatchEvent("stop_music");
    }

    openBox(type: number, isopen: boolean = true) {
        Laya.timer.clear(this, this.updateFontNum);
        
        this.box_lose.visible = this.box_main.visible = this.box_win.visible = false;
        if (!isopen) return;
        if (type == 1) {
            this.box_main.visible = true;
            this.startType(1);
        } else if (type == 2) {
            this.box_win.visible = true;
            this.startType(3);
            // this.btn_zhijielingqu.visible = false;
            // Laya.timer.once(3000, this, ()=> {
            //     this.btn_zhijielingqu.visible = true;
            // })
        } else if (type == 3) {
            this.box_lose.visible = true;
            this.startType(3);
            // this.btn_fanhui.visible = false;
            this.countdownNum = 10;
            this.font_failCnt.value = this.countdownNum + "";
            Laya.timer.loop(1000, this, this.updateFontNum);
        }
    }

    updateFontNum() {
        this.countdownNum--;
        this.font_failCnt.value = this.countdownNum + "";
        // if (this.countdownNum == 7) this.btn_fanhui.visible = true;
        if (this.countdownNum < 1) {
            this.fanhuiyouxi();
            Laya.timer.clear(this, this.updateFontNum);
        }
    }

    initMouseEvent() {
        this.box_mouse.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        // this.box_mouse.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        this.box_mouse.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        this.box_mouse.on(Laya.Event.MOUSE_OUT, this, this.mouseOut);

        this.btn_start.on(Laya.Event.CLICK, this, this.startGame);
        this.btn_doubleStart.on(Laya.Event.CLICK, this, this.doubleStart);
        this.btn_wubeilingqu.on(Laya.Event.CLICK, this, this.wubeilingqu);
        this.btn_jixuyouxi.on(Laya.Event.CLICK, this, this.jixuyouxi);
        this.btn_zhijielingqu.on(Laya.Event.CLICK, this, this.zhijielingqu);
        this.btn_fanhui.on(Laya.Event.CLICK, this, this.fanhuiyouxi);

        this.box_set.on(Laya.Event.CLICK, this, this.openSet);
        this.img_skin.on(Laya.Event.CLICK, this, this.openSkin);
        this.img_signin.on(Laya.Event.CLICK, this, this.openSignin);

        g_evnetM.AddEvent("game_win", this, this.gameWin);
        g_evnetM.AddEvent("game_lose", this, this.gameLose);
        g_evnetM.AddEvent("update_gold", this, this.updateGold);
        g_evnetM.AddEvent("update_prg", this, this.updatePrg);
        g_evnetM.AddEvent("Advertisement", this, this.advBack);

        this.btn_share.on(Laya.Event.CLICK, this, this.videoShare);
        this.again.on(Laya.Event.CLICK, this, this.againType);
        this.tt_btnPush.on(Laya.Event.CLICK, this, this.btnPush);

        if (PlatformManager.platform != PlatformType.TTMinGame) {
            this.btn_camera.visible = false;
        } else {
            this.btn_camera.visible = true;
            this.btn_camera.addComponent(VideoCom);
            if (PlatformManager.Jsb.isIos()) return;
            PlatformManager.Jsb.ttPushShake(this);
        }
    }

    openSet(e: Laya.Event) {
        e.stopPropagation();
        g_sceneM.openSet(true);
    }

    openSkin(e: Laya.Event) {
        e.stopPropagation();
        g_sceneM.openSkin(true);
    }

    openSignin(e: Laya.Event) {
        PlatformManager.Jsb.hideBannder();
        e.stopPropagation();
        g_sceneM.openSignin(true);
    }

    mouseDown(e: Laya.Event) {
        if (!g_sceneM.isGamimg) return;
        g_sceneM.isDrawing = true;
        !g_sceneM.isPausing && g_sceneM.setPenH(true);
    }

    mouseMove(e: Laya.Event) { }

    mouseUp() {
        if (!g_sceneM.isGamimg) return;
        g_sceneM.isDrawing = false;
        !g_sceneM.isPausing && g_sceneM.setPenH(false);
    }

    mouseOut() {
        this.mouseUp();
    }

    gameWin() {
        this.openBox(2);
    }

    gameLose() {
        this.openBox(3);
    }

    addWinDmd(isDouble: boolean) {
        let times = isDouble ? 5 : 1;
        if (g_sceneM.isDoubleStart) times *= 2;
        g_sceneM.isDoubleStart = false;
        g_constD.gold += (g_constD.winGold * times);
        this.updateGold();
        g_sceneM.setLocalGold(g_constD.gold);
    }

    jixuyouxi() {
        this.openJiliVideo(AdvType.jxyx);
    }

    fanhuiyouxi() {
        if (PlatformManager.platform == PlatformType.TTMinGame) {
            this.shareBox.visible = true;
            this.btn_share.visible = true;
        } else {
            this.reloadGame();
        }
    }

    wubeilingqu() {
        this.openJiliVideo(AdvType.wblingqu);
    }

    zhijielingqu() {
        if (PlatformManager.platform == PlatformType.TTMinGame) {
            this.shareBox.visible = true;
            this.btn_share.visible = true;
        } else {
            this.addWinDmd(false);
            this.reloadGame();
        }
    }

    openJiliVideo(type: number) {
        if (PlatformManager.Jsb.getIsCachedVideo()) {
            g_constD.advType = type;
            if (g_sceneM.isMusicOn) this.stopBGM();
            PlatformManager.Jsb.openAdvert(AdvertType.ExcitationVideo);
        } else {
            g_tipM.showTip("视频正在准备中！");
        }
    }

    advBack(data: string) {
        let bol1 = g_constD.advType == AdvType.sbkaishi;
        let bol2 = g_constD.advType == AdvType.wblingqu;
        let bol3 = g_constD.advType == AdvType.jxyx;
        if (!(bol1 || bol2 || bol3)) return;
        let arr = data.split(",");
        let success = +arr[1];
        let type = +arr[0];
        if (g_sceneM.isMusicOn) this.playBGM();
        if (type != AdvertType.ExcitationVideo || success != 1) return;
        if (bol1) {
            g_sceneM.isDoubleStart = true;
            this.startGame();
        } else if (bol2) {
            this.addWinDmd(true);
            this.reloadGame();
        } else if (bol3) {
            this.continueGame();
        }
        g_constD.advType = AdvType.normal;
    }

    initGame() {
        this.openBox(1);
        this.updateLvl();
        this.updateGold();
        this.updatePrg(0);
        g_sceneM.startGame();
    }

    reloadGame() {
        console.log("重新加载游戏")
        this.openBox(1);
        this.updateLvl();
        this.updatePrg(0);
        g_sceneM.reLoadGame();
        g_evnetM.DispatchEvent("open_lunbo_minigame", false);
        PlatformManager.Jsb.openAdvert(AdvertType.TableScreen);
        PlatformManager.Jsb.hideBanner();
    }

    doubleStart() {
        this.openJiliVideo(AdvType.sbkaishi);
    }

    startGame() {
        this.openBox(1, false);
        this.startType(2);
        PlatformManager.Jsb.showBanner();
        if (g_constD.isSkinUsePop) g_sceneM.openSkinUseDlg(true);
    }

    continueGame() {
        this.openBox(3, false);
        g_sceneM.destroyPart();
        g_sceneM.continueGame();

        if (PlatformManager.platform == PlatformType.TTMinGame && this.box_lose.visible == false) {
            this.bg_push.visible = false;
            if (PlatformManager.Jsb.isIos())
                return;
            PlatformManager.Jsb.btnDestroys();
        }
    }

    updateGold() {
        this.label_dmd.text = "" + g_constD.gold;
    }

    updateLvl() {
        this.label_p1.text = g_constD.nowLvlTimes + "";
        this.label_p2.text = (g_constD.nowLvlTimes + 1) + "";
    }

    updatePrg(value: number) {
        this.prg_pro.value = value;
    }

    /** 游戏状态*/
    private startType(type) {
        if (PlatformManager.platform != PlatformType.TTMinGame) return;

        if (type == 1) {
            //开始前,销毁4宫格游戏按钮,生成更多游戏按钮
            console.log('开始前');
            this.shareBox.visible = false;
            if (PlatformManager.Jsb.isIos()) return;
            PlatformManager.Jsb.btnDestroys();
            this.bg_push.visible = false;
            PlatformManager.Jsb.gameBtn();
        } else if (type == 2) {
            //开始游戏时,隐藏广告,开始录制,销毁更多游戏按钮
            console.log('开始游戏时');
            PlatformManager.Jsb.hideBannder();
            PlatformManager.Jsb.videoPlay(this, 1);
            if (PlatformManager.Jsb.isIos()) return;
            PlatformManager.Jsb.btnDestroy();
        } else if (type == 3) {
            //结算时,停止录制,生成4宫格按钮
            console.log('结算时');
            PlatformManager.Jsb.videoPlay(this, 0);
            if (PlatformManager.Jsb.isIos()) return;
            this.bg_push.visible = true;
            PlatformManager.Jsb.gameBtns();
        }

    }

    /** 分享录制视频*/
    private videoShare() {
        this.btn_share.visible = false;
        PlatformManager.Jsb.onShare(this, this.box_win.visible);
    }

    againType() {
        if (this.box_win.visible) {
            this.addWinDmd(false);
            this.reloadGame();
        }else{
            this.reloadGame();
        }
    }

    /** 头条互推轮播点击*/
    btnPush(){
        PlatformManager.Jsb.TTnavigateToMiniGame();
    }
}

export enum AdvType {
    normal,
    sbkaishi,
    wblingqu,
    jxyx,
    signFanbei,
    skinUse,
    skinDiscount
}