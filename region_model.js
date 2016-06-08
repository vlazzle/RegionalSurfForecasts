var RegionModel = function(id, name, conditions, url, startDate) {
  if (!id) {
    throw 'missing id';
  }
  if (!name) {
    throw 'missing name for id=' + id;
  }
  if (!conditions) {
    throw 'missing conditions for id=' + id;
  }
  if (!url) {
    throw 'missing url for id=' + id;
  }
  if (!startDate) {
    throw 'missing startDate for id=' + id;
  }

  this.id = id;
  this.conditions = conditions;
  this.name = name;
  this.url = url;

  var dayZero = new Date(startDate);
  var oneDayInMs = 1000 * 60 * 60 * 24;
  this.days = [];
  var day = dayZero;
  for (var i = 0; i < conditions.length; i++) {
    this.days.push(new Date(dayZero.getTime() + i * oneDayInMs));
  }
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