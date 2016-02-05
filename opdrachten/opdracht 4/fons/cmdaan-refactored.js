(function() {

  'use strict';

    // Require eventTarget lib
    var eventTarget = require('./lib/eventTarget.js');
    var et = new EventTarget();

    var currentPosition = currentPositionMarker = customDebugging = debugId = map = interval = intervalCounter = updateMap = false;
    var locatieRij = markerRij = [];

    var init = function() {

        map: function() {
            var config = {
                constants: {
                    SANDBOX = "SANDBOX",
                    GPS_AVAILABLE = 'GPS_AVAILABLE',
                    GPS_UNAVAILABLE = 'GPS_UNAVAILABLE',
                    POSITION_UPDATED = 'POSITION_UPDATED',
                    REFRESH_RATE = 1000
                }

                // Uitbreidmogelijkheden...
            }
        },

        // Start interval en update positie

        startInterval: function() {
            debugMessage("GPS is beschikbaar, vraag positie.");
            updatePosition();
            interval = self.setInterval(updatePosition, REFRESH_RATE);
            et.addListener(POSITION_UPDATED, checkLocations);
        },

        // Check huidige positie

        updatePosition: function() {
            intervalCounter++;
            geo_position_js.getCurrentPosition(setPosition, geoErrorHandler, {
                enableHighAccuracy: true
            });
        },

        // Stel huidige positie in

        setPosition: function() {
            currentPosition = position;
            et.fire("POSITION_UPDATED");
            debugMessage(intervalCounter + " positie lat:" + position.coords.latitude + " long:" + position.coords.longitude);
        },

        // Check de locatie en navigeer naar een pagina in een bepaalde area

        checkLocations: function() {
            
            // Liefst buiten google maps om... maar helaas, ze hebben alle coole functies
            for (var i = 0; i < locaties.length; i++) {
                var locatie = {
                    coords: {
                        latitude: locaties[i][3],
                        longitude: locaties[i][4]
                    }
                };

                if (calculateDistance(locatie, currentPosition) < locaties[i][2]) {

                    // Controle of we NU op die locatie zijn, zo niet gaan we naar de betreffende page
                    if (window.location != locaties[i][1] && localStorage[locaties[i][0]] == "false") {
                        // Probeer local storage, als die bestaat incrementeer de locatie
                        try {
                            (localStorage[locaties[i][0]] == "false") ? localStorage[locaties[i][0]] = 1: localStorage[locaties[i][0]]++;
                        } catch (error) {
                            debugMessage("Localstorage kan niet aangesproken worden: " + error);
                        }

                        // TODO: Animeer de betreffende marker
                        window.location = locaties[i][1];
                        debugMessage("Speler is binnen een straal van " + locaties[i][2] + " meter van " + locaties[i][0]);
                    }
                }
            }
        },

        // Bereken de afstand tussen twee coordinaten

        calculateDistance: function(p1, p2) {
            var pos1 = new google.maps.LatLng(p1.coords.latitude, p1.coords.longitude);
            var pos2 = new google.maps.LatLng(p2.coords.latitude, p2.coords.longitude);
            return Math.round(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2), 0);
        },

        // Genereer google maps kaart

        generateMap: function() {
            // TODO: Kan ik hier asynchroon nog de google maps api aanroepen? dit scheelt calls
            debugMessage("Genereer een Google Maps kaart en toon deze in #" + canvasId)
            map = new google.maps.Map(document.getElementById(canvasId), myOptions);

            var routeList = [];
            // Voeg de markers toe aan de map afhankelijk van het tourtype
            debugMessage("Locaties intekenen, tourtype is: " + tourType);
            for (var i = 0; i < locaties.length; i++) {

                // Met kudos aan Tomas Harkema, probeer local storage, als het bestaat, voeg de locaties toe
                try {
                    (localStorage.visited == undefined || isNumber(localStorage.visited)) ? localStorage[locaties[i][0]] = false: null;
                } catch (error) {
                    debugMessage("Localstorage kan niet aangesproken worden: " + error);
                }

                var markerLatLng = new google.maps.LatLng(locaties[i][3], locaties[i][4]);
                routeList.push(markerLatLng);

                markerRij[i] = {};
                for (var attr in locatieMarker) {
                    markerRij[i][attr] = locatieMarker[attr];
                }
                markerRij[i].scale = locaties[i][2] / 3;

                var marker = new google.maps.Marker({
                    position: markerLatLng,
                    map: map,
                    icon: markerRij[i],
                    title: locaties[i][0]
                });
            }
            // TODO: Kleur aanpassen op het huidige punt van de tour
            if (tourType == LINEAIR) {
                // Trek lijnen tussen de punten
                debugMessage("Route intekenen");
                var route = new google.maps.Polyline({
                    clickable: false,
                    map: map,
                    path: routeList,
                    strokeColor: 'Black',
                    strokeOpacity: .6,
                    strokeWeight: 3
                });

            }

            // Voeg de locatie van de persoon door
            currentPositionMarker = new google.maps.Marker({
                position: kaartOpties.center,
                map: map,
                icon: positieMarker,
                title: 'U bevindt zich hier'
            });

            // Zorg dat de kaart geupdated wordt als het POSITION_UPDATED event afgevuurd wordt
            et.addListener(POSITION_UPDATED, updatePositie);

        },

        // Check of het datatype een nummer is

        isNumber: function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

        // Update nieuwe positie van de gebruiker

        updatePositie: function(event) {
            var newPos = new google.maps.LatLng(currentPosition.coords.latitude, currentPosition.coords.longitude);
            map.setCenter(newPos);
            currentPositionMarker.setPosition(newPos);
        },

        geoErrorHandler: function(code, message) {
            debugMessage('geo.js error ' + code + ': ' + message);
        },

        debugMessage: function(message) {
            (customDebugging && debugId) ? document.getElementById(debugId).innerHTML: console.log(message);
        },

        setCustomDebugging: function(debugId) {
            debugId = this.debugId;
            customDebugging = true;
        },

        debugMessage("Controleer of GPS beschikbaar is...");

        // Init als GPS beschikbaar is, begin met startInterval functie

        et.addListener(GPS_AVAILABLE, startInvterval);
        et.addListener(GPS_UNAVAILABLE, function() {
            debugMessage('GPS is niet beschikbaar.')
        });

        (geo_position_js.init()) ? et.fire(GPS_AVAILABLE): et.fire(GPS_UNAVAILABLE);
    }
})();