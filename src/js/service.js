(function ($) {
	'use strict';
	/*jshint indent:4 */

	$.app = $.app || {};
	$.app.config = $.app.config || {
		API_SERVER: '/',
		API_PATH: 'wp-json/acf/v2/',
		API_ENDPOINT: 'options/slideshow'
	};


	$.serviceServices = function () {

		var serviceServices = {},
			config = {},
			defaults = $.app.config,
			cached = null;

		defaults.API_ENDPOINT = 'options/slideshow';


		function getConfig(defaults, options) {
			options = options || {};
			defaults = defaults || {};
			return $.extend(true, {}, defaults, options);
		}


		function formatData(data) {
			return data;
		}


		function getData() {
			var deferred = Q.defer(),
				url;

			// @ifdef PROD
			url = config.API_SERVER + config.API_PATH + config.API_ENDPOINT;
			// @endif

			// @ifdef DEBUG
			url = 'json/slideshow.json';
			// @endif

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