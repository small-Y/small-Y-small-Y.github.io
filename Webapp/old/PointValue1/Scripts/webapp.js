/**
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
			$("#mainFrame").find(".btn-add").hide();
			$("#mainFrame").find(".btn-remove").hide();
			$("#mainFrame").find(".btn-search").show();
			$("#mainFrame").find(".btn-refresh").show();
			$("#mainFrame").find(".btn-export").hide();
			//权限处理
			var bFindFlag=true;
			if(!TUI.env.us.isUserSuper)
			{
				bFindFlag=false;
				var rightList=TUI.env.us.rightList[TUI.APP.AppID];
				for(var i=0;i<rightList.length;i++)
				{
					if(rightList[i]=="*"
						|| rightList[i]=="desktop"
						|| rightList[i]=="desktop.paykpi")
					{
						bFindFlag=true;
						break;
					}
				}
			}
			if(!bFindFlag)
				$("#usermenu1").remove();
			//
			var now=new Date();
			var tc=new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
			this.startTime=tc.DateAdd("d",-2);
			this.endTime=now;
			var tc=new Date(now.getFullYear(),now.getMonth(),1,0,0,0,0);
			this.moneyTime1=tc;
			this.moneyTime2=now;
			this.selPayApp=[];
			this.selAppName=[];
			this.selOrderType=[];
			this.selOrderNo=[];
			this.selOrderUser=[];
			this.selLogLevel=[];
			this.OrderNo="";
			this.minMoney="";
			this.maxMoney="";
			this.kpiType="hour";
			this.AppData=[];
			//
			this.loadOrderKpi();
			//初始化应用数据
			$("#profile1").find(".profile-usertitle").html('<div class="profile-usertitle-name"> ' + TUI.env.us.fullName+ ' </div>'
														+'<div class="profile-usertitle-job"> ' + TUI.env.us.userInfo+ ' </div>');
			//
			var bFindFlag=true;
			if(!TUI.env.us.isUserSuper)
			{
				bFindFlag=false;
				for(var i=0;i<rightList.length;i++)
				{
					if(rightList[i]=="*"
						|| rightList[i]=="desktop"
						|| rightList[i]=="desktop.payorder")
					{
						bFindFlag=true;
						break;
					}
				}
			}
			if(!bFindFlag)
			{
				$("#usermenu2").remove();
			}
			else
			{
				this.oTable1 = $('#exchangeListView').DataTable({
					"language": {
						"aria": {
							"sortAscending": ": activate to sort column ascending",
							"sortDescending": ": activate to sort column descending"
						},
						"emptyTable": "没有积分交易订单",
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
											"targets": 5,
											"orderable": false,
											"searchable": false
										}],

					"order": [],
					
					"lengthMenu": [
						[10, 20, 30, 50, -1],
						[10, 20, 30, 50, "全部"] // change per page values here
					],
					// set the initial value
					"pageLength": 10,
					"ajax": 'srv/getOrderList.tjs'
				});
				//
				this.oTable1.on( 'draw.dt', function (e, settings, data) {
					App.initAjax();
				});
			}
			//
			var bFindFlag=true;
			if(!TUI.env.us.isUserSuper)
			{
				bFindFlag=false;
				for(var i=0;i<rightList.length;i++)
				{
					if(rightList[i]=="*"
						|| rightList[i]=="desktop"
						|| rightList[i]=="desktop.payproduct")
					{
						bFindFlag=true;
						break;
					}
				}
			}
			if(!bFindFlag)
			{
				$("#usermenu3").remove();
			}
			//
			var bFindFlag=true;
			if(!TUI.env.us.isUserSuper)
			{
				bFindFlag=false;
				for(var i=0;i<rightList.length;i++)
				{
					if(rightList[i]=="*"
						|| rightList[i]=="desktop"
						|| rightList[i]=="desktop.payactivity")
					{
						bFindFlag=true;
						break;
					}
				}
			}
			if(!bFindFlag)
			{
				$("#usermenu4").remove();
			}
			else
			{
				this.oTable3 = $('#activityListView').DataTable({
					"language": {
						"aria": {
							"sortAscending": ": activate to sort column ascending",
							"sortDescending": ": activate to sort column descending"
						},
						"emptyTable": "没有积分活动信息",
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
									},{
										"targets": 7,
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
					"ajax": 'srv/getActivityList.tjs'
				});
				
				//
				$('#activityListView').find('.group-checkable').change(function () {
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

				$('#activityListView').on('change', 'tbody tr .checkboxes', function () {
					$(this).parents('tr').toggleClass("active");
				});
				//
				this.oTable3.on( 'draw.dt', function (e, settings, data) {
					App.initAjax();
				});
			}
			//
			var bFindFlag=true;
			if(!TUI.env.us.isUserSuper)
			{
				bFindFlag=false;
				for(var i=0;i<rightList.length;i++)
				{
					if(rightList[i]=="*"
						|| rightList[i]=="desktop"
						|| rightList[i]=="desktop.payaccount")
					{
						bFindFlag=true;
						break;
					}
				}
			}
			if(!bFindFlag)
			{
				$("#usermenu5").remove();
			}
			else
			{	
				this.oTable4 = $('#userListView').DataTable({
					"language": {
						"aria": {
							"sortAscending": ": activate to sort column ascending",
							"sortDescending": ": activate to sort column descending"
						},
						"emptyTable": "没有积分对账信息",
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
					
					"columnDefs": [],
					"order": [
						[0, 'asc']
					],
					
					"lengthMenu": [
						[10, 20, 30, 50, -1],
						[10, 20, 30, 50, "全部"] // change per page values here
					],
					// set the initial value
					"pageLength": 50,
					"ajax": 'srv/getMoneyList.tjs'
				});
				//
				this.oTable4.on( 'draw.dt', function (e, settings, data) {
					App.initAjax();
				});
			}
			//
			var bFindFlag=true;
			if(!TUI.env.us.isUserSuper)
			{
				bFindFlag=false;
				for(var i=0;i<rightList.length;i++)
				{
					if(rightList[i]=="*"
						|| rightList[i]=="desktop"
						|| rightList[i]=="desktop.paylog")
					{
						bFindFlag=true;
						break;
					}
				}
			}
			if(!bFindFlag)
			{
				$("#usermenu6").remove();
			}
			else
			{
				this.oTable5 = $('#auditListView').DataTable({
					"language": {
						"aria": {
							"sortAscending": ": activate to sort column ascending",
							"sortDescending": ": activate to sort column descending"
						},
						"emptyTable": "没有操作审计日志",
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
					"columnDefs": [],
					"order": [],
					"lengthMenu": [
						[10, 20, 30, 50, -1],
						[10, 20, 30, 50, "全部"] // change per page values here
					],
					// set the initial value
					"pageLength": 10,
					"ajax": 'srv/getAuditList.tjs'
				});
				//
				this.oTable5.on( 'draw.dt', function (e, settings, data) {
					App.initAjax();
				});
			}
			//
			var bFindFlag=true;
			if(!TUI.env.us.isUserSuper)
			{
				bFindFlag=false;
				for(var i=0;i<rightList.length;i++)
				{
					if(rightList[i]=="*"
						|| rightList[i]=="desktop"
						|| rightList[i]=="desktop.payapp")
					{
						bFindFlag=true;
						break;
					}
				}
			}
			if(!bFindFlag)
			{
				$("#usermenu7").remove();
			}
			else
			{
				this.oTable6 = $('#appListView').DataTable({
					"language": {
						"aria": {
							"sortAscending": ": activate to sort column ascending",
							"sortDescending": ": activate to sort column descending"
						},
						"emptyTable": "没有积分应用信息",
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
									},{
										"targets": 4,
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
					"ajax": 'srv/getAppList.tjs'
				});
				
				//
				$('#appListView').find('.group-checkable').change(function () {
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

				$('#appListView').on('change', 'tbody tr .checkboxes', function () {
					$(this).parents('tr').toggleClass("active");
				});
				//
				this.oTable6.on( 'draw.dt', function (e, settings, data) {
					App.initAjax();
				});
			}
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
		},
		
		doSetup:function(type){
			//
			$("#profile1").find(".profile-usermenu li").removeClass("active");
			$("#profile2").find(".tab-content .tab-pane").removeClass("active");
			this.doType=type;
			//
			switch(type)
			{
				case 0:
				{
					$("#usermenu1").addClass("active");
					$("#tab_1_1").addClass("active");
					$("#profile-title").html('<i class="fa fa-balance-scale font-green-sharp"></i><span class="caption-subject font-green-sharp bold uppercase">积分运营视窗</span>');
					$("#mainFrame").find(".btn-add").hide();
					$("#mainFrame").find(".btn-remove").hide();
					$("#mainFrame").find(".btn-search").show();
					$("#mainFrame").find(".btn-refresh").show();
					$("#mainFrame").find(".btn-export").hide();
					this.loadOrderKpi();
				}
				break;
				case 1:
				{
					$("#usermenu2").addClass("active");
					$("#tab_1_2").addClass("active");
					$("#profile-title").html('<i class="fa fa-exchange font-green-sharp"></i><span class="caption-subject font-green-sharp bold uppercase">积分交易管理</span>');
					$("#mainFrame").find(".btn-add").hide();
					$("#mainFrame").find(".btn-remove").hide();
					$("#mainFrame").find(".btn-search").show();
					$("#mainFrame").find(".btn-refresh").hide();
					$("#mainFrame").find(".btn-export").show();
					this.loadOrderList();
				}
				break;
				case 2:
				{
				}
				break;
				case 3:
				{
					$("#usermenu4").addClass("active");
					$("#tab_1_4").addClass("active");
					$("#profile-title").html('<i class="fa fa-gift font-green-sharp"></i><span class="caption-subject font-green-sharp bold uppercase">积分活动推广</span>');
					$("#mainFrame").find(".btn-add").show();
					$("#mainFrame").find(".btn-remove").show();
					$("#mainFrame").find(".btn-search").hide();
					$("#mainFrame").find(".btn-refresh").hide();
					$("#mainFrame").find(".btn-export").hide();
					this.loadActivelyList();
				}
				break;
				case 4:
				{
					$("#usermenu5").addClass("active");
					$("#tab_1_5").addClass("active");
					$("#profile-title").html('<i class="fa fa-list font-green-sharp"></i><span class="caption-subject font-green-sharp bold uppercase">积分对账管理</span>');
					$("#mainFrame").find(".btn-add").hide();
					$("#mainFrame").find(".btn-remove").hide();
					$("#mainFrame").find(".btn-search").show();
					$("#mainFrame").find(".btn-refresh").hide();
					$("#mainFrame").find(".btn-export").show();
					this.loadMoneyList();
				}
				break;
				case 5:
				{
					$("#usermenu6").addClass("active");
					$("#tab_1_6").addClass("active");
					$("#profile-title").html('<i class="fa fa-list-alt font-green-sharp"></i><span class="caption-subject font-green-sharp bold uppercase">审计日志管理</span>');
					$("#mainFrame").find(".btn-add").hide();
					$("#mainFrame").find(".btn-remove").hide();
					$("#mainFrame").find(".btn-search").show();
					$("#mainFrame").find(".btn-refresh").hide();
					$("#mainFrame").find(".btn-export").show();
					this.loadAuditList();
				}
				break;
				case 6:
				{
					$("#usermenu7").addClass("active");
					$("#tab_1_7").addClass("active");
					$("#profile-title").html('<i class="fa fa-puzzle-piece font-green-sharp"></i><span class="caption-subject font-green-sharp bold uppercase">积分应用管理</span>');
					$("#mainFrame").find(".btn-add").show();
					$("#mainFrame").find(".btn-remove").show();
					$("#mainFrame").find(".btn-search").hide();
					$("#mainFrame").find(".btn-refresh").hide();
					$("#mainFrame").find(".btn-export").hide();
					this.loadAppList();
				}
				break;
			}
		},
			
		doMis:function(orderid){
			$.ajax({
					type: 'get',
					url: "srv/getDetailData.tjs?orderid="+orderid,
					dataType: "json",
					context:this,
					error: function (result) {
						alert("远程服务故障，请检查网络或稍后再试！");
					},
					success: function (result) {
						if(!result.flag){
							toastr["error"](result.text,"查询积分订单详情失败");
							return;
						}
						//
						bootbox.dialog({
										message: '<form class="form-horizontal" role="form">'
												+'	<div class="form-body">'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">操作姓名：</label>'
												+'			<div class="col-sm-10" style="padding-left: 0;">'
												+'				<input id="orderNo" type="hidden" class="form-control" value="'+result.data.T_OrderNo+'"/>'
												+'				<input id="orderCreated" class="form-control" value="'+result.data.T_OrderCreated+'" disabled="disabled"/>'
												+'			</div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">积分标题：</label>'
												+'			<div class="col-sm-10" style="padding-left: 0;"><input id="orderSubject" class="form-control" value="'+result.data.T_Subject+'"  disabled="disabled"/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">积分描述：</label>'
												+'			<div class="col-sm-10" style="padding-left: 0;"><textarea id="orderBody" class="form-control" rows="3"  disabled="disabled">'+unescape(unescape(result.data.T_Body))+'</textarea></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">违规鉴定：</label>'
												+'			<div class="col-sm-10" style="padding-left: 0;"><textarea id="orderDescription" class="form-control" placeholder="请输入违规鉴定说明..." rows="3"></textarea></div>'
												+'		</div>'
												+'	</div>'
												+'</form>',
										title: "违规行为处理",
										buttons: {
										  success: {
											label: "确定",
											className: "green",
											callback: function() { 
												var orderNo=$('#orderNo').prop("value");
												var orderDescription=$('#orderDescription').prop("value");
												//
												if(orderDescription=="")
												{
													toastr["warning"]("没有输入违规鉴定说明！","违规行为处理");
													return;
												}
												//
												$.ajax({
															type: 'POST',
															url: "srv/orderUserRefund.tjs",
															data: {
																	orderno:orderNo,
																	description:orderDescription
																},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"违规行为处理失败");
																	return;
																}
																//
																App.loadOrderList();
															}
													});
											}
										  },
										  cancel: {
											label: "取消",
											className: "red",
											callback: function() {

											}
										  }
										}
									});
						//
						handleUniform();
					}
				});
		},

		
		doDetail:function(orderid){
			$.ajax({
						type: 'get',
						url: "srv/getDetailData.tjs?orderid="+orderid,
						dataType: "json",
						context:this,
						error: function (result) {
							alert("远程服务故障，请检查网络或稍后再试！");
						},
						success: function (result) {
							if(!result.flag){
								toastr["error"](result.text,"查询积分订单详情失败");
								return;
							}
							//
							var orderType=['关注','赞同','交流','参与','创造','赠予','扣除','违规'];
							//
							var rrHtml="";
							if(result.data.T_Refund>0)
							{
								 rrHtml='<tr>'
										+'	<td align="center"> 变动原因 </td>'
										+'	<td colspan="3">'
										+'		<span class="text-muted"> '+result.data.T_Description+' </span>'
										+'	</td>';
										+'</tr>';
							}
							//
							var eHtml='<div class="row">'
									+'	<div class="col-md-12">'
									+'		<div class="portlet" style="margin-bottom: 0;">'
									+'			<div class="portlet-body">'
									+'				<div class="table-scrollable">'
									+'					<table id="user" class="table table-bordered">'
									+'						<tbody>'
									+'							<tr>'
									+'								<td align="center" width="80px"> 积分单号 </td>'
									+'								<td>'
									+'									<span class="text-muted"> '+result.data.T_OrderNo+' </span>'
									+'								</td>'
									+'								<td align="center" width="80px"> 积分账户 </td>'
									+'								<td>'
									+'									<span class="text-muted"> '+result.data.T_FullName+' </span>'
									+'								</td>'
									+'							</tr>'
									+'							<tr>'
									+'								<td align="center"> 积分主题 </td>'
									+'								<td>'
									+'									<span class="text-muted"> '+result.data.T_Subject+' </span>'
									+'								</td>'
									+'								<td align="center"> 积分类型 </td>'
									+'								<td>'
									+'									<span class="text-muted"> '+orderType[result.data.T_Type-1]+' </span>'
									+'								</td>'
									+'							</tr>'
									+'							<tr>'
									+'								<td align="center"> 积分描述 </td>'
									+'								<td colspan="3">'
									+'									<span class="text-muted"> '+result.data.T_Body+' </span>'
									+'								</td>'
									+'							</tr>'
									+'							<tr>'
									+'								<td align="center"> 产生积分 </td>'
									+'								<td>'
									+'									<span class="text-muted"> '+TUI.Utils.formatNumber(result.data.T_Paid,"#,##0")+' </span>'
									+'								</td>'
									+'								<td align="center"> 产生时间 </td>'
									+'								<td>'
									+'									<span class="text-muted"> '+result.data.T_OrderTime+' </span>'
									+'								</td>'
									+'							</tr>'
									+'							<tr>'
									+'								<td align="center"> 扣除积分 </td>'
									+'								<td>'
									+'									<span class="text-success"> '+TUI.Utils.formatNumber(result.data.T_Refund,"#,##0")+' </span>'
									+'								</td>'
									+'								<td align="center"> 扣除时间 </td>'
									+'								<td>'
									+'									<span class="text-muted"> '+(result.data.T_Refund>0?result.data.T_RefundTime:"——")+' </span>'
									+'								</td>'
									+'							</tr>'+rrHtml
									+'							<tr>'
									+'								<td align="center"> 结余积分 </td>'
									+'								<td>'
									+'									<span class="text-danger"> '+TUI.Utils.formatNumber(result.data.T_UserScore,"#,##0")+' </span>'
									+'								</td align="center">'
									+'								<td align="center"> 创建用户 </td>'
									+'								<td>'
									+'									<span class="text-muted"> '+result.data.T_OrderCreated+' </span>'
									+'								</td>'
									+'							</tr>'
									+'						</tbody>'
									+'					</table>'
									+'				</div>'
									+'			</div>'
									+'		</div>'
									+'	</div>'
									+'</div>';
							
							bootbox.dialog({
								message: '<form class="form-horizontal" role="form">'
										+'	<div class="form-body">'
										+		eHtml
										+'	</div>'
										+'</form>',
								title: "积分交易详情",
								buttons: {
								  cancel: {
									label: "关闭",
									className: "red",
									callback: function() {
									
									}
								  }
								}
							});
						}
				});
		},


		doExport:function(){
			switch(this.doType)
			{
				case 0:
				{

				}
				break;
				case 1:
				{
					window.open('srv/exportOrderList.tjs?selPayApp='+App.selPayApp.join(",")
														+"&selOrderType="+App.selOrderType.join(",")
														+"&selOrderUser="+App.selOrderUser.join(",")
														+"&startTime="+App.startTime.Format('yyyy-MM-dd')
														+"&endTime="+App.endTime.Format('yyyy-MM-dd'));
				}
				break;
				case 2:
				{

				}
				break;
				case 3:
				{
				}
				break;
				case 4:
				{
					window.open('srv/exportMoneyList.tjs?selPayApp='+App.selPayApp.join(",")
														+"&selOrderType="+App.selOrderType.join(",")
														+"&selOrderUser="+App.selOrderUser.join(",")
														+'&startTime='+App.moneyTime1.Format('yyyy-MM-dd')
														+'&endTime='+App.moneyTime2.Format('yyyy-MM-dd'));
				}
				break;
				case 5:
				{
					window.open('srv/exportAuditList.tjs?selAppName='+App.selAppName.join(",")
														+'&selLogLevel='+App.selLogLevel.join(",")
														+'&startTime='+App.startTime.Format('yyyy-MM-dd')
														+'&endTime='+App.endTime.Format('yyyy-MM-dd'));
				}
				break;
				case 6:
				{
				}
				break;
			}
		},

		doSearch:function(){
			switch(this.doType)
			{
				case 0:
				{
					var appHtml='<option></option>';
					for(var i=0;i<App.AppData.length;i++)
					{
						var bSelect=false;
						for(var j=0;j<App.selPayApp.length;j++)
						{
							if(App.AppData[i].T_AppID==App.selPayApp[j])
							{
								bSelect=true;
								break;
							}
						}
						//
						if(bSelect)
							appHtml+=('<option value="'+App.AppData[i].T_AppID+'" selected>'+App.AppData[i].T_AppName+'</option>');
						else
							appHtml+=('<option value="'+App.AppData[i].T_AppID+'">'+App.AppData[i].T_AppName+'</option>');
					}
					//
					var statusHtml='<option></option>';
					var orderType=['关注','赞同','交流','参与','创造','赠予','扣除','违规'];
					for(var i=0;i<orderType.length;i++)
					{
						var bSelect=false;
						for(var j=0;j<App.selOrderType.length;j++)
						{
							if((i+1)==App.selOrderType[j])
							{
								bSelect=true;
								break;
							}
						}
						//
						if(bSelect)
							statusHtml+=('<option value="'+(i+1)+'" selected>'+orderType[i]+'</option>');
						else
							statusHtml+=('<option value="'+(i+1)+'">'+orderType[i]+'</option>');
					}
					//
					var userHtml='<option></option>';
					for(var i=0;i<App.selOrderUser.length;i++)
					{
						userHtml+=('<option value="'+App.selOrderUser[i]+'" selected>'+App.selOrderUser[i]+'</option>');
					}
					//
					bootbox.dialog({
									message: '<form class="form-horizontal" role="form">'
											+'	<div class="form-body">'
											+'		<div class="form-group">'
											+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">积分应用:</label>'
											+'			<div class="col-sm-8">'
                                            +'				<select class="form-control select2" multiple id="applist">'+appHtml+'</select>'
											+'			</div>'
											+'		</div>'
											+'		<div class="form-group">'
											+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">积分类型:</label>'
											+'			<div class="col-sm-8">'
                                            +'				<select class="form-control select2" multiple id="OrderType">'+statusHtml+'</select>'
											+'			</div>'
											+'		</div>'
											+'		<div class="form-group">'
											+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">积分账户:</label>'
											+'			<div class="col-sm-8">'
											+'				<select id="OrderUser" class="form-control data-select" multiple data-type="OrderUser">'+userHtml+'</select>'
											+'			</div>'
											+'		</div>'
											+'		<div class="form-group">'
                                            +'			<label class="control-label col-sm-3">开始时间:</label>'
                                            +'			<div class="col-sm-8">'
                                            +'				<div class="input-group date form_meridian_datetime"  data-date-format="yyyy-mm-dd">'
                                            +'					<input type="text" size="16" readonly class="form-control" id="startTime" value="'+App.startTime.Format('yyyy-MM-dd')+'">'
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
                                            +'					<input type="text" size="16" readonly class="form-control" id="endTime"  value="'+App.endTime.Format('yyyy-MM-dd')+'">'
                                            +'					<span class="input-group-btn">'
                                            +'						<button class="btn default date-set" type="button">'
                                            +'							<i class="fa fa-calendar"></i>'
                                            +'						</button>'
                                            +'					</span>'
                                            +'				</div>'
                                            +'			</div>'
											+'		</div>'
											+'		<div class="form-group">'
											+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">统计方式:</label>'
											+'			<div class="col-sm-8">'
											+'				<div class="radio-list">'
											+'					<label class="radio-inline">'
											+'						<input type="radio" name="kpiType" value="hour" '+(App.kpiType=="hour"?"checked":"")+'> 按逐时统计</label>'
											+'					<label class="radio-inline">'
											+'						<input type="radio" name="kpiType" value="day" '+(App.kpiType=="day"?"checked":"")+'> 按逐日统计 </label>'
											+'					<label class="radio-inline">'
											+'						<input type="radio" name="kpiType" value="month" '+(App.kpiType=="month"?"checked":"")+'> 按逐月统计 </label>'
											+'				</div>'
											+'			</div>'
											+'		</div>'
											+'	</div>'
											+'</form>',
									title: "选择汇总条件",
									buttons: {
									  success: {
										label: "确定",
										className: "green",
										callback: function() {
											App.startTime=TUI.Utils.parseDate($("#startTime").val());
											App.endTime=TUI.Utils.parseDate($("#endTime").val());
											App.kpiType=$('input:radio[name=kpiType]:checked').val();

											App.selPayApp=$("#applist").val();
											if(App.selPayApp==null)
												App.selPayApp=[];

											App.selOrderType=$("#OrderType").val();
											if(App.selOrderType==null)
												App.selOrderType=[];

											App.selOrderUser=$("#OrderUser").val();
											if(App.selOrderUser==null)
												App.selOrderUser=[];

											App.loadOrderKpi();
										}
									  },
									  cancel: {
										label: "取消",
										className: "red",
										callback: function() {}
									  }
									}
								});
					//
					App.initAjax();
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
					$('#OrderUser').parents('.bootbox').removeAttr('tabindex');
					var selectType=""
					$("#OrderUser").select2({
						width: "off",
						id : function(rs) {  
								return rs.id;  
							},
						multiple: true,
						ajax: {
							url: "srv/getSelectData.tjs",
							dataType: 'json',
							delay: 250,
							contentType: "application/x-www-form-urlencoded; charset=utf-8", 
							data: function(params) {
								return {
									term: params.term, // search term
									selectType: selectType
								};
							},
							processResults: function(data, page) {
								// parse the results into the format expected by Select2.
								// since we are using custom formatting functions we do not need to
								// alter the remote JSON data
								return {
									results: data
								};
							},
							cache: true
						},
						escapeMarkup: function(markup) {
							return markup;
						}, // let our custom formatter work
						placeholder:placeholder,
						maximumSelectionLength: 10,
						minimumInputLength: 1,
						templateResult: function (data) { return data.text; },
						templateSelection: function (data) { return data.text; }
					}).on("select2:open",function(e){ 
							selectType=$(this).data('type');
					});

					$("button[data-select2-open]").click(function() {

						$("#" + $(this).data("select2-open")).select2("open");
					});

					$(".select2, .select2-multiple, .select2-allow-clear, .data-select").on("select2:open", function() {
						if ($(this).parents("[class*='has-']").length) {
							var classNames = $(this).parents("[class*='has-']")[0].className.split(/\s+/);

							for (var i = 0; i < classNames.length; ++i) {
								if (classNames[i].match("has-")) {
									$("body > .select2-container").addClass(classNames[i]);
								}
							}
						}
					});

					$(".js-btn-set-scaling-classes").on("click", function() {
						$("#select2-multiple-input-sm, #select2-single-input-sm").next(".select2-container--bootstrap").addClass("input-sm");
						$("#select2-multiple-input-lg, #select2-single-input-lg").next(".select2-container--bootstrap").addClass("input-lg");
						$(this).removeClass("btn-primary btn-outline").prop("disabled", true);
					});
					//
					if (jQuery().datepicker) {
						$(".form_meridian_datetime").datepicker({
							language: 'zh-CN',
							rtl: App.isRTL(),
							format: 'yyyy-mm-dd',
							autoclose: true,
							todayBtn: false,
							pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
						});

						$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
					}
				}
				break;
				case 1:
				{
					var appHtml='<option></option>';
					for(var i=0;i<App.AppData.length;i++)
					{
						var bSelect=false;
						for(var j=0;j<App.selPayApp.length;j++)
						{
							if(App.AppData[i].T_AppID==App.selPayApp[j])
							{
								bSelect=true;
								break;
							}
						}
						//
						if(bSelect)
							appHtml+=('<option value="'+App.AppData[i].T_AppID+'" selected>'+App.AppData[i].T_AppName+'</option>');
						else
							appHtml+=('<option value="'+App.AppData[i].T_AppID+'">'+App.AppData[i].T_AppName+'</option>');
					}
					//
					var statusHtml='<option></option>';
					var orderType=['关注','赞同','交流','参与','创造','赠予','扣除','违规'];
					for(var i=0;i<orderType.length;i++)
					{
						var bSelect=false;
						for(var j=0;j<App.selOrderType.length;j++)
						{
							if((i+1)==App.selOrderType[j])
							{
								bSelect=true;
								break;
							}
						}
						//
						if(bSelect)
							statusHtml+=('<option value="'+(i+1)+'" selected>'+orderType[i]+'</option>');
						else
							statusHtml+=('<option value="'+(i+1)+'">'+orderType[i]+'</option>');
					}
					//
					var userHtml='<option></option>';
					for(var i=0;i<App.selOrderUser.length;i++)
					{
						userHtml+=('<option value="'+App.selOrderUser[i]+'" selected>'+App.selOrderUser[i]+'</option>');
					}
					//
					bootbox.dialog({
									message: '<form class="form-horizontal form-bordered" role="form">'
											+'	<div class="form-body">'
											+'		<div class="form-group">'
											+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">积分应用:</label>'
											+'			<div class="col-sm-8">'
                                            +'				<select class="form-control select2" multiple id="applist">'+appHtml+'</select>'
											+'			</div>'
											+'		</div>'
											+'		<div class="form-group">'
											+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">积分类型:</label>'
											+'			<div class="col-sm-8">'
                                            +'				<select class="form-control select2" multiple id="OrderType">'+statusHtml+'</select>'
											+'			</div>'
											+'		</div>'
											+'		<div class="form-group">'
											+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">积分账户:</label>'
											+'			<div class="col-sm-8">'
											+'				<select id="OrderUser" class="form-control data-select" multiple data-type="OrderUser">'+userHtml+'</select>'
											+'			</div>'
											+'		</div>'
											+'		<div class="form-group">'
                                            +'			<label class="control-label col-sm-3">开始时间:</label>'
                                            +'			<div class="col-sm-8">'
                                            +'				<div class="input-group date form_meridian_datetime"  data-date-format="yyyy-mm-dd">'
                                            +'					<input type="text" size="16" readonly class="form-control" id="startTime" value="'+App.startTime.Format('yyyy-MM-dd')+'">'
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
                                            +'					<input type="text" size="16" readonly class="form-control" id="endTime"  value="'+App.endTime.Format('yyyy-MM-dd')+'">'
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
									title: "订单筛选",
									onEscape:function() {},
									buttons: {
									  success: {
										label: "确定",
										className: "green",
										callback: function() {
											//获取参数
											App.startTime=TUI.Utils.parseDate($("#startTime").val());
											App.endTime=TUI.Utils.parseDate($("#endTime").val());

											App.selPayApp=$("#applist").val();
											if(App.selPayApp==null)
												App.selPayApp=[];

											App.selOrderType=$("#OrderType").val();
											if(App.selOrderType==null)
												App.selOrderType=[];

											App.selOrderUser=$("#OrderUser").val();
											if(App.selOrderUser==null)
												App.selOrderUser=[];

											App.oTable1.ajax.url( 'srv/getOrderList.tjs?selPayApp='+App.selPayApp.join(",")
																						+"&selOrderType="+App.selOrderType.join(",")
																						+"&selOrderUser="+App.selOrderUser.join(",")
																						+"&startTime="+App.startTime.Format('yyyy-MM-dd')
																						+"&endTime="+App.endTime.Format('yyyy-MM-dd')).load();


										}
									  },
									  cancel: {
										label: "取消",
										className: "red",
										callback: function() {}
									  }
									}
								});

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
								//mode 下SELECT2 无法获得焦点
								$('#OrderUser').parents('.bootbox').removeAttr('tabindex');
								var selectType=""
								$("#OrderUser").select2({
									width: "off",
									id : function(rs) {  
											return rs.id;  
										},
									multiple: true,
									ajax: {
										url: "srv/getSelectData.tjs",
										dataType: 'json',
										delay: 250,
										contentType: "application/x-www-form-urlencoded; charset=utf-8", 
										data: function(params) {
											return {
												term: params.term, // search term
												selectType: selectType
											};
										},
										processResults: function(data, page) {
											// parse the results into the format expected by Select2.
											// since we are using custom formatting functions we do not need to
											// alter the remote JSON data
											return {
												results: data
											};
										},
										cache: true
									},
									escapeMarkup: function(markup) {
										return markup;
									}, // let our custom formatter work
									placeholder:placeholder,
									maximumSelectionLength: 10,
									minimumInputLength: 1,
									templateResult: function (data) { return data.text; },
									templateSelection: function (data) { return data.text; }
								}).on("select2:open",function(e){ 
										selectType=$(this).data('type');
								});

								$("button[data-select2-open]").click(function() {

									$("#" + $(this).data("select2-open")).select2("open");
								});

								$(".select2, .select2-multiple, .select2-allow-clear, .data-select").on("select2:open", function() {
									if ($(this).parents("[class*='has-']").length) {
										var classNames = $(this).parents("[class*='has-']")[0].className.split(/\s+/);

										for (var i = 0; i < classNames.length; ++i) {
											if (classNames[i].match("has-")) {
												$("body > .select2-container").addClass(classNames[i]);
											}
										}
									}
								});

								$(".js-btn-set-scaling-classes").on("click", function() {
									$("#select2-multiple-input-sm, #select2-single-input-sm").next(".select2-container--bootstrap").addClass("input-sm");
									$("#select2-multiple-input-lg, #select2-single-input-lg").next(".select2-container--bootstrap").addClass("input-lg");
									$(this).removeClass("btn-primary btn-outline").prop("disabled", true);
								});
								//
								if (jQuery().datepicker) {
									$(".form_meridian_datetime").datepicker({
										language: 'zh-CN',
										rtl: App.isRTL(),
										format: 'yyyy-mm-dd',
										autoclose: true,
										todayBtn: false,
										pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
									});

									$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
								}

				}
				break;
				case 2:
				{

				}
				break;
				case 3:
				{

				}
				break;
				case 4:
				{
					var appHtml='<option></option>';
					for(var i=0;i<App.AppData.length;i++)
					{
						var bSelect=false;
						for(var j=0;j<App.selPayApp.length;j++)
						{
							if(App.AppData[i].T_AppID==App.selPayApp[j])
							{
								bSelect=true;
								break;
							}
						}
						//
						if(bSelect)
							appHtml+=('<option value="'+App.AppData[i].T_AppID+'" selected>'+App.AppData[i].T_AppName+'</option>');
						else
							appHtml+=('<option value="'+App.AppData[i].T_AppID+'">'+App.AppData[i].T_AppName+'</option>');
					}
					//
					var statusHtml='<option></option>';
					var orderType=['关注','赞同','交流','参与','创造','赠予','扣除','违规'];
					for(var i=0;i<orderType.length;i++)
					{
						var bSelect=false;
						for(var j=0;j<App.selOrderType.length;j++)
						{
							if((i+1)==App.selOrderType[j])
							{
								bSelect=true;
								break;
							}
						}
						//
						if(bSelect)
							statusHtml+=('<option value="'+(i+1)+'" selected>'+orderType[i]+'</option>');
						else
							statusHtml+=('<option value="'+(i+1)+'">'+orderType[i]+'</option>');
					}
					//
					var userHtml='<option></option>';
					for(var i=0;i<App.selOrderUser.length;i++)
					{
						userHtml+=('<option value="'+App.selOrderUser[i]+'" selected>'+App.selOrderUser[i]+'</option>');
					}
					//
					bootbox.dialog({
									message: '<form class="form-horizontal" role="form">'
											+'	<div class="form-body">'
											+'		<div class="form-group">'
											+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">积分应用:</label>'
											+'			<div class="col-sm-8">'
                                            +'				<select class="form-control select2" multiple id="applist">'+appHtml+'</select>'
											+'			</div>'
											+'		</div>'
											+'		<div class="form-group">'
											+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">积分类型:</label>'
											+'			<div class="col-sm-8">'
                                            +'				<select class="form-control select2" multiple id="OrderType">'+statusHtml+'</select>'
											+'			</div>'
											+'		</div>'
											+'		<div class="form-group">'
											+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">积分账户:</label>'
											+'			<div class="col-sm-8">'
											+'				<select id="OrderUser" class="form-control data-select" multiple data-type="OrderUser">'+userHtml+'</select>'
											+'			</div>'
											+'		</div>'
											+'		<div class="form-group">'
                                            +'			<label class="control-label col-sm-3">开始时间:</label>'
                                            +'			<div class="col-sm-8">'
                                            +'				<div class="input-group date form_meridian_datetime"  data-date-format="yyyy-mm-dd">'
                                            +'					<input type="text" size="16" readonly class="form-control" id="startTime" value="'+App.moneyTime1.Format('yyyy-MM-dd')+'">'
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
                                            +'					<input type="text" size="16" readonly class="form-control" id="endTime"  value="'+App.moneyTime2.Format('yyyy-MM-dd')+'">'
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
											App.moneyTime1=TUI.Utils.parseDate($("#startTime").val());
											App.moneyTime2=TUI.Utils.parseDate($("#endTime").val());
											
											App.selPayApp=$("#applist").val();
											if(App.selPayApp==null)
												App.selPayApp=[];
											

											App.selOrderType=$("#OrderType").val();
											if(App.selOrderType==null)
												App.selOrderType=[];

											App.selOrderUser=$("#OrderUser").val();
											if(App.selOrderUser==null)
												App.selOrderUser=[];

											App.oTable4.ajax.url( 'srv/getMoneyList.tjs?selPayApp='+App.selPayApp.join(",")
																						+"&selOrderType="+App.selOrderType.join(",")
																						+'&selOrderUser='+App.selOrderUser.join(",")
																						+'&startTime='+App.moneyTime1.Format('yyyy-MM-dd')
																						+'&endTime='+App.moneyTime2.Format('yyyy-MM-dd')).load();
										}
									  },
									  cancel: {
										label: "取消",
										className: "red",
										callback: function() {}
									  }
									}
								});
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
					//mode 下SELECT2 无法获得焦点
					$('#OrderUser').parents('.bootbox').removeAttr('tabindex');
					var selectType=""
					$("#OrderUser").select2({
						width: "off",
						id : function(rs) {  
								return rs.id;  
							},
						multiple: true,
						ajax: {
							url: "srv/getSelectData.tjs",
							dataType: 'json',
							delay: 250,
							contentType: "application/x-www-form-urlencoded; charset=utf-8", 
							data: function(params) {
								return {
									term: params.term, // search term
									selectType: selectType
								};
							},
							processResults: function(data, page) {
								// parse the results into the format expected by Select2.
								// since we are using custom formatting functions we do not need to
								// alter the remote JSON data
								return {
									results: data
								};
							},
							cache: true
						},
						escapeMarkup: function(markup) {
							return markup;
						}, // let our custom formatter work
						placeholder:placeholder,
						maximumSelectionLength: 10,
						minimumInputLength: 1,
						templateResult: function (data) { return data.text; },
						templateSelection: function (data) { return data.text; }
					}).on("select2:open",function(e){ 
							selectType=$(this).data('type');
					});

					$("button[data-select2-open]").click(function() {

						$("#" + $(this).data("select2-open")).select2("open");
					});

					$(".select2, .select2-multiple, .select2-allow-clear, .data-select").on("select2:open", function() {
						if ($(this).parents("[class*='has-']").length) {
							var classNames = $(this).parents("[class*='has-']")[0].className.split(/\s+/);

							for (var i = 0; i < classNames.length; ++i) {
								if (classNames[i].match("has-")) {
									$("body > .select2-container").addClass(classNames[i]);
								}
							}
						}
					});

					$(".js-btn-set-scaling-classes").on("click", function() {
						$("#select2-multiple-input-sm, #select2-single-input-sm").next(".select2-container--bootstrap").addClass("input-sm");
						$("#select2-multiple-input-lg, #select2-single-input-lg").next(".select2-container--bootstrap").addClass("input-lg");
						$(this).removeClass("btn-primary btn-outline").prop("disabled", true);
					});
					//
					if (jQuery().datepicker) {
						$(".form_meridian_datetime").datepicker({
							language: 'zh-CN',
							rtl: App.isRTL(),
							format: 'yyyy-mm-dd',
							autoclose: true,
							todayBtn: false,
							pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
						});

						$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
					}
				}
				break;
				case 5:
				{
					var appHtml='<option></option>';
					for(var i=0;i<App.AppData.length;i++)
					{
						var bSelect=false;
						for(var j=0;j<App.selPayApp.length;j++)
						{
							if(App.AppData[i].T_AppID==App.selPayApp[j])
							{
								bSelect=true;
								break;
							}
						}
						//
						if(bSelect)
							appHtml+=('<option value="'+App.AppData[i].T_AppID+'" selected>'+App.AppData[i].T_AppName+'</option>');
						else
							appHtml+=('<option value="'+App.AppData[i].T_AppID+'">'+App.AppData[i].T_AppName+'</option>');
					}
					//
					var logHtml='<option></option>';
					var logLevel=["普通","成功","通知","告警","严重"];
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
											+'			<label class="col-sm-3 control-label" for="formGroupInputSmall">积分应用:</label>'
											+'			<div class="col-sm-8">'
                                            +'				<select class="form-control select2" multiple id="applist">'+appHtml+'</select>'
											+'			</div>'
											+'		</div>'
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
                                            +'					<input type="text" size="16" readonly class="form-control" id="startTime" value="'+App.startTime.Format('yyyy-MM-dd')+'">'
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
                                            +'					<input type="text" size="16" readonly class="form-control" id="endTime"  value="'+App.endTime.Format('yyyy-MM-dd')+'">'
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
											App.startTime=TUI.Utils.parseDate($("#startTime").val());
											App.endTime=TUI.Utils.parseDate($("#endTime").val());
											
											App.selPayApp=$("#applist").val();
											if(App.selPayApp==null)
												App.selPayApp=[];

											App.selLogLevel=$("#loglevel").val();
											if(App.selLogLevel==null)
												App.selLogLevel=[];

											for(var i=0;i<App.selPayApp.length;i++)
											{
												for(var j=0;j<App.AppData.length;j++)
												{
													if(App.AppData[j].T_AppID==App.selPayApp[i])
													{
														App.selAppName[i]=App.AppData[j].T_AppName;
														break;
													}
												}
											}
											
											App.oTable5.ajax.url('srv/getAuditList.tjs?selAppName='+App.selAppName.join(",")
																						+'&selLogLevel='+App.selLogLevel.join(",")
																						+'&startTime='+App.startTime.Format('yyyy-MM-dd')
																						+'&endTime='+App.endTime.Format('yyyy-MM-dd')).load();
										}
									  },
									  cancel: {
										label: "取消",
										className: "red",
										callback: function() {}
									  }
									}
								});
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
					//mode 下SELECT2 无法获得焦点
					//
					if (jQuery().datepicker) {
						$(".form_meridian_datetime").datepicker({
							language: 'zh-CN',
							rtl: App.isRTL(),
							format: 'yyyy-mm-dd',
							autoclose: true,
							todayBtn: false,
							pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
						});

						$('body').removeClass("modal-open");
					}
				}
				break;
				case 6:
				{

				}
				break;
			}
		},

		doConfig:function(type){
			if(this.doType==2)
			{
			}
			else if(this.doType==3)
			{
				switch(type)
				{
					case 0:
					{
						var appHtml='<option></option>';
						for(var i=0;i<App.AppData.length;i++)
						{
							var bSelect=false;
							for(var j=0;j<App.selPayApp.length;j++)
							{
								if(App.AppData[i].T_AppID==App.selPayApp[j])
								{
									bSelect=true;
									break;
								}
							}
							//
							if(bSelect)
								appHtml+=('<option value="'+App.AppData[i].T_AppID+'" selected>'+App.AppData[i].T_AppName+'</option>');
							else
								appHtml+=('<option value="'+App.AppData[i].T_AppID+'">'+App.AppData[i].T_AppName+'</option>');
						}
						//
						bootbox.dialog({
										message: '<form class="form-horizontal" role="form">'
												+'	<div class="form-body">'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">活动名称：</label>'
												+'			<div class="col-sm-10" style="padding-left: 0;"><input id="activityName" class="form-control" placeholder="请输入积分活动名称..."/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">活动应用：</label>'
												+'			<div class="col-sm-10" style="padding-left: 0;"><select class="form-control select2" id="applist">'+appHtml+'</select></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">积分翻倍：</label>'
												+'			<div class="col-sm-10" style="padding-left: 0;"><input id="activityDouble" type="number" class="form-control" placeholder="请输入活动积分翻倍量..."/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">生效时间：</label>'
												+'			<div class="col-sm-10" style="padding: 0 15px 0 0;">'
												+'				<div class="input-group date form_meridian_datetime"  data-date-format="yyyy-mm-dd">'
												+'					<input type="text" size="16" readonly class="form-control" id="startTime" value="'+(new Date()).Format('yyyy-MM-dd')+'">'
												+'					<span class="input-group-btn">'
												+'						<button class="btn default date-set" type="button">'
												+'							<i class="fa fa-calendar"></i>'
												+'						</button>'
												+'					</span>'
												+'				</div>'
												+'			</div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">结束时间：</label>'
												+'			<div class="col-sm-10" style="padding: 0 15px 0 0;">'
												+'				<div class="input-group date form_meridian_datetime"  data-date-format="yyyy-mm-dd">'
												+'					<input type="text" size="16" readonly class="form-control" id="endTime" value="'+(new Date()).Format('yyyy-MM-dd')+'">'
												+'					<span class="input-group-btn">'
												+'						<button class="btn default date-set" type="button">'
												+'							<i class="fa fa-calendar"></i>'
												+'						</button>'
												+'					</span>'
												+'				</div>'
												+'			</div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">活动单位：</label>'
												+'			<div class="col-sm-10" style="padding-left: 0;"><input id="activityCreated" class="form-control" placeholder="请输入活动单位名称..."/></div>'
												+'		</div>'
												+'	</div>'
												+'</form>',
										title: "添加积分活动",
										buttons: {
										  success: {
											label: "确定",
											className: "green",
											callback: function() { 
												var activityName=$('#activityName').prop("value");
												var activityDouble=$('#activityDouble').prop("value");
												var startTime=$('#startTime').prop("value");
												var endTime=$('#endTime').prop("value");
												var activityCreated=$('#activityCreated').prop("value");
												var appID=$("#applist").val();
												//
												if(activityName=="")
												{
													toastr["warning"]("没有活动名称！","添加积分活动");
													return;
												}
												//
												if(activityDouble=="")
												{
													toastr["warning"]("没有积分活动翻倍量！","添加积分活动");
													return;
												}
												//
												if(startTime=="")
												{
													toastr["warning"]("没有积分活动生效时间！","添加积分活动");
													return;
												}
												//
												if(endTime=="")
												{
													toastr["warning"]("没有积分活动结束时间！","添加积分活动");
													return;
												}
												//
												if(activityCreated=="")
												{
													toastr["warning"]("没有积分活动单位！","添加积分活动");
													return;
												}
												//
												$.ajax({
															type: 'post',
															url: "srv/doActivity.tjs",
															data: {
																	todo:0,
																	activityID:"ts"+TUI.Utils.hex_sha1(appID+new Date()).substring(0,16),
																	activityName:activityName,
																	activityDouble:activityDouble,
																	startTime:startTime,
																	endTime:endTime,
																	activityCreated:activityCreated,
																	appID:appID
																},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"添加积分活动失败");
																	return;
																}
																//
																App.loadActivelyList();
															}
													});
											}
										  },
										  cancel: {
											label: "取消",
											className: "red",
											callback: function() {

											}
										  }
										}
									});
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
								todayBtn: false,
								pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
							});

							$('body').removeClass("modal-open");
						}
						//
						handleUniform();
					}
					break;
					case 2:
					{
						var activityList=[];
						$("input[name='selActivityID']:checked").each(function () {
							activityList[activityList.length]={
															id:$(this).attr("id"),
															name:this.value
													   };
						});

						if(activityList.length==0)
						{
							toastr["error"]("请首先选中需要删除的积分活动！！","删除选中积分活动失败");
							return;
						}

						bootbox.dialog({
											message: '您确定要删除当前选中的'+activityList.length+'个积分活动？',
											title: "删除积分应用",
											buttons: {
											  success: {
												label: "确定",
												className: "red",
												callback: function() { 
													$.ajax({
																type: 'post',
																url: "srv/doActivity.tjs",
																data: {todo:2,activityList:TUI.JSON.encode(activityList)},
																dataType: "json",
																context:this,
																error: function (result) {
																	alert("远程服务故障，请检查网络或稍后再试！");
																},
																success: function (result) {
																	if(!result.flag)
																	{
																		toastr["error"](result.text,"删除选中积分活动失败");
																		return;
																	}
																	//
																	App.loadActivelyList();
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
					break;
				}
			}
			else if(this.doType==6)
			{
				switch(type)
				{
					case 0:
					{
							bootbox.dialog({
											message: '<form class="form-horizontal" role="form">'
													+'	<div class="form-body">'
													+'		<div class="form-group">'
													+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">积分应用名称：</label>'
													+'			<div class="col-sm-10" style="padding-left: 0;"><input id="appName" class="form-control" placeholder="请输入应用名称..."/></div>'
													+'		</div>'
													+'		<div class="form-group">'
													+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">支&nbsp;付&nbsp;应&nbsp;用&nbsp;ID：</label>'
													+'			<div class="col-sm-10" style="padding-left: 0;">'
													+'				<div class="input-group">'
													+'					<div class="input">'
													+'						<input id="appID" class="form-control" type="text" placeholder="请输入积分应用ID..."> </div>'
													+'					<span class="input-group-btn">'
													+'						<button id="genappid" class="btn btn-success" type="button">生成PAYID</button>'
													+'					</span>'
													+'				</div>'
													+'			</div>'
													+'		</div>'
													+'		<div class="form-group">'
													+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">积分应用密钥：</label>'
													+'			<div class="col-sm-10" style="padding-left: 0;">'
													+'				<div class="input-group">'
													+'					<div class="input">'
													+'						<input id="appSecret" class="form-control" type="text" placeholder="请输入积分应用密钥..."> </div>'
													+'					<span class="input-group-btn">'
													+'						<button id="genappsecret" class="btn btn-info" type="button">生&nbsp;成&nbsp;密&nbsp;钥</button>'
													+'					</span>'
													+'				</div>'
													+'			</div>'
													+'		</div>'
													+'	</div>'
													+'</form>',
											title: "添加积分应用",
											buttons: {
											  success: {
												label: "确定",
												className: "green",
												callback: function() { 
													var appName=$('#appName').prop("value");
													var appID=$('#appID').prop("value");
													var appSecret=$('#appSecret').prop("value");
													//
													if(appName=="")
													{
														toastr["warning"]("没有应用名称！","修改积分应用");
														return;
													}
													//
													if(appID=="")
													{
														toastr["warning"]("没有积分应用ID！","修改积分应用");
														return;
													}
													//
													if(appSecret=="")
													{
														toastr["warning"]("没有积分应用密钥！","修改积分应用");
														return;
													}
													//
													$.ajax({
																type: 'post',
																url: "srv/doApp.tjs",
																data: {
																		todo:0,
																		appID:appID,
																		appName:appName,
																		appSecret:appSecret
																	},
																dataType: "json",
																context:this,
																error: function (result) {
																	alert("远程服务故障，请检查网络或稍后再试！");
																},
																success: function (result) {
																	if(!result.flag)
																	{
																		toastr["error"](result.text,"添加积分应用失败");
																		return;
																	}
																	//
																	App.loadAppList();
																}
														});
												}
											  },
											  cancel: {
												label: "取消",
												className: "red",
												callback: function() {

												}
											  }
											}
										});
							//
							$("#genappid").bind(TUI.env.ua.clickEventDown, { handle: this }, function (event) {
								$('#appID').val("ts"+TUI.Utils.hex_sha1("payid"+new Date()).substring(0,16));
							});
							//
							$("#genappsecret").bind(TUI.env.ua.clickEventDown, { handle: this }, function (event) {
								$('#appSecret').val(TUI.Utils.hex_sha1("paypass"+new Date()));
							});
						//
						handleUniform();
					}
					break;
					case 2:
					{
						var appList=[];
						$("input[name='selAppID']:checked").each(function () {
							appList[appList.length]={
															id:$(this).attr("id"),
															name:this.value
													   };
						});

						if(appList.length==0)
						{
							toastr["error"]("请首先选中需要删除的积分应用！！","删除选中积分应用失败");
							return;
						}

						bootbox.dialog({
											message: '您确定要删除当前选中的'+appList.length+'个积分应用？',
											title: "删除积分应用",
											buttons: {
											  success: {
												label: "确定",
												className: "red",
												callback: function() { 
													$.ajax({
																type: 'post',
																url: "srv/doApp.tjs",
																data: {todo:2,appList:TUI.JSON.encode(appList)},
																dataType: "json",
																context:this,
																error: function (result) {
																	alert("远程服务故障，请检查网络或稍后再试！");
																},
																success: function (result) {
																	if(!result.flag)
																	{
																		toastr["error"](result.text,"删除选中积分应用失败");
																		return;
																	}
																	//
																	App.loadAppList();
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
					break;
				}
			}
			
		},
		
		doActivity:function(ActivityID,ActivityName,ActivityDouble,StartTime,EndTime,ActivityCreated,AppID){
			var appHtml='<option></option>';
			for(var i=0;i<App.AppData.length;i++)
			{
				if(App.AppData[i].T_AppID==AppID)
					appHtml+=('<option value="'+App.AppData[i].T_AppID+'" selected>'+App.AppData[i].T_AppName+'</option>');
				else
					appHtml+=('<option value="'+App.AppData[i].T_AppID+'">'+App.AppData[i].T_AppName+'</option>');
			}
			//
			bootbox.dialog({
							message: '<form class="form-horizontal" role="form">'
									+'	<div class="form-body">'
									+'		<div class="form-group">'
									+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">活动名称：</label>'
									+'			<div class="col-sm-10" style="padding-left: 0;"><input id="activityID" type="hidden" value="'+ActivityID+'"/><input id="activityName" class="form-control" placeholder="请输入积分活动名称..." value="'+ActivityName+'"/></div>'
									+'		</div>'
									+'		<div class="form-group">'
									+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">活动应用：</label>'
									+'			<div class="col-sm-10" style="padding-left: 0;"><select class="form-control select2" id="applist">'+appHtml+'</select></div>'
									+'		</div>'
									+'		<div class="form-group">'
									+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">积分翻倍：</label>'
									+'			<div class="col-sm-10" style="padding-left: 0;"><input id="activityDouble" type="number" class="form-control" placeholder="请输入活动积分翻倍量..." value="'+ActivityDouble+'"/></div>'
									+'		</div>'
									+'		<div class="form-group">'
									+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">生效时间：</label>'
									+'			<div class="col-sm-10" style="padding: 0 15px 0 0;">'
									+'				<div class="input-group date form_meridian_datetime"  data-date-format="yyyy-mm-dd">'
									+'					<input type="text" size="16" readonly class="form-control" id="startTime" value="'+TUI.Utils.parseDate(StartTime).Format('yyyy-MM-dd')+'">'
									+'					<span class="input-group-btn">'
									+'						<button class="btn default date-set" type="button">'
									+'							<i class="fa fa-calendar"></i>'
									+'						</button>'
									+'					</span>'
									+'				</div>'
									+'			</div>'
									+'		</div>'
									+'		<div class="form-group">'
									+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">结束时间：</label>'
									+'			<div class="col-sm-10" style="padding: 0 15px 0 0;">'
									+'				<div class="input-group date form_meridian_datetime"  data-date-format="yyyy-mm-dd">'
									+'					<input type="text" size="16" readonly class="form-control" id="endTime" value="'+TUI.Utils.parseDate(EndTime).Format('yyyy-MM-dd')+'">'
									+'					<span class="input-group-btn">'
									+'						<button class="btn default date-set" type="button">'
									+'							<i class="fa fa-calendar"></i>'
									+'						</button>'
									+'					</span>'
									+'				</div>'
									+'			</div>'
									+'		</div>'
									+'		<div class="form-group">'
									+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">活动单位：</label>'
									+'			<div class="col-sm-10" style="padding-left: 0;"><input id="activityCreated" class="form-control" placeholder="请输入活动单位名称..." value="'+ActivityCreated+'"/></div>'
									+'		</div>'
									+'	</div>'
									+'</form>',
							title: "修改积分活动",
							buttons: {
							  success: {
								label: "确定",
								className: "green",
								callback: function() { 
									var activityID=$('#activityID').prop("value");
									var activityName=$('#activityName').prop("value");
									var activityDouble=$('#activityDouble').prop("value");
									var startTime=$('#startTime').prop("value");
									var endTime=$('#endTime').prop("value");
									var activityCreated=$('#activityCreated').prop("value");
									var appID=$("#applist").val();
									//
									if(activityName=="")
									{
										toastr["warning"]("没有活动名称！","修改积分活动");
										return;
									}
									//
									if(activityDouble=="")
									{
										toastr["warning"]("没有积分活动翻倍量！","修改积分活动");
										return;
									}
									//
									if(startTime=="")
									{
										toastr["warning"]("没有积分活动生效时间！","修改积分活动");
										return;
									}
									//
									if(endTime=="")
									{
										toastr["warning"]("没有积分活动结束时间！","修改积分活动");
										return;
									}
									//
									if(activityCreated=="")
									{
										toastr["warning"]("没有积分活动单位！","修改积分活动");
										return;
									}
									//
									$.ajax({
												type: 'post',
												url: "srv/doActivity.tjs",
												data: {
														todo:1,
														activityID:activityID,
														activityName:activityName,
														activityDouble:activityDouble,
														startTime:startTime,
														endTime:endTime,
														activityCreated:activityCreated,
														appID:appID
													},
												dataType: "json",
												context:this,
												error: function (result) {
													alert("远程服务故障，请检查网络或稍后再试！");
												},
												success: function (result) {
													if(!result.flag)
													{
														toastr["error"](result.text,"修改积分活动失败");
														return;
													}
													//
													App.loadActivelyList();
												}
										});
								}
							  },
							  cancel: {
								label: "取消",
								className: "red",
								callback: function() {

								}
							  }
							}
						});
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
					todayBtn: false,
					pickerPosition: (App.isRTL() ? "bottom-right" : "bottom-left")
				});

				$('body').removeClass("modal-open");
			}
			//
			handleUniform();
		},

		doApp:function(appID,appName,appSecret){
			bootbox.dialog({
						message: '<form class="form-horizontal" role="form">'
								+'	<div class="form-body">'
								+'		<div class="form-group">'
								+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">积分应用名称：</label>'
								+'			<div class="col-sm-10" style="padding-left: 0;"><input id="appName" class="form-control" placeholder="请输入积分应用名称..." value="'+appName+'"/></div>'
								+'		</div>'
								+'		<div class="form-group">'
								+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">支&nbsp;付&nbsp;应&nbsp;用&nbsp;ID：</label>'
								+'			<div class="col-sm-10" style="padding-left: 0;">'
								+'				<div class="input-group">'
								+'					<div class="input">'
								+'						<input id="oldID" class="form-control" type="hidden" value="'+appID+'">'
								+'						<input id="appID" class="form-control" type="text" placeholder="请输入积分应用ID..." value="'+appID+'"> </div>'
								+'					<span class="input-group-btn">'
								+'						<button id="genappid" class="btn btn-success" type="button">生成PAYID</button>'
								+'					</span>'
								+'				</div>'
								+'			</div>'
								+'		</div>'
								+'		<div class="form-group">'
								+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">积分应用密钥：</label>'
								+'			<div class="col-sm-10" style="padding-left: 0;">'
								+'				<div class="input-group">'
								+'					<div class="input">'
								+'						<input id="appSecret" class="form-control" type="text" placeholder="请输入积分应用密钥..." value="'+appSecret+'"> </div>'
								+'					<span class="input-group-btn">'
								+'						<button id="genappsecret" class="btn btn-info" type="button">生&nbsp;成&nbsp;密&nbsp;钥</button>'
								+'					</span>'
								+'				</div>'
								+'			</div>'
								+'		</div>'
								+'	</div>'
								+'</form>',
						title: "修改积分应用",
						buttons: {
						  success: {
							label: "确定",
							className: "green",
							callback: function() {
								var oldID=$('#oldID').prop("value");
								var appName=$('#appName').prop("value");
								var appID=$('#appID').prop("value");
								var appSecret=$('#appSecret').prop("value");
								//
								if(appName=="")
								{
									toastr["warning"]("没有积分应用名称！","修改积分应用");
									return;
								}
								//
								if(appID=="")
								{
									toastr["warning"]("没有积分应用ID！","修改积分应用");
									return;
								}
								//
								if(appSecret=="")
								{
									toastr["warning"]("没有积分应用密钥！","修改积分应用");
									return;
								}
								//
								$.ajax({
											type: 'post',
											url: "srv/doApp.tjs",
											data: {
													todo:1,
													oldID:oldID,
													appID:appID,
													appName:appName,
													appSecret:appSecret
												},
											dataType: "json",
											context:this,
											error: function (result) {
												alert("远程服务故障，请检查网络或稍后再试！");
											},
											success: function (result) {
												if(!result.flag)
												{
													toastr["error"](result.text,"修改积分应用失败");
													return;
												}
												//
												App.loadAppList();
											}
									});
							}
						  },
						  cancel: {
							label: "取消",
							className: "red",
							callback: function() {

							}
						  }
						}
					});
			//
			$("#genappid").bind(TUI.env.ua.clickEventDown, { handle: this }, function (event) {
				$('#appID').val("ts"+TUI.Utils.hex_sha1("payid"+new Date()).substring(0,16));
			});
			//
			$("#genappsecret").bind(TUI.env.ua.clickEventDown, { handle: this }, function (event) {
				$('#appSecret').val(TUI.Utils.hex_sha1("paypass"+new Date()));
			});
			//
			handleUniform();
		},


		loadOrderKpi:function(){
			this.doType=0; 
			this.getAppDate();
			//
			$.ajax({
					url: "srv/getPointValueKPI.tjs?selPayApp="+this.selPayApp.join(",")
												+"&selOrderType="+this.selOrderType.join(",")
												+"&selOrderUser="+this.selOrderUser.join(",")
												+"&startTime="+this.startTime.Format("yyyy-MM-dd")+"&endTime="+this.endTime.Format("yyyy-MM-dd")+"&kpiType="+this.kpiType,
					dataType: "json",
					context: this,
					success: function (result) {
						if(!result.flag)
						{
							toastr["error"](result.msg,"加载运营数据失败");
							return;
						}
						//
						var tableHtml='<table class="table table-striped table-bordered table-hover">';
						switch(this.kpiType)
						{
							case "hour":
							{
								tableHtml+=('<thead><tr><th style="text-align: center;"> 按逐时 </th><th style="text-align: center;"> 产生积分 </th><th style="text-align: center;"> 扣除积分 </th><th style="text-align: center;"> 净增积分 </th><th style="text-align: center;"> 获得金币 </th><th style="text-align: center;"> 抵扣金币 </th><thead>');
							}
							break;
							case "day":
							{
								tableHtml+=('<thead><tr><th style="text-align: center;"> 按逐日 </th><th style="text-align: center;"> 产生积分 </th><th style="text-align: center;"> 扣除积分 </th><th style="text-align: center;"> 净增积分 </th><th style="text-align: center;"> 获得金币 </th><th style="text-align: center;"> 抵扣金币 </th><thead>');
							}
							break;
							case "month":
							{
								tableHtml+=('<thead><tr><th style="text-align: center;"> 按逐月 </th><th style="text-align: center;"> 产生积分 </th><th style="text-align: center;"> 扣除积分 </th><th style="text-align: center;"> 净增积分 </th><th style="text-align: center;"> 获得金币 </th><th style="text-align: center;"> 抵扣金币 </th><thead>');
							}
							break;
						}
						//
						tableHtml+='<tbody>';
						for(var i=0;i<result.payView.length;i++)
						{
							tableHtml+=('<tr><td style="text-align: center;">'+result.payView[i].name+'</td><td style="text-align: center;">'+result.payView[i].n1+'</td><td style="text-align: center;">'+result.payView[i].n2+'</td><td style="text-align: center;">'+result.payView[i].n3+'</td><td style="text-align: center;">'+result.payView[i].n4+'</td><td style="text-align: center;">'+result.payView[i].n5+'</td></tr>');
						}
						tableHtml+='</tbody>';
						//
						$('#payView').html(tableHtml);
						//
						var now=new Date();
						var tc=new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
						$('#paymentChart').empty();
						$('#paymentChart').highcharts({
							chart: {
								zoomType: 'x',
								margin: [40, 50, 40, 60]
							},
							title: {
								text: "积分交易量"
							},
							subtitle: {
								text: TUI.Utils.dateMessage(this.startTime)+" 到 "+TUI.Utils.dateMessage(tc>this.endTime?this.endTime.DateAdd("d",-1):now)
							},
							xAxis: {
								type: 'datetime',
								gridLineWidth:1,
								gridLineColor:'#f7f7f7',
								dateTimeLabelFormats: { 
									minute: '%H:%M',
									hour: '%H点',
									day: (App.kpiType=="month"?'%Y年%m月':'%m月%d日'), 
									week: (App.kpiType=="month"?'%Y年%m月':'%m月%d日'), 
									month: '%Y年%m月', 
									year: '%Y年' 
								}
							},

							yAxis:[{
								min: 0,
								gridLineWidth:1,
								gridLineColor:'#f7f7f7',
								lineWidth:1,
								title: {
									align:'high',
									rotation:0,
									offset:-10,
									text: '分'
								},
								labels: {
									format: '{value}'
								},
								stackLabels: {
									enabled: true
								}
							}],
							
							tooltip: {
								formatter: function() {
									if(App.kpiType=="hour")
										return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy年MM月dd日 hh点") +'</b><br/>'+
											this.series.name +': '+ this.y +'分';
									else if(App.kpiType=="day")
										return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy年MM月dd日") +'</b><br/>'+
											this.series.name +': '+ this.y +'分';
									else if(App.kpiType=="month")
										return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy年MM月") +'</b><br/>'+
											this.series.name +': '+ this.y +'分';
								}
							},
							plotOptions:{
								spline:{
									lineWidth:1,
									states: {
										hover: {
											lineWidth: 2
										}
									},
									marker: {
										enabled: false
									},
									pointInterval: 600000
								}
							},
							credits: {
								enabled: false
							},
							legend: {
								align: 'right',
								x: -50,
								verticalAlign: 'top',
								y: 0,
								floating: true,
								backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
								borderColor: '#CCC',
								borderWidth: 1,
								shadow: false
							},
							series: result.paymentChart
						});
						//
						$('#orderChart').empty();
						$('#orderChart').highcharts({
							chart: {
								zoomType: 'x',
								margin: [40, 50, 40, 60]
							},
							title: {
								text: "金币交易量"
							},
							subtitle: {
								text: TUI.Utils.dateMessage(this.startTime)+" 到 "+TUI.Utils.dateMessage(tc>this.endTime?this.endTime.DateAdd("d",-1):now)
							},
							xAxis: {
								type: 'datetime',
								gridLineWidth:1,
								gridLineColor:'#f7f7f7',
								dateTimeLabelFormats: { 
									minute: '%H:%M',
									hour: '%H点',
									day: (App.kpiType=="month"?'%Y年%m月':'%m月%d日'), 
									week: (App.kpiType=="month"?'%Y年%m月':'%m月%d日'), 
									month: '%Y年%m月', 
									year: '%Y年' 
								}
							},

							yAxis:[{
								min: 0,
								gridLineWidth:1,
								gridLineColor:'#f7f7f7',
								lineWidth:1,
								title: {
									align:'high',
									rotation:0,
									offset:-5,
									text: '个'
								},
								labels: {
									format: '{value}'
								},
								stackLabels: {
									enabled: true
								}
							},{
								min: 0,
								max: 100,
								gridLineWidth:0,
								lineWidth:1,
								tickPositions: [0, 25, 50, 75, 100],
								title: {
									align:'high',
									rotation:0,
									offset:5,
									text: '%'
								},
								labels: {
									format: '{value}'
								},
								opposite: true
							}],
							tooltip: {
								formatter: function() {
									if(App.kpiType=="hour")
									{
										return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy年MM月dd日 hh点") +'</b><br/>'+
											this.series.name +': '+ this.y +'个';
									}
									else if(App.kpiType=="day")
									{
										return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy年MM月dd日") +'</b><br/>'+
											this.series.name +': '+ this.y +'个';
									}
									else if(App.kpiType=="month")
									{
										return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy年MM月") +'</b><br/>'+
											this.series.name +': '+ this.y +'个';
									}
								}
							},
							plotOptions:{
								spline:{
									lineWidth:1,
									states: {
										hover: {
											lineWidth: 2
										}
									},
									marker: {
										enabled: false
									},
									pointInterval: 600000
								}
							},
							credits: {
								enabled: false
							},
							legend: {
								align: 'right',
								x: -50,
								verticalAlign: 'top',
								y: 0,
								floating: true,
								backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
								borderColor: '#CCC',
								borderWidth: 1,
								shadow: false
							},
							series: result.orderChart
						});
					}
			});

			this.loadPieKPI(0);
			this.loadOrgKPI(0);
			this.loadPeopleKPI(0);
		},

		loadPieKPI:function(type){
		    $.ajax({
		        url: "srv/getPointValuePieKPI.tjs?startTime=" + this.startTime.Format("yyyy-MM-dd") + "&endTime=" + this.endTime.Format("yyyy-MM-dd") + "&type=" + type,
		        dataType: "json",
		        context: this,
		        success: function (result) {
		            if (result.pie.length == 0) {
		                $('#pieChart').html("查询时段无记录！");
		                return;
		            }
		            $('#pieChart').highcharts({
		                chart: {
		                },
		                credits: {
		                    enabled: false
		                },
		                title: {
		                    text: null
		                },
		                tooltip: {
		                    headerFormat: '{series.name}<br>',
		                    pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
		                },
		                plotOptions: {
		                    pie: {
		                        allowPointSelect: true,
		                        cursor: 'pointer',
		                        dataLabels: {
		                            enabled: true,
		                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
		                            style: {
		                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
		                            }
		                        }
		                    }
		                },
		                series: [{
		                    type: 'pie',
		                    name: '各应用占比',
		                    data: result.pie
		                }]
		            });
		        }
		    });
		},

		loadOrgKPI: function (type) {
		    $.ajax({
		        url: "srv/getPointValueOrgKPI.tjs?startTime=" + this.startTime.Format("yyyy-MM-dd") + "&endTime=" + this.endTime.Format("yyyy-MM-dd") + "&type=" + type,
		        dataType: "json",
		        context: this,
		        success: function (result) {
		            if (result.categories.length == 0) {
		                $('#orgChart').html("查询时段无记录！");
		                return;
		            }
		            $('#orgChart').highcharts({
		                chart: {
		                    margin: [20, 60, 60, 60]
		                },
		                title: {
		                    text: null
		                },
		                subtitle: {
		                    text: null
		                },
		                credits: {
		                    enabled: false
		                },
		                legend: {
		                    enabled: false
		                },
		                xAxis: {
		                    categories: result.categories
		                },
		                yAxis: [{
		                    min: 0,
		                    gridLineWidth: 1,
		                    gridLineColor: '#f7f7f7',
		                    lineWidth: 1,
		                    title: {
		                        align: 'high',
		                        rotation: 0,
		                        offset: -25,
		                        text: '分'
		                    },
		                    labels: {
		                        format: '{value}'
		                    },
		                    stackLabels: {
		                        enabled: true
		                    }
		                }, {
		                    min: 0,
		                    max: 100,
		                    gridLineWidth: 0,
		                    title: {
		                        text: null
		                    },
		                    labels: {
		                        format: '{value}%'
		                    },
		                    opposite: true
		                }],
		                tooltip: {
		                    formatter: function () {
		                        if (this.point.stackTotal == undefined)
		                            return this.series.name + '：' + this.y + '%';
		                        else
		                            return '<b>' + this.x + '</b><br/>' +
										this.series.name + '：' + this.y + '分';
		                    }
		                },
		                plotOptions: {
		                    column: {
		                        stacking: 'normal'
		                    }
		                },
		                series: result.series
		            });
		        }
		    });
		},

		loadPeopleKPI: function (type) {
		    $.ajax({
		        url: "srv/getPointValuePeopleKPI.tjs?startTime=" + this.startTime.Format("yyyy-MM-dd") + "&endTime=" + this.endTime.Format("yyyy-MM-dd") + "&type=" + type,
		        dataType: "json",
		        context: this,
		        success: function (result) {
		            if (result.list.length==0) {
		                $('#peoplelist').html("查询时段无记录！");
		                return;
		            }

		            //
		            var EnergySort = ["danger", "urgent", "warning", "info", "info", "info", "info", "info", "info", "info"];
		            //
		            $('#peoplelist').empty();
		            for (var i = 0; i < result.list.length; i++) {
		                var item = $('<li><div class="col1">'
								+ '			<div class="cont">'
								+ '				<div class="cont-col1">'
								+ '					<div class="label label-sm label-' + EnergySort[i] + '">&nbsp;' + (i + 1) + '&nbsp;</div>'
								+ '				</div>'
								+ '				<div class="cont-col2">'
								+ '					<div class="desc">' + result.list[i].username
								+ '					</div>'
								+ '				</div>'
								+ '			</div>'
								+ '		</div>'
								+ '		<div class="col2">'
								+ '			<div class="date">' + TUI.Utils.formatNumber(result.list[i].score, "0") + '分</div>'
								+ '		</div>'
								+ '	</li>');
		                $('#peoplelist').append(item);
		            }
		        }
		    });
		},

		loadOrderList:function(){
			this.doType=1;
			this.getAppDate();
			this.oTable1.ajax.url( 'srv/getOrderList.tjs?selPayApp='+App.selPayApp.join(",")
														+"&selOrderType="+App.selOrderType.join(",")
														+'&selOrderUser='+App.selOrderUser.join(",")
														+"&startTime="+App.startTime.Format('yyyy-MM-dd')
														+"&endTime="+App.endTime.Format('yyyy-MM-dd')).load();
		},
			
		loadActivelyList:function(){
			this.doType=3;
			this.oTable3.ajax.url('srv/getActivityList.tjs').load();
		},

		loadMoneyList:function(){
			this.doType=4;
			this.getAppDate();
			this.oTable4.ajax.url('srv/getMoneyList.tjs?selPayApp='+App.selPayApp.join(",")
														+"&selOrderType="+App.selOrderType.join(",")
														+'&selOrderUser='+App.selOrderUser.join(",")
														+'&startTime='+App.moneyTime1.Format('yyyy-MM-dd')
														+'&endTime='+App.moneyTime2.Format('yyyy-MM-dd')).load();
		},

		
		loadAuditList:function(){
			this.doType=5;
			this.getAppDate();
			this.oTable5.ajax.url('srv/getAuditList.tjs?selAppName='+App.selAppName.join(",")
														+'&selLogLevel='+App.selLogLevel.join(",")
														+'&startTime='+App.startTime.Format('yyyy-MM-dd')
														+'&endTime='+App.endTime.Format('yyyy-MM-dd')).load();
		},

		loadAppList:function(){
			this.doType=6;
			this.oTable6.ajax.url( 'srv/getAppList.tjs').load();
		},

		getAppDate:function(){
			$.ajax({
						type: 'get',
						url: "srv/getAppData.tjs",
						dataType: "json",
						context:this,
						error: function (result) {
							alert("远程服务故障，请检查网络或稍后再试！");
						},
						success: function (result) {
							if(!result.flag)
							{
								toastr["error"](result.text,"获取积分应用信息失败");
								return;
							}
							//
							this.AppData=result.data;
						}
				});
		}
    };

}();
