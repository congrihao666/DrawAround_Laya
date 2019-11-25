// import { Config } from "../Config";
import Vector3 = Laya.Vector3;
import Event = Laya.Event;
import { PlatformManager, PlatformType } from "../platforms/PlatformManager";
export default class PubUtils {

    /**
     * 获取节点上所有能碰撞的物体
     */
    public static getAllCollisonSprite3D(node: Laya.Sprite3D): Array<Laya.Sprite3D> {
        let list = [];
        for (let i = 0; i < node.numChildren; i++) {
            let child = node.getChildAt(i) as Laya.Sprite3D;
            if (child) {
                if (child.numChildren == 0) {
                    list.push(child);
                } else {
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

    /**
     * 返回两个向量的差值
     * @param v1 向量1
     * @param v2 向量2
     */
    public static Vec2Sub(v1: Laya.Vector2, v2: Laya.Vector2): Laya.Vector2 {
        let v = new Laya.Vector2();
        v.x = v1.x - v2.x;
        v.y = v1.y - v2.y;
        return v;
    }

    /**
     * 返回两个向量的差值
     * @param v1 向量1
     * @param v2 向量2
     */
    public static Vec3Sub(v1: Laya.Vector3, v2: Laya.Vector3): Laya.Vector3 {
        let v = new Laya.Vector3();
        v.x = v1.x - v2.x;
        v.y = v1.y - v2.y;
        v.z = v1.z - v2.z;
        return v;
    }

    /**
  * 克隆并返回新的向量
  * @param v 
  */
    public static copyVec3ToNew(v: Vector3): Vector3 {
        let p = new Vector3();
        p.x = v.x, p.y = v.y; p.z = v.z;
        return p;
    }

    /**
     * 获取两点间的距离
     */
    public static getVec3Dis(pos1: Laya.Vector3, pos2: Laya.Vector3) {
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.z - pos2.z, 2))
    }

    /**
     * 计算3维向量
     */
    public static vector3ToAngle(pos1: Laya.Vector3, pos2: Laya.Vector3): number {
        let disV = new Laya.Vector3();
        Laya.Vector3.subtract(pos1, pos2, disV);

        let atan2 = Math.atan2(disV.z, disV.x);
        let angle = atan2 / Math.PI * 180;
        if (angle <= 0) {
            angle += 360;
        }
        return angle;
    }

    /**
    * 两个点转换为向量
    */
    public static pointsTurnVector3(spos: Laya.Vector3, epos: Laya.Vector3): Laya.Vector3 {
        let disV = new Laya.Vector3();
        Laya.Vector3.subtract(spos, epos, disV);
        Laya.Vector3.normalize(disV, disV);
        return disV;
    }

    /**
     * 通过key值获取本地储存信息
     * @param key 
     */
    public static GetLocalData(key): any {
        try {
            if (PlatformManager.platform == PlatformType.VivoMinGame) {
                return qg.getStorageSync({ key: key });
            } else {
                return Laya.LocalStorage.getItem(key);
            }
        } catch (e) {
            return null;
        }
    }

    /**
     * 设置本地储存信息
     * @param key 
     * @param data 
     */
    public static SetLocalData(key, data) {
        if (PlatformManager.platform == PlatformType.VivoMinGame) {
            qg.setStorageSync({ "key": key, "value": data });
        } else {
            Laya.LocalStorage.setItem(key, data);
        }
    }

    /**
     * 注册缩放事件 
     * @param node 
     * @param caller 
     * @param clickFunc 
     * @param scale 
     * @param isSwallow 
     */
    public static registerScaleListener(node: any, caller: any, clickFunc: Function, scale: number, isSwallow: boolean = false): void {
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

    /**
     * 注册点击事件
     * @param node 注册事件的节点
     * @param caller 返回目标
     * @param startFunc 
     * @param moveFunc 
     * @param endFunc 
     * @param outFunc 移除目标
     * @param isSwallow 是否吞噬事件
     */
    public static registerTouchListenner(node: Laya.Node, caller: any, startFunc: Function = null, moveFunc: Function = null, endFunc: Function = null, outFunc: Function = null, isSwallow: boolean = false): void {
        if (typeof startFunc === "function") {
            node.on(Event.MOUSE_DOWN, this, (event: Event) => {
                if (isSwallow) {
                    event.stopPropagation();
                }
                startFunc.call(caller, event);
            });
        }

        if (typeof moveFunc === "function") {
            node.on(Event.MOUSE_MOVE, this, (event: Event) => {
                if (isSwallow) {
                    event.stopPropagation();
                }
                moveFunc.call(caller, event);
            });
        }


        if (typeof endFunc === "function") {
            node.on(Event.MOUSE_UP, this, (event: Event) => {
                if (isSwallow) {
                    event.stopPropagation();
                }
                endFunc.call(caller, event);
            });
        }

        if (typeof outFunc === "function") {
            node.on(Event.MOUSE_OUT, this, (event: Event) => {
                if (isSwallow) {
                    event.stopPropagation();
                }
                outFunc.call(caller, event);
            });
        }
    }

    public static clearTouchListenner(node: Laya.Node) {
        node.offAll(Laya.Event.MOUSE_DOWN);
        node.offAll(Laya.Event.MOUSE_MOVE);
        node.offAll(Laya.Event.MOUSE_UP);
        node.offAll(Laya.Event.MOUSE_OUT);
    }

    //获取间隔
    public static getDelta(): number {
        if (Laya.timer.delta >= 200) return 0;
        return Laya.timer.delta / 1000;
    }

    public static checkRayAllCollison(scene: Laya.Scene3D, shape: Laya.ColliderShape, from_pos: Laya.Vector3, to_pos: Laya.Vector3, frome_type: number, to_type: number): Array<Laya.HitResult> {
        let hits: Array<Laya.HitResult> = [];
        scene.physicsSimulation.shapeCastAll(shape, from_pos, to_pos, hits, new Laya.Quaternion(), new Laya.Quaternion(), frome_type, to_type);
        return hits;
    }

    //该方法用于返回欧拉角Vector3(ex,ey,ez)对应的四元数Quaternion q(qx,qy,qz,qw)
    public static eularToQuaternion(xx: number, yy: number, zz: number): Laya.Quaternion {
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

    public static quaternioneToEular(q: Laya.Quaternion): Laya.Vector3 {

        let xx = Math.asin(2 * (q.w * q.y - q.z * q.z)) * 57.3;
        let yy = Math.atan2(2 * (q.x * q.w + q.y * q.z), 1 - 2 * (q.x * q.x + q.y * q.y)) * 57.3;
        let zz = Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.z * q.z + q.y * q.y)) * 57.3; //roll

        return new Laya.Vector3(xx, yy, zz);
    }


    /**
   * 返回两个向量和
   * @param v1 {Laya.Vec3  || Laya.Vec2}
   * @param v2 {Laya.Vec3  || Laya.Vec2}
   */
    public static vector3Add(v1, v2): Laya.Vector3 {
        let v = new Laya.Vector3();
        v.x = v1.x + v2.x;
        v.y = v1.y + v2.y;
        v.z = v1.z + v2.z;
        return v;
    }

    /**
        * 返回两个三维向量差
        */
    public static vector3Sub(v1: Laya.Vector3, v2: Laya.Vector3): Laya.Vector3 {
        let v = new Laya.Vector3();
        Laya.Vector3.subtract(v1, v2, v);
        return v;
    }


    //将一个点/当前点/直线移动到A/目标/点。
    public static MoveTowards(current: Vector3, target: Vector3, maxDistanceDelta: number) {
        // avoid vector ops because current scripting backends are terrible at inlining
        //避免使用向量操作，因为当前脚本后端在内联时非常糟糕
        let toVector_x = target.x - current.x;
        let toVector_y = target.y - current.y;
        let toVector_z = target.z - current.z;

        let sqdist = toVector_x * toVector_x + toVector_y * toVector_y + toVector_z * toVector_z;

        if (sqdist == 0 || sqdist <= maxDistanceDelta * maxDistanceDelta)
            return target;
        let dist = Math.sqrt(sqdist);
        return new Vector3(current.x + toVector_x / dist * maxDistanceDelta,
            current.y + toVector_y / dist * maxDistanceDelta,
            current.z + toVector_z / dist * maxDistanceDelta);
    }

    public static RotateTowards(from: Laya.Quaternion, to: Laya.Quaternion, maxDegreesDelta): Laya.Quaternion {
        let angle = this.Angle(from, to);
        if (angle == 0.0) return to;
        let q = new Laya.Quaternion();
        Laya.Quaternion.slerp(from, to, Math.min(1.0, maxDegreesDelta / angle), q);
        return q;
    }



    // Returns the angle in degrees between two rotations /a/ and /b/.
    public static Angle(a: Laya.Quaternion, b: Laya.Quaternion): number {
        let dot = this.Dot(a, b);
        return this.IsEqualUsingDot(dot) ? 0.0 : Math.acos(Math.min(Math.abs(dot), 1.0)) * 2.0 * this.Rad2Deg;
    }

    public static kEpsilon = 0.000001;
    // Is the dot product of two quaternions within tolerance for them to be considered equal?
    private static IsEqualUsingDot(dot): boolean  {
        // Returns false in the presence of NaN values.
        return dot > 1.0 - this.kEpsilon;
    }

    public static get Rad2Deg() {
        return 1 / Math.PI * 2 / 360;
    }

    // The dot product between two rotations.
    public static Dot(a: Laya.Quaternion, b: Laya.Quaternion): number {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    public static generateUUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        console.log(uuid);
        return uuid;
    }

    public static GetNetJson(url: string, complete: Function, err: Function = null) {
        let xh = new Laya.HttpRequest();
        xh.once(Laya.Event.COMPLETE, this, complete);

        if (err) {
            xh.once(Laya.Event.ERROR, this, err);
        }
        xh.send(url, "", "get", "json", ["Cache-Control", "no-cache"]);
    }

    public static DataDocking(url: string, param: string) {
        let xh = new Laya.HttpRequest();
        xh.http.open("POST", url);
        xh.http.setRequestHeader("Content-Type", "application/json");
        xh.http.send(param)
    }

}