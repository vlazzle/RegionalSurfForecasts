var App = function() {};
App.getInstance = function() {
  if (!App._instance) {
    App._instance = new App();
  }
  return App._instance;
}

App.prototype.onReactDomLoaded = function() {
  var that = this;
  
  this.Region = React.createClass({displayName: 'Region',
    render: function() {
      return React.createElement('div', {className: 'Region'}, this.props.name)
    }
  });

  this.RegionList = React.createClass({displayName: 'RegionList',
    render: function() {
      var regionNodes = this.state.data.map(function(region) {
        return React.createElement(that.Region, {name: region.name, key: region.id});
      });
      return React.createElement('div', {className: 'RegionList'}, regionNodes);
    },

    getInitialState: function() {
      var data = [
        {id: 1, name: 'region 1'},
        {id: 2, name: 'region 2'},
        {id: 3, name: 'region 3'}
      ];
      return {data: data};
    }
  });
};

App.prototype.onReady = function() {
  console.log('app.js');

  ReactDOM.render(
    React.createElement(this.RegionList),
    document.getElementById('content')
  );
};