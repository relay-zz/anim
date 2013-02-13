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

var anim = function(A) {
"use strict";

A = function(n, g, t, e) {
  if(n.charAt) n = document.getElementById(n);

  var a, o, c,
    q = [],
    cb = function(i) {
      if(i = q.shift()) i[1] ? A.apply(this, i).anim(cb) : i[0]()
    },
    cb1 = cb;

  for(a in g) {
    o = g[a];

    if(!o.to && o.to !== 0) o = {to: o};  //shorthand

    A.defs(o, n, a, e);  //set defaults
    A.iter(o, /color/i.test(a) ? A.fx.color : (A.fx[a] || A.fx._), t*1000, cb1);
    cb1 = 0
  }

  return {
    anim: function() {
      q.push([].slice.call(arguments));
      return this
    }
  }
};

A.defs = function(o, n, a, e, s) {
  s = n.style;
  //if(!a in s && (A.pf || A._pf(s, a)) in s) a = A.pf + a;  //prefix matching
  o.a = a;
  o.n = n;
  o.s = (a in s) ? s : n;  //n.style||n
  if(e) o.e = e;

  o.fr = o.fr || (o.fr === 0 ? 0 :
        o.s == n ? n[a] :
        (window.getComputedStyle ? getComputedStyle(n, null) : n.currentStyle)[a]);

  o.u = /\D+$/.exec(o.fr) || /\D+$/.exec(o.to) || 0
};

//A._pf = function(s, a, p, i, j) {
//  p = A._pf.p;
//  for(i=0; j=p[i++];) if(j + a in s) return A.pf = j;
//};
//A._pf.p = ["-webkit-","-ms-","-moz-","-o-"];

A.iter = function(o, fn, t, cb) {
  var i, p,
    e = o.e,
    z = +new Date + t,

  _ = function() {
    i = z - new Date().getTime();

    if(i < 50) return o.p = 1, fn(o, o.n, o.to, o.fr, o.a, o.e), cb && cb();

    p = i/t;
    if(e == "lin") {
      p = 1 - p

    } else if(e == "ease") {
      p = (0.5 - p)*2;
      p = 1 - ((p*p*p - p*3) + 2)/4

    } else if(e == "ease-in") {
      p = 1 - p;
      p = p*p*p

    } else {  //ease-in-out
      p = 1 - p*p*p
    }
    o.p = p;
    fn(o, o.n, o.to, o.fr, o.a, o.e);
    setTimeout(_, 50)
  }
  _();
};

A.fx = {
  _: function(o, n, to, fr, a, e) {
    fr = parseFloat(fr),
    to = parseFloat(to),
    o.s[a] = (o.p >= 1 ? to : (o.p*(to - fr) + fr)) + o.u
  },

  width: function(o, n, to, fr, a, e) {
    if(isNaN(o._fr))
      o._fr = !isNaN(fr = parseFloat(fr)) ? fr : a == "width" ? n.clientWidth : n.clientHeight;
    A.fx._(o, n, to, o._fr, a, e)
  },

  opacity: function(o, n, to, fr, a, e) {
    if(isNaN(fr = fr || o._fr))
      fr = n.style,
      fr.zoom = 1,
      fr = o._fr = (/alpha\(opacity=(\d+)\b/i.exec(fr.filter) || {})[1]/100 || 1;
    fr *= 1;
    to = (o.p*(to - fr) + fr);
    n = n.style;
    if(a in n) {
      n[a] = to
    } else {
      n.filter = to >= 1 ? "" : "alpha(" + a + "=" + Math.round(to*100) + ")"
    }
  },

  color: function(o, n, to, fr, a, e, i, v) {
    if(!o.ok) {
      to = o.to = A.toRGBA(to);
      fr = o.fr = A.toRGBA(fr);
      if(to[3] == 0) to = [].concat(fr), to[3] = 0;
      if(fr[3] == 0) fr = [].concat(to), fr[3] = 0;
      o.ok = 1
    }

    v = [0, 0, 0, o.p*(to[3] - fr[3]) + 1*fr[3]];
    for(i=2; i>=0; i--) v[i] = Math.round(o.p*(to[i] - fr[i]) + 1*fr[i]);

    if(v[3] >= 1 || A.rgbaIE) v.pop();

    try {
      o.s[a] = (v.length > 3 ? "rgba(" : "rgb(") + v.join(",") + ")"
    } catch(e) {
      A.rgbaIE = 1
    }
  }
};
A.fx.height = A.fx.width;

A.RGBA = /#(.)(.)(.)\b|#(..)(..)(..)\b|(\d+)%,(\d+)%,(\d+)%(?:,([\d\.]+))?|(\d+),(\d+),(\d+)(?:,([\d\.]+))?\b/;
A.toRGBA = function(s, v) {
  v = [0, 0, 0, 0];
  s.replace(/\s/g, "").replace(A.RGBA, function(i, a,b,c, f,g,h, l,m,n,o, w,x,y,z) {
    var h = [a+a||f, b+b||g, c+c||h], p = [l, m, n];

    for(i=0; i<3; i++) h[i] = parseInt(h[i], 16), p[i] = Math.round(p[i]*2.55);

    v = [h[0]||p[0]||w||0,  h[1]||p[1]||x||0,  h[2]||p[2]||y||0,  o||z||1]
  });
  return v
};

return A
}();

