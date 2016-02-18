// Source https://stackoverflow.com/questions/247483/http-get-request-in-javascript

var HttpClient = function() { // this is a constructor

    this.get = function (url) {
        return new Promise((resolve, reject) => {
            
            var request = new XMLHttpRequest();
            
            // Open an get request
            request.open('GET', url);

            request.onloadstart = function () {            

                // Toggle animation
                document.querySelector('main').classList.remove('grow');

            };

            // If the request is done
            request.onload = function() {
                
                // Only if request is done
                if (request.status == 200) {
                    
                    document.querySelector('main').classList.add('grow');
                    
                    // Send text form request
                    resolve(request.responseText);
                } else {
                    // Reject the promise if there is a err
                    reject(new Error('Request failed!'));
                }
            };    

            // Send the request
            request.send();
        });
    }
}