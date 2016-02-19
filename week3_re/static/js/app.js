/*************************************
	APP NAMESPACE
	Author: Fons Hettema
**************************************/

var APP = APP || {};

(function() {
    "use strict";

    /******************
		 START APP
	*******************/

    APP.start = {
    	init: function() {
    		APP.router.init();
    		APP.get.data();
    	}
    }

    /******************
		 ROUTER
	*******************/

    APP.router = {

        init: function() {

    		routie({
		        'home': function() {
		        	APP.render.home();
		        },
		        'pullrefresh': function() {
		        	APP.render.pullrefresh();
		        },
		        'books': function() {
		        	APP.render.books();
		        },
		        'books/:id': function(id) {
		        	APP.render.books(id);
		        },
		        'search': function() {
		        	APP.render.search();
		        },
		        'search/:query': function(query) {
		        	APP.render.search(query);
		        },
		        '': function() {
		        	APP.render.home();
		        },
		        '*': function() {
            		alert("404 page not found.");
        		}
		    });

        	// Add active class to #home at first visit

            if (!window.location.hash) {
                document.querySelector('#home').classList.add('active');
            } else {
                this.toggleMenu();
            }

            // If hash changes toggleClass

            window.onhashchange = this.toggleMenu;
        },

        toggleMenu: function() {

            // Get all menu items

            var links = Array.prototype.slice.call(document.querySelectorAll('nav li')),
                hash = window.location.hash.substring(1).split('/'),
                link = document.querySelector('#' + hash[0]),
                main = document.querySelector('main');

            // Remove active class

            links.forEach(function(item) {
                item.classList.remove("active");
            });

            // Add active class to new hash

            link.classList.add('active');

            // Main animation

            main.classList.add('grow');
        }
    }

    /******************
		 GET data
	*******************/

    APP.get = {

    	settings: {
            "apiKey": "9db42680b12e928d7f15d264928414ab:16:74324547",
            "url": "http://api.nytimes.com/svc/books/v2/lists/2010-10-01/trade-fiction-paperback.json?api-key=",
            "fullUrl": function() {
                return this.url + this.apiKey;
            }   
        },

    	data: function() {

    		// Store settings
    		var s = this.settings;	

    		// Check if localstorage is set

            if (localStorage.getItem('data') === null) {

                var nyClient = new HttpClient();

	            // Get API data
	            
	            nyClient.get(s.fullUrl())
		            .then(response => {
		                localStorage.setItem('data', response);
		            })
		            .catch(e => {
		                console.error(e);
		            });
            } else {
            	this.localStorage();
            }
    	},

    	localStorage: function() {
    		return JSON.parse(localStorage.getItem('data'));
    	}

    }

    /******************
	 Render templates
	*******************/

    APP.render = {

    	home: function() {

    		// Get localstorage &
    		// Get home template from templates folder

    		var data = APP.get.localStorage(),
            	template = new HttpClient();

            template.get('./static/templates/home.mst')
                .then(response => {            
                    document.querySelector('main').innerHTML = Mustache.render(response);
                })
                .catch(e => {
                    console.error(e);
                });
    	},

    	'pullrefresh': function() {

    		// Get localstorage &
    		// Get pull refresh template from templates folder

    		var data = APP.get.localStorage(),
                booksArray = [],
                template = new HttpClient();

    		// Loop through data and get information

            data.results.forEach(function(book, index) {
                var books = {
                    id: Math.floor(Math.random() * 10) + 1,
                    author: book.book_details[0].author,
                    title: book.book_details[0].title,
                    description: book.book_details[0].description,
                    image: book.book_details[0].book_image,
                    price: book.book_details[0].price,
                };
                booksArray.push(books);
            });

            // Get pull refresh template from templates folder

            template.get('./static/templates/pullrefresh.mst')
                .then(response => {        
                    document.querySelector('main').innerHTML = Mustache.render(response);
                    
                    // Pull to refresh function                                        

                    WebPullToRefresh.init({
                        loadingFunction: function() {
                            return new Promise(function(resolve, reject) {
                                // Run some async loading code here                                
                                if(1 === 1) {
                                    
                                    var request = new XMLHttpRequest();
            
                                    // Open an get request
                                    request.open('GET', './static/templates/books.mst');

                                    // If the request is done
                                    request.onload = function() {
                                        
                                        // Only if request is done
                                        if (request.status == 200) {
                                            document.querySelector('#content').innerHTML = Mustache.render(request.response, {
                                                "books": booksArray
                                            });
                                        }                                        
                                    };
                                    
                                    // Send the request
                                    request.send();
                                } else {
                                  reject();
                                }
                            });
                        }
                    });
                })
                .catch(e => {
                    console.error(e);
                });
    	},

    	'books': function(id) {

    		// Get localstorage &

    		var data = APP.get.localStorage(),
    			booksArray = [],
            	template = new HttpClient();


            if(id) {
            	template.get('./static/templates/book.mst')
                .then(response => {
                    document.querySelector('main').innerHTML = Mustache.render(response, {
                        "book": {
                            author: data.results[id].book_details[0].author,
                            title: data.results[id].book_details[0].title,
                            description: data.results[id].book_details[0].description,
                            image: data.results[id].book_details[0].book_image,
                            price: data.results[id].book_details[0].price,
                            publisher: data.results[id].book_details[0].publisher,
                            link: data.results[id].book_details[0].amazon_product_url
                        }
                    });
                })
                .catch(e => {
                    console.error(e);
                });
            } else {

	            // Loop through data and get information

	            data.results.forEach(function(book, index) {
	                var books = {
	                    id: index,
	                    author: book.book_details[0].author,
	                    title: book.book_details[0].title,
	                    description: book.book_details[0].description,
	                    image: book.book_details[0].book_image,
	                    price: book.book_details[0].price,
	                };
	                booksArray.push(books);
	            });

	            // Get books template from templates folder

	            template.get('./static/templates/books.mst')
	                .then(response => {
	                    document.querySelector('main').innerHTML = Mustache.render(response, {
	                        "books": booksArray
	                    });
	                })
	                .catch(e => {
	                    console.error(e);
	                });
	        }

    	},

        'search': function(query) {

            // Get local storage items

            var data = APP.get.localStorage(),
            	template = new HttpClient();

            if(query) {

            	var laBoek = _.find(data.results, function(result) {
                    return (result.book_details[0].title.toLowerCase() === query.toLowerCase());
                }),
                top5 = _.filter(data.results, function(result) {
                    return result.rank < 6;
                });

                if (laBoek) {

	                // Get search-detail template from templates folder

	                template.get('./static/templates/search-detail.mst')
	                    .then(response => {
	                        document.querySelector('main').innerHTML = Mustache.render(response, {
	                            "book": {
	                                author: laBoek.book_details[0].author,
	                                title: laBoek.book_details[0].title,
	                                description: laBoek.book_details[0].description,
	                                image: laBoek.book_details[0].book_image,
	                                price: laBoek.book_details[0].price,
	                                publisher: laBoek.book_details[0].publisher,
	                                link: laBoek.book_details[0].amazon_product_url
	                            }
	                        });
	                        document.querySelector('#search-box').addEventListener('keyup', function(e) {
	                            if (e.keyCode == 13) {
	                                window.location.hash = '#search/' + document.querySelector('#search-box').value;
	                            }
	                        });
	                    })
	                    .catch(e => {
	                        console.error(e);
	                    });
            	} else {

	                // Get search template from templates folder

	                template.get('./static/templates/search.mst')
	                    .then(response => {
	                        document.querySelector('main').innerHTML = Mustache.render(response);
	                        document.querySelector('#error').style.display = "block";
	                        document.querySelector('#search-box').addEventListener('keyup', function(e) {
	                            if (e.keyCode == 13) {
	                                window.location.hash = '#search/' + document.querySelector('#search-box').value;
	                            }
	                        });
	                    })
	                    .catch(e => {
	                        console.error(e);
	                    });
            	}
            } else {
            	template.get('./static/templates/search.mst')
                .then(response => {
                    document.querySelector('main').innerHTML = Mustache.render(response);
                    document.querySelector('#search-box').addEventListener('keyup', function(e) {
                        if (e.keyCode == 13) {
                            window.location.hash = '#search/' + document.querySelector('#search-box').value;
                        }
                    });
                })
                .catch(e => {
                    console.error(e);
                });
            }
        }
    }

    /******************
		 ON LOAD
	*******************/

    document.addEventListener("DOMContentLoaded", function () { // Not supported by IE8, but screw IE8 anyways ;)
        APP.start.init(); // Initiate the launch of the app! **WOOOSHHH** (sound of the app getting launched)...
    });

})();