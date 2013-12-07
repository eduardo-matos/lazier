define([
    'dojo/_base/fx',
    'dojo/dom-style'
], function (
    fx,
    domStyle
) {
    'use strict';

    return function () {
        domStyle.set(this, 'opacity', '0');
        return fx.fadeIn({
            node: this,
            duration: 200
        });
    };

});
