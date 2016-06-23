const IS_PRODUCTION  = false;
var REACT_JS;
var REACT_DOM_JS;
if (IS_PRODUCTION) {
    REACT_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.min.js';
    REACT_DOM_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.min.js';
} else {
    REACT_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js';
    REACT_DOM_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.js';
}

class Loader {
    static _instance: Loader;

    static getInstance() {
        if (!Loader._instance) {
            Loader._instance = new Loader(function() {
                App.getInstance().onEverythingLoaded();
            });
        }
        return Loader._instance;
    }

    // TODO annotate as 3-ary function
    public importScript;

    // TODO annotate as nullary function.
    private _onEverythingLoaded;

    private _isDomLoaded: boolean;
    private _isReactJsLoaded: boolean;
    private _isAppJsLoaded: boolean;
    private _isRegionFetcherJsLoaded: boolean;
    private _isRegionModelJsLoaded: boolean;
    private _regionSelectionJsLoaded: boolean;

    constructor(onEverythingLoadedFn) {
        this._onEverythingLoaded = onEverythingLoadedFn;

        this.importScript = (function (oHead) {
            function loadError (fOnError, oError) {
                var errorMsg = 'Error loading ' + oError.target.src;
                if (fOnError) {
                    fOnError(errorMsg);
                } else {
                    throw errorMsg;
                }
            }

            return function (sSrc, fOnload, fOnError) {
                var oScript = document.createElement('script');
                oScript.onerror = loadError.bind(null, fOnError);
                if (fOnload) { oScript.onload = fOnload; }
                oHead.appendChild(oScript);
                oScript.src = sSrc;
            }

        })(document.head || document.getElementsByTagName('head')[0]);
    }

    _isEverythingLoaded() {
        return this._isDomLoaded && this._isReactJsLoaded && this._isAppJsLoaded && this._isRegionFetcherJsLoaded && this._isRegionModelJsLoaded && this._regionSelectionJsLoaded;
    }

    _checkEverythingLoaded() {
        if (this._isEverythingLoaded()) {
            this._onEverythingLoaded();
        }
    }

    _checkAppAndReactLoaded() {
        if (this._isAppJsLoaded && this._isReactJsLoaded) {
            App.getInstance().onReactJsLoaded();
        }
    }

    onDomLoadeded() {
        this._isDomLoaded = true;
        this._checkEverythingLoaded();
    }

    onReactJsLoaded() {
        this._isReactJsLoaded = true;
        this._checkAppAndReactLoaded();
        this._checkEverythingLoaded();
    }

    onAppJsLoadeded() {
        this._isAppJsLoaded = true;
        this._checkAppAndReactLoaded();
        this._checkEverythingLoaded();
    }

    onRegionFetcherJsLoaded() {
        this._isRegionFetcherJsLoaded = true;
        this._checkEverythingLoaded();
    }

    onRegionModelJsLoaded() {
        this._isRegionModelJsLoaded = true;
        this._checkEverythingLoaded();
    }

    onRegionSelectionJsLoaded() {
        this._regionSelectionJsLoaded = true;
        this._checkEverythingLoaded();
    }
}

let loader = Loader.getInstance();

document.addEventListener('DOMContentLoaded', loader.onDomLoadeded.bind(loader));

loader.importScript(REACT_JS, loader.importScript.bind(loader, REACT_DOM_JS, loader.onReactJsLoaded.bind(loader)));
loader.importScript('app.js', loader.onAppJsLoadeded.bind(loader));
loader.importScript('region_fetcher.js', loader.onRegionFetcherJsLoaded.bind(loader));
loader.importScript('region_model.js', loader.onRegionModelJsLoaded.bind(loader));
loader.importScript('region_selection.js', loader.onRegionSelectionJsLoaded.bind(loader));