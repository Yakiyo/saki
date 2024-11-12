import { client } from "./mod.ts";

const token = Deno.env.get("TOKEN");

if (!token) {
  console.error("Missing required env variable TOKEN");
  Deno.exit(1);
}

Deno.addSignalListener("SIGINT", () => {
  console.log("Shutting down process...");
  client.destroy();
  Deno.exit();
});

client.login(token);
