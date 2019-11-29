(function () {
    'use strict';

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1630;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "LoadView.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = false;
    GameConfig.init();

    class JsbBase {
        init() {
        }
        ;
        openSplashAd() {
        }
        getIsCachedVideo() {
            return false;
        }
        openRewardVideo() {
        }
        hideBanner() { }
        showBanner() { }
        openVibrateShort() {
        }
        openVibrateLong() {
        }
        openVibrate() {
        }
        sendDesktop(func) {
        }
        showInstertView() {
        }
        hasShortcutInstalled(callBack) {
        }
        getIsDesktop() {
            return false;
        }
        openAdvert(type) {
        }
        playMusic(url, loop = 0) {
            if (url == "")
                return console.log("playMusic   背景音乐播放失败  = " + url);
            Laya.SoundManager.playMusic(url, loop);
        }
        stopMusic() {
            Laya.SoundManager.stopMusic();
        }
        playSound(url, v = 1) {
            Laya.SoundManager.playSound(url, v);
        }
        openGame(name) {
            console.log(name);
        }
        checkIsMiGame(callback) {
            callback(2);
        }
        getHeight() {
            return Laya.Browser.height;
        }
        exitGame() {
        }
        videoPlay(game, type) {
        }
        onShare(game, type) {
        }
        gameBtn() {
        }
        btnDestroy() {
        }
        gameBtns() {
        }
        btnDestroys() {
        }
        showShare(game, Gate_number) {
        }
        isIos() {
            return false;
        }
        isFat() {
        }
        hideBannder() {
        }
        showBannder() {
        }
    }

    class JsbAndroid extends JsbBase {
        constructor() {
            super();
            this.bridge = null;
            this.bridgeJsb = null;
            this.bridge = PlatformClass.createClass("jsb.JsbAndroid");
        }
        openAdvert(type) {
            switch (type) {
                case 8: {
                    this.openSplashAd();
                    break;
                }
                case 5: {
                    this.openRewardVideo();
                    break;
                }
                case 3: {
                    this.showInstertView();
                    break;
                }
            }
        }
        openSplashAd() {
            this.bridge.call("openSplashActivity");
        }
        getIsCachedVideo() {
            return this.bridge.call("getIsCachedVideo");
        }
        openRewardVideo() {
            this.bridge.call("openRewardVideo");
        }
        getIsInstertView() {
            return true;
        }
        showInstertView() {
            this.bridge.call("showInterstital");
        }
        openVibrateLong() {
            this.bridge.call("openVibrate", 200);
        }
        exitGame() {
            this.bridge.call("exitGame");
        }
    }

    var Vector3 = Laya.Vector3;
    var Event = Laya.Event;
    class PubUtils {
        static getAllCollisonSprite3D(node) {
            let list = [];
            for (let i = 0; i < node.numChildren; i++) {
                let child = node.getChildAt(i);
                if (child) {
                    if (child.numChildren == 0) {
                        list.push(child);
                    }
                    else {
                        let body = child.getComponent(Laya.Rigidbody3D);
                        if (body) {
                            list.push(child);
                        }
                        list = list.concat(this.getAllCollisonSprite3D(child));
                    }
                }
            }
            return list;
        }
        static Vec2Sub(v1, v2) {
            let v = new Laya.Vector2();
            v.x = v1.x - v2.x;
            v.y = v1.y - v2.y;
            return v;
        }
        static Vec3Sub(v1, v2) {
            let v = new Laya.Vector3();
            v.x = v1.x - v2.x;
            v.y = v1.y - v2.y;
            v.z = v1.z - v2.z;
            return v;
        }
        static copyVec3ToNew(v) {
            let p = new Vector3();
            p.x = v.x, p.y = v.y;
            p.z = v.z;
            return p;
        }
        static getVec3Dis(pos1, pos2) {
            return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.z - pos2.z, 2));
        }
        static vector3ToAngle(pos1, pos2) {
            let disV = new Laya.Vector3();
            Laya.Vector3.subtract(pos1, pos2, disV);
            let atan2 = Math.atan2(disV.z, disV.x);
            let angle = atan2 / Math.PI * 180;
            if (angle <= 0) {
                angle += 360;
            }
            return angle;
        }
        static pointsTurnVector3(spos, epos) {
            let disV = new Laya.Vector3();
            Laya.Vector3.subtract(spos, epos, disV);
            Laya.Vector3.normalize(disV, disV);
            return disV;
        }
        static GetLocalData(key) {
            try {
                if (PlatformManager.platform == PlatformType.VivoMinGame) {
                    return qg.getStorageSync({ key: key });
                }
                else {
                    return Laya.LocalStorage.getItem(key);
                }
            }
            catch (e) {
                return null;
            }
        }
        static SetLocalData(key, data) {
            if (PlatformManager.platform == PlatformType.VivoMinGame) {
                qg.setStorageSync({ "key": key, "value": data });
            }
            else {
                Laya.LocalStorage.setItem(key, data);
            }
        }
        static registerScaleListener(node, caller, clickFunc, scale, isSwallow = false) {
            let isTouch = false;
            this.registerTouchListenner(node, caller, () => {
                node.scale(scale, scale);
                isTouch = true;
            }, () => {
            }, (event) => {
                node.scale(1, 1);
                if (isTouch) {
                    clickFunc.call(caller, event);
                }
            }, () => {
                isTouch = false;
                node.scale(1, 1);
            }, isSwallow);
        }
        static registerTouchListenner(node, caller, startFunc = null, moveFunc = null, endFunc = null, outFunc = null, isSwallow = false) {
            if (typeof startFunc === "function") {
                node.on(Event.MOUSE_DOWN, this, (event) => {
                    if (isSwallow) {
                        event.stopPropagation();
                    }
                    startFunc.call(caller, event);
                });
            }
            if (typeof moveFunc === "function") {
                node.on(Event.MOUSE_MOVE, this, (event) => {
                    if (isSwallow) {
                        event.stopPropagation();
                    }
                    moveFunc.call(caller, event);
                });
            }
            if (typeof endFunc === "function") {
                node.on(Event.MOUSE_UP, this, (event) => {
                    if (isSwallow) {
                        event.stopPropagation();
                    }
                    endFunc.call(caller, event);
                });
            }
            if (typeof outFunc === "function") {
                node.on(Event.MOUSE_OUT, this, (event) => {
                    if (isSwallow) {
                        event.stopPropagation();
                    }
                    outFunc.call(caller, event);
                });
            }
        }
        static clearTouchListenner(node) {
            node.offAll(Laya.Event.MOUSE_DOWN);
            node.offAll(Laya.Event.MOUSE_MOVE);
            node.offAll(Laya.Event.MOUSE_UP);
            node.offAll(Laya.Event.MOUSE_OUT);
        }
        static getDelta() {
            if (Laya.timer.delta >= 200)
                return 0;
            return Laya.timer.delta / 1000;
        }
        static checkRayAllCollison(scene, shape, from_pos, to_pos, frome_type, to_type) {
            let hits = [];
            scene.physicsSimulation.shapeCastAll(shape, from_pos, to_pos, hits, new Laya.Quaternion(), new Laya.Quaternion(), frome_type, to_type);
            return hits;
        }
        static eularToQuaternion(xx, yy, zz) {
            let X = xx / 180 * Math.PI;
            let Y = yy / 180 * Math.PI;
            let Z = zz / 180 * Math.PI;
            let x = Math.cos(Y / 2) * Math.sin(X / 2) * Math.cos(Z / 2) + Math.sin(Y / 2) * Math.cos(X / 2) * Math.sin(Z / 2);
            let y = Math.sin(Y / 2) * Math.cos(X / 2) * Math.cos(Z / 2) - Math.cos(Y / 2) * Math.sin(X / 2) * Math.sin(Z / 2);
            let z = Math.cos(Y / 2) * Math.cos(X / 2) * Math.sin(Z / 2) - Math.sin(Y / 2) * Math.sin(X / 2) * Math.cos(Z / 2);
            let w = Math.cos(Y / 2) * Math.cos(X / 2) * Math.cos(Z / 2) + Math.sin(Y / 2) * Math.sin(X / 2) * Math.sin(Z / 2);
            let quataion = new Laya.Quaternion(x, y, z, w);
            return quataion;
        }
        static quaternioneToEular(q) {
            let xx = Math.asin(2 * (q.w * q.y - q.z * q.z)) * 57.3;
            let yy = Math.atan2(2 * (q.x * q.w + q.y * q.z), 1 - 2 * (q.x * q.x + q.y * q.y)) * 57.3;
            let zz = Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.z * q.z + q.y * q.y)) * 57.3;
            return new Laya.Vector3(xx, yy, zz);
        }
        static vector3Add(v1, v2) {
            let v = new Laya.Vector3();
            v.x = v1.x + v2.x;
            v.y = v1.y + v2.y;
            v.z = v1.z + v2.z;
            return v;
        }
        static vector3Sub(v1, v2) {
            let v = new Laya.Vector3();
            Laya.Vector3.subtract(v1, v2, v);
            return v;
        }
        static MoveTowards(current, target, maxDistanceDelta) {
            let toVector_x = target.x - current.x;
            let toVector_y = target.y - current.y;
            let toVector_z = target.z - current.z;
            let sqdist = toVector_x * toVector_x + toVector_y * toVector_y + toVector_z * toVector_z;
            if (sqdist == 0 || sqdist <= maxDistanceDelta * maxDistanceDelta)
                return target;
            let dist = Math.sqrt(sqdist);
            return new Vector3(current.x + toVector_x / dist * maxDistanceDelta, current.y + toVector_y / dist * maxDistanceDelta, current.z + toVector_z / dist * maxDistanceDelta);
        }
        static RotateTowards(from, to, maxDegreesDelta) {
            let angle = this.Angle(from, to);
            if (angle == 0.0)
                return to;
            let q = new Laya.Quaternion();
            Laya.Quaternion.slerp(from, to, Math.min(1.0, maxDegreesDelta / angle), q);
            return q;
        }
        static Angle(a, b) {
            let dot = this.Dot(a, b);
            return this.IsEqualUsingDot(dot) ? 0.0 : Math.acos(Math.min(Math.abs(dot), 1.0)) * 2.0 * this.Rad2Deg;
        }
        static IsEqualUsingDot(dot) {
            return dot > 1.0 - this.kEpsilon;
        }
        static get Rad2Deg() {
            return 1 / Math.PI * 2 / 360;
        }
        static Dot(a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
        }
        static generateUUID() {
            let d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now();
            }
            let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            console.log(uuid);
            return uuid;
        }
        static GetNetJson(url, complete, err = null) {
            let xh = new Laya.HttpRequest();
            xh.once(Laya.Event.COMPLETE, this, complete);
            if (err) {
                xh.once(Laya.Event.ERROR, this, err);
            }
            xh.send(url, "", "get", "json", ["Cache-Control", "no-cache"]);
        }
        static DataDocking(url, param) {
            let xh = new Laya.HttpRequest();
            xh.http.open("POST", url);
            xh.http.setRequestHeader("Content-Type", "application/json");
            xh.http.send(param);
        }
    }
    PubUtils.kEpsilon = 0.000001;

    class JsbOppoMiniGame extends JsbBase {
        constructor() {
            super(...arguments);
            this.AppId = "30219614";
            this.OpenScreenId = "138492";
            this.BannerId = "138485";
            this.RewardedVideoId = "138489";
            this.InsertId = "138487";
            this.isCachedVideo = false;
            this.insertAd = null;
            this.isCachedInsert = false;
            this.isShowIntertView = true;
            this.BannerErrCount = 0;
            this.VoideErrCount = 0;
            this.InsertErrCount = 0;
            this.ErrZCount = 3;
            this.is_auto_close_banner = true;
            this.insertCnt = 8;
            this.bannerCnt = 5;
            this.insertCd = false;
        }
        openAdvert(type) {
            switch (type) {
                case 8: {
                    console.log("初始化");
                    this.openSplashAd();
                    break;
                }
                case 5: {
                    this.showRewardVideo();
                    break;
                }
                case 3: {
                    this.showInstertView();
                    break;
                }
            }
        }
        openSplashAd() {
            this.initFlag();
            this.initOppoAd();
        }
        initFlag() {
            let day = new Date().getDate();
            let localday = PubUtils.GetLocalData("curDay");
            if (localday == null || localday == "" || day != localday) {
                console.log("初始化广告次数参数");
                PubUtils.SetLocalData("curDay", day);
                PubUtils.SetLocalData("instertCount", this.insertCnt);
                PubUtils.SetLocalData("bannerCount", this.bannerCnt);
            }
        }
        openRewardVideo() {
            this.showRewardVideo();
        }
        getIntertCount() {
            let c = PubUtils.GetLocalData("instertCount");
            return +c || 0;
        }
        subInstertCount() {
            let c = this.getIntertCount();
            if (c == 0)
                return;
            c--;
            PubUtils.SetLocalData("instertCount", c);
        }
        initOppoAd() {
            let self = this;
            qg.initAdService({
                appId: this.AppId,
                isDebug: false,
                success: (res) => {
                    Laya.timer.once(10 * 1000, self, () => {
                        self.openBannerView();
                    });
                    this.loadRewardVide();
                    self.loadInsert();
                },
                fail: (res) => {
                },
                complete: (res) => {
                }
            });
        }
        openBannerView() {
            this.clearBanner();
            if (this.BannerErrCount >= this.ErrZCount)
                return console.log("加载超时-----banner");
            let self = this;
            if (this.bannerAd == null) {
                let bannerAd = qg.createBannerAd({ posId: this.BannerId });
                bannerAd.onShow(() => {
                    console.log('banner 广告显示');
                    this.BannerErrCount = 0;
                });
                bannerAd.onHide(() => {
                    console.log("是否是用户自己关闭baner", this.is_auto_close_banner);
                    if (this.is_auto_close_banner) {
                        this.subBannerCount();
                    }
                    this.is_auto_close_banner = true;
                });
                bannerAd.onError(function (err) {
                    console.log("banner 打开失败   " + JSON.stringify(err));
                    self.BannerErrCount++;
                    bannerAd.offError(null);
                });
                this.bannerAd = bannerAd;
                this.showBanner();
            }
        }
        clearBanner() {
            if (this.bannerAd) {
                this.bannerAd.offError(() => {
                });
                this.bannerAd.offHide(() => {
                });
                this.bannerAd.offShow(() => {
                });
                this.bannerAd = null;
            }
        }
        hideBanner() {
            console.log("隐藏banner广告");
            this.is_auto_close_banner = false;
            Laya.timer.once(1000, this, () => {
                this.is_auto_close_banner = true;
            });
            this.bannerAd.hide();
        }
        showBanner() {
            let count = this.getBannerCount();
            if (count == 0) {
                console.log("banner达到玩家关闭上限");
                return;
            }
            this.bannerAd && this.bannerAd.show();
        }
        subBannerCount() {
            let c = this.getBannerCount();
            if (c == 0)
                return;
            c--;
            PubUtils.SetLocalData("bannerCount", c);
        }
        getBannerCount() {
            let c = PubUtils.GetLocalData("bannerCount");
            console.log("banner剩余次数", c + ",", +c);
            return +c || 0;
        }
        loadRewardVide() {
            if (this.VoideErrCount >= this.ErrZCount)
                return console.log("加载超时-----video");
            this.clearRewardVideo();
            if (this.videoAd == null) {
                let videoAd = qg.createRewardedVideoAd({ posId: this.RewardedVideoId });
                videoAd.load();
                videoAd.onLoad(() => {
                    console.log('激励视频加载成功');
                    this.isCachedVideo = true;
                    this.VoideErrCount = 0;
                });
                let self = this;
                videoAd.onError((err) => {
                    console.log("激励视频打开失败" + JSON.stringify(err));
                    AndroidToJs.CallJs("Advertisement", 5 + "," + 0);
                    this.clearRewardVideo();
                    this.VoideErrCount++;
                    Laya.timer.once(1000 * 60, self, () => {
                        this.loadRewardVide();
                    });
                });
                videoAd.onVideoStart(() => {
                    console.log('激励视频 开始播放');
                });
                videoAd.onClose((res) => {
                    if (res.isEnded) {
                        console.log('激励视频广告完成，发放奖励');
                        AndroidToJs.CallJs("Advertisement", 5 + ",1");
                    }
                    else {
                        console.log('激励视频广告取消关闭，不发放奖励');
                        AndroidToJs.CallJs("Advertisement", 5 + ",0");
                    }
                    this.clearRewardVideo();
                    setTimeout(() => {
                        this.loadRewardVide();
                    }, 200);
                });
                this.videoAd = videoAd;
            }
        }
        showRewardVideo() {
            if (this.videoAd && this.isCachedVideo) {
                this.isCachedVideo = false;
                this.videoAd.show();
            }
        }
        clearRewardVideo() {
            if (this.videoAd) {
                this.videoAd.offError(() => { });
                this.videoAd.offLoad(() => { });
                this.videoAd.offRewarded(() => { });
                this.videoAd.offVideoStart(() => { });
                this.videoAd.destroy();
                this.videoAd = null;
            }
        }
        getIsCachedVideo() {
            return this.isCachedVideo;
        }
        loadInsert() {
        }
        isInsertCd() {
            let bol = this.insertCd;
            if (!this.insertCd) {
                this.insertCd = true;
                Laya.timer.once(60 * 1000, this, () => {
                    this.insertCd = false;
                });
            }
            return bol;
        }
        showInstertView() {
            if (this.InsertErrCount >= this.ErrZCount)
                return console.log("加载超时-----loadInsert");
            let count = this.getIntertCount();
            if (count == 0) {
                console.log("插屏广告达到当日上限");
                return;
            }
            if (this.isInsertCd()) {
                console.log("插屏广告冷却中");
                return;
            }
            if (this.insertAd == null) {
                console.log("showInstarview 加载插屏");
                let self = this;
                let insertAd = qg.createInsertAd({
                    posId: this.InsertId
                });
                this.insertAd = insertAd;
                insertAd.load();
                insertAd.onLoad(() => {
                    console.log('插屏广告加载');
                    self.isCachedInsert = true;
                    self.InsertErrCount = 0;
                    insertAd.show();
                });
                insertAd.onShow(() => {
                    console.log('插屏广告展示');
                    self.InsertErrCount = 0;
                    this.subInstertCount();
                    self.clearInsert();
                });
                insertAd.onError((err) => {
                    self.InsertErrCount++;
                    console.log("插屏打开失败" + JSON.stringify(err));
                    Laya.timer.once(1000 * 60, self, () => {
                        self.clearInsert();
                    });
                });
            }
            else {
                console.log("showInstertView ---------- 清理上次的对象");
                this.insertAd.destroy();
                this.insertAd = null;
            }
        }
        clearInsert() {
            if (this.insertAd) {
                this.insertAd.offError();
                this.insertAd.offLoad();
                this.insertAd.offShow();
                this.insertAd = null;
            }
            this.isCachedInsert = false;
        }
        openVibrate() {
            qg.vibrateShort({
                success: () => {
                    console.log("openVibrate   success");
                },
                fail: () => {
                    console.log("openVibrate   fail");
                },
                complete: () => {
                    console.log("openVibrate   complete");
                }
            });
        }
        openVibrateShort() {
            qg.vibrateShort({
                success: () => {
                    console.log("openVibrateShort   success");
                },
                fail: () => {
                    console.log("openVibrateShort   fail");
                },
                complete: () => {
                    console.log("openVibrateShort   complete");
                }
            });
        }
        openVibrateLong() {
            qg.vibrateLong({
                success: (res) => {
                    console.log("openVibrateLong   success");
                    console.log(JSON.stringify(res));
                },
                fail: (res) => {
                    console.log("openVibrateLong   fail");
                    console.log(JSON.stringify(res));
                },
                complete: (res) => {
                    console.log("openVibrateLong   complete");
                    console.log(JSON.stringify(res));
                }
            });
        }
        playMusic(url, loop = 0) {
            if (this.audio == null) {
                var audio = qg.createInnerAudioContext();
                audio.loop = loop == 0;
                audio.volume = 1;
                audio.autoplay = false;
                var playSound = function () {
                    audio.play();
                    audio.offCanplay(playSound);
                };
                audio.onCanplay(playSound);
                audio.src = url;
                this.audio = audio;
            }
            else {
                this.audio.play();
            }
        }
        stopMusic() {
            if (this.audio) {
                this.audio.pause();
            }
        }
        playSound(url, v = 1) {
            var audio = qg.createInnerAudioContext();
            audio.loop = false;
            audio.volume = 0.7;
            audio.autoplay = false;
            var playSound = function () {
                audio.play();
                audio.offCanplay(playSound);
            };
            audio.onCanplay(playSound);
            audio.src = url;
        }
        checkIsMiGame(callback) {
            qg.getSystemInfo({
                success: (res) => {
                    if (res.platformVersion >= 1044) {
                        callback(1);
                    }
                    else {
                        callback(2);
                    }
                },
                fail: () => {
                },
                complete: () => {
                }
            });
        }
        openGame(name) {
            qg.navigateToMiniGame({
                pkgName: name
            });
        }
        sendDesktop(func) {
            console.log("-sendDesktop-------------------");
            qg.installShortcut({
                success: function (res) {
                    console.log("sendDesktop   success");
                    console.log(JSON.stringify(res));
                    func(1);
                },
                fail: function (err) {
                    console.log("sendDesktop   err");
                    console.log(JSON.stringify(err));
                    func(0);
                },
                complete: function (res) {
                    console.log("sendDesktop   complete");
                    console.log(JSON.stringify(res));
                }
            });
        }
        getIsDesktop() {
            return true;
        }
        hasShortcutInstalled(callback) {
            qg.getSystemInfo({
                success: (res) => {
                    if (res.platformVersion >= 1044) {
                        qg.hasShortcutInstalled({
                            success: (res) => {
                                callback(res);
                            },
                            fail: () => {
                            },
                            complete: () => {
                            }
                        });
                    }
                    else {
                        callback(0);
                    }
                },
                fail: () => { },
                complete: () => { }
            });
        }
    }

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class LoadViewUI extends Laya.Scene {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(LoadViewUI.uiView);
            }
        }
        LoadViewUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1630 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 815, "x": 375, "width": 750, "height": 1630, "bgColor": "#ffffff", "anchorY": 0.5, "anchorX": 0.5, "alpha": 1 }, "compId": 4 }, { "type": "Label", "props": { "y": 754, "x": 375, "var": "loadLabel", "text": "资源加载中,请稍后！", "fontSize": 28, "color": "#000000", "bold": false, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "Image", "props": { "y": 667, "x": 375, "skin": "load/img_1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 10 }], "animations": [{ "nodes": [{ "target": 10, "keyframes": { "skin": [{ "value": "load/img_1.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 0 }, { "value": "load/img_2.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 2 }, { "value": "load/img_3.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 4 }, { "value": "load/img_4.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 6 }, { "value": "load/img_5.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 8 }, { "value": "load/img_6.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 10 }, { "value": "load/img_7.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 12 }, { "value": "load/img_8.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 14 }, { "value": "load/img_9.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 16 }, { "value": "load/img_10.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 18 }, { "value": "load/img_11.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 20 }, { "value": "load/img_12.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 22 }, { "value": "load/img_13.png", "tweenMethod": "linearNone", "tween": false, "target": 10, "key": "skin", "index": 24 }] } }], "name": "load", "id": 2, "frameRate": 20, "action": 2 }], "loadList": ["load/img_1.png", "load/img_2.png", "load/img_3.png", "load/img_4.png", "load/img_5.png", "load/img_6.png", "load/img_7.png", "load/img_8.png", "load/img_9.png", "load/img_10.png", "load/img_11.png", "load/img_12.png", "load/img_13.png"], "loadList3D": [] };
        ui.LoadViewUI = LoadViewUI;
        REG("ui.LoadViewUI", LoadViewUI);
        class MainSceneUI extends Laya.Scene {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(MainSceneUI.uiView);
            }
        }
        MainSceneUI.uiView = { "type": "Scene", "props": { "width": 750, "positionVariance_0": 100, "maxPartices": 100, "height": 1630 }, "compId": 1, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "var": "box_mouse", "height": 1630 }, "compId": 21 }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "var": "box_main", "height": 1630 }, "compId": 112, "child": [{ "type": "Image", "props": { "y": 228, "x": 96, "skin": "img/logo.png" }, "compId": 164 }, { "type": "Image", "props": { "y": 750, "x": 220, "var": "btn_doubleStart", "skin": "img/zj-anniu.png" }, "compId": 156 }, { "type": "Image", "props": { "y": 900, "x": 220, "var": "btn_start", "skin": "img/zj-anniu1.png" }, "compId": 157, "child": [{ "type": "Image", "props": { "y": 42, "x": 72, "skin": "img/zj-anniu2.png" }, "compId": 186 }] }, { "type": "Image", "props": { "y": 536, "x": 3, "skin": "img/zj-di.png" }, "compId": 162, "child": [{ "type": "Image", "props": { "y": 11, "x": 15, "var": "img_signin", "skin": "img/zj-qd.png" }, "compId": 160 }] }, { "type": "Image", "props": { "y": 661, "x": 3, "skin": "img/zj-di.png" }, "compId": 163, "child": [{ "type": "Image", "props": { "y": 4, "x": 18, "var": "img_skin", "skin": "img/zj-pf.png" }, "compId": 161 }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "var": "box_win", "height": 1630 }, "compId": 128, "child": [{ "type": "Image", "props": { "y": 269, "x": 111, "skin": "img/sl-sl.png" }, "compId": 170 }, { "type": "Image", "props": { "y": 420, "x": 192, "skin": "img/sl-jl1.png" }, "compId": 167, "child": [{ "type": "Image", "props": { "y": 48, "x": 50, "skin": "img/sl-jl2.png" }, "compId": 168 }, { "type": "Image", "props": { "y": 280, "x": 122, "skin": "img/start-z.png" }, "compId": 169 }, { "type": "Label", "props": { "y": 276.5, "x": 184, "width": 129, "var": "label_getdmd", "valign": "middle", "text": "20", "height": 50, "fontSize": 50, "font": "SimHei", "color": "#ffffff", "bold": true, "align": "left" }, "compId": 173 }] }, { "type": "Image", "props": { "y": 820, "x": 220, "var": "btn_wubeilingqu", "skin": "img/sl-lq.png" }, "compId": 165 }, { "type": "Image", "props": { "y": 980, "x": 220, "var": "btn_zhijielingqu", "skin": "img/zj-anniu1.png" }, "compId": 166, "child": [{ "type": "Image", "props": { "y": 46, "x": 83, "skin": "img/zjlq.png" }, "compId": 185 }] }] }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "var": "box_lose", "height": 1630 }, "compId": 129, "child": [{ "type": "Image", "props": { "y": 284, "x": 110.5, "skin": "img/sb-sb.png" }, "compId": 174 }, { "type": "Image", "props": { "y": 420, "x": 210, "skin": "img/sb-djs.png" }, "compId": 175 }, { "type": "Image", "props": { "y": 820, "x": 220.5, "var": "btn_jixuyouxi", "skin": "img/sb-jx.png" }, "compId": 176 }, { "type": "Image", "props": { "y": 980, "x": 220, "var": "btn_fanhui", "skin": "img/zj-anniu1.png" }, "compId": 177, "child": [{ "type": "Image", "props": { "y": 47, "x": 120, "skin": "img/sl-fh.png" }, "compId": 184 }] }, { "type": "FontClip", "props": { "y": 590, "x": 375, "var": "font_failCnt", "value": "10", "skin": "img/1234567890.png", "sheet": "1234567890", "scaleY": 3.2, "scaleX": 3.2, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 183 }] }, { "type": "Image", "props": { "y": 135, "x": 535, "width": 211, "var": "img_dmd", "skin": "img/start-zdi.png", "sizeGrid": "0,30,0,29", "height": 59 }, "compId": 121, "child": [{ "type": "Image", "props": { "y": 5, "x": 13, "skin": "img/start-z.png" }, "compId": 122 }, { "type": "Label", "props": { "y": 12, "x": 75, "width": 127, "var": "label_dmd", "valign": "middle", "text": "0", "height": 36, "fontSize": 36, "font": "SimHei", "color": "#ffffff", "bold": true, "align": "center" }, "compId": 125 }] }, { "type": "Box", "props": { "y": 138.5, "x": 25, "var": "box_set" }, "compId": 179, "child": [{ "type": "Image", "props": { "skin": "img/zj-shezhi.png" }, "compId": 178 }] }, { "type": "Box", "props": { "y": 90, "x": 235, "var": "box_lvl" }, "compId": 152, "child": [{ "type": "ProgressBar", "props": { "var": "prg_pro", "skin": "img/start-jdt.png", "sizeGrid": "20,0,20,0,1" }, "compId": 180 }, { "type": "Label", "props": { "y": 8, "x": 0, "width": 55, "var": "label_p1", "valign": "middle", "text": "0", "height": 36, "fontSize": 36, "font": "SimHei", "color": "#ffffff", "bold": true, "align": "center" }, "compId": 181 }, { "type": "Label", "props": { "y": 8, "x": 220, "width": 55, "var": "label_p2", "valign": "middle", "text": "0", "height": 36, "fontSize": 36, "font": "SimHei", "color": "#ffffff", "bold": true, "align": "center" }, "compId": 182 }] }, { "type": "Image", "props": { "y": 400, "x": 0, "visible": false, "var": "btn_camera", "skin": "img/img_camera.png" }, "compId": 187 }, { "type": "Image", "props": { "x": 48, "visible": false, "var": "bg_push", "top": 1300, "skin": "push/push_bg_img.png", "scaleY": 1.4, "scaleX": 1.4 }, "compId": 188 }, { "type": "Sprite", "props": { "y": 130, "x": 104, "width": 542, "visible": false, "var": "shareBox" }, "compId": 189, "child": [{ "type": "Image", "props": { "y": 297, "width": 542, "skin": "push/img_bg_1.png", "sizeGrid": "20,20,20,20", "height": 686 }, "compId": 190, "child": [{ "type": "Label", "props": { "y": 603, "x": 211, "var": "again", "underline": true, "text": "再来一次", "fontSize": 30, "color": "#fff", "bold": true }, "compId": 191 }, { "type": "Image", "props": { "y": 463, "x": 147, "var": "btn_share", "skin": "push/img_share.png" }, "compId": 192 }, { "type": "Label", "props": { "y": 223, "x": 40, "text": "将本次精彩操作分享给朋友吧!", "fontSize": 34, "color": "#fff", "bold": true }, "compId": 197 }, { "type": "Label", "props": { "y": 33, "x": 169, "text": "提示", "fontSize": 100, "color": "#ffd40b", "bold": true }, "compId": 198 }] }] }], "loadList": ["img/logo.png", "img/zj-anniu.png", "img/zj-anniu1.png", "img/zj-anniu2.png", "img/zj-di.png", "img/zj-qd.png", "img/zj-pf.png", "img/sl-sl.png", "img/sl-jl1.png", "img/sl-jl2.png", "img/start-z.png", "img/sl-lq.png", "img/zjlq.png", "img/sb-sb.png", "img/sb-djs.png", "img/sb-jx.png", "img/sl-fh.png", "img/1234567890.png", "img/start-zdi.png", "img/zj-shezhi.png", "img/start-jdt.png", "img/img_camera.png", "push/push_bg_img.png", "push/img_bg_1.png", "push/img_share.png"], "loadList3D": [] };
        ui.MainSceneUI = MainSceneUI;
        REG("ui.MainSceneUI", MainSceneUI);
        class RecommendDlgUI extends Laya.Dialog {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(RecommendDlgUI.uiView);
            }
        }
        RecommendDlgUI.uiView = { "type": "Dialog", "props": { "width": 750, "height": 1630 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 439, "x": 65, "var": "btn_other_mi_game", "skin": "xyx/img_friend.png", "hitTestPrior": true, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 11, "child": [{ "type": "Image", "props": { "y": -2, "x": 72, "skin": "xyx/img_red.png" }, "compId": 12 }] }, { "type": "Box", "props": { "y": -10, "x": 0, "width": 750, "var": "box_clickAera", "height": 1630 }, "compId": 13, "child": [{ "type": "Image", "props": { "y": 390, "x": 0, "width": 467, "var": "icon_panel", "skin": "xyx/img_bg.png", "height": 120 }, "compId": 5, "child": [{ "type": "Image", "props": { "y": 60, "x": 63, "width": 80, "name": "icon0", "height": 101, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Image", "props": { "y": 60, "x": 161, "width": 80, "name": "icon1", "height": 101, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Image", "props": { "y": 61, "x": 259, "width": 80, "name": "icon2", "height": 101, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }, { "type": "Image", "props": { "y": 61, "x": 357, "width": 80, "name": "icon3", "height": 101, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "Image", "props": { "y": -11, "x": 434, "skin": "xyx/img_red.png" }, "compId": 10 }] }] }, { "type": "Image", "props": { "y": 439, "x": 646, "width": 104, "var": "btn_migame", "skin": "xyx/img_icon_bg.png", "rotation": 14, "height": 132, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 14, "child": [{ "type": "Image", "props": { "y": 15.5, "x": 12, "var": "img_icon", "skin": "xyx/img_icon_wkds.png" }, "compId": 15 }] }], "loadList": ["xyx/img_friend.png", "xyx/img_red.png", "xyx/img_bg.png", "xyx/img_icon_bg.png", "xyx/img_icon_wkds.png"], "loadList3D": [] };
        ui.RecommendDlgUI = RecommendDlgUI;
        REG("ui.RecommendDlgUI", RecommendDlgUI);
        class SetDlgUI extends Laya.Dialog {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(SetDlgUI.uiView);
            }
        }
        SetDlgUI.uiView = { "type": "Dialog", "props": { "width": 750, "height": 1630 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 750, "skin": "img/img_black.png", "height": 1630, "alpha": 0.7 }, "compId": 24 }, { "type": "Image", "props": { "y": 667, "x": 375, "width": 565, "skin": "img/sz-di.png", "sizeGrid": "156,180,185,158", "height": 751, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 15 }, { "type": "Image", "props": { "y": 529, "x": 202, "var": "icon_sound", "skin": "img/sz-yl1.png" }, "compId": 16 }, { "type": "Image", "props": { "y": 640.5, "x": 202, "var": "icon_music", "skin": "img/sz-ty1.png" }, "compId": 17 }, { "type": "Image", "props": { "y": 755, "x": 197, "var": "icon_shake", "skin": "img/sz-zd1.png" }, "compId": 18 }, { "type": "Image", "props": { "y": 529, "x": 330, "var": "img_sound", "skin": "img/sz-kai.png" }, "compId": 19 }, { "type": "Image", "props": { "y": 320, "x": 570, "var": "img_back", "skin": "img/sz-x.png" }, "compId": 20 }, { "type": "Image", "props": { "y": 320, "x": 311, "skin": "img/sz-sz.png" }, "compId": 21 }, { "type": "Image", "props": { "y": 640.5, "x": 330, "var": "img_music", "skin": "img/sz-kai.png" }, "compId": 22 }, { "type": "Image", "props": { "y": 763, "x": 330, "var": "img_shake", "skin": "img/sz-kai.png" }, "compId": 23 }], "loadList": ["img/img_black.png", "img/sz-di.png", "img/sz-yl1.png", "img/sz-ty1.png", "img/sz-zd1.png", "img/sz-kai.png", "img/sz-x.png", "img/sz-sz.png"], "loadList3D": [] };
        ui.SetDlgUI = SetDlgUI;
        REG("ui.SetDlgUI", SetDlgUI);
        class SigninDlgUI extends Laya.Dialog {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(SigninDlgUI.uiView);
            }
        }
        SigninDlgUI.uiView = { "type": "Dialog", "props": { "width": 750, "height": 1630 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 750, "skin": "img/img_black.png", "height": 1630, "alpha": 0.7 }, "compId": 23 }, { "type": "Image", "props": { "y": 580, "x": 375, "width": 612, "skin": "img/sz-di.png", "sizeGrid": "126,153,175,148", "height": 897, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 160, "x": 258, "skin": "skin/qd-qd.png" }, "compId": 5 }, { "type": "Image", "props": { "y": 240, "x": 127, "skin": "skin/qd-d1.png" }, "compId": 6, "child": [{ "type": "Label", "props": { "y": 24.5, "x": 27, "width": 314, "valign": "middle", "text": "第二、七天登陆送", "strokeColor": "#312a2a", "stroke": 5, "height": 35, "fontSize": 35, "font": "SimHei", "color": "#ffffff", "bold": true, "align": "center" }, "compId": 16 }, { "type": "Image", "props": { "y": 70, "x": 106, "skin": "skin/qd-d3.png" }, "compId": 8 }] }, { "type": "Image", "props": { "y": 160, "x": 600, "var": "img_back", "skin": "img/sz-x.png" }, "compId": 7 }, { "type": "Button", "props": { "y": 1053, "x": 247, "var": "label_double", "stateNum": 1, "skin": "skin/qd-sl.png", "labelFont": "SimHei" }, "compId": 9 }, { "type": "Image", "props": { "y": 1182, "x": 247, "width": 255, "var": "label_recieve", "skin": "img/zj-anniu1.png", "sizeGrid": "0,0,0,0", "height": 108 }, "compId": 10, "child": [{ "type": "Image", "props": { "y": 36, "x": 56, "skin": "img/zjlq.png" }, "compId": 24 }] }, { "type": "List", "props": { "y": 680, "x": 375, "width": 497, "var": "list_signin", "spaceY": 10, "spaceX": 10, "repeatY": 3, "repeatX": 3, "height": 590, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 18, "child": [{ "type": "Box", "props": { "y": 95, "x": 79, "width": 159, "renderType": "render", "height": 190, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 17, "child": [{ "type": "Image", "props": { "y": 95, "width": 159, "skin": "skin/qd-7tiandi.png", "sizeGrid": "77,60,50,53", "name": "img_bg1", "height": 190, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 11 }, { "type": "Image", "props": { "y": 95, "skin": "img/start-z.png", "name": "img_icon", "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 13 }, { "type": "Label", "props": { "y": 11, "width": 100, "valign": "middle", "text": "第一天", "strokeColor": "#736565", "stroke": 5, "name": "label_day", "height": 22, "fontSize": 22, "font": "SimHei", "color": "#ffffff", "centerX": 0, "bold": true, "align": "center" }, "compId": 14 }, { "type": "Label", "props": { "y": 157, "width": 200, "valign": "middle", "text": "钻石X990+限定皮肤", "strokeColor": "#736565", "stroke": 4, "name": "label_text", "height": 18, "fontSize": 18, "font": "SimHei", "color": "#ffffff", "centerX": 0, "bold": true, "align": "center" }, "compId": 15 }, { "type": "Image", "props": { "y": 56, "skin": "skin/qd-dui.png", "name": "img_gou", "centerX": 0 }, "compId": 20 }] }] }], "loadList": ["img/img_black.png", "img/sz-di.png", "skin/qd-qd.png", "skin/qd-d1.png", "skin/qd-d3.png", "img/sz-x.png", "skin/qd-sl.png", "img/zj-anniu1.png", "img/zjlq.png", "skin/qd-7tiandi.png", "img/start-z.png", "skin/qd-dui.png"], "loadList3D": [] };
        ui.SigninDlgUI = SigninDlgUI;
        REG("ui.SigninDlgUI", SigninDlgUI);
        class SkinDlgUI extends Laya.Dialog {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(SkinDlgUI.uiView);
            }
        }
        SkinDlgUI.uiView = { "type": "Dialog", "props": { "width": 750, "height": 1630 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 750, "skin": "img/img_black.png", "height": 1630, "alpha": 0.7 }, "compId": 23 }, { "type": "Image", "props": { "y": 580, "x": 375, "width": 612, "skin": "img/sz-di.png", "sizeGrid": "126,153,175,148", "height": 897, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 22 }, { "type": "Image", "props": { "y": 160, "x": 600, "var": "img_back", "skin": "img/sz-x.png" }, "compId": 6 }, { "type": "Image", "props": { "y": 160, "x": 311, "skin": "skin/pf-pf.png" }, "compId": 15 }, { "type": "List", "props": { "y": 273, "x": 149, "width": 452, "var": "list_skin", "spaceY": 40, "spaceX": 40, "repeatY": 3, "repeatX": 3, "height": 647 }, "compId": 13, "child": [{ "type": "Box", "props": { "width": 124, "renderType": "render", "height": 189 }, "compId": 12, "child": [{ "type": "Image", "props": { "y": 62, "x": 62, "skin": "skin/pf-di1.png", "name": "img_di1", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }, { "type": "Button", "props": { "y": 161, "x": 62, "stateNum": 1, "skin": "skin/pf-anniu1.png", "name": "btn_di2", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 24 }, { "type": "Image", "props": { "y": 161, "x": 62, "skin": "skin/pf-dqcd.png", "name": "img_di3", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 25 }, { "type": "Image", "props": { "y": 61, "x": 61, "skin": "img/start-z.png", "name": "img_item", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "Image", "props": { "y": 144, "x": 2, "skin": "img/start-z.png", "scaleY": 0.8, "scaleX": 0.8, "name": "img_dmd" }, "compId": 26 }, { "type": "Label", "props": { "y": 141, "x": 44, "width": 83, "valign": "middle", "text": "2000", "name": "label_dnum", "height": 40, "fontSize": 36, "font": "SimHei", "color": "#ffffff", "bold": true, "align": "left" }, "compId": 27 }] }] }, { "type": "Button", "props": { "y": 960, "x": 220, "var": "btn_buy", "stateNum": 1, "skin": "skin/pf-anniu.png" }, "compId": 18 }], "loadList": ["img/img_black.png", "img/sz-di.png", "img/sz-x.png", "skin/pf-pf.png", "skin/pf-di1.png", "skin/pf-anniu1.png", "skin/pf-dqcd.png", "img/start-z.png", "skin/pf-anniu.png"], "loadList3D": [] };
        ui.SkinDlgUI = SkinDlgUI;
        REG("ui.SkinDlgUI", SkinDlgUI);
        class SkinUseDlgUI extends Laya.Dialog {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(SkinUseDlgUI.uiView);
            }
        }
        SkinUseDlgUI.uiView = { "type": "Dialog", "props": { "width": 750, "height": 1630 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 750, "skin": "img/img_black.png", "height": 1630, "alpha": 0.7 }, "compId": 27 }, { "type": "Image", "props": { "y": 580, "x": 375, "width": 612, "skin": "img/sz-di.png", "sizeGrid": "126,153,175,148", "height": 897, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Image", "props": { "y": 160, "x": 600, "var": "img_back", "skin": "img/sz-x.png" }, "compId": 6 }, { "type": "Image", "props": { "y": 795, "x": 220, "var": "btn_shiyong3", "skin": "skin/pfsy-anniu2.png" }, "compId": 12 }, { "type": "Image", "props": { "y": 321, "x": 114, "skin": "skin/pfsy-di1.png" }, "compId": 7 }, { "type": "Image", "props": { "y": 496, "x": 231, "var": "img_skin1", "skin": "img/start-z.png", "scaleY": 0.8, "scaleX": 0.8, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 9 }, { "type": "Button", "props": { "y": 706, "x": 146, "var": "btn_shiyong1", "stateNum": 1, "skin": "skin/pfsy-anniu.png" }, "compId": 10 }, { "type": "Image", "props": { "y": 321, "x": 400, "skin": "skin/pfsy-di2.png" }, "compId": 19 }, { "type": "Image", "props": { "y": 496, "x": 517, "var": "img_skin2", "skin": "img/start-z.png", "scaleY": 0.8, "scaleX": 0.8, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 20 }, { "type": "Button", "props": { "y": 706, "x": 432, "var": "btn_shiyong2", "stateNum": 1, "skin": "skin/pfsy-anniu.png" }, "compId": 21 }, { "type": "CheckBox", "props": { "y": 938, "x": 264, "var": "check_not", "skin": "skin/checkbox.png", "scaleY": 3, "scaleX": 3, "labelFont": "SimHei", "labelColors": "#123456", "label": "  不再弹出" }, "compId": 25 }, { "type": "Image", "props": { "y": 160, "x": 254, "skin": "skin/pfsy-pfsy.png" }, "compId": 26 }], "loadList": ["img/img_black.png", "img/sz-di.png", "img/sz-x.png", "skin/pfsy-anniu2.png", "skin/pfsy-di1.png", "img/start-z.png", "skin/pfsy-anniu.png", "skin/pfsy-di2.png", "skin/checkbox.png", "skin/pfsy-pfsy.png"], "loadList3D": [] };
        ui.SkinUseDlgUI = SkinUseDlgUI;
        REG("ui.SkinUseDlgUI", SkinUseDlgUI);
        class TipViewUI extends Laya.View {
            constructor() {
                super();
            }
            createChildren() {
                super.createChildren();
                this.createView(TipViewUI.uiView);
            }
        }
        TipViewUI.uiView = { "type": "View", "props": { "width": 750, "height": 200 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 50, "x": 0, "width": 750, "height": 100, "bgColor": "#000000" }, "compId": 3 }, { "type": "Label", "props": { "y": 100, "x": 360, "var": "tip_label", "text": "label", "fontSize": 30, "color": "#ffffff", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }], "loadList": [], "loadList3D": [] };
        ui.TipViewUI = TipViewUI;
        REG("ui.TipViewUI", TipViewUI);
    })(ui || (ui = {}));

    class TipManger {
        showTip(str, time = 2 * 1000) {
            let view = new ui.TipViewUI();
            Laya.stage.addChild(view);
            view.zOrder = 500;
            view.tip_label.text = str;
            view.y = Laya.stage.height / 2 - view.height / 2;
            if (time != 0) {
                let t = Laya.Tween.to(view, { alpha: 0.1 }, time);
                Laya.timer.once(time, this, () => {
                    this.tween.clear();
                    view.destroy();
                });
                this.tween = t;
            }
        }
    }
    TipManger._instance = new TipManger;
    let g_tipM = TipManger._instance;

    class VideoCom extends Laya.Script {
        constructor() {
            super();
            this.isOp = false;
            this.isRecord = false;
            this.curTimer = 0;
            this.norSkin = "img/img_camera.png";
            this.videoSkin = "img/img_record.png";
            this.playType = true;
            this.isClick = true;
            this.isInitiative = true;
        }
        onEnable() {
            this.owner.on(Laya.Event.CLICK, this, this.onResetVideoClick);
            this.recorder = tt.getGameRecorderManager();
            this.recorder.onStart(res => {
                this.isOp = false;
                console.log("开始录屏");
            });
            this.recorder.onStop(res => {
                this.isOp = false;
                this.owner.skin = this.norSkin;
                this.isRecord = false;
                console.log("停止录屏-------------------- " + res.videoPath);
                this.videoRes = res;
                if (this.isInitiative) {
                    this.share(0);
                }
                this.isInitiative = true;
                this.playType = true;
            });
            this.recorder.onError((err) => {
                console.log("播放错误" + err);
            });
        }
        onDisable() {
            this.owner.off(Laya.Event.CLICK, this, this.onResetVideoClick);
        }
        onResetVideoClick() {
            console.log("onResetVideoClick  isOp = " + this.isOp + "  isRecord = " + this.isRecord + 'playType = ' + this.playType + 'this.isInitiative' + this.isInitiative);
            if (this.isInitiative) {
                if (!this.isClick)
                    return;
                if (this.isOp)
                    return;
                this.isOp = true;
                if (this.isRecord) {
                    if (this.curTimer >= 3 * 1000) {
                        this.owner.skin = this.norSkin;
                        this.recorder.stop();
                    }
                    else {
                        console.log("不足3秒,停止失败,3秒后自动停止");
                        g_tipM.showTip("不足3秒,无法停止,3秒后自动停止!", 1 * 1000);
                        this.isClick = false;
                        setTimeout(() => {
                            this.isClick = true;
                            this.owner.skin = this.norSkin;
                            this.recorder.stop();
                        }, 1000 * 3);
                        this.isOp = false;
                        return;
                    }
                }
                else {
                    this.playType = false;
                    this.owner.skin = this.videoSkin;
                    this.recorder.start({
                        duration: 30,
                    });
                    this.isOp = false;
                }
                this.isRecord = !this.isRecord;
            }
            else {
                if (this.playType) {
                    this.playType = false;
                    this.owner.skin = this.videoSkin;
                    this.recorder.start({
                        duration: 300,
                    });
                    this.isInitiative = true;
                }
                else {
                    if (this.curTimer >= 3 * 1000) {
                        this.isClick = false;
                        this.isClick = true;
                        this.owner.skin = this.norSkin;
                        this.recorder.stop();
                        this.isOp = false;
                        this.playType = true;
                    }
                    else {
                        g_tipM.showTip("不足3秒,无法停止,3秒后自动停止!", 1 * 1000);
                        setTimeout(() => {
                            this.isClick = false;
                            this.isClick = true;
                            this.owner.skin = this.norSkin;
                            this.recorder.stop();
                            this.isOp = false;
                            this.playType = true;
                        }, 1000 * 3);
                    }
                }
            }
        }
        onUpdate() {
            if (this.isRecord) {
                this.curTimer += Laya.timer.delta;
            }
            else {
                this.curTimer = 0;
            }
        }
        share(type) {
            console.log("分享视频");
            let game = this.uiScene;
            try {
                tt.shareAppMessage({
                    channel: "video",
                    imageUrl: '',
                    query: '',
                    extra: {
                        videoPath: this.videoRes.videoPath,
                    },
                    success() {
                        console.log('分享视频成功');
                        if (type) {
                            console.log('胜利分享, 发放奖励');
                        }
                        else {
                            console.log('失败分享, 不发放奖励');
                        }
                    },
                    fail(e) {
                        console.log('分享视频失败' + JSON.stringify(e));
                        g_tipM.showTip("分享视频失败!", 1 * 1000);
                    }
                });
            }
            catch (e) {
                console.log("recorder.onStop  " + e);
            }
        }
        isPlay(game, type) {
            this.isInitiative = false;
            this.uiScene = game;
            this.playType = type;
        }
    }

    class JsbTouTiao extends JsbBase {
        constructor() {
            super(...arguments);
            this.BannerId = "2c4dh0j0oc9dh9a2n7";
            this.RewardedVideoId = "1c0jag1fd3geb88400";
            this.bannerAd = null;
            this.videoAd = null;
            this.isCachedVideo = false;
            this.game = null;
            this.type = null;
            this.btn_shart = null;
            this.btna = null;
            this.btnb = null;
            this.btnc = null;
            this.btnd = null;
            this.share_demand = 1;
        }
        openAdvert(type) {
            switch (type) {
                case 8: {
                    this.openSplashAd();
                    break;
                }
                case 5: {
                    this.openRewardVideo();
                    break;
                }
            }
        }
        openVideoAdvert() {
            this.openRewardVideo();
        }
        openVibrateShort() {
            tt.vibrateShort({
                success(res) {
                },
                fail(res) {
                    console.log(`vibrateShort调用失败`);
                }
            });
        }
        openVibrateLong() {
            tt.vibrateLong({
                success(res) {
                },
                fail(res) {
                    console.log(`vibrateShort调用失败`);
                }
            });
        }
        openSplashAd() {
            this.openBanner();
            if (typeof tt.createRewardedVideoAd == "function") {
                this.loadVideo();
            }
        }
        openBanner() {
            this.clearBanner();
            if (this.bannerAd == null) {
                let windowWidth = tt.getSystemInfoSync().windowWidth;
                let windowHeight = tt.getSystemInfoSync().windowHeight;
                this.windowWidth = windowWidth;
                this.windowHeight = windowHeight;
                var targetBannerAdWidth = 200;
                if (targetBannerAdWidth > windowWidth) {
                    targetBannerAdWidth = windowWidth - 40;
                }
                let bannerAd = tt.createBannerAd({
                    adUnitId: this.BannerId,
                    style: {
                        width: targetBannerAdWidth,
                        top: windowHeight - (targetBannerAdWidth / 16 * 9),
                        left: (windowWidth - targetBannerAdWidth) / 2
                    },
                });
                bannerAd.onResize(size => {
                    if (targetBannerAdWidth != size.width) {
                        targetBannerAdWidth = size.width;
                        bannerAd.style.left = (windowWidth - size.width) / 2;
                        bannerAd.style.top = windowHeight - (size.height + 20);
                    }
                    console.log("广告宽高---", size.width, size.height, 'left,top---', bannerAd.style.left, bannerAd.style.top);
                });
                bannerAd.onLoad(() => {
                    console.log("banner 加载成功");
                    this.bannerAd.show()
                        .then(() => {
                        console.log('广告显示成功');
                    })
                        .catch(err => {
                        console.log('广告组件出现问题', err);
                    });
                });
                bannerAd.onError((err) => {
                    console.log("bannerAd 加载失败" + JSON.stringify(err));
                    Laya.timer.once(1000 * 60, this, () => {
                        this.openBanner();
                    });
                });
                this.bannerAd = bannerAd;
                console.log('this.bannerAd.style.width-----' + this.bannerAd.style.width, 'this.bannerAd.style.height------' + this.bannerAd.style.height);
            }
        }
        clearBanner() {
            if (this.bannerAd) {
                this.bannerAd.destroy();
                this.bannerAd = null;
            }
        }
        getIsCachedVideo() {
            return this.isCachedVideo;
        }
        loadVideo() {
            console.log("loadVideo =-===================================");
            if (this.videoAd == null) {
                let videoAd = tt.createRewardedVideoAd({
                    adUnitId: this.RewardedVideoId,
                });
                this.videoAd = videoAd;
                videoAd.onLoad(() => {
                    console.log("激励视频  加载成功 -- ");
                    this.isCachedVideo = true;
                });
                videoAd.onError((err) => {
                    console.log("激励视频加载失败 -- " + JSON.stringify(err));
                    setTimeout(() => {
                        this.loadVideo();
                    }, 1000 * 60);
                });
                videoAd.onClose(res => {
                    if (res.isEnded) {
                        console.log("正常播放结束，可以下发游戏奖励");
                        AndroidToJs.CallJs("Advertisement", 5 + ",1");
                        this.loadVideo();
                    }
                    else {
                        console.log("播放中途退出，不下发游戏奖励");
                        AndroidToJs.CallJs("Advertisement", 5 + ",0");
                        this.loadVideo();
                    }
                });
            }
            else {
                this.videoAd.load()
                    .then(() => {
                    this.isCachedVideo = true;
                    console.log('手动加载成功');
                }).catch(err => {
                    console.log('广告组件出现问题', err);
                    setTimeout(() => {
                        this.loadVideo();
                    }, 1000 * 60);
                });
                ;
            }
        }
        runRewardHandler(value) {
            if (this.excitationHandler) {
                this.excitationHandler.runWith(value);
            }
            this.excitationHandler = undefined;
        }
        openRewardVideo() {
            if (this.videoAd) {
                this.videoAd.show()
                    .then(() => {
                    console.log('openRewardVideo  广告显示成功');
                })
                    .catch(err => {
                    console.log('openRewardVideo  广告组件出现问题', err);
                    setTimeout(() => {
                        this.loadVideo();
                    }, 1000 * 60);
                });
            }
        }
        hideBannder() {
            console.log("广告隐藏");
            if (this.bannerAd) {
                this.bannerAd.hide();
            }
        }
        showBannder() {
            console.log("广告显示");
            if (this.bannerAd) {
                this.bannerAd.show();
            }
        }
        isIos() {
            const systemInfo = tt.getSystemInfoSync();
            return systemInfo.platform == 'ios';
        }
        videoPlay(game, type) {
            this.game = game;
            if (type) {
                console.log("开始游戏,开始录制");
                let video_com = game.btn_camera.getComponent(VideoCom);
                video_com.isPlay(game, type);
                video_com.onResetVideoClick();
                game.btn_camera.visible = false;
            }
            else {
                console.log("结束游戏,停止录制");
                let video_com = game.btn_camera.getComponent(VideoCom);
                video_com.isPlay(game, type);
                video_com.onResetVideoClick();
                game.btn_camera.visible = true;
            }
        }
        onShare(game, type) {
            console.log("分享");
            if (game.btn_camera.visible) {
                let video_com = game.btn_camera.getComponent(VideoCom);
                video_com.share(type);
            }
        }
        gameBtn() {
            if (this.btn_shart) {
                this.btn_shart.show();
            }
            else {
                let id = "ttf3f0854d6cda1ee2";
                let skin = "res/push/img_icon.png";
                this.btn_shart = tt.createMoreGamesButton({
                    type: "image",
                    image: skin,
                    style: {
                        left: 0,
                        top: 500,
                        width: 40,
                        height: 35,
                        lineHeight: 40,
                        backgroundColor: "#ff0000",
                        textColor: "#ffffff",
                        textAlign: "center",
                        fontSize: 16,
                        borderRadius: 4,
                        borderWidth: 0,
                        borderColor: '#ff0000'
                    },
                    appLaunchOptions: [
                        {
                            appId: id,
                            query: "foo=bar&baz=qux",
                            extraData: {}
                        },
                    ],
                    onNavigateToMiniGame(res) {
                        console.log('跳转其他小游戏', res);
                    }
                });
                this.btn_shart.onTap(() => {
                    console.log('点击更多游戏');
                });
            }
        }
        btnDestroy() {
            if (this.btn_shart) {
                this.btn_shart.hide();
            }
        }
        gameBtns() {
            if (this.btna) {
                this.btna.show();
                this.btnb.show();
                this.btnc.show();
                this.btnd.show();
            }
            else {
                let n = 720 - this.windowHeight;
                this.game.bg_push.y = 1292 - n * (1630 / 750);
                console.log('this.game.bg_push.y---' + this.game.bg_push.y);
                let id = "ttf3f0854d6cda1ee2";
                this.btna = tt.createMoreGamesButton({
                    type: "image",
                    image: "res/push/qqbwticon.png",
                    style: {
                        left: 22,
                        top: this.windowHeight - 100,
                        width: 64,
                        height: 80,
                        lineHeight: 40,
                        backgroundColor: "#ff0000",
                        textColor: "#ffffff",
                        textAlign: "center",
                        fontSize: 16,
                        borderRadius: 4,
                        borderWidth: 0,
                        borderColor: '#ff0000'
                    },
                    appLaunchOptions: [
                        {
                            appId: id,
                            query: "foo=bar&baz=qux",
                            extraData: {}
                        },
                    ],
                });
                this.btnb = tt.createMoreGamesButton({
                    type: "image",
                    image: "res/push/ggphqicon.png",
                    style: {
                        left: 94,
                        top: this.windowHeight - 100,
                        width: 64,
                        height: 80,
                        lineHeight: 40,
                        backgroundColor: "#ff0000",
                        textColor: "#ffffff",
                        textAlign: "center",
                        fontSize: 16,
                        borderRadius: 4,
                        borderWidth: 0,
                        borderColor: '#ff0000'
                    },
                    appLaunchOptions: [
                        {
                            appId: id,
                            query: "foo=bar&baz=qux",
                            extraData: {}
                        },
                    ],
                });
                this.btnc = tt.createMoreGamesButton({
                    type: "image",
                    image: "res/push/bzklicon.png",
                    style: {
                        left: 166,
                        top: this.windowHeight - 100,
                        width: 64,
                        height: 80,
                        lineHeight: 40,
                        backgroundColor: "#ff0000",
                        textColor: "#ffffff",
                        textAlign: "center",
                        fontSize: 16,
                        borderRadius: 4,
                        borderWidth: 0,
                        borderColor: '#ff0000'
                    },
                    appLaunchOptions: [
                        {
                            appId: id,
                            query: "foo=bar&baz=qux",
                            extraData: {}
                        },
                    ],
                });
                this.btnd = tt.createMoreGamesButton({
                    type: "image",
                    image: "res/push/hdcqdzzicon.png",
                    style: {
                        left: 240,
                        top: this.windowHeight - 100,
                        width: 64,
                        height: 80,
                        lineHeight: 40,
                        backgroundColor: "#ff0000",
                        textColor: "#ffffff",
                        textAlign: "center",
                        fontSize: 16,
                        borderRadius: 4,
                        borderWidth: 0,
                        borderColor: '#ff0000'
                    },
                    appLaunchOptions: [
                        {
                            appId: id,
                            query: "foo=bar&baz=qux",
                            extraData: {}
                        },
                    ],
                });
            }
        }
        btnDestroys() {
            if (this.btna) {
                this.btna.hide();
                this.btnb.hide();
                this.btnc.hide();
                this.btnd.hide();
            }
        }
        showShare(game, Gate_number) {
            this.game = game;
            let video_com = game.btn_camera.getComponent(VideoCom);
            let isplay = video_com.isRecord;
            return (Gate_number / this.share_demand == Math.floor(Gate_number / this.share_demand)) && !isplay;
        }
        isFat() {
            return (this.windowHeight / this.windowWidth) < 1.9;
        }
    }

    class JsbVivoMiGame extends JsbBase {
        constructor() {
            super(...arguments);
            this.AppId = "100003109";
            this.OpenScreenId = "";
            this.BannerId = "7981db6d001a4c878ddafd0f00e8cf57";
            this.RewardedVideoId = "5194388a679f46c5809586e370de75a7";
            this.InsertId = "6d4974bc2fe74c51ac93592034807ebe";
            this.BannerErrCount = 0;
            this.VoideErrCount = 0;
            this.InsertErrCount = 0;
            this.ErrZCount = 3;
            this.isCachedVideo = false;
            this.isCachedInsert = false;
        }
        openSplashAd() {
            this.initOppoAd();
        }
        initOppoAd() {
            console.log("initOppoAd ");
            Laya.timer.once(10 * 1000, this, () => {
                this.openBannerView();
            });
            console.log("---------------------------------------------------");
            this.loadInsert();
            this.loadRewardVide();
        }
        openVibrate() {
            qg.vibrateLong({
                success: (res) => {
                    console.log("openVibrateLong   success");
                    console.log(JSON.stringify(res));
                },
                fail: (res) => {
                    console.log("openVibrateLong   fail");
                    console.log(JSON.stringify(res));
                },
                complete: (res) => {
                    console.log("openVibrateLong   complete");
                    console.log(JSON.stringify(res));
                }
            });
        }
        openAdvert(type) {
            switch (type) {
                case 8: {
                    this.initOppoAd();
                    break;
                }
                case 5: {
                    this.showRewardVideo();
                    break;
                }
                case 3: {
                    this.showInstertView();
                    break;
                }
            }
        }
        openBannerView() {
            this.clearBanner();
            if (this.BannerErrCount >= this.ErrZCount)
                return console.log("加载超时-----banner");
            if (this.bannerAd == null) {
                var bannerAd = qg.createBannerAd({
                    posId: this.BannerId,
                    style: {}
                });
                bannerAd.show();
                bannerAd.onLoad(() => {
                    console.log('Banner广告加载成功');
                    bannerAd.show();
                    this.BannerErrCount = 0;
                });
                bannerAd.onError((err) => {
                    console.log("Banner广告加载失败");
                    console.log(JSON.stringify(err));
                    this.BannerErrCount++;
                });
                bannerAd.onClose(() => {
                    console.log("bannerAd 关闭");
                    setTimeout(() => {
                        this.openBannerView();
                    }, 1000 * 60);
                });
                this.bannerAd = bannerAd;
            }
        }
        clearBanner() {
            if (this.bannerAd) {
                this.bannerAd.destroy();
                this.bannerAd = null;
            }
        }
        loadRewardVide() {
            if (qg.createRewardedVideoAd == null)
                return;
            if (this.VoideErrCount >= this.ErrZCount)
                return console.log("加载超时-----video");
            if (this.videoAd == null) {
                let videoAd = qg.createRewardedVideoAd({ posId: this.RewardedVideoId });
                videoAd.onLoad(() => {
                    console.log('激励视频加载成功');
                    this.isCachedVideo = true;
                    this.VoideErrCount = 0;
                });
                let self = this;
                videoAd.onError((err) => {
                    console.log("激励视频播放失败" + JSON.stringify(err));
                    AndroidToJs.CallJs("Advertisement", 5 + ",0");
                    this.VoideErrCount++;
                    setTimeout(() => {
                        this.loadRewardVide();
                    }, 1000 * 60);
                });
                videoAd.onClose((res) => {
                    if (res && res.isEnded) {
                        console.log("正常播放结束，可以下发游戏奖励");
                        AndroidToJs.CallJs("Advertisement", 5 + ",1");
                    }
                    else {
                        console.log("播放中途退出，不下发游戏奖励");
                        AndroidToJs.CallJs("Advertisement", 5 + ",0");
                    }
                    setTimeout(() => {
                        this.loadRewardVide();
                    }, 1000 * 60);
                });
                this.videoAd = videoAd;
            }
            else {
                this.videoAd.load().then(() => {
                    console.log("激励视频广告加载成功");
                    this.isCachedVideo = true;
                    this.VoideErrCount = 0;
                }).catch(err => {
                    console.log("激励视频广告加载失败", err);
                    this.VoideErrCount++;
                    setTimeout(() => {
                        this.loadRewardVide();
                    }, 1000 * 60);
                });
            }
        }
        getIsCachedVideo() {
            console.log("getIsCachedVideo" + this.isCachedVideo);
            return this.isCachedVideo;
        }
        showRewardVideo() {
            if (this.videoAd && this.isCachedVideo) {
                this.stopMusic();
                this.isCachedVideo = false;
                this.videoAd.show();
            }
        }
        clearRewardVideo() {
        }
        loadInsert() {
            console.log("loadInsert   加载插屏");
            if (this.InsertErrCount >= this.ErrZCount)
                return console.log("加载超时-----loadInsert");
            if (this.insertAd == null) {
                let insertAd = qg.createInterstitialAd({
                    posId: this.InsertId
                });
                insertAd.onLoad(() => {
                    console.log('插屏广告加载成功');
                    this.isCachedInsert = true;
                    this.InsertErrCount = 0;
                });
                insertAd.onError((err) => {
                    this.InsertErrCount++;
                    console.log("插屏打开失败");
                    console.log(JSON.stringify(err));
                    this.clearInsert();
                    setTimeout(() => {
                        this.loadInsert();
                    }, 1000 * 60);
                });
                insertAd.onClose(() => {
                    console.log("插屏关闭");
                    this.clearInsert();
                    setTimeout(() => {
                        this.loadInsert();
                    }, 1000 * 60);
                });
                this.insertAd = insertAd;
            }
            else {
                this.insertAd.load().then(() => {
                    console.log("重新加载插屏成功");
                    this.isCachedInsert = true;
                    this.InsertErrCount = 0;
                }).catch((err) => {
                    console.log("重新加载插屏失败");
                    console.log(JSON.stringify(err));
                    this.InsertErrCount++;
                    this.clearInsert();
                    setTimeout(() => {
                        this.loadInsert();
                    }, 1000 * 60);
                });
            }
        }
        clearInsert() {
            this.isCachedInsert = false;
            this.insertAd = null;
        }
        showInstertView() {
            console.log("显示插屏");
            if (this.insertAd) {
                this.insertAd.show().catch(() => {
                    this.insertAd.load().then(() => {
                        this.insertAd.show();
                    });
                });
            }
        }
        sendDesktop(func) {
            if (qg.installShortcut) {
                qg.installShortcut({
                    success: function (res) {
                        console.log("sendDesktop   success");
                        console.log(JSON.stringify(res));
                        func(1);
                    },
                    fail: function (err) {
                        console.log("sendDesktop   success");
                        console.log(JSON.stringify(err));
                        func(0);
                    },
                    complete: function (res) {
                        console.log("sendDesktop   success");
                        console.log(JSON.stringify(res));
                    }
                });
            }
            else {
                func(1);
            }
        }
        hasShortcutInstalled(callBack) {
            console.log("hasShortcutInstalled");
            if (qg.hasShortcutInstalled) {
                qg.hasShortcutInstalled({
                    success: function (status) {
                        if (status) {
                            console.log('已创建');
                            callBack(1);
                        }
                        else {
                            console.log('未创建');
                            callBack(0);
                        }
                    },
                    fail: () => {
                    },
                    complete: () => {
                    }
                });
            }
            else {
                callBack(0);
            }
        }
        getIsDesktop() {
            return typeof qg.installShortcut === "function";
        }
        playMusic(url, loop = 0) {
            if (this.audio == null) {
                var audio = qg.createInnerAudioContext();
                audio.loop = loop == 0;
                audio.volume = 1;
                audio.autoplay = false;
                audio.src = url;
                this.audio = audio;
            }
            this.audio.play();
        }
        stopMusic() {
            if (this.audio) {
                this.audio.pause();
            }
        }
        playSound(url, v = 1) {
            var audio = qg.createInnerAudioContext();
            audio.loop = false;
            audio.volume = 0.7;
            audio.autoplay = false;
            audio.src = url;
            audio.play();
        }
        openVibrateShort() {
            qg.vibrateShort({
                success: () => {
                    console.log("openVibrateShort   success");
                },
                fail: () => {
                    console.log("openVibrateShort   fail");
                },
                complete: () => {
                    console.log("openVibrateShort   complete");
                }
            });
        }
        openVibrateLong() {
            qg.vibrateLong({
                success: (res) => {
                    console.log("openVibrateLong   success");
                    console.log(JSON.stringify(res));
                },
                fail: (res) => {
                    console.log("openVibrateLong   fail");
                    console.log(JSON.stringify(res));
                },
                complete: (res) => {
                    console.log("openVibrateLong   complete");
                    console.log(JSON.stringify(res));
                }
            });
        }
    }

    class EventManager {
        init() {
            this.cusEvent = new Laya.EventDispatcher();
            AndroidToJs.setEventDispatcher(this.cusEvent);
        }
        AddEvent(eventName, caller, handle) {
            this.cusEvent.on(eventName, caller, handle);
        }
        DispatchEvent(eventName, data) {
            this.cusEvent.event(eventName, data);
        }
        SubEvent(eventName, caller, handle) {
            this.cusEvent.off(eventName, caller, handle);
        }
    }
    EventManager.Instance = new EventManager();
    var g_evnetM = EventManager.Instance;

    class JsbQQMinniGame extends JsbBase {
        constructor() {
            super(...arguments);
            this.BannerId = "674c388a429c077300c8593b6b869412";
            this.RewardedVideoId = "eb8d4d59a32a1213b7dcf065f8e3984b";
            this.InsertId = "89932";
            this.isCachedVideo = false;
            this.isBannerChange = false;
        }
        init() {
            g_evnetM.AddEvent("Active", this, this.onActiveHandle);
            try {
                this.systemInfo = qq.getSystemInfoSync();
                console.log(this.systemInfo);
            }
            catch (e) {
                qq.getSystemInfo({
                    success(res) {
                        this.systemInfo = res;
                    }
                });
            }
        }
        openVibrateLong() {
            qq.vibrateShort({
                fail: (res) => {
                    qq.vibrateLong({});
                },
            });
        }
        playMusic(url, loop = 0) {
            if (this.audio == null) {
                const audio = qq.createInnerAudioContext();
                audio.src = Laya.URL.basePath + "/" + url;
                audio.autoplay = false;
                audio.loop = true;
                var playSound = function () {
                    audio.play();
                    audio.offCanplay(playSound);
                };
                audio.onCanplay(playSound);
                this.audio = audio;
            }
            else {
                this.audio.play();
            }
        }
        onActiveHandle() {
            if (this.audio) {
                this.audio.play();
            }
        }
        stopMusic() {
            if (this.audio) {
                this.audio.pause();
            }
        }
        playSound(url) {
            let audio = qq.createInnerAudioContext();
            audio.src = Laya.URL.basePath + "/" + url;
            audio.autoplay = false;
            let playSound = function () {
                audio.play();
                audio.offCanplay(playSound);
            };
            audio.onCanplay(playSound);
        }
        openAdvert(type) {
            switch (type) {
                case 8: {
                    setTimeout(() => {
                        this.openBanner();
                    }, 2 * 1000);
                    this.loadRewardVideo();
                    break;
                }
                case 5: {
                    this.showRewardVideo();
                    break;
                }
            }
        }
        openBanner() {
            if (this.bannerAd)
                return;
            console.log("openBanner");
            let w = 900;
            let h = 60;
            let c = h / w;
            let banner = qq.createBannerAd({
                adUnitId: this.BannerId,
                style: {
                    width: 300, height: 72, left: 0, top: this.systemInfo.windowHeight
                }
            });
            this.bannerAd = banner;
            banner.onResize((size) => {
                console.log(size);
                if (!this.isBannerChange) {
                    this.isBannerChange = true;
                    banner.style.top = this.systemInfo.windowHeight - size.height;
                    banner.style.left = this.systemInfo.windowWidth / 2 - size.width / 2;
                }
            });
            banner.onLoad(() => {
                console.log("banner onLoad ---");
                banner.show();
            });
            banner.onError((res) => {
                console.log("banner加载失败    " + JSON.stringify(res));
                if (res.errCode == ErrorCode.c1004 || res.errCode == ErrorCode.c1003) {
                    this.clearBanner();
                    setTimeout(() => {
                        this.openBanner();
                    }, 10 * 1000);
                }
            });
        }
        clearBanner() {
            if (this.bannerAd) {
                this.bannerAd.destroy();
                this.bannerAd = null;
            }
        }
        loadRewardVideo() {
            if (this.videoAd == null) {
                console.log("loadRewardVideo");
                let video = qq.createRewardedVideoAd({ adUnitId: this.RewardedVideoId });
                video.onClose((res) => {
                    if (res.isEnded) {
                        AndroidToJs.CallJs("Advertisement", 5 + ",1");
                        console.log("发放奖励");
                    }
                    else {
                        AndroidToJs.CallJs("Advertisement", 5 + ",0");
                    }
                    setTimeout(() => {
                        this.loadRewardVideo();
                    }, 2 * 1000);
                });
                video.onError((res) => {
                    console.log("video加载失败    " + JSON.stringify(res));
                    if (res.errCode == ErrorCode.c1004 || res.errCode == ErrorCode.c1003) {
                        this.clearRewardVideo();
                        setTimeout(() => {
                            this.loadRewardVideo();
                        }, 10 * 1000);
                    }
                });
                video.onLoad(() => {
                    console.log("video 加载成功");
                    this.isCachedVideo = true;
                });
                this.videoAd = video;
            }
            else {
                this.videoAd.load();
            }
        }
        showRewardVideo() {
            this.isCachedVideo = false;
            this.videoAd.show();
        }
        clearRewardVideo() {
        }
        getIsCachedVideo() {
            return this.isCachedVideo;
        }
    }
    var ErrorCode;
    (function (ErrorCode) {
        ErrorCode[ErrorCode["c1000"] = 1000] = "c1000";
        ErrorCode[ErrorCode["c1001"] = 1001] = "c1001";
        ErrorCode[ErrorCode["c1002"] = 1002] = "c1002";
        ErrorCode[ErrorCode["c1003"] = 1003] = "c1003";
        ErrorCode[ErrorCode["c1004"] = 1004] = "c1004";
        ErrorCode[ErrorCode["c1005"] = 1005] = "c1005";
        ErrorCode[ErrorCode["c1006"] = 1006] = "c1006";
        ErrorCode[ErrorCode["c1007"] = 1007] = "c1007";
        ErrorCode[ErrorCode["c1008"] = 1008] = "c1008";
    })(ErrorCode || (ErrorCode = {}));

    class JsbBaiDuMiGame extends JsbBase {
        constructor() {
            super(...arguments);
            this.banner_id = "6476169";
            this.app_id = "f3d5a53f";
            this.video_id = "6476170";
            this.isCachedVideo = false;
        }
        init() {
            this.system_info = swan.getSystemInfoSync();
            console.log("初始化小游戏信息");
            console.log(JSON.stringify(this.system_info));
        }
        openAdvert(type) {
            switch (type) {
                case 8: {
                    this.loadRewardVide();
                    break;
                }
                case 2: {
                    this.openBannerView();
                    break;
                }
                case 5: {
                    this.showRewardVideo();
                    break;
                }
            }
        }
        openSplashAd() {
            setTimeout(() => {
                this.openBannerView();
            }, 5 * 1000);
            this.loadRewardVide();
        }
        openBannerView() {
            if (this._banner) {
                this._banner.hide();
                this._banner.destroy();
                this._banner = null;
            }
            let bw = 300;
            let bh = 50;
            let banner = swan.createBannerAd({
                adUnitId: this.banner_id,
                appSid: this.app_id,
                style: {
                    width: this.system_info.windowWidth,
                    top: this.system_info.windowHeight,
                    left: 0
                }
            });
            let self = this;
            function loadOver() {
                console.log("加载完成");
                banner.show();
            }
            banner.onLoad(loadOver);
            function loadErr(err) {
                console.log("加载失败");
                console.log(JSON.stringify(err));
                let code = err["errCode"];
                if (code == baiduErrCode.c200000 ||
                    code == baiduErrCode.c201000 ||
                    code == baiduErrCode.c3010002 ||
                    code == baiduErrCode.c3010003 ||
                    code == baiduErrCode.c3010004 ||
                    code == baiduErrCode.c3010010) {
                    self.clearBanner();
                    setTimeout(() => {
                        self.openBannerView();
                    }, 60 * 1000);
                }
            }
            banner.onError(loadErr);
            function onResize(size) {
                console.log(size);
            }
            banner.style.height = banner.style.width / bw * bh;
            banner.onResize(onResize);
            this._banner = banner;
        }
        clearBanner() {
            if (this._banner) {
                this._banner.destroy();
                this._banner = null;
            }
        }
        loadRewardVide() {
            if (this._video) {
                this._video.load();
                return;
            }
            let video = swan.createRewardedVideoAd({
                adUnitId: this.video_id,
                appSid: this.app_id
            });
            video.load();
            let self = this;
            function loadOver() {
                console.log("视频加载完成");
                self.isCachedVideo = true;
            }
            video.onLoad(loadOver);
            function loadErr(err) {
                console.log("视频加载失败");
                console.log(JSON.stringify(err));
                let code = err.errCode;
                if (code == baiduErrCode.c200000 ||
                    code == baiduErrCode.c201000 ||
                    code == baiduErrCode.c3010002 ||
                    code == baiduErrCode.c3010003 ||
                    code == baiduErrCode.c3010004 ||
                    code == baiduErrCode.c3010008 ||
                    code == baiduErrCode.c3010009) {
                    self.clearRewardVideo();
                    setTimeout(() => {
                        self.loadRewardVide();
                    }, 60 * 1000);
                }
            }
            video.onError(loadErr);
            function close(res) {
                console.log("视频关闭");
                if (res.isEnded) {
                    console.log("发放奖励");
                    AndroidToJs.CallJs("Advertisement", 5 + ",1");
                }
                else {
                    console.log("视频未看完   不发放奖励");
                    AndroidToJs.CallJs("Advertisement", 5 + ",0");
                }
                self.clearRewardVideo();
                self.loadRewardVide();
            }
            video.onClose(close);
            this._video = video;
        }
        showRewardVideo() {
            if (this.isCachedVideo) {
                let self = this;
                this._video.show().then()
                    .catch(err => {
                    console.log(err);
                    setTimeout(() => {
                        self.loadRewardVide();
                    }, 60 * 1000);
                });
                ;
                this.isCachedVideo = false;
            }
        }
        clearRewardVideo() {
        }
        getIsCachedVideo() {
            return this.isCachedVideo;
        }
        openVibrateShort() {
            swan.vibrateShort({
                success: () => {
                },
                fail: () => {
                }
            });
        }
        openVibrateLong() {
            swan.vibrateLong({
                success: () => {
                },
                fail: () => {
                }
            });
        }
    }
    var baiduErrCode;
    (function (baiduErrCode) {
        baiduErrCode[baiduErrCode["c103010"] = 103010] = "c103010";
        baiduErrCode[baiduErrCode["c103011"] = 103011] = "c103011";
        baiduErrCode[baiduErrCode["c103012"] = 103012] = "c103012";
        baiduErrCode[baiduErrCode["c103020"] = 103020] = "c103020";
        baiduErrCode[baiduErrCode["c107000"] = 107000] = "c107000";
        baiduErrCode[baiduErrCode["c107001"] = 107001] = "c107001";
        baiduErrCode[baiduErrCode["c107002"] = 107002] = "c107002";
        baiduErrCode[baiduErrCode["c107003"] = 107003] = "c107003";
        baiduErrCode[baiduErrCode["c200000"] = 200000] = "c200000";
        baiduErrCode[baiduErrCode["c201000"] = 201000] = "c201000";
        baiduErrCode[baiduErrCode["c3010000"] = 3010000] = "c3010000";
        baiduErrCode[baiduErrCode["c3010002"] = 3010002] = "c3010002";
        baiduErrCode[baiduErrCode["c3010003"] = 3010003] = "c3010003";
        baiduErrCode[baiduErrCode["c3010004"] = 3010004] = "c3010004";
        baiduErrCode[baiduErrCode["c3010005"] = 3010005] = "c3010005";
        baiduErrCode[baiduErrCode["c3010006"] = 3010006] = "c3010006";
        baiduErrCode[baiduErrCode["c3010007"] = 3010007] = "c3010007";
        baiduErrCode[baiduErrCode["c3010008"] = 3010008] = "c3010008";
        baiduErrCode[baiduErrCode["c3010009"] = 3010009] = "c3010009";
        baiduErrCode[baiduErrCode["c3010010"] = 3010010] = "c3010010";
    })(baiduErrCode || (baiduErrCode = {}));

    var PlatformType;
    (function (PlatformType) {
        PlatformType[PlatformType["None"] = 0] = "None";
        PlatformType[PlatformType["Android"] = 1] = "Android";
        PlatformType[PlatformType["OppoMinGame"] = 2] = "OppoMinGame";
        PlatformType[PlatformType["TTMinGame"] = 3] = "TTMinGame";
        PlatformType[PlatformType["BaiDuMinGame"] = 4] = "BaiDuMinGame";
        PlatformType[PlatformType["VivoMinGame"] = 5] = "VivoMinGame";
        PlatformType[PlatformType["QQMinGame"] = 6] = "QQMinGame";
        PlatformType[PlatformType["WXMinGame"] = 7] = "WXMinGame";
    })(PlatformType || (PlatformType = {}));
    class PlatformManager {
        static init(platform) {
            this.platform = platform;
            let jsb = new JsbBase();
            if (this.platform == PlatformType.Android) {
                jsb = new JsbAndroid();
            }
            else if (this.platform == PlatformType.OppoMinGame) {
                jsb = new JsbOppoMiniGame();
            }
            else if (this.platform == PlatformType.TTMinGame) {
                jsb = new JsbTouTiao();
            }
            else if (this.platform == PlatformType.VivoMinGame && qg.getSystemInfoSync().platformVersionCode >= 1031) {
                jsb = new JsbVivoMiGame();
            }
            else if (this.platform == PlatformType.QQMinGame) {
                jsb = new JsbQQMinniGame();
            }
            else if (this.platform == PlatformType.BaiDuMinGame) {
                jsb = new JsbBaiDuMiGame();
            }
            jsb.init();
            this.Jsb = jsb;
        }
        static initData() {
            let userid = PubUtils.GetLocalData("uuid");
            if (userid != null && userid != "") {
                this.userid = userid;
            }
            else {
                this.userid = PubUtils.generateUUID();
                PubUtils.SetLocalData("uuid", this.userid);
            }
        }
    }

    class GameUI extends ui.MainSceneUI {
        constructor() {
            super();
            this.countdownNum = 10;
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
        openBox(type, isopen = true) {
            Laya.timer.clear(this, this.updateFontNum);
            this.box_lose.visible = this.box_main.visible = this.box_win.visible = false;
            if (!isopen)
                return;
            if (type == 1) {
                this.box_main.visible = true;
                this.startType(1);
            }
            else if (type == 2) {
                this.box_win.visible = true;
                this.startType(3);
            }
            else if (type == 3) {
                this.box_lose.visible = true;
                this.startType(3);
                this.countdownNum = 10;
                this.font_failCnt.value = this.countdownNum + "";
                Laya.timer.loop(1000, this, this.updateFontNum);
            }
        }
        updateFontNum() {
            this.countdownNum--;
            this.font_failCnt.value = this.countdownNum + "";
            if (this.countdownNum < 1) {
                this.fanhuiyouxi();
                Laya.timer.clear(this, this.updateFontNum);
            }
        }
        initMouseEvent() {
            this.box_mouse.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
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
            if (PlatformManager.platform != PlatformType.TTMinGame) {
                this.btn_camera.visible = false;
            }
            else {
                this.btn_camera.visible = true;
                this.btn_camera.addComponent(VideoCom);
            }
        }
        openSet(e) {
            e.stopPropagation();
            g_sceneM.openSet(true);
        }
        openSkin(e) {
            e.stopPropagation();
            g_sceneM.openSkin(true);
        }
        openSignin(e) {
            PlatformManager.Jsb.hideBannder();
            e.stopPropagation();
            g_sceneM.openSignin(true);
        }
        mouseDown(e) {
            if (!g_sceneM.isGamimg)
                return;
            g_sceneM.isDrawing = true;
            !g_sceneM.isPausing && g_sceneM.setPenH(true);
        }
        mouseMove(e) { }
        mouseUp() {
            if (!g_sceneM.isGamimg)
                return;
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
        addWinDmd(isDouble) {
            let times = isDouble ? 5 : 1;
            if (g_sceneM.isDoubleStart)
                times *= 2;
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
            }
            else {
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
            }
            else {
                this.addWinDmd(false);
                this.reloadGame();
            }
        }
        openJiliVideo(type) {
            if (PlatformManager.Jsb.getIsCachedVideo()) {
                g_constD.advType = type;
                if (g_sceneM.isMusicOn)
                    this.stopBGM();
                PlatformManager.Jsb.openAdvert(5);
            }
            else {
                g_tipM.showTip("视频正在准备中！");
            }
        }
        advBack(data) {
            let bol1 = g_constD.advType == AdvType.sbkaishi;
            let bol2 = g_constD.advType == AdvType.wblingqu;
            let bol3 = g_constD.advType == AdvType.jxyx;
            if (!(bol1 || bol2 || bol3))
                return;
            let arr = data.split(",");
            let success = +arr[1];
            let type = +arr[0];
            if (g_sceneM.isMusicOn)
                this.playBGM();
            if (type != 5 || success != 1)
                return;
            if (bol1) {
                g_sceneM.isDoubleStart = true;
                this.startGame();
            }
            else if (bol2) {
                this.addWinDmd(true);
                this.reloadGame();
            }
            else if (bol3) {
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
            console.log("重新加载游戏");
            this.openBox(1);
            this.updateLvl();
            this.updatePrg(0);
            g_sceneM.reLoadGame();
            g_evnetM.DispatchEvent("open_lunbo_minigame", false);
            PlatformManager.Jsb.openAdvert(3);
            PlatformManager.Jsb.hideBanner();
        }
        doubleStart() {
            this.openJiliVideo(AdvType.sbkaishi);
        }
        startGame() {
            this.openBox(1, false);
            this.startType(2);
            PlatformManager.Jsb.showBanner();
            if (g_constD.isSkinUsePop)
                g_sceneM.openSkinUseDlg(true);
        }
        continueGame() {
            this.openBox(3, false);
            g_sceneM.destroyPart();
            g_sceneM.continueGame();
        }
        updateGold() {
            this.label_dmd.text = "" + g_constD.gold;
        }
        updateLvl() {
            this.label_p1.text = g_constD.nowLvlTimes + "";
            this.label_p2.text = (g_constD.nowLvlTimes + 1) + "";
        }
        updatePrg(value) {
            this.prg_pro.value = value;
        }
        startType(type) {
            if (PlatformManager.platform != PlatformType.TTMinGame)
                return;
            if (type == 1) {
                console.log('开始前');
                this.shareBox.visible = false;
                if (PlatformManager.Jsb.isIos())
                    return;
                PlatformManager.Jsb.btnDestroys();
                this.bg_push.visible = false;
                PlatformManager.Jsb.gameBtn();
            }
            else if (type == 2) {
                console.log('开始游戏时');
                PlatformManager.Jsb.hideBannder();
                PlatformManager.Jsb.videoPlay(this, 1);
                if (PlatformManager.Jsb.isIos())
                    return;
                PlatformManager.Jsb.btnDestroy();
            }
            else if (type == 3) {
                console.log('结算时');
                PlatformManager.Jsb.videoPlay(this, 0);
                if (PlatformManager.Jsb.isIos())
                    return;
                this.bg_push.visible = true;
                PlatformManager.Jsb.gameBtns();
            }
        }
        videoShare() {
            this.btn_share.visible = false;
            PlatformManager.Jsb.onShare(this, this.box_win.visible);
        }
        againType() {
            if (this.box_win.visible) {
                this.addWinDmd(false);
                this.reloadGame();
            }
            else {
                this.reloadGame();
            }
        }
    }
    var AdvType;
    (function (AdvType) {
        AdvType[AdvType["normal"] = 0] = "normal";
        AdvType[AdvType["sbkaishi"] = 1] = "sbkaishi";
        AdvType[AdvType["wblingqu"] = 2] = "wblingqu";
        AdvType[AdvType["jxyx"] = 3] = "jxyx";
        AdvType[AdvType["signFanbei"] = 4] = "signFanbei";
        AdvType[AdvType["skinUse"] = 5] = "skinUse";
        AdvType[AdvType["skinDiscount"] = 6] = "skinDiscount";
    })(AdvType || (AdvType = {}));

    class ConstData {
        constructor() {
            this.gold = 0;
            this.nowLvl = 1;
            this.totalLvl = 24;
            this.nowLvlTimes = 1;
            this.winGold = 20;
            this.ownedSkin = [0];
            this.equipId = 0;
            this.isSkinUsePop = true;
            this.signDay = 0;
            this.signTime = 0;
            this.advType = AdvType.normal;
            this.cylR = 0.6;
            this.cylH = 0.3;
            this.penMinH = 9;
            this.penMaxH = 12;
            this.bookData = new Laya.Vector3(32, 3.75, 45);
            this.BGM = "res/music/gamebgm.mp3";
            this.winM = "res/music/win.wav";
            this.goldStorageName = "drawaround_gold";
            this.lvlStorageName = "drawaround_lvl";
            this.lvlTimesStorageName = "drawaround_lvl_times";
            this.skinStorageName = "drawaround_skins";
            this.equipIdStorageName = "drawaround_equip_skin_id";
            this.signDayStorageName = "drawaround_sign_day";
            this.wall_col_group = Laya.Physics3DUtils.COLLISIONFILTERGROUP_DEFAULTFILTER;
        }
    }
    ConstData.Instance = new ConstData;
    var g_constD = ConstData.Instance;

    var globalFun;
    (function (globalFun) {
        function copyVec3ToNew(v) {
            let p = new Laya.Vector3();
            p.x = v.x, p.y = v.y;
            p.z = v.z;
            return p;
        }
        globalFun.copyVec3ToNew = copyVec3ToNew;
        function vector3Add(v1, v2) {
            let v = new Laya.Vector3();
            v.x = v1.x + v2.x;
            v.y = v1.y + v2.y;
            v.z = v1.z + v2.z;
            return v;
        }
        globalFun.vector3Add = vector3Add;
        function vector3Sub(v1, v2) {
            let v = new Laya.Vector3();
            Laya.Vector3.subtract(v1, v2, v);
            return v;
        }
        globalFun.vector3Sub = vector3Sub;
        function getRandom(n1, n2) {
            var s = Math.random();
            return Math.ceil(n1 + s * (n2 - n1));
        }
        globalFun.getRandom = getRandom;
        function getObjLen(obj) {
            let n = 0;
            for (let i in obj) {
                n++;
            }
            return n;
        }
        globalFun.getObjLen = getObjLen;
        function radToAngle(rad) {
            return rad / Math.PI * 180.0;
        }
        globalFun.radToAngle = radToAngle;
        function angleToRad(angle) {
            return angle * Math.PI / 180.0;
        }
        globalFun.angleToRad = angleToRad;
        function compute3Reflex(I, N) {
            let mi = this.copyVec3ToNew(I);
            let mn = this.copyVec3ToNew(N);
            Laya.Vector3.normalize(mi, mi);
            Laya.Vector3.normalize(mn, mn);
            let r = new Laya.Vector3();
            Laya.Vector3.multiply(mi, mn, r);
            Laya.Vector3.multiply(r, mn, r);
            Laya.Vector3.scale(r, 2, r);
            Laya.Vector3.subtract(mi, r, r);
            Laya.Vector3.normalize(r, r);
            return r;
        }
        globalFun.compute3Reflex = compute3Reflex;
        function angleToVector3(angle) {
            let speedX = Math.sin(angle * Math.PI / 180);
            let speedZ = Math.cos(angle * Math.PI / 180);
            let v = new Laya.Vector3();
            v.x = speedX;
            v.z = speedZ;
            Laya.Vector3.normalize(v, v);
            return v;
        }
        globalFun.angleToVector3 = angleToVector3;
    })(globalFun || (globalFun = {}));
    var globalFun$1 = globalFun;

    class ActionManager {
        constructor() {
            this.pindex = 0;
        }
        init() {
            this.lineSp = new Laya.Sprite;
            Laya.stage.addChild(this.lineSp);
            this.lineSp.zOrder = 100;
            Laya.timer.frameLoop(1, this, this.updateAddCyl);
        }
        drawLine() {
            let per = 10;
            g_sceneM.colorsPosArr = [];
            g_sceneM.drawPosArr = [];
            for (let i = 0; i < g_sceneM.wayPoints.length; ++i) {
                let pc = g_sceneM.wayPoints[i];
                let lx, lz;
                let maxd = 0;
                for (let j = 0; j < per; ++j) {
                    let t = j / per;
                    let nx = pc[0].x * (1 - t) * (1 - t) * (1 - t) + 3 * pc[1].x * t * (1 - t) * (1 - t) + 3 * pc[2].x * t * t * (1 - t) + pc[3].x * t * t * t;
                    let nz = pc[0].z * (1 - t) * (1 - t) * (1 - t) + 3 * pc[1].z * t * (1 - t) * (1 - t) + 3 * pc[2].z * t * t * (1 - t) + pc[3].z * t * t * t;
                    if (lx) {
                        let d = Math.sqrt((nx - lx) * (nx - lx) + (nz - lz) * (nz - lz));
                        if (d > maxd)
                            maxd = d;
                    }
                    lx = nx;
                    lz = nz;
                }
                let h = g_constD.cylH;
                let p = maxd / h;
                per = Math.ceil(per * p * 1.5);
                for (let k = 0; k < per; ++k) {
                    let t = k / per;
                    let x_ = pc[0].x * (1 - t) * (1 - t) * (1 - t) + 3 * pc[1].x * t * (1 - t) * (1 - t) + 3 * pc[2].x * t * t * (1 - t) + pc[3].x * t * t * t;
                    let z_ = pc[0].z * (1 - t) * (1 - t) * (1 - t) + 3 * pc[1].z * t * (1 - t) * (1 - t) + 3 * pc[2].z * t * t * (1 - t) + pc[3].z * t * t * t;
                    let y_ = pc[0].y;
                    g_sceneM.colorsPosArr.push(new Laya.Vector3(x_, y_, z_));
                    g_sceneM.addLinePath(x_, z_);
                }
            }
        }
        updateAddCyl() {
            if (!g_sceneM.isGamimg)
                return;
            if (!g_sceneM.isDrawing)
                return;
            if (g_sceneM.isPausing)
                return;
            let cparr = g_sceneM.colorsPosArr;
            this.pindex += 2;
            if (this.pindex >= cparr.length - 1) {
                this.addCyl(this.pindex - 1);
                g_evnetM.DispatchEvent("now_progress_end");
                this.pindex = 0;
                return;
            }
            this.addCyl(this.pindex - 1);
            this.addCyl(this.pindex);
        }
        addCyl(pindex) {
            let cparr = g_sceneM.colorsPosArr;
            let vec = cparr[pindex].clone();
            let lastVec = cparr[pindex - 1];
            let dx = vec.x - lastVec.x;
            let dy = vec.z - lastVec.z;
            let rad = Math.atan2(dy, dx);
            let angle = 90 - globalFun$1.radToAngle(rad);
            g_sceneM.updatePen(vec);
            g_sceneM.addCyl(vec, angle);
        }
    }
    ActionManager.Instance = new ActionManager;
    let g_actionM = ActionManager.Instance;

    class LoadView extends ui.LoadViewUI {
        onEnable() {
            this.roundTip();
        }
        roundTip() {
            let ary = [
                "资源加载中，请稍后！",
                "你想要的我都有~",
                "即将到达战场！",
                "大吉大利，今晚吃鸡！"
            ];
            let r = Math.floor(Math.random() * 100000) % ary.length;
            this.loadLabel.text = ary[r];
        }
    }

    class SetDlg extends ui.SetDlgUI {
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
                g_evnetM.DispatchEvent("play_music");
                this.img_music.skin = "img/sz-kai.png";
                this.icon_music.skin = "img/sz-ty1.png";
            }
            else {
                g_evnetM.DispatchEvent("stop_music");
                this.img_music.skin = "img/sz-guan.png";
                this.icon_music.skin = "img/sz-ty2.png";
            }
        }
        openSound() {
            g_sceneM.isSoundOn = !g_sceneM.isSoundOn;
            if (g_sceneM.isSoundOn) {
                this.img_sound.skin = "img/sz-kai.png";
                this.icon_sound.skin = "img/sz-yl1.png";
            }
            else {
                this.img_sound.skin = "img/sz-guan.png";
                this.icon_sound.skin = "img/sz-yl2.png";
            }
        }
        openShake() {
            g_sceneM.isShakeOn = !g_sceneM.isShakeOn;
            if (g_sceneM.isShakeOn) {
                this.img_shake.skin = "img/sz-kai.png";
                this.icon_shake.skin = "img/sz-zd1.png";
            }
            else {
                this.img_shake.skin = "img/sz-guan.png";
                this.icon_shake.skin = "img/sz-zd2.png";
            }
        }
    }

    class SkinDlg extends ui.SkinDlgUI {
        constructor() {
            super();
            this.isDiscount = false;
            this.init();
            this.initMouseEvent();
        }
        init() {
            let skinurl = "res/config/skins.json";
            this.skinsData = Laya.loader.getRes(skinurl);
            this.skinsData.splice(0, 1);
            this.skinsData.sort(function (a, b) {
                return a.id - b.id;
            });
            g_constD.skinData = this.skinsData;
            this.list_skin.dataSource = this.skinsData;
            this.list_skin.vScrollBarSkin = "";
        }
        initMouseEvent() {
            this.img_back.on(Laya.Event.CLICK, this, this.closeDlg);
            this.btn_buy.on(Laya.Event.CLICK, this, this.buyOnClick);
            this.list_skin.renderHandler = new Laya.Handler(this, this.listOnRender);
            this.list_skin.mouseHandler = new Laya.Handler(this, this.listMouseHander);
            g_evnetM.AddEvent("Advertisement", this, this.advBack);
        }
        listOnRender(cell, index) {
            let skinData = this.skinsData[index];
            if (!skinData)
                return;
            let img_di1 = cell.getChildByName("img_di1");
            let btn_di2 = cell.getChildByName("btn_di2");
            let img_di3 = cell.getChildByName("img_di3");
            let img_item = cell.getChildByName("img_item");
            let img_dmd = cell.getChildByName("img_dmd");
            let label_dnum = cell.getChildByName("label_dnum");
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
            let needDmd = this.isDiscount ? +skinData.unlock_need / 2 : +skinData.unlock_need;
            label_dnum.text = needDmd + "";
            img_item.skin = "skin/" + skinData.skin_res_name + ".png";
            img_item.scale(0.3, 0.3);
        }
        listMouseHander(e, index) {
            if (e.type != Laya.Event.CLICK)
                return;
            let skinData = this.skinsData[index];
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
            if (!(e.target instanceof Laya.Button))
                return;
            let dmd = this.isDiscount ? +skinData.unlock_need / 2 : +skinData.unlock_need;
            let text = "购买成功!";
            if (g_constD.gold >= dmd) {
                this.openBtn(true);
                this.isDiscount = false;
                g_constD.gold -= dmd;
                g_sceneM.setLocalGold(g_constD.gold);
                g_evnetM.DispatchEvent("update_gold");
                g_constD.ownedSkin.push(id);
                g_sceneM.setLocalOwnedSkin(g_constD.ownedSkin);
                this.refresh();
            }
            else {
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
            if (g_sceneM.isMusicOn)
                g_evnetM.DispatchEvent("stop_music");
            PlatformManager.Jsb.openAdvert(5);
        }
        advBack(data) {
            if (g_constD.advType != AdvType.skinDiscount)
                return;
            let arr = data.split(",");
            let success = +arr[1];
            let type = +arr[0];
            if (g_sceneM.isMusicOn)
                g_evnetM.DispatchEvent("play_music");
            if (type != 5 || success != 1)
                return;
            g_constD.advType = AdvType.normal;
            this.isDiscount = true;
            this.refresh();
            this.openBtn(false);
        }
        openBtn(isopen) {
            this.btn_buy.visible = isopen;
        }
        refresh() {
            this.list_skin.refresh();
        }
    }
    class SkinData {
    }

    class SigninDlg extends ui.SigninDlgUI {
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
            });
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
        listOnRender(cell, index) {
            let signdata = this.siginData[index];
            if (!signdata)
                return;
            let img_bg1 = cell.getChildByName("img_bg1");
            let img_icon = cell.getChildByName("img_icon");
            let label_day = cell.getChildByName("label_day");
            let label_text = cell.getChildByName("label_text");
            let img_gou = cell.getChildByName("img_gou");
            img_bg1.skin = index < g_constD.signDay ? "skin/qd-7tiandi.png" : "skin/qd-7tiandi.png";
            img_gou.visible = index < g_constD.signDay;
            let surl = "img/start-z.png";
            let sid = +signdata.reward_skinid;
            if (sid)
                surl = "skin/pen_" + sid + ".png";
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
                if (g_sceneM.isMusicOn)
                    g_evnetM.DispatchEvent("stop_music");
                PlatformManager.Jsb.openAdvert(5);
                this.label_double.mouseEnabled = this.label_recieve.mouseEnabled = false;
            }
            else {
                g_tipM.showTip("视频正在准备中！");
            }
        }
        advBack(data) {
            if (g_constD.advType != AdvType.signFanbei)
                return;
            this.label_double.mouseEnabled = this.label_recieve.mouseEnabled = true;
            let arr = data.split(",");
            let success = +arr[1];
            let type = +arr[0];
            if (g_sceneM.isMusicOn)
                g_evnetM.DispatchEvent("play_music");
            if (type != 5 || success != 1)
                return;
            g_constD.advType = AdvType.normal;
            this.recieveDmd(true);
        }
        recieveDmd(isDouble) {
            let sdata = this.siginData[g_constD.signDay];
            if (!sdata)
                return;
            let gold = +sdata.reward_gold;
            let times = isDouble ? 2 : 1;
            let text = isDouble ? sdata.destext_double : sdata.destext;
            g_constD.gold += (times * gold);
            g_sceneM.setLocalGold(g_constD.gold);
            g_evnetM.DispatchEvent("update_gold");
            g_tipM.showTip(text, 4000);
            if (++g_constD.signDay > 6)
                g_constD.signDay = 0;
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
        setBtnVis(vis) {
            this.label_double.visible = this.label_recieve.visible = vis;
        }
    }
    class SigninData {
    }

    class SkinUseDlg extends ui.SkinUseDlgUI {
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
                if (i == Math.ceil(sdata.length / 2))
                    avrnum = cnt;
                cnt += +sdata[i].skin_try_weight;
            }
            let rad1 = globalFun$1.getRandom(0, avrnum);
            let rad2 = globalFun$1.getRandom(avrnum, cnt);
            let rad3 = globalFun$1.getRandom(0, cnt);
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
        useSkin(type) {
            if (!PlatformManager.Jsb.getIsCachedVideo()) {
                g_tipM.showTip("视频正在准备中！");
                return;
            }
            g_constD.advType = AdvType.skinUse;
            this.btn_shiyong1.mouseEnabled = this.btn_shiyong2.mouseEnabled = this.btn_shiyong3.mouseEnabled = false;
            if (g_sceneM.isMusicOn)
                g_evnetM.DispatchEvent("stop_music");
            PlatformManager.Jsb.openAdvert(5);
            if (type == 1) {
                this.finalId = this.skin1id;
            }
            else if (type == 2) {
                this.finalId = this.skin2id;
            }
            else {
                this.finalId = this.skin3id;
            }
            this.closeDlg();
        }
        advBack(data) {
            if (g_constD.advType != AdvType.skinUse)
                return;
            this.btn_shiyong1.mouseEnabled = this.btn_shiyong2.mouseEnabled = this.btn_shiyong3.mouseEnabled = true;
            let arr = data.split(",");
            let success = +arr[1];
            let type = +arr[0];
            if (g_sceneM.isMusicOn)
                g_evnetM.DispatchEvent("play_music");
            if (type != 5 || success != 1)
                return;
            g_constD.advType = AdvType.normal;
            g_tipM.showTip("试用成功！");
            g_evnetM.DispatchEvent("equip_skin", this.finalId);
        }
    }

    class TigColScript extends Laya.Script3D {
        onTriggerEnter(other) {
            if (!g_sceneM.isGamimg)
                return;
            let owname = other.owner.name;
            if (owname != "pen")
                return;
            console.log("xxxxxxxxxx");
            g_evnetM.DispatchEvent("obstacle_onhit");
        }
    }

    class SceneManager {
        constructor() {
            this.isDoubleStart = false;
            this.isGamimg = false;
            this.isDrawing = false;
            this.isPausing = false;
            this.isSoundOn = true;
            this.isMusicOn = true;
            this.isShakeOn = true;
            this.wayPoints = [];
            this.colorsPosArr = [];
            this.drawPosArr = [];
            this.wayPrg = 0;
            this.initCyls = {};
            this.obsColor = new Laya.Vector4(0, 0.2, 1, 1);
            this.winEffects = [];
        }
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
        playSound(url) {
            if (this.isSoundOn)
                PlatformManager.Jsb.playSound(url);
        }
        shakeScreen() {
            if (this.isShakeOn)
                PlatformManager.Jsb.openVibrateShort();
        }
        addLoadView() {
            this.loadView = new LoadView();
            Laya.stage.addChild(this.loadView);
            this.loadView.zOrder = 1000;
        }
        delLoadView() {
            if (!this.loadView)
                return;
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
        openSet(isOpen) {
            this.setsDlg.visible = isOpen;
        }
        openSkin(isOpen) {
            this.skinDlg.visible = isOpen;
            if (isOpen)
                this.skinDlg.refresh();
        }
        openSignin(isOpen) {
            this.signinDlg.visible = isOpen;
        }
        openSkinUseDlg(isOpen) {
            this.skinUseDlg.updateSkin();
            this.skinUseDlg.visible = isOpen;
        }
        equipSkin(id) {
            let src = "game/pen_" + id + "/Conventional/pen_" + id + ".lh";
            Laya.Sprite3D.load(src, new Laya.Handler(this, (pensp) => {
                if (!pensp)
                    return;
                let pen = pensp.getChildByName("pen");
                if (!pen)
                    return;
                this.myPen.meshFilter.sharedMesh = pen.meshFilter.sharedMesh.clone();
                this.myPen.meshRenderer.material = pen.meshRenderer.material.clone();
            }));
        }
        setLocalLvl(lvl) {
            PubUtils.SetLocalData(g_constD.lvlStorageName, lvl);
        }
        setLocalLvlTimes(times) {
            PubUtils.SetLocalData(g_constD.lvlTimesStorageName, times);
        }
        setLocalGold(gold) {
            PubUtils.SetLocalData(g_constD.goldStorageName, gold);
        }
        setLocalEquipId(id) {
            PubUtils.SetLocalData(g_constD.equipIdStorageName, id);
        }
        setLocalOwnedSkin(skinArr) {
            let skin = "";
            for (let i = 0; i < skinArr.length; ++i) {
                if (i == 0) {
                    skin += skinArr[i];
                }
                else {
                    skin += ("|" + skinArr[i]);
                }
            }
            PubUtils.SetLocalData(g_constD.skinStorageName, skin);
        }
        setLocalSignDayAndTime(day) {
            PubUtils.SetLocalData(g_constD.signDayStorageName, day);
        }
        destroyScene() {
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
                let obs = this.colorCylinders.getChildAt(i);
                if (obs.name == "cyl" + this.wayPrg)
                    obs.destroy();
            }
            g_actionM.pindex = 0;
        }
        startGame() {
            let src = "game/Scene/Conventional/Scene.ls";
            this.gameScene = Laya.loader.getRes(src);
            this.gameScene.cacheAs = "bitmap";
            Laya.stage.addChild(this.gameScene);
            this.camera = this.gameScene.getChildByName("Camera");
            let efsp = Laya.loader.getRes("game/effect1/Conventional/effect1.lh");
            let effectleft = efsp.getChildByName("toleft").clone();
            let effectright = efsp.getChildByName("toright").clone();
            for (let i = 0; i < 4; ++i) {
                let effi;
                let tn1 = i < 2 ? 1 : 0;
                let tn2 = i % 2 == 0 ? 1 : -1;
                if (tn1) {
                    effi = effectright.clone();
                }
                else {
                    effi = effectleft.clone();
                }
                this.winEffects[i] = effi;
                effi.transform.position = new Laya.Vector3(-g_constD.bookData.x * tn1, 0, g_constD.bookData.z / 2 * tn2);
                this.gameScene.addChild(effi);
                console.log(tn1, tn2);
            }
            this.initPen();
        }
        initPen() {
            let penid = g_constD.equipId;
            let src = "game/pen_" + penid + "/Conventional/pen_" + penid + ".lh";
            Laya.Sprite3D.load(src, new Laya.Handler(this, (pensp) => {
                if (!pensp)
                    return;
                this.myPen = pensp.getChildByName("pen").clone();
                this.gameScene.addChild(this.myPen);
                this.myPenTrans = this.myPen.transform;
                this.canister = this.gameScene.getChildByName("tong");
                this.colorMat = Laya.loader.getRes("game/caizhiqiu/Conventional/Assets/yanse/purple.lmat").clone();
                this.creatCyl();
                this.loadGame();
            }));
        }
        setPenH(isdown) {
            let ty = isdown ? g_constD.penMinH : g_constD.penMaxH;
            let penpos = this.myPenTrans.position;
            this.myPenTrans.position = new Laya.Vector3(penpos.x, ty, penpos.z);
        }
        updatePen(vec) {
            this.myPenTrans.position = new Laya.Vector3(vec.x, this.myPenTrans.position.y, vec.z);
        }
        tweenPen() {
            this.wayPrg++;
            this.lastRotay = null;
            let value = (this.wayPrg - 1) / this.wayPointManager.numChildren;
            g_evnetM.DispatchEvent("update_prg", value);
            this.shakeScreen();
            if (value >= 1) {
                this.gameWin();
                return;
            }
            if (!this.isGamimg)
                return;
            this.isPausing = true;
            this.calNextPos();
            let delt = 200;
            let movet = 500;
            let lrez = this.myPenTrans.localRotationEulerZ;
            let targ2 = { value: lrez };
            let tvec = this.wayPoints[0][0];
            let fvec = this.myPenTrans.position;
            let target = { x: fvec.x, z: fvec.z };
            this.myPenTrans.position = new Laya.Vector3(target.x, g_constD.penMaxH, target.z);
            g_actionM.drawLine();
            Laya.Tween.to(targ2, { value: lrez + 360, update: new Laya.Handler(this, () => {
                    this.myPenTrans.localRotationEulerZ = targ2.value;
                }) }, delt);
            Laya.Tween.to(target, { x: tvec.x, z: tvec.z, update: new Laya.Handler(this, () => {
                    this.myPenTrans.position = new Laya.Vector3(target.x, fvec.y, target.z);
                }) }, movet, null, new Laya.Handler(this, () => {
                g_sceneM.isDrawing && g_sceneM.setPenH(true);
                this.goNextProgress();
            }), delt);
        }
        reLoadGame() {
            this.equipSkin(g_constD.equipId);
            this.destroyScene();
            this.loadGame();
        }
        loadGame() {
            let lvl = g_constD.nowLvl;
            if (lvl > g_constD.totalLvl) {
                lvl = g_constD.nowLvl = 1;
                this.setLocalLvl(lvl);
            }
            this.wayPointManager = this.gameScene.getChildByName("Waypoint_Manager" + g_constD.nowLvl);
            this.colorCylinders = this.gameScene.addChild(new Laya.Sprite3D);
            this.colorCylinders.name = "color_cylinder";
            this.obstacles = this.gameScene.addChild(new Laya.Sprite3D);
            this.obstacles.name = "obstacles";
            this.linePaths = this.gameScene.addChild(new Laya.Sprite3D);
            this.linePaths.name = "linepaths";
            this.wayPrg = 1;
            g_actionM.pindex = 0;
            this.creatObs();
            this.calNextPos();
            g_actionM.drawLine();
            this.goNextProgress();
            let vec = this.wayPoints[0][0];
            this.myPenTrans.position = new Laya.Vector3(vec.x, g_constD.penMaxH, vec.z);
        }
        continueGame() {
            this.isGamimg = true;
            let vec = this.wayPoints[0][0];
            this.myPenTrans.position = new Laya.Vector3(vec.x, g_constD.penMaxH, vec.z);
        }
        creatObs() {
            let lvl = g_constD.nowLvl;
            let obsdata = this.moveData["obstacle"]["lvl" + lvl];
            for (let i in obsdata) {
                let datai = obsdata[i];
                let type = +datai["type"];
                if (type == 1) {
                    this.creatBoxObs(datai);
                }
                else if (type == 2) {
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
            obs.meshRenderer.material = this.colorMat.clone();
            let obsmat = obs.meshRenderer.material;
            obsmat.albedoColor = this.obsColor.clone();
            let rigid = obs.addComponent(Laya.Rigidbody3D);
            rigid.colliderShape = colshape;
            rigid.isKinematic = true;
            rigid.isTrigger = true;
            obs.addComponent(TigColScript);
            let rad = globalFun$1.angleToRad(angle);
            let mx = distance * Math.cos(rad);
            let mz = distance * Math.sin(rad);
            let ox = mx / (60 * time / 1000);
            let oz = mz / (60 * time / 1000);
            let dx = 0;
            let dz = 0;
            let f = 1;
            Laya.timer.frameLoop(1, this, () => {
                dx += ox;
                dz += oz;
                if ((dx * dx + dz * dz) > distance * distance) {
                    f = -f;
                    dx = dz = 0;
                }
                obs.transform.translate(new Laya.Vector3(f * ox, 0, f * oz), false);
            });
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
            obs.meshRenderer.material = this.colorMat.clone();
            let obsmat = obs.meshRenderer.material;
            obsmat.albedoColor = this.obsColor.clone();
            let rigid = obs.addComponent(Laya.Rigidbody3D);
            rigid.colliderShape = colshape;
            rigid.isKinematic = true;
            rigid.isTrigger = true;
            obs.addComponent(TigColScript);
            let t = angle == 0 ? 1 : -1;
            let ag = 6000 / time;
            Laya.timer.frameLoop(1, this, () => {
                obs.transform.rotate(new Laya.Vector3(0, t * ag, 0), false, false);
            });
        }
        calNextPos() {
            this.wayPoints = [];
            this.wayPointSp = this.wayPointManager.getChildByName("p" + this.wayPrg);
            for (let i = 0; i < this.wayPointSp.numChildren - 1; ++i) {
                let swp0 = this.wayPointSp.getChildByName("Waypoint " + i);
                let swp0r = swp0.getChildByName("Right");
                let swp1 = this.wayPointSp.getChildByName("Waypoint " + (i + 1));
                let swp1l = swp1.getChildByName("Left");
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
            let line = this.linePaths.addChild(this.initLinePath.clone());
            line.transform.position = new Laya.Vector3(x, 3.8, z);
        }
        creatCyl() {
            let colorType = this.moveData["colorType"];
            for (let i in colorType) {
                let colt = colorType[i];
                let cvec = new Laya.Vector4(colt[0] / 255, colt[1] / 255, colt[2] / 255, 1);
                let cyl = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(g_constD.cylR, g_constD.cylH));
                cyl.transform.rotate(new Laya.Vector3(90, 0, 0), false, false);
                cyl.meshRenderer.material = this.colorMat.clone();
                let cylmat = cyl.meshRenderer.material;
                cylmat.albedoColor = cvec;
                this.initCyls[i] = cyl;
            }
            this.initLinePath = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(0.5, 0.5));
            this.initLinePath.meshRenderer.material = this.colorMat.clone();
            let lpmat = this.initLinePath.meshRenderer.material;
            lpmat.albedoColor = new Laya.Vector4(0.25, 0.25, 0.25, 1);
        }
        addCyl(vec, rotay) {
            let colorData = this.moveData["colors"];
            let cor = colorData["lvl" + g_constD.nowLvl]["p" + this.wayPrg];
            if (!cor)
                return;
            let cyl = this.initCyls[cor].clone();
            this.colorCylinders.addChild(cyl);
            cyl.name = "cyl" + this.wayPrg;
            cyl.transform.position = vec;
            cyl.transform.rotate(new Laya.Vector3(0, rotay, 0), false, false);
            let norA = 30;
            let dr = Math.abs(this.lastRotay - rotay);
            if (this.lastRotay && dr > norA) {
                let cnt = Math.ceil(dr / norA) + 2;
                for (let i = 1; i < cnt; ++i) {
                    let newcyl = this.initCyls[cor].clone();
                    this.colorCylinders.addChild(newcyl);
                    newcyl.name = "cyl" + this.wayPrg;
                    newcyl.transform.position = vec;
                    let da = rotay - this.lastRotay;
                    let newrotay = this.lastRotay + da * (i / cnt);
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
            let target = { x: fvec.x, z: fvec.z };
            let targ2 = { value: lrez };
            let targ3 = { value: fvec.y };
            this.myPenTrans.position = new Laya.Vector3(target.x, g_constD.penMaxH, target.z);
            Laya.Tween.to(targ2, { value: lrez + 360, update: new Laya.Handler(this, () => {
                    this.myPenTrans.localRotationEulerZ = targ2.value;
                }) }, delt);
            Laya.Tween.to(target, { x: tvec.x, z: tvec.z, update: new Laya.Handler(this, () => {
                    this.myPenTrans.position = new Laya.Vector3(target.x, fvec.y, target.z);
                }) }, movet, null, null, delt);
            Laya.Tween.to(targ3, { value: fvec.y - 6, update: new Laya.Handler(this, function () {
                    this.myPenTrans.position = new Laya.Vector3(fvec.x, targ3.value, fvec.z);
                }) }, movet2, null, new Laya.Handler(this, function () {
                if (PlatformManager.platform != PlatformType.TTMinGame && !PlatformManager.Jsb.isIos()) {
                    this.playWinEff();
                }
                this.playSound(g_constD.winM);
                Laya.timer.once(3000, this, () => {
                    g_evnetM.DispatchEvent("game_win");
                });
            }), delt + movet);
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
            g_evnetM.DispatchEvent("open_lunbo_minigame", true);
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
                effi.particleSystem.play();
            }
        }
    }
    SceneManager.Instance = new SceneManager;
    var g_sceneM = SceneManager.Instance;

    class RecommendDlg extends ui.RecommendDlgUI {
        constructor() {
            super();
            this.lunboList = [];
            this.cur_index = 0;
            this.init();
        }
        init() {
            this.mouseThrough = true;
            this.btn_other_mi_game.visible = false;
            this.btn_other_mi_game.mouseThrough = false;
            this.openMini(false);
            this.openLunbo(false);
            g_miniGM.initMinGame();
            g_evnetM.AddEvent("load_mi_config_success", this, function () {
                this.registClick();
                this.initLunbo();
            });
            g_evnetM.AddEvent("open_lunbo_minigame", this, this.openLunbo);
        }
        openOtherGameClick(e) {
            let btn = e.target;
            let model = new DataDockingMiGameModel();
            model.fromName = "color_hole_laya";
            model.url = "http://pushgame.kuaizhiyou.cn/log";
            model.toName = e.target.name;
            model.index = btn.tag;
            model.gameId = g_miniGM.mi_game_id;
            model.userId = PlatformManager.userid;
            PubUtils.DataDocking(model.url, model.getParam());
            PlatformManager.Jsb.openGame(e.target.name);
            console.log("打开分享视频", e.target.name);
        }
        onMiGameClick() {
            let obj = this.lunboList[this.cur_index % this.lunboList.length];
            let model = new DataDockingMiGameModel();
            model.fromName = g_miniGM.mi_game_name;
            model.url = "http://pushgame.kuaizhiyou.cn/log";
            model.toName = obj["lunbo_apkname"];
            model.index = 0;
            model.gameId = g_miniGM.mi_game_id;
            model.userId = PlatformManager.userid;
            PubUtils.DataDocking(model.url, model.getParam());
            PlatformManager.Jsb.openGame(obj["lunbo_apkname"]);
        }
        registClick() {
            let stayData = g_miniGM.stayData;
            let mi_game_id = g_miniGM.mi_game_id;
            let migameData;
            for (let k = 0; k < stayData.length; ++k) {
                if (+stayData[k]["id"] != mi_game_id)
                    continue;
                this.btn_other_mi_game.visible = true;
                migameData = stayData[k];
                break;
            }
            if (!migameData)
                return;
            for (let i = 0; i < this.icon_panel.numChildren; ++i) {
                let btn = this.icon_panel.getChildByName("icon" + i);
                !!btn && (btn.visible = false);
                let listName = "list" + (i + 1);
                if (!!migameData[listName]) {
                    if (!btn)
                        continue;
                    btn.name = migameData["list" + (i + 1) + "_apkname"];
                    btn.skin = "https://kuaizhiyou.com.cn/fenfa/icon/" + migameData[listName + "_icon"] + ".png";
                    btn.tag = i + 1;
                    btn.visible = true;
                    PubUtils.registerScaleListener(btn, this, this.openOtherGameClick, 1.2, true);
                }
            }
            PubUtils.registerTouchListenner(this.box_clickAera, this, null, null, function () {
                this.openMini(false);
            }, null, true);
            PubUtils.registerTouchListenner(this.btn_other_mi_game, this, null, null, function () {
                this.openMini(true);
            }, null, true);
        }
        openMini(vis) {
            this.box_clickAera.visible = vis;
        }
        initLunbo() {
            let lunboData = g_miniGM.lunboData;
            let mi_game_id = g_miniGM.mi_game_id;
            let oneData;
            for (let k = 0; k < lunboData.length; ++k) {
                if (lunboData[k]["id"] != "" && +lunboData[k]["id"] != mi_game_id)
                    continue;
                oneData = lunboData[k];
                break;
            }
            if (!oneData)
                return;
            let len = +oneData["lunbo_num"];
            for (let i = 0; i < len; ++i) {
                if (oneData["lunbo" + i + "_icon"] == "")
                    break;
                let obj = {
                    cd: parseInt(oneData["lunbo_cd"]),
                    lunbo_apkname: oneData["lunbo" + i + "_apkname"],
                    lunbo_icon: "https://kuaizhiyou.com.cn/fenfa/icon/" + oneData["lunbo" + i + "_icon"] + ".png",
                };
                this.lunboList.push(obj);
            }
            if (this.lunboList.length > 0) {
                this.img_icon.skin = this.lunboList[this.cur_index]["lunbo_icon"];
                PubUtils.registerScaleListener(this.btn_migame, this, this.onMiGameClick, 1.2, true);
                this.timeline = new Laya.TimeLine();
                this.timeline.addLabel("right0", 0).to(this.btn_migame, { rotation: -15 }, 0.3 * 1000);
                this.timeline.addLabel("left1", 0).to(this.btn_migame, { rotation: 15 }, 0.3 * 1000);
                this.timeline.addLabel("right2", 0).to(this.btn_migame, { rotation: -15 }, 0.3 * 1000);
                this.timeline.addLabel("left3", 0).to(this.btn_migame, { rotation: 15 }, 0.3 * 1000);
                this.timeline.addLabel("right4", 0).to(this.btn_migame, { rotation: -15 }, 0.3 * 1000);
                this.timeline.play();
                this.timeline.on(Laya.Event.COMPLETE, this, this.rotateOver);
            }
        }
        rotateOver() {
            this.cur_index++;
            this.img_icon.skin = this.lunboList[this.cur_index % this.lunboList.length]["lunbo_icon"];
            Laya.timer.once(2 * 1000, this, () => {
                this.timeline.play();
            });
        }
        openLunbo(vis) {
            this.btn_migame.visible = vis;
        }
    }
    class DataDockingModel {
        constructor() {
            this.url = "";
            this.userId = "";
        }
        getParam() {
            return "";
        }
    }
    class DataDockingMiGameModel extends DataDockingModel {
        constructor() {
            super(...arguments);
            this.fromName = "";
            this.toName = "";
            this.index = 0;
            this.gameId = 0;
        }
        getParam() {
            return `fromName=${this.fromName}&toName=${this.toName}&index=${this.index}&gameId=${this.gameId}&userId=${this.userId}`;
        }
    }
    class MiniGameManager {
        constructor() {
            this.lunboList = [];
            this.currentIndex = 0;
            this.mi_game_id = 20;
            this.mi_game_name = "com_kzy_cbty";
        }
        initMinGame() {
            PlatformManager.Jsb.checkIsMiGame((flag) => {
                this.loadMiConfig();
            });
        }
        loadMiConfig() {
            let url = "https://kuaizhiyou.com.cn/fenfa/fenfalunbo.json";
            PubUtils.GetNetJson(url, (res) => {
                this.lunboData = res;
                this.parseData(res);
                let url = "https://kuaizhiyou.com.cn/fenfa/fenfalist.json";
                PubUtils.GetNetJson(url, (res) => {
                    this.stayData = res;
                    g_evnetM.DispatchEvent("load_mi_config_success");
                });
            });
        }
        parseData(res) {
            for (let i = 1; i < res.length; i++) {
                let json = res[i];
                if (json["id"] == "")
                    break;
                if (parseInt(json["id"]) == this.mi_game_id) {
                    for (let j = 1; j < json["lunbo_num"]; j++) {
                        let obj = {
                            cd: parseInt(json["lunbo_cd"]),
                            lunbo_apkname: json["lunbo" + j + "_apkname"],
                            lunbo_icon: "https://kuaizhiyou.com.cn/fenfa/icon/" + json["lunbo" + j + "_icon"] + ".png",
                        };
                        this.lunboList.push(obj);
                    }
                }
            }
        }
    }
    MiniGameManager.Instance = new MiniGameManager;
    let g_miniGM = MiniGameManager.Instance;

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.MouseManager.multiTouchEnabled = false;
            g_evnetM.init();
            g_sceneM.initEvent();
            PlatformManager.init(PlatformType.None);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
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
            ], new Laya.Handler(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            let gold = +PubUtils.GetLocalData(g_constD.goldStorageName);
            if (gold)
                g_constD.gold = gold;
            let nowLvl = +PubUtils.GetLocalData(g_constD.lvlStorageName);
            if (nowLvl)
                g_constD.nowLvl = nowLvl;
            let nowLvlTimes = +PubUtils.GetLocalData(g_constD.lvlTimesStorageName);
            if (nowLvlTimes)
                g_constD.nowLvlTimes = nowLvlTimes;
            let ownedSkinStr = PubUtils.GetLocalData(g_constD.skinStorageName);
            if (ownedSkinStr) {
                let ownedSkin = ownedSkinStr.split("|");
                for (let i = 0; i < ownedSkin.length; ++i) {
                    g_constD.ownedSkin[i] = +ownedSkin[i];
                }
            }
            let equipId = +PubUtils.GetLocalData(g_constD.equipIdStorageName);
            if (equipId)
                g_constD.equipId = equipId;
            let signDayStr = PubUtils.GetLocalData(g_constD.signDayStorageName);
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
            PlatformManager.Jsb.checkIsMiGame((type) => {
                if (type == 1) {
                    let recomui = new RecommendDlg;
                    Laya.stage.addChild(recomui);
                    recomui.zOrder = 200;
                }
            });
            if (PlatformManager.platform == PlatformType.VivoMinGame) {
                Laya.timer.once(3 * 1000, this, () => {
                    PlatformManager.Jsb.openAdvert(8);
                });
            }
            else {
                PlatformManager.Jsb.openAdvert(8);
            }
            g_evnetM.DispatchEvent("load_scene_over");
        }
    }
    new Main();

}());
