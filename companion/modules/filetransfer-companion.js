import { outbox } from "file-transfer";
import * as cbor from 'cbor';

export function send(filename, data) {
  outbox.enqueue(filename, cbor.encode(data)).then((ft) => { 
    console.log(`File ${filename} enqueued in outbox!`); 
  }).catch((err) => { 
    console.warn(`Error during enqueuing: ${err}`);
  });
}