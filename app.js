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
      var nameCol = React.createElement('td', null, this.props.name);
      var conditionsCols = this.props.conditions.map(function(day, i) {
        return React.createElement('td', {key: i}, day);
      });
      return React.createElement('tr', {className: 'Region'}, nameCol, conditionsCols);
    }
  });

  App.TableHeader = React.createClass({displayName: 'TableHeader',
    render: function() {
      var colHeaders = this.props.days.map(function(day) {
        var headerText = this._toDayAbbrev(day.getDay()) + " " + day.getDate();
        return React.createElement('th', null, headerText);
      }.bind(this));
      var blankColheader = React.createElement('th');
      colHeaders.unshift(blankColheader);
      return React.createElement('thead', null,
        React.createElement('tr', null, colHeaders));
    },

    _toDayAbbrev: function(dayNum) {
      var dayNames = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
      ];
      return dayNames[dayNum];
    }
  });

  App.RegionList = React.createClass({displayName: 'RegionList',
    render: function() {
      var regionNodes = this.props.data.map(function(region) {
        return React.createElement(App.Region, {
          key: region.id,
          name: region.name,
          conditions: region.conditions
        });
      });
      var maybeHeader = this.props.data.length > 0
        ? React.createElement(App.TableHeader, {days : this.props.data[0].days})
        : null;
      return React.createElement('div', {className: 'RegionList'},
        React.createElement('table', null, maybeHeader, React.createElement('tbody', null, regionNodes)));
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

  App.LoadingIndicator = React.createClass({displayName: 'LoadingIndicator',
    render: function() {
      return React.createElement('p', {className: this._getClassNames()}, 'loading...');
    },

    _getClassNames: function() {
      var classNames = ['LoadingIndicator']
      if (!this.props.isLoading) {
        classNames.push('hidden');
      }
      return classNames.join(' ');
    }
  });

  App.MultiRegionForecast = React.createClass({displayName: 'MultiRegionForecast',
    render: function() {
      var regionList = React.createElement(App.RegionList, {data: this.state.data});
      var errorList = React.createElement(App.ErrorList, {errors: this.state.errors});
      var loadingIndicator = React.createElement(App.LoadingIndicator, {isLoading: this.state.isLoading});
      return React.createElement('div', {className: 'MultiRegionForecast'}, loadingIndicator, errorList, regionList);
    },

    getInitialState: function() {
      return {data: [], errors: [], isLoading: false};
    },

    componentDidMount: function() {
      var selectedRegionIds = RegionSelection.getInstance().getSelectedRegionIds();
      var onNext = function(model) {
        this.setState(function(state, props) {
          var newDatum = {
            id: model.id,
            name: model.name,
            conditions: model.conditions,
            days: model.days
          };
          return {data: state.data.concat([newDatum])};
        });
      }.bind(this);

      var onError = function(errors) {
        console.error(errors);
        this.setState({errors: errors});
      }.bind(this);

      var onCompleted = function() {
        this.setState({isLoading: false});
      }.bind(this);

      this.setState({isLoading: true});
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