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

object.css = function(property, value) {
    if(property[0] === ":") {
        var style = document.head.create("style");
        style.innerHTML = this.tagName.toLowerCase() + property + " {" + value + "}";
        return value;
    }
    else {
        eval("this.style." + property + " = '" + value + "'");
        return eval("this.style." + property);
    }
}

object.on = function(event) {
    var target = this;
    
    on.do = function(func) {
        target.addEventListener(event, func);
    };
    
    return on;
}

object.within = function(parentString, caseSensitive) {
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

object.startAfter = function(string, pos) { // a function to break down a string in segments based off of string arg
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

function update(oldVal, newVal) {
    if(oldVal) {
        oldVal = newVal; // sets old function to the updated and changed iteration
    }
}

update(startFrom, startAfter);

object.$ = function(targetName) {
    if(this.tagName) {
        return this.querySelectorAll(targetName);
    }
    else {
        return document.querySelectorAll(targetName);
    }
}

function loop(func, delay) {
    delay *= 1000;
    
    function action() {
        func();
        
        setTimeout(action, delay);
    }
    
    action();
    
    action.stop = function() {
        action = null;
    }
    
    return action;
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

function pull(url) {
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

update(object.in, object.within);

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
    if(!fade.color) {
        fade.color = "black";
    }
    if(!fade.time) {
        fade.time = 1;
    }
    if(!fade.opacity) {
        fade.opacity = 1;
    }
    
    var fadeLayer = this.create("div");
    fadeLayer.css("position", "absolute");
    fadeLayer.css("left", "0px");
    fadeLayer.css("top", "0px");
    fadeLayer.css("width", "100%");
    fadeLayer.css("height", "100%");
    fadeLayer.css("opacity", "0");
    fadeLayer.css("background", fade.color);
    fadeLayer.css("transition", "opacity " + fade.time + "s");
    
    setTimeout(function() {
        fadeLayer.css("opacity", fade.opacity);
    }, 0);
}

object.fadeOut = function(fade) {
    for(var i = 0; i < $("body")[0].$(".fadeLayer").length; i++) {
        var parent = this;
        var layer = this.$(".fadeLayer")[i];
        if(!fade) {
            fade = new Object();
        }
        if(!fade.time) {
            fade.time = layer.time;
        }
        if(!fade.opacity) {
            fade.opacity = 0;
        }
        if(fade.opacity > layer.opacity) {
            fade.opacity = 0;
        }
        
        layer.css("transition", "opacity " + fade.time + "s");
        
        setTimeout(function() {
            layer.css("opacity", String(fade.opacity));
            
            setTimeout(function() {
                parent.removeChild(layer);
            }, fade.time * 1000);
        }, 0);
    }
}
