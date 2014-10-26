linestring-intersect
====================

[![NPM](https://nodei.co/npm/linestring-intersect.png?downloads=true&stars=true)](https://nodei.co/npm/linestring-intersect/)

[![Media Suite](http://mediasuite.co.nz/ms-badge.png)](http://mediasuite.co.nz)

[![Build Status](https://travis-ci.org/mediasuitenz/linestring-intersect.svg)](https://travis-ci.org/mediasuitenz/linestring-intersect)

Determines whether any of the segments of 2 given linestrings intersect

## Description

The module iterates over each of the indices of lineA and uses
[robust segment intersect](https://www.npmjs.org/package/robust-segment-intersect)
to determine if it intersects with any of the indices of lineB. If there is an
intersection detected anywhere, the module will return true, otherwise false.

## Usage Example

```
var intersect = require('linestring-intersect')

var lineA = [
  [172.6747204,-43.5559636],
  [172.6786703,-43.5564511],
  [172.6800085,-43.5565891]
]
var lineB = [
  [172.6732733,-43.5558003],
  [172.6747204,-43.5559636]
]

intersect(lineA, lineB) //true
```
