import { client } from "./mod.ts";
import * as db from "./db/index.ts";

const token = Deno.env.get("TOKEN");

if (!token) {
  console.error("Missing required env variable TOKEN");
  Deno.exit(1);
}

Deno.addSignalListener("SIGINT", async () => {
  console.log("Closing client...");
  await client.destroy();
  console.log("Disconnecting database...");
  await db.disconnect();
  console.log("Shutting down process...");
  Deno.exit();
});

db.connect();
client.login(token);
