/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import { jest, describe, beforeEach, it, expect } from '@jest/globals'

// Mock @actions/core before importing main
const mockInfo = jest.fn()
const mockError = jest.fn()
const mockGetInput = jest.fn()
const mockSetOutput = jest.fn()
const mockSetFailed = jest.fn()

jest.unstable_mockModule('@actions/core', () => ({
  info: mockInfo,
  error: mockError,
  getInput: mockGetInput,
  setOutput: mockSetOutput,
  setFailed: mockSetFailed
}))

const { run } = await import('../src/main.js')

// Other utilities
const timeRegex = /^\d{2}:\d{2}:\d{2}/

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('run the DoRelease action process', async () => {
    // Set the action's inputs as return values from core.getInput()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockGetInput.mockImplementation((name: any) => {
      switch (name) {
        case 'release-version':
          return '0.0.1-test'
        case 'target-environment':
          return 'unit-test'
        default:
          return ''
      }
    })

    await run()

    // Verify that all of the core library functions were called correctly
    expect(mockInfo).toHaveBeenNthCalledWith(
      1,
      'Requested release version: 0.0.1-test'
    )
    expect(mockInfo).toHaveBeenNthCalledWith(2, 'Target environment: unit-test')
    expect(mockSetOutput).toHaveBeenNthCalledWith(
      1,
      'time',
      expect.stringMatching(timeRegex)
    )
    expect(mockSetOutput).toHaveBeenNthCalledWith(
      2,
      'release-status',
      'success'
    )
    expect(mockSetOutput).toHaveBeenNthCalledWith(
      3,
      'target-url',
      'https://example.com'
    )
    expect(mockError).not.toHaveBeenCalled()
  })
})
