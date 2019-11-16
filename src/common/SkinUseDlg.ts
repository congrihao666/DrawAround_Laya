import { ui } from "../ui/layaMaxUI";
import g_sceneM from "../games/SceneManager";
import g_constD from "../games/ConstData";
import g_evnetM from "./EventManager";
import { AdvType } from "../games/GameUI";
import { PlatformManager } from "../platforms/PlatformManager";
import g_tipM from "./TipManger";
import { AdvertType } from "../platforms/JsbBase";
import globalFun from "../games/GlobalFunc";

export default class SkinUseDlg extends ui.SkinUseDlgUI {
    skin1id: number;
    skin2id: number;
    skin3id: number;
    finalId: number;

    constructor() {
        super();
        this.updateSkin();
        this.initMouseEvent();
    }

    updateSkin() {
        let sdata = g_constD.skinData;
        this.skin1id = this.skin2id = this.skin3id = 0;
        let cnt = 0;
        let avrnum = 0;
        for (let i = 0; i < sdata.length; ++i) {
            if (i == Math.ceil(sdata.length / 2)) avrnum = cnt;
            cnt += +sdata[i].skin_try_weight;
        }
        let rad1 = globalFun.getRandom(0, avrnum);
        let rad2 = globalFun.getRandom(avrnum, cnt);
        let rad3 = globalFun.getRandom(0, cnt);

        cnt = 0;
        for (let i = 0; i < sdata.length; ++i) {
            let idata = sdata[i];
            cnt += +idata.skin_try_weight;
            if (!this.skin1id && rad1 < cnt) {
                this.skin1id = +idata.id;

            }
            if (!this.skin2id && rad2 < cnt) {
                this.skin2id = +idata.id;

            }
            if (!this.skin3id && rad3 < cnt) {
                this.skin3id = +idata.id;
            }
        }

        this.img_skin1.skin = "skin/pen_" + this.skin1id + ".png";
        this.img_skin2.skin = "skin/pen_" + this.skin2id + ".png";
    }

    initMouseEvent() {
        this.img_back.on(Laya.Event.CLICK, this, this.closeDlg);
        this.btn_shiyong1.on(Laya.Event.CLICK, this, this.useSkin, [1]);
        this.btn_shiyong2.on(Laya.Event.CLICK, this, this.useSkin, [2]);
        this.btn_shiyong3.on(Laya.Event.CLICK, this, this.useSkin, [3]);
        this.check_not.on(Laya.Event.CLICK, this, this.checkOnClick);

        g_evnetM.AddEvent("Advertisement", this, this.advBack);
    }

    checkOnClick() {
        g_constD.isSkinUsePop = !this.check_not.selected;
    }

    closeDlg() {
        g_sceneM.openSkinUseDlg(false);
    }

    useSkin(type: number) {
        if (!PlatformManager.Jsb.getIsCachedVideo()) {
            g_tipM.showTip("视频正在准备中！");
            return;
        }
        g_constD.advType = AdvType.skinUse;
        this.btn_shiyong1.mouseEnabled = this.btn_shiyong2.mouseEnabled = this.btn_shiyong3.mouseEnabled = false;
        if (g_sceneM.isMusicOn) g_evnetM.DispatchEvent("stop_music");
        PlatformManager.Jsb.openAdvert(AdvertType.ExcitationVideo);
        if (type == 1) {
            this.finalId = this.skin1id;
        } else if (type == 2) {
            this.finalId = this.skin2id;
        } else {
            this.finalId = this.skin3id;
        }
        this.closeDlg();
    }

    advBack(data: string) {
        if (g_constD.advType != AdvType.skinUse) return;
        this.btn_shiyong1.mouseEnabled = this.btn_shiyong2.mouseEnabled = this.btn_shiyong3.mouseEnabled = true;
        let arr = data.split(",");
		let success = +arr[1];
		let type = +arr[0];
        if (g_sceneM.isMusicOn) g_evnetM.DispatchEvent("play_music");
        if (type != AdvertType.ExcitationVideo || success != 1) return;
        g_constD.advType = AdvType.normal;

        g_tipM.showTip("试用成功！");
        g_evnetM.DispatchEvent("equip_skin", this.finalId);
    }
}