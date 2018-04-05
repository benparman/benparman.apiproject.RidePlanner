# apiCapstone

This app is a ride planning utility for mountain bikers.  It uses location information given by the user to provide information about nearby trails based search criteria such as search radius, trail length, trail difficulty, though these values have been arbitrarily set for the first release.  Basic weather information is also provided for the locations of the trails.

The API's currently used are:
-Google Maps GeoCoding API - converts user input to Lat/Lng coordinates
-MTB Project API - provides trail information based on GeoCoding data
-Open Weather Map API - Provides weather information based on MTB Project Data
-Google Maps API - Provides graphical, geographic representation of all other data

Considerations for future application features include:
-Automatic GeoLocation based on user's browser GeoLocation data
-Ability to search for locations using dropdown lists providing Country > State/Region > City
-Customizable search criteria provided to user for MTBProject and Open Weather Map Data
-Heatmap overlay for Google Map