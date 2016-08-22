var object = Object.prototype;

object.create = function(element) {
    if(this.tagName) {
        var obj;
        var dummyPos = element.indexOf("dummy");
        if(dummyPos > -1) {
            var name = element.substring("dummy".length, element.length);
            obj = document.createElement(name);
            obj.css("display", "none");
        }
        else {
            obj = document.createElement(element);
        }
        this.appendChild(obj);
        return obj;
    }
}

object.css = function(style, value) {
    if(style) {
        if(style[0] === ":") {
            var css = $("body").create("style");
            css.innerHTML = this.tagName.toLowerCase() + style + " {" + value + "}";
        }
        else {
            var arr = style.split(", ");
            if(value) {
                for(var i = 0; i < arr.length; i++) {
                    this.style[arr[i]] = value;
                }
            }
            else if(!value) {
                return this.style[style];
            }
        }
    }
};

object.on = function(evt, func) {
    evt = evt.split(" ");
    for(var i = 0; i < evt.length; i++) {
        eval("this.on" + evt[i] + " = " + func);
    }
}

object.in = function(parentString, caseSensitive) {
    if(caseSensitive == true) {
        return this === parentString;
    }
    else if(caseSensitive == (false || null)) {
        return this.toLowerCase() === parentString.toLowerCase();
    }
}

object.chunk = function(pos1, pos2) {
    var str = "";
    pos1 -= 1;
    pos2 -= 1;
    for(var i = pos1; i < pos2; i++) {
        str += this[i];
    }
    return str;
}

object.startFrom = function(string, pos) { // a function to break down a string in segments based off of string arg
    var curString = this;
    var curPos = 0;
    if(!pos) {
        pos = "last";
    }
                    
    function strCheck() {
        if(string.within(curString) == true) {
            if(pos === "last") {
                curString = curString.chunk(curString.indexOf(string) + 2, curString.length);
                strCheck();
            }
            else if(pos != "last" && typeof pos === "number" && pos != 0) {
                curString = curString.chunk(curString.indexOf(string) + 2, curString.length);
                curPos += 1;
                if(curPos != pos) {
                    strCheck();
                }
            }
        }
    }
                    
    strCheck();
                    
    return curString;
}

object.$ = function(targetName) {
    var query;
    if(this.tagName) {
        query = this.querySelectorAll(targetName);
    }
    else if(this == (window || document)) {
        query = document.querySelectorAll(targetName);
    }
    if(query.length == 1) {
        return query[0];
    }
    else {
        return query;
    }
}

function loop(func, delay) {
    
    function action() {
        func();
        
        setTimeout(action, delay);
    }
    
    action();
    
    this.stop = function() {
        action = null;
    }
}

function ElementNode(tagName, func) {
    var tagCheck = loop(function() {
        var tag = document.getElementsByTagName(tagName);
        if(tag.length) {
            for(var i = 0; i < tag.length; i++) {
                func(tag[i]);
            }
            tagCheck.stop();
        }
    }, 0);
}

function inc(url) {
    var ext = url.startAfter(".");
    var pullEnt;
    if(ext === "js") {
        pullEnt = $("body").create("script");
        pullEnt.src = url;
    }
    if(ext === "css") {
        pullEnt = $("body").create("link");
        pullEnt.href = url;
    }
}

object.centerTo = function(x, y) { //align center of element to 
    if(this.position != (null || "static")) {
        var width = parseInt(this.css("width"));
        var height = parseInt(this.css("height"));
        
        if(width == null) {
            width = this.clientWidth;
        }
        if(height == null) {
            height = this.clientHeight;
        }
        
        this.css("left", x - width / 2 + "px");
        this.css("top", y - height / 2 + "px");
    }
}

Math.toRadians = function(degrees) {
    return degrees * (Math.PI / 180);
}

Math.toDegrees = function(radians) {
    return 180 / Math.PI * radians;
}

object.html = function() {
    if(this.tagName) {
        return this.innerHTML;
    }
    else {
        if(this == document) {
            return document.documentElement.innerHTML;
        }
        else {
            return null;
        }
    }
}

Storage.prototype.remove = function(valName) {
    if(this.getItem(valName)) {
        this.setItem(valName, null);
    }
}

object.clone = function(node) {
    if(this.tagName && node.tagName) {
        var clone = node.cloneNode();
        this.appendChild(clone);
        
        return clone;
    }
}

object.fadeIn = function(fade) {
    if(!this.tagName) {
        return;
    }
    
    var parent = this;
    
    if(!fade) {
        fade = new Object();
    }
    if(!fade.time) {
        fade.time = 1;
    }
    if(!fade.opacity) {
        fade.opacity = 1;
    }
    if(!fade.delay) {
        fade.delay = 0;
    }
    
    var prevLayer = false;
    
    if($(".fadeLayer")[0]) {
        prevLayer = true;
    }
    else {
        prevLayer = false;
    }
    
    var fadeLayer;
    
    if(typeof fade.color === "string") {
        fadeLayer = this.create("div");
        fadeLayer.className = "fadeLayer";
        fadeLayer.css("position", "absolute");
        fadeLayer.css("left", "0px");
        fadeLayer.css("top", "0px");
        fadeLayer.css("width", "100%");
        fadeLayer.css("height", "100%");
        fadeLayer.css("background", fade.color);
    }
    
    else if(typeof fade.color != "string" && this.tagName) {
        fadeLayer = this;
    }
    
    fadeLayer.time = fade.time;
    fadeLayer.opacity = fade.opacity;
    fadeLayer.delay = fade.delay;
    fadeLayer.css("opacity", "0");
    fadeLayer.css("transition", "opacity " + fade.time + "s");
    
    setTimeout(function() {
        fadeLayer.css("opacity", fade.opacity);
        
        if(prevLayer == true) {
            setTimeout(function() {
                parent.removeChild($(".fadeLayer")[0]);
            }, fade.time * 1000);
        }
    }, fade.delay * 1000);
}

object.fadeOut = function(fade) {
    if(this.tagName) {
        var element = this;
        if(!fade) {
            fade = new Object();
        }
        if(!fade.time) {
            fade.time = 1;
        }
        if(!fade.delay) {
            fade.delay = 0;
        }
        
        var tran = this.css("transition");
        if("opacity".in(tran) == true) {
            var arr = tran.split(" ");
            for(var i = 0; i < arr.length; i++) {
                if(arr[i - 1] === "opacity") {
                    arr[i] = fade.time + "s";
                }
            }
            tran = arr.join(" ");
        }
        else {
            tran += " opacity " + fade.time + "s";
        }
        
        setTimeout(function() {
            element.css("transition", tran);
            
            setTimeout(function() {
                element.css("opacity", "0");
            }, 0);
        }, fade.delay * 1000);
    }
}

object.dataURL = function(callback) {
    var read = new FileReader();
    
    read.onload = function() {
        callback(read.result);
    }
    
    read.readAsDataURL(this);
}

object.properties = function() {
    return Object.getOwnPropertyNames(this);
}

var allElements = [];

object.addToElementList = function(arr) {
    if(!arr) {
        arr = allElements;
    }
    
    for(var i = 0; i < this.childNodes.length; i++) {
        if(this.childNodes[i].tagName) {
            arr.push(this.childNodes[i]);
            this.childNodes[i].addToElementList();
        }
    }
}

loop(function() {
    document.addToElementList();
});

loop(function() {
    for(var i = 0; i < allElements.length; i++) {
        var styles = $("body").style.properties();
        for(var s = 0; s < styles.length; s++) {
            if(allElements[i].tagName && allElements[i][styles[s]]) {
                allElements[i]["style"][styles[s]] = allElements[i][styles[s]];
            }
        }
        for(var e = 0; e < Event.events.length; e++) {
            if(allElements[i][Event.events[e]]) {
                allElements[i]["on" + Event.events[e]] = allElements[i][Event.events[e]];
            }
        }
    }
});

function XHR(path, callback) {
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            callback(xhr.response);
        }
    };
    
    xhr.open("GET", path, true);
    xhr.send();
}

funciton Json(str) {
    return JSON.parse(str);
}

object.s = function(obj) {
    for(var i = 0; i < obj.properties().length; i++) {
        this.style[obj.properties()[i]] = obj[obj.properties()[i]];
    }
}

function include(src) {
    var script = [];
    
    for(var i = 0; i < src.length; i++) {
        if(typeof src[i] === "string") {
            if(src[i].indexOf("http") > -1 && navigator.onLine == false) {
                return;
            }
            
            var js = $("body").create("script");
            js.src = src[i];
            script.push(js);
        }
    }
    
    return script;
}
