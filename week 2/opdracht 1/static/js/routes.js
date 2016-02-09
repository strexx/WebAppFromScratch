(function () {

	"use strict";

	routie({
	    
	    'home': function() {

	    	// Get home template from templates folder

	    	var GetTemplate = new HttpClient();
			 GetTemplate.get('./static/templates/home.mst', function (response) {
	            document.querySelector('#target').innerHTML = Mustache.render(response);
	        });
	    },
	    
	    'books': function() {

	    	  // Get local storage items

	    	  var data = JSON.parse(localStorage.getItem('data'));	    	 
	    	  var booksArray = [];
	    	  
	    	  // Loop through data and get information

	    	  for(var i=0; i < data.results.length; i++) {
			    	var books = {
			    	  	author: data.results[i].book_details[0].author,
			    	  	title: data.results[i].book_details[0].title,
			    	  	description: data.results[i].book_details[0].description,
			    	  	image: data.results[i].book_details[0].book_image
			    	};
                    booksArray.push(books);
              }

              // Get books template from templates folder

		      var GetTemplate = new HttpClient();
			  GetTemplate.get('./static/templates/books.mst', function (response) {			  
	            document.querySelector('#target').innerHTML = Mustache.render(response, {
	            	"books": booksArray
	            });
	          });
	    },
    	
    	'book/:id': function() {
    		
    	},

    	'': function() {
    		
    	},

    	'*': function() {
			alert("404 page not found.");
	    }

	});

})();