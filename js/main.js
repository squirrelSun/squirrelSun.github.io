(function ($) {
    "use strict";

    $(function () { // start: document ready
        /**
         * 1.0 - Ace Init Main Vars
         */
        ace.html = $('html');
        ace.body = $('body');
        ace.color = ace.html.data('theme-color');

        /**
         * 2.0 - Ace Detect Device Type
         */
        ace_detect_device_type();

        /**
         * 3.0 - Ace Init Header
         */
        ace.header.head = $('#ace-header');
        ace.header.col1 = $('#ace-head-col1');
        ace.header.col2 = $('#ace-head-col2');
        ace.header.col3 = $('#ace-head-col3');

        ace_header_init(ace.header.head, ace.header.col1, ace.header.col2, ace.header.col3);

        /**
         *  4.0 - Ace Tab Navigation
         */
        if (ace.html.hasClass('ace-tab-nav-on') > 0) {
            if (Modernizr.mq('(min-width: 992px)')) {
                // Desktop Tab Navigation
                if (aceOptions.nav.height !== 'auto') {
                    // Set Nav Height
                    ace.nav.obj = $('#ace-nav-scroll');

                    ace.nav.obj.height(ace.nav.obj.height()).animate({height: aceOptions.nav.height}, 700, function(){
                        // Mouse Scroll
                        ace.nav.obj.mCustomScrollbar({
                            axis: "y",
                            scrollbarPosition: "outside"
                        });

                        // Arrow Scroll
                        if (aceOptions.nav.arrow) {
                            $("#ace-nav-tools").removeClass('hidden');

                            $("#ace-nav-arrow").on("click", function () {
                                $("#ace-nav-scroll").mCustomScrollbar('scrollTo', '-=300');
                            });
                        }
                    });
                }
            }

            // Tab Navigation Tooltips
            var timer;
            var tooltip;

            $('#ace-nav a').hover(function () {
                    var current = $(this);

                    timer = setTimeout(function () {
                        tooltip = $('<div class="ace-tooltip"></div>');

                        // Init vars
                        var top = current.offset().top;
                        var left = current.offset().left;
                        var right = left + current.outerWidth();
                        var width = current.outerWidth();
                        var height = 0; //(ace.nav.tooltip.height() - $(this).height() )/2;

                        // Append tooltip
                        ace.body.append(tooltip);

                        // Set tooltip text
                        tooltip.text(current.data('tooltip'));

                        // Positioning tooltip
                        if (right + tooltip.outerWidth() < $(window).width()) {
                            tooltip.addClass('arrow-left').css({"left": right + "px", "top": (top + height) + "px" });
                        } else {
                            tooltip.addClass('arrow-right').css({"left": (left - tooltip.outerWidth() - 10) + "px", "top": (top + height) + "px" });
                        }

                        // Show Tooltip
                        tooltip.fadeIn(300);
                    }, 300);
                },
                function () {
                    clearTimeout(timer);
                    if(typeof tooltip != 'undefined'){
                        tooltip.fadeOut(300, function () {
                            tooltip.remove();
                        });
                    }
                });
        }

        /**
         * Ace Mobile Navigation
         */
        $('#ace-main-nav-sm .has-sub-menu > a').on('click touchstart', function(){
            if( $(this).hasClass('hover') ){
                return true;
            } else {
                $(this).addClass('hover');
                $(this).next().slideDown(500);
                return false;
            }
        });

        /**
         * 5.0 - Ace Sidebar
         */
        ace.sidebar.obj = $('#ace-sidebar');
        ace.sidebar.btn = $('#ace-sidebar-btn');

        // Open Sidebar
        ace.sidebar.btn.on('touchstart click', function () {
            ace_open_sidebar();
        });

        // Close Sidebar Through Overlay
        $(document).on('touchstart click', '.ace-sidebar-opened #ace-overlay', function (e) {
            var container = ace.sidebar.obj;

            if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                ace_close_sidebar();
            }
        });

        // Close Sidebar Using Button
        $('#ace-sidebar-close').on('click', function () {
            ace_close_sidebar();
        });

        // Sidebar Custom Scroll
        $("#ace-sidebar-inner").mCustomScrollbar({
            axis: "y",
            theme: "minimal-dark",
            autoHideScrollbar: true,
            scrollButtons: { enable: true }
        });

        /**
         * 6.0 - Ace Circle & Line Charts
         */
        if(!aceOptions.animations || ace.mobile) {
            // Circle Chart
            ace.progress.charts = $('.progress-chart .progress-bar');
            for (var i = 0; i < ace.progress.charts.length; i++) {
                var chart = $(ace.progress.charts[i]);

                ace_progress_chart(chart[0], chart.data('text'), chart.data('value'), 1);
            }

            // Line Chart
            ace.progress.lines = $('.progress-line .progress-bar');
            for (var i = 0; i < ace.progress.lines.length; i++) {
                var line = $(ace.progress.lines[i]);

                ace_progress_line(line[0], line.data('text'), line.data('value'), 1);
            }
        }

        /**
         * 8.0 - Ace Animate Elements
         */
        if(aceOptions.animations && !ace.mobile) {
            ace_appear_elems($('.ace-animate'), 150);
        }

        /**
         * 9.0 - Code Highlight
         */
        $('pre').each(function (i, block) {
            hljs.highlightBlock(block);
        });

        /**
         * 10.0 - Ace Alerts
         */
        $('.alert .close').on('click', function () {
            var alert = $(this).parent();

            alert.fadeOut(500, function () {
                alert.remove();
            });
        });

        /**
         * 11.0 - Ace Slider
         */
        $('.slider').slick({
            dots: true
        });

        /**
         *  13.0 - Tabs
         */
        var tabActive = $('.tabs-menu>li.active');
        if( tabActive.length > 0 ){
            for (var i = 0; i < tabActive.length; i++) {
                var tab_id = $(tabActive[i]).children().attr('href');

                $(tab_id).addClass('active').show();
            }
        }

        $('.tabs-menu a').on('click', function(e){
            var tab = $(this);
            var tab_id = tab.attr('href');
            var tab_wrap = tab.closest('.tabs');
            var tab_content = tab_wrap.find('.tab-content');

            tab.parent().addClass("active");
            tab.parent().siblings().removeClass('active');
            tab_content.not(tab_id).removeClass('active').hide();
            $(tab_id).addClass('active').fadeIn(500);

            e.preventDefault();
        });

        /**
         * 14.0 - ToggleBox
         */
        var toggleboxActive = $('.togglebox>li.active');
        if( toggleboxActive.length > 0 ){
            toggleboxActive.find('.togglebox-content').show();
        }

        $('.togglebox-header').on('click', function(){
            var toggle_head = $(this);

            toggle_head.next('.togglebox-content').slideToggle(300);
            toggle_head.parent().toggleClass('active');
        });


        /**
         * 15.0 - Accordeon
         */
        var accordeonActive = $('.accordion>li.active');
        if( accordeonActive.length > 0 ){
            accordeonActive.find('.accordion-content').show();
        }

        $('.accordion-header').on('click', function(){
            var acc_head = $(this);
            var acc_section = acc_head.parent();
            var acc_content = acc_head.next();
            var acc_all_contents = acc_head.closest('.accordion').find('.accordion-content');

            if(acc_section.hasClass('active')){
                acc_section.removeClass('active');
                acc_content.slideUp();
            }else{
                acc_section.siblings().removeClass('active');
                acc_section.addClass('active');
                acc_all_contents.slideUp(300);
                acc_content.slideDown(300);
            }
        });

        /**
         * 16.0 - Comments Open/Close
         */
        $('.comment-replys-link').on('click', function(){
            $(this).closest('.comment').toggleClass('show-replies');

            return false;
        });

        /**
         * 17.0 - Portfolio Popup
         */
        var pf_popup = new Object();
        pf_popup.wrapper = null;
        pf_popup.content = null;
        pf_popup.slider = null;

        pf_popup.open = function ( el ){
            // Append Portfolio Popup
            this.wrapper = $('<div id="pf-popup-wrap" class="pf-popup-wrap">'+
            '<div class="pf-popup-inner">'+
            '<div class="pf-popup-middle">'+
            '<div class="pf-popup-container">'+
            '<button id="pf-popup-close"><i class="rsicon rsicon-close"></i></button>'+
            '<div id="pf-popup-content" class="pf-popup-content"></div>'+
            '</div>'+
            '</div>'+
            '</div>');

            ace.body.append(this.wrapper);

            // Add Portfolio Popup Items
            this.content = $('#pf-popup-content');
            this.content.append( el.clone() );

            // Make Portfolio Popup Visible
            pf_popup.wrapper.addClass('opened');
            ace_lock_scroll();
        };

        pf_popup.close = function(){
            this.wrapper.removeClass('opened');
            setTimeout(function(){
                pf_popup.wrapper.remove();
                ace_unlock_scroll();
            }, 500);
        };

        // Open Portfolio Popup
        $(document).on('click', '.pf-btn-view', function() {
            var id = $(this).attr('href');
            pf_popup.open( $(id) );

            ace.html.addClass('ace-portfolio-opened');

            return false;
        });

        // Close Portfolio Popup
        $(document).on('touchstart click', '.ace-portfolio-opened #pf-popup-wrap', function (e) {
            var container = $('#pf-popup-content');

            if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                pf_popup.close();
                ace.html.removeClass('ace-portfolio-opened');
            }
        });

    }); // end: document ready

    $(window).on('resize', function () { // Start: Window Resize
        ace_header_init(ace.header.head, ace.header.col1, ace.header.col2, ace.header.col3);
    }); // End: Window Resize

	$(window).on('load', function () { // Start: Window Load
		/**
         * Grid
         */
        var pf_grid = $('.pf-grid');
        if (pf_grid.length > 0) {

            // Isotope Initialization
            var grid = pf_grid.isotope({
                isOriginLeft: !aceOptions.rtl,
                itemSelector: '.pf-grid-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.pf-grid-sizer'
                }
            });

            var filter = $('.pf-filter');
            if (filter.length > 0) {
                var filter_btn = filter.find('button');
                var filter_btn_first = $('.pf-filter button:first-child');

                filter_btn_first.addClass('active');

                filter_btn.on('click', function () {
                    filter_btn.removeClass('active');
                    $(this).addClass('active');

                    var filterValue = $(this).attr('data-filter');
                    grid.isotope({ filter: filterValue });
                });
            }

			pf_grid.addClass('loaded');
        }
	});

    function ace_detect_device_type() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            ace.mobile = true;
            ace.html.addClass('ace-mobile');
        } else {
            ace.mobile = false;
            ace.html.addClass('ace-desktop');
        }
    }

    function ace_header_init(head, col1, col2, col3) {
        var col1_w = col1.find('#ace-logo').width() + 15;
        var col3_w = col3.find('#ace-sidebar-btn').width() + 15;

        if (head.hasClass('ace-head-boxed') && head.hasClass('ace-logo-out') || head.hasClass('ace-head-full') && col2.hasClass('text-center')) {
            // Header Boxed / Logo Out
            if (col1_w >= col3_w) {
                col1.width(col1_w);
                col3.width(col1_w);
            }
        } else {
            // Header Boxed / Logo In
            col1.width(col1_w);
            col3.width(col3_w);
        }
    }

    function ace_append_overlay() {
        ace.body.append(ace.overlay.obj);

        // Make the element fully transparent
        ace.overlay.obj[0].style.opacity = 0;

        // Make sure the initial state is applied
        window.getComputedStyle(ace.overlay.obj[0]).opacity;

        // Fade it in
        ace.overlay.obj[0].style.opacity = 1;
    }

    function ace_remove_overlay() {
        // Fade it out
        ace.overlay.obj[0].style.opacity = 0;

        // Remove overlay
        ace.overlay.obj.remove();
    }

    function ace_lock_scroll() {
        var initWidth = ace.html.outerWidth();
        var initHeight = ace.body.outerHeight();

        var scrollPosition = [
            self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
            self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        ];

        ace.html.data('scroll-position', scrollPosition);
        ace.html.data('previous-overflow', ace.html.css('overflow'));
        ace.html.css('overflow', 'hidden');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);

        var marginR = ace.body.outerWidth() - initWidth;
        var marginB = ace.body.outerHeight() - initHeight;
        ace.body.css({'margin-right': marginR, 'margin-bottom': marginB});
        ace.html.addClass('ace-lock-scroll');
    }

    function ace_unlock_scroll() {
        ace.html.css('overflow', ace.html.data('previous-overflow'));
        var scrollPosition = ace.html.data('scroll-position');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);

        ace.body.css({'margin-right': 0, 'margin-bottom': 0});
        ace.html.removeClass('ace-lock-scroll');
    }

    function ace_open_sidebar() {
        ace.html.addClass('ace-sidebar-opened');
        ace_append_overlay();
        ace_lock_scroll();
    }

    function ace_close_sidebar() {
        ace.html.removeClass('ace-sidebar-opened');
        ace_remove_overlay();
        ace_unlock_scroll();
    }

    function ace_progress_chart(element, text, value, duration) {
        var circle = new ProgressBar.Circle(element, {
            color: ace.color,
            strokeWidth: 5,
            trailWidth: 0,
            text: {
                value: text,
                className: 'progress-text',
                style: {
                    top: '50%',
                    left: '50%',
                    color: '#010101',
                    position: 'absolute',
                    margin: 0,
                    padding: 0,
                    transform: {
                        prefix: true,
                        value: 'translate(-50%, -50%)'
                    }
                },
                autoStyleContainer: true,
                alignToBottom: true
            },
            svgStyle: {
                display: 'block',
                width: '100%'
            },
            duration: duration,
            easing: 'easeOut'
        });

        circle.animate(value); // Number from 0.0 to 1.0
    }

    function ace_progress_line(element, text, value, duration) {
        var line = new ProgressBar.Line(element, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: duration,
            color: ace.color,
            trailColor: '#eee',
            trailWidth: 4,
            svgStyle: {
                width: '100%',
                height: '100%'
            },
            text: {
                value: text,
                className: 'progress-text',
                style: {
                    top: '-25px',
                    right: '0',
                    color: '#010101',
                    position: 'absolute',
                    margin: 0,
                    padding: 0,
                    transform: {
                        prefix: true,
                        value: 'translate(0, 0)'
                    }
                },
                autoStyleContainer: true
            }
        });

        line.animate(value);  // Number from 0.0 to 1.0
    }

    function ace_is_elem_in_viewport(el, vpart) {
        var rect = el[0].getBoundingClientRect();

        return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top + vpart <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function ace_is_elems_in_viewport(elems, vpart) {
        for (var i = 0; i < elems.length; i++) {
            var item = $(elems[i]);

            if (item.hasClass('ace-animate') && ace_is_elem_in_viewport(item, vpart)) {
                item.removeClass('ace-animate').addClass('ace-animated');

                // Animate Circle Chart
                if(item.hasClass('progress-chart')){
                    var chart = item.find('.progress-bar');
                    ace_progress_chart(chart[0], chart.data('text'), chart.data('value'), 1000);
                }

                // Animate Line Chart
                if(item.hasClass('progress-line')){
                    var line = item.find('.progress-bar');
                    ace_progress_line(line[0], line.data('text'), line.data('value'), 1000);
                }
            }
        }
    }

    function ace_appear_elems(elems, vpart) {
        ace_is_elems_in_viewport(elems, vpart);

        $(window).scroll(function () {
            ace_is_elems_in_viewport(elems, vpart);
        });

        $(window).resize(function () {
            ace_is_elems_in_viewport(elems, vpart);
        });
    }


})(jQuery);


