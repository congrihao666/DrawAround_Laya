import { ui } from "../ui/layaMaxUI";

export default class LoadView extends ui.LoadViewUI {

    onEnable() {
        this.roundTip();
    }

    public roundTip() {

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