/******************
    ROUTER
*******************/

APP.router = (function () {

    function init() {
        routie({
            'home': function () {
                APP.render.home();
            },
            'pullrefresh': function () {
                APP.render.pullrefresh();
            },
            'books': function () {
                APP.render.books();
            },
            'books/:id': function (id) {
                APP.render.books(id);
            },
            'search': function () {
                APP.render.search();
            },
            'search/:query': function (query) {
                APP.render.search(query);
            },
            '': function () {
                APP.render.home();
            },
            '*': function () {
                alert("404 page not found.");
            }
        });

        // Add active class to #home at first visit

        if (!window.location.hash) {
            document.querySelector('#home').classList.add('active');
        } else {
            toggleMenu();
        }

        // If hash changes toggleMenu
        window.addEventListener("hashchange", toggleMenu, false);
    };

    function toggleMenu() {

        // Get all menu items
        var links = Array.prototype.slice.call(document.querySelectorAll('nav li')),
            hash = window.location.hash.split('/'),
            link = document.querySelector(hash[0]),
            main = document.querySelector('main');

        // Remove active class
        links.forEach(function (item) {
            item.classList.remove("active");
        });

        // Add active class to new hash
        link.classList.add('active');

        // Main animation
        main.classList.add('grow');
    };

    return {
        init: init,
        toggleMenu: toggleMenu
    };

})();