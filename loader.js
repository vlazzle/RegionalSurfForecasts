var IS_PRODUCTION  = false;
if (IS_PRODUCTION) {
  REACT_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.min.js';
  REACT_DOM_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.min.js';
} else {
  REACT_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js';
  REACT_DOM_JS = 'https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.js';
}

var Loader = function(onEverythingLoadedFn) {
  this._onEverythingLoaded = onEverythingLoadedFn;

  this._isDomLoaded = false;
  this._isReactJsLoaded = false;
  this._isAppJsLoaded = false;
  this._isRegionFetcherJsLoaded = false;
  this._isRegionModelJsLoaded = false;
};

Loader.prototype._isEverythingLoaded = function() {
  return this._isDomLoaded && this._isReactJsLoaded && this._isAppJsLoaded && this._isRegionFetcherJsLoaded && this._isRegionModelJsLoaded && this._regionSelectionJsLoaded;
};

Loader.prototype._checkEverythingLoaded = function() {
  if (this._isEverythingLoaded()) {
    this._onEverythingLoaded();
  }
};

Loader.prototype._checkAppAndReactLoaded = function() {
  if (this._isAppJsLoaded && this._isReactJsLoaded) {
    App.getInstance().onReactJsLoaded();
  }
};

Loader.prototype.onDomLoadeded = function() {
  this._isDomLoaded = true;
  this._checkEverythingLoaded();
};

Loader.prototype.onReactJsLoaded = function() {
  this._isReactJsLoaded = true;
  this._checkAppAndReactLoaded();
  this._checkEverythingLoaded();
};

Loader.prototype.onAppJsLoadeded = function() {
  this._isAppJsLoaded = true;
  this._checkAppAndReactLoaded();
  this._checkEverythingLoaded();
};

Loader.prototype.onRegionFetcherJsLoaded = function() {
  this._isRegionFetcherJsLoaded = true;
  this._checkEverythingLoaded();
};

Loader.prototype.onRegionModelJsLoaded = function() {
  this._isRegionModelJsLoaded = true;
  this._checkEverythingLoaded();
};

Loader.prototype.onRegionSelectionJsLoaded = function() {
  this._regionSelectionJsLoaded = true;
  this._checkEverythingLoaded();
};

Loader.prototype.importScript = (function (oHead) {
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

Loader.getInstance = function() {
  if (!Loader._instance) {
    Loader._instance = new Loader(function() {
      App.getInstance().onEverythingLoaded();
    });
  }
  return Loader._instance;
};

var loader = Loader.getInstance();

document.addEventListener('DOMContentLoaded', loader.onDomLoadeded.bind(loader));

loader.importScript(REACT_JS, loader.importScript.bind(loader, REACT_DOM_JS, loader.onReactJsLoaded.bind(loader)));
loader.importScript('app.js', loader.onAppJsLoadeded.bind(loader));
loader.importScript('region_fetcher.js', loader.onRegionFetcherJsLoaded.bind(loader));
loader.importScript('region_model.js', loader.onRegionModelJsLoaded.bind(loader));
loader.importScript('region_selection.js', loader.onRegionSelectionJsLoaded.bind(loader));