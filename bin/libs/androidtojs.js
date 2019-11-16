window.AndroidToJs = new function(){

}

AndroidToJs.disPatcher = null;
AndroidToJs.setEventDispatcher = function(disPatcher){
    this.disPatcher  = disPatcher;
}

AndroidToJs.CallJs = function(){
    var ary = [];    
    for(var i = 1; i < arguments.length; i++){
        ary.push(arguments[i]);
    }
    this.disPatcher.event(arguments[0],ary);
}

AndroidToJs.printLog = function(msg){
    alert(msg);
}