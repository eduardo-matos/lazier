define([
    'lazier/lazyload',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/on',
    'dojo/window',
    'dojo/dom-geometry'
],
function(
    lazyload,
    dc,
    query,
    on,
    win,
    geo
) {

    var body = document.body;

    describe('Lazyload', function() {
        it('should load the image if it\'s above the fold', function() {
            // arrange
            var elem = dc.place('<img data-lazyload-original="/test/spacer.gif">', body);

            // act
            var handler = lazyload(elem);

            // assert
            expect(query('img[src="/test/spacer.gif"]').length).toEqual(1);

            // cleanup
            dc.destroy(query('img[src="/test/spacer.gif"]')[0]);
            handler.destroy();
        });

        it('should not load the image if it\'s below the fold', function() {
            // arrange
            var elem = dc.place('<img data-lazyload-original="/test/spacer.gif" style="position: relative; top: 5000px;">', body);

            // act
            var handler = lazyload(elem);

            // assert
            expect(query('img[src="/test/spacer.gif"]').length).toEqual(0);

            // cleanup
            dc.destroy(elem);
            handler.destroy();
        });

        it('should load the image if threshold is enough', function() {
            // arrange
            var winHeight = win.getBox().h;
            var elem = dc.create('img', {
                'data-lazyload-original': '/test/spacer.gif',
                style: {
                    position: 'absolute',
                    top: winHeight + 200 + 'px'
                }
            }, body);

            // act
            var handler = lazyload(elem, {threshold: 200});

            // assert
            expect(query('img[src="/test/spacer.gif"]').length).toEqual(1);

            // cleanup
            dc.destroy(query('img[src="/test/spacer.gif"]')[0]);
            handler.destroy();
        });

        it('should not load the image if threshold is not enough', function() {
            // arrange
            var winHeight = win.getBox().h;
            var elem = dc.create('img', {
                'data-lazyload-original': '/test/spacer.gif',
                style: {
                    position: 'absolute',
                    top: winHeight + 201 + 'px'
                }
            }, body);

            // act
            var handler = lazyload(elem, {threshold: 200});

            // assert
            expect(query('img[src="/test/spacer.gif"]').length).toEqual(0);

            // cleanup
            dc.destroy(elem);
            handler.destroy();
        });

        it('should work with nodelist', function() {
            // arrange
            var elem1 = dc.place('<img data-lazyload-original="/test/spacer.gif">', body);
            var elem2 = dc.place('<img data-lazyload-original="/test/spacer.gif">', body);

            // act
            var nodelist = query('img[data-lazyload-original]');
            var handler = lazyload(nodelist);

            // assert
            expect(query('img[src="/test/spacer.gif"]').length).toEqual(2);

            // cleanup
            query('img[src="/test/spacer.gif"]').forEach(dc.destroy);
            handler.destroy();
        });

        it('should allow to remove handler from nodelist', function() {
            // arrange
            var elem1 = dc.place('<img data-lazyload-original="/test/spacer.gif" style="display: inline-block; margin-top: 5000px">', body);
            var elem2 = dc.place('<img data-lazyload-original="/test/spacer.gif" style="display: inline-block; margin-top: 5000px">', body);

            // act
            var nodelist = query('img[data-lazyload-original]');
            var handler = lazyload(nodelist);
            handler.destroy();
            win.scrollIntoView(elem2);

            // assert
            expect(query('img[src="/test/spacer.gif"]').length).toEqual(0);

            // cleanup
            dc.destroy(elem1);
            dc.destroy(elem2);
        });

        it('should throw error if first argument is not an HTMLElement not dojo/NodeList instance', function () {
            try { lazyload(); this.fail(); } catch(e) {}
            try { lazyload(null); this.fail(); } catch(e) {}
            try { lazyload(0); this.fail(); } catch(e) {}
            try { lazyload({}); this.fail(); } catch(e) {}
            try { lazyload(false); this.fail(); } catch(e) {}
            try { lazyload([]); this.fail(); } catch(e) {}
        });

        it('should not load the image if it is not visible', function() {
            // arrange
            var elem = dc.place('<img data-lazyload-original="/test/spacer.gif" style="margin: 5000px; display: inline-block">', body);

            // act
            window.scrollTo(0, 20000);
            var handler = lazyload(elem);

            // assert
            expect(query('img[src="/test/spacer.gif"]').length).toEqual(0);

            // cleanup
            dc.destroy(elem);
            handler.destroy();
        });

        it('should not load the image if media query is not applicable', function() {
            // arrange
            var elem = dc.place('<img data-lazyload-original="/test/spacer.gif" data-lazyload-media="screen and (max-width: 1px)">', body);

            // act
            var handler = lazyload(elem);

            // assert
            expect(query('img[src="/test/spacer.gif"]').length).toEqual(0);

            // cleanup
            dc.destroy(elem);
            handler.destroy();
        });

        it('should load the image if media query is applicable', function() {
            // arrange
            var elem = dc.place('<img data-lazyload-original="/test/spacer.gif" data-lazyload-media="screen and (min-width: 1px)">', body);

            // act
            var handler = lazyload(elem);

            // assert
            expect(query('img[src="/test/spacer.gif"]').length).toEqual(1);

            // cleanup
            dc.destroy(elem);
            handler.destroy();
        });

        it('should load the image if correct src attribute is in configuration', function() {
            // arrange
            var elem = dc.place('<img data-dummy="/test/spacer.gif">', body);

            // act
            var handler = lazyload(elem, {
                srcAttr: 'data-dummy'
            });

            // assert
            expect(query('img[src="/test/spacer.gif"]').length).toEqual(1);

            // cleanup
            dc.destroy(elem);
            handler.destroy();
        });

        it('should load the image if correct media attribute is in configuration', function() {
            // arrange
            var elem = dc.place('<img data-lazyload-original="/test/spacer.gif" data-dummy="screen and (min-width: 1px)">', body);

            // act
            var handler = lazyload(elem, {
                mediaAttr: 'data-dummy'
            });

            // assert
            expect(query('img[src="/test/spacer.gif"]').length).toEqual(1);

            // cleanup
            dc.destroy(elem);
            handler.destroy();
        });

    });

});
