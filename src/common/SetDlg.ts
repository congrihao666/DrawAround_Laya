import { ui } from "../ui/layaMaxUI";
import g_sceneM from "../games/SceneManager";
import { PlatformManager } from "../platforms/PlatformManager";
import g_constD from "../games/ConstData";
import g_evnetM from "./EventManager";

export default class SetDlg extends ui.SetDlgUI {
    constructor() {
        super();
        this.initMouseEvent();
    }

    initMouseEvent() {
        this.img_music.on(Laya.Event.CLICK, this, this.openMusic);
        this.img_sound.on(Laya.Event.CLICK, this, this.openSound);
        this.img_shake.on(Laya.Event.CLICK, this, this.openShake);
        this.img_back.on(Laya.Event.CLICK, this, this.closeDlg);
    }

    closeDlg() {
        g_sceneM.openSet(false);
    }

    openMusic() {
        g_sceneM.isMusicOn = !g_sceneM.isMusicOn;
        if (g_sceneM.isMusicOn) {
            g_evnetM.DispatchEvent("play_music")
            this.img_music.skin = "img/sz-kai.png";
            this.icon_music.skin = "img/sz-ty1.png";
        } else {
            g_evnetM.DispatchEvent("stop_music")
            this.img_music.skin = "img/sz-guan.png";
            this.icon_music.skin = "img/sz-ty2.png";
        }
    }

    openSound() {
        g_sceneM.isSoundOn = !g_sceneM.isSoundOn;
        if (g_sceneM.isSoundOn) {
            this.img_sound.skin = "img/sz-kai.png";
            this.icon_sound.skin = "img/sz-yl1.png";
        } else {
            this.img_sound.skin = "img/sz-guan.png";
            this.icon_sound.skin = "img/sz-yl2.png";
        }
    }

    openShake() {
        g_sceneM.isShakeOn = !g_sceneM.isShakeOn;
        if (g_sceneM.isShakeOn) {
            this.img_shake.skin = "img/sz-kai.png";
            this.icon_shake.skin = "img/sz-zd1.png";
        } else {
            this.img_shake.skin = "img/sz-guan.png";
            this.icon_shake.skin = "img/sz-zd2.png";
        }
    }
}