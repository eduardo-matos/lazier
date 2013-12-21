define([
    'dojo/_base/lang',
    'dojo/_base/array',
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
    array,
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
                    var mediaList = (domAttr.get(imageNode, options.mediaAttr) || '').split(/\s*,\s*/),
                        elemPosition = geometry.position(imageNode),
                        srcList,
                        currentSrc;

                    elemPosition.t = elemPosition.y;
                    elemPosition.b = elemPosition.t + elemPosition.h;

                    if (isInsideFold(elemPosition, winCoords, options.threshold)) {
                        srcList = domAttr.get(imageNode, options.srcAttr).split(/\s*,\s*/);
                        currentSrc = _getFirstMatchingSrcByMediaList(srcList, mediaList);

                        if(currentSrc) {
                            _loadImage(imageNode, currentSrc);
                        }
                        return false;
                    }

                    return true;
                });

                if (!_elems.length) {

                    // stop listening events
                    destroyMe();
                }
            }

            function _getFirstMatchingSrcByMediaList (srcList, mediaList) {
                var src;

                // No configured media. Return first image
                if(!mediaList[0]) {
                    return srcList[0];
                }

                // First try: get src with same index of the first matching media
                array.forEach(mediaList, function (media, index) {
                    if(matchMedia(media).matches) {
                        src = srcList[index];
                        return false;
                    }
                });

                if(src) {
                    return src;
                }

                // Second try: if srcList length is greater than mediaList length, then we have a fallback src
                if(srcList.length > mediaList.length) {
                    return srcList[mediaList.length];
                }
            }

            function _loadImage(imageNode, src) {
                var effect;

                imageNode.src = src;

                if(options.fx) {
                    effect = options.fx.call(imageNode);
                    on.once(imageNode, 'load', function() {
                        effect.play();
                    });
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
