anim
====

Anim is a tiny and bare bones animation library weighing in at [`7 KB`](https://raw.github.com/relay/anim/master/anim.js) in plain code, **[`2.8 KB`](https://raw.github.com/relay/anim/master/anim.min.js)** when minified and **`1.5 KB`** when gzipped.

Why Anim? Because sometimes if you only want a little animation, you may not want to pull in a full fledged library like jQuery which is `90 KB` minified and `32 KB` gzipped.

Anim can animate any property that accepts number and color values including but not limited to backgroundColor, opacity, width, scrollTop, etc.

demo
=====
http://relay.github.com/anim_demo.html

features
=====
* Simple chaining syntax ``anim(---).anim(---).anim(---)``
* 3 easing functions
* shorthand syntax ``anim("div1", {opacity: 0.6}, 2)``

usage:
=====
``anim(node, properties, duration, ease*)``
or ``anim(delay)``
or ``anim(callbackFunction)``

* **node**: the node to animate, or the node's ID
* **properties**: a map of CSS properties to animate (see below)
* **duration**: time in seconds to run animation. e.g., 3.5 is 3.5 seconds
* **ease** (optional): easing function name. Choose from "ease-in", "ease" (means: ease-in-out), "lin" (means: linear), and undefined means "ease-out". The individual easing properties will override this.
* **delay** how long to wait before starting the next animation
* **callbackFunction** function to call after animation finished

The ``properties`` object takes the form of:

``{cssName: endValue}`` or ``{cssName: {to:endValue, fr:startValue*, e:easingFunction*, u:units*}}``


* **cssName**: the css property to animate; written in camelCase (margin-left --> marginLeft)
* **to**: the end value of the CSS property. Can be number or string with optional units. e.g., 100, "100px", "50%", "3em"
* **fr** (optional): the starting value of the CSS property. If not supplied, it is read from the node
* **e** (optional): easing function name. (see above)
* **u** (optional): unit of measurement. e.g., px, %, pt

This function returns an object with one method ("anim"), which allows you to start another animation after the first one is done. If that second function is called with one parameter, it is assumed to be a callback function and is called after the last animation is done.

examples:
=====
    anim(box, {opacity: {to: 0.2, fr: 1}},     2);  //long form specifying 'to' and 'from'
    anim(box, {opacity: 0.2},                    2);
    anim(box, {height:  300},                    2,    "ease-in");
    anim(box, {height:  "14em",  width: "14em"}, 2);
    anim(box, {marginLeft: "2%", fontSize: "20px"}, 2, "ease-out");
    anim(document.body, {scrollTop: 500},   5,    "lin");

run 2 animations one after the other

    anim(box, {height:300}, 2)
      .anim(box, {width:300}, 2)
      .anim(function() { alert("all done") });
 
run 2 animations with a 1 second delay in between

    anim(box, {height:300}, 2)
      .anim(1)
      .anim(box, {width:300}, 2);


support:
=====
Supports IE6+, Firefox 2+, Chrome, iOS, Android

If ``requestAnimationFrame`` is available it is used, which provides the highest frame rate and throttling if the CPU is busy or if another tab is focused.
