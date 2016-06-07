var RegionModel = function(id, conditions, alias, url) {
  this.id = id;
  this.conditions = conditions;
  this.name = alias;
  this.url = url;
};

RegionModel.find = function(ids, onNext, onError, onCompleted) {
  var successes = 0;
  var errors = [];
  var onSuccess = function(model) {
    onNext(model);
    successes++;
    checkDone();
  };
  var onError = function(error) {
    errors.push(error);
    checkDone();
  };
  var checkDone = function() {
    if (successes + errors.length == ids.length) {
      if (errors.length > 0) {
        onError(errors);
      } else {
        onCompleted();
      }
    }
  };
  
  ids.forEach(function(id) {
    var fetcher = new RegionReportFetcher(id);
    fetcher.fetch(onSuccess, onError);
  });
};