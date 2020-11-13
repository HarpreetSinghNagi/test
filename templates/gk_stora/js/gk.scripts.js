/**
 *
 * Stora - Joomla! template (for Joomla 3.8)
 *
 * Copyright (C) 2007-2018 Gavick.com. All Rights Reserved.
 * License: Copyrighted Commercial Software
 * Website: http://www.gavick.com
 * Support: support@gavick.com
 *               
 */

// IE checker
function gkIsIE() {
	var myNav = navigator.userAgent.toLowerCase();
	return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}
// jQuery Cookie plugin
jQuery.cookie = function (key, value, options) {
    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);
        if (value === null || value === undefined) {
            options.expires = -1;
        }
        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }
    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
//
jQuery(document).ready(function() {	
	// smooth anchor scrolling
	if(
		!(
			jQuery('#gkMainbody').find('.subpage').length && 
			jQuery('#gkMainbody').find('.subpage').hasClass('edit')
		) && !(
			jQuery('#modules-form').length
		)
	) {
		jQuery('a[href*="#"]').on('click', function (e) {
	        e.preventDefault();
	        if(
	        	this.hash !== '' && 
	        	this.hash.indexOf('carousel') === -1 &&
	        	this.hash.indexOf('advancedSearch') === -1
	        ) {
	            var target = jQuery(this.hash);
	            
	            if(this.hash !== '' && this.href.replace(this.hash, '') == window.location.href.replace(window.location.hash, '')) {    
	                if(target.length && this.hash !== '#') {
	                    jQuery('html, body').stop().animate({
	                        'scrollTop': target.offset().top
	                    }, 1000, 'swing', function () {
	                        if(this.hash !== '#') {
	                            window.location.hash = target.selector;
	                        }
	                    });
	                } else if(this.hash !== '' && this.href.replace(this.hash, '') !== '') {
	                	window.location.href = this.href;
	                }
	            } else if(this.hash !== '' && this.href.replace(this.hash, '') !== '') {
	            	window.location.href = this.href;
	            }
	        }
	    });
    }

    // Remove transparent navigation when there is no header image
    if(
    	(
    		jQuery('.single-page').length && 
    		jQuery('.single-page').hasClass('no-image')
    	) ||
    	jQuery('.error-page-container').length
    ) {
    	jQuery(document.body).removeClass('nav-transparent');
    }

	// store-module NSP suffix
	if(jQuery('.store-module').length) {
		jQuery('.store-module').find('.nspImageWrapper').on('click', function () {
			jQuery(this).parents('.nspArt').find('.addtocart-button').trigger('click');
		});
	}

	// Social icons
  jQuery('.item-social-icons').click(function() {
  	jQuery(this).toggleClass('open');
  	jQuery(this).parent().toggleClass('social-open');
  });

	// Category views in VM
	var vmContainers = jQuery('.latest-view, .featured-view, .topten-view, .recent-view, .category-view');

	if(vmContainers.length) {
		vmContainers.find('.product').each(function(i, product) {
			// Uncomment if you want to use plus sign as add to cart button
			/*
			var button = jQuery(product).find('input.addtocart-button');
			var wrapper = jQuery(product).find('.vm-product-media-container');

			if(button.length) {	
				wrapper.addClass('hidden-add-to-cart');
				wrapper.on('click', function(e) {
					e.preventDefault();
					e.stopPropagation();

					button.trigger('click');
				})
			} else {
				wrapper.addClass('hidden-choose-variant');
			}
			*/
			// Comment below fragment if you want to use plus sign hover as add to cart button
			var wrapper = jQuery(product).find('.vm-product-media-container');
			wrapper.addClass('hidden-add-to-cart');
			wrapper.on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				window.location = wrapper.find('a').attr('href');
			});
		});
	}
	
	// Social sharing popups
    var Config = {
        Link: ".icon-share-popup",
        Width: 500,
        Height: 500
    };
 
    // add handler links
    var slink = document.querySelectorAll(Config.Link);
    for (var a = 0; a < slink.length; a++) {
        slink[a].onclick = gkPopupHandler;
    }
 
    // create popup
    function gkPopupHandler(e) {
        e = (e ? e : window.event);
        var t = (e.target ? e.target : e.srcElement);
        // popup position
        var px = Math.floor(((screen.availWidth || 1024) - Config.Width) / 2),
            py = Math.floor(((screen.availHeight || 700) - Config.Height) / 2);
        // open popup
        var link_href = t.href ? t.href : t.parentNode.href;
        var popup = window.open(link_href, "social", 
            "width="+Config.Width+",height="+Config.Height+
            ",left="+px+",top="+py+
            ",location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1");
        if (popup) {
            popup.focus();
            if (e.preventDefault) e.preventDefault();
            e.returnValue = false;
        }
 
        return !!popup;
	}
});

/*
 * Popups
 */
(function($){
	$(document).ready(function() {
		var popup_overlay = jQuery('#gkPopupOverlay');
		var opened_popup = false;
		var popup_login = jQuery('#gkPopupLogin');
		var popup_cart = $('#gkPopupCart');
		
		popup_overlay.css({'display': 'none', 'opacity': 0});
		
		popup_overlay.click( function() {
			popup_overlay.css('opacity', 0);
			
			if(opened_popup == 'login') {
				popup_login.css('opacity', 0);
			} else {
				popup_cart.css('opacity', 0);
			}

			setTimeout(function () {
				if(opened_popup == 'login') {
					popup_login.css('display', 'none');
				} else {
					popup_cart.css('display', 'none');
				}
				
				popup_overlay.css('display', 'none');
			}, 450);
		});
		
		// login popup
		if(jQuery('#gkPopupLogin').length) {
			popup_login.css({'display': 'none', 'opacity': 0});
	
			jQuery('#gkUser').click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				popup_overlay.css('display', 'block');
				popup_login.css('display', 'block');
				opened_popup = 'login';
	
				setTimeout(function() {
					popup_overlay.css('opacity', .7);
					popup_login.css('opacity', 1);
				}, 50);
			});
		}
		
		if($('.gkCart').length > 0 && $('#gkPopupCart').length) { 
			var btn = $('.gkCart');
			popup_cart.css({'display': 'none', 'opacity': 0});
			var wait_for_results = true;
			var wait = false;
			
			btn.click(function(e) {
				e.preventDefault();
				e.stopPropagation();        
				
				if(!wait) {
					$.ajax({
						url: $GK_URL + 'index.php?tmpl=cart&tkn=' + Math.floor((Math.random() * 100000000) + 1),
						dataType: 'text',
						beforeSend: function() {
							btn.addClass('loading');
							wait = true;
							popup_overlay.css('display', 'block');
							setTimeout(function() {
								popup_overlay.css('opacity', .7);
							}, 50);
						},
						complete: function() {
							var timer = setInterval(function() {
								if(!wait_for_results) {	
									popup_cart.css('display', 'block');
									opened_popup = 'cart';
						
									setTimeout(function() {
										popup_cart.css('opacity', 1);
									}, 50);
									
									wait_for_results = true;
									wait = false;
									clearInterval(timer);
									btn.removeClass('loading');
								}
							},200);
						},
						success: function(data,textStatus) {
							$('#gkAjaxCart').html(data);
							wait_for_results = false;
							wait = false;
						}
					});
				}
			});
			
			if(btn.length > 0) {
				var gkCartDataRequest = function() {
					jQuery.ajax({
						url: $GK_URL + 'index.php?tmpl=json&tkn=' + Math.floor((Math.random() * 100000000) + 1),
						dataType: 'text',
						success: function(data,textStatus) {
							if(parseInt(data, 10) > 0) {
								btn.addClass('full-cart');	
							} else {
								btn.removeClass('full-cart');
							}
						}
					});
				} 
				
				gkCartDataRequest();
				
				$("body").on("updateVirtueMartCartModule", function(e) {
					gkCartDataRequest();
				});
			}
		}
	});
})(jQuery);

jQuery(window).on("load",function(){
	jQuery('#sbox-btn-close').append('<span class="element-invisible">Close</span>');
});

jQuery(function($) {
	"use strict";

	$(document)
		.on('click', ".btn-group label:not(.active)", function() {
			var $label = $(this);
			var $input = $('#' + $label.attr('for'));

			if ($input.prop('checked')) {
				return;
			}

			$label.closest('.btn-group').find("label").removeClass('active btn-success btn-danger btn-primary');

			var btnClass = 'primary';


			if ($input.val() != '')
			{
				var reversed = $label.closest('.btn-group').hasClass('btn-group-reversed');
				btnClass = ($input.val() == 0 ? !reversed : reversed) ? 'danger' : 'success';
			}

			$label.addClass('active btn-' + btnClass);
			$input.prop('checked', true).trigger('change');
		})
		.on('click', '#back-top', function (e) {
			e.preventDefault();
			$("html, body").animate({scrollTop: 0}, 1000);
		})
		.on('subform-row-add', initButtonGroup)
		.on('subform-row-add', initTooltip);

	initButtonGroup();
	initTooltip();

	// Called once on domready, again when a subform row is added
	function initTooltip(event, container)
	{
		$(container || document).find('*[rel=tooltip]').tooltip();
	}

	// Called once on domready, again when a subform row is added
	function initButtonGroup(event, container)
	{
		var $container = $(container || document);

		// Turn radios into btn-group
		$container.find('.radio.btn-group label').addClass('btn');

		$container.find(".btn-group input:checked").each(function()
		{
			var $input  = $(this);
			var $label = $('label[for=' + $input.attr('id') + ']');
			var btnClass = 'primary';

			if ($input.val() != '')
			{
				var reversed = $input.parent().hasClass('btn-group-reversed');
				btnClass = ($input.val() == 0 ? !reversed : reversed) ? 'danger' : 'success';
			}

			$label.addClass('active btn-' + btnClass);
		});
	}
});

jQuery(function($) {
$('#gkHeaderNav.affix-top').affix({
		offset: {
		  top: ($('#gkHeaderTop').outerHeight() + $('#gkTop').outerHeight())
		}
	});
});