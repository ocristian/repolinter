// Copyright 2017 TODO Group. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

const Result = require('../lib/result')
// eslint-disable-next-line no-unused-vars
const FileSystem = require('../lib/file_system')

function getContent (options) {
  return options['human-readable-content'] !== undefined ? options['human-readable-content'] : options.content
}

/**
 * Check that a list of files does not contain a regular expression.
 *
 * @param {FileSystem} fs A filesystem object configured with filter paths and target directories
 * @param {object} options The rule configuration
 * @returns {Result} The lint rule result
 */
function fileNotContents (fs, options) {
  const files = fs.findAll(options.files)

  if (files.length === 0 && options['fail-on-non-existent']) {
    const message = `not found: (${options.files.join(', ')})`
    return new Result(message, [], false)
  }

  const results = files.map(file => {
    let fileContents = fs.getFileContents(file)
    if (fileContents === undefined) {
      fileContents = ''
    }
    const regexp = new RegExp(options.content, options.flags)

    const passed = fileContents.search(regexp) === 0
    const message = `${passed ? 'Doesn\'t contain' : 'Contains'} ${getContent(options)}`

    return {
      passed,
      path: file,
      message
    }
  })

  const passed = !results.find(r => !r.passed)

  return new Result('', results, passed)
}

module.exports = fileNotContents
