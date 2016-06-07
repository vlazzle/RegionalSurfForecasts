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
  this._isServiceJsLoaded = false;
};

Loader.prototype._isEverythingLoaded = function() {
  return this._isDomLoaded && this._isReactJsLoaded && this._isAppJsLoaded && this._isServiceJsLoaded;
};

Loader.prototype._checkEverythingLoaded = function() {
  if (this._isEverythingLoaded()) {
    this._onEverythingLoaded();
  }
};

Loader.prototype.onDomLoadeded = function() {
  this._isDomLoaded = true;
  this._checkEverythingLoaded();
};

Loader.prototype.onReactJsLoaded = function() {
  this._isReactJsLoaded = true;
  App.getInstance().onReactJsLoaded();
  this._checkEverythingLoaded();
};

Loader.prototype.onAppJsLoadeded = function() {
  this._isAppJsLoaded = true;
  this._checkEverythingLoaded();
};

Loader.prototype.onServiceJsLoaded = function() {
  this._isServiceJsLoaded = true;
  this._checkEverythingLoaded();
};

Loader.prototype.importScript = (function (oHead) {
  function loadError (oError) {
    throw new URIError('The script ' + oError.target.src + ' is not accessible.');
  }

  return function (sSrc, fOnload) {
    var oScript = document.createElement('script');
    oScript.onerror = loadError;
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

document.addEventListener('DOMContentLoaded', function() {
  loader.onDomLoadeded();
});

loader.importScript(REACT_JS, function() {
  loader.importScript(REACT_DOM_JS, function () {
    loader.onReactJsLoaded();
  });
});

loader.importScript('app.js', function() {
  loader.onAppJsLoadeded();
});

loader.importScript('service.js', function() {
  loader.onServiceJsLoaded();
});