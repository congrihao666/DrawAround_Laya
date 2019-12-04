import { ui } from "../ui/layaMaxUI";
import PubUtils from "./PubUtils";
import { PlatformManager } from "../platforms/PlatformManager";
import g_sceneM from "../games/SceneManager";

export default class SudokuPushDlg extends ui.SudokuPushUI {

    push_data:Array<any>;
    
    constructor() {
        super();
        this.init();
    }

    init(){
        g_sudokM.getSudokuPushConfig(new Laya.Handler(this, this.initBack));
        this.push_data = new Array<any>();
        this.next_but_tap.on(Laya.Event.CLICK,this,this.onCloseView);
    }

    initBack() {
        for(var i = 0;i < g_sudokM.sudoku_push_data.length;i++){
            var info = g_sudokM.sudoku_push_data[i];
            this.push_data.push(info);
        }
        this.getPushBut();
    }

    getPushBut(){
        for(var i = 1;i <= 9;i++){
            // this.push_node
            var name = "push_item_" + i;
            var but = this.push_node.getChildByName(name);
            var icon = but.getChildByName("icon") as Laya.Image;
            if(this.push_data.length > 0){
                but.active = true;
                var index = Math.floor(Math.random()*this.push_data.length);
                var info = this.push_data[index];
                this.push_data.splice(index, 1);
                icon.skin = info.icon;
                but["rpk_name"] = info.rpk;
                but.on(Laya.Event.CLICK,this,this.onPushButTap)
            }else{
                but.active = false;
            }
        }
    }

    onPushButTap(event){
        var rpkname = event.target["rpk_name"];
        console.log("跳转小游戏",rpkname);
        PlatformManager.Jsb.openGame(rpkname);
    }

    onCloseView(){
        g_sceneM.openSudokuDlg(false);
    }
}

class SudokuPushManager {
    static readonly Instance: SudokuPushManager = new SudokuPushManager;

    public base_url:string = "https://kuaizhiyou.com.cn/fenfa/";

    public icon_url:string = "https://kuaizhiyou.com.cn/fenfa/icon/";

    public push_id:string = "20";

    public lunbo_id:string = "20";

    public sudoku_push_data:Array<any> = new Array<any>();

    public isSudokeAcq:boolean = false;

    getSudokuPushConfig(callBack: Laya.Handler){
        let url = this.base_url +"nine/fenfajiugong.json";
        PubUtils.GetNetJson(url, (res) => {
            var data = res
            if (data) this.isSudokeAcq = true;
            for(var i = 0;i < data.length;i++){
                var id = data[i].id;
                if(id == this.lunbo_id){
                    this.getSudokuPushData(data[i]);
                    callBack.run();
                    break;
                }
            }
        })
    }

    getSudokuPushData(data){
        var num = data["jiugong_num"];
        for(var i = 1;i <= num;i++){
            var iconkey = "jiugong" + i + "_icon";
            var rpkkey = "jiugong" + i + "_apkname";
            var icon = data[iconkey];
            var rpk = data[rpkkey];
            if(icon){
                var iconurl = this.icon_url + icon + ".png";
                var rpkname = rpk;
                var item:any = new Object();
                item.icon = iconurl;
                item.rpk = rpkname;
                this.sudoku_push_data.push(item);
            }
        }
        // console.log(this.sudoku_push_data);
    }
}

let g_sudokM = SudokuPushManager.Instance;