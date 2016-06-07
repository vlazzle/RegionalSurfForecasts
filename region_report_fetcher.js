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
                var conditions = resp.Analysis.generalCondition.slice(0, NUM_AVAILABLE_DAYS_OF_CONDITIONS);
                var alias = resp.Location.subregionalias;
                var url = resp._metadata.canonicalUrl;

                console.group(alias);
                console.log(resp);
                console.log(id);
                console.log(conditions);
                console.log(url);

                console.groupEnd(alias);
                
                var model = new RegionModel(id, conditions, alias, url);
                onSuccess(model);
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

// TODO: these shouldn't be side effects of loading this code
RegionReportFetcher.instances = [new RegionReportFetcher('2957'), new RegionReportFetcher('2950')];

RegionReportFetcher.instances.forEach(function(fetcher) {
    fetcher.fetch(function(conditions) {
        // TODO update model
        console.log(conditions);
    });
})