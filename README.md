anim
====

Anim is a tiny and bare bones animation library weighing in at `2.5 KB` in plain code, `1.8 KB` when minified and `1 KB` when minified and gzipped.

Usage:
=====
``anim(node, properties, duration, ease)``

* **node**: the node to animate
* **properties**: a map of CSS properties to animate (see below)
* **duration**: time in seconds to run animation. e.g., 3.5 is 3.5 seconds

Optional parameters are:
* **ease**: easing function name. Choose from "ease-in", "ease" (means: ease-in-out), "lin" (means: linear), and undefined means "ease-out". This overrides the individual easing properties

``properties = {cssName: {to: endValue, fr: startValue, ease: easingFunction}}``

* **cssName**: the css property to animate
* **to**: the end value of the CSS property. Can be number or string with optional units. e.g., 100, "100px", "50%", "3em"
* **fr**: the starting value of the CSS property. If not supplied, it is read from the node
* **ease**: easing function name. (see above)

This function returns an object with one method ("then"), which allows you to add a callback function that is called after the animation is done.

Examples:
=====
    anim(box, {opacity:    {to: 0.2}},            2);
    anim(box, {height:     {to: 300}},            2, "ease-in");
    anim(box, {height:     {to: "14em"}, width:    {to: "14em"}}, 2);
    anim(box, {marginLeft: {to: "2%"},   fontSize: {to: "20pt"}}, 2,   "ease-out");
    anim(document.body,    {scrollTop: {to:500}}, 5, "lin");

    //run 2 animations one after the other
    anim(box, {height: {to: 300}}, 2).then(function() { anim(box, {width: {to:300}}, 2) });


Support:
=====
Supports IE6+, Firefox 2+, Chrome
