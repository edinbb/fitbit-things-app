import { inbox } from "file-transfer";

export function init(callback) {
  inbox.onnewfile = () => {
    let filename;   
    while (filename = inbox.nextFile()) {
      console.log(`File ${filename} is processed!`);
      callback(filename);
    }  
  };
}