import { ui } from "../ui/layaMaxUI";
import g_constD from "../games/ConstData";
import g_sceneM from "../games/SceneManager";
import g_tipM from "./TipManger";
import g_evnetM from "./EventManager";
import { AdvType } from "../games/GameUI";
import { AdvertType } from "../platforms/JsbBase";
import { PlatformManager } from "../platforms/PlatformManager";

export default class SkinDlg extends ui.SkinDlgUI {
    skinsData: any[];
    isDiscount: boolean = false;
    
    constructor() {
        super();
        this.init();
        this.initMouseEvent();
    }

    init() {
        let skinurl = "res/config/skins.json";
        this.skinsData = Laya.loader.getRes(skinurl);
        this.skinsData.splice(0, 1);
        this.skinsData.sort(function (a, b) {
            return a.id - b.id;
        })
        g_constD.skinData = this.skinsData;
        this.list_skin.dataSource = this.skinsData;
        // this.list_skin.selectedIndex = 0;
        this.list_skin.vScrollBarSkin = "";
    }

    initMouseEvent() {
        this.img_back.on(Laya.Event.CLICK, this, this.closeDlg);
        this.btn_buy.on(Laya.Event.CLICK, this, this.buyOnClick);
        this.list_skin.renderHandler = new Laya.Handler(this, this.listOnRender);
        this.list_skin.mouseHandler = new Laya.Handler(this, this.listMouseHander);
    }

    listOnRender(cell: Laya.Box, index: number) {
        let skinData = this.skinsData[index] as SkinData;
        if (!skinData) return;
        let img_di1 = cell.getChildByName("img_di1") as Laya.Image;
        let btn_di2 = cell.getChildByName("btn_di2") as Laya.Button;
        let img_di3 = cell.getChildByName("img_di3") as Laya.Image;
        let img_item = cell.getChildByName("img_item") as Laya.Image;
        let img_dmd = cell.getChildByName("img_dmd") as Laya.Image;
        let label_dnum = cell.getChildByName("label_dnum") as Laya.Label;

        let isHaved = g_constD.ownedSkin.indexOf(+skinData.id) > -1;
        let isEquipd = g_constD.equipId == +skinData.id;
        let getType = +skinData.unlock_type;
        let isSignGet = getType == 2 && !isHaved;

        img_di1.skin = isEquipd ? "skin/pf-di1.png" : "skin/pf-di2.png";
        img_di3.visible = isHaved || isSignGet;
        btn_di2.visible = !isHaved;
        img_dmd.visible = label_dnum.visible = !isHaved && !isSignGet;
        btn_di2.skin = isSignGet ? "skin/pf-anniu2.png" : "skin/pf-anniu1.png";
        img_di3.skin = isSignGet ? "skin/pf-qdjs.png" : (isEquipd ? "skin/pf-dqcd.png" : "skin/pf-yg.png");
        btn_di2.mouseEnabled = !isSignGet;
        let needDmd = this.isDiscount ? +skinData.unlock_need/2 : +skinData.unlock_need;
        label_dnum.text = needDmd + "";
        img_item.skin = "skin/" + skinData.skin_res_name + ".png";
        img_item.scale(0.3, 0.3)
    }

    listMouseHander(e: Event, index: number) {
        if (e.type != Laya.Event.CLICK) return;
        let skinData = this.skinsData[index] as SkinData;
        let id = +skinData.id;
        let isHaved = g_constD.ownedSkin.indexOf(id) > -1;
        let isEquipd = g_constD.equipId == id;
        if (isHaved && !isEquipd) {
            g_tipM.showTip("穿戴成功!");
            g_constD.equipId = id;
            g_sceneM.setLocalEquipId(id);
            g_evnetM.DispatchEvent("equip_skin", id);
            this.refresh();
            return;
        }
        if (!(e.target instanceof Laya.Button)) return;
        let dmd = this.isDiscount ? +skinData.unlock_need/2 : +skinData.unlock_need;
        let text = "购买成功!"
        if (g_constD.gold >= dmd) {
            this.openBtn(true);
            this.isDiscount = false;
            g_constD.gold -= dmd;
            g_sceneM.setLocalGold(g_constD.gold);
            g_evnetM.DispatchEvent("update_gold");
            g_constD.ownedSkin.push(id);
            g_sceneM.setLocalOwnedSkin(g_constD.ownedSkin);
            this.refresh();
        } else {
            text = "钻石不足!";
        }
        g_tipM.showTip(text);
    }

    closeDlg() {
        g_sceneM.openSkin(false);
    }

    buyOnClick() {
        if (!PlatformManager.Jsb.getIsCachedVideo()) {
            g_tipM.showTip("视频正在准备中！");
            return;
        }
        g_constD.advType = AdvType.skinDiscount;
        if (g_sceneM.isMusicOn) g_evnetM.DispatchEvent("stop_music");
        PlatformManager.Jsb.openAdvert(AdvertType.ExcitationVideo);
    }

    advBack(data: string) {
        if (g_constD.advType != AdvType.skinDiscount) return;
        let arr = data.split(",");
		let success = +arr[1];
		let type = +arr[0];
        if (g_sceneM.isMusicOn) g_evnetM.DispatchEvent("play_music");
        if (type != AdvertType.ExcitationVideo || success != 1) return;
        g_constD.advType = AdvType.normal;

        this.isDiscount = true;
        this.refresh();
        this.openBtn(false);
    }

    openBtn(isopen: boolean) {
        this.btn_buy.visible = isopen;
    }

    refresh() {
        this.list_skin.refresh();
    }
}

class SkinData {
    skin_try_weight: string;
    id: string;
    name: string;
    skin_res_name: string;
    unlock_type: string;
    unlock_need: string;
    skin_try_icon: string;
}
