#!/usr/bin/env node

'use strict'

const { test } = require('ava')
const execa = require('execa')
const path = require('path')
const rmfr = require('rmfr')

const generatePackage = require('./generate-package')

const tests = [
  {
    name: 'my-test-package',
    author: 'Jinglong',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'Jinglong/my-test-package',
    license: 'MIT',
    manager: 'yarn',
    template: 'default',
    git: true
  },
  {
    name: 'my-test-typescript-package',
    author: 'Jinglong',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'Jinglong/my-test-package',
    license: 'MIT',
    manager: 'yarn',
    template: 'typescript',
    git: true
  },
  {
    name: 'my-test-package',
    author: 'Jinglong',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'Jinglong/my-test-library',
    license: 'MIT',
    manager: 'npm',
    template: 'default',
    git: true
  },
  {
    name: 'my-test-package',
    author: 'nala',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'nala/my-test-typescript-library',
    license: 'MIT',
    manager: 'npm',
    template: 'typescript',
    git: true
  },
  {
    name: '@automagical/jinglong',
    author: 'themodernjavascript',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'themodernjavascript/jinglong',
    license: 'GPL',
    manager: 'yarn',
    template: 'default',
    git: true
  },
  {
    name: 'no-git-package',
    author: 'Jinglong',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'nala/no-git-package',
    license: 'MIT',
    manager: 'yarn',
    template: 'default',
    git: false
  },
  {
    name: 'my-custom-template',
    author: 'Jinglong',
    description: 'this is a auto-generated test module. please ignore.',
    repo: 'jinglong/my-custom-template',
    license: 'GPL',
    manager: 'yarn',
    template: 'custom',
    templatePath: './template/default',
    git: true
  }
]

tests.forEach((opts) => {
  test.serial(`creating "${opts.name}" using ${opts.manager}`, async (t) => {
    console.log(`creating "${opts.name}" using ${opts.manager}...`)
    let ret

    // ensure library is created successfully
    const root = await generatePackage(opts)
    const example = path.join(root, 'example')
    t.truthy(root.indexOf(opts.shortName) >= 0)

    // ensure deps install successfully in root
    ret = await execa.shell(`${opts.manager} install`, { cwd: root })
    t.is(ret.code, 0)

    // ensure root tests pass
    ret = await execa.shell(`${opts.manager} test`, { cwd: root })
    t.is(ret.code, 0)

    // ensure deps install successfully in example
    ret = await execa.shell(`${opts.manager} install`, { cwd: example })
    t.is(ret.code, 0)

    // ensure bundle builds successfully in example
    ret = await execa.shell(`${opts.manager} build`, { cwd: example })
    t.is(ret.code, 0)

    // ensure git is initialized properly
    ret = await execa.shell('git rev-parse --git-dir', { cwd: root })
    t.is(ret.stdout, opts.git ? '.git' : path.join(process.cwd(), '.git'))

    await rmfr(root)
  })
})
