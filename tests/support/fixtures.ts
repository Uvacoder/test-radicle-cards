import type * as Stream from "node:stream";

import * as Fs from "node:fs/promises";
import * as Path from "node:path";
import { test as base, expect } from "@playwright/test";

import * as logLabel from "@tests/support/logLabel.js";

export { expect };

export const test = base.extend<{
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  forAllTests: void;
  customAppConfig: boolean;
  stateDir: string;
  outputLog: Stream.Writable;
}>({
  customAppConfig: [false, { option: true }],

  forAllTests: [
    async ({ customAppConfig, outputLog, page }, use) => {
      const browserLabel = logLabel.make("browser");
      page.on("console", msg => {
        // Ignore common console logs that we don't care about.
        if (
          msg
            .text()
            .startsWith(
              `Module "buffer" has been externalized for browser compatibility.`,
            ) ||
          msg.text().startsWith("[vite] connected.") ||
          msg.text().startsWith("[vite] connecting...") ||
          msg
            .text()
            .includes("Please make sure it wasn't preloaded for nothing.")
        ) {
          return;
        }
        log(msg.text(), browserLabel, outputLog);
      });

      page.on("pageerror", msg => {
        expect(
          false,
          `Test failed because there was a console error in the app: ${msg}`,
        ).toBeTruthy();
      });

      if (!customAppConfig) {
        // Remember: `page.addInitScript()` is run in the browser which
        // is completely isolated from the test environment, so we don't have
        // access to any variables that we have in the test.
        await page.addInitScript(() => {
          window.APP_CONFIG = {
            walletConnect: {
              bridge: "https://radicle.bridge.walletconnect.org",
            },
            reactions: [],
            seeds: {
              pinned: [{ host: "0.0.0.0", emoji: "🚀" }],
            },
            projects: { pinned: [] },
          };
        });
      }

      const playwrightLabel = logLabel.make("playwright");
      await page.route("**/*", route => {
        if (
          route.request().url().startsWith("http://127.0.0.1") ||
          route.request().url().startsWith("http://localhost") ||
          route.request().url().startsWith("http://0.0.0.0")
        ) {
          return route.continue();
        } else if (
          route
            .request()
            .url()
            .startsWith("https://www.gravatar.com/avatar/") ||
          route.request().url().endsWith(".png")
        ) {
          route.fulfill({
            status: 200,
            path: "./public/favicon.ico",
          });
        } else if (
          route.request().url().startsWith("https://esm.sh/vscode-oniguruma@1")
        ) {
          route.fulfill({
            status: 200,
            path: "./tests/support/onig.wasm",
          });
        } else {
          log(
            `Aborted remote request: ${route.request().url()}`,
            playwrightLabel,
            outputLog,
          );
          return route.abort();
        }
      });

      page.on("websocket", ws => {
        log(`WebSocket opened: ${ws.url()}`, playwrightLabel, outputLog);
        ws.on("framesent", event =>
          log(
            `WebSocket framesent: ${event.payload}`,
            playwrightLabel,
            outputLog,
          ),
        );
        ws.on("framereceived", event =>
          log(
            `WebSocket framereceived: ${event.payload}`,
            playwrightLabel,
            outputLog,
          ),
        );
        ws.on("close", () =>
          log(`WebSocket closed`, playwrightLabel, outputLog),
        );
      });

      await use();
    },
    { scope: "test", auto: true },
  ],

  outputLog: async ({ stateDir }, use) => {
    const logFile = await Fs.open(Path.join(stateDir, "test.log"), "a");
    await use(logFile.createWriteStream());
    await logFile.close();
  },

  // eslint-disable-next-line no-empty-pattern
  stateDir: async ({}, use, testInfo) => {
    const stateDir = testInfo.outputDir;
    await Fs.rm(stateDir, { recursive: true, force: true });
    await Fs.mkdir(stateDir, { recursive: true });

    await use(stateDir);
    if (
      process.env.CI &&
      (testInfo.status === "passed" || testInfo.status === "skipped")
    ) {
      await Fs.rm(stateDir, { recursive: true });
    }
  },
});

function log(text: string, label: string, outputLog: Stream.Writable) {
  const output = text
    .split("\n")
    .map(line => `${label}${line}`)
    .join("\n");

  outputLog.write(`${output}\n`);
  if (!process.env.CI) {
    console.log(output);
  }
}

export function appConfigWithFixture() {
  window.APP_CONFIG = {
    walletConnect: {
      bridge: "https://radicle.bridge.walletconnect.org",
    },
    reactions: [],
    seeds: {
      pinned: [{ host: "0.0.0.0", emoji: "🚀" }],
    },
    projects: {
      pinned: [
        {
          name: "source-browsing",
          id: "rad:zKtT7DmF9H34KkvcKj9PHW19WzjT",
          seed: "0.0.0.0",
        },
      ],
    },
  };
}

export const aliceMainHead = "fcc929424b82984b7cbff9c01d2e20d9b1249842";
export const aliceRemote = "z6MknSLrJoTcukLrE435hVNQT4JUhbvWLX4kUzqkEStBU8Vi";
export const bobRemote =
  "hyyzz9w4ffg16zftjki3enajm4mkqkayb5ch1p6ns3f83np1hqkrp6";
export const rid = "zKtT7DmF9H34KkvcKj9PHW19WzjT";
export const ridPrefix = "rad:";
export const projectFixtureUrl = `/seeds/0.0.0.0/${ridPrefix}${rid}`;
export const seedPort = 8080;
export const seedVersion = "0.1.0";
export const seedRemote = "z6MknSLrJoTcukLrE435hVNQT4JUhbvWLX4kUzqkEStBU8Vi";
