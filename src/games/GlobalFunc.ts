namespace globalFun {
    export function copyVec3ToNew(v: Laya.Vector3): Laya.Vector3 {
        let p = new Laya.Vector3();
        p.x = v.x, p.y = v.y; p.z = v.z;
        return p;
    }

    export function vector3Add(v1, v2): Laya.Vector3 {
        let v = new Laya.Vector3();
        v.x = v1.x + v2.x;
        v.y = v1.y + v2.y;
        v.z = v1.z + v2.z;
        return v;
    }

    export function vector3Sub(v1, v2): Laya.Vector3 {
        let v = new Laya.Vector3();
        Laya.Vector3.subtract(v1, v2, v);
        return v;
    }

    export function getRandom(n1: number, n2: number): number {
        var s = Math.random();
        return Math.ceil(n1 + s * (n2 - n1));
    }

    export function getObjLen(obj: any) {
        let n = 0;
        for(let i in obj) {
            n++;
        }
        return n;
    }

    export function radToAngle(rad: number): number {
        return rad / Math.PI * 180.0
    }
    
    export function angleToRad(angle: number): number {
        return angle * Math.PI / 180.0
    }

    //计算反射向量
    export function compute3Reflex(I: Laya.Vector3, N: Laya.Vector3): Laya.Vector3 {
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

    export function angleToVector3(angle: number): Laya.Vector3 {
        let speedX: number = Math.sin(angle * Math.PI / 180);
        let speedZ: number = Math.cos(angle * Math.PI / 180);
        let v = new Laya.Vector3();
        v.x = speedX;
        v.z = speedZ;
        Laya.Vector3.normalize(v, v);
        return v;
    }
}

export default globalFun;