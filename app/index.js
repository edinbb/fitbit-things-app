import * as fs from "fs";
import document from "document";
import * as messaging from "messaging";
import * as fileTransfer from "./modules/filetransfer-device";
import { ListHandler } from "./modules/listhandler";
import { StatusScreen } from "./statusscreen";
import { ERRORS } from "./constants";
import * as util from "./utils";
//import * as appMemory from "./modules/memory";
//appMemory.init();

let sceneListHandler = new ListHandler(document.getElementById("scene-list"));
sceneListHandler.onmap = (tile, item) => {
  tile.getElementById("title").text = item.sceneName;
  tile.getElementById("desc").text = util.formatDate(item.lastExecutedDate) || "";
};
sceneListHandler.onclick = (item) => {
  sendMsg({
    command: "executescene",
    params: { sceneId: item.sceneId }
  });
  statusIcon("spinner");
};

let deviceListHandler = new ListHandler(document.getElementById("device-list"));
deviceListHandler.onmap = (tile, item) => {
  tile.getElementById("title").text = item.name;
  tile.getElementById("desc").text = item.type;
};
deviceListHandler.onclick = (item) => {
  if (!statusScr.isSupported(item)) return;
  statusScr.setTitle(item.name);
  statusScr.setButtons(item.deviceId, item.components);
  statusScr.show();
  sendMsg({
    command: "getstatus",
    params: { deviceId: item.deviceId }
  });
  statusIcon("spinner");
};

let statusScr = new StatusScreen(document.getElementById("status-screen"));
statusScr.onaction = (deviceId, commands) => {
  sendMsg({
    command: "executecommand",
    params: { deviceId: deviceId },
    body: commands
  });
  statusIcon("spinner");
};

function transferCallback(filename) {
  let data;
  try {
    data = fs.readFileSync(filename, "cbor");
    fs.unlinkSync(filename);
  } catch (err) {
    console.error(err);
    showErrorScr({ error: "generic" });
    return;
  }

  hideErrorScr();
  hideWaitScr();

  switch (filename) {
    case "devices.cbor":
      deviceListHandler.generateList(data);
      break;
    case "scenes.cbor":
      sceneListHandler.generateList(data);
      break;
    default:
      console.log(`Filename is ${filename}`);
  }
}
fileTransfer.init(transferCallback);

messaging.peerSocket.onerror = (err) => {
  console.warn(`Device: socket error ${err.message}`);
  showErrorScr({ errType: "socket" });
};

messaging.peerSocket.addEventListener("message", (evt) => {
  let msg = evt.data;
  statusIcon("none");

  if (msg.status) {
    statusIcon("success");
  }
  if (msg.error) {
    statusIcon("error");
  }
  if (msg.components) {
    statusIcon("success");
    if (statusScr.isVisible)
      statusScr.fillIn(msg.components);
  }
  if (msg.errType) {
    showErrorScr(msg);
  }
});

function sendMsg(msg) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(msg);
  }
}

function statusIcon(state) {
  let header = document.getElementById("header");

  switch (state) {
    case "spinner":
      header.getElementById("spinner").state = "enabled";
      break;
    case "success":
      header.getElementById("check").animate("enable");
      break;
    case "error":
      header.getElementById("x").animate("enable");
      break;
    case "none":
      header.getElementById("spinner").state = "disabled";
      break;
    default:
      console.log("State is not defined!");
      break;
  }

}

function showErrorScr(err) {
  let errScr = document.getElementById("error-screen");
  errScr.getElementById("copy").text = ERRORS[err.errType];
  errScr.animate("enable");
}

function hideErrorScr() {
  document.getElementById("error-screen").animate("disable");
}

function showWaitScr() {
  let waitScr = document.getElementById("wait-screen");
  waitScr.animate("enable");
  waitScr.getElementById("wait-screen-spinner").state = "enabled";
}

function hideWaitScr() {
  let waitScr = document.getElementById("wait-screen");
  waitScr.animate("disable");
  waitScr.getElementById("wait-screen-spinner").state = "disabled";
}

document.onkeypress = (evt) => {
  switch (evt.key) {
    case "back":
      if (!statusScr.isVisible) return;
      statusScr.hide();
      statusScr.reset();
      evt.preventDefault();
      break;
    case "up":
      if (statusScr.isVisible) statusScr.scrollToTop();
      break;
    case "down":
      if (statusScr.isVisible) statusScr.scrollToBottom();
      break;
    default:
      return;
  }
};

showWaitScr();