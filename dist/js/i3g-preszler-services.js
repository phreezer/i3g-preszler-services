/*!
* i3g-preszler-services - v0.1.10
* Homepage: http://i-3global.com
* Author: i3Global
* Author URL: http://i-3global.com/
*/
(function ($) {
	'use strict';
	/*jshint indent:4 */

	$.app = $.app || {};
	$.app.config = $.app.config || {
		API_SERVER: '/',
		API_PATH: 'wp-json/acf/v2/',
		API_ENDPOINT: 'options/services'
	};


	$.serviceServices = function () {

		var serviceServices = {},
			config = {},
			defaults = $.app.config,
			cached = null;

		defaults.API_ENDPOINT = 'options/services';


		function getConfig(defaults, options) {
			options = options || {};
			defaults = defaults || {};
			return $.extend(true, {}, defaults, options);
		}


		function limitText (txt, limit) {
			txt = txt || '';
			if(txt.length > limit) {
				txt = txt.substr(0, limit) + '...';
			}
			return txt;
		}

		function formatData(data) {
			$.each(data, function(index, value) {
				data[index].description = limitText(data[index].description, 40);
			});

			return data;
		}


		function getData() {
			var deferred = Q.defer(),
				url;

			url = config.API_SERVER + config.API_PATH + config.API_ENDPOINT;


			console.log('url:',url);
			$.get(url, function (data) {
				console.log('data', data.services);
				cached = formatData(data.services);
				deferred.resolve(cached);
			});

			return deferred.promise;
		}


		function get(options) {
			console.log('options:', options);
			config = getConfig(defaults, options);
			var deferred = Q.defer();
			if (cached === null) {
				deferred.resolve(getData());
			} else {
				deferred.resolve(cached);
			}

			return deferred.promise;
		}


		function update() {
			cached = null;
			return get();
		}




		serviceServices.get = get;
		serviceServices.update = update;

		return serviceServices;
	};


}(jQuery));


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
			console.log('Init Directive');
			$.serviceServices().get().then(function(data) {
				console.log('returned from Service:', data);
				scope.services = data;
				templateUpdate();
			});

		};




		this.init();

		return this;

	};


	$('.preszler-services').preszlerServices();

}(jQuery));
