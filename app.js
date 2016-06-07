var App = function() {};
App.getInstance = function() {
  if (!App._instance) {
    App._instance = new App();
  }
  return App._instance;
}

App.prototype.onReactJsLoaded = function() {
  var that = this;
  
  this.Region = React.createClass({displayName: 'Region',
    render: function() {
      return React.createElement('div', {className: 'Region'}, this.props.name);
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
      var data = [];
      return {data: data};
    },

    componentDidMount: function() {
      var selectedRegionIds = RegionSelection.getInstance().getSelectedRegionIds();
      var onNext = function(model) {
        this.setState(function(state, props) {
          var newData = state.data.slice(0);
          newData.push({
            id: model.id,
            name: model.name
          });
          return {data: newData};
        });
      }.bind(this);

      // TODO create component to contain a RegionList, progress spinner and an error display, and pass on onError to RegionModel.find.
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
    React.createElement(this.RegionList),
    document.getElementById('content')
  );
};