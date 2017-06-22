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
    coords: "unavailable",
    target: "unavailable"
};

document.onmousemove = function(e) {
    Mouse.coords = [e.pageX, e.pageY];
    Mouse.target = e.target;
};

Mouse.click = function(x, y) {
    Mouse.target.click();
    Mouse.target.focus();
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

function Animation(func, speed) {
  var stopAnim = 0;
  
  var a = this;
  
  if(!this.speed) {
    this.speed = 0;
  }
  
  this.start = function() {
      stopAnim = 0;

      function init(time) {
          if(stopAnim === 0) {
              func(time * a.speed);
              requestAnimationFrame(init);
          }
      }

      requestAnimationFrame(init);
  };

  this.stop = function() {
      stopAnim = 1;
  };
}

if(!watch) {
    object.watch = function(prop, func) {
        var t = this;
        var prevVal = this[prop];

        loop(function() {
            if(prevVal !== t[prop]) {
                func({
                    oldValue: prevVal,
                    value: t[prop]
                });
                prevVal = t[prop];
            }
        });
    };
}

/* Here's an example of .watch()
Mouse.watch("coords", function(e) {
  console.log([e.oldValue, e.value]);
  console.log("Do something once mouse position has changed"); onmousemove should be used for this but this is an example
});*/

object.each = function(cb) {
    for(var i = 0; i < this.length; i++) {
        cb(this[i]);
    }
};

/* Example code:
document.body.childNodes.forEach(function(children) {
    console.log(children.tagName); this would log the tagName of every childNode in the body
});
*/

Array.prototype.swap = function(num1, num2) {
    var temp = this[num1];
    this[num1] = this[num2];
    this[num2] = temp;
    return this;
};

//[1, 2].swap(0, 1); returns [2, 1]
//document.all.swap(3, 1); returns document.all with the 4th and 2nd value swapped

Object.prototype.watchValue = function(prop, cb) {
    let tar = this;
    
    let valCheck = new loop(() => {
        if(tar["old" + prop] != tar[prop]) {
            cb(tar[prop]);
        }
        
        else if(tar["old" + prop] == tar[prop]) {
            return;
        }
    });
};

Element.prototype.move = function(x, y) {
    this.s({
        transform: "translate(" + (-this.offsetLeft + x) + "px, " + (-this.offsetTop + y) + "px)"
    });
};

String.prototype.splitEvery = function(n) {
    var arr = []

    for(var i = 0; i < Math.ceil(this.length / n); i++) {
        arr.push(this.substring(i * n, i * n + n))
    }

    return arr
}

function transitionColorArr(obj) {
    this.c1 = obj.c1
    this.c2 = obj.c2
    this.steps = obj.steps
    function convert(val) {
        if(typeof val == "string") {
            var arr = val.splitEvery(2)
      
            for(let i in arr) {
                arr[i] = parseInt(arr[i], 16)
            }
      
            return arr
        }
    
        else if(Array.isArray(val) === true) {
            for(let i in val) {
                val[i] = Math.round(Math.pow(16, 2) * (val[i] / 255)).toString(16)
                if(String(val[i]).length == 1) {
                    val[i] = "0" + val[i]
                }
            }
      
            return val.join("")
        }
    }

    if(obj.steps >= 2) {
        var arr = []
        arr[0] = obj.c1
        arr[obj.steps - 1] = obj.c2

        for(let i = 1; i < obj.steps - 1; i++) {
            var prev = arr[i - 1]

            var dif = {
                r: (convert(obj.c2)[0] - convert(obj.c1)[0]) / obj.steps,
                g: (convert(obj.c2)[1] - convert(obj.c1)[1]) / obj.steps,
                b: (convert(obj.c2)[2] - convert(obj.c1)[2]) / obj.steps
            }

            var r = convert(prev)[0] + dif.r
            var g = convert(prev)[1] + dif.g
            var b = convert(prev)[2] + dif.b

            arr[i] = convert([r, g, b])
        }

        return arr
    }
}
