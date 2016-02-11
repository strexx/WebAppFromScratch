(function() {
    "use strict";

    var config = {
        "apiKey": "9db42680b12e928d7f15d264928414ab:16:74324547",
        "url": "http://api.nytimes.com/svc/books/v2/lists/2010-10-01/trade-fiction-paperback.json?api-key=",
        "fullUrl": function() {
            return this.url + this.apiKey;
        }
    }

    var API = {

        init: function() {

            // Check if localstorage is set

            if (localStorage.getItem("data") === null) {
                API.getData();
            } else {
                
                // Get localstorage data

                var data = localStorage.getItem('data');
            }

            // Add active class to #home at first visit

            if (!window.location.hash) {
                document.querySelector("#home").classList.add("active");
            } else {
                API.toggleClass();
            }

            // If hash changes toggleClass

            window.onhashchange = API.toggleClass;
        },

        getData: function() {

            // Initialize new client (http-server required)

            var nyClient = new HttpClient();

            // Get API data

            nyClient.get(config.fullUrl(), function(response) {
                localStorage.setItem('data', response);
            });

            // Microlibrary MICROAJAX

            /*microAjax("http://api.nytimes.com/svc/books/v2/lists/2010-10-01/trade-fiction-paperback.json?api-key=9db42680b12e928d7f15d264928414ab:16:74324547", function (res) {
                var data = res;
                localStorage.setItem('data', data);
            });*/
        },

        toggleClass: function() {

            // Get all menu items

            var links = document.querySelectorAll('nav li'),
                hash = window.location.hash.substring(1).split("/"),
                link = document.querySelector("#" + hash[0]);

            // Remove active class

            for (var i = 0; i < links.length; i++) {
                links[i].classList.remove("active");
            }

            // Add active class to new hash

            link.classList.add("active");
        }
    };

    API.init();

})();