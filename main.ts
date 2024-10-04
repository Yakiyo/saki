import { client } from "./mod.ts";

if (!Deno.env.has("TOKEN")) {
  console.error("Missing required env variable TOKEN");
  Deno.exit(1);
}

client.once("ready", () => {
  console.log(Deno.env.get("PRODUCTION"));
});

Deno.addSignalListener("SIGINT", () => {
  console.log("Shutting down process...");
  client.destroy();
  Deno.exit();
});

client.login(Deno.env.get("TOKEN"));
