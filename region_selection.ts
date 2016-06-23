class RegionSelection {
    // SF-San Mateo County & South LA
    static _DEFAULT_SELECTED_REGION_IDS = ['2957', '2951'];

    private static _instance: RegionSelection;
    private _regionIds: string[];

    public static getInstance() {
        if (!RegionSelection._instance) {
            RegionSelection._instance = new RegionSelection();
        }
        return RegionSelection._instance;
    }

    constructor() {
        this.setFromUrl();
    }

    getSelectedRegionIds() {
        return this._regionIds;
    }

    setFromUrl() {
        // e.g. #2953,2951,2950,2142,2957,2958
        var match = location.hash.match(/(\d+(?:,\d+)*)/);
        this._regionIds = match && match[0] ? match[0].split(',') : RegionSelection._DEFAULT_SELECTED_REGION_IDS;
    }

    addSelectedRegionId(idToAdd) {
        if (-1 !== this._regionIds.indexOf(idToAdd)) {
            return;
        }

        this._regionIds.push(idToAdd);

        this._setHash();
    }

    removeSelectedRegionId(idToRemove) {
        var newRegionIds = this._regionIds.filter(function(regionId) {
            return regionId !== idToRemove;
        });

        if (newRegionIds.length == this._regionIds.length) {
            return;
        }

        this._regionIds = newRegionIds;

        this._setHash();
    }

    _setHash() {
        location.hash = this._regionIds.join(',');
    }
}