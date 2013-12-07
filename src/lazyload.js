define([
    'dojo/_base/lang',
    'dojo/window',
    'dojo/dom-geometry',
    'dojo/dom-construct',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dojo/on',
    'dojo/topic',
    'dojo/NodeList'
], function(
    lang,
    win,
    geometry,
    domConstruct,
    domAttr,
    domStyle,
    on,
    topic,
    NodeList
) {
    'use strict';

    var matchMedia = window.matchMedia || function () {
            return true;
        },
        isInsideFold = function (elemPosition, winPosition, delta) {
            var elemTop = elemPosition.t - delta,
                elemBottom = elemPosition.b + delta,
                elemTopInsideFold = elemTop >= 0 && elemTop <= winPosition.b,
                elemBottomInsideFold = elemBottom >= 0 && elemBottom <= winPosition.b;

            if(elemTopInsideFold || elemBottomInsideFold) {
                return true;
            }

            return false;
        },
        lazyload = function(nodelist, opts) {

            var defaults = {
                    threshold: 0,
                    srcAttr: 'data-lazyload-original',
                    mediaAttr: 'data-lazyload-media',
                    fx: null
                },
                options = lang.mixin(defaults, opts),
                _elems,
                _scrollHandler;

            if (nodelist instanceof HTMLElement) {
                _elems = new NodeList(nodelist);
            } else if (nodelist instanceof NodeList) {
                _elems = nodelist;
            } else {
                throw 'First argument should be an HTMLElement or an instance of dojo/NodeList';
            }

            function _onScroll() {
                var winCoords;

                if (!_elems.length) {
                    return;
                }

                winCoords = win.getBox();
                winCoords.b = winCoords.t + winCoords.h;

                _elems = _elems.filter(function (imageNode) {
                    var media = domAttr.get(imageNode, options.mediaAttr) || '',
                        elemPosition = geometry.position(imageNode);

                    elemPosition.t = elemPosition.y;
                    elemPosition.b = elemPosition.t + elemPosition.h;

                    if (matchMedia(media).matches && isInsideFold(elemPosition, winCoords, options.threshold)) {
                        _loadImage(imageNode);
                        return false;
                    }

                    return true;
                });

                if (!_elems.length) {

                    // stop listening events
                    destroyMe();
                }
            }

            function _loadImage(imageNode) {
                var effect;

                if (domAttr.has(imageNode, options.srcAttr)) {
                    imageNode.src = domAttr.get(imageNode, options.srcAttr);

                    if(options.fx) {
                        effect = options.fx.call(imageNode);
                        on.once(imageNode, 'load', function() {
                            effect.play();
                        });
                    }
                }

            }

            function destroyMe() {
                _scrollHandler.remove();
            }

            _scrollHandler = on(window, 'scroll, resize', _onScroll);
            _onScroll();

            return {
                destroy: destroyMe
            };

        };

    lang.extend(NodeList, {

        lazyload: function(opts) {
            var handler = lazyload(this, opts);
            this.destroy = handler.destroy;
            return this;
        }

    });

    return lazyload;

});
