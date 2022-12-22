import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests/e2e",
  outputDir: "./tests/artifacts",
  timeout: 30_000,
  expect: {
    timeout: 8000,
  },
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  globalSetup: "./tests/support/globalSetup",
  use: {
    actionTimeout: 0,
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
    {
      name: "visual",
      timeout: 60_000,
      expect: {
        timeout: 30_000,
        toHaveScreenshot: {
          threshold: 0.1,
          scale: "device",
          animations: "disabled",
        },
      },
      testDir: "./tests/visual",
      snapshotDir: "./tests/visual/snapshots",
      retries: 0,
      use: {
        ...devices["Desktop Chrome"],
        actionTimeout: 0,
        deviceScaleFactor: 2,
        baseURL: "http://localhost:3000",
        trace: "off",
      },
    },
  ],

  webServer: {
    command: "npm run start",
    port: 3000,
  },
};

export default config;
