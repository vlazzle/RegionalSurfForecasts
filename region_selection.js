var DEFAULT_REGION_IDS = [2957, 2950];

var RegionSelection = function() {
};

RegionSelection.getInstance = function() {
  if (!RegionSelection._instance) {
    RegionSelection._instance = new RegionSelection();
  }
  return RegionSelection._instance;
};

RegionSelection.prototype.getSelectedRegionIds = function() {
  // TODO region selection should come from UI
  // e.g. ?r=2957,2950,2142
  var match = location.search.match(/(\d+(?:,\d+)*)/);
  return match && match[0] ? match[0].split(',') : DEFAULT_REGION_IDS;
};