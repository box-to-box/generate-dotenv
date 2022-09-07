import * as core from "@actions/core";
import * as dotenv from "dotenv";
import { generateTemplate } from "./template";

export async function prepareEnv({
  template,
}: {
  template: Awaited<ReturnType<typeof generateTemplate>>;
}): Promise<void> {
  core.info("Preparing environment ...");
  const envObject = dotenv.parse(template);
  const missingKeys: string[] = [];
  for (const [, value] of Object.entries(envObject)) {
    if (typeof value === "string" && value.startsWith("$")) {
      const envKey = value.replace(/\${?(.+?)\}?$/, "$1");
      if (!process.env[envKey]) {
        core.warning(`Environment variable ${envKey} is not set`);
        missingKeys.push(envKey);
      }
    }
  }
  if (missingKeys.length) {
    core.setFailed(`Missing environment variables: ${missingKeys.join(", ")}`);
  }
}
