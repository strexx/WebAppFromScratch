(function () {

	"use strict";

	var API = {

		init: function() {

			// Check if localstorage is set

			if (localStorage.getItem("data") === null) {
				API.getData();
			} else {

				// Get localstorage data
				var data = localStorage.getItem('data');
			}
		},
		
		getData: function() {		

			// Ajax call and store in localStorage

			microAjax("http://api.nytimes.com/svc/books/v2/lists/2010-10-01/trade-fiction-paperback.json?api-key=9db42680b12e928d7f15d264928414ab:16:74324547", function (res) {
				var data = res;
				localStorage.setItem('data', data);
			});
		}
	};

	API.init();

})();		