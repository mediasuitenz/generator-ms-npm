'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var MsNpmGenerator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('name', {
      desc: 'The name of the npm module, this will be used for publishing to npm',
      required: true
    })

    this.mkdir(this.name)
    this.destinationRoot(this.name)
  },
  initializing: function () {
    this.pkg = require('../package.json');
  },
  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the Media Suite npm module generator!'
    ));

    var prompts = []

    prompts.push({
      type: 'input',
      name: 'moduleDescription',
      message: 'Module description:',
      default: ''
    });

    prompts.push({
      type: 'input',
      name: 'githubOrganizationOrUsername',
      message: 'Github organization or username for repo:',
      default: 'mediasuitenz'
    });

    prompts.push({
      type: 'input',
      name: 'moduleWebsite',
      message: 'Module website:',
      default: 'https://mediasuite.co.nz'
    });

    prompts.push({
      type: 'input',
      name: 'nodeVersion',
      message: 'Node version:',
      default: '>=0.10.0'
    });

    prompts.push({
      type: 'input',
      name: 'moduleKeywords',
      message: 'Keywords (comma separated):',
      default: ''
    });

    this.prompt(prompts, function (props) {
      this.userValues = props;
      this.userValues.moduleName = this.name;

      var keywords = '["';
      keywords += props.moduleKeywords.split(',').map(function(keyword) {
        return keyword.trim()
      }).join('","')
      keywords += '"]';

      this.userValues.moduleKeywords = keywords;

      this.userValues.authorName = this.user.git.name();
      this.userValues.authorEmail = this.user.git.email();

      done();
    }.bind(this));
  },
  configuring: {
    metafiles: function () {
      this.template('_package.json', 'package.json', this.userValues);
      this.template('_README.md', 'README.md', this.userValues);

      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('gitignore', '.gitignore');
      this.src.copy('jshintrc', '.jshintrc');
      this.src.copy('jshintignore', '.jshintignore');
      this.src.copy('npmignore', '.npmignore');
      this.src.copy('travis.yml', '.travis.yml');
      this.src.copy('_circle.yml', 'circle.yml');
      this.src.copy('_testem.yml', 'testem.yml');
      this.src.copy('_LICENSE', 'LICENSE');
    }
  },
  writing: {
    projectfiles: function () {
      this.src.copy('_index.js', 'index.js');
    }
  },
  install: {
    jshint: function() {
      var done = this.async();
      this.npmInstall(['jshint'], { 'saveDev': true }, done)
    },
    testdir: function () {
      this.dest.mkdir('test');
    },
    testem: function() {
      var done = this.async();
      this.npmInstall(['testem'], { 'saveDev': true }, done)
    },
    mocha: function() {
      var done = this.async();
      this.npmInstall(['mocha@~1.20.1'], { 'saveDev': true }, done)
    },
    expect: function() {
      var done = this.async();
      this.npmInstall(['expect'], { 'saveDev': true }, done)
    },
    mochagiven: function() {
      var done = this.async();
      this.npmInstall(['mocha-given'], { 'saveDev': true }, done)
    }
  },
  end: function () {
    this.installDependencies();

    //setup git and git remote
    var remote = util.format(
      'git@github.com:%s/%s.git',
      this.userValues.githubOrganizationOrUsername,
      this.name
    );
    this.spawnCommand('git', ['init'])
      .on('close', function () {
        this.spawnCommand('git', ['remote', 'add', 'origin', remote]);
      }.bind(this));
  }
});

module.exports = MsNpmGenerator;
