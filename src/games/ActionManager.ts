import g_sceneM from "./SceneManager";
import g_constD from "./ConstData";
import globalFun from "./GlobalFunc";
import g_evnetM from "../common/EventManager";

class ActionManager {
    static readonly Instance: ActionManager = new ActionManager;

    lineSp: Laya.Sprite;
    pindex: number = 0;

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
        // let pjvm = g_sceneM.camera.projectionViewMatrix;
        for (let i = 0; i < g_sceneM.wayPoints.length; ++i) {
            let pc = g_sceneM.wayPoints[i];

            //第一次遍历先求出合适的per值
            let lx, lz;
            let maxd = 0;
            for(let j = 0; j < per; ++j) {
                let t = j / per;
                let nx = pc[0].x*(1-t)*(1-t)*(1-t) + 3*pc[1].x*t*(1-t)*(1-t) + 3*pc[2].x*t*t*(1-t) + pc[3].x*t*t*t;
                let nz = pc[0].z*(1-t)*(1-t)*(1-t) + 3*pc[1].z*t*(1-t)*(1-t) + 3*pc[2].z*t*t*(1-t) + pc[3].z*t*t*t;

                if(lx) {
                    let d = Math.sqrt((nx-lx)*(nx-lx)+(nz-lz)*(nz-lz));
                    if (d > maxd) maxd = d;
                }
                lx = nx;
                lz = nz;
            }
            let h = g_constD.cylH;
            let p = maxd / h;
            per = Math.ceil(per * p * 1.5);


            for (let k = 0; k < per; ++k) {
                let t = k / per;
                let x_ = pc[0].x*(1-t)*(1-t)*(1-t) + 3*pc[1].x*t*(1-t)*(1-t) + 3*pc[2].x*t*t*(1-t) + pc[3].x*t*t*t;
                let z_ = pc[0].z*(1-t)*(1-t)*(1-t) + 3*pc[1].z*t*(1-t)*(1-t) + 3*pc[2].z*t*t*(1-t) + pc[3].z*t*t*t;
                let y_ = pc[0].y;

                g_sceneM.colorsPosArr.push(new Laya.Vector3(x_, y_, z_));

                g_sceneM.addLinePath(x_, z_);
            }
        }
    }

    updateAddCyl() {
        if (!g_sceneM.isGamimg) return;
        if (!g_sceneM.isDrawing) return;
        if (g_sceneM.isPausing) return;
        let cparr = g_sceneM.colorsPosArr;
        this.pindex += 2;
        if (this.pindex >= cparr.length - 1) {
            this.addCyl(this.pindex-1);
            g_evnetM.DispatchEvent("now_progress_end");
            this.pindex = 0;
            return;
        }
        this.addCyl(this.pindex-1);
        this.addCyl(this.pindex);
    }

    addCyl(pindex: number) {
        let cparr = g_sceneM.colorsPosArr;
        let vec = cparr[pindex].clone();
        let lastVec = cparr[pindex - 1];
        let dx = vec.x - lastVec.x;
        let dy = vec.z - lastVec.z;
        let rad = Math.atan2(dy, dx);
        let angle = 90 - globalFun.radToAngle(rad);
        g_sceneM.updatePen(vec);
        g_sceneM.addCyl(vec, angle);
    }
}

let g_actionM: ActionManager = ActionManager.Instance;
export default g_actionM;

