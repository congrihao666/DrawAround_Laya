import g_evnetM from "../common/EventManager";
import g_sceneM from "./SceneManager";

export default class TigColScript extends Laya.Script3D {

    // onCollisionEnter(collision: Laya.Collision) {
    //     if (!g_sceneM.isGamimg) return;
    //     console.log("xxxxxxxxxx");
    //     g_evnetM.DispatchEvent("obstacle_onhit");
    // }

    onTriggerEnter(other:laya.d3.physics.PhysicsComponent) {
        if (!g_sceneM.isGamimg) return;
        let owname = other.owner.name;
        if (owname != "pen") return;
        console.log("xxxxxxxxxx");
        g_evnetM.DispatchEvent("obstacle_onhit");
    }
}