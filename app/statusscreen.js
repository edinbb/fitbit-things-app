import { CAPABILITIES } from "./capabilities";
import { DEFAULT_STR } from "./constants";

export class StatusScreen {
  constructor(el) {
    this.onaction = undefined;
    this.screenEl = el;
    this.statusItems = el.getElementsByClassName("status-general");
    this.actionBtnItems = el.getElementsByClassName("buttons-action-item");
    this.txtTitle = el.getElementById("title");
    this.btnClose = el.getElementById("btn-close");

    this.btnClose.firstChild.addEventListener("click", (e) => {
      this.hide();
      this.reset();
    });
  }

  get isVisible() {
    return this.screenEl.style.display === "inline";
  }

  scrollToTop() {
    this.screenEl.getElementById("container").value = 0;
  }

  scrollToBottom() {
    this.screenEl.getElementById("container").value = 9;
  }

  show() {
    this.screenEl.animate("enable");
  }

  hide() {
    this.screenEl.animate("disable");
  }

  reset() {
    this.statusItems.forEach(item => {
      let img = item.firstChild;
      let txt = img.nextSibling;
      img.href = "";
      txt.text = "";
    });
    this.actionBtnItems.forEach(item => item.style.display = "none");
    this.screenEl.getElementById("container").value = 0;
  }

  setTitle(name) {
    this.txtTitle.text = name;
  }

  setButtons(deviceId, components) {
    let mainComponent;
    components.forEach(el => {
      if (el.id === "main") {
        mainComponent = el;
      }
    });

    if (!mainComponent) return;

    let cmds = [];
    for (const capability of mainComponent.capabilities) {
      let value = capability.id;
      for (const supported of CAPABILITIES) {
        if (supported.type === value) {
          Array.prototype.push.apply(cmds, supported.commands);
        }
      }
    }

    for (let i = 0; i < this.actionBtnItems.length; i++) {
      const item = this.actionBtnItems[i];
      const cmd1 = cmds[i * 2];
      const cmd2 = cmds[(i * 2) + 1];
      if (!cmd1) break;
      let txt1 = DEFAULT_STR[cmd1.command];
      let txt2 = DEFAULT_STR[cmd2.command];
      txt1 = cmd1.arguments[0] ? `${txt1}, ${cmd1.arguments[0]}%` : txt1;
      txt2 = cmd2.arguments[0] ? `${txt2}, ${cmd2.arguments[0]}%` : txt2;
      let btn1 = item.firstChild;
      let btn2 = btn1.nextSibling;
      btn1.getElementById("text").text = txt1;
      btn2.getElementById("text").text = txt2;
      btn1.onclick = (e) => this.onaction(deviceId, [cmd1]);
      btn2.onclick = (e) => this.onaction(deviceId, [cmd2]);
      item.style.display = "inline";
    }
    this.screenEl.getElementById("container").value = 0; // refresh scrollview el
  }

  isSupported(item) {
    let ret = false;
    let mainComponent;
    item.components.forEach(el => {
      if (el.id === "main") {
        mainComponent = el;
      }
    });

    if (!mainComponent) return ret;

    for (const capability of mainComponent.capabilities) {
      let value = capability.id;
      let supportedTypes = CAPABILITIES.map(x => x.type);
      if (supportedTypes.some(x => x === value)) {
        ret = true;
        break;
      }
    }
    return ret;
  }

  fillIn(data) {
    let main = data.main || {};
    let arr = [];
    for (const capability of CAPABILITIES) {
      let data = main[capability.type];
      if (!data) continue;
      let attributeStatus = data[capability.attribute];
      let str = "";
      for (const state of capability.states) {
        let value = attributeStatus[state] || "";
        if (value === null) continue;
        str += `${DEFAULT_STR[value] || value} `;
      }
      arr.push({ href: capability.image, text: str || "" });
    }

    for (let i = 0; i < this.statusItems.length; i++) {
      const el = this.statusItems[i];
      const data = arr[i];
      if (!data) break;
      let img = el.firstChild;
      let txt = img.nextSibling;
      img.href = data.href;
      txt.text = data.text;
    }
  }
}