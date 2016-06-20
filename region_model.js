var RegionModel = function(id, name, conditions, surfMin, surfMax, surfPeak, canExceed, url, startDate) {
  if (!id) {
    throw 'missing id';
  }
  if (!name) {
    throw 'missing name for id=' + id;
  }
  if (!conditions) {
    throw 'missing conditions for id=' + id;
  }
  if (!surfMin) {
    throw 'missing surfMin for id=' + id;
  }
  if (!surfMax) {
    throw 'missing surfMax for id=' + id;
  }
  if (!surfPeak) {
    throw 'missing surfPeak for id=' + id;
  }
  if (!canExceed) {
    throw 'missing canExceed for id=' + id;
  }
  if (!url) {
    throw 'missing url for id=' + id;
  }
  if (!startDate) {
    throw 'missing startDate for id=' + id;
  }

  this.id = id;
  this.conditions = conditions;
  this.surfMin = surfMin;
  this.surfMax = surfMax;
  this.surfPeak = surfPeak;
  this.canExceed = canExceed;
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
    var fetcher = new RegionFetcher(id);
    fetcher.fetch(successFn, errorFn);
  });
};

RegionModel.prototype.getSurfQuant = function() {
  var surfQuant = [];
  for (var i = 0; i < this.surfPeak.length; i++) {
    var surfPeak = Number.parseInt(this.surfPeak[i]);
    var occPeak = surfPeak ? ' occ. ' + surfPeak : '';
    var plus = this.canExceed[i] == 'TRUE' ? '+' : '';
    surfQuant.push('' + this.surfMin[i] + '-' + this.surfMax[i] + 'ft' + plus + occPeak);
  }
  return surfQuant;
};