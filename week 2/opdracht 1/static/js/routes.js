(function() {
    "use strict";

    routie({

        'home': function() {

            // Get home template from templates folder

            var GetTemplate = new HttpClient();

            GetTemplate.get('./static/templates/home.mst')
                .then(response => {
                    document.querySelector('main').innerHTML = Mustache.render(response);
                }).catch(e => {
                    console.error(e);
                });
        },

        'books': function() {

            // Get local storage items

            var data = JSON.parse(localStorage.getItem('data')),
                booksArray = [],
                GetTemplate = new HttpClient();

            // Loop through data and get information

            for (var i = 0; i < data.results.length; i++) {
                var books = {
                    id: i,
                    author: data.results[i].book_details[0].author,
                    title: data.results[i].book_details[0].title,
                    description: data.results[i].book_details[0].description,
                    image: data.results[i].book_details[0].book_image,
                    price: data.results[i].book_details[0].price,
                };
                booksArray.push(books);
            }

            // Get books template from templates folder

            GetTemplate.get('./static/templates/books.mst')
                .then(response => {
                    document.querySelector('main').innerHTML = Mustache.render(response, {
                        "books": booksArray
                    });
                }).catch(e => {
                    console.error(e);
                });
        },

        'books/:id': function(id) {

            // Get local storage items

            var data = JSON.parse(localStorage.getItem('data')),
                GetTemplate = new HttpClient();

            GetTemplate.get('./static/templates/book.mst')
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
                }).catch(e => {
                    console.error(e);
                });
        },

        'search': function() {

            // Get books template from templates folder

            var data = JSON.parse(localStorage.getItem('data')),
                GetTemplate = new HttpClient();

            GetTemplate.get('./static/templates/search.mst')
                .then(response => {
                    document.querySelector('main').innerHTML = Mustache.render(response);
                    document.querySelector('#search-box').addEventListener('keyup', function(e) {
                        if (e.keyCode == 13) {
                            //window.location.assign(router.baseUrl + '#search/' + document.querySelector('#search-box').value);
                            window.location.hash = '#search/' + document.querySelector('#search-box').value;
                        }
                    });
                }).catch(e => {
                    console.error(e);
                });
        },

        'search/:query': function(query) {

            // Get local storage items

            var data = JSON.parse(localStorage.getItem('data')),
                GetTemplate = new HttpClient(),
                laBoek = _.find(data.results, function(result) {
                    return (result.book_details[0].title.toLowerCase() === query.toLowerCase());
                }),
                top5 = _.filter(data.results, function(result) {
                    return result.rank < 6;
                });

            // Top 5 boeken op basis van ranking
            console.log(top5);

            if (laBoek) {

                // Get search-detail template from templates folder

                GetTemplate.get('./static/templates/search-detail.mst')
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
                    }).catch(e => {
                        console.error(e);
                    });
            } else {

                // Get search template from templates folder

                GetTemplate.get('./static/templates/search.mst')
                    .then(response => {
                        document.querySelector('main').innerHTML = Mustache.render(response);
                        document.querySelector('#error').style.display = "block";
                        document.querySelector('#search-box').addEventListener('keyup', function(e) {
                            if (e.keyCode == 13) {
                                window.location.hash = '#search/' + document.querySelector('#search-box').value;
                            }
                        });
                    }).catch(e => {
                        console.error(e);
                    });
            }

        },

        '': function() {

            // Get home template from templates folder

            var GetTemplate = new HttpClient();

            GetTemplate.get('./static/templates/home.mst')
                .then(response => {
                    document.querySelector('main').innerHTML = Mustache.render(response);
                }).catch(e => {
                    console.error(e);
                });
        },

        '*': function() {
            alert("404 page not found.");
        }

    });

})();