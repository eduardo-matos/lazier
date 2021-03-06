# Lazier
[Dojo](http://dojotoolkit.org/) lazyload module that also works with media queries (when supported by the browser). You'll never need to load a big image on mobile ever again!

### Getting Started

The HTML:

```html
<!-- the 'src' attribute of this image is a transparent gif. It's inline to avoid an HTTP request -->
<img
    data-lazyload-original="img.gif"
    src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
>

<!-- with media query constraint -->
<img
    data-lazyload-original="img.gif"
    data-lazyload-media="screen and (min-width: 300px)"
    src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
>

<!-- with multiple media query constraints -->
<img
    data-lazyload-original="img.gif, img2.gif"
    data-lazyload-media="screen and (max-width: 500px), screen and (max-width: 1200px)"
    src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
>

<!-- with fallback image (when none of the media queries match) -->
<img
    data-lazyload-original="img.gif, img2.gif"
    data-lazyload-media="screen and (max-width: 500px)"
    src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
>
```

The JavaScript:

```javascript
require(['lazier/lazyload', 'dojo/dom', 'dojo/query'], function (lazyload, dom, query) {

    // Apply directly to a dom node
    lazyload(dom.byId('lazy'));

    // Apply to a nodelist
    lazyload(query('.lazy'));

    // Apply directly from a nodelist
    query('.lazy').lazyload();

});
```

Destroying lazyload. It'll prevent the images from being loaded.

```javascript
require(['lazier/lazyload', 'dojo/query'], function (lazyload, query) {

    var handle = query('.lazy').lazyload();
    // ...
    handle.destroy();
});
```

Loading images before you reach them.

```javascript
require(['lazier/lazyload', 'dojo/query'], function (lazyload, query) {

    query('.lazy').lazyload({
        threshold: 200
    });
});
```

You can also use you own effects when loading the images. It's a function that receives the dom being loaded as the `this` variable, and should return any object with a play function (which will be executed when then dom is loaded).

```javascript
require(['lazier/lazyload', 'dojo/query', 'lazier/effects/fade', 'dojo/fx'], function (lazyload, query, fade, fx) {

    // Builtin lazier effect
    query('.lazy').lazyload({
        fx: fade
    });

    // Dojo effect
    query('.lazy').lazyload({
        fx: function () {
            return fx.wipeIn({
                node: this,
                duration: 300
            })
        }
    });

    // Custom effect
    query('.lazy').lazyload({
        fx: function () {
            var node = this;

            // loading image...
            node.style.opacity = 0;

            return {

                // image loaded!
                play: function () {
                    node.style.opacity = 0.5;
                }
            }
        }
    });
});
```

#### Options
**threshold _(int)_**: Load images before you reach them. It's an integer number of pixels.

**srcAttr _(string)_**: Name of the attribute that will hold the original image address.

**mediaAttr _(string)_**: Name of the attribute that will hold the media query to decide if the image have to be loaded.

**fx _(function)_**: Function that receives the node that is being loaded (as the `this` variable). This function must have a `play` property which must also be a function that is executed right after the image is loaded.

### Tests
First create a webserver. You might use python (`python -m SimpleHttpServer 8080`) or PHP (`php -S localhost:8080`). Then head to `http://localhost:8080/test/SpecRunnerJasmine.html`.

### Contributing
Feel free to open an issue to mention any bug or sugest an improvement. You're more than welcome to send me pull request fixing any bugs or adding unit tests =)
