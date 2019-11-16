class EventManager {
    public static readonly Instance: EventManager = new EventManager();

    private cusEvent:Laya.EventDispatcher;

    public init(){
        this.cusEvent = new Laya.EventDispatcher();
        
        AndroidToJs.setEventDispatcher(this.cusEvent);
    }

    public AddEvent(eventName, caller, handle: Function) {
        this.cusEvent.on(eventName, caller, handle);
    }

    public DispatchEvent(eventName, data?) {
        this.cusEvent.event(eventName, data);
    }

    public SubEvent(eventName, caller, handle) {
        this.cusEvent.off(eventName, caller, handle);
    }
}

var g_evnetM: EventManager = EventManager.Instance;
export default g_evnetM;