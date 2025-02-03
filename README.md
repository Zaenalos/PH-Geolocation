# PH-Geolocation

## Introduction

The PH Geolocation is an API that provides geolocation data for locations within the Philippines. This API allows users to retrieve information about regions, provinces, cities, municipalities, and barangays. The data is sourced from the Philippine Standard Geographic Code (PSGC) and has been structured in JSON format for ease of use.

### Available Functions

- `async getRegions()`: Returns {Promise<string[]>} all regions .
- `async getProvincesByRegion(region)`: Returns {Promise<string[]>} all provinces in that region.
- `async getCitiesByProvince(region, province)`: Returns {Promise<string[]>} all cities in that specific region and province.
- `async getBaranggaysByCity(region, province, city)`: Returns {Promise<Array>} all barangays in that specific region, province, and city.

## How to use? (USING a CDN)

Here, add directly in your HTML using a `<script>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/Zaenalos/PH-Geolocation@refs/heads/main/phGeo.js"></script>
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PH Geolocation API Example</title>
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/gh/Zaenalos/PH-Geolocation@refs/heads/main/phGeo.js"></script>
    <script>
      // Example usage

      PHGeo.getRegions().then((regions) => {
        console.log(regions);
      });

      PHGeo.getProvincesByRegion("National Capital Region (NCR)").then(
        (provinces) => {
          console.log(provinces);
        }
      );

      PHGeo.getCitiesByProvince(
        "National Capital Region (NCR)",
        "Metro Manila"
      ).then((cities) => {
        console.log(cities);
      });

      const barangays = PHGeo.getBaranggaysByCity(
        "Region I (Ilocos Region)",
        "Ilocos Norte",
        "Adams"
      ).then((barangays) => {
        console.log(barangays);
      });
    </script>
  </body>
</html>
```

## Credits

The dataset used in this API is provided by the Philippine Standard Geographic Code (PSGC). The data has been arranged and converted into JSON format by the project maintainer.

- Dataset Source: [PSGC](https://psa.gov.ph/classification/psgc/)
- Maintainer: [Zaenalos](https://github.com/Zaenalos)

## Spreadsheet Data

In addition to the JSON API, you can also access the geolocation data in spreadsheet format. The `PH_GEO.xlsx` file contains the same data structured for easy reference and offline use.

[Spreadsheet](https://github.com/Zaenalos/PH-Geolocation/blob/main/PH_GEO.xlsx)

## License

This project is distributed under the MIT License. Refer to the LICENSE file for details.
