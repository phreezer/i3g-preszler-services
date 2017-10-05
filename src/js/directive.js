(function ($) {
	'use strict';
	/*jshint indent:4 */

	$.fn.preszlerServices = function () {

		// Set Defaults
		$.app = $.app || {};
		$.app.config = $.app.config || {};
		$.app.config.ASSETS_DIRECTORY = $('script[src*=i3g-preszler-services]').attr('src').replace(/i3g-preszler-services.js.*/gi, '') + '../';

		var config = {};
		var defaults = $.app.config;
		var options = {
			TEMPLATE_URL: ($.app.config.ASSETS_DIRECTORY || '') + 'views/services-cards.html',
			TEMPLATE: ''
		};
		var scope = { services: [] };
		var elem = this.selector;
		var services = {};



		function getConfig(defaults, options) {
			options = options || {};
			defaults = defaults || {};
			return $.extend(true, {}, defaults, options);
		}

		function templateUpdate() {
			$.serviceTemplateLoader().update(scope, options).then(function (data) {
				$(elem).html(data);
			});
		}


		this.init = function () {
			// Get Config
			config = getConfig(defaults, options);

			// Get HTML Template
			templateUpdate();

			// Get JSON Feed
			$.serviceServices().get().then(function(data) {
				scope.services = data;
				templateUpdate();
			});

		};




		this.init();

		return this;

	};


	$('.preszler-services').preszlerServices();

}(jQuery));
