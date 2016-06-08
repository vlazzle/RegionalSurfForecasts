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

  App.ErrorList = React.createClass({displayName: 'ErrorList',
    render: function() {
      var errorNodes = this.props.errors.map(function(error) {
        return React.createElement('p', {className: 'error', key: error}, error);
      });
      return React.createElement('div', {className: 'ErrorList'}, errorNodes);
    }
  });

  // TODO progress spinner
  App.MultiRegionForecast = React.createClass({displayName: 'MultiRegionForecast',
    render: function() {
      var regionList = React.createElement(App.RegionList, {data: this.state.data});
      var errorList = React.createElement(App.ErrorList, {errors: this.state.errors});
      return React.createElement('div', {className: 'MultiRegionForecast'}, errorList, regionList);
    },

    getInitialState: function() {
      var data = [];
      var errors = []
      return {data: data, errors: errors};
    },

    componentDidMount: function() {
      var selectedRegionIds = RegionSelection.getInstance().getSelectedRegionIds();
      var onNext = function(model) {
        this.setState(function(state, props) {
          var newDatum = {
            id: model.id,
            name: model.name
          };
          return {data: state.data.concat([newDatum])};
        });
      }.bind(this);

      var onError = function(errors) {
        console.error(errors);
        this.setState({errors: errors});
      }.bind(this);

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