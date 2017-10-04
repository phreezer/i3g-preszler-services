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
			if(txt.length > limit) {
				txt = txt.substr(0, limit) + '...';
			}
			return txt;
		}

		function formatData(data) {
			data.description = limitText(data.description, 40);
			return data;
		}


		function getData() {
			var deferred = Q.defer(),
				url;

			// @ifdef PROD
			url = config.API_SERVER + config.API_PATH + config.API_ENDPOINT;
			// @endif

			// @ifdef DEBUG
			url = 'json/services.json';
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
