/******************
 Render templates
*******************/

APP.render = (function () {
    var _main = document.querySelector('main');

    function home() {
        // Get localData &
        // Get home template from templates folder
        var data = APP.get.localData(),
            template = new HttpClient();

        template.get('./static/templates/home.mst')
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

        var data = APP.get.localData(),
            booksArray = [],
            template = new HttpClient();

        // Loop through data and get information

        data.results.forEach(function (book, index) {
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

        var data = APP.get.localData(),
            booksArray = [],
            template = new HttpClient();

        if (id) {
            template.get('./static/templates/book.mst')
                .then(response => {
                    _main.innerHTML = Mustache.render(response, {
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
            data.results.forEach(function (book, index) {
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
        var data = APP.get.localData(),
            template = new HttpClient(),
            bookNames = [];

        // Loop through data and get title information for autocomplete
        data.results.forEach(function (book, index) {
            var booksNamesObj = {
                id: index,
                title: book.book_details[0].title,
            };
            bookNames.push(book.book_details[0].title.toLowerCase());
        });

        // Check if there is a search query

        if (query) {
            var laBoek = _.find(data.results, function (result) {
                    return (result.book_details[0].title.toLowerCase() === query.toLowerCase());
                }),
                top5 = _.filter(data.results, function (result) {
                    return result.rank < 6;
                });

            // Check if its a detail page

            if (laBoek) {

                // Get search-detail template from templates folder

                template.get('./static/templates/search-detail.mst')
                    .then(response => {
                        _main.style.height = "100%";
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

                        document.querySelector('#search-box').addEventListener('keyup', function (e) {
                            // If ENTER is pressed
                            if (e.keyCode == 13) {
                                window.location.hash = '#search/' + document.querySelector('#search-box').value;
                            }
                        });

                        new Awesomplete(document.querySelector('#search-box'), {
                            list: bookNames
                        });
                    })
                    .catch(e => {
                        console.error(e);
                    });
            } else {

                // Get search template from templates folder

                template.get('./static/templates/search.mst')
                    .then(response => {
                        _main.style.height = "100%";
                        _main.innerHTML = Mustache.render(response);
                        document.querySelector('#error').style.display = "block";
                        document.querySelector('#search-box').addEventListener('keyup', function (e) {
                            // If ENTER is pressed
                            if (e.keyCode == 13) {
                                window.location.hash = '#search/' + document.querySelector('#search-box').value;
                            }
                        });

                        new Awesomplete(document.querySelector('#search-box'), {
                            list: bookNames
                        });
                    })
                    .catch(e => {
                        console.error(e);
                    });
            }

            // If no search query is posted, render default search template

        } else {
            template.get('./static/templates/search.mst')
                .then(response => {
                    _main.style.height = "100%";
                    _main.innerHTML = Mustache.render(response);
                    document.querySelector('#search-box').addEventListener('keyup', function (e) {

                        // If ENTER is pressed
                        if (e.keyCode == 13) {
                            window.location.hash = '#search/' + document.querySelector('#search-box').value;
                        }
                    });

                    new Awesomplete(document.querySelector('#search-box'), {
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
