'use strict'

// As node 20 test runner does not support glob patterns in input
// and considering that we could have multiple OS we manually
// resolve the test files and pass them to the test runner

import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { globSync } from 'glob'

const options = {
  pattern: {
    type: 'string',
    short: 'p',
    description: 'Glob pattern to match test files',
    default: 'test/**/*test.js'
  },
  coverage: {
    type: 'boolean',
    short: 'c',
    description: 'Run tests with coverage',
    default: false
  },
  only: {
    type: 'boolean',
    short: 'o',
    description: 'Run only tests marked with { only: true }',
    default: false
  }
}

const { values } = parseArgs({ args: process.argv.slice(2), options })

const pattern = values.pattern
const isCoverage = values.coverage
const runOnly = values.only

const testFiles = globSync(pattern, { absolute: true })

const args = [runOnly ? '--test-only' : '--test', ...testFiles]

let result

// we skip coverage for node 20
// because this issuse happen https://github.com/nodejs/node/pull/53315
if (isCoverage && !process.version.startsWith('v20.')) {
  result = spawnSync(
    'node',
    [
      '--experimental-test-coverage',
      '--test-reporter=lcov',
      '--test-reporter-destination=lcov.info',
      '--test-reporter=spec',
      '--test-reporter-destination=stdout',
      ...args
    ],
    { stdio: 'inherit' }
  )
} else {
  result = spawnSync('node', args, { stdio: 'inherit' })
}

process.exit(result.status)
