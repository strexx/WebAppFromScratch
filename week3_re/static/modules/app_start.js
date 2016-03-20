/*************************************
	APP NAMESPACE
	Author: Fons Hettema
**************************************/

var APP = APP || {};

'use strict';

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
