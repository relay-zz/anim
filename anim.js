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
// anim(node, styleNameCamelCase, newSize, timeSeconds[, easingFunction, oldSize, units])
//
// anim(document.getElementById("box"), "height",  300, 2);
// anim(box, "height",     300,    2,   "ease-in");
// anim(box, "height",     "14em", 2,   "ease-in");
// anim(box, "height",     14,     2,   "ease-in", null, "em");
// anim(box, "marginLeft", "2%",   2,   "ease-out");
// anim(box, "padding",    "30px", 1.5, "lin",    10);
// anim(document.body, "scrollTop", 500, 5);
// anim(box, "height", 300, 2).then(function() { anim(box, "width", 300, 2) });

function anim(node, prop, to, duration, ease, from, unit) {
  duration *= 1000;

  var style = prop in (node.style || {}),
    end = +new Date + duration,
    remain, percent, callback;

  unit = unit || /\D+$/.exec(to) || 0;

  from = from || parseFloat(from === 0 ? 0 :
          !style ? node[prop] :
          node.currentStyle ? node.currentStyle[prop] :
          getComputedStyle(node, null)[prop]);

  if(isNaN(from)) {
    from = prop == "width" ? node.clientWidth : 
          prop == "height" ? node.clientHeight : 0;
  }

  to = parseFloat(to);

  style = style ? node.style : node;

  var repeat = function() {
    remain = end - new Date().getTime();

    if(remain < 50) {
      style[prop] = to + unit;
      if(callback) callback();
      return;
    }

    percent = remain/duration;

    if(ease == "lin") {
      percent = 1 - percent;

    } else if(ease == "ease") {
      percent = (0.5 - percent)*2;
      percent = 1 - ((percent*percent*percent - percent*3) + 2)/4;

    } else if(ease == "ease-in") {
      percent = 1 - percent;
      percent = percent*percent*percent;

    } else {
      percent = 1 - percent*percent*percent;
    }
    style[prop] = (percent*(to - from) + from) + unit;

    setTimeout(repeat, 50);
  }
  repeat();

  return {
    then: function(cb) {callback = cb}
  }
}
