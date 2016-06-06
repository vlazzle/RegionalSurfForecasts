var IS_PRODUCTION  = false;
if (IS_PRODUCTION) {
	REACT_JS = "https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.min.js";
	REACT_DOM_JS = "https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.min.js";
} else {
	REACT_JS = "https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js";
	REACT_DOM_JS = "https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.js";
}

var Loader = function(fireFn) {
	this._isAppJsLoaded = false;
	this._isReactJsLoaded = false;
	this._isDomLoaded = false;
	this._fireFn = fireFn;
};

Loader.prototype._isReady = function() {
	return this._isReactJsLoaded && this._isAppJsLoaded && this._isDomLoaded;
};

Loader.prototype._fireWhenReady = function() {
	if (this._isReady()) {
		this._fireFn();
	}
}

Loader.prototype.onAppJsLoadeded = function() {
	console.log("onJsLoaded");
	this._isAppJsLoaded = true;
	this._fireWhenReady();
};

Loader.prototype.onReactJsLoaded = function() {
	console.log("onReactJsLoaded");
	this._isReactJsLoaded = true;
	App.instance.onReactDomLoaded();
	this._fireWhenReady();
};

Loader.prototype.onDomLoadeded = function() {
	console.log("onDomLoaded");
	this._isDomLoaded = true;
	this._fireWhenReady();
};

Loader.prototype.importScript = (function (oHead) {
  function loadError (oError) {
    throw new URIError("The script " + oError.target.src + " is not accessible.");
  }

  return function (sSrc, fOnload) {
    var oScript = document.createElement("script");
    oScript.type = "text\/javascript";
    oScript.onerror = loadError;
    if (fOnload) { oScript.onload = fOnload; }
    oHead.appendChild(oScript);
    oScript.src = sSrc;
  }

})(document.head || document.getElementsByTagName("head")[0]);

Loader.instance = new Loader(function() {
	App.instance.onReady();
});

document.addEventListener("DOMContentLoaded", function() {
  Loader.instance.onDomLoadeded();
});


Loader.instance.importScript("app.js", function () {
	Loader.instance.onAppJsLoadeded();
});

Loader.instance.importScript(REACT_JS, function () {
	Loader.instance.importScript(REACT_DOM_JS, function () {
		Loader.instance.onReactJsLoaded();
	});
});

Loader.instance.importScript("service.js");