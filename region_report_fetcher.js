var NUM_AVAILABLE_DAYS_OF_CONDITIONS = 7;

var RegionReportFetcher = function(regionId) {
    this._url = 'http://api.surfline.com/v1/forecasts/' + regionId + '?&resources=resources%3Dwind%2Csurf%2Canalysis%2Cweather%2Ctide%2Csort&days=17&aggregate=true&units=e';
};

RegionReportFetcher.prototype.fetch = function(onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function(ev) {
        var req = ev.target;
        if (req.status < 400) {
            // TODO instead of parsing the entire response, use https://github.com/dscape/clarinet
            var resp = req.response;

            if ('Analysis' in resp && 'generalCondition' in resp.Analysis) {
                var id = resp.id;
                var name = resp.name;
                var conditions = resp.Analysis.generalCondition.slice(0, NUM_AVAILABLE_DAYS_OF_CONDITIONS);
                var url = resp._metadata.canonicalUrl;

                console.group(name);
                console.log(resp);
                console.log(id);
                console.log(conditions);
                console.log(url);

                console.groupEnd(name);
                
                try {
                    var model = new RegionModel(id, name, conditions, url);
                    onSuccess(model);
                } catch (e) {
                    onError(e);
                }
            } else {
                var error = 'error: unexpected structure in response JSON';
                console.error(error);
                onError(error);
            }
        } else {
            // TODO handle recoverable errors with retry & exponential backoff
            var error = 'error (' + req.status + ') : ' + req.statusText + ' @ ' + req.responseURL;
            console.error(error);
            onError(error);
        }
    };
    xhr.open('GET', this._url);
    xhr.send(null);
};