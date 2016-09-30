'use strict'

var Github = require('github')

function createRepository (token, name, description, cb) {
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
      console.log('Unable to automatically create repository, does it already exist?')
    }
    cb()
  })
}

module.exports = createRepository
