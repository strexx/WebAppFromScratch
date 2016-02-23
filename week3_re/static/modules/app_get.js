/******************
    GET data
*******************/

APP.get = (function () {

    var settings = {
        "apiKey": "9db42680b12e928d7f15d264928414ab:16:74324547",
        "url": "http://api.nytimes.com/svc/books/v2/lists/2010-10-01/trade-fiction-paperback.json?api-key=",
        "fullUrl": function() {
            return this.url + this.apiKey;
        }
    };

    function data() {
        // Check if localstorage is set
        if (localStorage.getItem('data') === null) {
            var nyClient = new HttpClient();

            // Get API data
            nyClient.get(settings.fullUrl())
                .then(response => {
                    localStorage.setItem('data', response);
                })
                .catch(e => {
                    console.error(e);
                });
        } else {
            localData();
        }
    };

    function localData() {
        return JSON.parse(localStorage.getItem('data'));
    };

    return {
        data: data,
        localData: localData
    };

})();