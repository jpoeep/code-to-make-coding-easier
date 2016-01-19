var object = Object.prototype;

object.css = function(style, value) {
    if(value) {
        eval("this.style." + style + " = '" + String(value) + "'");
    }
    return eval("this.style." + style);
}

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

object.on = function(event) {
    var target = this;
    
    on.do = function(func) {
        target.addEventListener(event, func);
    };
    
    return on;
}

object.within = function(parentString, caseSensitive) {
    if(caseSensitive == true) {
        if(parentString.indexOf(this) > -1) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        if(parentString.toLowerCase().indexOf(this.toLowerCase()) > -1) {
            return true;
        }
        else {
            return false;
        }
    }
}

object.chunk = function(pos1, pos2) {
    var str = "";
    pos1 -= 1;
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

function update(oldFunc, newFunc) {
    if(oldFunc) {
        oldFunc = newFunc; // sets old function to the updated and changed iteration
    }
}

update(object.startFrom, object.startAfter);

function $(targetName) {
    var begin = targetName.chunk(1, 1);
    var rest = targetName.chunk(2, targetName.length);
    var obj;
    switch(begin) {
        default:
            var amount = document.getElementsByTagName(targetName);
            obj = amount[amount.length - 1];
            break;
        case ".":
            var classAmount = document.getElementsByClassName(rest);
            obj = classAmount[classAmount.length - 1];
            break;
        case "#":
            obj = document.getElementById(rest);
            break;
    }
    return obj;
}

function ElementNode(tagName, func) {
    var tagCheck = setInterval(function() {
        var tag = document.getElementsByTagName(tagName);
        if(tag.length) {
            for(var i = 0; i < tag.length; i++) {
                func(tag[i]);
            }
            clearInterval(tagCheck);
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
