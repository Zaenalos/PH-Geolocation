/**
 * PH-Geolocation API
 *
 * A browser-compatible API for fetching Philippine geographic data.
 *
 * @module PH-Geolocation
 */

class PHGeolocation {
  constructor() {
    this.jsonUrl =
      "https://raw.githubusercontent.com/Zaenalos/PH-Geolocation/refs/heads/main/PH_GEO.json";
    this.data = null;
    this.isInitialized = false;
    // Cached initialization promise to prevent duplicate fetches
    this._initPromise = this.initialize().catch((error) => {
      console.error("PH-Geo: Initialization failed:", error);
    });
  }

  /**
   * Loads geographic data from the JSON file.
   * @returns {Promise<void>}
   * @throws {Error} If the fetch fails or the data cannot be parsed.
   */
  async loadGeo() {
    if (this.data) {
      return;
    }
    try {
      console.log("PH-Geo: Loading geographic data...");
      const response = await fetch(this.jsonUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data (${response.status} ${response.statusText})`
        );
      }
      const text = await response.text();
      this.data = JSON.parse(text);
      console.log("PH-Geo: Geographic data loaded successfully");
    } catch (error) {
      console.error("PH-Geo: Error:", error.message);
      throw error;
    }
  }

  /**
   * Initializes the API by loading the geographic data.
   * @returns {Promise<void>}
   * @throws {Error} If initialization fails.
   */
  async initialize() {
    await this.loadGeo();
    this.isInitialized = true;
    console.log("PH-Geo: API is ready to use");
  }

  /**
   * Ensures that the geographic data is loaded before further operations.
   * @returns {Promise<void>}
   */
  async ensureDataLoaded() {
    if (!this.isInitialized) {
      console.log("PH-Geo: Waiting for data to be loaded...");
      await this._initPromise;
    }
  }

  /**
   * Helper method to validate existence of a region.
   * @param {string} region The region name.
   * @returns {Object} The region data.
   * @throws {Error} If region does not exist.
   */
  _getRegion(region) {
    const regionData = this.data?.regions?.[region];
    if (!regionData) {
      throw new Error(`Region "${region}" not found`);
    }
    return regionData;
  }

  /**
   * Helper method to validate existence of a province in a given region.
   * @param {string} region The region name.
   * @param {string} province The province name.
   * @returns {Object} The province data.
   * @throws {Error} If province does not exist in the region.
   */
  _getProvince(region, province) {
    const regionData = this._getRegion(region);
    const provinceData = regionData.provinces?.[province];
    if (!provinceData) {
      throw new Error(`Province "${province}" not found in region "${region}"`);
    }
    return provinceData;
  }

  /**
   * Helper method to validate existence of a city in a given province and region.
   * @param {string} region The region name.
   * @param {string} province The province name.
   * @param {string} city The city name.
   * @returns {Object} The city data.
   * @throws {Error} If city does not exist in the province.
   */
  _getCity(region, province, city) {
    const provinceData = this._getProvince(region, province);
    const cityData = provinceData.cities?.[city];
    if (!cityData) {
      throw new Error(
        `City "${city}" not found in province "${province}" of region "${region}"`
      );
    }
    return cityData;
  }

  /**
   * Returns all regions.
   * @returns {Promise<string[]>} An array of region names.
   */
  async getRegions() {
    await this.ensureDataLoaded();
    return Object.keys(this.data.regions);
  }

  /**
   * Returns all provinces in a specific region.
   * @param {string} region The region name.
   * @returns {Promise<string[]>} An array of province names.
   */
  async getProvincesByRegion(region) {
    await this.ensureDataLoaded();
    const regionData = this._getRegion(region);
    return Object.keys(regionData.provinces);
  }

  /**
   * Returns all cities in a specific province within a region.
   * @param {string} region The region name.
   * @param {string} province The province name.
   * @returns {Promise<string[]>} An array of city names.
   */
  async getCitiesByProvince(region, province) {
    await this.ensureDataLoaded();
    const provinceData = this._getProvince(region, province);
    return Object.keys(provinceData.cities);
  }

  /**
   * Returns all barangays in a specific city.
   * @param {string} region The region name.
   * @param {string} province The province name.
   * @param {string} city The city name.
   * @returns {Promise<Array>} An array of barangay names.
   */
  async getBarangaysByCity(region, province, city) {
    await this.ensureDataLoaded();
    const cityData = this._getCity(region, province, city);
    return cityData.barangays;
  }
}

const PHGeo = new PHGeolocation();

// Version: 2.0.0
