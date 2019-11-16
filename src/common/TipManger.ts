import { ui } from "../ui/layaMaxUI";

class TipManger {
    static _instance: TipManger = new TipManger;

    public tween: Laya.Tween;

    public showTip(str: string, time: number = 2 * 1000) {
        let view = new ui.TipViewUI();
        Laya.stage.addChild(view);
        view.zOrder = 500;
        view.tip_label.text = str;
        view.y = Laya.stage.height / 2 - view.height / 2;
        if (time != 0) {
            let t = Laya.Tween.to(view, { alpha: 0.1 }, time
                //     , null, new Laya.Handler(this, () => {
                //     this.tween.clear();
                //     view.destroy();
                // })
            );
            Laya.timer.once(time, this, () => {
                this.tween.clear();
                view.destroy();
            })
            this.tween = t;
        }
    }
}

let g_tipM = TipManger._instance;
export default g_tipM;