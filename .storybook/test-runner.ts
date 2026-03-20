import type { TestRunnerConfig } from '@storybook/test-runner'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot })
  },
  async postVisit(page, context) {
    // Wait for fonts and animations to settle
    await page.waitForTimeout(300)

    const image = await page.screenshot({ fullPage: true })
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: `__visual_snapshots__/${context.id}`,
      customSnapshotIdentifier: context.name,
      failureThreshold: 0.01,
      failureThresholdType: 'percent',
      updatePassedSnapshot: process.env.UPDATE_BASELINES === 'true',
    })
  },
}

export default config
