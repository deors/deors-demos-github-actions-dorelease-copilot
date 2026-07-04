/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import { jest, describe, it, expect } from '@jest/globals'

// Mock main.run before importing
const mockRun = jest.fn()

jest.unstable_mockModule('../src/main.js', () => ({
  run: mockRun
}))

describe('index', () => {
  it('calls run when imported', async () => {
    await import('../src/index.js')

    expect(mockRun).toHaveBeenCalled()
  })
})
