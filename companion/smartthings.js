import { API_CONST } from "./api-const";
import { FetchError, UnauthorizedError, ForbiddenError, SettingsError } from "./errors";

export class SmartThings {
  constructor() {
    this.MAX_DEVICES = 30;
    this.token = undefined;
    this.ondevices = undefined;
    this.onscenes = undefined;
    this.ondata = undefined;
    this.onerror = undefined;
  }

  setToken(t) {
    this.token = t;
  }

  fetchEndpoint(endpoint, params, body) {
    if (!this.token) return Promise.reject(new SettingsError("Token is not set"));

    let apiEndpoint = API_CONST.endpoints.find(x => x.endpoint === endpoint);
    apiEndpoint.options.headers = { "Authorization": `Bearer ${this.token}` }; //authorize req

    if (body) {
      apiEndpoint.options.body = JSON.stringify(body);
    }

    return fetch(this.mapUrl(apiEndpoint, params), apiEndpoint.options)
      .then((resp) => {
        if (resp.ok) return resp.json();
        if (resp.status === 401) {
          throw new UnauthorizedError("Authorization failed");
        } else if (resp.status === 403) {
          throw new ForbiddenError("Token does not have appropriate permissions");
        } else {
          throw new FetchError(`Response is not 200, response status ${resp.status}`);
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  mapUrl(apiEndpoint, params) {
    let base = API_CONST.baseUrl;
    let url = apiEndpoint.url;
    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const value = params[key];
          url = url.replace(key, value);
        }
      }
    }
    return base + url;
  }

  allDevices() {
    this.fetchEndpoint("devices-list").then((res) => {
      let arr = [];
      if (res.items) {
        res.items.forEach((item) => {
          let o = {
            deviceId: item.deviceId,
            name: item.label || item.name,
            type: item.dth ? item.dth.deviceTypeName : "",
            components: item.components || []
          };
          arr.push(o);
        });
      }
      this.ondevices(arr.slice(0, this.MAX_DEVICES));
    }).catch(err => {
      console.error(err);
      this.onerror(err);
    });
  }

  deviceStatus(params) {
    this.fetchEndpoint("device-status", params).then((res) => {
      if (res.components) {
        this.ondata(res);
      } else {
        throw new FetchError(`Required node is missing`);
      }
    }).catch(err => {
      console.error(err);
      this.onerror(err);
    });
  }

  executeDeviceCommand(params, body) {
    this.fetchEndpoint("device-execute", params, body).then((res) => {
      if (!res.error) res.status = "status"; //override req result.
      if (res.status || res.error) {
        this.ondata(res);
      } else {
        throw new FetchError(`Required node is missing`);
      }
    }).catch(err => {
      console.error(err);
      this.onerror(err);
    });
  }

  allScenes() {
    this.fetchEndpoint("scenes-list").then((res) => {
      let arr = [];
      if (res.items) {
        res.items.forEach((item) => {
          let o = {
            sceneId: item.sceneId,
            sceneName: item.sceneName,
            lastExecutedDate: item.lastExecutedDate
          };
          arr.push(o);
        });
      }
      this.onscenes(arr);
    }).catch(err => {
      console.error(err);
      this.onerror(err);
    });
  }

  executeScene(params) {
    this.fetchEndpoint("scenes-execute", params).then((res) => {
      if (res.status || res.error) {
        this.ondata(res);
      } else {
        throw new FetchError(`Required node is missing`);
      }
    }).catch(err => {
      console.error(err);
      this.onerror(err);
    });
  }
}