import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { SmartThings } from "./smartthings";
import * as fileTransfer from "./modules/filetransfer-companion";

let things = new SmartThings();
things.ondevices = (devices) => fileTransfer.send("devices.cbor", devices);
things.onscenes = (scenes) => fileTransfer.send("scenes.cbor", scenes);
things.ondata = (data) => sendMsg(data);
things.onerror = (err) => sendError(err);

let tokenKey;
if (tokenKey = settingsStorage.getItem("token")) {
  setUpToken(tokenKey);
}

settingsStorage.addEventListener("change", evt => {
  if (evt.key !== "token") return;
  setUpToken(evt.newValue);
  things.allScenes();
  things.allDevices();
});

messaging.peerSocket.onopen = (err) => {
  console.warn("Socket opened!");
  things.allScenes();
  things.allDevices();
};

messaging.peerSocket.addEventListener("message", (evt) => {
  let msg = evt.data;
  if (msg.command && msg.command === "executescene") {
    things.executeScene(msg.params);
  }
  if (msg.command && msg.command === "getstatus") {
    things.deviceStatus(msg.params);
  }
  if (msg.command && msg.command === "executecommand") {
    things.executeDeviceCommand(msg.params, msg.body);
  }
});

function setUpToken(key) {
  let value;
  try {
    value = JSON.parse(key).name;
  } catch (err) {
    console.error(err);
  }
  things.setToken(value);
}

function sendError(err) {
  let msg = {
    errType: err.t || "generic",
    message: err.message || "Something went wrong."
  };
  sendMsg(msg);
}

function sendMsg(msg) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(msg);
  }
}