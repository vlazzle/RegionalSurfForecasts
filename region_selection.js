var RegionSelection = function() {
  this._regionIds = this._getInitiallySelectedRegions();
};

// // SF-San Mateo County & South Orange County
RegionSelection._DEFAULT_SELECTED_REGION_IDS = ['2957', '2950'];

RegionSelection.getInstance = function() {
  if (!RegionSelection._instance) {
    RegionSelection._instance = new RegionSelection();
  }
  return RegionSelection._instance;
};

RegionSelection.prototype._getInitiallySelectedRegions = function() {
  // e.g. ?r=2957,2950,2142
  var match = location.search.match(/(\d+(?:,\d+)*)/);
  return match && match[0] ? match[0].split(',') : RegionSelection._DEFAULT_SELECTED_REGION_IDS;
};

RegionSelection.prototype.addSelectedRegionId = function(idToAdd) {
  this._regionIds.push(idToAdd);
};

RegionSelection.prototype.removeSelectedRegionId = function(idToRemove) {
  this._regionIds = this._regionIds.filter(function(regionId) {
    return regionId !== idToRemove;
  });
};

RegionSelection.prototype.getSelectedRegionIds = function() {
  return this._regionIds;
}