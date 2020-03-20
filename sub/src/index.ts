// import * as fs from "fs";

// export function onMessage(message: any) {
//   fs.writeFileSync("/tmp/sub.json", message.json, "utf8");
//   console.log(message.json);
// }

// export function log() {
//   console.log(new Date());
// }

import SpiderClient from "spider-client";

const client = new SpiderClient();

client.pushMessage("topic", {
  data: "Hello World"
});
