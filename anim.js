/** Copyright 2013 mocking@gmail.com * http://github.com/relay/anim

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

// Usage:
// anim(node, styleNameCamelCase, newSize, timeSeconds[, easingFunction, oldSize])
//
// anim(document.getElementById("box"), "height",  300, 2);
// anim(box, "height",     300,    2,   "ease-in");
// anim(box, "height",     "14em", 2,   "ease-in");
// anim(box, "height",     14,     2,   "ease-in", "12px");
// anim(box, "marginLeft", "2%",   2,   "ease-out");
// anim(box, "padding",    "30px", 1.5, "lin",    10);
// anim(document.body, "scrollTop", 500, 5);
// anim(box, "height", 300, 2).then(function() { anim(box, "width", 300, 2) });

function anim(node, prop, to, duration, ease, from) { 
  duration *= 1000;  //to milliseconds

  var style = prop in (node.style || {}),
    end = +new Date + duration,  //when animation should end
    unit, remain, percent, callback, plugin, context;

  //search through our list of plugins
  remain = prop.toLowerCase();
  for(var i in anim.fx) {
    if(remain.indexOf(i) >= 0) {
      plugin = anim.fx[i];
      break
    }
  }

  from = from || from === 0 ? 0 :
          !style ? node[prop] :
          node.currentStyle ? node.currentStyle[prop] :
          getComputedStyle(node, null)[prop];

  unit = /\D+$/.exec(from) || /\D+$/.exec(to) || 0;

  if(!plugin) {
    from = parseFloat(from);
    if(isNaN(from))  //from == "auto" || "inherit" || "none"
      from = prop == "width" ? node.clientWidth : 
            prop == "height" ? node.clientHeight : 0
  }

  to = plugin ? to : parseFloat(to);

  if(plugin) context = {n:node, to:to, from:from, p:percent, prop:prop, u:unit};

  style = style ? node.style : node;

  var repeat = function() {
    remain = end - new Date().getTime();

    if(remain < 50) {
      if(plugin) {
        context.p = 1;
        plugin(context)
      } else {
        style[prop] = unit ? to + unit : to;
      }
      if(callback) callback();
      return
    }

    percent = remain/duration;

    if(ease == "lin") {
      percent = 1 - percent

    } else if(ease == "ease") {
      percent = (0.5 - percent)*2;
      percent = 1 - ((percent*percent*percent - percent*3) + 2)/4

    } else if(ease == "ease-in") {
      percent = 1 - percent;
      percent = percent*percent*percent

    } else {  //ease-in-out
      percent = 1 - percent*percent*percent
    }
    if(plugin) {
      context.p = percent;
      plugin(context)
    } else {
      style[prop] = (percent*(to - from) + from) + unit
    }

    setTimeout(repeat, 50)
  }
  repeat();

  return {  //used to add a callback
    then: function(cb) {callback = cb}
  }
}
anim.fx = {
  rgba: /#(.)(.)(.)\b|#(..)(..)(..)\b|(\d+)%,(\d+)%,(\d+)%(?:,([\d\.]+))?|(\d+),(\d+),(\d+)(?:,([\d\.]+))?\b/,

  strToRGBA: function(str, val) {
    val = [0, 0, 0, 0];
    str.replace(/\s/g,"").replace(anim.fx.rgba,
    function(_, h1,h2,h3, h4,h5,h6, p1,p2,p3,p4, d1,d2,d3,d4) {
      var h = [h1 + h1 || h4, h2 + h2 || h5, h3 + h3 || h6],
          p = [p1, p2, p3];

      for(var i=0;i<3;i++) h[i] = parseInt(h[i], 16), p[i] = Math.round(p[i]*2.55);

      val = [
        h[0] || p[0] || d1 || 0,
        h[1] || p[1] || d2 || 0,
        h[2] || p[2] || d3 || 0,
        d4 || p4 || 1
      ]
    });
    return val
  },

  opacity: function(context) {
    var node = context.n.style,
    from = context.from*1,
    to = (context.p*(context.to - from) + from),
    prop = context.prop;
    if(prop in node) {
      node[prop] = to
    } else {
      to = to >= 1 ? "" : "alpha(" + prop + "=" + Math.round(to*100) + ")";
      node.filter = to
    }
  },

  color: function(context) {
    var A = anim,
      node = context.n,
      to = context.to,
      from = context.from,
      percent = context.p,
      prop = context.prop;

    if(!context.init) {
      to = context.to = A.fx.strToRGBA(to);
      from = context.from = A.fx.strToRGBA(from);

      if(to[3] == 0) to = [].concat(from), to[3] = 0;
      if(from[3] == 0) from = [].concat(to), from[3] = 0;

      context.init = 1
    }

    var value = [0, 0, 0, percent*(to[3] - from[3]) + 1*from[3]];
    for(var i=2; i>=0; i--) value[i] = Math.round(percent*(to[i] - from[i]) + 1*from[i]);

    if(value[3] == 255 || A.rgbaIE) value.pop();

    try {
      node.style[prop] = (value.length > 3 ? "rgba(" : "rgb(") + value.join(",") + ")"
    } catch(e) {
      A.rgbaIE = 1
    }
  }
};
