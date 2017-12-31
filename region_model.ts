class RegionModel {
    private id: string;
    private conditions: string[];
    private surfMin: number[];
    private surfMax: number[];
    private surfPeak: [number|string];
    private canExceed: boolean[];
    private name: string;
    private url: string;
    private days: Date[];

    static find(ids: string[], onNext: (model: RegionModel)=>void, onError: (errors: string[])=>void, onCompleted: ()=>void) {
        var successes = 0;
        var errors: string[] = [];
        let successFn = function(model: RegionModel): void {
            onNext(model);
            successes++;
            checkDone();
        };
        let errorFn = function(error: string): void {
            errors.push(error);
            checkDone();
        };
        let checkDone = function(): void {
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
    }
    
    constructor(id: string, name, conditions: string[], surfMin: number[], surfMax: number[], surfPeak, canExceed: string[], url: string, startDate) {
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
        this.canExceed = canExceed.map(function(c) {
            return c == 'TRUE';
        });
        this.name = name;
        this.url = url;

        let dayZero = new Date(startDate);
        let oneDayInMs = 1000 * 60 * 60 * 24;
        this.days = [];
        for (var i = 0; i < conditions.length; i++) {
            this.days.push(new Date(dayZero.getTime() + i * oneDayInMs));
        }
    }

    getSurfQuant(): string[]  {
        let surfQuant: string[] = [];
        for (var i = 0; i < this.surfPeak.length; i++) {
            let surfPeak = Number.parseInt(<string>this.surfPeak[i]);
            let occPeak = surfPeak ? ' occ. ' + surfPeak : '';
            let plus = this.canExceed[i] ? '+' : '';
            let surfMin = this.surfMin[i] as any;
            let surfMax = this.surfMax[i] as any;
            let quant;
            if (surfMin === '' && surfMax === '') {
                quant = '-';
            } else {
                quant = '' + surfMin + '-' + surfMax + 'ft' + plus + occPeak;
            }
            surfQuant.push(quant);

        }
        return surfQuant;
    }
}