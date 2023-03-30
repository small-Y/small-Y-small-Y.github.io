﻿/**
Core script to handle the entire theme and core functions
**/
var App = function() {

    // IE mode
    var isRTL = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;

    var resizeHandlers = [];

    var assetsPath = '../assets/';

    var globalImgPath = 'global/img/';

    var globalPluginsPath = 'global/plugins/';

    var globalCssPath = 'global/css/';

    // theme layout color set

    var brandColors = {
        'blue': '#89C4F4',
        'red': '#F3565D',
        'green': '#1bbc9b',
        'purple': '#9b59b6',
        'grey': '#95a5a6',
        'yellow': '#F8CB00'
    };

    // initializes main settings
    var handleInit = function() {

        if ($('body').css('direction') === 'rtl') {
            isRTL = true;
        }

        isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

        if (isIE10) {
            $('html').addClass('ie10'); // detect IE10 version
        }

        if (isIE10 || isIE9 || isIE8) {
            $('html').addClass('ie'); // detect IE10 version
        }
    };

    // runs callback functions set by App.addResponsiveHandler().
    var _runResizeHandlers = function() {
        // reinitialize other subscribed elements
        for (var i = 0; i < resizeHandlers.length; i++) {
            var each = resizeHandlers[i];
            each.call();
        }
    };

    // handle the layout reinitialization on window resize
    var handleOnResize = function() {
        var resize;
        if (isIE8) {
            var currheight;
            $(window).resize(function() {
                if (currheight == document.documentElement.clientHeight) {
                    return; //quite event since only body resized not window.
                }
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function() {
                    _runResizeHandlers();
                }, 50); // wait 50ms until window resize finishes.                
                currheight = document.documentElement.clientHeight; // store last body client height
            });
        } else {
            $(window).resize(function() {
                if (resize) {
                    clearTimeout(resize);
                }
                resize = setTimeout(function() {
                    _runResizeHandlers();
                }, 50); // wait 50ms until window resize finishes.
            });
        }
    };

    // Handles portlet tools & actions
    var handlePortletTools = function() {
        // handle portlet remove
        $('body').on('click', '.portlet > .portlet-title > .tools > a.remove', function(e) {
            e.preventDefault();
            var portlet = $(this).closest(".portlet");

            if ($('body').hasClass('page-portlet-fullscreen')) {
                $('body').removeClass('page-portlet-fullscreen');
            }

            portlet.find('.portlet-title .fullscreen').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .reload').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .remove').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .config').tooltip('destroy');
            portlet.find('.portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip('destroy');

            portlet.remove();
        });

        // handle portlet fullscreen
        $('body').on('click', '.portlet > .portlet-title .fullscreen', function(e) {
            e.preventDefault();
            var portlet = $(this).closest(".portlet");
            if (portlet.hasClass('portlet-fullscreen')) {
                $(this).removeClass('on');
                portlet.removeClass('portlet-fullscreen');
                $('body').removeClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height', 'auto');
            } else {
                var height = App.getViewPort().height -
                    portlet.children('.portlet-title').outerHeight() -
                    parseInt(portlet.children('.portlet-body').css('padding-top')) -
                    parseInt(portlet.children('.portlet-body').css('padding-bottom'));

                $(this).addClass('on');
                portlet.addClass('portlet-fullscreen');
                $('body').addClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height', height);
            }
        });

        $('body').on('click', '.portlet > .portlet-title > .tools > a.reload', function(e) {
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");
            var url = $(this).attr("data-url");
            var error = $(this).attr("data-error-display");
            if (url) {
                App.blockUI({
                    target: el,
                    animate: true,
                    overlayColor: 'none'
                });
                $.ajax({
                    type: "GET",
                    cache: false,
                    url: url,
                    dataType: "html",
                    success: function(res) {
                        App.unblockUI(el);
                        el.html(res);
                        App.initAjax() // reinitialize elements & plugins for newly loaded content
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        App.unblockUI(el);
                        var msg = 'Error on reloading the content. Please check your connection and try again.';
                        if (error == "toastr" && toastr) {
                            toastr.error(msg);
                        } else if (error == "notific8" && $.notific8) {
                            $.notific8('zindex', 11500);
                            $.notific8(msg, {
                                theme: 'ruby',
                                life: 3000
                            });
                        } else {
                            alert(msg);
                        }
                    }
                });
            } else {
                // for demo purpose
                App.blockUI({
                    target: el,
                    animate: true,
                    overlayColor: 'none'
                });
                window.setTimeout(function() {
                    App.unblockUI(el);
                }, 1000);
            }
        });

        // load ajax data on page init
        $('.portlet .portlet-title a.reload[data-load="true"]').click();

        $('body').on('click', '.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand', function(e) {
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");
            if ($(this).hasClass("collapse")) {
                $(this).removeClass("collapse").addClass("expand");
                el.slideUp(200);
            } else {
                $(this).removeClass("expand").addClass("collapse");
                el.slideDown(200);
            }
        });
    };

    // Handles custom checkboxes & radios using jQuery Uniform plugin
    var handleUniform = function() {
        if (!$().uniform) {
            return;
        }
        var test = $("input[type=checkbox]:not(.toggle, .md-check, .md-radiobtn, .make-switch, .icheck), input[type=radio]:not(.toggle, .md-check, .md-radiobtn, .star, .make-switch, .icheck)");
        if (test.size() > 0) {
            test.each(function() {
                if ($(this).parents(".checker").size() === 0) {
                    $(this).show();
                    $(this).uniform();
                }
            });
        }
    };

    // Handlesmaterial design checkboxes
    var handleMaterialDesign = function() {

        // Material design ckeckbox and radio effects
        $('body').on('click', '.md-checkbox > label, .md-radio > label', function() {
            var the = $(this);
            // find the first span which is our circle/bubble
            var el = $(this).children('span:first-child');
              
            // add the bubble class (we do this so it doesnt show on page load)
            el.addClass('inc');
              
            // clone it
            var newone = el.clone(true);  
              
            // add the cloned version before our original
            el.before(newone);  
              
            // remove the original so that it is ready to run on next click
            $("." + el.attr("class") + ":last", the).remove();
        }); 

        if ($('body').hasClass('page-md')) { 
            // Material design click effect
            // credit where credit's due; http://thecodeplayer.com/walkthrough/ripple-click-effect-google-material-design       
            var element, circle, d, x, y;
            $('body').on('click', 'a.btn, button.btn, input.btn, label.btn', function(e) { 
                element = $(this);
      
                if(element.find(".md-click-circle").length == 0) {
                    element.prepend("<span class='md-click-circle'></span>");
                }
                    
                circle = element.find(".md-click-circle");
                circle.removeClass("md-click-animate");
                
                if(!circle.height() && !circle.width()) {
                    d = Math.max(element.outerWidth(), element.outerHeight());
                    circle.css({height: d, width: d});
                }
                
                x = e.pageX - element.offset().left - circle.width()/2;
                y = e.pageY - element.offset().top - circle.height()/2;
                
                circle.css({top: y+'px', left: x+'px'}).addClass("md-click-animate");

                setTimeout(function() {
                    circle.remove();      
                }, 1000);
            });
        }

        // Floating labels
        var handleInput = function(el) {
            if (el.val() != "") {
                el.addClass('edited');
            } else {
                el.removeClass('edited');
            }
        } 

        $('body').on('keydown', '.form-md-floating-label .form-control', function(e) { 
            handleInput($(this));
        });
        $('body').on('blur', '.form-md-floating-label .form-control', function(e) { 
            handleInput($(this));
        });        

        $('.form-md-floating-label .form-control').each(function(){
            if ($(this).val().length > 0) {
                $(this).addClass('edited');
            }
        });
    }

    // Handles custom checkboxes & radios using jQuery iCheck plugin
    var handleiCheck = function() {
        if (!$().iCheck) {
            return;
        }

        $('.icheck').each(function() {
            var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_minimal-grey';
            var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_minimal-grey';

            if (checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
                $(this).iCheck({
                    checkboxClass: checkboxClass,
                    radioClass: radioClass,
                    insert: '<div class="icheck_line-icon"></div>' + $(this).attr("data-label")
                });
            } else {
                $(this).iCheck({
                    checkboxClass: checkboxClass,
                    radioClass: radioClass
                });
            }
        });
    };

    // Handles Bootstrap switches
    var handleBootstrapSwitch = function() {
        if (!$().bootstrapSwitch) {
            return;
        }
        $('.make-switch').bootstrapSwitch();
    };

    // Handles Bootstrap confirmations
    var handleBootstrapConfirmation = function() {
        if (!$().confirmation) {
            return;
        }
        $('[data-toggle=confirmation]').confirmation({ container: 'body', btnOkClass: 'btn btn-sm btn-success', btnCancelClass: 'btn btn-sm btn-danger'});
    }
    
    // Handles Bootstrap Accordions.
    var handleAccordions = function() {
        $('body').on('shown.bs.collapse', '.accordion.scrollable', function(e) {
            App.scrollTo($(e.target));
        });
    };

    // Handles Bootstrap Tabs.
    var handleTabs = function() {
        //activate tab if tab id provided in the URL
        if (location.hash) {
            var tabid = encodeURI(location.hash.substr(1));
            $('a[href="#' + tabid + '"]').parents('.tab-pane:hidden').each(function() {
                var tabid = $(this).attr("id");
                $('a[href="#' + tabid + '"]').click();
            });
            $('a[href="#' + tabid + '"]').click();
        }

        if ($().tabdrop) {
            $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
                text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
            });
        }
    };

    // Handles Bootstrap Modals.
    var handleModals = function() {        
        // fix stackable modal issue: when 2 or more modals opened, closing one of modal will remove .modal-open class. 
        $('body').on('hide.bs.modal', function() {
            if ($('.modal:visible').size() > 1 && $('html').hasClass('modal-open') === false) {
                $('html').addClass('modal-open');
            } else if ($('.modal:visible').size() <= 1) {
                $('html').removeClass('modal-open');
            }
        });

        // fix page scrollbars issue
        $('body').on('show.bs.modal', '.modal', function() {
            if ($(this).hasClass("modal-scroll")) {
                $('body').addClass("modal-open-noscroll");
            }
        });

        // fix page scrollbars issue
        $('body').on('hide.bs.modal', '.modal', function() {
            $('body').removeClass("modal-open-noscroll");
        });

        // remove ajax content and remove cache on modal closed 
        $('body').on('hidden.bs.modal', '.modal:not(.modal-cached)', function () {
            $(this).removeData('bs.modal');
        });
    };

    // Handles Bootstrap Tooltips.
    var handleTooltips = function() {
        // global tooltips
        $('.tooltips').tooltip();

        // portlet tooltips
        $('.portlet > .portlet-title .fullscreen').tooltip({
            container: 'body',
            title: 'Fullscreen'
        });
        $('.portlet > .portlet-title > .tools > .reload').tooltip({
            container: 'body',
            title: 'Reload'
        });
        $('.portlet > .portlet-title > .tools > .remove').tooltip({
            container: 'body',
            title: 'Remove'
        });
        $('.portlet > .portlet-title > .tools > .config').tooltip({
            container: 'body',
            title: 'Settings'
        });
        $('.portlet > .portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip({
            container: 'body',
            title: 'Collapse/Expand'
        });
    };

    // Handles Bootstrap Dropdowns
    var handleDropdowns = function() {
        /*
          Hold dropdown on click  
        */
        $('body').on('click', '.dropdown-menu.hold-on-click', function(e) {
            e.stopPropagation();
        });
    };

    var handleAlerts = function() {
        $('body').on('click', '[data-close="alert"]', function(e) {
            $(this).parent('.alert').hide();
            $(this).closest('.note').hide();
            e.preventDefault();
        });

        $('body').on('click', '[data-close="note"]', function(e) {
            $(this).closest('.note').hide();
            e.preventDefault();
        });

        $('body').on('click', '[data-remove="note"]', function(e) {
            $(this).closest('.note').remove();
            e.preventDefault();
        });
    };

    // Handle Hower Dropdowns
    var handleDropdownHover = function() {
        $('[data-hover="dropdown"]').not('.hover-initialized').each(function() {
            $(this).dropdownHover();
            $(this).addClass('hover-initialized');
        });
    };

    // Handle textarea autosize 
    var handleTextareaAutosize = function() {
        if (typeof(autosize) == "function") {
            autosize(document.querySelector('textarea.autosizeme'));
        }
    }

    // Handles Bootstrap Popovers

    // last popep popover
    var lastPopedPopover;

    var handlePopovers = function() {
        $('.popovers').popover();

        // close last displayed popover

        $(document).on('click.bs.popover.data-api', function(e) {
            if (lastPopedPopover) {
                lastPopedPopover.popover('hide');
            }
        });
    };

    // Handles scrollable contents using jQuery SlimScroll plugin.
    var handleScrollers = function() {
        App.initSlimScroll('.scroller');
    };

    // Handles Image Preview using jQuery Fancybox plugin
    var handleFancybox = function() {
        if (!jQuery.fancybox) {
            return;
        }

        if ($(".fancybox-button").size() > 0) {
            $(".fancybox-button").fancybox({
                groupAttr: 'data-rel',
                prevEffect: 'none',
                nextEffect: 'none',
                closeBtn: true,
                helpers: {
                    title: {
                        type: 'inside'
                    }
                }
            });
        }
    };

    // Handles counterup plugin wrapper
    var handleCounterup = function() {
        if (!$().counterUp) {
            return;
        }

        $("[data-counter='counterup']").counterUp({
            delay: 10,
            time: 1000
        });
    };

    // Fix input placeholder issue for IE8 and IE9
    var handleFixInputPlaceholderForIE = function() {
        //fix html5 placeholder attribute for ie7 & ie8
        if (isIE8 || isIE9) { // ie8 & ie9
            // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
            $('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function() {
                var input = $(this);

                if (input.val() === '' && input.attr("placeholder") !== '') {
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }

                input.focus(function() {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });

                input.blur(function() {
                    if (input.val() === '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    };

    // Handle Select2 Dropdowns
    var handleSelect2 = function() {
        if ($().select2) {
            $.fn.select2.defaults.set("theme", "bootstrap");
            $('.select2me').select2({
                placeholder: "Select",
                width: 'auto', 
                allowClear: true
            });
        }
    };

    // handle group element heights
   var handleHeight = function() {
       $('[data-auto-height]').each(function() {
            var parent = $(this);
            var items = $('[data-height]', parent);
            var height = 0;
            var mode = parent.attr('data-mode');
            var offset = parseInt(parent.attr('data-offset') ? parent.attr('data-offset') : 0);

            items.each(function() {
                if ($(this).attr('data-height') == "height") {
                    $(this).css('height', '');
                } else {
                    $(this).css('min-height', '');
                }

                var height_ = (mode == 'base-height' ? $(this).outerHeight() : $(this).outerHeight(true));
                if (height_ > height) {
                    height = height_;
                }
            });

            height = height + offset;

            items.each(function() {
                if ($(this).attr('data-height') == "height") {
                    $(this).css('height', height);
                } else {
                    $(this).css('min-height', height);
                }
            });

            if(parent.attr('data-related')) {
                $(parent.attr('data-related')).css('height', parent.height());
            }
       });       
    }
    
    //* END:CORE HANDLERS *//

    return {

        //main function to initiate the theme
        init: function() {
            //IMPORTANT!!!: Do not modify the core handlers call order.

            //Core handlers
            handleInit(); // initialize core variables
            handleOnResize(); // set and handle responsive    

            //UI Component handlers     
            //handleMaterialDesign(); // handle material design       
            //handleUniform(); // hanfle custom radio & checkboxes
            //handleiCheck(); // handles custom icheck radio and checkboxes
            //handleBootstrapSwitch(); // handle bootstrap switch plugin
            //handleScrollers(); // handles slim scrolling contents 
            //handleFancybox(); // handle fancy box
            //handleSelect2(); // handle custom Select2 dropdowns
            handlePortletTools(); // handles portlet action bar functionality(refresh, configure, toggle, remove)
            //handleAlerts(); //handle closabled alerts
            //handleDropdowns(); // handle dropdowns
            //handleTabs(); // handle tabs
            //handleTooltips(); // handle bootstrap tooltips
            //handlePopovers(); // handles bootstrap popovers
            //handleAccordions(); //handles accordions 
            //handleModals(); // handle modals
            //handleBootstrapConfirmation(); // handle bootstrap confirmations
            //handleTextareaAutosize(); // handle autosize textareas
            //handleCounterup(); // handle counterup instances

            //Handle group element heights
            this.addResizeHandler(handleHeight); // handle auto calculating height on window resize

            // Hacks
            handleFixInputPlaceholderForIE(); //IE8 & IE9 input placeholder issue fix
        },

        //main function to initiate core javascript after ajax complete
        initAjax: function() {
            handleUniform(); // handles custom radio & checkboxes     
            handleiCheck(); // handles custom icheck radio and checkboxes
            handleBootstrapSwitch(); // handle bootstrap switch plugin
            handleDropdownHover(); // handles dropdown hover       
            handleScrollers(); // handles slim scrolling contents 
            handleSelect2(); // handle custom Select2 dropdowns
            handleFancybox(); // handle fancy box
            handleDropdowns(); // handle dropdowns
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            handleAccordions(); //handles accordions 
            handleBootstrapConfirmation(); // handle bootstrap confirmations
        },

        //init main components 
        initComponents: function() {
            this.initAjax();
        },

        //public function to remember last opened popover that needs to be closed on click
        setLastPopedPopover: function(el) {
            lastPopedPopover = el;
        },

        //public function to add callback a function which will be called on window resize
        addResizeHandler: function(func) {
            resizeHandlers.push(func);
        },

        //public functon to call _runresizeHandlers
        runResizeHandlers: function() {
            _runResizeHandlers();
        },

        // wrApper function to scroll(focus) to an element
        scrollTo: function(el, offeset) {
            var pos = (el && el.size() > 0) ? el.offset().top : 0;

            if (el) {
                if ($('body').hasClass('page-header-fixed')) {
                    pos = pos - $('.page-header').height();
                } else if ($('body').hasClass('page-header-top-fixed')) {
                    pos = pos - $('.page-header-top').height();
                } else if ($('body').hasClass('page-header-menu-fixed')) {
                    pos = pos - $('.page-header-menu').height();
                }
                pos = pos + (offeset ? offeset : -1 * el.height());
            }

            $('html,body').animate({
                scrollTop: pos
            }, 'slow');
        },

        initSlimScroll: function(el) {
            $(el).each(function() {
                if ($(this).attr("data-initialized")) {
                    return; // exit
                }

                var height;

                if ($(this).attr("data-height")) {
                    height = $(this).attr("data-height");
                } else {
                    height = $(this).css('height');
                }

                $(this).slimScroll({
                    allowPageScroll: true, // allow page scroll when the element scroll is ended
                    size: '7px',
                    color: ($(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#bbb'),
                    wrapperClass: ($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
                    railColor: ($(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#eaeaea'),
                    position: isRTL ? 'left' : 'right',
                    height: height,
                    alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                    railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                    disableFadeOut: true
                });

                $(this).attr("data-initialized", "1");
            });
        },

        destroySlimScroll: function(el) {
            $(el).each(function() {
                if ($(this).attr("data-initialized") === "1") { // destroy existing instance before updating the height
                    $(this).removeAttr("data-initialized");
                    $(this).removeAttr("style");

                    var attrList = {};

                    // store the custom attribures so later we will reassign.
                    if ($(this).attr("data-handle-color")) {
                        attrList["data-handle-color"] = $(this).attr("data-handle-color");
                    }
                    if ($(this).attr("data-wrapper-class")) {
                        attrList["data-wrapper-class"] = $(this).attr("data-wrapper-class");
                    }
                    if ($(this).attr("data-rail-color")) {
                        attrList["data-rail-color"] = $(this).attr("data-rail-color");
                    }
                    if ($(this).attr("data-always-visible")) {
                        attrList["data-always-visible"] = $(this).attr("data-always-visible");
                    }
                    if ($(this).attr("data-rail-visible")) {
                        attrList["data-rail-visible"] = $(this).attr("data-rail-visible");
                    }

                    $(this).slimScroll({
                        wrapperClass: ($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
                        destroy: true
                    });

                    var the = $(this);

                    // reassign custom attributes
                    $.each(attrList, function(key, value) {
                        the.attr(key, value);
                    });

                }
            });
        },

        // function to scroll to the top
        scrollTop: function() {
            App.scrollTo();
        },

        // wrApper function to  block element(indicate loading)
        blockUI: function(options) {
            options = $.extend(true, {}, options);
            var html = '';
            if (options.animate) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
            } else if (options.iconOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>';
            } else if (options.textOnly) {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            } else {
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }

            if (options.target) { // element blocking
                var el = $(options.target);
                if (el.height() <= ($(window).height())) {
                    options.cenrerY = true;
                }
                el.block({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                    css: {
                        top: '10%',
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            } else { // page blocking
                $.blockUI({
                    message: html,
                    baseZ: options.zIndex ? options.zIndex : 1000,
                    css: {
                        border: '0',
                        padding: '0',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                        opacity: options.boxed ? 0.05 : 0.1,
                        cursor: 'wait'
                    }
                });
            }
        },

        // wrApper function to  un-block element(finish loading)
        unblockUI: function(target) {
            if (target) {
                $(target).unblock({
                    onUnblock: function() {
                        $(target).css('position', '');
                        $(target).css('zoom', '');
                    }
                });
            } else {
                $.unblockUI();
            }
        },

        startPageLoading: function(options) {
            if (options && options.animate) {
                $('.page-spinner-bar').remove();
                $('body').append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
            } else {
                $('.page-loading').remove();
                $('body').append('<div class="page-loading"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif"/>&nbsp;&nbsp;<span>' + (options && options.message ? options.message : 'Loading...') + '</span></div>');
            }
        },

        stopPageLoading: function() {
            $('.page-loading, .page-spinner-bar').remove();
        },

        alert: function(options) {

            options = $.extend(true, {
                container: "", // alerts parent container(by default placed after the page breadcrumbs)
                place: "append", // "append" or "prepend" in container 
                type: 'success', // alert's type
                message: "", // alert's message
                close: true, // make alert closable
                reset: true, // close all previouse alerts first
                focus: true, // auto scroll to the alert after shown
                closeInSeconds: 0, // auto close after defined seconds
                icon: "" // put icon before the message
            }, options);

            var id = App.getUniqueID("App_alert");

            var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';

            if (options.reset) {
                $('.custom-alerts').remove();
            }

            if (!options.container) {
                if ($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) {
                    $('.page-title').after(html);
                } else {
                    if ($('.page-bar').size() > 0) {
                        $('.page-bar').after(html);
                    } else {
                        $('.page-breadcrumb').after(html);
                    }
                }
            } else {
                if (options.place == "append") {
                    $(options.container).append(html);
                } else {
                    $(options.container).prepend(html);
                }
            }

            if (options.focus) {
                App.scrollTo($('#' + id));
            }

            if (options.closeInSeconds > 0) {
                setTimeout(function() {
                    $('#' + id).remove();
                }, options.closeInSeconds * 1000);
            }

            return id;
        },

        // initializes uniform elements
        initUniform: function(els) {
            if (els) {
                $(els).each(function() {
                    if ($(this).parents(".checker").size() === 0) {
                        $(this).show();
                        $(this).uniform();
                    }
                });
            } else {
                handleUniform();
            }
        },

        //wrApper function to update/sync jquery uniform checkbox & radios
        updateUniform: function(els) {
            $.uniform.update(els); // update the uniform checkbox & radios UI after the actual input control state changed
        },

        //public function to initialize the fancybox plugin
        initFancybox: function() {
            handleFancybox();
        },

        //public helper function to get actual input value(used in IE9 and IE8 due to placeholder attribute not supported)
        getActualVal: function(el) {
            el = $(el);
            if (el.val() === el.attr("placeholder")) {
                return "";
            }
            return el.val();
        },

        //public function to get a paremeter by name from URL
        getURLParameter: function(paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },

        // check for device touch support
        isTouchDevice: function() {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        },

        // To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
        getViewPort: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        getUniqueID: function(prefix) {
            return 'prefix_' + Math.floor(Math.random() * (new Date()).getTime());
        },

        // check IE8 mode
        isIE8: function() {
            return isIE8;
        },

        // check IE9 mode
        isIE9: function() {
            return isIE9;
        },

        //check RTL mode
        isRTL: function() {
            return isRTL;
        },

        // check IE8 mode
        isAngularJsApp: function() {
            return (typeof angular == 'undefined') ? false : true;
        },

        getAssetsPath: function() {
            return assetsPath;
        },

        setAssetsPath: function(path) {
            assetsPath = path;
        },

        setGlobalImgPath: function(path) {
            globalImgPath = path;
        },

        getGlobalImgPath: function() {
            return assetsPath + globalImgPath;
        },

        setGlobalPluginsPath: function(path) {
            globalPluginsPath = path;
        },

        getGlobalPluginsPath: function() {
            return assetsPath + globalPluginsPath;
        },

        getGlobalCssPath: function() {
            return assetsPath + globalCssPath;
        },

        // get layout color code by color name
        getBrandColor: function(name) {
            if (brandColors[name]) {
                return brandColors[name];
            } else {
                return '';
            }
        },

        getResponsiveBreakpoint: function(size) {
            // bootstrap responsive breakpoints
            var sizes = {
                'xs' : 480,     // extra small
                'sm' : 768,     // small
                'md' : 992,     // medium
                'lg' : 1200     // large
            };

            return sizes[size] ? sizes[size] : 0; 
        },

		load:function(){
			this.doType=0;
			$("#mainFrame").find(".btn-search").hide();
			$("#mainFrame").find(".btn-edit").hide();
			//
			var now=new Date();
			var tc=new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
			this.startTime=tc.DateAdd("d",-2);
			this.endTime=tc.DateAdd("d",1);
			//
			var tc=new Date(now.getFullYear(),now.getMonth(),1,0,0,0,0);
			this.historyTime1=tc;
			this.historyTime2=now;
			this.historyType=0;
			this.selUrlStatus=[];
			this.selUrlType=[];
			this.selLogLevel=[];
			//初始化应用数据
			$("#profile1").find(".profile-usertitle").html('<div class="profile-usertitle-name"> ' + TUI.env.us.fullName+ ' </div>'
														+'<div class="profile-usertitle-job"> ' + TUI.env.us.userInfo+ ' </div>'
														+'<div class="profile-usertitle-info"> 登录地址：' + TUI.env.us.loginIPAddr+ '<br>登录时间：' + TUI.Utils.dateMessage(TUI.env.us.lastLoginTime)+ '</div>');
			//
			this.oTable1 = $('#auditListView').DataTable({
				"language": {
					"aria": {
						"sortAscending": ": activate to sort column ascending",
						"sortDescending": ": activate to sort column descending"
					},
					"emptyTable": "没有操作日志记录",
					"info": "显示 _START_ 到 _END_ 条，共计 _TOTAL_ 条",
					"infoEmpty": "没有发现项",
					"infoFiltered": "(筛选  _MAX_ 条)",
					"lengthMenu": "_MENU_ 条",
					"search": "检索：",
					"zeroRecords": "没有发现匹配项",
					"paginate": {
						"previous":"前一页",
						"next": "后一页",
						"last": "最后页",
						"first": "第一页"
					}
				},

				 "responsive": false,
				
				"columnDefs": [{
										"targets": 0,
										"orderable": false,
										"searchable": false
									}],

				"order": [
					[1, 'asc']
				],
				
				"lengthMenu": [
					[10, 20, 30, 50, -1],
					[10, 20, 30, 50, "全部"] // change per page values here
				],
				// set the initial value
				"pageLength": 10,
				"ajax": 'srv/getAuditList.tjs'
			});
			//
			$('#auditListView').find('.group-checkable').change(function () {
				var set = jQuery(this).attr("data-set");
				var checked = jQuery(this).is(":checked");
				jQuery(set).each(function () {
					if (checked) {
						$(this).prop("checked", true);
						$(this).parents('tr').addClass("active");
					} else {
						$(this).prop("checked", false);
						$(this).parents('tr').removeClass("active");
					}
				});
				jQuery.uniform.update(set);
			});

			$('#auditListView').on('change', 'tbody tr .checkboxes', function () {
				$(this).parents('tr').toggleClass("active");
			});
			//
			this.oTable1.on( 'draw.dt', function (e, settings, data) {
				App.initAjax();
			});
			//
			this.oTable2 = $('#urlListView').DataTable({
				"language": {
					"aria": {
						"sortAscending": ": activate to sort column ascending",
						"sortDescending": ": activate to sort column descending"
					},
					"emptyTable": "没有访问日志记录",
					"info": "显示 _START_ 到 _END_ 条，共计 _TOTAL_ 条",
					"infoEmpty": "没有发现项",
					"infoFiltered": "(筛选  _MAX_ 条)",
					"lengthMenu": "_MENU_ 条",
					"search": "检索：",
					"zeroRecords": "没有发现匹配项",
					"paginate": {
						"previous":"前一页",
						"next": "后一页",
						"last": "最后页",
						"first": "第一页"
					}
				},

				 "responsive": false,
				
				"columnDefs": [{
										"targets": 0,
										"orderable": false,
										"searchable": false
									}],

				"order": [
					[1, 'asc']
				],
				
				"lengthMenu": [
					[10, 20, 30, 50, -1],
					[10, 20, 30, 50, "全部"] // change per page values here
				],
				// set the initial value
				"pageLength": 10,
				"ajax": 'srv/getUrlList.tjs'
			});
			//
			$('#urlListView').find('.group-checkable').change(function () {
				var set = jQuery(this).attr("data-set");
				var checked = jQuery(this).is(":checked");
				jQuery(set).each(function () {
					if (checked) {
						$(this).prop("checked", true);
						$(this).parents('tr').addClass("active");
					} else {
						$(this).prop("checked", false);
						$(this).parents('tr').removeClass("active");
					}
				});
				jQuery.uniform.update(set);
			});

			$('#urlListView').on('change', 'tbody tr .checkboxes', function () {
				$(this).parents('tr').toggleClass("active");
			});
			//
			this.oTable2.on( 'draw.dt', function (e, settings, data) {
				App.initAjax();
			});
			//
			this.oTable3 = $('#systemListView').DataTable({
				"language": {
					"aria": {
						"sortAscending": ": activate to sort column ascending",
						"sortDescending": ": activate to sort column descending"
					},
					"emptyTable": "没有运行日志记录",
					"info": "显示 _START_ 到 _END_ 条，共计 _TOTAL_ 条",
					"infoEmpty": "没有发现项",
					"infoFiltered": "(筛选  _MAX_ 条)",
					"lengthMenu": "_MENU_ 条",
					"search": "检索：",
					"zeroRecords": "没有发现匹配项",
					"paginate": {
						"previous":"前一页",
						"next": "后一页",
						"last": "最后页",
						"first": "第一页"
					}
				},

				 "responsive": false,
				
				"columnDefs": [{
										"targets": 0,
										"orderable": false,
										"searchable": false
									}],

				"order": [
					[1, 'asc']
				],
				
				"lengthMenu": [
					[10, 20, 30, 50, -1],
					[10, 20, 30, 50, "全部"] // change per page values here
				],
				// set the initial value
				"pageLength": 10,
				"ajax": 'srv/getSystemList.tjs'
			});
			//
			$('#systemListView').find('.group-checkable').change(function () {
				var set = jQuery(this).attr("data-set");
				var checked = jQuery(this).is(":checked");
				jQuery(set).each(function () {
					if (checked) {
						$(this).prop("checked", true);
						$(this).parents('tr').addClass("active");
					} else {
						$(this).prop("checked", false);
						$(this).parents('tr').removeClass("active");
					}
				});
				jQuery.uniform.update(set);
			});

			$('#systemListView').on('change', 'tbody tr .checkboxes', function () {
				$(this).parents('tr').toggleClass("active");
			});
			//
			this.oTable3.on( 'draw.dt', function (e, settings, data) {
				App.initAjax();
			});
			//
			App.runResizeHandlers();
			//
			toastr.options = {
			  "closeButton": true,
			  "debug": false,
			  "positionClass": "toast-bottom-full-width",
			  "onclick": null,
			  "showDuration": "1000",
			  "hideDuration": "1000",
			  "timeOut": "5000",
			  "extendedTimeOut": "1000",
			  "showEasing": "swing",
			  "hideEasing": "linear",
			  "showMethod": "fadeIn",
			  "hideMethod": "fadeOut"
			}
			//
			this.loadMessageKpi();
		},
		
		listMessage:function(type){
			$("#profile1").find(".profile-usermenu li").removeClass("active");
			this.doType=type;
			//
			switch(type)
			{
				case 0:
				{
					$("#profile2").find(".tab-content .tab-pane").removeClass("active");
					$("#usermenu1").addClass("active");
					$("#tab_1_1").addClass("active");
					$("#profile-title").html('<i class="fa fa-dashboard font-green-sharp"></i><span class="caption-subject font-green-sharp bold uppercase">日志审计视窗</span>');
					$("#mainFrame").find(".btn-search").hide();
					$("#mainFrame").find(".btn-edit").hide();
					$("#mainFrame").find(".btn-prev").show();
					$("#mainFrame").find(".btn-next").show();
					this.loadMessageKpi();
				}
				break;
				case 1:
				{
					$("#profile2").find(".tab-content .tab-pane").removeClass("active");
					$("#usermenu2").addClass("active");
					$("#tab_1_2").addClass("active");
					$("#profile-title").html('<i class="fa fa-paw font-green-sharp"></i><span class="caption-subject font-green-sharp bold uppercase">操作日志记录</span>');
					$("#mainFrame").find(".btn-search").show();
					$("#mainFrame").find(".btn-edit").show();
					$("#mainFrame").find(".btn-prev").hide();
					$("#mainFrame").find(".btn-next").hide();
					this.loadMessageList(1);

				}
				break;
				case 2:
				{
					$("#profile2").find(".tab-content .tab-pane").removeClass("active");
					$("#usermenu3").addClass("active");
					$("#tab_1_3").addClass("active");
					$("#profile-title").html('<i class="fa fa-map-signs font-green-sharp"></i><span class="caption-subject font-green-sharp bold uppercase">访问日志记录</span>');
					$("#mainFrame").find(".btn-search").show();
					$("#mainFrame").find(".btn-edit").show();
					$("#mainFrame").find(".btn-prev").hide();
					$("#mainFrame").find(".btn-next").hide();
					this.loadMessageList(2);
				}
				break;
				case 3:
				{
					$("#profile2").find(".tab-content .tab-pane").removeClass("active");
					$("#usermenu4").addClass("active");
					$("#tab_1_4").addClass("active");
					$("#profile-title").html('<i class="fa fa-cogs font-green-sharp"></i><span class="caption-subject font-green-sharp bold uppercase">运行日志记录</span>');
					$("#mainFrame").find(".btn-search").show();
					$("#mainFrame").find(".btn-edit").show();
					$("#mainFrame").find(".btn-prev").hide();
					$("#mainFrame").find(".btn-next").hide();
					this.loadMessageList(3);
				}
				break;
			}
		},

		loadKpi:function(offset){
			if(offset<0)
			{
				this.endTime=this.startTime;
				this.startTime=this.startTime.DateAdd("d",-3);
			}
			else
			{
				this.startTime=this.endTime;
				this.endTime=this.endTime.DateAdd("d",3);
			}
			//
			this.loadMessageKpi();
		},

		loadMessageKpi:function(){
			$.ajax({
					url: "srv/getMessageKpi.tjs?startTime="+this.startTime.Format("yyyy-MM-dd hh:mm:ss")+"&endTime="+this.endTime.Format("yyyy-MM-dd hh:mm:ss"),
					dataType: "json",
					context: this,
					success: function (result) {
						if(!result.flag)
						{
							toastr["error"](result.info,"加载运营数据失败");
							return;
						}
						//
						$('#MessagePie1').empty();
						$('#MessagePie1').highcharts({
							chart: {
								type: 'pie',
								margin: [0, 10, 25, 15]
							},
							title: {
								text: "日志类型",
								verticalAlign:"middle",
								y:0
							},
							subtitle: {
								text: null
							},
							credits: {
								enabled: false
							},
							legend: {             
								enabled: true
							},
							yAxis: {
								min: 0,
								title: {
									text: '共计'
								}
							},
							plotOptions: {
								pie: {
									allowPointSelect: true,
									dataLabels: {
										enabled: true,
										color: '#000000',
										connectorColor: '#000000',
										distance:15,
										format: '{point.percentage:.1f} %'
									},
									showInLegend: false,
									size:'80%',
									innerSize:'75%',
									cursor: 'pointer'
								}
							},
							series: [{
								name: '共计',
								data: result.MessagePie1,
								tooltip: {
									valueSuffix:"条"
								}
							}]
						});
						//
						$('#MessagePie2').empty();
						$('#MessagePie2').highcharts({
							chart: {
								type: 'pie',
								margin: [0, 10, 25, 10]
							},
							title: {
								text: "日志级别",
								verticalAlign:"middle",
								y:0
							},
							subtitle: {
								text: null
							},
							credits: {
								enabled: false
							},
							legend: {             
								enabled: true
							},
							yAxis: {
								min: 0,
								title: {
									text: '共计'
								}
							},
							plotOptions: {
								pie: {
									allowPointSelect: true,
									dataLabels: {
										enabled: true,
										color: '#000000',
										connectorColor: '#000000',
										distance:10,
										format: '{point.percentage:.1f} %'
									},
									showInLegend: false,
									size:'80%',
									innerSize:'75%',
									cursor: 'pointer'
								}
							},
							series: [{
								name: '共计',
								data: result.MessagePie2,
								tooltip: {
									valueSuffix:"条"
								}
							}]
						});
						//
						$('#MessagePie3').empty();
						$('#MessagePie3').highcharts({
							chart: {
								type: 'pie',
								margin: [0, 10, 25, 10]
							},
							title: {
								text: "访问类型",
								verticalAlign:"middle",
								y:0
							},
							subtitle: {
								text: null
							},
							credits: {
								enabled: false
							},
							legend: {             
								enabled: true
							},
							yAxis: {
								min: 0,
								title: {
									text: '共计'
								}
							},
							plotOptions: {
								pie: {
									allowPointSelect: true,
									dataLabels: {
										enabled: true,
										color: '#000000',
										connectorColor: '#000000',
										distance:10,
										format: '{point.percentage:.1f} %'
									},
									showInLegend: false,
									size:'80%',
									innerSize:'75%',
									cursor: 'pointer'
								}
							},
							series: [{
								name: '共计',
								data: result.MessagePie3,
								tooltip: {
									valueSuffix:"条"
								}
							}]
						});
						//
						var now=new Date();
						var tc=new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
						$('#appBar').empty();
						$('#appBar').highcharts({
							chart: {
								zoomType: 'x',
								margin: [30, 30, 80, 80]
							},
							title: {
								text: "操作日志来源统计"
							},
							subtitle: {
								text: TUI.Utils.dateMessage(this.startTime)+" 到 "+TUI.Utils.dateMessage(tc>this.endTime?this.endTime.DateAdd("d",-1):now)
							},
							colors: ['#058DC7','#FF9900','#66CCCC', '#50B432','#99CCFF', '#ED561B','#99CCCC','#CCCCFF', '#6AF9C4', '#FF9655','#66CCFF','#FF99CC','#FFCC00','#666699','#FF6600','#66EE99', '#DDDF00', '#24CBE5', '#64E572', '#FFF263'],
							xAxis:[{
									categories: result.appBar[0].categories,
									type: 'category',
									labels: {
										rotation: -30,
										style: {
											fontSize: '13px',
											fontFamily: 'Verdana, sans-serif'
										}
									}
								}],
							yAxis:[{
								min: 0,
								gridLineWidth:1,
								gridLineColor:'#f7f7f7',
								lineWidth:1,
								title: {
									align:'high',
									rotation:0,
									offset:-10,
									text: '条'
								},
								labels: {
									format: '{value}'
								},
								stackLabels: {
									enabled: true
								}
							}],
							tooltip: {
								shared: true
							},
							plotOptions: {
								column: {
								   colorByPoint:true,
								   dataLabels: {
										enabled: true
									}
								}
							},
							credits: {
								enabled: false
							},
							legend: {
								enabled:false
							},
							series: result.appBar
						});
						//
						$('#phoneBar').empty();
						$('#phoneBar').highcharts({
							chart: {
								zoomType: 'x',
								margin: [30, 30, 80, 80]
							},
							title: {
								text: "IP地址访问量"
							},
							subtitle: {
								text: TUI.Utils.dateMessage(this.startTime)+" 到 "+TUI.Utils.dateMessage(tc>this.endTime?this.endTime.DateAdd("d",-1):now)
							},
							colors: ['#058DC7','#FF9900','#66CCCC', '#50B432','#99CCFF', '#ED561B','#99CCCC','#CCCCFF', '#6AF9C4', '#FF9655','#66CCFF','#FF99CC','#FFCC00','#666699','#FF6600','#66EE99', '#DDDF00', '#24CBE5', '#64E572', '#FFF263'],
							xAxis:[{
									categories: result.phoneBar[0].categories,
									type: 'category',
									labels: {
										rotation: -30,
										style: {
											fontSize: '13px',
											fontFamily: 'Verdana, sans-serif'
										}
									}
								}],
							yAxis:[{
								min: 0,
								gridLineWidth:1,
								gridLineColor:'#f7f7f7',
								lineWidth:1,
								title: {
									align:'high',
									rotation:0,
									offset:-5,
									text: '条'
								},
								labels: {
									format: '{value}'
								},
								stackLabels: {
									enabled: true
								}
							}],
							plotOptions: {
								column: {
								   colorByPoint:true,
								   dataLabels: {
										enabled: true
									}
								}
							},
							credits: {
								enabled: false
							},
							legend: {
								enabled: false
							},
							series: result.phoneBar
						});
						//
						$('#userBar').empty();
						$('#userBar').highcharts({
							chart: {
								zoomType: 'x',
								margin: [30, 30, 80, 80]
							},
							title: {
								text: "用户访问量"
							},
							subtitle: {
								text: TUI.Utils.dateMessage(this.startTime)+" 到 "+TUI.Utils.dateMessage(tc>this.endTime?this.endTime.DateAdd("d",-1):now)
							},
							colors: ['#058DC7','#FF9900','#66CCCC', '#50B432','#99CCFF', '#ED561B','#99CCCC','#CCCCFF', '#6AF9C4', '#FF9655','#66CCFF','#FF99CC','#FFCC00','#666699','#FF6600','#66EE99', '#DDDF00', '#24CBE5', '#64E572', '#FFF263'],
							xAxis:[{
									categories: result.userBar[0].categories,
									type: 'category',
									labels: {
										rotation: -30,
										style: {
											fontSize: '13px',
											fontFamily: 'Verdana, sans-serif'
										}
									}
								}],
							yAxis:[{
								min: 0,
								gridLineWidth:1,
								gridLineColor:'#f7f7f7',
								lineWidth:1,
								title: {
									align:'high',
									rotation:0,
									offset:-5,
									text: '条'
								},
								labels: {
									format: '{value}'
								},
								stackLabels: {
									enabled: true
								}
							}],
							plotOptions: {
								column: {
								   colorByPoint:true,
								   dataLabels: {
										enabled: true
									}
								}
							},
							credits: {
								enabled: false
							},
							legend: {
								enabled: false
							},
							series: result.userBar
						});
					}
			});
		},

		loadMessageList:function(type){
			switch(type)
			{
				case 1:
					this.oTable1.ajax.url( 'srv/getAuditList.tjs?selLogLevel='+this.selLogLevel.join(",")+'&startTime='+this.historyTime1.Format('yyyy-MM-dd')+'&endTime='+this.historyTime2.Format('yyyy-MM-dd')).load();
					break;
				case 2:
					this.oTable2.ajax.url( 'srv/getUrlList.tjs?selUrlType='+this.selUrlType.join(",")+'&selUrlStatus='+this.selUrlStatus.join(",")+'&startTime='+this.historyTime1.Format('yyyy-MM-dd')+'&endTime='+this.historyTime2.Format('yyyy-MM-dd')).load();
					break;
				case 3:
					this.oTable3.ajax.url( 'srv/getSystemList.tjs?selLogLevel='+this.selLogLevel.join(",")+'&startTime='+this.historyTime1.Format('yyyy-MM-dd')+'&endTime='+this.historyTime2.Format('yyyy-MM-dd')).load();
					break;
			}
		},
		
		doSearch:function(){
			if(App.doType==2)
			{
				var statusHtml='<option></option>';
				var logStatus=["失败","成功"];
				for(var i=0;i<logStatus.length;i++)
				{
					var bSelect=false;
					for(var j=0;j<App.selUrlStatus.length;j++)
					{
						if(i==App.selUrlStatus[j])
						{
							bSelect=true;
							break;
						}
					}
					//
					if(bSelect)
						statusHtml+=('<option value="'+i+'" selected>'+logStatus[i]+'</option>');
					else
						statusHtml+=('<option value="'+i+'">'+logStatus[i]+'</option>');
				}
				//
				var logHtml='<option></option>';
				var logType=["未知请求","静态请求","动态请求","代理请求","非法请求"];
				for(var i=0;i<logType.length;i++)
				{
					var bSelect=false;
					for(var j=0;j<App.selUrlType.length;j++)
					{
						if(i==App.selUrlType[j])
						{
							bSelect=true;
							break;
						}
					}
					//
					if(bSelect)
						logHtml+=('<option value="'+i+'" selected>'+logType[i]+'</option>');
					else
						logHtml+=('<option value="'+i+'">'+logType[i]+'</option>');
				}
				//
				bootbox.dialog({
							message: '<form class="form-horizontal" role="form">'
									+'	<div class="form-body">'
									+'		<div class="form-group">'
									+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">日志状态:</label>'
									+'			<div class="col-sm-8">'
									+'				<select class="form-control select2" multiple id="logStatus">'+statusHtml+'</select>'
									+'			</div>'
									+'		</div>'
									+'		<div class="form-group">'
									+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">日志级别:</label>'
									+'			<div class="col-sm-8">'
									+'				<select class="form-control select2" multiple id="logType">'+logHtml+'</select>'
									+'			</div>'
									+'		</div>'
									+'		<div class="form-group">'
									+'			<label class="control-label col-sm-3">开始时间:</label>'
									+'			<div class="col-sm-8">'
									+'				<div class="input-group date form_meridian_datetime"  data-date-format="yyyy-mm-dd">'
									+'					<input type="text" size="16" readonly class="form-control" id="startTime" value="'+this.historyTime1.Format('yyyy-MM-dd')+'">'
									+'					<span class="input-group-btn">'
									+'						<button class="btn default date-set" type="button">'
									+'							<i class="fa fa-calendar"></i>'
									+'						</button>'
									+'					</span>'
									+'				</div>'
									+'			</div>'
									+'		</div>'
									+'		<div class="form-group">'
									+'			<label class="control-label col-sm-3">结束时间:</label>'
									+'			<div class="col-sm-8">'
									+'				<div class="input-group date form_meridian_datetime"  data-date-format="yyyy-mm-dd">'
									+'					<input type="text" size="16" readonly class="form-control" id="endTime"  value="'+this.historyTime2.Format('yyyy-MM-dd')+'">'
									+'					<span class="input-group-btn">'
									+'						<button class="btn default date-set" type="button">'
									+'							<i class="fa fa-calendar"></i>'
									+'						</button>'
									+'					</span>'
									+'				</div>'
									+'			</div>'
									+'		</div>'
									+'	</div>'
									+'</form>',
							title: "选择查询条件",
							buttons: {
							  success: {
								label: "确定",
								className: "green",
								callback: function() {
									App.historyTime1=TUI.Utils.parseDate($("#startTime").val());
									App.historyTime2=TUI.Utils.parseDate($("#endTime").val());

									App.selUrlStatus=$("#logStatus").val();
									if(App.selUrlStatus==null)
										App.selUrlStatus=[];

									App.selUrlType=$("#logType").val();
									if(App.selUrlType==null)
										App.selUrlType=[];

									App.loadMessageList(App.doType);
								}
							  },
							  cancel: {
								label: "取消",
								className: "red",
								callback: function() {}
							  }
							}
						});
			}
			else
			{
				var logHtml='<option></option>';
				var logLevel=["调试级","提示级","告警级","错误级","严重级"];
				for(var i=0;i<logLevel.length;i++)
				{
					var bSelect=false;
					for(var j=0;j<App.selLogLevel.length;j++)
					{
						if(i==App.selLogLevel[j])
						{
							bSelect=true;
							break;
						}
					}
					//
					if(bSelect)
						logHtml+=('<option value="'+i+'" selected>'+logLevel[i]+'</option>');
					else
						logHtml+=('<option value="'+i+'">'+logLevel[i]+'</option>');
				}
				//
				bootbox.dialog({
							message: '<form class="form-horizontal" role="form">'
									+'	<div class="form-body">'
									+'		<div class="form-group">'
									+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">日志级别:</label>'
									+'			<div class="col-sm-8">'
									+'				<select class="form-control select2" multiple id="loglevel">'+logHtml+'</select>'
									+'			</div>'
									+'		</div>'
									+'		<div class="form-group">'
									+'			<label class="control-label col-sm-3">开始时间:</label>'
									+'			<div class="col-sm-8">'
									+'				<div class="input-group date form_meridian_datetime"  data-date-format="yyyy-mm-dd">'
									+'					<input type="text" size="16" readonly class="form-control" id="startTime" value="'+this.historyTime1.Format('yyyy-MM-dd')+'">'
									+'					<span class="input-group-btn">'
									+'						<button class="btn default date-set" type="button">'
									+'							<i class="fa fa-calendar"></i>'
									+'						</button>'
									+'					</span>'
									+'				</div>'
									+'			</div>'
									+'		</div>'
									+'		<div class="form-group">'
									+'			<label class="control-label col-sm-3">结束时间:</label>'
									+'			<div class="col-sm-8">'
									+'				<div class="input-group date form_meridian_datetime"  data-date-format="yyyy-mm-dd">'
									+'					<input type="text" size="16" readonly class="form-control" id="endTime"  value="'+this.historyTime2.Format('yyyy-MM-dd')+'">'
									+'					<span class="input-group-btn">'
									+'						<button class="btn default date-set" type="button">'
									+'							<i class="fa fa-calendar"></i>'
									+'						</button>'
									+'					</span>'
									+'				</div>'
									+'			</div>'
									+'		</div>'
									+'	</div>'
									+'</form>',
							title: "选择查询条件",
							buttons: {
							  success: {
								label: "确定",
								className: "green",
								callback: function() {
									App.historyTime1=TUI.Utils.parseDate($("#startTime").val());
									App.historyTime2=TUI.Utils.parseDate($("#endTime").val());

									App.selLogLevel=$("#loglevel").val();
									if(App.selLogLevel==null)
										App.selLogLevel=[];

									App.loadMessageList(App.doType);
								}
							  },
							  cancel: {
								label: "取消",
								className: "red",
								callback: function() {}
							  }
							}
						});
			}
			//
			App.initAjax();
			//
			$.fn.select2.defaults.set("theme", "bootstrap");
			var placeholder = "选择...";
			$(".select2, .select2-multiple").select2({
				placeholder: placeholder,
				width: null
			});

			$(".select2-allow-clear").select2({
				allowClear: true,
				placeholder: placeholder,
				width: null
			});
			//
			if (jQuery().datepicker) {
				$(".form_meridian_datetime").datepicker({
					language: 'zh-CN',
					rtl: App.isRTL(),
					format: 'yyyy-mm-dd',
					autoclose: true,
					todayBtn: true,
					pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
				});

				$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
			}
		},
		
		deleteMessage:function()
		{
			var messageList=[];
			$("input[name='selMessageID']:checked").each(function () {
				messageList[messageList.length]=$(this).attr("id");
			});

			if(messageList.length==0)
			{
				toastr["error"]("请首先选中需要删除的日志！！","删除选中日志失败");
				return;
			}

			bootbox.dialog({
								message: '您确定要删除当前选中的'+messageList.length+'个日志？',
								title: "删除日志",
								buttons: {
								  success: {
									label: "确定",
									className: "red",
									callback: function() { 
										$.ajax({
													type: 'post',
													url: "srv/delMessageList.tjs",
													data: {type:App.doType==2?'url':'system',messageList:TUI.JSON.encode(messageList)},
													dataType: "json",
													context:this,
													error: function (result) {
														alert("远程服务故障，请检查网络或稍后再试！");
													},
													success: function (result) {
														if(!result.flag)
														{
															toastr["error"](result.text,"删除选中日志失败");
															return;
														}
														//
														App.loadMessageList(App.doType);
													}
											});
										}
								  },
								  cancel: {
									label: "取消",
									className: "green",
									callback: function() {

									}
								  }
								}
							});
		}
    };

}();