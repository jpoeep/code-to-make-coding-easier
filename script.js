Object.prototype.$ = function(targetName) {
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

Object.prototype.create = function(element, props) {
  if(this.tagName) {
    var obj = document.createElement(element);
    this.appendChild(obj);

    if(props && typeof props == "object") {
      for(var i in Object.keys(props)) {
        var prop = Object.keys(props)[i]
        obj[prop] = props[prop]
      }
    }

    return obj;
  }
};

function loop(func, delay) {
    if(!delay) {
        delay = 0;
    }
    function action() {
        func();

        setTimeout(action, delay);
    };

    action();

    this.stop = function() {
        action = null;
    };
}

Object.prototype.props = function() {
    var arr = []
    
    for(let i in this) {
        arr.push(i)
    }
    
    return arr
};

Object.prototype.s = function(obj) {
  if(obj) {
    for(var i in Object.keys(obj)) {
      this.style[i] = obj[i];
    }
  }
};

Object.prototype.css = function(prop) {
  return getComputedStyle(this).getPropertyValue(prop)
};

/*Object.prototype.toggle = function(tog1, tog2) {
  this = tog1;
};*/

Object.prototype.toggleClass = function(cls) {
  if(!this.className || this.className !== cls) {
    if(this.className !== cls) {
      this.prevClass = this.className;
    }

    this.className = cls;
  }

  else if(this.className === cls) {
    if(this.prevClass) {
      this.className = this.prevClass;
    }

    else {
      this.className = null;
    }
  }
};

Object.prototype.arrToBase64 = function(type) {
  var bin = "";
  var bytes = new Uint8Array(this);

  for(var i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }

  return "data:" + type + ";base64," + btoa(bin);
};

Element.prototype.delete = function() {
  this.parentNode.removeChild(this);
};

Object.prototype.toArray = function() {
  let arr = [];

  for(let i = 0; i < this.length; i++) {
    arr.push(this[i]);
  }

  return arr;
};

Element.prototype.move = function(x, y) {
  this.s({
    transform: "translate(" + (-this.offsetLeft + x) + "px, " + (-this.offsetTop + y) + "px)"
  });
};

Function.prototype.repeat = function(times) {
  for(let i = 0; i < times; i++) {
    this();
  }
};

Object.prototype.fileToBase64 = function(cb) {
  var file = this
  var read = new FileReader()

  read.onload = function() {
    cb(read.result.arrToBase64(file.type))
  }

  read.readAsArrayBuffer(this)
}

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
        val[i] = Math.round(Math.pow(16, 2) * (val[i] / 256)).toString(16)
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
