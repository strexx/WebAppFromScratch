(function() {
	'use strict';

	var main = document.querySelector('main');

	var app = {
		init: function() {

			routes.init();

		}
	}

	// Routing
	var routes = {
		init: function() {

			// haschanged event listener
			window.addEventListener('hashchange', sections.toggle ,false);
			// also check the page on load
			window.addEventListener('load', sections.toggle ,false);

		}
	}

	// Uitbreiden door views extern in te laden?

	var sections = {

		toggle: function() {

			// Get the hash of the current url after click
			var url = window.location.hash;

			if ( url ) {

				// Get the template that matches the url
				var matchingTemplate = document.querySelector(url);

				// If this templates exists
				if ( matchingTemplate ) {

					// Get the content from the matching template and use that content in the main html
					main.innerHTML = matchingTemplate.innerHTML;

				} else {

					// If the template doesn't exists: load the error template
					main.innerHTML = document.querySelector('#error').innerHTML;

				}

			} else {
				
				// If the url has no hash(so this is home) -> set the hash to start
				window.location.hash = '#home';

			} 

		}
	}

	// Initialize
	app.init();

})();