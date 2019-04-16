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

    if(navigator.userAgent.match(/Trident\/7\./) || navigator.userAgent.includes("Edge")) {
        $('body').on("mousewheel", function () {
            event.preventDefault();
            var wheelDelta = event.wheelDelta;
            var currentScrollPosition = window.pageYOffset;
            window.scrollTo(0, currentScrollPosition - wheelDelta);
        });
    }


    $('#falseinput').click(function(){
        $("#fileinput").click();
    });

    var uploadList = $(".upload-list");
    var closeBtn = $("<button type='button' class='close'><span class='icon-close'></span></button>")

    function removeItem(e) {
        $(e.target).closest('.upload-list-item').remove();
    }

    $('#file').change(function(e) {

        for (var i = 0; i <= $(e.target)[0].files.length-1; i++){
            var uploadListItem = $("<div class='upload-list-item'></div>");
            const itemId = + new Date();
            var closeBtn = $("<button type='button' class='close'><span class='icon-close'></span></button>");
            uploadListItem.text("File " + $(e.target)[0].files[i].name);
            uploadListItem.append(closeBtn);
            uploadListItem.attr('id', itemId);
            uploadList.append(uploadListItem);
            $('#' + itemId).find('.close').click(function (event) {
                const closestItem = $(event.target).closest('.upload-list-item');
                closestItem.hide(400, function () {
                    closestItem.remove()
                });
            });
        }
    });

    function checkValue(target){
        target.value ?
            $(target).next().addClass('invisible') :
            $(target).next().removeClass('invisible');
    }

    $('.fake-placeholder-input').on('blur', function (e) {
        checkValue(e.target);
    });

    jQuery(function() {
        initBgParallax();
    });



    function tabsSetHeight() {
        const tabs = $('.contacts-page .tab-pane');
        // tabs.map(item => {
        //     $(tabs[item]).css('height', 'auto');
        // });
        const maxHeight = Array.from(tabs).reduce((a,b) => {
            return $(b).innerHeight() > a ? $(b).innerHeight() : a;
        }, 0);
        // tabs.map(item => {
        //     $(tabs[item]).css('height', maxHeight + 'px');
        // });
        return maxHeight;
    }

    //  $('.nav-link').on('show.bs.tab', function (e) {
    //     let prevItem = $($(e.relatedTarget).attr('href'));
    //     const tabContent = $('.tab-content');
    //
    //     let currentItem = $($(e.target).attr('href'));
    //      const newHeight = currentItem.height();
    //      // tabContent.css('min-heigth', (prevItem.height() ) + 'px');
    //      tabContent.css('heigth', (prevItem.height() + 30) + 'px');
    //      tabContent.animate({height: newHeight + "px"}, {
    //          duration: 100
    //      });
    // });






// comment
    function initBgParallax() {
        jQuery('.contact-us').parallaxBlock({
            image: '> img',
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
                parallaxOffset: 0, // percent from 0 - top 100 (from window height)
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