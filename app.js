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
			var regionNodes = this.props.data.map(function(region) {
				return React.createElement(that.Region, {name: region.name, key: region.id});
	    });
	    return React.createElement('div', {className: "RegionList"}, regionNodes);
	  }
	});
};

App.prototype.onReady = function() {
	console.log("app.js");

	var data = [
		{id: 1, name: "region 1"},
		{id: 2, name: "region 2"},
		{id: 3, name: "region 3"}
	];

	ReactDOM.render(
	  React.createElement(this.RegionList, {data: data}),
	  document.getElementById('content')
	);
};