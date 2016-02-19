/******************
    START APP
*******************/

APP.start = (function () {
    function init() {
        APP.router.init();
        APP.get.data();
    }

    return {
        init: init
    };
})();
