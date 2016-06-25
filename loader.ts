const IS_PRODUCTION  = false;
var REACT_JS: string;
var REACT_DOM_JS: string;
if (IS_PRODUCTION) {
    REACT_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.min.js';
    REACT_DOM_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.min.js';
} else {
    REACT_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js';
    REACT_DOM_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.js';
}

class Loader {
    static _instance: Loader;

    static getInstance(): Loader {
        if (!Loader._instance) {
            Loader._instance = new Loader(function() {
                App.getInstance().onEverythingLoaded();
            });
        }
        return Loader._instance;
    }

    importScript: (sSrc:string, fOnload?:()=>void, fOnError?:(errorMsg:string)=>void)=>void;

    private _onEverythingLoaded: ()=>void;

    private _isDomLoaded: boolean;
    private _isReactJsLoaded: boolean;
    private _isAppJsLoaded: boolean;
    private _isRegionFetcherJsLoaded: boolean;
    private _isRegionModelJsLoaded: boolean;
    private _regionSelectionJsLoaded: boolean;

    constructor(onEverythingLoadedFn: ()=>void) {
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

    private _isEverythingLoaded(): boolean {
        return this._isDomLoaded && this._isReactJsLoaded && this._isAppJsLoaded && this._isRegionFetcherJsLoaded && this._isRegionModelJsLoaded && this._regionSelectionJsLoaded;
    }

    private _checkEverythingLoaded(): void {
        if (this._isEverythingLoaded()) {
            this._onEverythingLoaded();
        }
    }

    private _checkAppAndReactLoaded(): void {
        if (this._isAppJsLoaded && this._isReactJsLoaded) {
            App.getInstance().onReactJsLoaded();
        }
    }

    onDomLoadeded(): void {
        this._isDomLoaded = true;
        this._checkEverythingLoaded();
    }

    onReactJsLoaded(): void  {
        this._isReactJsLoaded = true;
        this._checkAppAndReactLoaded();
        this._checkEverythingLoaded();
    }

    onAppJsLoadeded(): void  {
        this._isAppJsLoaded = true;
        this._checkAppAndReactLoaded();
        this._checkEverythingLoaded();
    }

    onRegionFetcherJsLoaded(): void  {
        this._isRegionFetcherJsLoaded = true;
        this._checkEverythingLoaded();
    }

    onRegionModelJsLoaded(): void  {
        this._isRegionModelJsLoaded = true;
        this._checkEverythingLoaded();
    }

    onRegionSelectionJsLoaded(): void {
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