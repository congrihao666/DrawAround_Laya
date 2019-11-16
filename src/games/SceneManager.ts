import g_evnetM from "../common/EventManager";
import g_constD from "./ConstData";
import g_actionM from "./ActionManager";
import LoadView from "../common/LoadView";
import globalFun from "./GlobalFunc";
import PubUtils from "../common/PubUtils";
import { PlatformManager } from "../platforms/PlatformManager";
import SetDlg from "../common/SetDlg";
import SkinDlg from "../common/SkinDlg";
import SigninDlg from "../common/SigninDlg";
import SkinUseDlg from "../common/SkinUseDlg";
import TigColScript from "./TigColScript";

class SceneManager {
    static readonly Instance: SceneManager = new SceneManager;

    gameScene: Laya.Scene3D;
    camera: Laya.Camera;
    myPen: Laya.MeshSprite3D; //笔
    myPenTrans: Laya.Transform3D;
    canister: Laya.MeshSprite3D; //笔筒
    // drawPlane: Laya.MeshSprite3D; //画线的渲染面板

    isDoubleStart: boolean = false;

    isGamimg: boolean = false;
    isDrawing: boolean = false;
    isPausing: boolean = false;
    
    isSoundOn: boolean = true;
    isMusicOn: boolean = true;
    isShakeOn: boolean = true;
    
    loadView: LoadView;
    setsDlg: SetDlg;
    skinDlg: SkinDlg;
    signinDlg: SigninDlg;
    skinUseDlg: SkinUseDlg;

    colorCylinders: Laya.Sprite3D; //颜料的父节点
    wayPointManager: Laya.Sprite3D; //每一关的控制点总精灵节点
    wayPointSp: Laya.Sprite3D; //每个阶段控制点精灵节点
    wayPoints: any[] = []; //控制点数组
    colorsPosArr: Laya.Vector3[] = []; //3d贝塞尔点数组,用于颜料位置
    drawPosArr: Laya.Vector2[] = []; //2d贝塞尔点数组,用于画线
    wayPrg: number = 0; //第几阶段的线
    initCyls: any = {}; //初始圆柱形mesh
    initLinePath: Laya.MeshSprite3D; //初始路径mesh
    colorMat: Laya.BlinnPhongMaterial; //颜料材质
    lastRotay: number; //同一组中上一个颜料的选装角度
    moveData: any;
    obstacles: Laya.Sprite3D; //障碍物父节点
    obsColor: Laya.Vector4 = new Laya.Vector4(0, 0.2, 1, 1);
    linePaths: Laya.Sprite3D; //路径父节点
    winEffects: Laya.ShuriKenParticle3D[] = []; //胜利时的粒子特效数组


    init() {        
        this.creatDlg();
        this.moveData = Laya.loader.getRes("res/config/move.json");
    }

    initEvent() {
        g_evnetM.AddEvent("add_load_view", this, this.addLoadView);
        g_evnetM.AddEvent("load_scene_over", this, this.delLoadView);
        g_evnetM.AddEvent("equip_skin", this, this.equipSkin);
        g_evnetM.AddEvent("now_progress_end", this, this.tweenPen);
        g_evnetM.AddEvent("obstacle_onhit", this, this.gameLose);
        g_evnetM.AddEvent("play_music", this, this.playBGM);
        g_evnetM.AddEvent("stop_music", this, this.stopBGM);
        g_evnetM.AddEvent("shock_screen", this, this.shakeScreen);
    }

    playBGM() {
        PlatformManager.Jsb.playMusic(g_constD.BGM, 0);
    }

    stopBGM() {
        PlatformManager.Jsb.stopMusic();
    }

    playSound(url: string) {
        if (this.isSoundOn) PlatformManager.Jsb.playSound(url);
    }

    shakeScreen() {
        if (this.isShakeOn) PlatformManager.Jsb.openVibrateShort();
    }

    addLoadView() {
        this.loadView = new LoadView();
        Laya.stage.addChild(this.loadView);
        this.loadView.zOrder = 1000;
    }

    delLoadView() {
        if (!this.loadView) return;
        this.loadView.destroy();
        this.loadView = null;
    }

    creatDlg() {
        this.setsDlg = new SetDlg;
        Laya.stage.addChild(this.setsDlg);
        this.setsDlg.zOrder = 200;
        this.openSet(false);

        this.skinDlg = new SkinDlg;
        Laya.stage.addChild(this.skinDlg);
        this.skinDlg.zOrder = 210;
        this.openSkin(false);

        this.signinDlg = new SigninDlg;
        Laya.stage.addChild(this.signinDlg);
        this.signinDlg.zOrder = 220;
        this.openSignin(false);

        this.skinUseDlg = new SkinUseDlg;
        Laya.stage.addChild(this.skinUseDlg);
        this.skinUseDlg.zOrder = 230;
        this.openSkinUseDlg(false);
    }

    openSet(isOpen: boolean) {
        this.setsDlg.visible = isOpen;
    }

    openSkin(isOpen: boolean) {
        this.skinDlg.visible = isOpen;
        if (isOpen) this.skinDlg.refresh();
    }

    openSignin(isOpen: boolean) {
        this.signinDlg.visible = isOpen;
    }

    openSkinUseDlg(isOpen: boolean) {
        this.skinUseDlg.updateSkin();
        this.skinUseDlg.visible = isOpen;
    }

    equipSkin(id: number) {
        let src = "game/pen_" + id + "/Conventional/pen_" + id + ".lh";
        Laya.Sprite3D.load(src, new Laya.Handler(this, (pensp: Laya.Sprite3D)=> {
            if (!pensp) return;
            let pen = pensp.getChildByName("pen") as Laya.MeshSprite3D;
            if (!pen) return;
            this.myPen.meshFilter.sharedMesh = pen.meshFilter.sharedMesh.clone();
            this.myPen.meshRenderer.material = pen.meshRenderer.material.clone();
        }))
    }

    setLocalLvl(lvl: number) {
        PubUtils.SetLocalData(g_constD.lvlStorageName, lvl);
    }

    setLocalLvlTimes(times: number) {
        PubUtils.SetLocalData(g_constD.lvlTimesStorageName, times);
    }

    setLocalGold(gold: number) {
        PubUtils.SetLocalData(g_constD.goldStorageName, gold);
    }

    setLocalEquipId(id: number) {
        PubUtils.SetLocalData(g_constD.equipIdStorageName, id);
    }

    setLocalOwnedSkin(skinArr: number[]) {
        let skin = "";
        for (let i = 0; i < skinArr.length; ++i) {
            if (i == 0) {
                skin += skinArr[i];
            } else {
                skin += ("|" + skinArr[i]);
            }
        }
        PubUtils.SetLocalData(g_constD.skinStorageName, skin);
    }

    setLocalSignDayAndTime(day: string) {
        PubUtils.SetLocalData(g_constD.signDayStorageName, day);
    }

    

    destroyScene() {
        // Laya.timer.clearAll(this);
        let cyl = this.gameScene.getChildByName("color_cylinder");
        cyl.destroy();

        let lines = this.gameScene.getChildByName("linepaths");
        lines.destroy();

        g_actionM.lineSp.graphics.clear();

        this.destroyObs();
    }

    destroyObs() {
        Laya.timer.clearAll(this);
        let obs = this.gameScene.getChildByName("obstacles");
        obs && obs.destroy();
    }

    destroyPart() {
        for (let i = this.colorCylinders.numChildren - 1; i >= 0; --i) {
            let obs = this.colorCylinders.getChildAt(i) as Laya.MeshSprite3D;
            if (obs.name == "cyl" + this.wayPrg) obs.destroy();
        }
        g_actionM.pindex = 0;
    }

    startGame() {
        let src = "game/Scene/Conventional/Scene.ls";
        this.gameScene = Laya.loader.getRes(src);
        this.gameScene.cacheAs = "bitmap"
        Laya.stage.addChild(this.gameScene);
        this.camera = this.gameScene.getChildByName("Camera") as Laya.Camera;

        let efsp = Laya.loader.getRes("game/effect1/Conventional/effect1.lh") as Laya.Sprite3D;
        let effectleft = (<Laya.ShuriKenParticle3D>efsp.getChildByName("toleft")).clone() as Laya.ShuriKenParticle3D;
        let effectright = (<Laya.ShuriKenParticle3D>efsp.getChildByName("toright")).clone() as Laya.ShuriKenParticle3D;

        for (let i = 0; i < 4; ++i) {
            let effi: Laya.ShuriKenParticle3D;
            let tn1 = i < 2 ? 1: 0;
            let tn2 = i % 2 == 0 ? 1 : -1;
            if (tn1) {
                effi = effectright.clone() as Laya.ShuriKenParticle3D;
            } else {
                effi = effectleft.clone() as Laya.ShuriKenParticle3D;
            }
            this.winEffects[i] = effi;
            effi.transform.position = new Laya.Vector3(-g_constD.bookData.x*tn1, 0, g_constD.bookData.z/2*tn2);
            this.gameScene.addChild(effi);
            console.log(tn1, tn2)
        }

        this.initPen();
    }

    initPen() {
        let penid = g_constD.equipId;
        let src = "game/pen_" + penid + "/Conventional/pen_" + penid + ".lh";
        Laya.Sprite3D.load(src, new Laya.Handler(this, (pensp: Laya.Sprite3D)=> {
            if (!pensp) return;
            this.myPen = (<Laya.MeshSprite3D>pensp.getChildByName("pen")).clone() as Laya.MeshSprite3D;
            this.gameScene.addChild(this.myPen);
            this.myPenTrans = this.myPen.transform;    

            this.canister = this.gameScene.getChildByName("tong") as Laya.MeshSprite3D;
            this.colorMat = Laya.loader.getRes("game/caizhiqiu/Conventional/Assets/yanse/purple.lmat").clone() as Laya.BlinnPhongMaterial;
    
            this.creatCyl();
            this.loadGame();
        }))
    }

    setPenH(isdown: boolean) {
        let ty = isdown ? g_constD.penMinH : g_constD.penMaxH;
        let penpos = this.myPenTrans.position;
        this.myPenTrans.position = new Laya.Vector3(penpos.x, ty, penpos.z);
    }

    updatePen(vec: Laya.Vector3) {
        this.myPenTrans.position = new Laya.Vector3(vec.x, this.myPenTrans.position.y, vec.z);
    }

    tweenPen() {
        this.wayPrg++;
        this.lastRotay = null;

        let value = (this.wayPrg-1) / this.wayPointManager.numChildren;
        g_evnetM.DispatchEvent("update_prg", value);

        this.shakeScreen();

        if (value >= 1) {
            this.gameWin();
            return;
        }
        if (!this.isGamimg) return;
        this.isPausing = true;


        this.calNextPos();

        let delt = 200;
        let movet = 500;
        let lrez = this.myPenTrans.localRotationEulerZ;
        let targ2 = {value: lrez};
        
        let tvec = this.wayPoints[0][0];
        let fvec = this.myPenTrans.position;
        let target = {x: fvec.x, z: fvec.z};
        this.myPenTrans.position = new Laya.Vector3(target.x, g_constD.penMaxH, target.z);

        g_actionM.drawLine();

        Laya.Tween.to(targ2, {value: lrez + 360, update: new Laya.Handler(this, ()=> {
            this.myPenTrans.localRotationEulerZ = targ2.value;
        })}, delt)
        Laya.Tween.to(target, {x: tvec.x, z: tvec.z, update: new Laya.Handler(this, ()=> {
            this.myPenTrans.position = new Laya.Vector3(target.x, fvec.y, target.z);
        })}, movet, null, new Laya.Handler(this, ()=> {
            g_sceneM.isDrawing && g_sceneM.setPenH(true);
            this.goNextProgress();
        }), delt)
    }

    reLoadGame() {
        // g_evnetM.DispatchEvent("add_load_view");
        // this.equipSkin(g_constD.equipId);
        this.destroyScene();
        this.loadGame();
    }

    loadGame() {
        let lvl = g_constD.nowLvl;
        if (lvl > g_constD.totalLvl) {
            lvl = g_constD.nowLvl = 1;
            this.setLocalLvl(lvl);
        }

        this.wayPointManager = this.gameScene.getChildByName("Waypoint_Manager" + g_constD.nowLvl) as Laya.Sprite3D;
        
        this.colorCylinders = this.gameScene.addChild(new Laya.Sprite3D) as Laya.Sprite3D;
        this.colorCylinders.name = "color_cylinder";

        this.obstacles = this.gameScene.addChild(new Laya.Sprite3D) as Laya.Sprite3D;
        this.obstacles.name = "obstacles";

        this.linePaths = this.gameScene.addChild(new Laya.Sprite3D) as Laya.Sprite3D;
        this.linePaths.name = "linepaths";

        this.wayPrg = 1;
        g_actionM.pindex = 0;
        this.creatObs();
        this.calNextPos();
        g_actionM.drawLine();
        this.goNextProgress();

        let vec: Laya.Vector3 = this.wayPoints[0][0];
        this.myPenTrans.position = new Laya.Vector3(vec.x, g_constD.penMaxH, vec.z);
    }

    continueGame() {
        this.isGamimg = true;
        let vec: Laya.Vector3 = this.wayPoints[0][0];
        this.myPenTrans.position = new Laya.Vector3(vec.x, g_constD.penMaxH, vec.z);
    }

    creatObs() {
        let lvl = g_constD.nowLvl;
        let obsdata = this.moveData["obstacle"]["lvl"+lvl];
        for (let i in obsdata) {
            let datai = obsdata[i];
            let type = +datai["type"];
            if (type == 1) {
                this.creatBoxObs(datai);
            } else if (type == 2) {
                this.creatCylObs(datai);
            }
        }
    }

    creatBoxObs(data) {
        let type = +data["type"];
        let x = -data["x"];
        let y = +data["y"];
        let angle = +data["angle"];
        let distance = +data["distance"];
        let width = +data["width"];
        let time = +data["time"];

        let obs = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(2, width, 2));
        let colshape = new Laya.BoxColliderShape(2, width, 2);
        obs.transform.position = new Laya.Vector3(x, 5, y);
        obs.transform.rotate(new Laya.Vector3(0, -angle, 90), false, false);
        this.obstacles.addChild(obs);

        obs.meshRenderer.material = this.colorMat.clone() as Laya.BlinnPhongMaterial;
        let obsmat = obs.meshRenderer.material as Laya.BlinnPhongMaterial;
        obsmat.albedoColor = this.obsColor.clone();

        let rigid = obs.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
        rigid.colliderShape = colshape;
        rigid.isKinematic = true;
        rigid.isTrigger = true;

        obs.addComponent(TigColScript);


        let rad = globalFun.angleToRad(angle);
        let mx = distance * Math.cos(rad);
        let mz = distance * Math.sin(rad);
        let ox = mx / (60 * time / 1000);
        let oz = mz / (60 * time / 1000);
        let dx = 0;
        let dz = 0;
        let f = 1;
        Laya.timer.frameLoop(1, this, ()=> {
            dx += ox;
            dz += oz;
            if ((dx*dx + dz*dz) > distance*distance) {
                f = -f;
                dx = dz = 0;
            }
            obs.transform.translate(new Laya.Vector3(f*ox, 0, f*oz), false);
        })
    }

    creatCylObs(data) {
        let type = +data["type"];
        let x = -data["x"];
        let y = +data["y"];
        let angle = +data["angle"];
        let distance = +data["distance"];
        let width = +data["width"];
        let time = +data["time"];

        let obs = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(1, width));
        let colshape = new Laya.CylinderColliderShape(1, width);
        obs.transform.position = new Laya.Vector3(x, 5, y);
        obs.transform.rotate(new Laya.Vector3(0, -angle, 90), false, false);
        this.obstacles.addChild(obs);

        obs.meshRenderer.material = this.colorMat.clone() as Laya.BlinnPhongMaterial;
        let obsmat = obs.meshRenderer.material as Laya.BlinnPhongMaterial;
        obsmat.albedoColor = this.obsColor.clone();

        let rigid = obs.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
        rigid.colliderShape = colshape;
        rigid.isKinematic = true;
        rigid.isTrigger = true;

        obs.addComponent(TigColScript);
        

        let t = angle == 0 ? 1 : -1;
        let ag = 6000 / time;
        Laya.timer.frameLoop(1, this, ()=> {
            obs.transform.rotate(new Laya.Vector3(0, t*ag, 0), false, false);
        })
    }

    calNextPos() {
        this.wayPoints = [];
        this.wayPointSp = this.wayPointManager.getChildByName("p" + this.wayPrg) as Laya.Sprite3D;
        for (let i = 0; i < this.wayPointSp.numChildren - 1; ++i) {
            let swp0 = this.wayPointSp.getChildByName("Waypoint " + i) as Laya.Sprite3D;
            let swp0r = swp0.getChildByName("Right") as Laya.Sprite3D;
            let swp1 = this.wayPointSp.getChildByName("Waypoint " + (i+1)) as Laya.Sprite3D;
            let swp1l = swp1.getChildByName("Left") as Laya.Sprite3D;

            let p0 = swp0.transform.position.clone();
            let p1 = swp0r.transform.position.clone();
            let p2 = swp1l.transform.position.clone();
            let p3 = swp1.transform.position.clone();

            let arr = [p0, p1, p2, p3];

            this.wayPoints.push(arr);
        }
    }

    goNextProgress() {
        this.isPausing = false;
        this.isGamimg = true;
    }

    addLinePath(x, z, rotay = 0) {
        let line = this.linePaths.addChild(this.initLinePath.clone()) as Laya.MeshSprite3D;
        line.transform.position = new Laya.Vector3(x, 3.8, z);
        // line.transform.rotate(new Laya.Vector3(0, rotay, 0), false, false);
    }

    creatCyl() {
        let colorType = this.moveData["colorType"];
        for (let i in colorType) {
            let colt = colorType[i];
            let cvec = new Laya.Vector4(colt[0]/255, colt[1]/255, colt[2]/255, 1);
            let cyl = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(g_constD.cylR, g_constD.cylH));
            cyl.transform.rotate(new Laya.Vector3(90, 0, 0), false, false);
            cyl.meshRenderer.material = this.colorMat.clone();
            let cylmat = cyl.meshRenderer.material as Laya.BlinnPhongMaterial;
            cylmat.albedoColor = cvec;

            this.initCyls[i] = cyl;
        }

        this.initLinePath = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(0.5,0.5));
        this.initLinePath.meshRenderer.material = this.colorMat.clone();
        let lpmat = this.initLinePath.meshRenderer.material as Laya.BlinnPhongMaterial;
        lpmat.albedoColor = new Laya.Vector4(0.25,0.25,0.25,1);
    }

    addCyl(vec: Laya.Vector3, rotay) {
        let colorData = this.moveData["colors"];
        let cor = colorData["lvl"+g_constD.nowLvl]["p"+this.wayPrg];
        if (!cor) return;

        let cyl = this.initCyls[cor].clone();
        this.colorCylinders.addChild(cyl);
        cyl.name = "cyl" + this.wayPrg;
        cyl.transform.position = vec;
        cyl.transform.rotate(new Laya.Vector3(0, rotay, 0), false, false);

        //尖角处理
        let norA = 30;
        let dr = Math.abs(this.lastRotay - rotay);
        if (this.lastRotay && dr > norA) {
            let cnt = Math.ceil(dr/norA)+2;
            for (let i = 1; i < cnt; ++i) {
                let newcyl = this.initCyls[cor].clone();
                this.colorCylinders.addChild(newcyl);
                newcyl.name = "cyl" + this.wayPrg;
                newcyl.transform.position = vec;
                let da = rotay - this.lastRotay;
                let newrotay = this.lastRotay + da*(i/cnt);
                newcyl.transform.rotate(new Laya.Vector3(0, newrotay, 0), false, false);
            }
        }
        
        this.lastRotay = rotay;
    }

    winTweenPen() {
        let delt = 200;
        let movet = 1000;
        let movet2 = 100;
        let lrez = this.myPenTrans.localRotationEulerZ;
        let tvec = this.canister.transform.position;
        let fvec = this.myPenTrans.position;
        let target = {x: fvec.x, z: fvec.z};
        let targ2 = {value: lrez};
        let targ3 = {value: fvec.y};

        this.myPenTrans.position = new Laya.Vector3(target.x, g_constD.penMaxH, target.z);

        Laya.Tween.to(targ2, {value: lrez + 360, update: new Laya.Handler(this, ()=> {
            this.myPenTrans.localRotationEulerZ = targ2.value;
        })}, delt);

        Laya.Tween.to(target, {x: tvec.x, z: tvec.z, update: new Laya.Handler(this, ()=> {
            this.myPenTrans.position = new Laya.Vector3(target.x, fvec.y, target.z);
        })}, movet, null, null, delt);
        
        Laya.Tween.to(targ3, {value: fvec.y-6, update: new Laya.Handler(this, function () {
            this.myPenTrans.position = new Laya.Vector3(fvec.x, targ3.value, fvec.z);
        })}, movet2, null, new Laya.Handler(this, function () {
            this.playWinEff();
            this.playSound(g_constD.winM);
            Laya.timer.once(3000, this, ()=> {
                g_evnetM.DispatchEvent("game_win");
            })
        }), delt+movet);

    }

    gameWin() {
        console.log("game win");
        this.wayPrg = 1;
        this.isGamimg = false;
        this.isDrawing = false;
        g_constD.nowLvl++;
        g_constD.nowLvlTimes++;
        this.setLocalLvl(g_constD.nowLvl);
        this.setLocalLvlTimes(g_constD.nowLvlTimes);

        this.winTweenPen();

        this.destroyObs();
    }

    gameLose() {
        console.log("game lose");
        this.isGamimg = false;
        this.isDrawing = false;
        g_evnetM.DispatchEvent("game_lose");
    }

    playWinEff() {
        for (let i = 0; i < this.winEffects.length; ++i) {
            let effi = this.winEffects[i];
            // effi.particleSystem.looping = true;
            effi.particleSystem.play();
        }
    }
}

var g_sceneM: SceneManager = SceneManager.Instance;
export default g_sceneM;