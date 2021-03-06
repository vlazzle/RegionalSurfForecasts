// TODO are these loaded asynchronously?
// http://stackoverflow.com/questions/13015898/asynchronous-load-of-typescript-declarations-with-no-exports
// https://www.stevefenton.co.uk/2014/10/TypeScript-AMD-Dependency-Comment/
class App {
    static _instance: App;

    // TODO type these as class definitions
    static Region;
    static TableHeader;
    static RegionList;
    static ErrorList;
    static LoadingIndicator;
    static RegionSelector;
    static RegionToggle;
    static MultiRegionForecast;

    static getInstance(): App {
        if (!App._instance) {
            App._instance = new App();
        }
        return App._instance;
    }

    // Associate IDs with default names to use until the real true name is loaded from the server.
    static _SUGGESTED_REGION_IDS_AND_NAMES: [[string]] = [
        ['2957', 'SF-San Mateo County'],
        ['2958', 'Santa Cruz'],
        ['2959', 'Monterey'],
        ['2962', 'San Luis Obispo County'],
        ['2963', 'North Santa Barbara County'],
        ['2141', 'Santa Barbara'],
        ['2952', 'Ventura'],
        ['2142', 'North Los Angeles'],
        ['2951', 'South Los Angeles'],
        ['2143', 'North Orange County'],
        ['2950', 'South Orange County'],
        ['2144', 'North San Diego'],
        ['2953', 'South San Diego']
    ];

    onReactJsLoaded(): void {
        // TODO do this correctly and specify the types.
        // Trust me, it's there by now
        let React = window['React'];

        App.Region = React.createClass({displayName: 'Region',
            propTypes: {
                name: React.PropTypes.string.isRequired,
                conditions: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
                surfQuant: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
                url: React.PropTypes.string.isRequired
            },

            render: function() {
                var nameCol = React.createElement('td', null,
                    React.createElement('a', {href: this.props.url}, this.props.name));
                var conditionsCols = this.props.conditions.map(function(day, i) {
                    return React.createElement('td', {key: i},
                        React.createElement('div', null,
                            React.createElement('div', {className: this._getClassNames(day)}), day),
                        React.createElement('div', {className: 'SurfQuant'}, this.props.surfQuant[i])
                    );
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
                    conditions: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
                    surfQuant: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired
                }).isRequired).isRequired
            },

            render: function() {
                var regionNodes = this.props.data.map(function(region) {
                    return React.createElement(App.Region, {
                        key: region.id,
                        name: region.name,
                        conditions: region.conditions,
                        surfQuant: region.surfQuant,
                        url: region.url
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
                return React.createElement('div', {className: 'LoadingIndicatorContainer'},
                    React.createElement('p', {className: this._getClassNames()}, 'Loading...'));
            },

            _getClassNames: function() {
                var classNames = ['LoadingIndicator']
                if (!this.props.isLoading) {
                    classNames.push('hidden');
                }
                return classNames.join(' ');
            }
        });

        App.RegionSelector = React.createClass({displayName: 'RegionSelector',
            propTypes: {
                selectableRegions: React.PropTypes.arrayOf(React.PropTypes.shape({
                    regionId: React.PropTypes.string.isRequired,
                    regionName: React.PropTypes.string.isRequired,
                    isSelected: React.PropTypes.bool
                }).isRequired).isRequired,
                onChangeRegionSelection: React.PropTypes.func.isRequired
            },

            render: function() {
                var checkboxes = this.props.selectableRegions.map(function(selectableRegion) {
                    return React.createElement(App.RegionToggle, {
                        key: selectableRegion.regionId,
                        regionId: selectableRegion.regionId,
                        regionName: selectableRegion.regionName,
                        isSelectedInitially: selectableRegion.isSelected,
                        onRegionsSelected: this.handleSelectRegion,
                        onRegionsDeselected: this.handleDeselectRegion,
                        ref: this.saveChildRef.bind(this, selectableRegion.regionId)
                    });
                }.bind(this));
                return React.createElement('div', {className: 'RegionSelectorContainer'},
                        React.createElement('div', {className: 'RegionSelector'}, checkboxes));
            },

            saveChildRef: function(regionId, ref) {
                if (!this._childrenByRegionId) {
                    this._childrenByRegionId = {};
                }
                this._childrenByRegionId[regionId] = ref;
            },

            handleSelectRegion: function(regionId) {
                RegionSelection.getInstance().addSelectedRegionId(regionId);
                this.props.onChangeRegionSelection();
            },

            handleDeselectRegion: function(regionId) {
                RegionSelection.getInstance().removeSelectedRegionId(regionId);
                this.props.onChangeRegionSelection();
            },

            handleHashChange: function(event) {
                var regionSelection = RegionSelection.getInstance();
                regionSelection.setFromUrl();
                var selectedIds = regionSelection.getSelectedRegionIds()
                this.props.selectableRegions.forEach(function(region) {
                    if (this._childrenByRegionId) {
                        var id = region.regionId;
                        var child = this._childrenByRegionId[id];
                        var isSelected = -1 !== selectedIds.indexOf(id);
                        child.setSelected(isSelected);
                    }
                }.bind(this));
            },

            componentDidMount: function() {
                window.addEventListener('hashchange', this.handleHashChange);
            },

            componentWillUnmount: function() {
                window.removeEventListener('hashchange', this.handleHashChange);
            }
        });

        // TODO For non-suggested regions, show an X to delete the checkbox.
        //      Keep the IDs in the url, just add something else to the url to designate they're unselected
        App.RegionToggle = React.createClass({displayName: 'RegionToggle',
            propTypes: {
                regionId: React.PropTypes.string.isRequired,
                regionName: React.PropTypes.string.isRequired,
                isSelectedInitially: React.PropTypes.bool,
                onRegionsSelected: React.PropTypes.func.isRequired,
                onRegionsDeselected: React.PropTypes.func.isRequired
            },

            getInitialState: function() {
                return {
                    isSelected: this.props.isSelectedInitially
                }
            },

            handleChange: function() {
                var isSelectedNow = !this.state.isSelected;
                if (isSelectedNow) {
                    this.props.onRegionsSelected(this.props.regionId);
                } else {
                    this.props.onRegionsDeselected(this.props.regionId);
                }
                this.setState({isSelected: isSelectedNow});
            },

            render: function() {
                var htmlId = 'rt_' + this.props.regionId;
                return React.createElement('div', {className: 'RegionToggle'},
                    React.createElement('input', {
                        type: 'checkbox',
                        name: this.props.regionId,
                        checked: this.state.isSelected,
                        onChange: this.handleChange,
                        id: htmlId
                    }),
                    React.createElement('label', {htmlFor: htmlId}, this.props.regionName)
                );
            },

            setSelected: function(isSelected) {
                if (isSelected != this.state.isSelected) {
                    this.handleChange();
                }
            }
        });

        App.MultiRegionForecast = React.createClass({displayName: 'MultiRegionForecast',
            render: function() {
                var data = Object.keys(this.state.data).map(function(id) {
                    return this.state.data[id];
                }.bind(this));
                var regionList = React.createElement(App.RegionList, {data: data});
                var errorList = React.createElement(App.ErrorList, {errors: this.state.errors});
                var loadingIndicator = React.createElement(App.LoadingIndicator, {isLoading: this.state.isLoading});
                var regionSelector = React.createElement(App.RegionSelector, {
                    selectableRegions: this._getSelectableRegions(),
                    onChangeRegionSelection: this.handleChangeRegionSelection
                });
                return React.createElement('div', {className: 'MultiRegionForecast'},
                    loadingIndicator, errorList, regionList, regionSelector);
            },

            getInitialState: function() {
                return {
                    data: {},
                    errors: [],
                    isLoading: false,
                    // object keys represent the elements of a set
                    selectedRegionIds: {}
                };
            },

            componentDidMount: function() {
                this._addRegions(RegionSelection.getInstance().getSelectedRegionIds());
            },

            _addRegions: function(regionIds) {
                if (regionIds.length == 0) {
                    return;
                }

                var onNext = function(model) {
                    this.setState(function(state, props) {
                        var newDatum = {
                            id: model.id,
                            name: model.name,
                            conditions: model.conditions,
                            surfQuant: model.getSurfQuant(),
                            days: model.days,
                            url: model.url
                        };
                        var newData = Object.assign({}, state.data);
                        newData[newDatum.id] = newDatum;
                        var newIdAssignment = {};
                        newIdAssignment[newDatum.id] = true;

                        return {
                            data: newData,
                            selectedRegionIds: Object.assign({}, state.selectedRegionIds, newIdAssignment)
                        };
                    });
                }.bind(this);

                var onError = function(errors) {
                    console.error(errors);
                    this.setState({errors: errors, isLoading: false});
                }.bind(this);

                var onCompleted = function() {
                    this.setState({isLoading: false});
                }.bind(this);

                this.setState({isLoading: true});

                // TODO abort this request in componentWillUnmount
                RegionModel.find(regionIds, onNext, onError, onCompleted);
            },

            handleChangeRegionSelection: function() {
                var newSelectedRegionIds = RegionSelection.getInstance().getSelectedRegionIds();

                var regionIdsToAdd = newSelectedRegionIds.filter(function(id) {
                    return !this.state.selectedRegionIds[id];
                }.bind(this));
                this._addRegions(regionIdsToAdd);

                this.setState(function(state, props) {
                    var remainingIds = {};
                    Object.keys(state.selectedRegionIds).filter(function(id) {
                        return -1 !== newSelectedRegionIds.indexOf(id);
                    }).forEach(function(id) {
                        remainingIds[id] = true;
                    });

                    var remainingData = {};
                    Object.keys(state.data).filter(function(id) {
                        return -1 !== newSelectedRegionIds.indexOf(id);
                    }).forEach(function(id) {
                        remainingData[id] = state.data[id];
                    });

                    return {
                        selectedRegionIds: remainingIds,
                        data: remainingData
                    };
                });
            },

            _getSelectableRegions: function() {
                var selectedRegionIds = RegionSelection.getInstance().getSelectedRegionIds().slice();

                // First, add all regions in App._SUGGESTED_REGION_IDS_AND_NAMES while also removing each of these from selectedRegionIds.
                var regions = App._SUGGESTED_REGION_IDS_AND_NAMES.map(function(regionIdAndName) {
                    var regionId = regionIdAndName[0];
                    var index = selectedRegionIds.indexOf(regionId);
                    if (-1 !== index) {
                        selectedRegionIds.splice(index, 1);
                    }
                    return {
                        isSelected: -1 !== index,
                        regionId: regionId,
                        regionName: this._getRegionNameById(regionId)
                    };
                }.bind(this));

                // Add remaining regions. These aren't in App._SUGGESTED_REGION_IDS_AND_NAMES, rather, they're specified in the URL.
                regions = regions.concat(selectedRegionIds.map(function(regionId) {
                    return {
                        isSelected: true,
                        regionId: regionId,
                        regionName: this._getRegionNameById(regionId)
                    };
                }.bind(this)));

                return regions;
            },

            _getRegionNameById: function(id) {
                var region = this.state.data[id];
                if (region) {
                    return region.name;
                } else {
                    // Find name of region that matches ID, or default to "region N"
                    return App._SUGGESTED_REGION_IDS_AND_NAMES.reduce(function(prev, regionIdAndName) {
                        return regionIdAndName[0] == id ? regionIdAndName[1] : prev;
                    }, 'region ' + id);
                }
            }
        });
    }

    onEverythingLoaded(): void {
        // TODO do this correctly and specify the types.
        // Trust me, it's there by now.
        let React = window['React'];
        let ReactDOM = window['ReactDOM'];

        ReactDOM.render(
            React.createElement(App.MultiRegionForecast),
            document.getElementById('content')
        );
    }
}