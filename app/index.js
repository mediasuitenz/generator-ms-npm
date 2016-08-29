'use strict'
var util = require('util')
var yeoman = require('yeoman-generator')
var yosay = require('yosay')
var async = require('async')
var inflection = require('inflection')

var MsNpmGenerator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments)
  },
  initializing: function () {
    this.pkg = require('../package.json')
  },
  prompting: function () {
    var done = this.async()

    this.log(yosay(
      'Welcome to the Media Suite npm module generator!'
    ))

    var prompts = []

    prompts.push({
      type: 'input',
      name: 'moduleName',
      message: 'Module Name(will be used for publishing to NPM):',
      default: inflection.dasherize(this.appname)
    })

    prompts.push({
      type: 'input',
      name: 'moduleDescription',
      message: 'Module description:',
      default: ''
    })

    prompts.push({
      type: 'input',
      name: 'githubOrganizationOrUsername',
      message: 'Github organization or username for repo:',
      default: 'mediasuitenz'
    })

    prompts.push({
      type: 'input',
      name: 'moduleWebsite',
      message: 'Module website:',
      default: 'https://mediasuite.co.nz'
    })

    prompts.push({
      type: 'input',
      name: 'nodeVersion',
      message: 'Node version:',
      default: '>=4.2.0'
    })

    prompts.push({
      type: 'input',
      name: 'moduleKeywords',
      message: 'Keywords (comma separated):',
      default: ''
    })

    prompts.push({
      type: 'list',
      name: 'ci',
      message: 'Add CI?:',
      default: 'None',
      choices: ['None', 'Circle-CI', 'Travis', 'Both']
    })

    this.prompt(prompts, function (props) {
      this.userValues = props
      this.moduleName = props.moduleName

      var keywords = '["'
      keywords += props.moduleKeywords.split(',').map(function (keyword) {
        return keyword.trim()
      }).join('","')
      keywords += '"]'

      this.userValues.moduleKeywords = keywords

      this.userValues.authorName = this.user.git.name()
      this.userValues.authorEmail = this.user.git.email()

      done()
    }.bind(this))
  },
  configuring: {
    projectRoot: function () {
      if (inflection.dasherize(this.appname) !== this.moduleName) {
        this.mkdir(this.moduleName)
        this.destinationRoot(this.moduleName)
      }
    },
    metafiles: function () {
      this.template('_package.json', 'package.json', this.userValues)
      this.template('_README.md', 'README.md', this.userValues)

      this.src.copy('editorconfig', '.editorconfig')
      this.src.copy('gitignore', '.gitignore')
      this.src.copy('npmignore', '.npmignore')

      var ci = this.userValues.ci
      if (ci === 'Both') {
        this.src.copy('travis.yml', '.travis.yml')
        this.src.copy('_circle.yml', 'circle.yml')
      } else if (ci === 'Circle-CI') {
        this.src.copy('_circle.yml', 'circle.yml')
      } else if (ci === 'Travis') {
        this.src.copy('travis.yml', '.travis.yml')
      }

      this.src.copy('_testem.yml', 'testem.yml')
      this.src.copy('_LICENSE', 'LICENSE')
    }
  },
  writing: {
    projectfiles: function () {
      this.src.copy('_index.js', 'index.js')
    },
    testSpec: function () {
      this.dest.mkdir('test')
      this.src.copy('test.spec', 'test/default.spec.js')
    }
  },
  install: {
    npmDependencies: function () {
      var done = this.async()
      this.npmInstall([
        'standard',
        'snazzy',
        'testem',
        'mocha',
        'chai',
        'xyz'
      ], { 'saveDev': true }, done)
    }
  },
  end: function () {
    this.installDependencies({bower: false})

    // setup git and git remote
    var remote = util.format(
      'git@github.com:%s/%s.git',
      this.userValues.githubOrganizationOrUsername,
      this.moduleName
    )

    var gitArgs = [
      ['init'],
      ['remote', 'add', 'origin', remote],
      ['add', '.'],
      ['commit', '-m', '"initial commit"']
    ]

    var spawn = (args, cb) => {
      this.spawnCommand('git', args).on('close', () => {
        cb()
      })
    }

    var done = this.async()
    async.eachSeries(gitArgs, spawn, done)
  }
})

module.exports = MsNpmGenerator
