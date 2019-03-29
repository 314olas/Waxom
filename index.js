$(document).ready( function() {
    if (!Array.from) {
        Array.from = (function() {
            var toStr = Object.prototype.toString;
            var isCallable = function(fn) {
                return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
            };
            var toInteger = function (value) {
                var number = Number(value);
                if (isNaN(number)) { return 0; }
                if (number === 0 || !isFinite(number)) { return number; }
                return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
            };
            var maxSafeInteger = Math.pow(2, 53) - 1;
            var toLength = function (value) {
                var len = toInteger(value);
                return Math.min(Math.max(len, 0), maxSafeInteger);
            };

            return function from(arrayLike/*, mapFn, thisArg */) {
                var C = this;

                var items = Object(arrayLike);

                if (arrayLike == null) {
                    throw new TypeError('Array.from requires an array-like object - not null or undefined');
                }

                var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
                var T;
                if (typeof mapFn !== 'undefined') {
                    if (!isCallable(mapFn)) {
                        throw new TypeError('Array.from: when provided, the second argument must be a function');
                    }

                    if (arguments.length > 2) {
                        T = arguments[2];
                    }
                }

                var len = toLength(items.length);
                var A = isCallable(C) ? Object(new C(len)) : new Array(len);
                var k = 0;
                var kValue;
                while (k < len) {
                    kValue = items[k];
                    if (mapFn) {
                        A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                    } else {
                        A[k] = kValue;
                    }
                    k += 1;
                }
                A.length = len;
                return A;
            };
        }());
    }


    $('#falseinput').click(function(){
        $("#fileinput").click();
    });

    $('#file').change(function() {
        $('#inputFileSuccess').html($('#file')[0].files[0].name);
    });

    function tabsSetHeight() {
        const tabs = $('.contacts-page .tab-pane');
        tabs.map(item => {
            $(tabs[item]).css('height', 'auto');
        });
        const maxHeight = Array.from(tabs).reduce((a,b) => {
            return $(b).innerHeight() > a ? $(b).innerHeight() : a;
        }, 0);
        tabs.map(item => {
            $(tabs[item]).css('height', maxHeight + 'px');
        });
    }

    tabsSetHeight();

    $(window).on('resize orientationchange', function () {
        tabsSetHeight();
    });

    jQuery(function() {
        initBgParallax();
    });


// comment
    function initBgParallax() {
        jQuery('.contact-us').parallaxBlock({
            image: 'img',
            fallbackClass: 'is-touch-device'
        });
    }


    /*
     * jQuery BG Parallax plugin
     */
    ;(function($){
        'use strict';

        var isTouchDevice = /MSIE 10.*Touch/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

        var ParallaxController = (function() {
            var $win = $(window);
            var items = [];
            var winProps = {
                width: 0,
                height: 0,
                scrollTop: 0
            };

            return {
                init: function() {
                    $win.on('load resize orientationchange', this.resizeHandler.bind(this));
                    $win.on('scroll', this.scrollHandler.bind(this));

                    this.resizeHandler();
                },

                resizeHandler: function() {
                    winProps.width = $win.width();
                    winProps.height = $win.height();

                    $.each(items, this.calculateSize.bind(this));
                },

                scrollHandler: function() {
                    winProps.scrollTop = $win.scrollTop();

                    $.each(items, this.calculateScroll.bind(this));
                },

                calculateSize: function(i) {
                    var item = items[i];

                    item.height = Math.max(item.$el.outerHeight(), winProps.height);
                    item.width = item.$el.outerWidth();
                    item.topOffset = item.$el.offset().top;

                    var styles = this.getDimensions({
                        imageRatio: item.imageRatio,
                        itemWidth: item.width,
                        itemHeight: item.height
                    });

                    item.$el.css({
                        backgroundSize: Math.round(styles.width) + 'px ' + Math.round(styles.height) + 'px'
                    });

                    this.calculateScroll(i);
                },

                calculateScroll: function(i) {
                    var item = items[i];

                    if (winProps.scrollTop + winProps.height > item.topOffset && winProps.scrollTop < item.topOffset + item.height) {
                        var ratio = (winProps.scrollTop + winProps.height - item.topOffset) / (winProps.height + item.height);

                        item.$el.css({
                            backgroundPosition: '50% ' + (winProps.height * (item.options.parallaxOffset / 100) - (winProps.height + item.height) * ratio * (item.options.parallaxOffset / 100)) + 'px'
                        });
                    }
                },

                getDimensions: function(data) {
                    var slideHeight = data.itemWidth / data.imageRatio;

                    if (slideHeight < data.itemHeight) {
                        slideHeight = data.itemHeight;
                        data.itemWidth = slideHeight * data.imageRatio;
                    }
                    return {
                        width: data.itemWidth,
                        height: slideHeight,
                        top: (data.itemHeight - slideHeight) / 2,
                        left: (data.itemWidth - data.itemWidth) / 2
                    };
                },

                getRatio: function(image) {
                    if (image.prop('naturalWidth')) {
                        return image.prop('naturalWidth') / image.prop('naturalHeight');
                    } else {
                        var img = new Image();
                        img.src = image.prop('src');
                        return img.width / img.height;
                    }
                },

                imageLoaded: function(image, callback) {
                    var self = this;
                    var loadHandler = function() {
                        callback.call(self);
                    };
                    if (image.prop('complete')) {
                        loadHandler();
                    } else {
                        image.one('load', loadHandler);
                    }
                },

                add: function(el, options) {
                    var $el = $(el);
                    var $image = $el.find(options.image);

                    this.imageLoaded($image, function() {
                        var imageRatio = this.getRatio($image);

                        $el.css({
                            backgroundImage: 'url(' + $image.attr('src') + ')',
                            backgroundRepeat: 'no-repeat',
                            backgroundAttachment: !isTouchDevice ? 'fixed' : 'scroll',
                            backgroundSize: 'cover'
                        });

                        $image.remove();

                        if (isTouchDevice) {
                            $el.addClass(options.fallbackClass);
                            return;
                        }

                        options.parallaxOffset = Math.abs(options.parallaxOffset);

                        var newIndex = items.push({
                            $el: $(el),
                            options: options,
                            imageRatio: imageRatio
                        });

                        this.calculateSize(newIndex - 1);
                    });
                }
            };
        }());

        ParallaxController.init();

        $.fn.parallaxBlock = function(options){
            options = $.extend({
                parallaxOffset: 5, // percent from 0 - top 100 (from window height)
                fallbackClass: 'is-touch-device',
                image: 'img'
            }, options);

            return this.each(function() {
                if (this.added) {
                    return;
                }

                this.added = true;
                ParallaxController.add(this, options);
            });
        };
    }(jQuery));
});





