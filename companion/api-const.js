export const API_CONST = {
  "baseUrl": "https://api.smartthings.com/v1",
  "endpoints": [
    {
      "endpoint": "locations-list",
      "url": "/locations",
      "options": {
         "method": "GET"
      }
    },
    {
      "endpoint": "devices-list",
      "url": "/devices",
      "options": {
         "method": "GET"
      }
    },
    {
      "endpoint": "device-status",
      "url": "/devices/deviceId/status",
      "options": {
         "method": "GET"
      }
    },
    {
      "endpoint": "device-execute",
      "url": "/devices/deviceId/commands",
      "options": {
         "method": "POST"
      }
    },
    {
      "endpoint": "scenes-list",
      "url": "/scenes",
      "options": {
         "method": "GET"
      }
    },
    {
      "endpoint": "scenes-execute",
      "url": "/scenes/sceneId/execute",
      "options": {
         "method": "POST"
      }
    }
  ]
}