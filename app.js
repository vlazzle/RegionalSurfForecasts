var App = function() {};
App.getInstance = function() {
  if (!App._instance) {
    App._instance = new App();
  }
  return App._instance;
}

App.prototype.onReactJsLoaded = function() {
  App.Region = React.createClass({displayName: 'Region',
    render: function() {
      return React.createElement('div', {className: 'Region'}, this.props.name);
    }
  });

  App.RegionList = React.createClass({displayName: 'RegionList',
    render: function() {
      var regionNodes = this.props.data.map(function(region) {
        return React.createElement(App.Region, {name: region.name, key: region.id});
      });
      return React.createElement('div', {className: 'RegionList'}, regionNodes);
    }
  });

  // TODO progress spinner & error display, and pass on onError to RegionModel.find.
  App.MultiRegionForecast = React.createClass({displayName: 'MultiRegionForecast',
    render: function() {
      var regionList = React.createElement(App.RegionList, {data: this.state.data});
      return regionList;
    },

    getInitialState: function() {
      var data = [];
      return {data: data};
    },

    componentDidMount: function() {
      var selectedRegionIds = RegionSelection.getInstance().getSelectedRegionIds();
      var onNext = function(model) {
        this.setState(function(state, props) {
          // TODO http://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-reactjs
          var newData = state.data.slice(0);
          newData.push({
            id: model.id,
            name: model.name
          });
          return {data: newData};
        });
      }.bind(this);

      var onError = function(errors) {
        console.error(errors);
      };

      // TODO hide loading spinner or something
      var onCompleted = function() {
      };

      RegionModel.find(selectedRegionIds, onNext, onError, onCompleted);
    }
  });
};

App.prototype.onEverythingLoaded = function() {
  ReactDOM.render(
    React.createElement(App.MultiRegionForecast),
    document.getElementById('content')
  );
};