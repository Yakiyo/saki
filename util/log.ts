import { Logger } from "@deno-lib/logger";

export const logger = new Logger();

if (Deno.env.get("PRODUCTION")) {
  await logger.initFileLogger("./logs");
}

export function log(...p: unknown[]) {
  logger.error(p);
}
