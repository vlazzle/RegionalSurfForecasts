var RegionSelection = function() {
  this.setFromUrl();
};

// SF-San Mateo County & South LA
RegionSelection._DEFAULT_SELECTED_REGION_IDS = ['2957', '2951'];

RegionSelection.getInstance = function() {
  if (!RegionSelection._instance) {
    RegionSelection._instance = new RegionSelection();
  }
  return RegionSelection._instance;
};

RegionSelection.prototype.setFromUrl = function() {
  // e.g. #2953,2951,2950,2142,2957,2958
  var match = location.hash.match(/(\d+(?:,\d+)*)/);
  this._regionIds = match && match[0] ? match[0].split(',') : RegionSelection._DEFAULT_SELECTED_REGION_IDS;
};

RegionSelection.prototype.addSelectedRegionId = function(idToAdd) {
  if (-1 !== this._regionIds.indexOf(idToAdd)) {
    return;
  }

  this._regionIds.push(idToAdd);

  this._setHash();
};

RegionSelection.prototype.removeSelectedRegionId = function(idToRemove) {
  var newRegionIds = this._regionIds.filter(function(regionId) {
    return regionId !== idToRemove;
  });

  if (newRegionIds.length == this._regionIds) {
    return;
  }

  this._regionIds = newRegionIds;

  this._setHash();
};

RegionSelection.prototype.getSelectedRegionIds = function() {
  return this._regionIds;
};

RegionSelection.prototype._setHash = function() {
  location.hash = this._regionIds.join(',');
};