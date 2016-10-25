var object = Object.prototype;

object.create = function(element, props) {
    if(this.tagName) {
        var obj = document.createElement(element);
        this.appendChild(obj);
        
        for(var i = 0; i < Object.getOwnPropertyNames(obj).length; i++) {
            var prop = Object.getOwnPropertyNames(obj)[i];
            obj[prop] = props[prop];
        }
        
        return obj;
    }
};

object.css = function(prop) {
    return getComputedStyle(this).getPropertyValue(prop).split(", ");
};

object.on = function(evt, func) {
    evt = evt.split(" ");
    for(var i = 0; i < evt.length; i++) {
        this[on + evt[i]] = func;
    }
};

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
};

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

function ElementNode(tagName, action) {
    var tagCheck = loop(function() {
        var tag = document.getElementsByTagName(tagName);
        if(tag.length) {
            for(var i = 0; i < tag.length; i++) {
                for(var a = 0; a < action.length; a++) {
                    if(typeof action[a] === "object" && Object.getOwnPropertyNames(action[a]).length) {
                        for(var e = 0; e < Object.getOwnPropertyNames(action[a]).length; e++) {
                            var prop = Object.getOwnPropertyNames(action[a])[e];
                            tag[i][prop] = action[a][prop];
                        }
                    }
                    
                    else if(typeof action[a] === "function") {
                        action[a](tag[i]);
                    }
                }
            }
            
            tagCheck.stop();
        }
    }, 0);
}

object.html = function(str) {
    if(!str) {
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
    
    else if(str) {
        if(this == document) {
            document.documentElement.innerHTML = str;
        }
        
        else if(this != document && this.tagName){
            this.innerHTML = str;
        }
    }
};

Storage.prototype.remove = function(valName) {
    if(this.getItem(valName)) {
        this.setItem(valName, null);
    }
};

object.clone = function(node) {
    if(this.tagName && node.tagName) {
        var clone = node.cloneNode();
        this.appendChild(clone);
        
        return clone;
    }
};

object.properties = function() {
    return Object.getOwnPropertyNames(this);
};

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

object.s = function(obj) {
    for(var i = 0; i < obj.properties().length; i++) {
        this.style[obj.properties()[i]] = obj[obj.properties()[i]];
    }
}

object.textNodes = function() {
    var text = [];
    
    for(var i = 0; i < this.querySelectorAll("*").length; i++) {
        var cur = this.querySelectorAll("*")[i];
        
        for(var e = 0; e < cur.childNodes.length; e++) {
            if(cur.childNodes[e].nodeType == 3) {
                text.push(cur.childNodes[e]);
            }
        }
    }
    
    return text;
};

var Mouse = {
    location: []
};

document.onmousemove = function(e) {
    Mouse.location[0] = e.pageX;
    Mouse.location[1] = e.pageY;
    Mouse.target = e.target;
};

Mouse.click = function(x, y) {
    if(!x) {
        Mouse.target.click();
        Mouse.target.focus();
    }
    
    else if(x && y && typeof (x && y) === "number") {
        document.elementFromPoint(x, y).click();
        document.elementFromPoint(x, y).focus();
    }
    
    else if(typeof x === "object" && x.tagName) {
        x.click();
        x.focus();
    }
};

function repeat(func, times) {
    for(var i = 0; i < times; i++) {
        func();
    }
}

object.ready = function(callback) {
    this.onload = callback;
};

object.toggle = function(prop, arr) {
    if(typeof arr === "string" || typeof arr === "number" || (typeof arr === "object" && arr.length == 1)) {
        if(typeof arr === "object") {
            arr = arr[0];
        }
        
        if(this[prop] && this[prop] != arr) {
            this["prev" + prop] = this[prop];
        }
        
        if(this[prop] == arr) {
            this[prop] = this["prev" + prop];
        }
        
        else if(this[prop] == this["prev" + prop]) {
            this[prop] = arr;
        }
    }
    
    else {
        if(this[prop] == arr[0]) {
            this[prop] = arr[1];
        }
        
        else if(this[prop] == arr[1]) {
            this[prop] = arr[0];
        }
        
        else {
            this[prop] = arr[0];
        }
    }
};

object.toggleClass = function(cls1, cls2) {
    if(cls1 && !cls2) {
        if(this.className && this.className !== cls1) {
            this.prevClass = this.className;
        }
        
        if(this.className === cls1) {
            this.className = this.prevClass;
        }
        
        else {
            this.className = cls1;
        }
    }
    
    else if(cls1 && cls2) {
        if(this.className === cls1) {
            this.className = cls2;
        }
        
        else if(this.className === cls2) {
            this.className = cls1;
        }
        
        else {
            this.className = cls1;
        }
    }
};
