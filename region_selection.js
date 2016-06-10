var RegionSelection = function() {
  this.setFromUrl();
};

// SF-San Mateo County & South Orange County
RegionSelection._DEFAULT_SELECTED_REGION_IDS = ['2957', '2950'];

RegionSelection._SEARCH_PREFIX = '?r=';

RegionSelection.getInstance = function() {
  if (!RegionSelection._instance) {
    RegionSelection._instance = new RegionSelection();
  }
  return RegionSelection._instance;
};

RegionSelection.prototype.setFromUrl = function() {
  // e.g. ?r=2957,2950,2142
  var match = location.search.match(/(\d+(?:,\d+)*)/);
  this._regionIds = match && match[0] ? match[0].split(',') : RegionSelection._DEFAULT_SELECTED_REGION_IDS;
};

RegionSelection.prototype.addSelectedRegionId = function(idToAdd) {
  if (-1 !== this._regionIds.indexOf(idToAdd)) {
    return;
  }

  this._regionIds.push(idToAdd);

  var search = RegionSelection._SEARCH_PREFIX + this._regionIds.join(',');
  history.pushState(location.href, '', search);
};

RegionSelection.prototype.removeSelectedRegionId = function(idToRemove) {
  var newRegionIds = this._regionIds.filter(function(regionId) {
    return regionId !== idToRemove;
  });

  if (newRegionIds.length == this._regionIds) {
    return;
  }

  this._regionIds = newRegionIds;

  var search = RegionSelection._SEARCH_PREFIX + location.search.replace(RegionSelection._SEARCH_PREFIX, '').split(',').filter(function(id) {
    return id !== idToRemove;
  }).join(',');

  history.pushState(location.href, '', './' + search);
};

RegionSelection.prototype.getSelectedRegionIds = function() {
  return this._regionIds;
}