import { ui } from "../ui/layaMaxUI";
import g_sceneM from "../games/SceneManager";
import g_constD from "../games/ConstData";
import g_evnetM from "./EventManager";
import g_tipM from "./TipManger";
import { PlatformManager } from "../platforms/PlatformManager";
import { AdvType } from "../games/GameUI";
import { AdvertType } from "../platforms/JsbBase";

export default class SigninDlg extends ui.SigninDlgUI {
    siginData: SigninData[];

    constructor() {
        super();
        this.init();
        this.initMouseEvent();
    }

    closeDlg() {
        g_sceneM.openSignin(false);
        PlatformManager.Jsb.showBannder();
    }

    init() {
        let signUrl = "res/config/signin.json";
        this.siginData = Laya.loader.getRes(signUrl);
        this.siginData.splice(0, 1);
        this.siginData.sort(function (a, b) {
            return +a.id - +b.id;
        })

        this.list_signin.dataSource = this.siginData;
        this.list_signin.selectedIndex = 0;

        let nowT = new Date(Laya.Browser.now());
        let day = nowT.getDay();
        this.setBtnVis(day != g_constD.signTime);
    }

    initMouseEvent() {
        this.img_back.on(Laya.Event.CLICK, this, this.closeDlg);
        this.label_double.on(Laya.Event.CLICK, this, this.lookAdv);
        this.label_recieve.on(Laya.Event.CLICK, this, this.recieveDmd, [false]);

        this.list_signin.renderHandler = new Laya.Handler(this, this.listOnRender);

        g_evnetM.AddEvent("Advertisement", this, this.advBack);
        
    }

    listOnRender(cell: Laya.Box, index: number) {
        let signdata = this.siginData[index] as SigninData;
        if (!signdata) return;
        let img_bg1 = cell.getChildByName("img_bg1") as Laya.Image;
        let img_icon = cell.getChildByName("img_icon") as Laya.Image;
        let label_day = cell.getChildByName("label_day") as Laya.Label;
        let label_text = cell.getChildByName("label_text") as Laya.Label;
        let img_gou = cell.getChildByName("img_gou") as Laya.Image;

        img_bg1.skin = index < g_constD.signDay ? "skin/qd-7tiandi.png" : "skin/qd-7tiandi.png";
        img_gou.visible = index < g_constD.signDay;
        let surl = "img/start-z.png";
        let sid = +signdata.reward_skinid;
        if (sid) surl = "skin/pen_" + sid + ".png";
        img_icon.skin = surl;
        let sca = +signdata.icon_scale;
        img_icon.scale(sca, sca);
        label_day.text = "第" + (index + 1) + "天";
        label_text.text = signdata.name;

        if (index == this.siginData.length - 1) {
            let lw = this.list_signin.width;
            cell.width = lw;
            img_bg1.width = lw;
            cell.x = lw / 2 - 79;
        }
    }

    lookAdv() {
        if (PlatformManager.Jsb.getIsCachedVideo()) {
            g_constD.advType = AdvType.signFanbei;
            if (g_sceneM.isMusicOn) g_evnetM.DispatchEvent("stop_music");
            PlatformManager.Jsb.openAdvert(AdvertType.ExcitationVideo);
            this.label_double.mouseEnabled = this.label_recieve.mouseEnabled = false;
        } else {
            g_tipM.showTip("视频正在准备中！");
        }
    }

    advBack(data: string) {
        if (g_constD.advType != AdvType.signFanbei) return;
        this.label_double.mouseEnabled = this.label_recieve.mouseEnabled = true;
        let arr = data.split(",");
		let success = +arr[1];
		let type = +arr[0];
        if (g_sceneM.isMusicOn) g_evnetM.DispatchEvent("play_music");
        if (type != AdvertType.ExcitationVideo || success != 1) return;
        g_constD.advType = AdvType.normal;

        this.recieveDmd(true);
    }

    recieveDmd(isDouble: boolean) {
        let sdata = this.siginData[g_constD.signDay];
        if (!sdata) return;
        let gold = +sdata.reward_gold;
        let times = isDouble ? 2 : 1;
        let text = isDouble ? sdata.destext_double : sdata.destext;
        g_constD.gold += (times * gold);
        g_sceneM.setLocalGold(g_constD.gold);
        g_evnetM.DispatchEvent("update_gold");
        g_tipM.showTip(text, 4000);
        if (++g_constD.signDay > 6) g_constD.signDay = 0;
        let nowDay = new Date(Laya.Browser.now());
        g_constD.signTime = nowDay.getDay();
        let str = g_constD.signDay + "|" + g_constD.signTime;
        g_sceneM.setLocalSignDayAndTime(str);
        this.setBtnVis(false);
        this.list_signin.refresh();

        let sid = +sdata.reward_skinid;
        if (sid && !(g_constD.ownedSkin.indexOf(sid) > -1)) {
            g_constD.ownedSkin.push(sid);
            g_sceneM.setLocalOwnedSkin(g_constD.ownedSkin);
        }
    }

    setBtnVis(vis: boolean) {
        this.label_double.visible = this.label_recieve.visible = vis;
    }
}

class SigninData {
    icon_scale: string;
    id: string;
    name: string;
    reward_gold: string;
    reward_skinid: string;
    destext: string;
    destext_double: string;
    signin_icon: string;
}