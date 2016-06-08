var RegionModel = function(id, conditions, name, url) {
  if (!id) {
    throw 'missing id';
  }
  if (!conditions) {
    throw 'missing conditions';
  }
  if (!name) {
    throw 'missing name';
  }
  if (!url) {
    throw 'missing url';
  }

  this.id = id;
  this.conditions = conditions;
  this.name = name;
  this.url = url;
};

RegionModel.find = function(ids, onNext, onError, onCompleted) {
  var successes = 0;
  var errors = [];
  var successFn = function(model) {
    onNext(model);
    successes++;
    checkDone();
  };
  var errorFn = function(error) {
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
    fetcher.fetch(successFn, errorFn);
  });
};