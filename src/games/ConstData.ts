import { AdvType } from "./GameUI";

class ConstData {
    static readonly Instance: ConstData = new ConstData;

    gold: number = 0;
    nowLvl: number = 1; //实际关卡，有轮回
    totalLvl: number = 20; //总共关卡数
    nowLvlTimes: number = 1; //显示关卡
    winGold: number = 20;
    ownedSkin = [0]; //拥有的皮肤
    equipId: number = 0; //当前装备皮肤的id
    isSkinUsePop: boolean = true; //皮肤试用是否弹出
    signDay: number = 0; //签到天数
    signTime: number = 0; //上次签到时间
    advType: number = AdvType.normal;

    cylR: number = 0.6;
    cylH: number = 0.3;
    penMinH: number = 9;
    penMaxH: number = 12;

    bookData = new Laya.Vector3(32, 3.75, 45); //书的长宽高

    skinData: any[];


    BGM = "res/music/gamebgm.mp3";
    winM = "res/music/win.wav";

    goldStorageName: string = "drawaround_gold";
    lvlStorageName: string = "drawaround_lvl";
    lvlTimesStorageName: string = "drawaround_lvl_times";
    skinStorageName: string = "drawaround_skins";
    equipIdStorageName: string = "drawaround_equip_skin_id";
    signDayStorageName: string = "drawaround_sign_day";

    wall_col_group: number = Laya.Physics3DUtils.COLLISIONFILTERGROUP_DEFAULTFILTER;
}

var g_constD = ConstData.Instance;
export default g_constD;