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
            handleUniform(); // hanfle custom radio & checkboxes
            handleiCheck(); // handles custom icheck radio and checkboxes
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
			$("#mainFrame").find(".btn-get").hide();
			$("#mainFrame").find(".btn-set").hide();
			$("#mainFrame").find(".btn-del").hide();
			$("#mainFrame").find(".btn-sql").hide();
			$("#mainFrame").find(".btn-search").show();
			//初始化应用数据
			this.showTreeType=0;
			this.table="";
			//
			var now=new Date();
			var tc=new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
			this.startTime=tc.DateAdd("d",-2);
			this.endTime=tc.DateAdd("d",1);
			//
			this.loadKVDBTree();
			this.loadRDCTree();
			this.loadKVDBKpi();
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
		loadKVDBTree:function(){
			 $("#TreeView1").jstree({
					"core" : {
						"themes" : {
							"responsive": false
						}, 
						// so that create works
						"check_callback" : true,
						'data' : {
							'url' : function (node) {
							  return 'srv/kvdbTree.tjs';
							},
							'data' : function (node) {
							  return { 'parent' : node.id };
							} 
						}
					},
					"types" : {
						"database-0" : {
							"icon" : "fa fa-database icon-state-success icon-lg"
						},
						"database-1" : {
							"icon" : "fa fa-database icon-state-warning icon-lg"
						},
						"database-2" : {
							"icon" : "fa fa-database icon-state-danger icon-lg"
						},
						"table" : {
							"icon" : "fa fa-table icon-state-info icon-lg"
						}
					},
					"state" : { "key" : "kvdb" },
					"plugins" : [ "types" ]
				});
			//
			$("#TreeView1").on('changed.jstree', function (e, data) {
					if(data.action=="select_node"
						&& App.showTreeType==0)
					{
						if(data.node.id=="kvdb")
							App.loadKVDBKpi();
						else
							App.loadKVDBCmd(data.node.id);
					}
			}).jstree();
		},
		addDataBase:function(){
			bootbox.dialog({
								message: '<form class="form-horizontal" role="form">'
										+'	<div class="form-body">'
										+'		<div class="form-group">'
										+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;">数据库名称：</label>'
										+'			<div class="col-sm-10" style="padding-left: 0;"><input id="dbname" class="form-control" placeholder="请输入数据库名称..."/></div>'
										+'		</div>'
										+'	</div>'
										+'</form>',
								title: "添加数据库",
								buttons: {
								  success: {
									label: "确定",
									className: "green",
									callback: function() { 
										var dbname=$('#dbname').prop("value");
										//
										if(dbname=="")
										{
											toastr["warning"]("没有数据库名称！","添加数据库");
											return;
										}
										//
										$.ajax({
													type: 'post',
													url: "srv/createDataBase.tjs",
													data: {
														dbname:dbname,
														dbtype:App.showTreeType
													},
													dataType: "json",
													context:this,
													error: function (result) {
														alert("远程服务故障，请检查网络或稍后再试！");
													},
													success: function (result) {
														if(!result.flag)
														{
															toastr["error"](result.text,"添加数据库失败");
															return;
														}
														//
														if(App.showTreeType==0)
														{
															var instance = $('#TreeView1').jstree(true);
															instance.refresh_node("kvdb");
														}
														else
														{
															var instance = $('#TreeView2').jstree(true);
															instance.refresh_node("rdc");
														}
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
		},
		mdyDataBase:function(){
			var instance = $(this.showTreeType==0?'#TreeView1':'#TreeView2').jstree(true);
			if(instance.get_selected(true).length==0)
			{
				toastr["error"]("请选择需要设定数据库的节点！！！","设定数据库");
				return;
			}

			var selectNode=instance.get_selected(true)[0];
			if(selectNode.id=="kvdb" || selectNode.id=="rdc")
			{
				toastr["error"]("请选择需要设定数据库的节点！！！","设定数据库");
				return;
			}

			if(selectNode.type=="table")
			{
				toastr["error"]("请选择需要设定数据库的节点！！！","设定数据库");
				return;
			}

			$.ajax({
						type: 'get',
						url: "srv/setupDataBase.tjs?dbname="+selectNode.id+"&dbtype="+(App.showTreeType==0?"kvdb":"rdc"),
						dataType: "json",
						context:this,
						error: function (result) {
							alert("远程服务故障，请检查网络或稍后再试！");
						},
						success: function (result) {
							bootbox.dialog({
												message: '<form class="form-horizontal" role="form">'
														+'	<div class="form-body">'
														+'		<div class="form-group">'
														+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;"><strong>备份计划：</strong></label>'
														+'			<div class="col-sm-4" style="padding: 7px 0 0 0;">'
														+'				<div class="radio-list">'
														+'					<label class="radio">'
														+'						<input type="radio" name="backupType" value="none" '+(result.backuptype=="none"?"checked":"")+'> 无 </label>'
														+'					<label class="radio">'
														+'						<input type="radio" name="backupType" value="week" '+(result.backuptype=="week"?"checked":"")+'> 按周循环备份 </label>'
														+'					<label class="radio">'
														+'						<input type="radio" name="backupType" value="month" '+(result.backuptype=="month"?"checked":"")+'> 按月循环备份 </label>'
														+'					<label class="radio">'
														+'						<input type="radio" name="backupType" value="year" '+(result.backuptype=="year"?"checked":"")+'> 按年循环备份 </label>'
														+'				</div>'
														+'			</div>'
														+'			<label class="col-sm-2 control-label" style="padding: 7px 0 0 0;"><strong>归档计划：</strong></label>'
														+'			<div class="col-sm-4" style="padding: 7px 0 0 0;">'
														+'				<div class="radio-list">'
														+'					<label class="radio">'
														+'						<input type="radio" name="filingType" value="none" '+(result.filingtype=="none"?"checked":"")+'> 无 </label>'
														+'					<label class="radio">'
														+'						<input type="radio" name="filingType" value="week" '+(result.filingtype=="week"?"checked":"")+'> 每周日自动归档 '
														+'					</label>'
														+'					<label class="radio">'
														+'						<input type="radio" name="filingType" value="month" '+(result.filingtype=="month"?"checked":"")+'> 每月初自动归档 '
														+'					</label>'
														+'					<label class="radio">'
														+'						<input type="radio" name="filingType" value="year" '+(result.filingtype=="year"?"checked":"")+'> 每年初自动归档 '
														+'					</label>'
														+'				</div>'
														+'			</div>'
														+'		</div>'
														+'	</div>'
														+'</form>',
												title: "设定数据库",
												buttons: {
												  success: {
													label: "确定",
													className: "green",
													callback: function() {
														$.ajax({
																	type: 'post',
																	url: "srv/setupDataBase.tjs",
																	data: {
																		dbname:selectNode.id,
																		dbtype:App.showTreeType==0?"kvdb":"rdc",
																		backuptype:$('input:radio[name=backupType]:checked').val(),
																		filingtype:$('input:radio[name=filingType]:checked').val()
																	},
																	dataType: "json",
																	context:this,
																	error: function (result) {
																		alert("远程服务故障，请检查网络或稍后再试！");
																	},
																	success: function (result) {
																		if(!result.flag)
																		{
																			toastr["error"](result.text,"设定数据库失败");
																			return;
																		}
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
		delDataBase:function(){
			var instance = $(this.showTreeType==0?'#TreeView1':'#TreeView2').jstree(true);
			if(instance.get_selected(true).length==0)
			{
				toastr["error"]("请选择需要删除数据库的节点！！！","删除数据库");
				return;
			}

			var selectNode=instance.get_selected(true)[0];
			if(selectNode.id=="kvdb" || selectNode.id=="rdc")
			{
				toastr["error"]("根目录禁止删除！！！","删除数据库");
				return;
			}
			//
			if(selectNode.id=="sysconfig" || selectNode.id=="syslog" || selectNode.id=="sysrun")
			{
				toastr["error"]("系统核心数据库禁止删除！！！","删除数据库");
				return;
			}
			//
			if(selectNode.type=="table")
			{
				bootbox.dialog({
							message: '您确定要删除（'+selectNode.id+'）数据库表吗？',
							title: "删除数据库表",
							buttons: {
							  success: {
								label: "确定",
								className: "red",
								callback: function() { 
									$.ajax({
												type: 'post',
												url: "srv/removeTable.tjs",
												data: {
													dbtable:selectNode.id
												},
												dataType: "json",
												context:this,
												error: function (result) {
													alert("远程服务故障，请检查网络或稍后再试！");
												},
												success: function (result) {
													if(!result.flag)
													{
														toastr["error"](result.text,"删除数据库表失败");
														return;
													}
													//
													instance.delete_node(result.dbtable);
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
			else
			{
				bootbox.dialog({
							message: '您确定要删除（'+selectNode.id+'）数据库吗？',
							title: "删除数据库",
							buttons: {
							  success: {
								label: "确定",
								className: "red",
								callback: function() { 
									$.ajax({
												type: 'post',
												url: "srv/removeDataBase.tjs",
												data: {
													dbname:selectNode.id,
													dbtype:App.showTreeType
												},
												dataType: "json",
												context:this,
												error: function (result) {
													alert("远程服务故障，请检查网络或稍后再试！");
												},
												success: function (result) {
													if(!result.flag)
													{
														toastr["error"](result.text,"删除数据库失败");
														return;
													}
													//
													instance.delete_node(result.dbname);
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
		},
		showKVDBTree:function(){
			$("#TreeTitle").html("键值数据库");
			$("#ListTitle").html("键值数据库");
			$("#TreeView1").show();
			$("#TreeView2").hide();
			this.showTreeType=0;
			this.loadKVDBKpi();
		},

		loadRDCTree:function(){
			 $("#TreeView2").jstree({
					"core" : {
						"themes" : {
							"responsive": false
						}, 
						// so that create works
						"check_callback" : true,
						'data' : {
							'url' : function (node) {
							  return 'srv/rdcTree.tjs';
							},
							'data' : function (node) {
							  return { 'parent' : node.id };
							}
						}
					},
					"types" : {
						"database-0" : {
							"icon" : "fa fa-database icon-state-success icon-lg"
						},
						"database-1" : {
							"icon" : "fa fa-database icon-state-warning icon-lg"
						},
						"database-2" : {
							"icon" : "fa fa-database icon-state-danger icon-lg"
						},
						"table" : {
							"icon" : "fa fa-table icon-state-info icon-lg"
						}
					},
					"state" : { "key" : "rdc" },
					"plugins" : [ "types" ]
			});
			//
			$("#TreeView2").on('changed.jstree', function (e, data) {
					if(data.action=="select_node"
						&& App.showTreeType==1)
					{
						if(data.node.id=="rdc")
						{
							App.loadRDCKpi();
						}
						else
						{
							if(data.node.type=="table")
								App.loadTableCmd(data.node.id);
							else
								App.loadRDCCmd(data.node.id);
						}
					}
			}).jstree();
		},
		showRDCTree:function(){
			$("#TreeTitle").html("关系数据库");
			$("#ListTitle").html("关系数据库");
			$("#TreeView1").hide();
			$("#TreeView2").show();
			this.showTreeType=1;
			this.loadRDCKpi();
		},
		getDataLable:function(val){
			if(val>90)
				return "danger";
			else if(val>80)
				return "warning";
			else if(val>50)
				return "info";
			else
				return "success";
		},
		getDataText:function(val){
			if(val>90)
				return '<span class="label label-sm label-danger">严重</span>';
			else if(val>80)
				return '<span class="label label-sm label-warning">警告</span>';
			else if(val>50)
				return '<span class="label label-sm label-info">提醒</span>';
			else
				return '<span class="label label-sm label-success">健康</span>';
		},
		doSearch:function(){
			bootbox.dialog({
								message: '<form class="form-horizontal" role="form">'
										+'	<div class="form-body">'
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
								title: "选择时间段",
								buttons: {
								  success: {
									label: "确定",
									className: "green",
									callback: function() {
										App.startTime=TUI.Utils.parseDate($("#startTime").val());
										App.endTime=TUI.Utils.parseDate($("#endTime").val());
										App.refreshKpi();
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
		refreshKpi:function(){
			if(this.showTreeType==0)
				this.loadKVDBKpi();
			else
				this.loadRDCKpi();
		},
		loadKVDBKpi:function(){
			$("#profile").find(".tab-content .tab-pane").removeClass("active");
			$("#tab_kpi").addClass("active");
			$("#mainFrame").find(".btn-get").hide();
			$("#mainFrame").find(".btn-set").hide();
			$("#mainFrame").find(".btn-del").hide();
			$("#mainFrame").find(".btn-sql").hide();
			$("#mainFrame").find(".btn-search").show();
			$("#mainFrame").find(".btn-refresh").show();
			$("#ListTitle").html("键值数据库");
			//
			$.ajax({
					url: "srv/getDataBaseKpi.tjs?startTime="+this.startTime.Format("yyyy-MM-dd hh:mm:ss")+"&endTime="+this.endTime.Format("yyyy-MM-dd hh:mm:ss")+"&dbtype=kvdb",
					dataType: "json",
					context: this,
					success: function (result) {
						if(!result.flag)
						{
							toastr["error"](result.info,"加载运营数据失败");
							return;
						}
						//
						var UserDay=Math.ceil((result.real.DiskTotalSpace-result.real.DiskUsageSpace)/result.real.DayUsageSpace);
						var strUserDay="";
						if(UserDay>365)
						{
							strUserDay=Math.floor(UserDay/365)+"年";
							if((UserDay%365)>31)
							{
								strUserDay+=(Math.floor((UserDay%365)/31)+"月"+((UserDay%365)%31));
							}
							else
							{
								strUserDay+=("又"+((UserDay%365)%31));
							}
						}
						else if(UserDay>31)
						{
							strUserDay+=(Math.floor(UserDay/31)+"月"+(UserDay%31));
						}
						else
						{
							strUserDay=UserDay;
						}
						//
						$('#tdbInfo').empty();
						$('#tdbInfo').html('<table class="table table-striped table-bordered table-hover">'
                                          +'  <tbody>'
                                          +'      <tr>'
                                          +'          <td> 性&nbsp;能&nbsp;指&nbsp;标</td><td>'+this.getDataText(result.real.CpuUsage)+' </td>'
                                          +'          <td> 存&nbsp;储&nbsp;指&nbsp;标</td><td>'+this.getDataText(result.real.DiskUsageSpace*100/result.real.DiskTotalSpace)+' </td>'
                                          +'      </tr>'
                                          +'      <tr>'
                                          +'          <td>CPU占用率</td><td><span class="label label-sm label-'+this.getDataLable(result.real.CpuUsage)+'"> '+result.real.CpuUsage+'</span> % </td>'
                                          +'          <td>剩&nbsp;余&nbsp;天&nbsp;数</td><td><span class="label label-sm label-'+this.getDataLable(result.real.DiskUsageSpace*100/result.real.DiskTotalSpace)+'"> '+strUserDay+'</span>天</td>'
                                          +'      </tr>'
                                          +'      <tr>'
                                          +'          <td>内存使用率</td><td><span class="label label-sm label-'+this.getDataLable(result.real.MemoryUsagePhys*100/result.real.MemoryTotalPhys)+'"> '+TUI.Utils.formatNumber(result.real.MemoryUsagePhys*100/result.real.MemoryTotalPhys,'0.0')+'</span> %</td>'
                                          +'          <td>磁盘使用率</td><td><span class="label label-sm label-'+this.getDataLable(result.real.DiskUsageSpace*100/result.real.DiskTotalSpace)+'"> '+TUI.Utils.formatNumber(result.real.DiskUsageSpace*100/result.real.DiskTotalSpace,'0.0')+'</span> %</td>'
                                          +'      </tr>'
                                          +'      <tr>'
                                          +'          <td>内存使用量</td><td>'+TUI.Utils.formatNumber(result.real.MemoryUsagePhys,'#,##0')+' MB</td>'
                                          +'          <td>磁盘使用量</td><td>'+TUI.Utils.formatNumber(result.real.DiskUsageSpace/1024,'#,##0.0')+' GB </td>'
                                          +'      </tr>'
                                          +'      <tr>'
                                          +'          <td>物理内存量</td><td>'+TUI.Utils.formatNumber(result.real.MemoryTotalPhys,'#,##0')+' MB</td>'
                                          +'          <td>磁盘总容量</td><td>'+TUI.Utils.formatNumber(result.real.DiskTotalSpace/1024,'#,##0.0')+' GB</td>'
                                          +'      </tr>'
                                          +'  </tbody>'
										  +'</table>');
						//
						$('#tdbCount').empty();
						$('#tdbCount').highcharts({
							chart: {
								type: 'pie',
								margin: [0, 10, 25, 15]
							},
							title: {
								text: "连接数",
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
								enabled: false
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
										distance:10
									},
									showInLegend: true,
									size:'90%',
									innerSize:'85%',
									cursor: 'pointer'
								}
							},
							series: [{
								name: '共计',
								data: result.linkPie,
								tooltip: {
									valueSuffix:"个"
								}
							}]
						});
						//
						var now=new Date();
						var tc=new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
						//
						$('#tdbRun1').empty();
						$('#tdbRun1').highcharts({
							chart: {
								zoomType: 'x',
								margin: [40, 50, 40, 60]
							},
							title: {
								text: "性能负荷趋势"
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
									hour: '%H:%M',
									day: '%Y-%m-%d', 
									week: '%Y-%m-%d', 
									month: '%Y-%m-%d', 
									year: '%Y-%m-%d' 
								}
							},

							yAxis:[{
								max:100,
								min: 0,
								gridLineWidth:1,
								gridLineColor:'#f7f7f7',
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
								}
							},{
								min: 0,
								gridLineWidth:0,
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
								opposite: true
							}],
							tooltip: {
								formatter: function() {
									if(this.series.name=="性能趋势")
										return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy-MM-dd  hh:mm:ss") +'</b><br/>'+
											this.series.name +': '+ this.y +'%';
									return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy-MM-dd  hh:mm:ss") +'</b><br/>'+
										this.series.name +': '+ this.y +'个';
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
							series: result.performance
						});
						//
						$('#tdbRun2').empty();
						$('#tdbRun2').highcharts({
							chart: {
								zoomType: 'x',
								margin: [40, 30, 40, 60]
							},
							title: {
								text: "存储负荷趋势"
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
									hour: '%H:%M',
									day: '%Y-%m-%d', 
									week: '%Y-%m-%d', 
									month: '%Y-%m-%d', 
									year: '%Y-%m-%d' 
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
								formatter: function() {
									return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy-MM-dd  hh:mm:ss") +'</b><br/>'+
											this.series.name +': '+ this.y +'条';
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
								enabled: false,
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
							series: result.datanum
						});
						//
						$('#tdbRun3').empty();
						$('#tdbRun3').highcharts({
							chart: {
								zoomType: 'x',
								margin: [40, 30, 60, 60]
							},
							title: {
								text: "数据库存储空间"
							},
							subtitle: {
								text: null
							},

							xAxis: {
								categories: result.categories
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
									text: 'MB'
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
									return '<b>'+ this.x +'</b><br>'+
										this.series.name +'：'+ TUI.Utils.formatNumber(this.y,"#,##0") +'MB';
								}
							},
							plotOptions:{
								column: {
									stacking: 'normal'
								}
							},
							credits: {
								enabled: false
							},
							legend: {
								enabled: false,
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
							series: result.databar
						});
					}
			});
		},
		loadKVDBCmd:function(id){
			$("#profile").find(".tab-content .tab-pane").removeClass("active");
			$("#tab_kvdb").addClass("active");
			$("#mainFrame").find(".btn-get").show();
			$("#mainFrame").find(".btn-set").show();
			$("#mainFrame").find(".btn-del").show();
			$("#mainFrame").find(".btn-sql").hide();
			$("#mainFrame").find(".btn-search").hide();
			$("#mainFrame").find(".btn-refresh").hide();
			$("#ListTitle").html("键值数据库（"+id+"）");
			this.kvdb=id;
			this.getKeyValue();
		},
		loadRDCKpi:function(){
			$("#profile").find(".tab-content .tab-pane").removeClass("active");
			$("#tab_kpi").addClass("active");
			$("#mainFrame").find(".btn-get").hide();
			$("#mainFrame").find(".btn-set").hide();
			$("#mainFrame").find(".btn-del").hide();
			$("#mainFrame").find(".btn-sql").hide();
			$("#mainFrame").find(".btn-search").show();
			$("#mainFrame").find(".btn-refresh").show();
			$("#ListTitle").html("关系数据库");
			//
			$.ajax({
					url: "srv/getDataBaseKpi.tjs?startTime="+this.startTime.Format("yyyy-MM-dd hh:mm:ss")+"&endTime="+this.endTime.Format("yyyy-MM-dd hh:mm:ss")+"&dbtype=rdc",
					dataType: "json",
					context: this,
					success: function (result) {
						if(!result.flag)
						{
							toastr["error"](result.info,"加载运营数据失败");
							return;
						}
						//
						var UserDay=Math.ceil((result.real.DiskTotalSpace-result.real.DiskUsageSpace)/result.real.DayUsageSpace);
						var strUserDay="";
						if(UserDay>365)
						{
							strUserDay=Math.floor(UserDay/365)+"年";
							if((UserDay%365)>31)
							{
								strUserDay+=(Math.floor((UserDay%365)/31)+"月"+((UserDay%365)%31));
							}
							else
							{
								strUserDay+=("又"+((UserDay%365)%31));
							}
						}
						else if(UserDay>31)
						{
							strUserDay+=(Math.floor(UserDay/31)+"月"+(UserDay%31));
						}
						else
						{
							strUserDay=UserDay;
						}
						//
						$('#tdbInfo').empty();
						$('#tdbInfo').html('<table class="table table-striped table-bordered table-hover">'
                                          +'  <tbody>'
                                          +'      <tr>'
                                          +'          <td> 性&nbsp;能&nbsp;指&nbsp;标</td><td>'+this.getDataText(result.real.CpuUsage)+' </td>'
                                          +'          <td> 存&nbsp;储&nbsp;指&nbsp;标</td><td>'+this.getDataText(result.real.DiskUsageSpace*100/result.real.DiskTotalSpace)+' </td>'
                                          +'      </tr>'
                                          +'      <tr>'
                                          +'          <td>CPU占用率</td><td><span class="label label-sm label-'+this.getDataLable(result.real.CpuUsage)+'"> '+result.real.CpuUsage+'</span> % </td>'
                                          +'          <td>剩&nbsp;余&nbsp;天&nbsp;数</td><td><span class="label label-sm label-'+this.getDataLable(result.real.DiskUsageSpace*100/result.real.DiskTotalSpace)+'"> '+strUserDay+'</span>天</td>'
                                          +'      </tr>'
                                          +'      <tr>'
                                          +'          <td>内存使用率</td><td><span class="label label-sm label-'+this.getDataLable(result.real.MemoryUsagePhys*100/result.real.MemoryTotalPhys)+'"> '+TUI.Utils.formatNumber(result.real.MemoryUsagePhys*100/result.real.MemoryTotalPhys,'0.0')+'</span> %</td>'
                                          +'          <td>磁盘使用率</td><td><span class="label label-sm label-'+this.getDataLable(result.real.DiskUsageSpace*100/result.real.DiskTotalSpace)+'"> '+TUI.Utils.formatNumber(result.real.DiskUsageSpace*100/result.real.DiskTotalSpace,'0.0')+'</span> %</td>'
                                          +'      </tr>'
                                          +'      <tr>'
                                          +'          <td>内存使用量</td><td>'+TUI.Utils.formatNumber(result.real.MemoryUsagePhys,'#,##0')+' MB</td>'
                                          +'          <td>磁盘使用量</td><td>'+TUI.Utils.formatNumber(result.real.DiskUsageSpace/1024,'#,##0.0')+' GB </td>'
                                          +'      </tr>'
                                          +'      <tr>'
                                          +'          <td>物理内存量</td><td>'+TUI.Utils.formatNumber(result.real.MemoryTotalPhys,'#,##0')+' MB</td>'
                                          +'          <td>磁盘总容量</td><td>'+TUI.Utils.formatNumber(result.real.DiskTotalSpace/1024,'#,##0.0')+' GB</td>'
                                          +'      </tr>'
                                          +'  </tbody>'
										  +'</table>');
						//
						$('#tdbCount').empty();
						$('#tdbCount').highcharts({
							chart: {
								type: 'pie',
								margin: [0, 10, 25, 15]
							},
							title: {
								text: "连接数",
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
								enabled: false
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
										distance:10
									},
									showInLegend: true,
									size:'90%',
									innerSize:'85%',
									cursor: 'pointer'
								}
							},
							series: [{
								name: '共计',
								data: result.linkPie,
								tooltip: {
									valueSuffix:"个"
								}
							}]
						});
						//
						var now=new Date();
						var tc=new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
						//
						$('#tdbRun1').empty();
						$('#tdbRun1').highcharts({
							chart: {
								zoomType: 'x',
								margin: [40, 50, 40, 60]
							},
							title: {
								text: "性能负荷趋势"
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
									hour: '%H:%M',
									day: '%Y-%m-%d', 
									week: '%Y-%m-%d', 
									month: '%Y-%m-%d', 
									year: '%Y-%m-%d' 
								}
							},

							yAxis:[{
								max:100,
								min: 0,
								gridLineWidth:1,
								gridLineColor:'#f7f7f7',
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
								}
							},{
								min: 0,
								gridLineWidth:0,
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
								opposite: true
							}],
							tooltip: {
								formatter: function() {
									if(this.series.name=="性能趋势")
										return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy-MM-dd  hh:mm:ss") +'</b><br/>'+
											this.series.name +': '+ this.y +'%';
									return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy-MM-dd  hh:mm:ss") +'</b><br/>'+
										this.series.name +': '+ this.y +'个';
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
							series: result.performance
						});
						//
						$('#tdbRun2').empty();
						$('#tdbRun2').highcharts({
							chart: {
								zoomType: 'x',
								margin: [40, 30, 40, 60]
							},
							title: {
								text: "存储负荷趋势"
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
									hour: '%H:%M',
									day: '%Y-%m-%d', 
									week: '%Y-%m-%d', 
									month: '%Y-%m-%d', 
									year: '%Y-%m-%d' 
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
								formatter: function() {
									return '<b>'+ TUI.Utils.parseDate(Math.round(this.x/1000)-8*3600).Format("yyyy-MM-dd  hh:mm:ss") +'</b><br/>'+
											this.series.name +': '+ this.y +'条';
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
								enabled: false,
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
							series: result.datanum
						});
						//
						$('#tdbRun3').empty();
						$('#tdbRun3').highcharts({
							chart: {
								zoomType: 'x',
								margin: [40, 30, 60, 60]
							},
							title: {
								text: "数据库存储空间"
							},
							subtitle: {
								text: null
							},

							xAxis: {
								categories: result.categories
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
									text: 'MB'
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
									return '<b>'+ this.x +'</b><br/>合计空间：'+TUI.Utils.formatNumber(this.total,"#,##0") +'MB<br>'+
										this.series.name +'：'+ TUI.Utils.formatNumber(this.y,"#,##0") +'MB<br>所占比率：'+TUI.Utils.formatNumber(this.percentage,"0.0") +'%';
								}
							},
							plotOptions:{
								column: {
									stacking: 'normal'
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
							series: result.databar
						});
					}
			});
		},
		loadRDCCmd:function(id){
			$("#profile").find(".tab-content .tab-pane").removeClass("active");
			$("#tab_rdc").addClass("active");
			$("#mainFrame").find(".btn-get").hide();
			$("#mainFrame").find(".btn-set").hide();
			$("#mainFrame").find(".btn-del").hide();
			$("#mainFrame").find(".btn-sql").show();
			$("#mainFrame").find(".btn-search").hide();
			$("#mainFrame").find(".btn-refresh").hide();
			$("#ListTitle").html("关系数据库（"+id+"）");
			this.rdc=id;
			//
			$('#tab_rdc').find('.m-heading-1').html('<div class="row" style="margin:0 10px;">'
													+'	<div class="form-body">'
													+'		<div class="row" style="margin:0">'
													+'			<div class="col-md-12"><textarea id="sqlcmd" rows="6" class="form-control"></textarea></div>'
													+'		</div>'
													+'	</div>'
													+'</div>'
													+'<div class="row" style="margin:0 5px;">'
													+'	<div class="form-actions right" style="margin: 0 25px;padding: 15px 0;">'
													+'		<button type="button" class="btn default" style="float:left;margin: 0 10px 0 0;" id="rdcRest">重 置</button>'
													+'		<button type="button" class="btn green" style="margin: 0 10px 0 0;" id="rdcExport">导 出</button>'
													+'		<button type="submit" class="btn red" id="rdcOk">执 行</button>'
													+'	</div>'
													+'</div>');
			this.runResizeHandlers();
			//
			$('#rdcRest').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				$('#sqlcmd').val("");
			});
			//
			$('#rdcExport').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				window.open('srv/exportSqlData.tjs?dbname='+App.rdc);
			});
			//
			$('#rdcOk').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				$('#recordset').html("");
				$.ajax({
						type: 'post',
						url: "srv/rdcOperate.tjs",
						data: {dbname:App.rdc,sqlcmd:TUI.Utils.encode64($('#sqlcmd').val())},
						dataType: "json",									
						error: function (result) {
							$('#recordset').html(result);
						},
						success: function (result) {
							var tableHtml="";
							for(var i=0;i<result.length;i++)
							{
								tableHtml+=('<h5>'+(i+1)+'、'+result[i].MessageText+'。执行耗时：'+result[i].ExecuteTime+'秒。'+'</h5>');
								tableHtml+=('<table class="table table-bordered table-striped"><thead><tr>');
								for(var j=0;j<result[i].ColumnModel.length;j++)
								{
									tableHtml+=('<th style="text-align:center;font-size:9pt;">'+result[i].ColumnModel[j].header+'</th>');
								}
								tableHtml+=('</tr></thead><tbody>');
								for(var j=0;j<result[i].Record.length;j++)
								{
									tableHtml+=('<tr>');
									for(var k=0;k<result[i].ColumnModel.length;k++)
									{
										tableHtml+=('<td style="text-align:center;font-size:9pt;">'+result[i].Record[j][result[i].ColumnModel[k].header]+'</td>');
									}
									tableHtml+=('</tr>');
								}
								tableHtml+=('</tbody></table>');
							}
							//
							$('#recordset').html(tableHtml);
						}
					});
			});
		},
		loadTableCmd:function(id){
			var dbarray=id.split(".");
			$("#profile").find(".tab-content .tab-pane").removeClass("active");
			$("#tab_rdc").addClass("active");
			$("#mainFrame").find(".btn-get").hide();
			$("#mainFrame").find(".btn-set").hide();
			$("#mainFrame").find(".btn-del").hide();
			$("#mainFrame").find(".btn-sql").show();
			$("#mainFrame").find(".btn-search").hide();
			$("#mainFrame").find(".btn-refresh").hide();
			$("#ListTitle").html("关系数据库（"+dbarray[0]+"）");
			this.rdc=dbarray[0];
			this.table=dbarray[1];
			//
			$('#tab_rdc').find('.m-heading-1').html('<div class="row" style="margin:0 10px;">'
													+'	<div class="form-body">'
													+'		<div class="row" style="margin:0">'
													+'			<div class="col-md-12"><textarea id="sqlcmd" rows="6" class="form-control"></textarea></div>'
													+'		</div>'
													+'	</div>'
													+'</div>'
													+'<div class="row" style="margin:0 5px;">'
													+'	<div class="form-actions right" style="margin: 0 25px;padding: 15px 0;">'
													+'		<button type="button" class="btn default" style="float:left;margin: 0 10px 0 0;" id="rdcRest">重 置</button>'
													+'		<button type="button" class="btn green" style="margin: 0 10px 0 0;" id="rdcExport">导 出</button>'
													+'		<button type="submit" class="btn red" id="rdcOk">执 行</button>'
													+'	</div>'
													+'</div>');
			this.runResizeHandlers();
			//
			$('#sqlcmd').val("SELECT * FROM "+this.table+" LIMIT 100");
			$('#rdcRest').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				$('#sqlcmd').val("");
			});
			//
			$('#rdcExport').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				window.open('srv/exportSqlData.tjs?dbname='+App.rdc
														+'&tbname='+App.table);
			});
			//
			$('#rdcOk').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				$('#recordset').html("");
				$.ajax({
						type: 'post',
						url: "srv/rdcOperate.tjs",
						data: {dbname:App.rdc,sqlcmd:TUI.Utils.encode64($('#sqlcmd').val())},
						dataType: "json",									
						error: function (result) {
							$('#recordset').html(result);
						},
						success: function (result) {
							var tableHtml="";
							for(var i=0;i<result.length;i++)
							{
								tableHtml+=('<h5>'+(i+1)+'、'+result[i].MessageText+'。执行耗时：'+result[i].ExecuteTime+'秒。'+'</h5>');
								tableHtml+=('<table class="table table-bordered table-striped"><thead><tr>');
								for(var j=0;j<result[i].ColumnModel.length;j++)
								{
									tableHtml+=('<th style="text-align:center;font-size:9pt;">'+result[i].ColumnModel[j].header+'</th>');
								}
								tableHtml+=('</tr></thead><tbody>');
								for(var j=0;j<result[i].Record.length;j++)
								{
									tableHtml+=('<tr>');
									for(var k=0;k<result[i].ColumnModel.length;k++)
									{
										tableHtml+=('<td style="text-align:center;font-size:9pt;">'+result[i].Record[j][result[i].ColumnModel[k].header]+'</td>');
									}
									tableHtml+=('</tr>');
								}
								tableHtml+=('</tbody></table>');
							}
							//
							$('#recordset').html(tableHtml);
						}
					});
			});
		},
		openSql:function(type){
			switch(type)
			{
				case 'SELECT':
				{
					if(this.table=="")
						$('#sqlcmd').val("SELECT * FROM Table1 WHERE XXX=...");
					else
						$('#sqlcmd').val("SELECT * FROM "+this.table+" WHERE XXX=...");
				}
				break;
				case 'INSERT':
				{
					if(this.table=="")
						$('#sqlcmd').val("INSERT INTO Table1 (XXX,YYY) VALUES (...,...)");
					else
						$('#sqlcmd').val("INSERT INTO "+this.table+" (XXX,YYY) VALUES (...,...)");
				}
				break;
				case 'UPDATE':
				{
					if(this.table=="")
						$('#sqlcmd').val("UPDATE Table1 SET XXX=...,YYY=... WHERE XXX=...");
					else
						$('#sqlcmd').val("UPDATE "+this.table+" SET XXX=...,YYY=... WHERE XXX=...");
				}
				break;
				case 'DELETE':
				{
					if(this.table=="")
						$('#sqlcmd').val("DELETE FROM Table1 WHERE XXX=...");
					else
						$('#sqlcmd').val("DELETE FROM "+this.table+" WHERE XXX=...");
				}
				break;
			}
		},

		getKeyValue:function(){
			$("#ListTitle").html("读取"+this.kvdb+"数据库键值");
			$('#tab_kvdb').find('.m-heading-1').html('<div class="row" style="margin:0 10px;">'
													+'	<div class="form-body">'
													+'		<div class="row" style="margin:0">'
													+'			<div class="col-md-5">'
													+'				<label class="col-sm-2 control-label" style="padding: 18px 0 0 0;text-align: right;">数据集合：</label>'
													+'				<div class="col-sm-10" style="padding:10px 5px 0 5px;"><input id="colloc" class="form-control" placeholder="请输入数据集合..."/></div>'
													+'			</div>'
													+'			<div class="col-md-7">'
													+'				<label class="col-sm-2 control-label" style="padding: 18px 0 0 0;text-align: right;">键值范围：</label>'
													+'				<div class="col-sm-5" style="padding:10px 5px 0 5px;"><input id="keyValue1" class="form-control" placeholder="起始键值..."/></div>'
													+'				<div class="col-sm-5" style="padding:10px 5px 0 5px;"><input id="keyValue2" class="form-control" placeholder="结束键值..."/></div>'
													+'			</div>'
													+'		</div>'
													+'	</div>'
													+'</div>'
													+'<div class="row" style="margin:0 5px;">'
													+'	<div class="form-actions right" style="margin: 0 25px;padding: 15px 0;">'
													+'		<button type="button" class="btn default" style="float:left;" id="kvdbRest">重 置</button>'
													+'		<button type="submit" class="btn red" id="kvdbOk">执 行</button>'
													+'	</div>'
													+'</div>');
			//
			$('#kvdbRest').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				$('#colloc').val("");
				$('#keyValue1').val("");
				$('#keyValue2').val("");
			});
			//
			$('#kvdbOk').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				$.ajax({
						type: 'get',
						url: "srv/kvdbOperate.tjs?dbname="+App.kvdb+"&colloc="+$('#colloc').val()+"&key1="+$('#keyValue1').val()+"&key2="+$('#keyValue2').val(),
						error: function (result) {
							$('#console').val(result);
						},
						success: function (result) {
							$('#console').val(result);
						}
					});
			});
			this.runResizeHandlers();
		},

		setKeyValue:function(){
			$("#ListTitle").html("写入"+this.kvdb+"数据库键值");
			$('#tab_kvdb').find('.m-heading-1').html('<div class="row" style="margin:0 10px;">'
													+'	<div class="form-body">'
													+'		<div class="row" style="margin:0">'
													+'			<div class="col-md-5">'
													+'				<label class="col-sm-2 control-label" style="padding: 18px 0 0 0;text-align: right;">数据集合：</label>'
													+'				<div class="col-sm-10" style="padding:10px 5px 0 5px;"><input id="colloc" class="form-control" placeholder="请输入数据集合..."/></div>'
													+'			</div>'
													+'			<div class="col-md-7">'
													+'				<label class="col-sm-2 control-label" style="padding: 18px 0 0 0;text-align: right;">数据键值：</label>'
													+'				<div class="col-sm-5" style="padding:10px 5px 0 5px;"><input id="keyValue" class="form-control" placeholder="请输入键值..."/></div>'
													+'				<div class="col-sm-5" style="padding:10px 5px 0 5px;"><input id="dataValue" class="form-control" placeholder="请输入数据值..."/></div>'
													+'			</div>'
													+'		</div>'
													+'	</div>'
													+'</div>'
													+'<div class="row" style="margin:0 5px;">'
													+'	<div class="form-actions right" style="margin: 0 25px;padding: 15px 0;">'
													+'		<button type="button" class="btn default" style="float:left;" id="kvdbRest">重 置</button>'
													+'		<button type="submit" class="btn red" id="kvdbOk">执 行</button>'
													+'	</div>'
													+'</div>');
			//
			$('#kvdbRest').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				$('#colloc').val("");
				$('#keyValue').val("");
				$('#dataValue').val("");
			});
			//
			$('#kvdbOk').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				$.ajax({
						type: 'post',
						url: "srv/kvdbOperate.tjs",
						data: {dbname:App.kvdb,
							colloc:$('#colloc').val(),
							key:$('#keyValue').val(),
							value:$('#dataValue').val()},
						error: function (result) {
							$('#console').val(result);
						},
						success: function (result) {
							$('#console').val(result);
						}
					});
			});
			//
			this.runResizeHandlers();
		},

		delKeyValue:function(){
			$("#ListTitle").html("删除"+this.kvdb+"数据库键值");
			$('#tab_kvdb').find('.m-heading-1').html('<div class="row" style="margin:0 10px;">'
													+'	<div class="form-body">'
													+'		<div class="row" style="margin:0">'
													+'			<div class="col-md-5">'
													+'				<label class="col-sm-2 control-label" style="padding: 18px 0 0 0;text-align: right;">数据集合：</label>'
													+'				<div class="col-sm-10" style="padding:10px 5px 0 5px;"><input id="colloc" class="form-control" placeholder="请输入数据集合..."/></div>'
													+'			</div>'
													+'			<div class="col-md-7">'
													+'				<label class="col-sm-2 control-label" style="padding: 18px 0 0 0;text-align: right;">删除键值：</label>'
													+'				<div class="col-sm-10" style="padding:10px 5px 0 5px;"><input id="keyValue" class="form-control" placeholder="请输入删除键值..."/></div>'
													+'			</div>'
													+'		</div>'
													+'	</div>'
													+'</div>'
													+'<div class="row" style="margin:0 5px;">'
													+'	<div class="form-actions right" style="margin: 0 25px;padding: 15px 0;">'
													+'		<button type="button" class="btn default" style="float:left;" id="kvdbRest">重 置</button>'
													+'		<button type="submit" class="btn red" id="kvdbOk">执 行</button>'
													+'	</div>'
													+'</div>');
			this.runResizeHandlers();
			//
			$('#kvdbRest').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				$('#colloc').val("");
				$('#keyValue').val("");
			});
			//
			$('#kvdbOk').bind(TUI.env.ua.clickEventUp, { handle: this }, function (e) {
				$.ajax({
						type: 'DELETE',
						url: "srv/kvdbOperate.tjs",
						data: {dbname:App.kvdb,
							colloc:$('#colloc').val(),
							key:$('#keyValue').val()},
						error: function (result) {
							$('#console').val(result);
						},
						success: function (result) {
							$('#console').val(result);
						}
					});
			});
		}
    };

}();