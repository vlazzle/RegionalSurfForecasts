var App = function() {};
App.getInstance = function() {
  if (!App._instance) {
    App._instance = new App();
  }
  return App._instance;
}

App.prototype.onReactJsLoaded = function() {

  App.Region = React.createClass({displayName: 'Region',
    propTypes: {
      name: React.PropTypes.string.isRequired,
      conditions: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired
    },

    render: function() {
      var nameCol = React.createElement('td', null, this.props.name);
      var conditionsCols = this.props.conditions.map(function(day, i) {
        return React.createElement('td', {key: i},
          React.createElement('div', {className: this._getClassNames(day)}),
          day);
      }.bind(this));
      return React.createElement('tr', {className: 'Region'}, nameCol, conditionsCols);
    },

    _getClassNames: function(conditions) {
      var classNames = ['ConditionSquare'];
      classNames.push('c_' + conditions.replace(/ /g, '_'));
      return classNames.join(' ');
    }
  });

  App.TableHeader = React.createClass({displayName: 'TableHeader',
    propTypes: {
      days: React.PropTypes.arrayOf(React.PropTypes.shape({
          getDay: React.PropTypes.func.isRequired,
          getDate: React.PropTypes.func.isRequired
        }).isRequired).isRequired
    },

    render: function() {
      var colHeaders = this.props.days.map(function(day, i) {
        var headerText = this._toDayAbbrev(day.getDay()) + " " + day.getDate();
        return React.createElement('th', {key: i + 1}, headerText);
      }.bind(this));
      var blankColheader = React.createElement('th', {key: 0});
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
    propTypes: {
      data: React.PropTypes.arrayOf(React.PropTypes.shape({
          id: React.PropTypes.string.isRequired,
          name: React.PropTypes.string.isRequired,
          conditions: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired
        }).isRequired).isRequired
    },

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
    propTypes: {
      errors: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired
    },

    render: function() {
      var errorNodes = this.props.errors.map(function(error) {
        return React.createElement('p', {className: 'error', key: error}, error);
      });
      return React.createElement('div', {className: 'ErrorList'}, errorNodes);
    }
  });

  App.LoadingIndicator = React.createClass({displayName: 'LoadingIndicator',
    propTypes: {
      isLoading: React.PropTypes.bool
    },

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