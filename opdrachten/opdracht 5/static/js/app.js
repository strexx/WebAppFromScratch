(function() {
	'use strict';

	var main = document.querySelector('main');

<<<<<<< HEAD
	var app = {
=======
	var APP = {
>>>>>>> master
		init: function() {

			routes.init();

		}
	}

	// Routing
	var routes = {
		init: function() {
<<<<<<< HEAD

			// haschanged event listener
			window.addEventListener('hashchange', sections.toggle ,false);
			// also check the page on load
			window.addEventListener('load', sections.toggle ,false);

=======
			window.addEventListener('hashchange', sections.toggle ,false);
			window.addEventListener('load', sections.toggle ,false);
>>>>>>> master
		}
	}

	// Uitbreiden door views extern in te laden?
<<<<<<< HEAD
=======
	// Loader.js
>>>>>>> master

	var sections = {

		toggle: function() {

<<<<<<< HEAD
			// Get the hash of the current url after click
			var url = window.location.hash;

			if ( url ) {

				// Get the template that matches the url
				var matchingTemplate = document.querySelector(url);

				// If this templates exists
				if ( matchingTemplate ) {

					// Get the content from the matching template and use that content in the main html
=======
			var url = window.location.hash;

			if ( url ) {
				
				var matchingTemplate = document.querySelector(url);

				if ( matchingTemplate ) {

>>>>>>> master
					main.innerHTML = matchingTemplate.innerHTML;

				} else {

<<<<<<< HEAD
					// If the template doesn't exists: load the error template
=======
>>>>>>> master
					main.innerHTML = document.querySelector('#error').innerHTML;

				}

			} else {
				
<<<<<<< HEAD
				// If the url has no hash(so this is home) -> set the hash to start
=======
>>>>>>> master
				window.location.hash = '#home';

			} 

		}
	}

	// Initialize
<<<<<<< HEAD
	app.init();

})();
=======
	APP.init();

})();
>>>>>>> master
