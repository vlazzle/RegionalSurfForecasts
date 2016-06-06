var App = function() {};
App.instance = new App();

App.prototype.onReactDomLoaded = function() {
	var that = this;
	this.Region = React.createClass({displayName: 'Region',
	  render: function() {
	    return (
	      React.createElement('div', {className: "Region"},
	        this.props.name
	      )
	    );
	  }
	});

	this.RegionList = React.createClass({displayName: 'RegionList',
	  render: function() {
	    return (
	      React.createElement('div', {className: "RegionList"},
	        React.createElement(that.Region, {name: "region 1"}),
	        React.createElement(that.Region, {name: "region 2"})
	      )
	    );
	  }
	});
};

App.prototype.onReady = function() {
	console.log("app.js");

	ReactDOM.render(
	  React.createElement(this.RegionList, null),
	  document.getElementById('content')
	);
};