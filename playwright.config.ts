import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  snapshotDir: './e2e/__screenshots__',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',
  timeout: 30_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: 'http://localhost:6007',
    colorScheme: 'dark',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 800, height: 600 },
      },
    },
  ],
  webServer: {
    command: 'pnpm exec http-server storybook-static --port 6007 --silent',
    port: 6007,
    reuseExistingServer: !process.env.CI,
  },
})
