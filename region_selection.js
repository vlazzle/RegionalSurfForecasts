var RegionSelection = function() {
};

RegionSelection.getInstance = function() {
  if (!RegionSelection._instance) {
    RegionSelection._instance = new RegionSelection();
  }
  return RegionSelection._instance;
};

RegionSelection.prototype.getSelectedRegionIds = function() {
  // TODO region selection should be user controllable
  return ['2957', '2950'];
};