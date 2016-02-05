(function() {
	'use strict';

	var main = document.querySelector('main');
	var APP = {
		init: function() {

			routes.init();

		}
	}

	// Routing
	var routes = {
		init: function() {

			window.addEventListener('hashchange', sections.toggle ,false);
			window.addEventListener('load', sections.toggle ,false);

			window.addEventListener('hashchange', sections.toggle ,false);
			window.addEventListener('load', sections.toggle ,false);
		}
	}

	// Uitbreiden door views extern in te laden?
	// Loader.js

	var sections = {

		toggle: function() {
			
			// Get the hash of the current url after click
			var url = window.location.hash;

			if ( url ) {

				var matchingTemplate = document.querySelector(url);

				if ( matchingTemplate ) {

			var url = window.location.hash;

			if ( url ) {
				
				var matchingTemplate = document.querySelector(url);

				if ( matchingTemplate ) {

					main.innerHTML = matchingTemplate.innerHTML;

				} else {

					main.innerHTML = document.querySelector('#error').innerHTML;

				}

			} else {
				
				window.location.hash = '#home';

			} 

		}
	}

	// Initialize
	APP.init();

})();
