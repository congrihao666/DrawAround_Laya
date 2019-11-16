import { JsbBase, AdvertType } from "./JsbBase";

export class JsbAndroid extends JsbBase {


    private bridge = null;
    private bridgeJsb = null;

    constructor() {
        super();

        this.bridge = PlatformClass.createClass("jsb.JsbAndroid");
    }

    public openAdvert(type: AdvertType) {
        switch (type) {
            case AdvertType.OpenScreen: {
                this.openSplashAd();
                break;
            }
            case AdvertType.ExcitationVideo: {
                this.openRewardVideo();
                break;
            }
            case AdvertType.TableScreen: {
                this.showInstertView();
                break;
            }
        }
    }

    public openSplashAd() {
        this.bridge.call("openSplashActivity");
    }

    public getIsCachedVideo(): boolean {
        return this.bridge.call("getIsCachedVideo");
    }

    public openRewardVideo() {
        this.bridge.call("openRewardVideo");
    }

    public getIsInstertView() {
        return true;
    }

    public showInstertView() {
        this.bridge.call("showInterstital");
    }

    public openVibrateLong() {
        this.bridge.call("openVibrate", 200);
    }

    public exitGame(){
        this.bridge.call("exitGame");
    }
}