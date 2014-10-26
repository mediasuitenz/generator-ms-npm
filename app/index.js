'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var MsNpmGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the Media Suite npm module generator!'
    ));

    // var prompts = [{
    //   type: 'confirm',
    //   name: 'someOption',
    //   message: 'Would you like to enable this option?',
    //   default: true
    // }];

    // this.prompt(prompts, function (props) {
    //   this.someOption = props.someOption;

    //   done();
    // }.bind(this));

    done();
  },
  configuring: {
    metafiles: function () {
      this.src.copy('_package.json', 'package.json');
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('gitignore', '.gitignore');
      this.src.copy('jshintrc', '.jshintrc');
      this.src.copy('jshintignore', '.jshintignore');
      this.src.copy('npmignore', '.npmignore');
      this.src.copy('travis.yml', '.travis.yml');
      this.src.copy('_circle.yml', 'circle.yml');
      this.src.copy('_testem.yml', 'testem.yml');
      this.src.copy('_LICENSE', 'LICENSE');
      this.src.copy('_README.md', 'README.md');
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
      this.npmInstall(['mocha'], { 'saveDev': true }, done)
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
  }
});

module.exports = MsNpmGenerator;
