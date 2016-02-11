//Source https://stackoverflow.com/questions/247483/http-get-request-in-javascript
var HttpClient = function() { // this is a constructor
    this.get = function(url) {
        return new Promise((resolve, reject) => {
            var request = new XMLHttpRequest();
            //open an get request
            request.open('GET', url);
            //if the request is done
            request.onload = function() {
                //ony if request is done
                if (request.status == 200) {

                    // send text form request
                    resolve(request.responseText);
                } else {
                    // reject the promise if there is a err
                    reject(new Error('request failed!'));
                }
            };
            //send the request
            request.send();
        });
    }
}