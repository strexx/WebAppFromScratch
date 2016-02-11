(function () {
    "use strict";

    routie({

        'home': function () {

            // Get home template from templates folder
            var GetTemplate = new HttpClient();
            GetTemplate.get('./static/templates/home.mst', function (response) {
                document.querySelector('main').innerHTML = Mustache.render(response);
            });
        },

        'books': function () {

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


            GetTemplate.get('./static/templates/books.mst', function (response) {
                document.querySelector('main').innerHTML = Mustache.render(response, {
                    "books": booksArray
                });
            });
        },

        'books/:id': function (id) {

            // Get local storage items
            var data = JSON.parse(localStorage.getItem('data')),
                GetTemplate = new HttpClient();

            GetTemplate.get('./static/templates/book.mst', function (response) {
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
            });
        },

        'search': function () {

            // Get books template from templates folder
            var data = JSON.parse(localStorage.getItem('data')),
                GetTemplate = new HttpClient();

            GetTemplate.get('./static/templates/search.mst', function (response) {
                document.querySelector('main').innerHTML = Mustache.render(response);
                document.querySelector('#search-box').addEventListener('keyup', function (e) {
                    if (e.keyCode == 13) {
                        //window.location.assign(router.baseUrl + '#search/' + document.querySelector('#search-box').value);
                        window.location.hash = '#search/' + document.querySelector('#search-box').value;
                    }
                });
            });
        },

        'search/:query': function (query) {

            // Get local storage items
            var data = JSON.parse(localStorage.getItem('data')),
                GetTemplate = new HttpClient(),
                laBoek = _.find(data.results, function (result) {
                    return (result.book_details[0].title.toLowerCase() === query.toLowerCase());
                });

            if (laBoek) {

                // Get books template from templates folder
                GetTemplate.get('./static/templates/search-detail.mst', function (response) {
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
                    document.querySelector('#search-box').addEventListener('keyup', function (e) {
                        if (e.keyCode == 13) {
                            window.location.hash = '#search/' + document.querySelector('#search-box').value;
                        }
                    });
                });
            } else {
                GetTemplate.get('./static/templates/search.mst', function (response) {
                    document.querySelector('main').innerHTML = Mustache.render(response);
                    document.querySelector('#error').style.display = "block";
                    document.querySelector('#search-box').addEventListener('keyup', function (e) {
                        if (e.keyCode == 13) {
                            window.location.hash = '#search/' + document.querySelector('#search-box').value;
                        }
                    });
                });
            }

        },

        '': function () {

            // Get home template from templates folder
            var GetTemplate = new HttpClient();

            GetTemplate.get('./static/templates/home.mst', function (response) {
                document.querySelector('main').innerHTML = Mustache.render(response);
            });
        },

        '*': function () {
            alert("404 page not found.");
        }

    });

})();
