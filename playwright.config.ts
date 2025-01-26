import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * See https://github.com/motdotla/dotenv
 */
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';
import {printVars} from "./utils/getVars";

// Load the environment variables from the file or from the environment variables
const localEnvPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(localEnvPath)) {
  // Local execution
  console.log(`Getting the email service settings from the file: ${localEnvPath}`);
  dotenv.config({ path: localEnvPath });
  printVars();
} else {
  console.log('There is not ".env.local" file, getting the email service settings from the environment variables');
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: './tests',

  // Each test is given 30 seconds.
  timeout: 30000,

  // Number of retries for each test
  // Retry on CI only.
  // retries: process.env.CI ? 2 : 0,
  retries: 0,

  // Limit the number of workers.
  workers: 1,

  // Reporter to use
  reporter: [['line'], ['allure-playwright']],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',

  use: {
    // Whether to run browser in headless mode
    headless: false,

    // Setting the browser page size
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    },

    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 10000,

    // Recording options
    // Whether to automatically capture a screenshot after each test.
    screenshot: 'only-on-failure',
    // Record trace only when retrying a test for the first time.
    trace: 'on-first-retry',
    // Record video only when retrying a test for the first time (HD quality
    video: { mode: 'on-first-retry', size: { width: 1280, height: 720 } },
  },

  // Run tests on different browsers (Maximized screen)
  projects: [
    // Setup project: Subscribe to the AEMET service getting an API Key
    {
      name: 'AEMET Service',
      testMatch: /global\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // or 'chrome-beta'
        deviceScaleFactor: undefined,
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
    /* Test against desktop browsers */
    //{
    //   name: 'chromium',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     deviceScaleFactor: undefined,
    //     viewport: null,
    //     launchOptions: {
    //       args: ['--start-maximized']
    //     },
    //   }
    // },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     deviceScaleFactor: undefined,
    //     viewport: null,
    //     launchOptions: {
    //       args: ['--start-maximized']
    //     },},
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     deviceScaleFactor: undefined,
    //     viewport: null,
    //     launchOptions: {
    //       args: ['--start-maximized']
    //     },},
    // },
    /* Test against branded browsers. */
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // or 'chrome-beta'
        deviceScaleFactor: undefined,
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
      dependencies: ['AEMET Service'],
    },
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge', // or 'msedge-dev'
    //     deviceScaleFactor: undefined,
    //     viewport: null,
    //     launchOptions: {
    //       args: ['--start-maximized'],
    //     },
    //   },
    //   dependencies: ['Login'],
    // },
  ],
});
