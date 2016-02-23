/******************
 Render templates
*******************/

APP.render = (function () {

    // Private vars

    var _main = document.querySelector('main'),
        _template = new HttpClient(),
        _data = APP.get.localData();

    function home() {
        
        // Get home template from templates folder

        _template.get('./static/templates/home.mst')
            .then(response => {
                _main.innerHTML = Mustache.render(response);
            })
            .catch(e => {
                console.error(e);
            });
    };

    function pullrefresh() {

        // Get localData &
        // Get pull refresh template from templates folder

        var booksArray = [];

        // Loop through data and get information

        _data.results.forEach(function (book, index) {
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

        _template.get('./static/templates/pullrefresh.mst')
            .then(response => {
                _main.style.overflow = "hidden";
                _main.innerHTML = Mustache.render(response);

                // Pull to refresh function

                WebPullToRefresh.init({
                    loadingFunction: function () {
                        return new Promise(function (resolve, reject) {
                            // Run some async loading code here
                            if (1 === 1) {

                                var request = new XMLHttpRequest();

                                // Open an get request
                                request.open('GET', './static/templates/books.mst');

                                // If the request is done
                                request.onload = function () {

                                    // Only if request is done
                                    if (request.status == 200) {
                                        setTimeout(function () {
                                            document.querySelector('#content').innerHTML = Mustache.render(request.response, {
                                                "books": booksArray
                                            })
                                        }, 800);
                                    }
                                    resolve();
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
    };

    function books(id) {

        // Get localData &

        var booksArray = [];

        if (id) {
            _template.get('./static/templates/book.mst')
                .then(response => {
                    _main.innerHTML = Mustache.render(response, {
                        "book": {
                            author: _data.results[id].book_details[0].author,
                            title: _data.results[id].book_details[0].title,
                            description: _data.results[id].book_details[0].description,
                            image: _data.results[id].book_details[0].book_image,
                            price: _data.results[id].book_details[0].price,
                            publisher: _data.results[id].book_details[0].publisher,
                            link: _data.results[id].book_details[0].amazon_product_url
                        }
                    });
                })
                .catch(e => {
                    console.error(e);
                });
        } else {

            // Loop through data and get information
            _data.results.forEach(function (book, index) {
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
            _template.get('./static/templates/books.mst')
                .then(response => {
                    _main.innerHTML = Mustache.render(response, {
                        "books": booksArray
                    });
                })
                .catch(e => {
                    console.error(e);
                });
        }

    };

    function search(query) {

        // Get local storage items
        var bookNames = [];

        // Loop through data and get title information for autocomplete
        _data.results.forEach(function (book, index) {
            var booksNamesObj = {
                id: index,
                title: book.book_details[0].title,
            };
            bookNames.push(book.book_details[0].title.toLowerCase());
        });

        // Check if there is a search query

        if (query) {
            var laBoek = _.find(_data.results, function (result) {
                    return (result.book_details[0].title.toLowerCase() === query.toLowerCase());
                }),
                top5 = _.filter(_data.results, function (result) {
                    return result.rank < 6;
                });

            // Check if its a detail page

            if (laBoek) {

                // Get search-detail template from templates folder

                _template.get('./static/templates/search-detail.mst')
                    .then(response => {
                        _main.classList.add("fullheight");
                        _main.innerHTML = Mustache.render(response, {
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

                        var searchBox = document.querySelector('#search-box');

                        searchBox.addEventListener('keyup', function (e) {
                            // If ENTER is pressed
                            if (e.keyCode == 13) {
                                window.location.hash = '#search/' + searchBox.value;
                            }
                        });

                        new Awesomplete(searchBox, {
                            list: bookNames
                        });
                    })
                    .catch(e => {
                        console.error(e);
                    });
            } else {

                // Get search template from templates folder

                _template.get('./static/templates/search.mst')
                    .then(response => {
                        _main.classList.add("fullheight");
                        _main.innerHTML = Mustache.render(response);
                        
                        var errorMsg = document.querySelector('#error'),
                            searchBox = document.querySelector('#search-box');

                        errorMsg.classList.add("is-visible");
                        searchBox.addEventListener('keyup', function (e) {
                            // If ENTER is pressed
                            if (e.keyCode == 13) {
                                window.location.hash = '#search/' + searchBox.value;
                            }
                        });

                        new Awesomplete(searchBox, {
                            list: bookNames
                        });
                    })
                    .catch(e => {
                        console.error(e);
                    });
            }

            // If no search query is posted, render default search template

        } else {
            _template.get('./static/templates/search.mst')
                .then(response => {
                    _main.classList.add("fullheight");
                    _main.innerHTML = Mustache.render(response);
                    var searchBox = document.querySelector('#search-box');
                    searchBox.addEventListener('keyup', function (e) {

                        // If ENTER is pressed
                        if (e.keyCode == 13) {
                            window.location.hash = '#search/' + searchBox.value;
                        }
                    });

                    new Awesomplete(searchBox, {
                        list: bookNames
                    });

                })
                .catch(e => {
                    console.error(e);
                });
        }
    };

    return {
        home: home,
        pullrefresh: pullrefresh,
        books: books,
        search: search
    };

})();