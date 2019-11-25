import GameConfig from "./GameConfig";
import { PlatformManager, PlatformType } from "./platforms/PlatformManager";
import g_evnetM from "./common/EventManager";
import g_sceneM from "./games/SceneManager";
import GameUI from "./games/GameUI";
import PubUtils from "./common/PubUtils";
import g_constD from "./games/ConstData";
import { AdvertType, SwitchType } from "./platforms/JsbBase";
import g_actionM from "./games/ActionManager";
import RecommendDlg from "./common/RecommendDlg";

class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.alignV = GameConfig.alignV;
		Laya.stage.alignH = GameConfig.alignH;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		//关闭多点触控
		Laya.MouseManager.multiTouchEnabled = false;
		g_evnetM.init();
		g_sceneM.initEvent();

		// Laya.Stat.show();

		PlatformManager.init(PlatformType.VivoMinGame);

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.loadConfig));
	}

	loadConfig() {
		g_evnetM.DispatchEvent("add_load_view");

		Laya.loader.create([
			"game/Scene/Conventional/Scene.ls",
			"game/caizhiqiu/Conventional/Assets/yanse/purple.lmat",
			"game/effect1/Conventional/effect1.lh",

			"res/config/signin.json",
			"res/config/skins.json",
			"res/config/move.json",

			"res/atlas/img.atlas",
			"res/atlas/load.atlas",
			"res/atlas/skin.atlas"
		], new Laya.Handler(this, this.onConfigLoaded))
	}

	onConfigLoaded(): void {
		//加载IDE指定的场景
		// GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);

		let gold = +PubUtils.GetLocalData(g_constD.goldStorageName);
		if (gold) g_constD.gold = gold;

		let nowLvl = +PubUtils.GetLocalData(g_constD.lvlStorageName);
		if (nowLvl) g_constD.nowLvl = nowLvl;

		let nowLvlTimes = +PubUtils.GetLocalData(g_constD.lvlTimesStorageName);
		if (nowLvlTimes) g_constD.nowLvlTimes = nowLvlTimes;

		let ownedSkinStr = PubUtils.GetLocalData(g_constD.skinStorageName) as string;
		if (ownedSkinStr) {
			let ownedSkin = ownedSkinStr.split("|");
			for (let i = 0; i < ownedSkin.length; ++i) {
				g_constD.ownedSkin[i] = +ownedSkin[i];
			}
		}

		let equipId  = +PubUtils.GetLocalData(g_constD.equipIdStorageName);
		if (equipId) g_constD.equipId = equipId;

		let signDayStr = PubUtils.GetLocalData(g_constD.signDayStorageName) as string;
		if (signDayStr) {
			let signDayArr = signDayStr.split("|");
			let signDay = +signDayArr[0];
			let signTime = +signDayArr[1];
			g_constD.signDay = signDay;
			g_constD.signTime = signTime;
		}

		
		
		g_actionM.init();
		g_sceneM.init();
		PlatformManager.initData();
		
		
		let gameui = new GameUI();
		gameui.openBox(1);
		Laya.stage.addChild(gameui);
		gameui.zOrder = 100;
		gameui.init();

		PlatformManager.Jsb.checkIsMiGame((type:SwitchType) => {
			if(type == SwitchType.On){
				let recomui = new RecommendDlg;
				Laya.stage.addChild(recomui);
				recomui.zOrder = 200;
			}
		})

		if (PlatformManager.platform == PlatformType.VivoMinGame) {
			Laya.timer.once(3 * 1000, this, () => {
				PlatformManager.Jsb.openAdvert(AdvertType.OpenScreen);
			});
		} else {
			PlatformManager.Jsb.openAdvert(AdvertType.OpenScreen);
		}

		g_evnetM.DispatchEvent("load_scene_over");
	}
}
//激活启动类
new Main();
