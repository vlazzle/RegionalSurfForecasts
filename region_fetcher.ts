class RegionFetcher {
    static NUM_AVAILABLE_DAYS_OF_CONDITIONS = 7;
    private _url: string;

    static onload(onSuccess, onError, json) {
        // TODO instead of parsing the entire response, use https://github.com/dscape/clarinet
        var resp = json;

        if ('Analysis' in resp && 'generalCondition' in resp.Analysis) {
            var id = resp.id;
            var name = resp.name;
            var conditions = resp.Analysis.generalCondition.slice(0, RegionFetcher.NUM_AVAILABLE_DAYS_OF_CONDITIONS);
            var surfMin = resp.Analysis.surfMin.slice(0, RegionFetcher.NUM_AVAILABLE_DAYS_OF_CONDITIONS);
            var surfMax = resp.Analysis.surfMax.slice(0, RegionFetcher.NUM_AVAILABLE_DAYS_OF_CONDITIONS);
            var surfPeak = resp.Analysis.surfPeak.slice(0, RegionFetcher.NUM_AVAILABLE_DAYS_OF_CONDITIONS);
            var canExceed = resp.Analysis.canExceed.slice(0, RegionFetcher.NUM_AVAILABLE_DAYS_OF_CONDITIONS);
            var url = resp._metadata.canonicalUrl;
            var startDate = resp.Analysis.startDate_pretty_LOCAL;

            console.group(name);
            console.log(resp);
            console.log(id);
            console.log(conditions);
            console.log(url);
            console.log(startDate);

            console.groupEnd();

            try {
                var model = new RegionModel(id, name, conditions, surfMin, surfMax, surfPeak, canExceed, url, startDate);
                onSuccess(model);
            } catch (e) {
                onError(e);
            }
        } else {
            var error = 'error: unexpected structure in response JSON';
            console.error(error);
            onError(error);
        }
    }

    constructor(regionId) {
        this._url = '//api.surfline.com/v1/forecasts/' + regionId + '?&resources=resources%3Dwind%2Csurf%2Canalysis%2Cweather%2Ctide%2Csort&days=17&aggregate=true&units=e';
    }

    fetch(onSuccess, onError) {
        window['RegionFetcherOnloadJsonP'] = RegionFetcher.onload.bind(this, onSuccess, onError);
        Loader.getInstance().importScript(this._url + '&callback=RegionFetcherOnloadJsonP', null, onError);
    }
}
