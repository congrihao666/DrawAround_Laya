import { JsbBase } from "./JsbBase";
import { JsbAndroid } from "./JsbAndroid";
import JsbOppoMiniGame from "./JsbOppoMiniGame";
import JsbTouTiao from "./JsbTouTiao";
import JsbVivoMiGame from "./JsbVivoMiGame";
import { JsbQQMinniGame } from "./JsbQQMinniGame";
import { JsbBaiDuMiGame } from "./JsbBaiDuMiGame";
import PubUtils from "../common/PubUtils";

export enum PlatformType {
    None,

    Android,

    /**
     * oppo小游戏
     */
    OppoMinGame,

    /**
     * 头条小游戏
     */
    TTMinGame,

    /**
     * 百度小游戏
     */
    BaiDuMinGame,

    /**
     * vivo 小游戏
     */
    VivoMinGame,

    QQMinGame,

    WXMinGame

}

export class PlatformManager {
    static Jsb: JsbBase;

    static platform: PlatformType;

    static userid: string;

    static init(platform: PlatformType) {
        this.platform = platform;
        let jsb = new JsbBase();

        if (this.platform == PlatformType.Android) {
            jsb = new JsbAndroid();
        } else if (this.platform == PlatformType.OppoMinGame) {
            jsb = new JsbOppoMiniGame();
        } else if (this.platform == PlatformType.TTMinGame && typeof tt.createRewardedVideoAd == "function") {
            jsb = new JsbTouTiao();
        } else if (this.platform == PlatformType.VivoMinGame && qg.getSystemInfoSync().platformVersionCode >= 1031) {
            jsb = new JsbVivoMiGame();
        } else if (this.platform == PlatformType.QQMinGame) {
            jsb = new JsbQQMinniGame();
        } else if (this.platform == PlatformType.BaiDuMinGame) {
            jsb = new JsbBaiDuMiGame();
        }


        jsb.init();
        this.Jsb = jsb;
    }

    static initData() {
        let userid = PubUtils.GetLocalData("uuid");
        if (userid != null && userid != "") {
            this.userid = userid;
        } else {
            this.userid = PubUtils.generateUUID();
            PubUtils.SetLocalData("uuid", this.userid);
        }
    }
}


