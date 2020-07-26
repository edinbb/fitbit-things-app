import { memory } from "system";

export function init() {
  gr();
  setInterval(gr, 20000); 
}

function gr() {
  console.log("JS memory: " + memory.js.used + "/" + memory.js.peak + "/" + memory.js.total);
  console.log("Native memory: " + memory.native.used + "/" + memory.native.peak + "/" + memory.native.total);
  console.log("Memory pressure: " + memory.monitor.pressure);  
}