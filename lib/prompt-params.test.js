#!/usr/bin/env node

'use strict'

const { test } = require('ava')

const promptParams = require('./prompt-params')

const opts = {
  name: 'my-custom-template',
  author: 'Jinglong',
  description: 'this is a auto-generated test module. please ignore.',
  repo: 'Jinglong/my-custom-template',
  license: 'MIT',
  manager: 'yarn',
  template: 'custom',
  templatePath: './template/default',
  git: true
}

test('passed options are returned when skipPrompts is true', async t => {
  const result = await promptParams(Object.assign({}, opts, { skipPrompts: true }))
  Object.entries(opts).forEach(opt => {
    // console.log(`comparing passed in option ${opt[0]}:${opt[1]} to returned option ${result[opt[0]]}`)
    t.is(opt[1], result[opt[0]])
  })
})
