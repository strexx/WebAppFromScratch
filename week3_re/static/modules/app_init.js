/******************
    START APP
*******************/

APP.start = (function () {
    return {
        init: function () {
            APP.router.init();
            APP.get.data();
        }
    };
})();