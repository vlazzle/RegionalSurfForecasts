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
            
            console.group(resp.Location.subregionalias);
            console.log(resp);

            if ('Analysis' in resp && 'generalCondition' in resp.Analysis) {
                var conditions = resp.Analysis.generalCondition.slice(0, NUM_AVAILABLE_DAYS_OF_CONDITIONS);
                
                console.log(resp._metadata.canonicalUrl);

                console.groupEnd(resp.Location.subregionalias);
                
                onSuccess(conditions);
            } else {
                console.error('error: unexpected structure in response JSON');
                onError();
            }
        } else {
            console.error('error (' + req.status + ') : ' + req.statusText + ' @ ' + req.responseURL);
            onError();
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