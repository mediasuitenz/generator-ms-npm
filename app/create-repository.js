'use strict'

var Github = require('github')
var os = require('os')
var fs = require('fs')

function createRepository (name, description, cb) {
  var AUTH_TOKEN = ''
  try {
    AUTH_TOKEN = JSON.parse(fs.readFileSync(os.homedir() + '/.generator-ms-npm')).github.AUTH_TOKEN
  } catch (e) {
    console.log('Unable to load github AUTH_TOKEN. ' +
      'Please ensure you have a .generator-ms-npm file in your home directory.' +
      'The files contents should include {"github": {"AUTH_TOKEN": "<auth token string>"}}')
  }

  var github = new Github({})
  github.authenticate({
    type: 'oauth',
    token: AUTH_TOKEN
  })

  github.repos.create({
    name: name,
    description: description
  }, function (err, res) {
    if (err || res.meta.status !== '201 Created') {
      console.log('Unable to automatically create repository, does it already exist?')
    }
    cb()
  })
}

module.exports = createRepository
