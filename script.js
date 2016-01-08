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
