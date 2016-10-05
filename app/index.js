'use strict'

var util = require('util')
var yeoman = require('yeoman-generator')
var async = require('async')
var inflection = require('inflection')
var Github = require('github')
var Storage = require('yeoman-generator/lib/util/storage')
var path = require('path')
var os = require('os')
var mkdirp = require('mkdirp')
var _ = require('lodash')
var fs = require('fs')
var chalk = require('chalk')

var MsNpmGenerator = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments)
    this.option('--setup')
  },
  initializing: function () {
    this.props = {}
    this.pkg = require('../package.json')
    var storePath = path.join(os.homedir(), '.ms-npm.json')
    this.globalConfig = new Storage('github', this.fs, storePath)
  },
  prompting: function () {
    this.log(chalk.bgBlue('Welcome to the Media Suite npm module generator!'))
    this.log('')

    var prompts = []

    if (!this.globalConfig.get('token')) {
      prompts.push({
        type: 'input',
        name: 'token',
        message: 'Enter github oauth token to create repositories (optional):'
      })
    }

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

    prompts.push({
      type: 'list',
      name: 'repository',
      message: 'Github repository:',
      default: 'I\'ll create one myself',
      choices: ['I\'ll create one myself', 'Please create one for me']
    })

    return this.prompt(prompts).then(function (props) {
      this.log('')
      this.log(chalk.green('info'), 'scaffolding out project structure')
      this.log('')

      this.userValues = props
      this.moduleName = props.moduleName
      this.userValues.moduleNameSlug = inflection.dasherize(props.moduleName)

      var keywords = '["'
      keywords += props.moduleKeywords.split(',').map(function (keyword) {
        return keyword.trim()
      }).join('","')
      keywords += '"]'

      this.userValues.moduleKeywords = keywords

      this.userValues.authorName = this.user.git.name()
      this.userValues.authorEmail = this.user.git.email()

      if (props.token) {
        this.globalConfig.set('token', props.token)
      }
    }.bind(this))
  },
  configuring: {
    projectRoot: function () {
      if (inflection.dasherize(this.appname) !== this.moduleName) {
        mkdirp(this.moduleName)
        this.destinationRoot(this.moduleName)
      }
      mkdirp(path.join(this.destinationPath(), 'src'))
      mkdirp(path.join(this.destinationPath(), 'dist'))
    },
    metafiles: function () {
      var packageTpl = _.template(fs.readFileSync(this.templatePath('_package.json')))
      var readmeTpl = _.template(fs.readFileSync(this.templatePath('_README.md')))

      var packageJson = packageTpl(this.userValues)
      var readme = readmeTpl(this.userValues)

      this.fs.write(path.join(this.destinationPath(), 'package.json'), packageJson)
      this.fs.write(path.join(this.destinationPath(), 'README.md'), readme)

      this.fs.copy(this.templatePath('editorconfig'), path.join(this.destinationPath(), '.editorconfig'))
      this.fs.copy(this.templatePath('gitignore'), path.join(this.destinationPath(), '.gitignore'))
      this.fs.copy(this.templatePath('npmignore'), path.join(this.destinationPath(), '.npmignore'))

      var ci = this.userValues.ci
      if (ci === 'Both') {
        this.fs.copy(this.templatePath('travis.yml'), path.join(this.destinationPath(), '.travis.yml'))
        this.fs.copy(this.templatePath('_circle.yml'), path.join(this.destinationPath(), 'circle.yml'))
      } else if (ci === 'Circle-CI') {
        this.fs.copy(this.templatePath('_circle.yml'), path.join(this.destinationPath(), 'circle.yml'))
      } else if (ci === 'Travis') {
        this.fs.copy(this.templatePath('travis.yml'), path.join(this.destinationPath(), '.travis.yml'))
      }

      this.fs.copy(this.templatePath('_testem.yml'), path.join(this.destinationPath(), 'testem.yml'))
      this.fs.copy(this.templatePath('_LICENSE'), path.join(this.destinationPath(), 'LICENSE'))
    }
  },
  writing: {
    projectfiles: function () {
      this.fs.copy(this.templatePath('_index.js'), path.join(this.destinationPath(), 'src/index.js'))
    },
    testSpec: function () {
      mkdirp(path.join(this.destinationPath(), 'test'))
      this.fs.copy(this.templatePath('test.spec'), path.join(this.destinationPath(), 'test/default.spec.js'))
    }
  },
  install: {
    npmDependencies: function () {
      this.log('')
      this.log(chalk.green('info'), 'installing npm dependencies')
      this.log('')
      this.npmInstall([
        'standard',
        'snazzy',
        'testem',
        'mocha',
        'chai',
        'xyz',
        'projectz',
        'babel-cli',
        'babel-eslint',
        'babel-preset-es2015',
        'github'
      ], { 'saveDev': true })
    }
  },
  end: function () {
    var log = this.log

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

    var respository = this.userValues.repository
    var name = this.moduleName
    var description = this.userValues.moduleDescription
    var token = this.globalConfig.get('token')

    var done = this.async()

    log(chalk.green('info'), 'building out project README.md file')

    this.spawnCommand('npm', ['run', 'readme']).on('close', () => {
      log('')
      log(chalk.green('info'), 'initializing git repository and committing files')
      log('')

      async.eachSeries(gitArgs, spawn, () => {
        if (respository !== 'Please create one for me') return done()

        log('')
        log(chalk.green('info'), 'attempting to create github repository "' + name + '"')

        if (!token) {
          log(chalk.bold.red('error'), 'no github oauth token found, unable to create repository')
          return done()
        }
        var github = new Github({})
        github.authenticate({
          type: 'oauth',
          token: token
        })

        github.repos.create({
          name: name,
          description: description
        }, function (err, res) {
          if (err || res.meta.status !== '201 Created') {
            log(chalk.bold.red('error'), 'unable to automatically create repository, does it already exist?')
            return
          }
          log(chalk.green('info'), 'repository "' + name + '" successfully created')
          done()
        })
      })
    })
  }
})

module.exports = MsNpmGenerator
