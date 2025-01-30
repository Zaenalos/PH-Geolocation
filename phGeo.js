/**
 * PH-Geolocation API
 *
 * A browser-compatible API for fetching location data in the Philippines.
 *
 * @module PH-Geolocation
 */
class PHGeolocation {
  constructor() {
    this.jsonUrl =
      "https://raw.githubusercontent.com/Zaenalos/PH-Geolocation/refs/heads/main/PH_GEO.json";
    this.data = null;
    this.isLoading = false;
    this.isInitialized = false;
    this.initPromise = null;

    // Automatically initialize with error handling
    this.initPromise = this.initialize().catch((error) => {
      console.error("PH-Geo: error - Initialization failed:", error);
    });
  }

  /**
   * Loads the geographic data from the JSON file.
   * @throws {Error} If the data fails to load or parse.
   */
  async loadGeo() {
    if (!this.data && !this.isLoading) {
      this.isLoading = true;
      try {
        console.log("PH-Geo: Loading geographic data...");
        const response = await fetch(this.jsonUrl);

        if (!response.ok) {
          throw new Error(
            `PH-Geo: error - Failed to fetch data (${response.status} ${response.statusText})`
          );
        }

        const text = await response.text();
        this.data = JSON.parse(text);
        console.log("PH-Geo: Geographic data loaded successfully");
      } catch (error) {
        console.error("PH-Geo: error -", error.message);
        throw error; // Re-throw for handling in initialize()
      } finally {
        this.isLoading = false;
      }
    }
  }

  /**
   * Initializes the API by loading the geographic data.
   * @returns {Promise} A promise that resolves when the data is loaded.
   */
  initialize() {
    if (!this.isInitialized) {
      this.initPromise = this.loadGeo()
        .then(() => {
          this.isInitialized = true;
          console.log("PH-Geo: API is ready to use");
          console.log("PH-Geo: Initialized successfully");
        })
        .catch((error) => {
          throw new Error(
            `PH-Geo: error - Initialization failed: ${error.message}`
          );
        });
    }
    return this.initPromise;
  }

  /**
   * Returns all regions.
   * @returns {Object} An object containing all regions.
   * @throws {Error} If the data is not loaded yet.
   */
  getRegions() {
    this.ensureDataLoaded();
    return this.data.regions;
  }

  /**
   * Returns all provinces in a specific region.
   * @param {string} region - The name of the region.
   * @returns {Object} An object containing all provinces in the region.
   * @throws {Error} If the data is not loaded yet or the region does not exist.
   */
  getProvincesByRegion(region) {
    this.ensureDataLoaded();
    if (!this.data.regions[region]) {
      throw new Error(`PH-Geo: error - Region "${region}" not found`);
    }
    return this.data.regions[region].provinces || {};
  }

  /**
   * Returns all cities in a specific province.
   * @param {string} region - The name of the region.
   * @param {string} province - The name of the province.
   * @returns {Object} An object containing all cities in the province.
   * @throws {Error} If the data is not loaded yet or the region/province does not exist.
   */
  getCitiesByProvince(region, province) {
    this.ensureDataLoaded();
    if (!this.data.regions[region]) {
      throw new Error(`PH-Geo: error - Region "${region}" not found`);
    }
    if (!this.data.regions[region].provinces[province]) {
      throw new Error(
        `PH-Geo: error - Province "${province}" not found in region "${region}"`
      );
    }
    return this.data.regions[region].provinces[province].cities || {};
  }

  /**
   * Returns all barangays in a specific city.
   * @param {string} region - The name of the region.
   * @param {string} province - The name of the province.
   * @param {string} city - The name of the city.
   * @returns {Array} An array containing all barangays in the city.
   * @throws {Error} If the data is not loaded yet or the region/province/city does not exist.
   */
  getBarangaysByCity(region, province, city) {
    this.ensureDataLoaded();
    if (!this.data.regions[region]) {
      throw new Error(`PH-Geo: error - Region "${region}" not found`);
    }
    if (!this.data.regions[region].provinces[province]) {
      throw new Error(
        `PH-Geo: error - Province "${province}" not found in region "${region}"`
      );
    }
    if (!this.data.regions[region].provinces[province].cities[city]) {
      throw new Error(
        `PH-Geo: error - City "${city}" not found in province "${province}"`
      );
    }
    return (
      this.data.regions[region].provinces[province].cities[city].barangays || []
    );
  }

  /**
   * Ensures the geographic data is loaded before performing any operations.
   * @throws {Error} If the data is not loaded yet.
   */
  ensureDataLoaded() {
    if (!this.data) {
      throw new Error(
        "PH-Geo: error - Data not loaded. Ensure initialization is complete."
      );
    }
  }
}

const PHGeo = new PHGeolocation(); // Attach to window after initialization
