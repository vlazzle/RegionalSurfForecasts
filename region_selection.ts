class RegionSelection {
    // SF-San Mateo County & South LA
    static _DEFAULT_SELECTED_REGION_IDS = ['2957', '2951'];

    private static _instance: RegionSelection;
    private _regionIds: string[];

    static getInstance(): RegionSelection {
        if (!RegionSelection._instance) {
            RegionSelection._instance = new RegionSelection();
        }
        return RegionSelection._instance;
    }

    constructor() {
        this.setFromUrl();
    }

    getSelectedRegionIds(): string[] {
        return this._regionIds;
    }

    setFromUrl(): void {
        // e.g. #2953,2951,2950,2142,2957,2958
        var match = location.hash.match(/(\d+(?:,\d+)*)/);
        this._regionIds = match && match[0] ? match[0].split(',') : RegionSelection._DEFAULT_SELECTED_REGION_IDS;
    }

    addSelectedRegionId(idToAdd: string): void {
        if (-1 !== this._regionIds.indexOf(idToAdd)) {
            return;
        }

        this._regionIds.push(idToAdd);

        this._setHash();
    }

    removeSelectedRegionId(idToRemove: string): void {
        var newRegionIds = this._regionIds.filter(function(regionId) {
            return regionId !== idToRemove;
        });

        if (newRegionIds.length == this._regionIds.length) {
            return;
        }

        this._regionIds = newRegionIds;

        this._setHash();
    }

    _setHash(): void {
        location.hash = this._regionIds.join(',');
    }
}