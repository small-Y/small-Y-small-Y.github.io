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
			//初始化应用数据
			this.showTreeType=1;
			this.loadGroupTree();
			this.loadRoleTree();
			this.loadOrganizeTree();
			this.loadOrganizeList();
			//
			this.selOrganizeID=0;
			this.selGroupID=0;
			this.selRoleID=0;
			this.initUserList();
			$.ajax({
						type: 'get',
						url: "/API/My",
						dataType: "json",
						context:this,
						error: function (result) {
							alert("远程服务故障，请检查网络或稍后再试！");
						},
						success: function (result) {
							this.loadUserList("用户列表",result.orgid==undefined?2:result.orgid,1);
						}
			});
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
		
		loadGroupTree:function(){
			 $("#TreeView1").jstree({
					"core" : {
						"themes" : {
							"responsive": false
						}, 
						// so that create works
						"check_callback" : true,
						'data' : {
							'url' : function (node) {
							  return 'srv/groupTree.tjs';
							},
							'data' : function (node) {
							  return { 'parent' : node.id };
							} 
						}
					},
					"types" : {
						"default" : {
							"icon" : "fa fa-folder icon-state-success icon-lg"
						},
						"file" : {
							"icon" : "fa fa-file icon-state-info icon-lg"
						}
					},
					"state" : { "key" : "usergroup" },
					"plugins" : [ "contextmenu","dnd", "state", "types" ],
					"contextmenu": {    
						"items": {    
							"create": {    
								"label": "创建用户组",    
								"action": function (obj) {  
									App.doGroup(0);
								}    
							},  
							"rename": {    
								"label": "修改用户组",    
								"action": function (data) {  
									App.doGroup(1);
								}    
							},    
							"remove": {    
								"label": "删除用户组",    
								"action": function (obj) {  
									App.doGroup(2);  
								}    
							}  
						}    
					}   
				});
			//
			$("#TreeView1").on('move_node.jstree', function (e, data) {
					if(data.parent=="#" || data.old_parent=="#")
					{
						toastr["error"]("不能作为根目录！！","移动用户组失败");
						return;
					}
					//
					$.ajax({
								type: 'post',
								url: "srv/doGroup.tjs",
								data: {todo:3,parentId:data.parent,groupId:data.node.id,parentOldId:data.old_parent},
								dataType: "json",
								context:this,
								error: function (result) {
									alert("远程服务故障，请检查网络或稍后再试！");
								},
								success: function (result) {
									if(!result.flag)
									{
										toastr["error"](result.text,"移动用户组失败");
										return;
									}
									$('#TreeView1').jstree(true).refresh_node(result.parentId);
								}
						});			
			}).jstree();
			//
			$("#TreeView1").on('changed.jstree', function (e, data) {
					if(data.action=="select_node"
						&& App.showTreeType==0)
					{
						App.selGroupID=data.node.id;
						if(data.node.id==1)
							App.loadUserList(data.node.text,1,0);
						else
							App.loadUserList(data.node.li_attr.T_FullName,data.node.id,0);
					}
			}).jstree();
		},
		
		showGroupTree:function(){
			$("#TreeTitle").html("用户组");
			$("#TreeView1").show();
			$("#TreeView2").hide();
			$("#TreeView3").hide();
			this.showTreeType=0;
		},

		loadOrganizeTree:function(){
			 $("#TreeView2").jstree({
					"core" : {
						"themes" : {
							"responsive": false
						}, 
						// so that create works
						"check_callback" : true,
						'data' : {
							'url' : function (node) {
							  return 'srv/organizeTree.tjs';
							},
							'data' : function (node) {
							  return { 'parent' : node.id };
							}
						}
					},
					"types" : {
						"default" : {
							"icon" : "fa fa-folder icon-state-success icon-lg"
						},
						"file" : {
							"icon" : "fa fa-file icon-state-info icon-lg"
						}
					},
					"state" : { "key" : "organize" },
					"plugins" : [ "contextmenu","dnd", "state", "types" ],
					"contextmenu": {    
						"items": {    
							"create": {    
								"label": "创建部门",    
								"action": function (obj) {  
									App.doGroup(0);
								}    
							},  
							"rename": {    
								"label": "修改部门",    
								"action": function (data) {  
									App.doGroup(1);
								}    
							},    
							"remove": {    
								"label": "删除部门",    
								"action": function (obj) {  
									App.doGroup(2);  
								}    
							}  
						}    
					}   
			});
			//
			$("#TreeView2").on('move_node.jstree', function (e, data) {
					if(data.parent=="#" || data.old_parent=="#")
					{
						toastr["error"]("不能作为根目录！！","移动部门失败");
						return;
					}
					//
					$.ajax({
								type: 'post',
								url: "srv/doOrganize.tjs",
								data: {todo:3,parentId:data.parent,organizeId:data.node.id,parentOldId:data.old_parent},
								dataType: "json",
								context:this,
								error: function (result) {
									alert("远程服务故障，请检查网络或稍后再试！");
								},
								success: function (result) {
									if(!result.flag)
									{
										toastr["error"](result.text,"移动部门失败");
										return;
									}
									$('#TreeView2').jstree(true).refresh_node(result.parentId);
								}
						});			
			}).jstree();
			//
			$("#TreeView2").on('changed.jstree', function (e, data) {
					if(data.action=="select_node"
						&& App.showTreeType==1)
					{
						App.selOrganizeID=data.node.id;
						if(data.node.id==2)
							App.loadUserList(data.node.text,2,1);
						else
							App.loadUserList(data.node.li_attr.T_FullName,data.node.id,1);
					}
			}).jstree();
		},

		
		showOrganizeTree:function(){
			$("#TreeTitle").html("部门");
			$("#TreeView1").hide();
			$("#TreeView2").show();
			$("#TreeView3").hide();
			this.showTreeType=1;
		},

		loadRoleTree:function(){
			 $("#TreeView3").jstree({
					"core" : {
						"themes" : {
							"responsive": false
						}, 
						// so that create works
						"check_callback" : true,
						'data' : {
							'url' : function (node) {
							  return 'srv/roleTree.tjs';
							},
							'data' : function (node) {
							  return { 'parent' : node.id };
							} 
						}
					},
					"types" : {
						"default" : {
							"icon" : "fa fa-folder icon-state-success icon-lg"
						},
						"file" : {
							"icon" : "fa fa-file icon-state-info icon-lg"
						}
					},
					"state" : { "key" : "usergroup" },
					"plugins" : [ "contextmenu","dnd", "state", "types" ],
					"contextmenu": {    
						"items": {    
							"create": {    
								"label": "创建角色",    
								"action": function (obj) {  
									App.doGroup(0);
								}    
							},  
							"rename": {    
								"label": "修改角色",    
								"action": function (data) {  
									App.doGroup(1);
								}    
							},    
							"remove": {    
								"label": "删除角色",    
								"action": function (obj) {  
									App.doGroup(2);  
								}    
							}  
						}    
					}   
				});
			//
			$("#TreeView3").on('move_node.jstree', function (e, data) {
					if(data.parent=="#" || data.old_parent=="#")
					{
						toastr["error"]("不能作为根目录！！","移动角色树失败");
						return;
					}
					//
					$.ajax({
								type: 'post',
								url: "srv/doRole.tjs",
								data: {todo:3,parentId:data.parent,roleId:data.node.id,parentOldId:data.old_parent},
								dataType: "json",
								context:this,
								error: function (result) {
									alert("远程服务故障，请检查网络或稍后再试！");
								},
								success: function (result) {
									if(!result.flag)
									{
										toastr["error"](result.text,"移动角色树失败");
										return;
									}
									$('#TreeView3').jstree(true).refresh_node(result.parentId);
								}
						});			
			}).jstree();
			//
			$("#TreeView3").on('changed.jstree', function (e, data) {
					if(data.action=="select_node"
						&& App.showTreeType==2)
					{
						App.selRoleID=data.node.id;
						if(data.node.id==3)
							App.loadUserList(data.node.text,3,2);
						else
							App.loadUserList(data.node.li_attr.T_FullName,data.node.id,2);
					}
			}).jstree();
		},
		
		showRoleTree:function(){
			$("#TreeTitle").html("角色");
			$("#TreeView1").hide();
			$("#TreeView2").hide();
			$("#TreeView3").show();
			this.showTreeType=2;
		},

		initUserList:function(){
			this.oTable = $('#ListView').DataTable({
				"language": {
					"aria": {
						"sortAscending": ": activate to sort column ascending",
						"sortDescending": ": activate to sort column descending"
					},
					"emptyTable": "没有用户账户信息",
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
				"bStateSave": true,
				"columnDefs": [ {
					"targets": 0,
					"orderable": false,
					"searchable": false
				},{
					"targets": 7,
					"orderable": false,
					"searchable": false
				},{ 
					"type": "ip-address", 
					targets: 6
				}],

				"order": [
					[1, 'asc']
				],
				
				"lengthMenu": [
					[100, 200, 300, 500, -1],
					[100, 200, 300, 500, "全部"] // change per page values here
				],
				// set the initial value
				"pageLength": 100,
				"ajax": ''
			});
			//
			$('#ListView').find('.group-checkable').change(function () {
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

			$('#ListView').on('change', 'tbody tr .checkboxes', function () {
				$(this).parents('tr').toggleClass("active");
			});
			//
			App.runResizeHandlers();
			//
			this.oTable.on( 'draw.dt', function (e, settings, data) {
                App.unblockUI($("#tab_1_2"));
				App.initAjax();
			});
		},

		loadUserList:function(name,id,type){
			$("#ListTitle").html(name);
			if(id==2)
			{
				$("#mainFrame").find(".btn-add").hide();
				$("#mainFrame").find(".btn-del").hide();
				$("#mainFrame").find(".btn-apply").hide();
				$("#mainFrame").find(".btn-refresh").show();
				$("#mainFrame").find(".tab-content .tab-pane").removeClass("active");
				$("#tab_1_1").addClass("active");
				this.loadUserKpi();
			}
			else
			{
				$("#mainFrame").find(".btn-add").show();
				$("#mainFrame").find(".btn-del").show();
				$("#mainFrame").find(".btn-apply").show();
				$("#mainFrame").find(".btn-refresh").hide();
				$("#mainFrame").find(".tab-content .tab-pane").removeClass("active");
				$("#tab_1_2").addClass("active");
				//
				this.oTable.clear().draw();
				//
				App.blockUI({
					target: $("#tab_1_2"),
					animate: true,
					overlayColor: 'none'
				});
				//
				this.oTable.ajax.url( 'srv/getUserList.tjs?id='+id+'&type='+type ).load();
				this.fromId=id;
				this.fromType=type;
			}
		},

		loadUserKpi:function(){
			$.ajax({
					url: "srv/getUserKpi.tjs",
					dataType: "json",
					context: this,
					success: function (result) {
						if(!result.flag)
						{
							toastr["error"](result.info,"加载账户数据分析失败");
							return;
						}
						//
						$('#UserPie1').empty();
						$('#UserPie1').highcharts({
							chart: {
								type: 'pie',
								margin: [0, 10, 25, 15]
							},
							title: {
								text: "帐户汇总",
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
								data: result.UserPie1,
								tooltip: {
									valueSuffix:"个"
								}
							}]
						});
						//
						$('#UserPie2').empty();
						$('#UserPie2').highcharts({
							chart: {
								type: 'pie',
								margin: [0, 10, 25, 10]
							},
							title: {
								text: "分组帐户",
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
								data: result.UserPie2,
								tooltip: {
									valueSuffix:"个"
								}
							}]
						});
						//
						$('#UserPie3').empty();
						$('#UserPie3').highcharts({
							chart: {
								type: 'pie',
								margin: [0, 10, 25, 10]
							},
							title: {
								text: "角色帐户",
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
								data: result.UserPie3,
								tooltip: {
									valueSuffix:"个"
								}
							}]
						});
						//
						var now=new Date();
						var tc=new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
						$('#OrgBar').empty();
						$('#OrgBar').highcharts({
							chart: {
								zoomType: 'x',
								margin: [40, 30, 80, 60]
							},
							title: {
								text: "按部门帐户统计"
							},
							subtitle: {
								text: null
							},

							xAxis: {
								categories: result.orgCategories
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
							}],
							
							tooltip: {
								formatter: function() {
									return '<b>'+ this.x +'</b><br/>合计人数：'+TUI.Utils.formatNumber(this.total,"#,##0") +'个<br>'+
										this.series.name +'：'+ TUI.Utils.formatNumber(this.y,"#,##0") +'个<br>所占比率：'+TUI.Utils.formatNumber(this.percentage,"0.0") +'%';
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
							series: result.orgBar
						});
						//
						$('#SexBar').empty();
						$('#SexBar').highcharts({
							chart: {
								zoomType: 'x',
								margin: [40, 30, 80, 60]
							},
							title: {
								text: "按部门人员统计"
							},
							subtitle: {
								text: null
							},

							xAxis: {
								categories: result.orgCategories
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
									text: '人'
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
									return '<b>'+ this.x +'</b><br/>合计人数：'+TUI.Utils.formatNumber(this.total,"#,##0") +'人<br>'+
										this.series.name +'：'+ TUI.Utils.formatNumber(this.y,"#,##0") +'人<br>所占比率：'+TUI.Utils.formatNumber(this.percentage,"0.0") +'%';
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
							series: result.sexBar
						});
					}
			});
		},
		loadOrganizeList:function(){
			$.ajax({
						type: 'get',
						url: "srv/getOrganizeList.tjs",
						dataType: "json",
						context:this,
						error: function (result) {
							alert("远程服务故障，请检查网络或稍后再试！");
						},
						success: function (result) {
							if(result.flag)
							{
								App.organizeList=result.data;
							}
							else
							{
								App.organizeList=[];
							}
						}
				});
		},
		doAuth:function(id){
			$.ajax({
						url: "srv/getUserDetail.tjs?id="+id,
						type: "GET",
						dataType: "json",
						context:this,
						error: function () {
							alert("对不起，获取数据失败！");
						},
						success: function (data) {
							var oragnizeHtml='<select id="organizeId" class="form-control">';
							for(var i=0;i<App.organizeList.length;i++)
							{
								if(data.T_OrgID==App.organizeList[i].id)
									oragnizeHtml+=('<option value="'+App.organizeList[i].id+'" selected>'+App.organizeList[i].fullname+'</option>');
								else
									oragnizeHtml+=('<option value="'+App.organizeList[i].id+'">'+App.organizeList[i].fullname+'</option>');
							}
							oragnizeHtml+='</select>';
							//
							bootbox.dialog({
										message: '<div class="tabbable-line">'
												+'	<ul class="nav nav-tabs">'
												+'		<li class="active">'
												+'			<a href="#tab_1_1_3" data-toggle="tab" aria-expanded="false"> 指定用户组 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_4" data-toggle="tab" aria-expanded="false"> 分配角色 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_5" data-toggle="tab" aria-expanded="false"> 应用权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_6" data-toggle="tab" aria-expanded="false"> 资源权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_7" data-toggle="tab" aria-expanded="false"> 视频权限 </a>'
												+'		</li>'
												+'	</ul>'
												+'	<div class="tab-content" style="padding: 20px 10px 0 10px;">'
												+'		<div class="tab-pane active" id="tab_1_1_3">'
												+'			<div id="GroupTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_4">'
												+'			<div id="RoleTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_5">'
												+'			<div id="AppTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_6">'
												+'			<div id="ResTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_7">'
												+'			<div id="VideoTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'	</div>'
												+'</div>',
										title: "交叉授权（"+data.T_UserName+")",
										buttons: {
										  success: {
											label: "确定",
											className: "green",
											callback: function() { 
												var groupinstance = $('#GroupTree').jstree(true);
												var roleinstance = $('#RoleTree').jstree(true);
												var appinstance = $('#AppTree').jstree(true);
												var resinstance = $('#ResTree').jstree(true);
												var videoinstance = $('#VideoTree').jstree(true);
												$.ajax({
														type: 'post',
														url: "srv/doAuth.tjs",
														data:{
															parentId:TUI.env.us.userID,
															userId:data.T_UserID,
															groups:TUI.JSON.encode(groupinstance.get_selected()),
															roles:TUI.JSON.encode(roleinstance.get_selected()),
															func:TUI.JSON.encode(appinstance.get_selected()),
															res:TUI.JSON.encode(resinstance.get_selected()),
															video:TUI.JSON.encode(videoinstance.get_selected())
														},
														dataType: "json",
														context:this,
														error: function (result) {
															alert("远程服务故障，请检查网络或稍后再试！");
														},
														success: function (result) {
															if(!result.flag)
															{
																toastr["error"](result.text,"修改账户失败");
																return;
															}
															//
															$(".pointer").show();
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
								$('#GroupTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkGroupTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':data.T_UserID,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#RoleTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkRoleTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':data.T_UserID,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#AppTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkFuncTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':data.T_UserID,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#ResTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkResourceTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':data.T_UserID,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#VideoTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkVideoTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':data.T_UserID,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
						}
					});
		},
		doUser:function(type,id){
			switch(type)
			{
				case 0:
				{
					var oragnizeHtml='<select id="organizeId" class="form-control">';
					for(var i=0;i<App.organizeList.length;i++)
					{
						if(this.selOrganizeID==App.organizeList[i].id)
							oragnizeHtml+=('<option value="'+App.organizeList[i].id+'" selected>'+App.organizeList[i].fullname+'</option>');
						else
							oragnizeHtml+=('<option value="'+App.organizeList[i].id+'">'+App.organizeList[i].fullname+'</option>');
					}
					oragnizeHtml+='</select>';
					//
					bootbox.dialog({
										message: '<div class="tabbable-line">'
												+'	<ul class="nav nav-tabs">'
												+'		<li class="active">'
												+'			<a href="#tab_1_1_1" data-toggle="tab" aria-expanded="true"> 基本信息 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_2" data-toggle="tab" aria-expanded="true"> 扩展信息 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_3" data-toggle="tab" aria-expanded="false"> 指定用户组 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_4" data-toggle="tab" aria-expanded="false"> 分配角色 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_5" data-toggle="tab" aria-expanded="false"> 应用权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_6" data-toggle="tab" aria-expanded="false"> 资源权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_7" data-toggle="tab" aria-expanded="false"> 视频权限 </a>'
												+'		</li>'
												+'	</ul>'
												+'	<div class="tab-content" style="padding: 20px 10px 0 10px;">'
												+'		<div class="tab-pane active" id="tab_1_1_1">'
												+'<form class="form-horizontal" role="form">'
												+'	<div class="form-body">'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">用户姓名 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4"><input id="fullName" class="form-control" placeholder="用户真实姓名..."/></div>'
												+'			<label class="col-sm-2 control-label">用户昵称 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4"><input id="nickName" class="form-control" placeholder="用户网络昵称..."/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">用户称呼 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4"><input id="callName" class="form-control" placeholder="先生或女生..."/></div>'
												+'			<label class="col-sm-2 control-label">所在部门&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4">'+oragnizeHtml+'</div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">电子邮箱&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4"><input id="eMail" class="form-control" placeholder="电子邮箱地址..."/></div>'
												+'			<label class="col-sm-2 control-label">联系电话&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4"><input id="phoneNum" class="form-control" placeholder="固定电话或手机号码..."/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">用户账号 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4"><input id="userName" class="form-control" placeholder="用户登录账号..."/></div>'
												+'			<label class="col-sm-2 control-label">用户密码 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4"><input id="userPass" type="password" class="form-control" placeholder="用户登录密码..."/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">允许登录&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4"><input id="allowIPAddr" class="form-control" placeholder="允许登录IP地址..."/></div>'
												+'			<label class="col-sm-2 control-label">账号类型 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4">'
												+'				<select id="userType" class="form-control">'
												+((TUI.env.us.isUserSuper || TUI.env.us.isUserAdmin)?'<option value="0">分级管理账户</option>':'')
												+'					<option value="1">普通访问账户</option>'
												+(TUI.env.us.isUserSuper?'<option value="2">应用接口账户</option>':'')
												+'					<option value="3">临时禁用账户</option>'
												+'				</select>'
												+'			</div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">统一账号&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4"><input id="ssoID" class="form-control" placeholder="单点登录账号..."/></div>'
												+'			<label class="col-sm-2 control-label">微信账号&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4"><input id="openID" class="form-control" placeholder="微信登录OpenID..."/></div>'
												+'		</div>'
												+'	</div>'
												+'</form>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_2">'
												+'<form class="form-horizontal" role="form">'
												+'	<div class="form-body">'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">身份证号</label>'
												+'			<div class="col-sm-4"><input id="userCardID" class="form-control" placeholder="用户身份证号..."/></div>'
												+'			<label class="col-sm-2 control-label">学(工)号</label>'
												+'			<div class="col-sm-4"><input id="userSN" class="form-control" placeholder="用户学号或工号..."/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">所在城市</label>'
												+'			<div class="col-sm-4"><input id="userCity" class="form-control" placeholder="用户所在城市..."/></div>'
												+'			<label class="col-sm-2 control-label">所在省份</label>'
												+'			<div class="col-sm-4"><input id="userProvince" class="form-control" placeholder="用户所在省份..."/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">所在国籍</label>'
												+'			<div class="col-sm-4"><input id="userCountry" class="form-control" placeholder="用户所在国籍..."/></div>'
												+'			<label class="col-sm-2 control-label">地址邮编</label>'
												+'			<div class="col-sm-4"><input id="addrCode" class="form-control" placeholder="所在地址邮编..."/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">所在地址</label>'
												+'			<div class="col-sm-10"><input id="userAddress" class="form-control" placeholder="填写用户联系地址..."/></div>'
												+'		</div>'
												+'		<div class="form-group" style="margin-bottom: 19px;">'
												+'			<label class="col-sm-2 control-label">用户信息</label>'
												+'			<div class="col-sm-10"><textarea id="userInfo" class="form-control" rows="3" placeholder="填写用户描述信息..."/></div>'
												+'		</div>'
												+'	</div>'
												+'</form>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_3">'
												+'			<div id="GroupTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_4">'
												+'			<div id="RoleTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_5">'
												+'			<div id="AppTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_6">'
												+'			<div id="ResTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_7">'
												+'			<div id="VideoTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'	</div>'
												+'</div>',
										title: "添加账户",
										buttons: {
										  success: {
											label: "确定",
											className: "green",
											callback: function() { 
												var fullName=$('#fullName').prop("value");
												var nickName=$('#nickName').prop("value");
												var callName=$('#callName').prop("value");
												var userName=$('#userName').prop("value");
												var userPass=$('#userPass').prop("value");
												var userType= $("#userType").val();
												var organizeId= $("#organizeId").val();
												var eMail=$('#eMail').prop("value");
												var phoneNum=$('#phoneNum').prop("value");
												var allowIPAddr=$('#allowIPAddr').prop("value");
												var ssoID=$('#ssoID').prop("value");
												var openID=$('#openID').prop("value");
												var userCardID=$('#userCardID').prop("value");
												var userSN=$('#userSN').prop("value");
												var userCity=$('#userCity').prop("value");
												var userProvince=$('#userProvince').prop("value");
												var userCountry=$('#userCountry').prop("value");
												var addrCode=$('#addrCode').prop("value");
												var userAddress=$('#userAddress').prop("value");
												var userInfo=$('#userInfo').prop("value");
												if(fullName=="")
												{
													toastr["warning"]("没有输入用户姓名！","添加账户");
												}
												else if(userName=="")
												{
													toastr["warning"]("没有输入登录账号！","添加账户");
												}
												else
												{
													var groupinstance = $('#GroupTree').jstree(true);
													var roleinstance = $('#RoleTree').jstree(true);
													var appinstance = $('#AppTree').jstree(true);
													var resinstance = $('#ResTree').jstree(true);
													var videoinstance = $('#VideoTree').jstree(true);
													$.ajax({
															type: 'post',
															url: "srv/doUser.tjs",
															data:{todo:0,
																parentId:TUI.env.us.userID,
																organizeId:organizeId,
																fullName:fullName,
																nickName:escape(nickName),
																callName:callName,
																userName:userName,
																userPass:(userPass==""?"":TUI.Utils.hex_sha1(userName + "-" + userPass)),
																userType:userType,
																eMail:eMail,
																phoneNum:phoneNum,
																allowIPAddr:allowIPAddr,
																ssoID:ssoID,
																openID:openID,
																userCardID:userCardID,
																userSN:userSN,
																userCity:userCity,
																userProvince:userProvince,
																userCountry:userCountry,
																addrCode:addrCode,
																userAddress:userAddress,
																userInfo:userInfo,
																groups:TUI.JSON.encode(groupinstance.get_selected()),
																roles:TUI.JSON.encode(roleinstance.get_selected()),
																func:TUI.JSON.encode(appinstance.get_selected()),
																res:TUI.JSON.encode(resinstance.get_selected()),
																video:TUI.JSON.encode(videoinstance.get_selected())
															},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"添加账户失败");
																	return;
																}
																//短信提醒账号
																if(userPass!="" && phoneNum!="")
																{
																	$.ajax({
																			type: 'post',
																			url: "/API/Contact/SMS",
																			data: { phonenum: phoneNum, content: fullName+'，您好!你在 ' + window.location.hostname + ' 的登录帐户为：' + userName + '，密码为：' + userPass + '。日后请使用此帐号登录，并及时修改初始密码。在此欢迎并感谢你使用新思物联网集成平台，祝你有愉快的一天！' },
																			dataType: "json",
																			error: function (result) {
																				toastr["error"]("发送短信网络通信错误！","提醒账户失败");
																			},
																			success: function (result) {
																				if (!result.flag) {
																					toastr["error"](result.info,"提醒账户失败");
																					return;
																				}
																			}
																		});
																}
																//
																$(".pointer").show();
																App.oTable.ajax.reload();
															}
													});
												}
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
								$('#GroupTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkGroupTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#RoleTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkRoleTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#AppTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkFuncTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#ResTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkResourceTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#VideoTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkVideoTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
					//
					$('.modal-dialog').css({width:650});
				}
				break;
				case 1:
				{
					$.ajax({
						url: "srv/getUserDetail.tjs?id="+id,
						type: "GET",
						dataType: "json",
						context:this,
						error: function () {
							alert("对不起，获取数据失败！");
						},
						success: function (data) {
							var oragnizeHtml='<select id="organizeId" class="form-control">';
							for(var i=0;i<App.organizeList.length;i++)
							{
								if(data.T_OrgID==App.organizeList[i].id)
									oragnizeHtml+=('<option value="'+App.organizeList[i].id+'" selected>'+App.organizeList[i].fullname+'</option>');
								else
									oragnizeHtml+=('<option value="'+App.organizeList[i].id+'">'+App.organizeList[i].fullname+'</option>');
							}
							oragnizeHtml+='</select>';
							//
							bootbox.dialog({
										message: '<div class="tabbable-line">'
												+'	<ul class="nav nav-tabs">'
												+'		<li class="active">'
												+'			<a href="#tab_1_1_1" data-toggle="tab" aria-expanded="true"> 基本信息 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_2" data-toggle="tab" aria-expanded="true"> 扩展信息 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_3" data-toggle="tab" aria-expanded="false"> 指定用户组 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_4" data-toggle="tab" aria-expanded="false"> 分配角色 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_5" data-toggle="tab" aria-expanded="false"> 应用权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_6" data-toggle="tab" aria-expanded="false"> 资源权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_7" data-toggle="tab" aria-expanded="false"> 视频权限 </a>'
												+'		</li>'
												+'	</ul>'
												+'	<div class="tab-content" style="padding: 20px 10px 0 10px;">'
												+'		<div class="tab-pane active" id="tab_1_1_1">'
												+'<form class="form-horizontal" role="form">'
												+'	<div class="form-body">'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">用户姓名 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4"><input id="fullName" class="form-control" placeholder="用户真实姓名..." value="'+data.T_FullName+'"/></div>'
												+'			<label class="col-sm-2 control-label">用户昵称 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4"><input id="nickName" class="form-control" placeholder="用户网络昵称..." value="'+unescape(unescape(data.T_NickName))+'"/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">用户称呼 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4"><input id="callName" class="form-control" placeholder="先生或女生..." value="'+data.T_Call+'"/></div>'
												+'			<label class="col-sm-2 control-label">所在部门&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4">'+oragnizeHtml+'</div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">电子邮箱&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4"><input id="eMail" class="form-control" placeholder="电子邮箱地址..." value="'+data.T_EMail+'"/></div>'
												+'			<label class="col-sm-2 control-label">联系电话&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4"><input id="phoneNum" class="form-control" placeholder="固定电话或手机号码..." value="'+data.T_PhoneNum+'"/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">用户账号 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4"><input id="userName" class="form-control" placeholder="用户登录账号..." value="'+data.T_UserName+'"/></div>'
												+'			<label class="col-sm-2 control-label">用户密码 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4"><input id="userPass" type="password" class="form-control" placeholder="密码不更改，填空" value=""/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">允许登录&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4"><input id="allowIPAddr" class="form-control" placeholder="允许登录IP地址..." value="'+data.T_AllowIPAddr+'"/></div>'
												+'			<label class="col-sm-2 control-label">账号类型 <span class="required" aria-required="true"> * </span></label>'
												+'			<div class="col-sm-4">'
												+'				<select id="userType" class="form-control">'
												+((TUI.env.us.isUserSuper || TUI.env.us.isUserAdmin)?'<option value="0" '+(data.T_UserType==0?'selected':'')+'>分级管理账户</option>':'')
												+'					<option value="1" '+(data.T_UserType==1?'selected':'')+'>普通访问账户</option>'
												+(TUI.env.us.isUserSuper?'<option value="2" '+(data.T_UserType==2?'selected':'')+'>应用接口账户</option>':'')
												+'					<option value="3" '+(data.T_UserType==3?'selected':'')+'>临时禁用账户</option>'
												+'				</select>'
												+'			</div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">统一账号&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4"><input id="ssoID" class="form-control" placeholder="单点登录账号..." value="'+(data.T_UserType==2?data.T_UserPass:data.T_SSOID)+'"/></div>'
												+'			<label class="col-sm-2 control-label">微信账号&nbsp;&nbsp;&nbsp;</label>'
												+'			<div class="col-sm-4"><input id="openID" class="form-control" placeholder="微信登录OpenID..." value="'+data.T_OpenID+'"/></div>'
												+'		</div>'
												+'	</div>'
												+'</form>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_2">'
												+'<form class="form-horizontal" role="form">'
												+'	<div class="form-body">'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">身份证号</label>'
												+'			<div class="col-sm-4"><input id="userCardID" class="form-control" value="'+data.T_UserCardID+'" placeholder="用户身份证号..."/></div>'
												+'			<label class="col-sm-2 control-label">学(工)号</label>'
												+'			<div class="col-sm-4"><input id="userSN" class="form-control" value="'+data.T_UserSN+'" placeholder="用户学号或工号..."/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">所在城市</label>'
												+'			<div class="col-sm-4"><input id="userCity" class="form-control" placeholder="用户所在城市..." value="'+data.T_City+'"/></div>'
												+'			<label class="col-sm-2 control-label">所在省份</label>'
												+'			<div class="col-sm-4"><input id="userProvince" class="form-control" placeholder="用户所在省份..." value="'+data.T_Province+'"/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">所在国籍</label>'
												+'			<div class="col-sm-4"><input id="userCountry" class="form-control" placeholder="用户所在国籍..." value="'+data.T_Country+'"/></div>'
												+'			<label class="col-sm-2 control-label">地址邮编</label>'
												+'			<div class="col-sm-4"><input id="addrCode" class="form-control" placeholder="所在地址邮编..." value="'+data.T_AddressCode+'"/></div>'
												+'		</div>'
												+'		<div class="form-group">'
												+'			<label class="col-sm-2 control-label">所在地址</label>'
												+'			<div class="col-sm-10"><input id="userAddress" class="form-control" placeholder="填写用户联系地址..." value="'+data.T_UserAddress+'"/></div>'
												+'		</div>'
												+'		<div class="form-group" style="margin-bottom: 19px;">'
												+'			<label class="col-sm-2 control-label">用户信息</label>'
												+'			<div class="col-sm-10"><textarea id="userInfo" class="form-control" rows="3" placeholder="填写用户描述信息..." value="'+data.T_UserInfo+'"/></div>'
												+'		</div>'
												+'	</div>'
												+'</form>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_3">'
												+'			<div id="GroupTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_4">'
												+'			<div id="RoleTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_5">'
												+'			<div id="AppTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_6">'
												+'			<div id="ResTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_7">'
												+'			<div id="VideoTree" style="width:100%;height:289px;overflow:auto;margin-bottom: 5px;border: 1px solid #c2cad8;"></div>'
												+'		</div>'
												+'	</div>'
												+'</div>',
										title: "修改账户（"+data.T_UserName+")",
										buttons: {
										  success: {
											label: "确定",
											className: "green",
											callback: function() { 
												var fullName=$('#fullName').prop("value");
												var nickName=$('#nickName').prop("value");
												var callName=$('#callName').prop("value");
												var userName=$('#userName').prop("value");
												var userPass=$('#userPass').prop("value");
												var userType= $("#userType").val();
												var organizeId= $("#organizeId").val();
												var eMail=$('#eMail').prop("value");
												var phoneNum=$('#phoneNum').prop("value");
												var allowIPAddr=$('#allowIPAddr').prop("value");
												var ssoID=$('#ssoID').prop("value");
												var openID=$('#openID').prop("value");
												var userCardID=$('#userCardID').prop("value");
												var userSN=$('#userSN').prop("value");
												var userCity=$('#userCity').prop("value");
												var userProvince=$('#userProvince').prop("value");
												var userCountry=$('#userCountry').prop("value");
												var addrCode=$('#addrCode').prop("value");
												var userAddress=$('#userAddress').prop("value");
												var userInfo=$('#userInfo').prop("value");
												if(fullName=="")
												{
													toastr["warning"]("没有输入用户姓名！","修改账户");
												}
												else if(userName=="")
												{
													toastr["warning"]("没有输入登录账号！","修改账户");
												}
												else
												{
													var groupinstance = $('#GroupTree').jstree(true);
													var roleinstance = $('#RoleTree').jstree(true);
													var appinstance = $('#AppTree').jstree(true);
													var resinstance = $('#ResTree').jstree(true);
													var videoinstance = $('#VideoTree').jstree(true);
													$.ajax({
															type: 'post',
															url: "srv/doUser.tjs",
															data:{
																todo:1,
																parentId:TUI.env.us.userID,
																userId:data.T_UserID,
																organizeId:organizeId,
																fullName:fullName,
																nickName:escape(nickName),
																callName:callName,
																userName:userName,
																userPass:(userPass.length==0?"":TUI.Utils.hex_sha1(userName + "-" + userPass)),
																userType:userType,
																eMail:eMail,
																phoneNum:phoneNum,
																allowIPAddr:allowIPAddr,
																ssoID:ssoID,
																openID:openID,
																userCardID:userCardID,
																userSN:userSN,
																userCity:userCity,
																userProvince:userProvince,
																userCountry:userCountry,
																addrCode:addrCode,
																userAddress:userAddress,
																userInfo:userInfo,
																groups:TUI.JSON.encode(groupinstance.get_selected()),
																roles:TUI.JSON.encode(roleinstance.get_selected()),
																func:TUI.JSON.encode(appinstance.get_selected()),
																res:TUI.JSON.encode(resinstance.get_selected()),
																video:TUI.JSON.encode(videoinstance.get_selected())
															},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"修改账户失败");
																	return;
																}
																//短信提醒账号
																if(userPass!="" && phoneNum!="")
																{
																	$.ajax({
																			type: 'post',
																			url: "/API/Contact/SMS",
																			data: { phonenum: phoneNum, content: '您的登录帐户（' + userName + '）密码已变更为：' + userPass + '，请妥善保管！' },
																			dataType: "json",
																			error: function (result) {
																				toastr["error"]("发送短信网络通信错误！","提醒账户失败");
																			},
																			success: function (result) {
																				if (!result.flag) {
																					toastr["error"](result.info,"提醒账户失败");
																					return;
																				}
																			}
																		});
																}
																//
																$(".pointer").show();
																App.oTable.ajax.reload();
															}
													});
												}
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
								$('#GroupTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkGroupTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':data.T_UserID,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#RoleTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkRoleTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':data.T_UserID,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#AppTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkFuncTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':data.T_UserID,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#ResTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkResourceTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':data.T_UserID,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#VideoTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkVideoTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':data.T_UserID,type:"user" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
							//
							$('.modal-dialog').css({width:650});
						}
					});
				}
				break;
				case 2:
				{
					var userList=[];
					$("input[name='selUserID']:checked").each(function () {
						userList[userList.length]={
														id:$(this).attr("id"),
														name:this.value
												   };
					});

					if(userList.length==0)
					{
						toastr["error"]("请首先选中需要删除的账户！！","删除选中账户失败");
						return;
					}

					bootbox.dialog({
										message: '您确定要删除当前选中的'+userList.length+'个账户？',
										title: "删除账户",
										buttons: {
										  success: {
											label: "确定",
											className: "red",
											callback: function() { 
												$.ajax({
															type: 'post',
															url: "srv/doUser.tjs",
															data: {todo:2,parentId:TUI.env.us.userID,userList:TUI.JSON.encode(userList)},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"删除选中账户失败");
																	return;
																}
																//
																App.oTable.ajax.reload();
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
				case 3:
				{
					var userList=[];
					$("input[name='selUserID']:checked").each(function () {
						userList[userList.length]=$(this).attr("id");
					});
					//
					bootbox.dialog({
										message: '您确定要更新生效当前账户策略状态机？',
										title: "生效账户",
										buttons: {
										  success: {
											label: "确定",
											className: "red",
											callback: function() { 
												$.ajax({
															type: 'post',
															url: "srv/doUser.tjs",
															data: {todo:3,parentId:TUI.env.us.userID,fromId:userList.length==0?App.fromId:userList.join(","),fromType:userList.length==0?App.fromType:3},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"生效当前账户策略状态机失败");
																	return;
																}
																else
																{
																	toastr["success"](result.text,"生效当前账户策略状态机成功");
																}
																$(".pointer").hide();
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
		},
		doGroup:function(type){
			switch(type)
			{
				case 0:	//添加
					{
						if(this.showTreeType==0)
						{
							var instance = $('#TreeView1').jstree(true);
							if(instance.get_selected(true).length==0)
							{
								toastr["error"]("请选择需要添加用户组的节点！！！","添加用户组");
								return;
							}
							//
							var selectNode=instance.get_selected(true)[0];
							//
							bootbox.dialog({
										message: '<div class="tabbable-line">'
												+'	<ul class="nav nav-tabs">'
												+'		<li class="active">'
												+'			<a href="#tab_1_1_1" data-toggle="tab" aria-expanded="true"> 基本信息 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_2" data-toggle="tab" aria-expanded="false"> 分配角色 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_3" data-toggle="tab" aria-expanded="false"> 应用权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_4" data-toggle="tab" aria-expanded="false"> 资源权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_5" data-toggle="tab" aria-expanded="false"> 视频权限 </a>'
												+'		</li>'
												+'	</ul>'
												+'	<div class="tab-content" style="padding: 10px 10px 0 10px;">'
												+'		<div class="tab-pane active" id="tab_1_1_1">'
												+'			<form role="form">'
												+'				<div class="form-body">'
												+'					<div class="form-group">'
												+'						<label class="control-label">用户组名称：</label>'
												+'						<input id="groupName" class="form-control" placeholder="请输入用户组名称..."/>'
												+'					</div>'
												+'					<div class="form-group">'
												+'						<label >用户组信息：</label>'
												+'						<textarea id="groupInfo" class="form-control" rows="8" placeholder="填写用户组描述信息..."/>'
												+'					</div>'
												+'				</div>'
												+'			</form>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_2">'
												+'			<div id="RoleTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_3">'
												+'			<div id="AppTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_4">'
												+'			<div id="ResTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_5">'
												+'			<div id="VideoTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'	</div>'
												+'</div>',
										title: "添加用户组",
										buttons: {
										  success: {
											label: "确定",
											className: "green",
											callback: function() { 
												var groupName=$('#groupName').prop("value");
												var groupInfo=$('#groupInfo').prop("value");
												if(groupName=="")
												{
													toastr["warning"]("没有输入用户组名称！","添加用户组");
												}
												else
												{
													var appinstance = $('#AppTree').jstree(true);
													var roleinstance = $('#RoleTree').jstree(true);
													var resinstance = $('#ResTree').jstree(true);
													var videoinstance = $('#VideoTree').jstree(true);
													$.ajax({
															type: 'post',
															url: "srv/doGroup.tjs",
															data: {
																todo:0,
																parentId:selectNode.id,
																groupId:0,
																groupName:groupName,
																fullName:(selectNode.id==1?groupName:(selectNode.li_attr.T_FullName+"."+groupName)),
																groupInfo:groupInfo,
																role:TUI.JSON.encode(roleinstance.get_selected()),
																func:TUI.JSON.encode(appinstance.get_selected()),
																res:TUI.JSON.encode(resinstance.get_selected()),
																video:TUI.JSON.encode(videoinstance.get_selected())
															},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"添加用户组失败");
																	return;
																}
																//
																instance.refresh_node(result.parentId);
															}
													});
												}
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
								$('#RoleTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkRoleTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"group" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#AppTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkFuncTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"group" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#ResTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkResourceTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"group" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#VideoTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkVideoTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"group" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
						}
						else if(this.showTreeType==1)
						{
							var instance = $('#TreeView2').jstree(true);
							if(instance.get_selected(true).length==0)
							{
								toastr["error"]("请选择需要添加部门的节点！！！","添加部门");
								return;
							}
							//
							var selectNode=instance.get_selected(true)[0];

							bootbox.dialog({
										message: '<div class="tabbable-line">'
												+'	<ul class="nav nav-tabs">'
												+'		<li class="active">'
												+'			<a href="#tab_1_1_1" data-toggle="tab" aria-expanded="true"> 基本信息 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_2" data-toggle="tab" aria-expanded="false"> 分配角色 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_3" data-toggle="tab" aria-expanded="false"> 应用权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_4" data-toggle="tab" aria-expanded="false"> 资源权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_5" data-toggle="tab" aria-expanded="false"> 视频权限 </a>'
												+'		</li>'
												+'	</ul>'
												+'	<div class="tab-content" style="padding: 10px 10px 0 10px;">'
												+'		<div class="tab-pane active" id="tab_1_1_1">'
												+'			<form class="form-horizontal" role="form">'
												+'				<div class="form-body">'
												+'					<div class="form-group">'
												+'						<label class="col-sm-2 control-label">部门名称：</label>'
												+'						<div class="col-sm-4"><input id="orgName" class="form-control" placeholder="请输入部门名称..."/></div>'
												+'						<label class="col-sm-2 control-label">机构代码：</label>'
												+'						<div class="col-sm-4"><input id="orgCode" class="form-control" placeholder="组织机构代码..."/></div>'
												+'					</div>'
												+'					<div class="form-group">'
												+'						<label class="col-sm-2 control-label">负&nbsp;&nbsp;责&nbsp;&nbsp;人：</label>'
												+'						<div class="col-sm-4"><input id="orgUser" class="form-control" placeholder="部门负责人姓名..."/></div>'
												+'						<label class="col-sm-2 control-label">联系电话：</label>'
												+'						<div class="col-sm-4"><input id="orgPhone" class="form-control" placeholder="部门联系电话..."/></div>'
												+'					</div>'
												+'					<div class="form-group">'
												+'						<label class="col-sm-2 control-label">部门地址：</label>'
												+'						<div class="col-sm-10"><input id="orgAddress" class="form-control"placeholder="填写部门联系地址..."/></div>'
												+'					</div>'
												+'					<div class="form-group">'
												+'						<label class="col-sm-2 control-label">部门信息：</label>'
												+'						<div class="col-sm-10"><textarea id="orgInfo" class="form-control" rows="5" placeholder="请输入部门描述信息..."/></div>'
												+'					</div>'
												+'				</div>'
												+'			</form>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_2">'
												+'			<div id="RoleTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_3">'
												+'			<div id="AppTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_4">'
												+'			<div id="ResTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_5">'
												+'			<div id="VideoTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'	</div>'
												+'</div>',
										title: "添加部门",
										buttons: {
										  success: {
											label: "确定",
											className: "green",
											callback: function() { 
												var orgName=$('#orgName').prop("value");
												var orgCode=$('#orgCode').prop("value");
												var orgUser=$('#orgUser').prop("value");
												var orgPhone=$('#orgPhone').prop("value");
												var orgAddress=$('#orgAddress').prop("value");
												var orgInfo=$('#orgInfo').prop("value");
												if(orgName=="")
												{
													toastr["warning"]("没有输入部门名称！","添加部门");
												}
												else
												{
													var appinstance = $('#AppTree').jstree(true);
													var roleinstance = $('#RoleTree').jstree(true);
													var resinstance = $('#ResTree').jstree(true);
													var videoinstance = $('#VideoTree').jstree(true);
													$.ajax({
															type: 'post',
															url: "srv/doOrganize.tjs",
															data: {
																	todo:0,
																	parentId:selectNode.id,
																	organizeId:0,
																	organizeName:orgName,
																	fullName:(selectNode.id==2?orgName:(selectNode.li_attr.T_FullName+"."+orgName)),
																	organizeCode:orgCode,
																	organizeUser:orgUser,
																	organizePhone:orgPhone,
																	organizeAddress:orgAddress,
																	organizeInfo:orgInfo,
																	role:TUI.JSON.encode(roleinstance.get_selected()),
																	func:TUI.JSON.encode(appinstance.get_selected()),
																	res:TUI.JSON.encode(resinstance.get_selected()),
																	video:TUI.JSON.encode(videoinstance.get_selected())
																},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"添加部门失败");
																	return;
																}
																//
																instance.refresh_node(result.parentId);
																App.loadOrganizeList();
															}
													});
												}
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
								$('#RoleTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkRoleTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"org" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#AppTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkFuncTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"org" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#ResTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkResourceTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"org" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#VideoTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkVideoTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':0,type:"org" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
						}
						else
						{
							var instance = $('#TreeView3').jstree(true);
							if(instance.get_selected(true).length==0)
							{
								toastr["error"]("请选择需要添加角色的节点！！！","添加角色");
								return;
							}
							//
							var selectNode=instance.get_selected(true)[0];

							bootbox.dialog({
										message: '<div class="tabbable-line">'
												+'	<ul class="nav nav-tabs">'
												+'		<li class="active">'
												+'			<a href="#tab_1_1_1" data-toggle="tab" aria-expanded="true"> 基本信息 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_2" data-toggle="tab" aria-expanded="false"> 应用权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_3" data-toggle="tab" aria-expanded="false"> 资源权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_4" data-toggle="tab" aria-expanded="false"> 视频权限 </a>'
												+'		</li>'
												+'	</ul>'
												+'	<div class="tab-content" style="padding: 10px 10px 0 10px;">'
												+'		<div class="tab-pane active" id="tab_1_1_1">'
												+'			<form role="form">'
												+'				<div class="form-body">'
												+'					<div class="form-group">'
												+'						<label class="control-label">角色名称：</label>'
												+'						<input id="roleName" class="form-control" placeholder="请输入角色名称..."/>'
												+'					</div>'
												+'					<div class="form-group">'
												+'						<label >角色信息：</label>'
												+'						<textarea id="roleInfo" class="form-control" rows="8" placeholder="填写角色描述信息..."/>'
												+'					</div>'
												+'				</div>'
												+'			</form>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_2">'
												+'			<div id="AppTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_3">'
												+'			<div id="ResTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_4">'
												+'			<div id="VideoTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'	</div>'
												+'</div>',
										title: "添加角色",
										buttons: {
										  success: {
											label: "确定",
											className: "green",
											callback: function() { 
												var roleName=$('#roleName').prop("value");
												var roleInfo=$('#roleInfo').prop("value");
												if(roleName=="")
												{
													toastr["warning"]("没有输入角色名称！","添加角色");
												}
												else
												{
													var appinstance = $('#AppTree').jstree(true);
													var resinstance = $('#ResTree').jstree(true);
													var videoinstance = $('#VideoTree').jstree(true);
													$.ajax({
															type: 'post',
															url: "srv/doRole.tjs",
															data: {
																	todo:0,
																	parentId:selectNode.id,
																	roleId:0,
																	roleName:roleName,
																	fullName:(selectNode.id==3?roleName:(selectNode.li_attr.T_FullName+"."+roleName)),
																	roleInfo:roleInfo,
																	func:TUI.JSON.encode(appinstance.get_selected()),
																	res:TUI.JSON.encode(resinstance.get_selected()),
																	video:TUI.JSON.encode(videoinstance.get_selected())
															},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"添加角色失败");
																	return;
																}
																//
																instance.refresh_node(result.parentId);
															}
													});
												}
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
								$('#AppTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkFuncTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,"id":0,type:"role" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#ResTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkResourceTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,"id":0,type:"role" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#VideoTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkVideoTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,"id":0,type:"role" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
						}
					}
					break;
				case 1:	//修改
					{
						if(this.showTreeType==0)
						{
							var instance = $('#TreeView1').jstree(true);
							if(instance.get_selected(true).length==0)
							{
								toastr["error"]("请选择需要修改的用户组！！！","修改用户组");
								return;
							}

							var selectNode=instance.get_selected(true)[0];
							if(selectNode.id==1 || selectNode.id==10)
							{
								toastr["error"]("系统默认不能修改！！！","修改用户组");
								return;
							}
							//
							bootbox.dialog({
										message:'<div class="tabbable-line">'
												+'	<ul class="nav nav-tabs">'
												+'		<li class="active">'
												+'			<a href="#tab_1_1_1" data-toggle="tab" aria-expanded="true"> 基本信息 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_2" data-toggle="tab" aria-expanded="false"> 分配角色 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_3" data-toggle="tab" aria-expanded="false"> 应用权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_4" data-toggle="tab" aria-expanded="false"> 资源权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_5" data-toggle="tab" aria-expanded="false"> 视频权限 </a>'
												+'		</li>'
												+'	</ul>'
												+'	<div class="tab-content" style="padding: 10px 10px 0 10px;">'
												+'		<div class="tab-pane active" id="tab_1_1_1">'
												+'			<form role="form">'
												+'				<div class="form-body">'
												+'					<div class="form-group">'
												+'						<label class="control-label">用户组名称：</label>'
												+'						<input id="groupName" class="form-control" placeholder="请输入用户组名称..." value="'+selectNode.li_attr.T_GroupName+'"/>'
												+'					</div>'
												+'					<div class="form-group">'
												+'						<label >用户组信息：</label>'
												+'						<textarea id="groupInfo" class="form-control" rows="8" placeholder="填写用户组描述信息...">'+selectNode.li_attr.T_GroupInfo+'</textarea>'
												+'					</div>'
												+'				</div>'
												+'			</form>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_2">'
												+'			<div id="RoleTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_3">'
												+'			<div id="AppTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_4">'
												+'			<div id="ResTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_5">'
												+'			<div id="VideoTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'	</div>'
												+'</div>',
										title: "修改用户组（"+selectNode.li_attr.T_GroupName+")",
										buttons: {
										  success: {
											label: "确定",
											className: "green",
											callback: function() { 
												var groupName=$('#groupName').prop("value");
												var groupInfo=$('#groupInfo').prop("value");
												if(groupName=="")
												{
													toastr["warning"]("没有输入用户组名称！","修改用户组");
												}
												else
												{
													var appinstance = $('#AppTree').jstree(true);
													var roleinstance = $('#RoleTree').jstree(true);
													var resinstance = $('#ResTree').jstree(true);
													var videoinstance = $('#VideoTree').jstree(true);
													var parentNode=instance.get_node(selectNode.li_attr.T_ParentID);
													$.ajax({
															type: 'post',
															url: "srv/doGroup.tjs",
															data: {
																	todo:1,
																	parentId:selectNode.li_attr.T_ParentID,
																	groupId:selectNode.li_attr.T_GroupID,
																	groupName:groupName,
																	fullName:(parentNode.id==1?groupName:(parentNode.li_attr.T_FullName+"."+groupName)),
																	groupInfo:groupInfo,
																	role:TUI.JSON.encode(roleinstance.get_selected()),
																	func:TUI.JSON.encode(appinstance.get_selected()),
																	res:TUI.JSON.encode(resinstance.get_selected()),
																	video:TUI.JSON.encode(videoinstance.get_selected())
																},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"修改用户组失败");
																	return;
																}
																//
																$(".pointer").show();
																instance.refresh_node(result.parentId);
															}
													});
												}
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
								$('#RoleTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkRoleTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':selectNode.li_attr.T_GroupID,type:"group" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#AppTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkFuncTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':selectNode.li_attr.T_GroupID,type:"group" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#ResTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkResourceTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':selectNode.li_attr.T_GroupID,type:"group" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#VideoTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkVideoTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':selectNode.li_attr.T_GroupID,type:"group" };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
						}
						else if(this.showTreeType==1)
						{
							var instance = $('#TreeView2').jstree(true);
							if(instance.get_selected(true).length==0)
							{
								toastr["error"]("请选择需要修改部门的节点！！！","修改部门");
								return;
							}

							var selectNode=instance.get_selected(true)[0];
							if(selectNode.id==2 || selectNode.id==20)
							{
								toastr["error"]("系统默认不能修改！！！","修改部门");
								return;
							}
							//
							bootbox.dialog({
										message: '<div class="tabbable-line">'
												+'	<ul class="nav nav-tabs">'
												+'		<li class="active">'
												+'			<a href="#tab_1_1_1" data-toggle="tab" aria-expanded="true"> 基本信息 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_2" data-toggle="tab" aria-expanded="false"> 分配角色 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_3" data-toggle="tab" aria-expanded="false"> 应用权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_4" data-toggle="tab" aria-expanded="false"> 资源权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_5" data-toggle="tab" aria-expanded="false"> 视频权限 </a>'
												+'		</li>'
												+'	</ul>'
												+'	<div class="tab-content" style="padding: 10px 10px 0 10px;">'
												+'		<div class="tab-pane active" id="tab_1_1_1">'
												+'			<form class="form-horizontal" role="form">'
												+'				<div class="form-body">'
												+'					<div class="form-group">'
												+'						<label class="col-sm-2 control-label">部门名称：</label>'
												+'						<div class="col-sm-4"><input id="orgName" class="form-control" placeholder="请输入部门名称..." value="'+selectNode.li_attr.T_OrgName+'"/></div>'
												+'						<label class="col-sm-2 control-label">机构代码：</label>'
												+'						<div class="col-sm-4"><input id="orgCode" class="form-control" placeholder="组织机构代码..." value="'+selectNode.li_attr.T_OrgCode+'"/></div>'
												+'					</div>'
												+'					<div class="form-group">'
												+'						<label class="col-sm-2 control-label">负&nbsp;&nbsp;责&nbsp;&nbsp;人：</label>'
												+'						<div class="col-sm-4"><input id="orgUser" class="form-control" placeholder="部门负责人姓名..." value="'+selectNode.li_attr.T_OrgUser+'"/></div>'
												+'						<label class="col-sm-2 control-label">联系电话：</label>'
												+'						<div class="col-sm-4"><input id="orgPhone" class="form-control" placeholder="部门联系电话..." value="'+selectNode.li_attr.T_OrgPhone+'"/></div>'
												+'					</div>'
												+'					<div class="form-group">'
												+'						<label class="col-sm-2 control-label">部门地址：</label>'
												+'						<div class="col-sm-10"><input id="orgAddress" class="form-control" placeholder="填写部门联系地址..." value="'+selectNode.li_attr.T_OrgAddress+'"/></div>'
												+'					</div>'
												+'					<div class="form-group">'
												+'						<label class="col-sm-2 control-label">部门信息：</label>'
												+'						<div class="col-sm-10"><textarea id="orgInfo" class="form-control" rows="5" placeholder="请输入部门描述信息...">'+selectNode.li_attr.T_OrgInfo+'</textarea></div>'
												+'					</div>'
												+'				</div>'
												+'			</form>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_2">'
												+'			<div id="RoleTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_3">'
												+'			<div id="AppTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_4">'
												+'			<div id="ResTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_5">'
												+'			<div id="VideoTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'	</div>'
												+'</div>',
										title: "修改部门（"+selectNode.li_attr.T_OrgName+")",
										buttons: {
										  success: {
											label: "确定",
											className: "green",
											callback: function() { 
												var orgName=$('#orgName').prop("value");
												var orgCode=$('#orgCode').prop("value");
												var orgUser=$('#orgUser').prop("value");
												var orgPhone=$('#orgPhone').prop("value");
												var orgAddress=$('#orgAddress').prop("value");
												var orgInfo=$('#orgInfo').prop("value");
												if(orgName=="")
												{
													toastr["warning"]("没有输入部门名称！","修改部门");
												}
												else
												{
													var appinstance = $('#AppTree').jstree(true);
													var roleinstance = $('#RoleTree').jstree(true);
													var resinstance = $('#ResTree').jstree(true);
													var videoinstance = $('#VideoTree').jstree(true);
													var parentNode=instance.get_node(selectNode.li_attr.T_ParentID);
													$.ajax({
															type: 'post',
															url: "srv/doOrganize.tjs",
															data: {
																todo:1,
																parentId:selectNode.li_attr.T_ParentID,
																organizeId:selectNode.li_attr.T_OrgID,
																organizeName:orgName,
																fullName:(parentNode.id==2?orgName:(parentNode.li_attr.T_FullName+"."+orgName)),
																organizeCode:orgCode,
																organizeUser:orgUser,
																organizePhone:orgPhone,
																organizeAddress:orgAddress,
																organizeInfo:orgInfo,
																role:TUI.JSON.encode(roleinstance.get_selected()),
																func:TUI.JSON.encode(appinstance.get_selected()),
																res:TUI.JSON.encode(resinstance.get_selected()),
																video:TUI.JSON.encode(videoinstance.get_selected())
															},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"修改部门失败");
																	return;
																}
																//
																$(".pointer").show();
																instance.refresh_node(result.parentId);
																App.loadOrganizeList();
															}
													});
												}
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
							$('#RoleTree').jstree({  
													'plugins' : [ "wholerow", "checkbox", "types" ],  
													'core' : {  
														"themes" : {  
															"responsive" : false  
														},  
														'data' : {
															'url' : function (node) {
															  return 'srv/checkRoleTree.tjs';
															},
															'data' : function (node) {
															  return { 'parent' : node.id,'id':selectNode.li_attr.T_OrgID,type:"org" };
															} 
														}
													},  
													"types" : {  
														"default" : {
															"icon" : "fa fa-folder icon-state-success icon-lg"
														},
														"file" : {
															"icon" : "fa fa-file icon-state-info icon-lg"
														} 
													}  
												});
							//
							$('#AppTree').jstree({  
													'plugins' : [ "wholerow", "checkbox", "types" ],  
													'core' : {  
														"themes" : {  
															"responsive" : false  
														},  
														'data' : {
															'url' : function (node) {
															  return 'srv/checkFuncTree.tjs';
															},
															'data' : function (node) {
															  return { 'parent' : node.id,'id':selectNode.li_attr.T_OrgID,type:"org" };
															} 
														}
													},  
													"types" : {  
														"default" : {
															"icon" : "fa fa-folder icon-state-success icon-lg"
														},
														"file" : {
															"icon" : "fa fa-file icon-state-info icon-lg"
														} 
													}  
												});
							//
							$('#ResTree').jstree({  
													'plugins' : [ "wholerow", "checkbox", "types" ],  
													'core' : {  
														"themes" : {  
															"responsive" : false  
														},  
														'data' : {
															'url' : function (node) {
															  return 'srv/checkResourceTree.tjs';
															},
															'data' : function (node) {
															  return { 'parent' : node.id,'id':selectNode.li_attr.T_OrgID,type:"org" };
															} 
														}
													},  
													"types" : {  
														"default" : {
															"icon" : "fa fa-folder icon-state-success icon-lg"
														},
														"file" : {
															"icon" : "fa fa-file icon-state-info icon-lg"
														} 
													}  
												});
							//
							$('#VideoTree').jstree({  
													'plugins' : [ "wholerow", "checkbox", "types" ],  
													'core' : {  
														"themes" : {  
															"responsive" : false  
														},  
														'data' : {
															'url' : function (node) {
															  return 'srv/checkVideoTree.tjs';
															},
															'data' : function (node) {
															  return { 'parent' : node.id,'id':selectNode.li_attr.T_OrgID,type:"org" };
															} 
														}
													},  
													"types" : {  
														"default" : {
															"icon" : "fa fa-folder icon-state-success icon-lg"
														},
														"file" : {
															"icon" : "fa fa-file icon-state-info icon-lg"
														} 
													}  
												});
						}
						else
						{
							var instance = $('#TreeView3').jstree(true);
							if(instance.get_selected(true).length==0)
							{
								toastr["error"]("请选择需要修改角色的节点！！！","修改角色");
								return;
							}

							var selectNode=instance.get_selected(true)[0];
							if(selectNode.id==3 || selectNode.id==30)
							{
								toastr["error"]("系统默认不能修改！！！","修改角色");
								return;
							}
							//
							bootbox.dialog({
										message: '<div class="tabbable-line">'
												+'	<ul class="nav nav-tabs">'
												+'		<li class="active">'
												+'			<a href="#tab_1_1_1" data-toggle="tab" aria-expanded="true"> 基本信息 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_2" data-toggle="tab" aria-expanded="false"> 应用权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_3" data-toggle="tab" aria-expanded="false"> 资源权限 </a>'
												+'		</li>'
												+'		<li class="">'
												+'			<a href="#tab_1_1_4" data-toggle="tab" aria-expanded="false"> 视频权限 </a>'
												+'		</li>'
												+'	</ul>'
												+'	<div class="tab-content" style="padding: 10px 10px 0 10px;">'
												+'		<div class="tab-pane active" id="tab_1_1_1">'
												+'			<form role="form">'
												+'				<div class="form-body">'
												+'					<div class="form-group">'
												+'						<label class="control-label">角色名称：</label>'
												+'						<input id="roleName" class="form-control" placeholder="请输入角色名称..."  value="'+selectNode.li_attr.T_RoleName+'"/>'
												+'					</div>'
												+'					<div class="form-group">'
												+'						<label >角色信息：</label>'
												+'						<textarea id="roleInfo" class="form-control" rows="8" placeholder="填写角色描述信息...">'+selectNode.li_attr.T_RoleInfo+'</textarea>'
												+'					</div>'
												+'				</div>'
												+'			</form>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_2">'
												+'			<div id="AppTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_3">'
												+'			<div id="ResTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'		<div class="tab-pane" id="tab_1_1_4">'
												+'			<div id="VideoTree" style="width:100%;height:270px;overflow:auto;border: 1px solid #c2cad8;margin-top: 7px;"></div>'
												+'		</div>'
												+'	</div>'
												+'</div>',
										title: "修改角色（"+selectNode.li_attr.T_RoleName+")",
										buttons: {
										  success: {
											label: "确定",
											className: "green",
											callback: function() { 
												var roleName=$('#roleName').prop("value");
												var roleInfo=$('#roleInfo').prop("value");
												if(roleName=="")
												{
													toastr["warning"]("没有输入角色名称！","修改角色");
												}
												else
												{
													var appinstance = $('#AppTree').jstree(true);
													var resinstance = $('#ResTree').jstree(true);
													var videoinstance = $('#VideoTree').jstree(true);
													var parentNode=instance.get_node(selectNode.li_attr.T_ParentID);
													$.ajax({
															type: 'post',
															url: "srv/doRole.tjs",
															data: {
																todo:1,
																parentId:selectNode.li_attr.T_ParentID,
																roleId:selectNode.li_attr.T_RoleID,
																roleName:roleName,
																fullName:(parentNode.id==3?roleName:(parentNode.li_attr.T_FullName+"."+roleName)),
																roleInfo:roleInfo,
																func:TUI.JSON.encode(appinstance.get_selected()),
																res:TUI.JSON.encode(resinstance.get_selected()),
																video:TUI.JSON.encode(videoinstance.get_selected())
															},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"修改角色失败");
																	return;
																}
																//
																$(".pointer").show();
																instance.refresh_node(result.parentId);
															}
													});
												}
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
								$('#AppTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkFuncTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':selectNode.li_attr.T_RoleID,type:'role' };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#ResTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkResourceTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':selectNode.li_attr.T_RoleID,type:'role' };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
								//
								$('#VideoTree').jstree({  
														'plugins' : [ "wholerow", "checkbox", "types" ],  
														'core' : {  
															"themes" : {  
																"responsive" : false  
															},  
															'data' : {
																'url' : function (node) {
																  return 'srv/checkVideoTree.tjs';
																},
																'data' : function (node) {
																  return { 'parent' : node.id,'id':selectNode.li_attr.T_RoleID,type:'role' };
																} 
															}
														},  
														"types" : {  
															"default" : {
																"icon" : "fa fa-folder icon-state-success icon-lg"
															},
															"file" : {
																"icon" : "fa fa-file icon-state-info icon-lg"
															} 
														}  
													});
						}
					}
					break;
				case 2:	//删除
					{
						if(this.showTreeType==0)
						{
							var instance = $('#TreeView1').jstree(true);
							if(instance.get_selected(true).length==0)
							{
								toastr["error"]("请选择需要删除用户组的节点！！！","删除用户组");
								return;
							}

							var selectNode=instance.get_selected(true)[0];
							if(selectNode.id==1 || selectNode.id==10)
							{
								toastr["error"]("系统默认禁止删除！！！","删除用户组");
								return;
							}
							//
							bootbox.dialog({
										message: '您确定要删除（'+selectNode.li_attr.T_GroupName+'）用户组？',
										title: "删除用户组",
										buttons: {
										  success: {
											label: "确定",
											className: "red",
											callback: function() { 
												$.ajax({
															type: 'post',
															url: "srv/doGroup.tjs",
															data: {todo:2,parentId:selectNode.li_attr.T_ParentID,groupId:selectNode.li_attr.T_GroupID},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"删除用户组失败");
																	return;
																}
																//
																$(".pointer").show();
																instance.delete_node(result.groupId);
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
						else if(this.showTreeType==1)
						{
							var instance = $('#TreeView2').jstree(true);
							if(instance.get_selected(true).length==0)
							{
								toastr["error"]("请选择需要删除部门的节点！！！","删除部门");
								return;
							}

							var selectNode=instance.get_selected(true)[0];
							if(selectNode.id==2 || selectNode.id==20)
							{
								toastr["error"]("系统默认禁止删除！！！","删除部门");
								return;
							}
							//
							bootbox.dialog({
										message: '您确定要删除（'+selectNode.li_attr.T_OrgName+'）部门？',
										title: "删除部门",
										buttons: {
										  success: {
											label: "确定",
											className: "red",
											callback: function() { 
												$.ajax({
															type: 'post',
															url: "srv/doOrganize.tjs",
															data: {todo:2,parentId:selectNode.li_attr.T_ParentID,organizeId:selectNode.li_attr.T_OrgID},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"删除部门失败");
																	return;
																}
																//
																$(".pointer").show();
																instance.delete_node(result.organizeId);
																App.loadOrganizeList();
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
							var instance = $('#TreeView3').jstree(true);
							if(instance.get_selected(true).length==0)
							{
								toastr["error"]("请选择需要删除角色的节点！！！","删除角色");
								return;
							}

							var selectNode=instance.get_selected(true)[0];
							if(selectNode.id==3 || selectNode.id==30)
							{
								toastr["error"]("系统默认禁止删除！！！","删除角色");
								return;
							}
							//
							bootbox.dialog({
										message: '您确定要删除（'+selectNode.li_attr.T_RoleName+'）角色？',
										title: "删除角色",
										buttons: {
										  success: {
											label: "确定",
											className: "red",
											callback: function() { 
												$.ajax({
															type: 'post',
															url: "srv/doRole.tjs",
															data: {todo:2,parentId:selectNode.li_attr.T_ParentID,roleId:selectNode.li_attr.T_RoleID},
															dataType: "json",
															context:this,
															error: function (result) {
																alert("远程服务故障，请检查网络或稍后再试！");
															},
															success: function (result) {
																if(!result.flag)
																{
																	toastr["error"](result.text,"删除角色失败");
																	return;
																}
																//
																$(".pointer").show();
																instance.delete_node(result.roleId);
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
					}
					break;
				default:
					break;
			}
		}
    };

}();